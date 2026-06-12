-- Prompt 54A Part 6 + Part 7: per-account folder counts + dead-code drop.
--
-- Part 6 (EU-7): one call returns counts grouped by account so the sidebar's
-- per-account folder badges are correct in every folder view — replacing the
-- "count of the currently-visible page" hack and the hardcoded zeros.
--
-- Part 7 (XC-6): the legacy seed_email_labels_for_account RPC is no longer called
-- (labels now come from Gmail sync). Drop it.

CREATE OR REPLACE FUNCTION get_email_counts_by_account()
RETURNS TABLE (
  account_id uuid,
  inbox bigint,
  starred bigint,
  snoozed bigint,
  drafts bigint,
  spam bigint,
  trash bigint
)
LANGUAGE sql
STABLE
AS $$
  SELECT
    a.id AS account_id,
    COUNT(*) FILTER (
      WHERE e.folder = 'INBOX' AND NOT e.is_archived AND NOT e.is_read
        AND NOT e.is_trashed AND NOT e.is_spam AND NOT e.is_deleted
    ) AS inbox,
    COUNT(*) FILTER (WHERE e.is_starred AND NOT e.is_deleted AND NOT e.is_trashed) AS starred,
    COUNT(*) FILTER (
      WHERE e.snoozed_until IS NOT NULL AND e.snoozed_until > now()
        AND NOT e.is_deleted AND NOT e.is_trashed
    ) AS snoozed,
    COALESCE(d.cnt, 0) AS drafts,
    COUNT(*) FILTER (WHERE e.is_spam AND NOT e.is_deleted AND NOT e.is_trashed) AS spam,
    COUNT(*) FILTER (WHERE e.is_trashed AND NOT e.is_deleted) AS trash
  FROM email_accounts a
  LEFT JOIN emails e ON e.account_id = a.id
  LEFT JOIN (
    SELECT account_id, COUNT(*) AS cnt
    FROM email_drafts
    WHERE status = 'draft'
    GROUP BY account_id
  ) d ON d.account_id = a.id
  GROUP BY a.id, d.cnt;
$$;

DROP FUNCTION IF EXISTS seed_email_labels_for_account(uuid);
