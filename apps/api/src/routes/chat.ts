import { Hono } from "hono";
import { createClient } from "@supabase/supabase-js";
import Anthropic from "@anthropic-ai/sdk";

type Bindings = {
  SUPABASE_URL: string;
  SUPABASE_SERVICE_ROLE_KEY: string;
  ANTHROPIC_API_KEY: string;
};

const chat = new Hono<{ Bindings: Bindings }>();

// ============================================
// CONVERSATIONS
// ============================================

chat.get("/conversations", async (c) => {
  const supabase = createClient(c.env.SUPABASE_URL, c.env.SUPABASE_SERVICE_ROLE_KEY);
  const department = c.req.query("department");
  const archived = c.req.query("archived") === "true";

  let query = supabase
    .from("chat_conversations")
    .select("*, agents(name, slug)")
    .eq("is_archived", archived)
    .order("last_message_at", { ascending: false, nullsFirst: false })
    .limit(50);

  if (department) {
    query = query.eq("department", department);
  }

  const { data } = await query;
  return c.json({ conversations: data });
});

chat.post("/conversations", async (c) => {
  const body = await c.req.json();
  const supabase = createClient(c.env.SUPABASE_URL, c.env.SUPABASE_SERVICE_ROLE_KEY);

  const { data } = await supabase
    .from("chat_conversations")
    .insert({
      title: body.title || "New Conversation",
      department: body.department || null,
      agent_id: body.agent_id || null,
    })
    .select()
    .single();

  return c.json({ conversation: data });
});

chat.get("/conversations/:id", async (c) => {
  const { id } = c.req.param();
  const supabase = createClient(c.env.SUPABASE_URL, c.env.SUPABASE_SERVICE_ROLE_KEY);

  const { data: conversation } = await supabase
    .from("chat_conversations")
    .select("*, agents(name, slug, department)")
    .eq("id", id)
    .single();

  const { data: messages } = await supabase
    .from("chat_messages")
    .select("*")
    .eq("conversation_id", id)
    .order("created_at");

  return c.json({ conversation, messages });
});

chat.delete("/conversations/:id", async (c) => {
  const { id } = c.req.param();
  const supabase = createClient(c.env.SUPABASE_URL, c.env.SUPABASE_SERVICE_ROLE_KEY);

  await supabase.from("chat_conversations").delete().eq("id", id);
  return c.json({ success: true });
});

chat.patch("/conversations/:id/archive", async (c) => {
  const { id } = c.req.param();
  const supabase = createClient(c.env.SUPABASE_URL, c.env.SUPABASE_SERVICE_ROLE_KEY);

  const { data } = await supabase
    .from("chat_conversations")
    .update({ is_archived: true })
    .eq("id", id)
    .select()
    .single();

  return c.json({ conversation: data });
});

// ============================================
// CHAT / SEND MESSAGE
// ============================================

