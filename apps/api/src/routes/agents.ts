import { Hono } from "hono";
import { getSupabaseClient } from "../lib/supabase";

type Bindings = {
  ENVIRONMENT: string;
  SUPABASE_URL: string;
  SUPABASE_SERVICE_ROLE_KEY: string;
};

const agents = new Hono<{ Bindings: Bindings }>();

/** POST /agents/runs — n8n calls this to create a new run */
agents.post("/runs", async (c) => {
  const body = await c.req.json();
  const supabase = getSupabaseClient(c.env);

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
      completed_at:
        body.status && body.status !== "running"
          ? new Date().toISOString()
          : null,
    })
    .select("id")
    .single();

  if (error) return c.json({ error: error.message }, 500);

  return c.json({ success: true, id: data?.id }, 201);
});

/** PATCH /agents/runs/:id — update run status/output when it finishes */
agents.patch("/runs/:id", async (c) => {
  const id = c.req.param("id");
  const body = await c.req.json();
  const supabase = getSupabaseClient(c.env);

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

/** GET /agents/runs — list runs (useful for quick checks) */
agents.get("/runs", async (c) => {
  const supabase = getSupabaseClient(c.env);
  const limit = Math.min(parseInt(c.req.query("limit") ?? "50"), 200);

  const { data, error } = await supabase
    .from("agent_runs")
    .select("*")
    .order("started_at", { ascending: false })
    .limit(limit);

  if (error) return c.json({ error: error.message }, 500);

  return c.json({ runs: data });
});

export default agents;
