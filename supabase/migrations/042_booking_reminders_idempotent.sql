-- 042_booking_reminders_idempotent.sql
-- Prompt 52B Parts 5-6: idempotent reminder claims + calendar-sync failure flag.
--
-- BK-6: the boolean reminder flags (migration 028) cannot express an atomic claim —
-- "send then set true" duplicates on overlapping cron runs and marks Resend failures
-- as sent. Replace them with nullable TIMESTAMPTZ "claimed/sent at" columns. The
-- reminder pipeline claims a row with
--   UPDATE ... SET reminder_24h_sent_at = now() WHERE id = $1 AND reminder_24h_sent_at IS NULL RETURNING id
-- and clears it back to NULL if the send fails, so the next run retries.

ALTER TABLE bookings
  ADD COLUMN IF NOT EXISTS reminder_24h_sent_at TIMESTAMPTZ,
  ADD COLUMN IF NOT EXISTS reminder_1h_sent_at TIMESTAMPTZ,
  -- BK-9/BK-12: marks a booking whose Google Calendar mutation (create/delete/patch)
  -- failed while the DB state change succeeded — surfaced as a badge in the UI.
  ADD COLUMN IF NOT EXISTS calendar_sync_failed BOOLEAN DEFAULT false;

-- Backfill: a previously-sent boolean reminder becomes a non-null timestamp so it
-- is never re-sent. We don't know the original send time, so stamp now().
UPDATE bookings SET reminder_24h_sent_at = now()
  WHERE reminder_24h_sent = true AND reminder_24h_sent_at IS NULL;
UPDATE bookings SET reminder_1h_sent_at = now()
  WHERE reminder_1h_sent = true AND reminder_1h_sent_at IS NULL;

-- Drop the boolean-era indexes, then the columns themselves (all TS references move
-- to the *_at columns in this prompt).
DROP INDEX IF EXISTS idx_bookings_reminder_24h;
DROP INDEX IF EXISTS idx_bookings_reminder_1h;

ALTER TABLE bookings
  DROP COLUMN IF EXISTS reminder_24h_sent,
  DROP COLUMN IF EXISTS reminder_1h_sent;

-- Selection indexes for the claim queries: unclaimed, confirmed reminders by time.
CREATE INDEX IF NOT EXISTS idx_bookings_reminder_24h_at
  ON bookings (scheduled_at)
  WHERE status = 'confirmed' AND reminder_24h_sent_at IS NULL;

CREATE INDEX IF NOT EXISTS idx_bookings_reminder_1h_at
  ON bookings (scheduled_at)
  WHERE status = 'confirmed' AND reminder_1h_sent_at IS NULL;
