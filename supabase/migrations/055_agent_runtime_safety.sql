-- 055_agent_runtime_safety.sql — Prompt 65B
-- Agent execution & cost safety: run-overlap claim, stuck recovery, terminated-reason
-- visibility, and wiring the (previously dead) agent_performance rollup so the daily
-- spend ceiling + dashboard health indicators have a source. Expand-only.

-- ── Run-overlap claim (AG-B3) ───────────────────────────────────────────
-- A short-lived lease on an agent. The cron/manual launch claims it before a run;
-- a still-claimed agent (claim not yet expired) is skipped instead of double-fired.
ALTER TABLE agents ADD COLUMN IF NOT EXISTS running_until TIMESTAMPTZ;

-- ── Terminated/skip reason on a run (AG-B1/B2/B3) ───────────────────────
-- Why a run stopped short of normal completion: max_iterations | wall_clock |
-- token_budget | daily_budget | already_running | stuck_timeout. NULL = clean run.
ALTER TABLE agent_runs ADD COLUMN IF NOT EXISTS terminated_reason TEXT;

-- Atomic claim: returns the agent id iff it is not currently claimed (or the prior
-- claim has expired — crash recovery for an agent whose run died without releasing).
-- Zero rows back ⇒ another invocation owns it ⇒ caller skips.
CREATE OR REPLACE FUNCTION claim_agent(p_agent_id UUID, p_timeout_seconds INT)
RETURNS UUID
LANGUAGE sql
AS $$
  UPDATE agents
  SET running_until = now() + make_interval(secs => p_timeout_seconds)
  WHERE id = p_agent_id
    AND (running_until IS NULL OR running_until < now())
  RETURNING id;
$$;

-- Release a claim (idempotent — safe to call even if never claimed).
CREATE OR REPLACE FUNCTION release_agent(p_agent_id UUID)
RETURNS VOID
LANGUAGE sql
AS $$
  UPDATE agents SET running_until = NULL WHERE id = p_agent_id;
$$;

-- ── Wire agent_performance (AG-B6 / Part 5) ─────────────────────────────
-- Upsert today's per-agent rollup atomically with running averages. Doubles as the
-- daily spend source: SUM(total_cost) WHERE period_start = CURRENT_DATE across agents.
-- A terminated/partial run counts as NOT success so it shows in runs_failed.
CREATE OR REPLACE FUNCTION record_agent_performance(
  p_agent_id UUID,
  p_success BOOLEAN,
  p_tokens_input INT,
  p_tokens_output INT,
  p_cost NUMERIC,
  p_duration_ms INT,
  p_actions INT
) RETURNS VOID
LANGUAGE plpgsql
AS $$
BEGIN
  IF p_agent_id IS NULL THEN RETURN; END IF;

  INSERT INTO agent_performance (
    agent_id, period_start, period_end,
    runs_total, runs_success, runs_failed,
    avg_duration_ms, avg_tokens_input, avg_tokens_output,
    total_cost, actions_created
  ) VALUES (
    p_agent_id, CURRENT_DATE, CURRENT_DATE,
    1,
    CASE WHEN p_success THEN 1 ELSE 0 END,
    CASE WHEN p_success THEN 0 ELSE 1 END,
    COALESCE(p_duration_ms, 0), COALESCE(p_tokens_input, 0), COALESCE(p_tokens_output, 0),
    COALESCE(p_cost, 0), COALESCE(p_actions, 0)
  )
  ON CONFLICT (agent_id, period_start) DO UPDATE SET
    runs_total   = agent_performance.runs_total + 1,
    runs_success = agent_performance.runs_success + CASE WHEN p_success THEN 1 ELSE 0 END,
    runs_failed  = agent_performance.runs_failed  + CASE WHEN p_success THEN 0 ELSE 1 END,
    avg_duration_ms = (
      (COALESCE(agent_performance.avg_duration_ms, 0) * agent_performance.runs_total) + COALESCE(p_duration_ms, 0)
    ) / (agent_performance.runs_total + 1),
    avg_tokens_input = (
      (COALESCE(agent_performance.avg_tokens_input, 0) * agent_performance.runs_total) + COALESCE(p_tokens_input, 0)
    ) / (agent_performance.runs_total + 1),
    avg_tokens_output = (
      (COALESCE(agent_performance.avg_tokens_output, 0) * agent_performance.runs_total) + COALESCE(p_tokens_output, 0)
    ) / (agent_performance.runs_total + 1),
    total_cost = COALESCE(agent_performance.total_cost, 0) + COALESCE(p_cost, 0),
    actions_created = COALESCE(agent_performance.actions_created, 0) + COALESCE(p_actions, 0);
END;
$$;

-- Make PostgREST expose the new RPCs immediately.
NOTIFY pgrst, 'reload schema';
