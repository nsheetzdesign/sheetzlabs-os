import { createClient } from "@supabase/supabase-js";
import { executeAgent, postToLinkedIn } from "./lib/agent-engine";

type Env = {
  SUPABASE_URL: string;
  SUPABASE_SERVICE_ROLE_KEY: string;
  ANTHROPIC_API_KEY: string;
  LINKEDIN_ACCESS_TOKEN: string;
  LINKEDIN_PERSON_ID: string;
  CLOUDFLARE_BILLING_TOKEN: string;
  CLOUDFLARE_ACCOUNT_ID: string;
};

export default {
  async scheduled(event: ScheduledEvent, env: Env, ctx: ExecutionContext) {
    const supabase = createClient(env.SUPABASE_URL, env.SUPABASE_SERVICE_ROLE_KEY);

    // Run scheduled agents
    const { data: agentsData } = await supabase
      .from("agents")
      .select("*")
      .eq("enabled", true)
      .not("schedule", "is", null);

    const now = new Date(event.scheduledTime);

    for (const agent of agentsData ?? []) {
      if (shouldRunNow(agent.schedule as string, now)) {
        const { data: run } = await supabase
          .from("agent_runs")
          .insert({
            agent_id: agent.id,
            agent_name: agent.name,
            status: "running",
            trigger_type: "scheduled",
            started_at: now.toISOString(),
          })
          .select()
          .single();

        if (run) {
          ctx.waitUntil(executeAgent(agent, run, {}, env, supabase));
        }
      }
    }

    // Post scheduled content queue items
    const { data: scheduledPosts } = await supabase
      .from("content_queue")
      .select("*")
      .eq("status", "scheduled")
      .lte("scheduled_for", now.toISOString());

    for (const post of scheduledPosts ?? []) {
      ctx.waitUntil(postScheduledContent(post, env, supabase));
    }
  },
};

async function postScheduledContent(
  post: { id: string; content: string; platform: string },
  env: Env,
  supabase: ReturnType<typeof createClient<any>>
) {
  try {
    let externalId: string | null = null;

    if (post.platform === "linkedin") {
      externalId = await postToLinkedIn({ content: post.content }, env);
    }

    await supabase
      .from("content_queue")
      .update({
        status: externalId ? "posted" : "failed",
        posted_at: externalId ? new Date().toISOString() : null,
        external_id: externalId,
      })
      .eq("id", post.id);
  } catch {
    await supabase
      .from("content_queue")
      .update({ status: "failed" })
      .eq("id", post.id);
  }
}

function shouldRunNow(cronExpr: string, now: Date): boolean {
  const [min, hour, day, month, weekday] = cronExpr.split(" ");

  const matches = (expr: string, value: number) => {
    if (expr === "*") return true;
    if (expr.includes("/")) {
      const [, step] = expr.split("/");
      return value % parseInt(step) === 0;
    }
    return parseInt(expr) === value;
  };

  return (
    matches(min, now.getUTCMinutes()) &&
    matches(hour, now.getUTCHours()) &&
    matches(day, now.getUTCDate()) &&
    matches(month, now.getUTCMonth() + 1) &&
    matches(weekday, now.getUTCDay())
  );
}
