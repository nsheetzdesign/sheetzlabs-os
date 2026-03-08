import { Hono } from "hono";
import { createClient } from "@supabase/supabase-js";
import { executeAgent, postToLinkedIn } from "../lib/agent-engine";

type Bindings = {
  ENVIRONMENT: string;
  SUPABASE_URL: string;
  SUPABASE_SERVICE_ROLE_KEY: string;
  ANTHROPIC_API_KEY: string;
  LINKEDIN_ACCESS_TOKEN: string;
  LINKEDIN_PERSON_ID: string;
  CLOUDFLARE_BILLING_TOKEN: string;
  CLOUDFLARE_ACCOUNT_ID: string;
};

const agents = new Hono<{ Bindings: Bindings }>();

/** GET /agents — list all agents, grouped by department */
agents.get("/", async (c) => {
  const supabase = createClient(c.env.SUPABASE_URL, c.env.SUPABASE_SERVICE_ROLE_KEY);

  const { data, error } = await supabase
    .from("agents")
    .select("*")
    .order("department")
    .order("name");

  if (error) return c.json({ error: error.message }, 500);

  const grouped = (data ?? []).reduce<Record<string, typeof data>>(
    (acc, agent) => {
      if (!acc[agent.department]) acc[agent.department] = [];
      acc[agent.department].push(agent);
      return acc;
    },
    {}
  );

  return c.json({ agents: data, byDepartment: grouped });
});

/** GET /agents/departments/summary — department stats */
agents.get("/departments/summary", async (c) => {
  const supabase = createClient(c.env.SUPABASE_URL, c.env.SUPABASE_SERVICE_ROLE_KEY);

  const { data: agentsData } = await supabase
    .from("agents")
    .select("department, id, name, enabled");

  const { data: recentRuns } = await supabase
    .from("agent_runs")
    .select("agent_id, status, created_at")
    .not("agent_id", "is", null)
    .order("created_at", { ascending: false })
    .limit(100);

  const departments = [
    "executive",
    "marketing",
    "product",
    "finance",
    "research",
    "operations",
  ] as const;

  const summary = departments.map((dept) => {
    const deptAgents = (agentsData ?? []).filter((a) => a.department === dept);
    const deptAgentIds = new Set(deptAgents.map((a) => a.id));
    const deptRuns = (recentRuns ?? []).filter((r) =>
      r.agent_id ? deptAgentIds.has(r.agent_id) : false
    );

    return {
      department: dept,
      agent_count: deptAgents.length,
      enabled_count: deptAgents.filter((a) => a.enabled).length,
      last_run: deptRuns[0]?.created_at ?? null,
      recent_status: deptRuns[0]?.status ?? null,
    };
  });

  return c.json({ departments: summary });
});

/** GET /agents/content/queue — content queue */
agents.get("/content/queue", async (c) => {
  const supabase = createClient(c.env.SUPABASE_URL, c.env.SUPABASE_SERVICE_ROLE_KEY);
  const status = c.req.query("status");

  let query = supabase.from("content_queue").select("*").order("scheduled_for");
  if (status) query = query.eq("status", status);

  const { data, error } = await query;
  if (error) return c.json({ error: error.message }, 500);
  return c.json({ queue: data });
});

/** POST /agents/content/queue/:id/post — manually post queued item */
agents.post("/content/queue/:id/post", async (c) => {
  const { id } = c.req.param();
  const supabase = createClient(c.env.SUPABASE_URL, c.env.SUPABASE_SERVICE_ROLE_KEY);

  const { data: item } = await supabase
    .from("content_queue")
    .select("*")
    .eq("id", id)
    .single();

  if (!item) return c.json({ error: "Not found" }, 404);

  if (item.platform === "linkedin") {
    c.executionCtx.waitUntil(postQueuedItem(item, c.env, supabase));
  }

  return c.json({ message: "Posting initiated" });
});

/** GET /agents/:slug — agent detail with recent runs */
agents.get("/:slug", async (c) => {
  const { slug } = c.req.param();
  const supabase = createClient(c.env.SUPABASE_URL, c.env.SUPABASE_SERVICE_ROLE_KEY);

  const { data: agent } = await supabase
    .from("agents")
    .select("*")
    .eq("slug", slug)
    .single();

  if (!agent) return c.json({ error: "Agent not found" }, 404);

  const { data: runs } = await supabase
    .from("agent_runs")
    .select("*, agent_actions(*)")
    .eq("agent_id", agent.id)
    .order("created_at", { ascending: false })
    .limit(10);

  return c.json({ agent, runs });
});

