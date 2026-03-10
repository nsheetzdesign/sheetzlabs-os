-- Migration: 028_booking_reminders.sql
-- Track which reminders have been sent

ALTER TABLE bookings
  ADD COLUMN IF NOT EXISTS reminder_24h_sent BOOLEAN DEFAULT false,
  ADD COLUMN IF NOT EXISTS reminder_1h_sent BOOLEAN DEFAULT false;

-- Index for reminder queries
CREATE INDEX IF NOT EXISTS idx_bookings_reminder_24h
  ON bookings(scheduled_at, reminder_24h_sent)
  WHERE status = 'confirmed' AND reminder_24h_sent = false;

CREATE INDEX IF NOT EXISTS idx_bookings_reminder_1h
  ON bookings(scheduled_at, reminder_1h_sent)
  WHERE status = 'confirmed' AND reminder_1h_sent = false;
