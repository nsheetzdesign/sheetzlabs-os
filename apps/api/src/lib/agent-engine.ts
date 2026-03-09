import Anthropic from "@anthropic-ai/sdk";
import type { SupabaseClient } from "@supabase/supabase-js";

interface Agent {
  id: string;
  slug: string;
  system_prompt: string;
  user_prompt_template: string;
  input_sources: string[];
  output_actions: string[];
  model: string;
  max_tokens: number;
}

interface AgentRun {
  id: string;
}

type Env = {
  SUPABASE_URL: string;
  SUPABASE_SERVICE_ROLE_KEY: string;
  ANTHROPIC_API_KEY: string;
  LINKEDIN_ACCESS_TOKEN?: string;
  LINKEDIN_PERSON_ID?: string;
  CLOUDFLARE_BILLING_TOKEN?: string;
  CLOUDFLARE_ACCOUNT_ID?: string;
  SERPER_API_KEY?: string;
  BRAVE_API_KEY?: string;
};

// Agentic loop variant — supports tool use (web_search) before final output
export async function executeAgentWithTools(
  agent: Agent,
  run: AgentRun,
  userInput: Record<string, unknown>,
  env: Env,
  supabase: SupabaseClient
) {
  const startTime = Date.now();

  try {
    const context = await gatherContext(agent.input_sources, supabase, userInput);
    const userPrompt = buildPrompt(agent.user_prompt_template, { ...context, ...userInput });

    const anthropic = new Anthropic({ apiKey: env.ANTHROPIC_API_KEY });

    const tools: Anthropic.Tool[] = [];
    if (agent.output_actions.includes('web_search')) {
      tools.push({
        name: 'web_search',
        description: 'Search the web for information about competitors, market size, pricing, and trends',
        input_schema: {
          type: 'object' as const,
          properties: {
            query: { type: 'string', description: 'Search query' },
          },
          required: ['query'],
        },
      });
    }

    let messages: Anthropic.MessageParam[] = [{ role: 'user', content: userPrompt }];
    let response!: Anthropic.Message;
    const allWebResearch: Array<{ query: string; results: unknown }> = [];
    let totalTokensInput = 0;
    let totalTokensOutput = 0;

    // Agentic loop — continue until no more tool calls
    while (true) {
      response = await anthropic.messages.create({
        model: agent.model,
        max_tokens: agent.max_tokens,
        system: agent.system_prompt,
        tools: tools.length > 0 ? tools : undefined,
        messages,
      });

      totalTokensInput += response.usage.input_tokens;
      totalTokensOutput += response.usage.output_tokens;

      const toolUseBlocks = response.content.filter(
        (b): b is Anthropic.ToolUseBlock => b.type === 'tool_use'
      );

      if (toolUseBlocks.length === 0 || response.stop_reason === 'end_turn') {
        break;
      }

      const toolResults: Anthropic.ToolResultBlockParam[] = [];
      for (const toolUse of toolUseBlocks) {
        if (toolUse.name === 'web_search') {
          const { query } = toolUse.input as { query: string };
          const results = await performWebSearch(query, env);
          allWebResearch.push({ query, results });
          toolResults.push({
            type: 'tool_result',
            tool_use_id: toolUse.id,
            content: JSON.stringify(results),
          });
        }
      }

      messages.push({ role: 'assistant', content: response.content });
      messages.push({ role: 'user', content: toolResults });
    }

    const output = response.content
      .filter((b): b is Anthropic.TextBlock => b.type === 'text')
      .map((b) => b.text)
      .join('\n');

    const costCents = (totalTokensInput * 3 + totalTokensOutput * 15) / 10000;

    const actions = await executeActions(
      agent.output_actions,
      output,
      supabase,
      run.id,
      env,
      userInput,
      { web_research: allWebResearch }
    );

    await supabase
      .from('agent_runs')
      .update({
        status: 'completed',
        output_data: { output, actions, web_research: allWebResearch },
        input_context: context,
        tokens_input: totalTokensInput,
        tokens_output: totalTokensOutput,
        cost_cents: costCents,
        duration_ms: Date.now() - startTime,
        completed_at: new Date().toISOString(),
      })
      .eq('id', run.id);
  } catch (error: unknown) {
    const msg = error instanceof Error ? error.message : String(error);
    await supabase
      .from('agent_runs')
      .update({
        status: 'failed',
        error_message: msg,
        duration_ms: Date.now() - startTime,
        completed_at: new Date().toISOString(),
      })
      .eq('id', run.id);
  }
}

