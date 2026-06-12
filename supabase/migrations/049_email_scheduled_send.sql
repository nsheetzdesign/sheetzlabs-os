-- Prompt 54A Part 2: scheduled send + undo send.
--
-- Expand step of an expand-contract rename: the dead `scheduled_for` column from
-- migration 020 was never read by any cron, so we introduce the clearer `send_at`
-- and backfill it. Both columns coexist for one deploy (web + API switch to
-- send_at); a later migration drops scheduled_for once nothing references it.
--
-- The undo-send model reuses this: every normal send is persisted as a
-- status='scheduled' draft with send_at = now()+10s; the every-minute cron claims
-- due scheduled drafts and sends them. Undo flips the row back to status='draft'.

ALTER TABLE email_drafts ADD COLUMN IF NOT EXISTS send_at TIMESTAMPTZ;

UPDATE email_drafts
   SET send_at = scheduled_for
 WHERE send_at IS NULL AND scheduled_for IS NOT NULL;

-- Cron claim query: due scheduled drafts. Partial index keeps it tiny.
CREATE INDEX IF NOT EXISTS idx_email_drafts_scheduled
  ON email_drafts (send_at)
  WHERE status = 'scheduled';
