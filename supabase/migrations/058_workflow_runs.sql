-- 058_workflow_runs.sql — Repos & GitHub Actions monitoring module
-- Event-log + watched-repo registry for GitHub Actions workflow runs. The API
-- worker ingests `workflow_run` webhooks from ONE org-level hook on nsheetzdesign
-- and reconciles via a poll-with-ETag cron. Two tables:
--   * workflow_runs — one row per GitHub run, upsert-on-change keyed by run_id.
--   * repos         — per-repo poll cursor (etag + last_polled_at). AUTO-REGISTERS:
--                     any workflow_run from an unknown repo inserts a row here.
-- EXPAND-ONLY.
--
-- Apply via the IPv4 session pooler (see memory/supabase-psql-pooler.md). No
-- ALTER TYPE here, so this file is transaction-safe; psql autocommit-per-statement
-- (the -f default) is fine either way.

-- ============================================================================
-- Part 1 — repos: watched-repo registry + poll cursor.
-- ----------------------------------------------------------------------------
-- One row per repository we've seen. Auto-registered by the webhook handler
-- (INSERT ... ON CONFLICT (full_name) DO NOTHING) — no static watched list. The
-- poll-with-ETag cron rotates one repo per tick (ORDER BY last_polled_at ASC),
-- stores page-1's ETag, and replays it as If-None-Match next tick.
CREATE TABLE IF NOT EXISTS repos (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  full_name text NOT NULL UNIQUE,           -- "nsheetzdesign/sheetzlabs-os"
  etag text,                                -- ETag of GET .../actions/runs page 1
  last_polled_at timestamptz,               -- updated on BOTH 304 and 200
  created_at timestamptz NOT NULL DEFAULT now()
);

-- last_polled_at ASC NULLS FIRST → never-polled repos go first, then oldest.
CREATE INDEX IF NOT EXISTS idx_repos_last_polled ON repos(last_polled_at ASC NULLS FIRST);

-- ============================================================================
-- Part 2 — workflow_runs: the event log.
-- ----------------------------------------------------------------------------
-- Denormalized, keyed by GitHub's workflow_run.id (run_id, UNIQUE) so both the
-- webhook and the poll converge on a single idempotent upsert path. `run_updated_at`
-- is GitHub's updated_at — the staleness compare gates the upsert (write only when
-- incoming >= stored). `alerted_at` is an idempotent ntfy claim (mirrors the
-- booking-reminder *_sent_at pattern): the failure alert fires once across a
-- webhook + a poll that both observe the same conclusion.
CREATE TABLE IF NOT EXISTS workflow_runs (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  run_id bigint NOT NULL UNIQUE,            -- GitHub workflow_run.id ← upsert key
  repo_full_name text NOT NULL,             -- "nsheetzdesign/sheetzlabs-os"
  workflow_name text NOT NULL,
  workflow_id bigint,
  run_number integer,
  event text,                               -- push | pull_request | schedule | workflow_dispatch
  head_branch text,
  head_sha text,
  status text NOT NULL,                     -- queued | in_progress | completed
  conclusion text,                          -- success | failure | cancelled | timed_out | null
  actor text,
  html_url text,
  run_started_at timestamptz,
  run_updated_at timestamptz,               -- GitHub updated_at — staleness compare for upsert
  alerted_at timestamptz,                   -- idempotent ntfy claim (mirrors *_sent_at)
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_workflow_runs_repo ON workflow_runs(repo_full_name, run_started_at DESC);
CREATE INDEX IF NOT EXISTS idx_workflow_runs_conclusion ON workflow_runs(conclusion);

-- ============================================================================
-- Part 3 — RLS aligned with the service-role-via-authed-API posture (matches 056/057):
-- scope to service_role only. anon/authenticated fall through to default-deny; the
-- API holds the service-role key (which bypasses RLS) behind the JWT chokepoint +
-- ALLOWED_USER_EMAILS gate. No user_id (single-tenant).
-- ----------------------------------------------------------------------------
ALTER TABLE repos ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "service_role full access" ON repos;
CREATE POLICY "service_role full access" ON repos
  FOR ALL TO service_role USING (true) WITH CHECK (true);

ALTER TABLE workflow_runs ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "service_role full access" ON workflow_runs;
CREATE POLICY "service_role full access" ON workflow_runs
  FOR ALL TO service_role USING (true) WITH CHECK (true);

NOTIFY pgrst, 'reload schema';
