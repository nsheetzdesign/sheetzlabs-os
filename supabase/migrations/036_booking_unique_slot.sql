-- Prompt 51 / BK-1: prevent double-booking at the database level.
-- A partial unique index so two non-cancelled bookings can't share a slot on the
-- same link. The booking handler catches 23505 and returns 409 SLOT_UNAVAILABLE.
CREATE UNIQUE INDEX IF NOT EXISTS idx_bookings_link_slot_active
  ON bookings (booking_link_id, scheduled_at)
  WHERE status != 'cancelled';