chat.post("/conversations/:id/messages", async (c) => {
  const { id } = c.req.param();
  const { content } = await c.req.json();
  const supabase = createClient(c.env.SUPABASE_URL, c.env.SUPABASE_SERVICE_ROLE_KEY);

  // Get conversation and history
  const { data: conversation } = await supabase
    .from("chat_conversations")
    .select("*, agents(name, slug, department, system_prompt)")
    .eq("id", id)
    .single();

  if (!conversation) {
    return c.json({ error: "Conversation not found" }, 404);
  }

  const { data: history } = await supabase
    .from("chat_messages")
    .select("role, content")
    .eq("conversation_id", id)
    .order("created_at")
    .limit(20);

  // Save user message
  await supabase.from("chat_messages").insert({
    conversation_id: id,
    role: "user",
    content,
  });

  // Build system prompt based on department/agent
  const systemPrompt = buildSystemPrompt(conversation);

  // Get context for the assistant
  const context = await gatherChatContext(conversation.department, supabase);

  // Build messages
  const messages = [
    ...(history || []).map((m: any) => ({ role: m.role as "user" | "assistant", content: m.content })),
    { role: "user" as const, content: `${content}\n\n<context>\n${context}\n</context>` },
  ];

  // Call Claude
  const anthropic = new Anthropic({ apiKey: c.env.ANTHROPIC_API_KEY });

  const response = await anthropic.messages.create({
    model: "claude-sonnet-4-6",
    max_tokens: 2000,
    system: systemPrompt,
    messages,
  });

  const assistantContent =
    response.content[0].type === "text" ? response.content[0].text : "";

  // Calculate cost (~$3/M input, ~$15/M output for Sonnet)
  const inputCost = (response.usage.input_tokens / 1_000_000) * 3;
  const outputCost = (response.usage.output_tokens / 1_000_000) * 15;
  const totalCostCents = (inputCost + outputCost) * 100;

  // Save assistant message
  const { data: assistantMessage } = await supabase
    .from("chat_messages")
    .insert({
      conversation_id: id,
      role: "assistant",
      content: assistantContent,
      model: "claude-sonnet-4-6",
      tokens_input: response.usage.input_tokens,
      tokens_output: response.usage.output_tokens,
      cost_cents: totalCostCents,
    })
    .select()
    .single();

  // Update conversation metadata
  await supabase
    .from("chat_conversations")
    .update({
      message_count: (conversation.message_count || 0) + 2,
      last_message_at: new Date().toISOString(),
      title:
        conversation.title === "New Conversation"
          ? content.slice(0, 50)
          : conversation.title,
    })
    .eq("id", id);

  return c.json({ message: assistantMessage });
});

// ============================================
// QUICK ACTIONS (COMMAND PALETTE)
// ============================================

chat.get("/actions", async (c) => {
  const supabase = createClient(c.env.SUPABASE_URL, c.env.SUPABASE_SERVICE_ROLE_KEY);
  const search = c.req.query("search") || "";

  let query = supabase
    .from("quick_actions")
    .select("*")
    .eq("enabled", true)
    .order("usage_count", { ascending: false });

  if (search) {
    query = query.or(`name.ilike.%${search}%,description.ilike.%${search}%`);
  }

  const { data } = await query;
  return c.json({ actions: data });
});

chat.post("/actions/:id/use", async (c) => {
  const { id } = c.req.param();
  const supabase = createClient(c.env.SUPABASE_URL, c.env.SUPABASE_SERVICE_ROLE_KEY);

  await supabase.rpc("increment_action_usage", { action_id: id });

  return c.json({ success: true });
});

// ============================================
// NATURAL LANGUAGE ROUTING
// ============================================

chat.post("/route", async (c) => {
  const { query } = await c.req.json();
  const supabase = createClient(c.env.SUPABASE_URL, c.env.SUPABASE_SERVICE_ROLE_KEY);

  const { data: actions } = await supabase
    .from("quick_actions")
    .select("id, name, description, action_type, action_data, category")
    .eq("enabled", true);

  const anthropic = new Anthropic({ apiKey: c.env.ANTHROPIC_API_KEY });

  const response = await anthropic.messages.create({
    model: "claude-haiku-4-5-20251001",
    max_tokens: 200,
    system: `You are a command router. Given a natural language query, determine the best action to take.
Available actions:
${actions?.map((a) => `- ${a.name}: ${a.description} (${a.action_type}: ${JSON.stringify(a.action_data)})`).join("\n")}
Respond with JSON only: {"action_id": "uuid", "confidence": 0.0-1.0, "response": "brief explanation"}
If no action matches well, respond: {"action_id": null, "confidence": 0, "response": "I'm not sure what you want to do. Try..."}`,
    messages: [{ role: "user", content: query }],
  });

  const text = response.content[0].type === "text" ? response.content[0].text : "{}";
  const parsed = JSON.parse(text.replace(/```json\n?|\n?```/g, ""));

  let action = null;
  if (parsed.action_id) {
    action = actions?.find((a) => a.id === parsed.action_id) || null;
  }

  return c.json({ ...parsed, action });
});

