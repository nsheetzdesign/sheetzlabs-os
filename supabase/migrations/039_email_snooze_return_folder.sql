-- 039_email_snooze_return_folder.sql
-- Prompt 52A Part 5 (ES-9): snooze remembers the folder it came from, and the
-- unsnooze restore now runs in TypeScript (so it can write back to Gmail per row).
-- The old unconditional `unsnooze_emails()` RPC is replaced and dropped.

ALTER TABLE emails
  ADD COLUMN IF NOT EXISTS snooze_return_folder TEXT;

DROP FUNCTION IF EXISTS unsnooze_emails();