async function performWebSearch(query: string, env: Env): Promise<unknown> {
  if (env.SERPER_API_KEY) {
    const response = await fetch('https://google.serper.dev/search', {
      method: 'POST',
      headers: {
        'X-API-KEY': env.SERPER_API_KEY,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ q: query, num: 10 }),
    });
    const data = await response.json() as Record<string, unknown>;
    return {
      query,
      results: ((data.organic as Array<Record<string, unknown>>) ?? []).map((r) => ({
        title: r.title,
        url: r.link,
        snippet: r.snippet,
      })),
      answerBox: data.answerBox,
      knowledgeGraph: data.knowledgeGraph,
    };
  }

  if (env.BRAVE_API_KEY) {
    const response = await fetch(
      `https://api.search.brave.com/res/v1/web/search?q=${encodeURIComponent(query)}&count=10`,
      {
        headers: {
          'X-Subscription-Token': env.BRAVE_API_KEY,
          Accept: 'application/json',
        },
      }
    );
    const data = await response.json() as Record<string, unknown>;
    const web = data.web as { results?: Array<Record<string, unknown>> } | undefined;
    return {
      query,
      results: (web?.results ?? []).map((r) => ({
        title: r.title,
        url: r.url,
        snippet: r.description,
      })),
    };
  }

  return { query, results: [], error: 'No search API configured' };
}

export async function executeAgent(
  agent: Agent,
  run: AgentRun,
  userInput: Record<string, unknown>,
  env: Env,
  supabase: SupabaseClient
) {
  const startTime = Date.now();

  try {
    const context = await gatherContext(agent.input_sources, supabase, userInput);
    const userPrompt = buildPrompt(agent.user_prompt_template, { ...context, ...userInput });

    const anthropic = new Anthropic({ apiKey: env.ANTHROPIC_API_KEY });

    const response = await anthropic.messages.create({
      model: agent.model,
      max_tokens: agent.max_tokens,
      system: agent.system_prompt,
      messages: [{ role: "user", content: userPrompt }],
    });

    const output =
      response.content[0].type === "text" ? response.content[0].text : "";
    const tokensInput = response.usage.input_tokens;
    const tokensOutput = response.usage.output_tokens;

    // Claude Sonnet 4 pricing: $3/M input, $15/M output
    const costCents = (tokensInput * 3 + tokensOutput * 15) / 10000;

    const actions = await executeActions(agent.output_actions, output, supabase, run.id, env, userInput);

    await supabase
      .from("agent_runs")
      .update({
        status: "completed",
        output_data: { output, actions },
        input_context: context,
        tokens_input: tokensInput,
        tokens_output: tokensOutput,
        cost_cents: costCents,
        duration_ms: Date.now() - startTime,
        completed_at: new Date().toISOString(),
      })
      .eq("id", run.id);
  } catch (error: unknown) {
    const msg = error instanceof Error ? error.message : String(error);
    await supabase
      .from("agent_runs")
      .update({
        status: "failed",
        error_message: msg,
        duration_ms: Date.now() - startTime,
        completed_at: new Date().toISOString(),
      })
      .eq("id", run.id);
  }
}

