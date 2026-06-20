-- 059_repos_overview.sql — Repos & GitHub Actions: per-repo overview cards + self-healing hooks
-- Extends the repos registry so /dashboard/repos can render one card per repo without
-- joins: a denormalized last-run (written in the same webhook + poll upsert path that
-- writes workflow_runs), open issue/PR counts (refreshed in the reconcile tick), and
-- the bookkeeping the discovery cron needs to create webhooks itself (webhook_id +
-- hooked_at) so coverage stays current with zero manual hooks.
-- EXPAND-ONLY. RLS already scoped TO service_role on repos (058) — no change.
--
-- Apply via the IPv4 session pooler (see memory/supabase-psql-pooler.md). No ALTER TYPE
-- here, so this file is transaction-safe; psql autocommit-per-statement (-f default) is fine.

-- ── New columns ───────────────────────────────────────────────────────────────
-- Denormalized last run (cards read these directly off the repos row).
ALTER TABLE repos ADD COLUMN IF NOT EXISTS last_run_status     text;
ALTER TABLE repos ADD COLUMN IF NOT EXISTS last_run_conclusion text;
ALTER TABLE repos ADD COLUMN IF NOT EXISTS last_run_at         timestamptz;
ALTER TABLE repos ADD COLUMN IF NOT EXISTS last_run_url        text;
-- Open issue/PR counts (GitHub counts PRs as issues, so open_issues = open_issues_count − open_prs).
ALTER TABLE repos ADD COLUMN IF NOT EXISTS open_issues     integer NOT NULL DEFAULT 0;
ALTER TABLE repos ADD COLUMN IF NOT EXISTS open_prs        integer NOT NULL DEFAULT 0;
ALTER TABLE repos ADD COLUMN IF NOT EXISTS counts_synced_at timestamptz;
-- ETag triad for the three conditional GETs in the reconcile tick.
ALTER TABLE repos ADD COLUMN IF NOT EXISTS repo_etag  text;  -- GET /repos/{o}/{r}
ALTER TABLE repos ADD COLUMN IF NOT EXISTS pulls_etag text;  -- GET /repos/{o}/{r}/pulls?state=open&per_page=1
ALTER TABLE repos ADD COLUMN IF NOT EXISTS runs_etag  text;  -- GET .../actions/runs (supersedes the 058 `etag`)
-- Self-healing webhook bookkeeping.
ALTER TABLE repos ADD COLUMN IF NOT EXISTS webhook_id bigint;
ALTER TABLE repos ADD COLUMN IF NOT EXISTS hooked_at  timestamptz;

-- ── Backfills ─────────────────────────────────────────────────────────────────
-- 1. Carry the existing runs ETag (058's `etag`) into the renamed `runs_etag`. The old
--    `etag` column is left in place (expand-only); a later contract migration can drop it.
UPDATE repos SET runs_etag = etag WHERE etag IS NOT NULL AND runs_etag IS NULL;

-- 2. Seed last_run_* from the newest already-ingested run per repo so cards aren't blank
--    until the next event. Steady state is maintained by the upsert path going forward.
UPDATE repos r SET
  last_run_status     = lr.status,
  last_run_conclusion = lr.conclusion,
  last_run_at         = lr.run_started_at,
  last_run_url        = lr.html_url
FROM (
  SELECT DISTINCT ON (repo_full_name)
    repo_full_name, status, conclusion, run_started_at, html_url
  FROM workflow_runs
  ORDER BY repo_full_name, run_started_at DESC NULLS LAST
) lr
WHERE r.full_name = lr.repo_full_name;

-- 3. Mark the 9 webhooks already created this session so the discovery cron treats them
--    as hooked (skips them) and never creates a duplicate. Prod-specific values; harmless
--    elsewhere (no matching full_name rows).
UPDATE repos r SET webhook_id = v.hook_id, hooked_at = now()
FROM (VALUES
  ('nsheetzdesign/sheetzlabs-os',         644308473::bigint),
  ('nsheetzdesign/telosi-platform',       644308478::bigint),
  ('nsheetzdesign/saas-factory-template', 644308486::bigint),
  ('nsheetzdesign/envision3-platform',    644308489::bigint),
  ('nsheetzdesign/holix-platform',        644308492::bigint),
  ('nsheetzdesign/nicksheetz',            644308495::bigint),
  ('nsheetzdesign/backofhouse-pro',       644308500::bigint),
  ('nsheetzdesign/holix',                 644308509::bigint),
  ('nsheetzdesign/Pomodoro',              644308510::bigint)
) AS v(full_name, hook_id)
WHERE r.full_name = v.full_name AND r.hooked_at IS NULL;

NOTIFY pgrst, 'reload schema';