/** POST /agents/:slug/run — manually trigger an agent */
agents.post("/:slug/run", async (c) => {
  const { slug } = c.req.param();
  const body = await c.req.json().catch(() => ({}));
  const supabase = createClient(c.env.SUPABASE_URL, c.env.SUPABASE_SERVICE_ROLE_KEY);

  const { data: agent } = await supabase
    .from("agents")
    .select("*")
    .eq("slug", slug)
    .single();

  if (!agent) return c.json({ error: "Agent not found" }, 404);
  if (!agent.enabled) return c.json({ error: "Agent is disabled" }, 400);

  const { data: run } = await supabase
    .from("agent_runs")
    .insert({
      agent_id: agent.id,
      agent_name: agent.name,
      status: "running",
      trigger_type: "manual",
      started_at: new Date().toISOString(),
    })
    .select()
    .single();

  if (!run) return c.json({ error: "Failed to create run" }, 500);

  c.executionCtx.waitUntil(executeAgent(agent, run, body, c.env, supabase));

  return c.json({ message: "Agent run started", run_id: run.id });
});

/** PATCH /agents/:slug — update agent config */
agents.patch("/:slug", async (c) => {
  const { slug } = c.req.param();
  const body = await c.req.json();
  const supabase = createClient(c.env.SUPABASE_URL, c.env.SUPABASE_SERVICE_ROLE_KEY);

  const { data, error } = await supabase
    .from("agents")
    .update(body)
    .eq("slug", slug)
    .select()
    .single();

  if (error) return c.json({ error: error.message }, 500);
  return c.json({ agent: data });
});

/** Legacy: POST /agents/runs — n8n compat */
agents.post("/runs", async (c) => {
  const body = await c.req.json();
  const supabase = createClient(c.env.SUPABASE_URL, c.env.SUPABASE_SERVICE_ROLE_KEY);

  const { data, error } = await supabase
    .from("agent_runs")
    .insert({
      agent_name: body.agent_name,
      trigger_type: body.trigger_type ?? null,
      status: body.status ?? "running",
      input_data: body.input_data ?? null,
      output_data: body.output_data ?? null,
      error_message: body.error_message ?? null,
      tokens_used: body.tokens_used ?? null,
      duration_ms: body.duration_ms ?? null,
      started_at: new Date().toISOString(),
      completed_at:
        body.status && body.status !== "running" ? new Date().toISOString() : null,
    })
    .select("id")
    .single();

  if (error) return c.json({ error: error.message }, 500);
  return c.json({ success: true, id: data?.id }, 201);
});

/** Legacy: PATCH /agents/runs/:id — n8n compat */
agents.patch("/runs/:id", async (c) => {
  const id = c.req.param("id");
  const body = await c.req.json();
  const supabase = createClient(c.env.SUPABASE_URL, c.env.SUPABASE_SERVICE_ROLE_KEY);

  const { error } = await supabase
    .from("agent_runs")
    .update({
      status: body.status,
      output_data: body.output_data ?? null,
      error_message: body.error_message ?? null,
      tokens_used: body.tokens_used ?? null,
      duration_ms: body.duration_ms ?? null,
      completed_at: new Date().toISOString(),
    })
    .eq("id", id);

  if (error) return c.json({ error: error.message }, 500);
  return c.json({ success: true });
});

/** Legacy: GET /agents/runs — list runs */
agents.get("/runs", async (c) => {
  const supabase = createClient(c.env.SUPABASE_URL, c.env.SUPABASE_SERVICE_ROLE_KEY);
  const limit = Math.min(parseInt(c.req.query("limit") ?? "50"), 200);

  const { data, error } = await supabase
    .from("agent_runs")
    .select("*")
    .order("started_at", { ascending: false })
    .limit(limit);

  if (error) return c.json({ error: error.message }, 500);
  return c.json({ runs: data });
});

async function postQueuedItem(
  item: { id: string; content: string },
  env: Bindings,
  supabase: ReturnType<typeof createClient<any>>
) {
  try {
    const externalId = await postToLinkedIn({ content: item.content }, env);

    await supabase
      .from("content_queue")
      .update({
        status: externalId ? "posted" : "failed",
        posted_at: externalId ? new Date().toISOString() : null,
        external_id: externalId,
      })
      .eq("id", item.id);
  } catch {
    await supabase
      .from("content_queue")
      .update({ status: "failed" })
      .eq("id", item.id);
  }
}

export default agents;
