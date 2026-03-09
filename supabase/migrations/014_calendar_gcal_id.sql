-- Add google_calendar_id to track which sub-calendar each event belongs to
ALTER TABLE calendar_events ADD COLUMN IF NOT EXISTS google_calendar_id TEXT;