async function gatherContext(
  sources: string[],
  supabase: SupabaseClient,
  _userInput: Record<string, unknown>
): Promise<Record<string, unknown>> {
  const context: Record<string, unknown> = {};

  for (const source of sources) {
    switch (source) {
      case "ventures": {
        const { data } = await supabase
          .from("ventures")
          .select("id, name, slug, status, stage, domain");
        context.ventures = data;
        break;
      }
      case "revenue": {
        const { data } = await supabase
          .from("revenue")
          .select("*")
          .order("date", { ascending: false })
          .limit(30);
        context.revenue = data;
        break;
      }
      case "tasks": {
        const { data } = await supabase
          .from("tasks")
          .select("*")
          .in("status", ["todo", "in_progress"])
          .order("due_date");
        context.tasks = data;
        break;
      }
      case "relationships": {
        const { data } = await supabase
          .from("relationships")
          .select("*")
          .order("last_contact");
        context.relationships = data;
        break;
      }
      case "pipeline": {
        const { data } = await supabase.from("pipeline").select("*");
        context.pipeline = data;
        break;
      }
      case "expenses": {
        const { data } = await supabase
          .from("expenses")
          .select("*")
          .order("date", { ascending: false })
          .limit(50);
        context.expenses = data;
        break;
      }
      case "knowledge": {
        const { data } = await supabase
          .from("knowledge")
          .select("*")
          .order("created_at", { ascending: false })
          .limit(20);
        context.knowledge = data;
        break;
      }
      case "content_queue": {
        const { data } = await supabase
          .from("content_queue")
          .select("*")
          .in("status", ["draft", "scheduled"])
          .order("scheduled_for");
        context.content_queue = data;
        break;
      }
      case "agent_runs": {
        const { data } = await supabase
          .from("agent_runs")
          .select("id, agent_id, status, trigger_type, tokens_input, tokens_output, cost_cents, duration_ms, created_at")
          .order("created_at", { ascending: false })
          .limit(50);
        context.agent_runs = data;
        break;
      }
      case "emails": {
        const { data } = await supabase
          .from("emails")
          .select("id, subject, from_email, from_name, snippet, ai_category, received_at")
          .order("received_at", { ascending: false })
          .limit(20);
        context.emails = data;
        break;
      }
      case "calendar_events": {
        const now = new Date();
        const weekLater = new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000);

        const { data } = await supabase
          .from("calendar_events")
          .select("id, title, description, location, start_at, end_at, attendees, meeting_link, is_time_block")
          .gte("start_at", now.toISOString())
          .lte("start_at", weekLater.toISOString())
          .order("start_at");
        context.calendar_events = data;
        break;
      }
      case "calendar_today": {
        const todayStart = new Date();
        todayStart.setHours(0, 0, 0, 0);
        const todayEnd = new Date();
        todayEnd.setHours(23, 59, 59, 999);

        const { data } = await supabase
          .from("calendar_events")
          .select("id, title, start_at, end_at, attendees, meeting_link, is_time_block, task_id")
          .gte("start_at", todayStart.toISOString())
          .lte("start_at", todayEnd.toISOString())
          .order("start_at");
        context.calendar_today = data;
        break;
      }
    }
  }

  return context;
}

function buildPrompt(template: string, variables: Record<string, unknown>): string {
  let prompt = template;
  for (const [key, value] of Object.entries(variables)) {
    const placeholder = `{{${key}}}`;
    const stringValue =
      typeof value === "object" ? JSON.stringify(value, null, 2) : String(value ?? "");
    prompt = prompt.replaceAll(placeholder, stringValue);
  }
  return prompt;
}

async function executeActions(
  allowedActions: string[],
  output: string,
  supabase: SupabaseClient,
  runId: string,
  env: Env,
  userInput: Record<string, unknown> = {},
  extraData: Record<string, unknown> = {}
): Promise<unknown[]> {
  const actions: unknown[] = [];
  const actionMatches = output.matchAll(/```action:(\w+)\n([\s\S]*?)```/g);

  for (const match of actionMatches) {
    const actionType = match[1];
    const rawPayload = match[2].trim();

    if (!allowedActions.includes(actionType)) continue;

    let payload: Record<string, unknown>;
    try {
      payload = JSON.parse(rawPayload);
    } catch {
      continue;
    }

    let targetId: string | null = null;
    let externalId: string | null = null;

    switch (actionType) {
      case "create_evaluation": {
        const evaluationPayload = {
          ...payload,
          pipeline_id: userInput.pipeline_id ?? null,
          agent_run_id: runId,
          web_research: extraData?.web_research ?? null,
        };
        const { data: evaluation } = await supabase
          .from('pipeline_evaluations')
          .insert(evaluationPayload)
          .select()
          .single();
        targetId = evaluation?.id ?? null;
        // Update pipeline with latest evaluation
        if (evaluation && userInput.pipeline_id) {
          await supabase
            .from('pipeline')
            .update({ last_evaluation_id: evaluation.id })
            .eq('id', userInput.pipeline_id);
        }
        break;
      }
      case "create_task": {
        const { data } = await supabase.from("tasks").insert(payload).select().single();
        targetId = data?.id ?? null;
        break;
      }
      case "create_knowledge": {
        const { data } = await supabase.from("knowledge").insert(payload).select().single();
        targetId = data?.id ?? null;
        break;
      }
      case "update_relationship": {
        const { data } = await supabase
          .from("relationships")
          .update(payload)
          .eq("id", payload.id)
          .select()
          .single();
        targetId = data?.id ?? null;
        break;
      }
      case "queue_linkedin": {
        const { data } = await supabase
          .from("content_queue")
          .insert({
            platform: "linkedin",
            status: payload.post_now ? "scheduled" : "draft",
            content: payload.content,
            scheduled_for: payload.scheduled_for ?? new Date().toISOString(),
            agent_run_id: runId,
          })
          .select()
          .single();
        targetId = data?.id ?? null;
        break;
      }
      case "post_linkedin": {
        externalId = await postToLinkedIn(payload as { content: string }, env);
        break;
      }
      case "sync_expenses": {
        await syncExpenses(String(payload.provider), env, supabase);
        break;
      }
      case "create_draft": {
        const { data: draft } = await supabase
          .from("email_drafts")
          .insert({
            ...payload,
            agent_run_id: runId,
          })
          .select()
          .single();
        targetId = draft?.id ?? null;
        break;
      }
      case "create_calendar_event": {
        const { data: newCalEvent } = await supabase
          .from("calendar_events")
          .insert({
            ...payload,
            external_id: `agent-${Date.now()}`,
            is_time_block: payload.task_id ? true : false,
          })
          .select()
          .single();
        targetId = newCalEvent?.id ?? null;
        break;
      }
      case "update_task": {
        const { id: updateTaskId, ...taskUpdates } = payload as { id: string } & Record<string, unknown>;
        await supabase.from("tasks").update(taskUpdates).eq("id", updateTaskId);
        targetId = updateTaskId;
        break;
      }
    }

    await supabase.from("agent_actions").insert({
      run_id: runId,
      action_type: actionType,
      target_table: actionType
        .replace("create_", "")
        .replace("update_", "")
        .replace("queue_", "")
        .replace("post_", ""),
      target_id: targetId,
      external_id: externalId,
      payload,
    });

    actions.push({ type: actionType, target_id: targetId, external_id: externalId });
  }

  return actions;
}

