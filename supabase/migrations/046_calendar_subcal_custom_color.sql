-- 046_calendar_subcal_custom_color.sql — Prompt 53 Part 6 (CS-11)
-- GET /accounts/:id/calendars used to upsert Google's backgroundColor on every
-- list, clobbering a color the user picked via PATCH /sub-accounts. This flag
-- marks user-customized rows; the list refresh preserves their color (only
-- refreshes name), while non-custom rows still track Google's color.

ALTER TABLE calendar_sub_accounts
  ADD COLUMN IF NOT EXISTS color_is_custom BOOLEAN DEFAULT false;
