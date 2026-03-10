-- Add Meet link column to bookings
ALTER TABLE bookings ADD COLUMN IF NOT EXISTS meet_link TEXT;
