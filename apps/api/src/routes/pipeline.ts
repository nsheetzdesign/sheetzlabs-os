import { Hono } from "hono";
import { createClient } from "@supabase/supabase-js";
import { executeAgentWithTools } from "../lib/agent-engine";

type Bindings = {
  SUPABASE_URL: string;
  SUPABASE_SERVICE_ROLE_KEY: string;
  ANTHROPIC_API_KEY: string;
  SERPER_API_KEY?: string;
  BRAVE_API_KEY?: string;
};

const pipeline = new Hono<{ Bindings: Bindings }>();

/** POST /pipeline/:id/evaluate — trigger AI evaluation for a pipeline item */
pipeline.post("/:id/evaluate", async (c) => {
  const { id } = c.req.param();
  const supabase = createClient(c.env.SUPABASE_URL, c.env.SUPABASE_SERVICE_ROLE_KEY);

  const { data: item } = await supabase
    .from("pipeline")
    .select("*")
    .eq("id", id)
    .single();

  if (!item) return c.json({ error: "Pipeline item not found" }, 404);

  const { data: agent } = await supabase
    .from("agents")
    .select("*")
    .eq("slug", "idea-evaluator")
    .single();

  if (!agent) return c.json({ error: "Evaluator agent not found" }, 404);

  await supabase
    .from("pipeline")
    .update({ evaluation_requested_at: new Date().toISOString() })
    .eq("id", id);

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

  c.executionCtx.waitUntil(
    executeAgentWithTools(
      agent,
      run,
      {
        idea_name: item.name,
        problem_statement: item.problem_statement ?? item.description ?? "",
        target_market: item.target_market ?? "",
        notes: item.notes ?? "",
        pipeline_id: id,
      },
      c.env,
      supabase
    )
  );

  return c.json({ message: "Evaluation started", run_id: run.id });
});

/** GET /pipeline/:id/evaluations — list all evaluations for a pipeline item */
pipeline.get("/:id/evaluations", async (c) => {
  const { id } = c.req.param();
  const supabase = createClient(c.env.SUPABASE_URL, c.env.SUPABASE_SERVICE_ROLE_KEY);

  const { data, error } = await supabase
    .from("pipeline_evaluations")
    .select("*")
    .eq("pipeline_id", id)
    .order("created_at", { ascending: false });

  if (error) return c.json({ error: error.message }, 500);
  return c.json({ evaluations: data });
});

/** GET /pipeline/:id/evaluation — get latest evaluation */
pipeline.get("/:id/evaluation", async (c) => {
  const { id } = c.req.param();
  const supabase = createClient(c.env.SUPABASE_URL, c.env.SUPABASE_SERVICE_ROLE_KEY);

  const { data, error } = await supabase
    .from("pipeline_evaluations")
    .select("*")
    .eq("pipeline_id", id)
    .order("created_at", { ascending: false })
    .limit(1)
    .maybeSingle();

  if (error) return c.json({ error: error.message }, 500);
  return c.json({ evaluation: data });
});

export default pipeline;
