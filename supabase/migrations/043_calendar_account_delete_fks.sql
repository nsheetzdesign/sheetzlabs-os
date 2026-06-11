-- 043_calendar_account_delete_fks.sql
-- Prompt 52B Part 4 (CS-9): account deletion should preserve historical bookings.
--
-- Migration 027 created bookings.calendar_account_id with the default NO ACTION FK,
-- so deleting a calendar account fails outright once any booking references it — the
-- old route swallowed that error and returned {success:true} while leaving the
-- account (and its plaintext tokens) behind. We switch the two booking FKs to
-- ON DELETE SET NULL so a deleted account/link nulls the reference and the booking
-- survives as a historical record. The route still guards active (future,
-- non-cancelled) bookings with a 409 before deleting.

DO $$
BEGIN
  -- bookings.calendar_account_id → SET NULL
  IF EXISTS (
    SELECT 1 FROM information_schema.table_constraints
    WHERE constraint_name = 'bookings_calendar_account_id_fkey'
      AND table_name = 'bookings'
  ) THEN
    ALTER TABLE bookings DROP CONSTRAINT bookings_calendar_account_id_fkey;
  END IF;
  ALTER TABLE bookings
    ADD CONSTRAINT bookings_calendar_account_id_fkey
    FOREIGN KEY (calendar_account_id) REFERENCES calendar_accounts(id) ON DELETE SET NULL;

  -- bookings.booking_link_id → SET NULL (was ON DELETE CASCADE; preserve history)
  IF EXISTS (
    SELECT 1 FROM information_schema.table_constraints
    WHERE constraint_name = 'bookings_booking_link_id_fkey'
      AND table_name = 'bookings'
  ) THEN
    ALTER TABLE bookings DROP CONSTRAINT bookings_booking_link_id_fkey;
  END IF;
  ALTER TABLE bookings
    ADD CONSTRAINT bookings_booking_link_id_fkey
    FOREIGN KEY (booking_link_id) REFERENCES booking_links(id) ON DELETE SET NULL;
END $$;