export default chat;

// ============================================
// HELPERS
// ============================================

function buildSystemPrompt(conversation: any): string {
  const basePrompt = `You are an AI assistant in Sheetz Labs OS, a founder operating system for Nick Sheetz. You help manage ventures, pipeline ideas, relationships, tasks, content, and more.
Current date: ${new Date().toISOString().split("T")[0]}
Be concise, actionable, and operator-minded. Avoid fluff. When relevant, suggest specific actions the user can take.`;

  if (conversation.agents?.system_prompt) {
    return conversation.agents.system_prompt + "\n\n" + basePrompt;
  }

  const deptPrompts: Record<string, string> = {
    executive: `You are the Chief of Staff. You have a bird's eye view of all operations. Help with strategic decisions, prioritization, and coordination across departments.`,
    marketing: `You are the Marketing department. Help with content strategy, LinkedIn posts, newsletter ideas, audience growth, and brand positioning.`,
    product: `You are the Product department. Help evaluate ideas, define MVPs, prioritize features, and think through user workflows.`,
    finance: `You are the Finance department. Help analyze revenue, expenses, runway, pricing, and financial strategy.`,
    research: `You are the Research department. Help gather competitive intelligence, market research, and industry trends.`,
    operations: `You are the Operations department. Help with systems, processes, automation, and efficiency improvements.`,
  };

  const deptPrompt = conversation.department
    ? deptPrompts[conversation.department]
    : deptPrompts.executive;

  return deptPrompt + "\n\n" + basePrompt;
}

async function gatherChatContext(
  department: string | null,
  supabase: ReturnType<typeof createClient<any>>
): Promise<string> {
  const contextParts: string[] = [];

  // Always include ventures summary
  const { data: ventures } = await supabase
    .from("ventures")
    .select("name, tagline, status, stage")
    .eq("status", "active");

  if (ventures?.length) {
    contextParts.push(
      `Active Ventures:\n${ventures.map((v: any) => `- ${v.name}: ${v.tagline} (${v.stage})`).join("\n")}`
    );
  }

  if (department === "finance" || !department) {
    const { data: revenue } = await supabase
      .from("analytics_snapshots")
      .select("total_mrr, total_monthly_expenses, runway_months")
      .order("snapshot_date", { ascending: false })
      .limit(1)
      .single();

    if (revenue) {
      const rev = revenue as any;
      contextParts.push(
        `Financials: MRR $${rev.total_mrr || 0}, Expenses $${rev.total_monthly_expenses || 0}, Runway ${rev.runway_months || "∞"} months`
      );
    }
  }

  if (department === "product" || !department) {
    const { data: pipeline } = await supabase
      .from("pipeline")
      .select("name, stage, score")
      .order("score", { ascending: false })
      .limit(5);

    if (pipeline?.length) {
      contextParts.push(
        `Top Pipeline Ideas:\n${pipeline.map((p: any) => `- ${p.name} (${p.stage}, score: ${p.score || "unscored"})`).join("\n")}`
      );
    }
  }

  if (department === "marketing" || !department) {
    const { data: content } = await supabase
      .from("content")
      .select("title, type, status")
      .in("status", ["draft", "scheduled"])
      .limit(5);

    if (content?.length) {
      contextParts.push(
        `Content Queue:\n${content.map((c: any) => `- ${c.title} (${c.type}, ${c.status})`).join("\n")}`
      );
    }
  }

  if (department === "operations" || !department) {
    const { data: tasks } = await supabase
      .from("tasks")
      .select("title, priority, status")
      .in("status", ["todo", "in_progress"])
      .order("priority", { ascending: false })
      .limit(5);

    if (tasks?.length) {
      contextParts.push(
        `Top Tasks:\n${tasks.map((t: any) => `- ${t.title} (${t.priority}, ${t.status})`).join("\n")}`
      );
    }
  }

  return contextParts.join("\n\n");
}
