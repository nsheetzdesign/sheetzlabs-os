-- 060_repos_lastrun_meta.sql — Repos & GitHub Actions: denormalize last-run number + branch
-- Adds the two last-run fields the overview cards still read from the runs list
-- (run number + branch) so cards become self-contained off the repos row and no
-- longer depend on the /github/runs query.
-- EXPAND-ONLY. RLS already scoped TO service_role on repos — no change.
--
-- Apply via the IPv4 session pooler (see memory/supabase-psql-pooler.md). No ALTER TYPE
-- here, so this file is transaction-safe; psql autocommit-per-statement (-f default) is fine.

ALTER TABLE repos ADD COLUMN IF NOT EXISTS last_run_number integer;
ALTER TABLE repos ADD COLUMN IF NOT EXISTS last_run_branch text;

-- Backfill both from the newest run per repo (same source as 059's last_run_* seed).
UPDATE repos r SET
  last_run_number = lr.run_number,
  last_run_branch = lr.head_branch
FROM (
  SELECT DISTINCT ON (repo_full_name)
    repo_full_name, run_number, head_branch
  FROM workflow_runs
  ORDER BY repo_full_name, run_started_at DESC NULLS LAST
) lr
WHERE r.full_name = lr.repo_full_name;

NOTIFY pgrst, 'reload schema';