export async function postToLinkedIn(
  payload: { content: string },
  env: Env
): Promise<string | null> {
  if (!env.LINKEDIN_ACCESS_TOKEN || !env.LINKEDIN_PERSON_ID) {
    console.warn("LinkedIn credentials not configured");
    return null;
  }

  try {
    const response = await fetch("https://api.linkedin.com/v2/ugcPosts", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${env.LINKEDIN_ACCESS_TOKEN}`,
        "Content-Type": "application/json",
        "X-Restli-Protocol-Version": "2.0.0",
      },
      body: JSON.stringify({
        author: `urn:li:person:${env.LINKEDIN_PERSON_ID}`,
        lifecycleState: "PUBLISHED",
        specificContent: {
          "com.linkedin.ugc.ShareContent": {
            shareCommentary: { text: payload.content },
            shareMediaCategory: "NONE",
          },
        },
        visibility: { "com.linkedin.ugc.MemberNetworkVisibility": "PUBLIC" },
      }),
    });

    if (!response.ok) throw new Error(`LinkedIn API error: ${response.status}`);
    const data = (await response.json()) as { id: string };
    return data.id;
  } catch (error) {
    console.error("LinkedIn post failed:", error);
    return null;
  }
}

async function syncExpenses(provider: string, env: Env, supabase: SupabaseClient) {
  let expenses: Record<string, unknown>[] = [];

  switch (provider) {
    case "cloudflare":
      expenses = await fetchCloudflareExpenses(env);
      break;
    case "supabase":
      expenses = await fetchSupabaseExpenses(env);
      break;
    case "anthropic":
      expenses = await fetchAnthropicExpenses(env);
      break;
    case "openai":
      expenses = await fetchOpenAIExpenses(env);
      break;
  }

  for (const expense of expenses) {
    await supabase.from("expenses").upsert(expense, { onConflict: "external_id" });
  }
}

async function fetchCloudflareExpenses(env: Env): Promise<Record<string, unknown>[]> {
  if (!env.CLOUDFLARE_BILLING_TOKEN || !env.CLOUDFLARE_ACCOUNT_ID) return [];
  try {
    const response = await fetch(
      `https://api.cloudflare.com/client/v4/accounts/${env.CLOUDFLARE_ACCOUNT_ID}/billing/profile`,
      { headers: { Authorization: `Bearer ${env.CLOUDFLARE_BILLING_TOKEN}` } }
    );
    const _data = await response.json();
    return [];
  } catch {
    return [];
  }
}

async function fetchSupabaseExpenses(_env: Env): Promise<Record<string, unknown>[]> {
  return [];
}

async function fetchAnthropicExpenses(_env: Env): Promise<Record<string, unknown>[]> {
  return [];
}

async function fetchOpenAIExpenses(_env: Env): Promise<Record<string, unknown>[]> {
  return [];
}
