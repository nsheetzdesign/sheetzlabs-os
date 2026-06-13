-- 056_time_boxing_foundation.sql — Prompt 66
-- Time-boxing data foundation: the unified planning `tasks` model, time-block task
-- links on `calendar_events`, and the two triage one-liners. EXPAND-ONLY.
--
-- NOTE: apply via the IPv4 session pooler (see memory/supabase-psql-pooler.md).
-- psql runs each statement in its own autocommit transaction (no BEGIN in this
-- file), which is REQUIRED: `ALTER TYPE ... ADD VALUE` cannot be used in the same
-- transaction it is added in, and must commit before the new value is referenced.

-- ============================================================================
-- Part 1.1 — Triage one-liner: tighten `time_block_templates` RLS.
-- ----------------------------------------------------------------------------
-- The original policy was `FOR ALL USING (true)` with no role target, i.e. it
-- granted full access to *every* role including `anon` (platform-triage.md:77,146).
-- The app's posture is service-role-via-authed-API: the API holds the service-role
-- key (which BYPASSES RLS) and the JWT chokepoint + ALLOWED_USER_EMAILS gate the
-- caller. So the correct tightening is to drop the public grant and scope the
-- policy to `service_role` only — anon/authenticated fall through to default-deny,
-- while the API's service-role access (the sole existing access path) is unchanged.
DROP POLICY IF EXISTS "Allow all for service role" ON time_block_templates;
CREATE POLICY "service_role full access" ON time_block_templates
  FOR ALL TO service_role USING (true) WITH CHECK (true);

-- ============================================================================
-- Part 2 — `tasks`: the planning primitive.
-- ----------------------------------------------------------------------------
-- Reconcile the existing table (001_initial_schema + 007 milestone_id) with the
-- time-boxing target shape. Additive only; existing columns (title, description,
-- priority, status, due_date, completed_at, venture_id, created_at, updated_at,
-- milestone_id) are kept so the current task routes keep working.

-- Status enum: keep all existing values (backlog/todo/in-progress/review/done/
-- blocked) for backward compat and ADD the two Sunsama-flow values. Expand-only —
-- removing enum values is not safe, so we superset instead.
ALTER TYPE task_status ADD VALUE IF NOT EXISTS 'planned';
ALTER TYPE task_status ADD VALUE IF NOT EXISTS 'cancelled';

-- estimated_minutes is also the Part 1.2 triage one-liner (scheduler ground-truth
-- block length); actual_minutes feeds planned-vs-actual later.
ALTER TABLE tasks ADD COLUMN IF NOT EXISTS estimated_minutes integer;
ALTER TABLE tasks ADD COLUMN IF NOT EXISTS actual_minutes integer;
-- planned_date is the core Sunsama field — the day a task is slotted into.
ALTER TABLE tasks ADD COLUMN IF NOT EXISTS planned_date date;
-- sort_order: manual ordering within a day/list.
ALTER TABLE tasks ADD COLUMN IF NOT EXISTS sort_order integer DEFAULT 0;
-- ticket_id: a PLAIN reference to an agent-owned ticket (NOT a promote/copy). The
-- ticket stays agent-owned; deleting it must NOT delete the task → ON DELETE SET NULL.
ALTER TABLE tasks ADD COLUMN IF NOT EXISTS ticket_id uuid;

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint WHERE conname = 'tasks_ticket_id_fkey'
  ) THEN
    ALTER TABLE tasks
      ADD CONSTRAINT tasks_ticket_id_fkey
      FOREIGN KEY (ticket_id) REFERENCES tickets(id) ON DELETE SET NULL;
  END IF;
END $$;

CREATE INDEX IF NOT EXISTS idx_tasks_planned ON tasks(planned_date, sort_order);
CREATE INDEX IF NOT EXISTS idx_tasks_venture ON tasks(venture_id);
CREATE INDEX IF NOT EXISTS idx_tasks_ticket ON tasks(ticket_id);

-- ============================================================================
-- Part 3 — time blocks live in `calendar_events` (is_time_block = true).
-- ----------------------------------------------------------------------------
-- DECISION (documented): time blocks already live in `calendar_events` with the
-- `is_time_block` flag + a `task_id` backlink, and the drag-to-block + calendar
-- rendering pipeline (apps/api calendar.ts, apps/web calendar) is built around it.
-- A dedicated `time_blocks` table would fork that pipeline for no benefit, so we
-- keep blocks in `calendar_events` (the lighter path) — raw freeform blocks set
-- is_time_block=true with task_id NULL; task-linked blocks set task_id.
--
-- The only gap vs the spec: the existing `task_id` FK has no delete rule, so
-- deleting a task would fail (RESTRICT) instead of leaving the block as raw time.
-- Recreate it with ON DELETE SET NULL.
ALTER TABLE calendar_events DROP CONSTRAINT IF EXISTS calendar_events_task_id_fkey;
ALTER TABLE calendar_events
  ADD CONSTRAINT calendar_events_task_id_fkey
  FOREIGN KEY (task_id) REFERENCES tasks(id) ON DELETE SET NULL;

NOTIFY pgrst, 'reload schema';
