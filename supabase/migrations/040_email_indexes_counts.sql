-- 040_email_indexes_counts.sql
-- Prompt 52A Part 7 (ES-10 / ES-11): supporting indexes for the hot inbox filters
-- and a single-round-trip counts function to replace the 6 sequential queries.
--
-- Migration 020 already created: idx_emails_account_folder (account_id, folder),
-- idx_emails_archived WHERE is_archived, idx_emails_trashed WHERE is_trashed,
-- idx_emails_snoozed WHERE snoozed_until IS NOT NULL. We add composite/partial
-- indexes the default list/star/unread queries actually use, all scoped to the
-- live (not-deleted) rows.

CREATE INDEX IF NOT EXISTS idx_emails_account_folder_live
  ON emails(account_id, folder)
  WHERE is_deleted = false;

CREATE INDEX IF NOT EXISTS idx_emails_inbox_unread
  ON emails(account_id, is_read)
  WHERE folder = 'INBOX' AND is_deleted = false;

CREATE INDEX IF NOT EXISTS idx_emails_starred_live
  ON emails(account_id)
  WHERE is_starred = true AND is_deleted = false;

CREATE INDEX IF NOT EXISTS idx_emails_snoozed_account
  ON emails(account_id, snoozed_until)
  WHERE snoozed_until IS NOT NULL;

-- Single-round-trip folder counts. p_account_id NULL = all accounts.
-- Mirrors the semantics of the old GET /counts handler but excludes deleted rows
-- everywhere and excludes trashed/deleted/expired from the snoozed count (ES-9).
CREATE OR REPLACE FUNCTION get_email_counts(p_account_id uuid DEFAULT NULL)
RETURNS TABLE (
  inbox   bigint,
  starred bigint,
  snoozed bigint,
  drafts  bigint,
  spam    bigint,
  trash   bigint
) AS $$
BEGIN
  RETURN QUERY
  SELECT
    (SELECT count(*) FROM emails e
       WHERE (p_account_id IS NULL OR e.account_id = p_account_id)
         AND e.is_deleted = false AND e.is_trashed = false AND e.is_spam = false
         AND e.folder = 'INBOX' AND e.is_archived = false AND e.is_read = false),
    (SELECT count(*) FROM emails e
       WHERE (p_account_id IS NULL OR e.account_id = p_account_id)
         AND e.is_deleted = false AND e.is_trashed = false
         AND e.is_starred = true),
    (SELECT count(*) FROM emails e
       WHERE (p_account_id IS NULL OR e.account_id = p_account_id)
         AND e.is_deleted = false AND e.is_trashed = false
         AND e.snoozed_until IS NOT NULL AND e.snoozed_until > now()),
    (SELECT count(*) FROM email_drafts d
       WHERE (p_account_id IS NULL OR d.account_id = p_account_id)
         AND d.status = 'draft'),
    (SELECT count(*) FROM emails e
       WHERE (p_account_id IS NULL OR e.account_id = p_account_id)
         AND e.is_deleted = false AND e.is_trashed = false
         AND e.is_spam = true),
    (SELECT count(*) FROM emails e
       WHERE (p_account_id IS NULL OR e.account_id = p_account_id)
         AND e.is_deleted = false AND e.is_trashed = true);
END;
$$ LANGUAGE plpgsql STABLE;
