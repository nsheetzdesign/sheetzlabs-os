-- 057_work_mode.sql — Prompt 67
-- Work-mode (Plan + Work views) data foundation: persisted pomodoro focus sessions,
-- the daily intention/shutdown ritual, and a capture→task provenance link. Plus an
-- atomic increment RPC so a completing work session can roll its elapsed minutes
-- into the linked task's actual_minutes without a read-modify-write race.
-- EXPAND-ONLY.
--
-- Apply via the IPv4 session pooler (see memory/supabase-psql-pooler.md). No
-- ALTER TYPE here, so this file is transaction-safe; psql autocommit-per-statement
-- (the -f default) is fine either way.

-- ============================================================================
-- Part 1.1 — focus_sessions: persisted, cross-device pomodoro.
-- ----------------------------------------------------------------------------
-- The timer's source of truth lives server-side so a reload or another device
-- resumes the SAME running session (remaining is computed from started_at +
-- duration_seconds, never from a client countdown). One running session at a time.
CREATE TABLE IF NOT EXISTS focus_sessions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at timestamptz NOT NULL DEFAULT now(),
  started_at timestamptz NOT NULL DEFAULT now(),
  ended_at timestamptz,
  duration_seconds integer NOT NULL,          -- planned length of this interval
  kind text NOT NULL DEFAULT 'work',          -- work | short_break | long_break
  status text NOT NULL DEFAULT 'running',     -- running | completed | abandoned
  task_id uuid REFERENCES tasks(id) ON DELETE SET NULL,
  time_block_id uuid REFERENCES calendar_events(id) ON DELETE SET NULL,
  pomodoro_index integer NOT NULL DEFAULT 0   -- position in the 4-then-long-break cycle
);

CREATE INDEX IF NOT EXISTS idx_focus_sessions_status ON focus_sessions(status);
CREATE INDEX IF NOT EXISTS idx_focus_sessions_started ON focus_sessions(started_at);

-- ============================================================================
-- Part 1.2 — daily_plans: one row per day (intention + shutdown ritual).
-- ----------------------------------------------------------------------------
-- Upserted on plan_date (unique). Intention drives the "what would make today a
-- win?" field; reflection + shutdown_at are written by the end-of-day shutdown.
CREATE TABLE IF NOT EXISTS daily_plans (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  plan_date date NOT NULL UNIQUE,
  intention text,
  shutdown_at timestamptz,
  reflection text,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

-- ============================================================================
-- Part 1.3 — captures → task provenance link.
-- ----------------------------------------------------------------------------
-- A capture converts to a task; the link records provenance (and lets the UI show
-- "converted"). SET NULL so deleting the task leaves the capture intact.
ALTER TABLE captures
  ADD COLUMN IF NOT EXISTS converted_task_id uuid REFERENCES tasks(id) ON DELETE SET NULL;

-- ============================================================================
-- Part 1.4 — atomic actual_minutes increment.
-- ----------------------------------------------------------------------------
-- Single-statement UPDATE → atomic at the row level; concurrent completing
-- sessions can't lose each other's minutes. This is what makes planned-vs-actual
-- real. SECURITY DEFINER is unnecessary (the API calls it as service_role).
CREATE OR REPLACE FUNCTION increment_task_actual_minutes(p_task_id uuid, p_minutes integer)
RETURNS integer
LANGUAGE sql
AS $$
  UPDATE tasks
  SET actual_minutes = COALESCE(actual_minutes, 0) + GREATEST(p_minutes, 0),
      updated_at = now()
  WHERE id = p_task_id
  RETURNING actual_minutes;
$$;

-- ============================================================================
-- Part 1.5 — RLS aligned with the service-role-via-authed-API posture (matches 056
-- time_block_templates): drop any public grant, scope to service_role only. anon/
-- authenticated fall through to default-deny; the API holds the service-role key
-- (which bypasses RLS) behind the JWT chokepoint + ALLOWED_USER_EMAILS gate.
-- ----------------------------------------------------------------------------
ALTER TABLE focus_sessions ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "service_role full access" ON focus_sessions;
CREATE POLICY "service_role full access" ON focus_sessions
  FOR ALL TO service_role USING (true) WITH CHECK (true);

ALTER TABLE daily_plans ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "service_role full access" ON daily_plans;
CREATE POLICY "service_role full access" ON daily_plans
  FOR ALL TO service_role USING (true) WITH CHECK (true);

NOTIFY pgrst, 'reload schema';
