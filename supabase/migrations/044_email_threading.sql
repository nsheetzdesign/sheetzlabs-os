-- 044_email_threading.sql — Prompt 53 Part 2 (EC-1)
-- Capture the RFC Message-ID (and References chain) so replies can set
-- In-Reply-To/References and thread correctly in the recipient's client.
-- No backfill: messages synced before this get their Message-ID fetched on-demand
-- the first time the user replies (send handler -> messages.get format=metadata).

ALTER TABLE emails ADD COLUMN IF NOT EXISTS rfc_message_id TEXT;
ALTER TABLE emails ADD COLUMN IF NOT EXISTS rfc_references TEXT;

-- Speeds up the on-demand "find original by id then persist Message-ID" path.
CREATE INDEX IF NOT EXISTS idx_emails_rfc_message_id ON emails(rfc_message_id);
