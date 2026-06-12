-- 047_booking_drop_requires_confirmation.sql — Prompt 53 Part 7 (BK-7)
-- The requires_confirmation flag was a half-built pending state: pending bookings
-- still got "Confirmed" emails + a calendar invite and could never be approved
-- (no approval endpoint ever existed). The create handler now always sets
-- status='confirmed' and no code reads this column. Expand-contract: the
-- tolerant code (already deployed in this prompt) no longer references it, so the
-- column is safe to drop.

ALTER TABLE booking_links DROP COLUMN IF EXISTS requires_confirmation;
