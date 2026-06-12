-- Prompt 54B (BK-15): host identity image on the public booking page.
-- All other new availability config (buffer_before, slot increment, daily cap,
-- rolling window, etc.) lives in the existing booking_links.availability_rules
-- JSONB and needs no schema change — this is the only structural addition.
-- Expand-only; safe to re-run.
ALTER TABLE booking_links
  ADD COLUMN IF NOT EXISTS host_image_url TEXT;
