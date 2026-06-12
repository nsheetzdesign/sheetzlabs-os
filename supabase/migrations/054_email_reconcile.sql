-- 054_email_reconcile.sql
-- Prompt 59 — Gmail full-state reconciliation (fossil-row repair + observability).
--
-- History sync only moves forward: a label change made on another device during
-- the pre-52A era (when sync ignored label deltas) left local state frozen — e.g.
-- folder='INBOX' for mail Gmail archived months ago. The reconcile engine
-- (lib/email-reconcile.ts) periodically diffs Gmail's authoritative label sets
-- against local rows and repairs the drift.
--
-- Expand-only:
--   last_reconciled_at  — gate for the weekly cron (mirrors last_sync_at).
--   reconcile_cursor    — continuation for a backlog that spans multiple cron
--                         runs within the shared Workers subrequest budget
--                         (mirrors sync_page_token / calendar_accounts.sync_cursor).
--   reconcile_summary   — last run's fix counts {folder_fixed, read_fixed,
--                         starred_fixed, deleted, missing_local} for observability.

ALTER TABLE email_accounts
  ADD COLUMN IF NOT EXISTS last_reconciled_at TIMESTAMPTZ,
  ADD COLUMN IF NOT EXISTS reconcile_cursor JSONB,
  ADD COLUMN IF NOT EXISTS reconcile_summary JSONB;
