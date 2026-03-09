-- 015_calendar_sub_accounts.sql
-- Individual Google Calendar sub-calendars per account

CREATE TABLE IF NOT EXISTS calendar_sub_accounts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  account_id UUID REFERENCES calendar_accounts(id) ON DELETE CASCADE,
  external_id TEXT NOT NULL,  -- Google Calendar ID (e.g. "primary", "work@gmail.com")
  name TEXT NOT NULL,
  color TEXT DEFAULT '#2FE8B6',
  is_visible BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT now(),
  UNIQUE(account_id, external_id)
);

CREATE INDEX IF NOT EXISTS idx_calendar_sub_accounts_account ON calendar_sub_accounts(account_id);

ALTER TABLE calendar_sub_accounts ENABLE ROW LEVEL SECURITY;
DO $$ BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE tablename = 'calendar_sub_accounts' AND policyname = 'Allow all for service role'
  ) THEN
    CREATE POLICY "Allow all for service role" ON calendar_sub_accounts FOR ALL USING (true);
  END IF;
END $$;

-- Link events to their sub-calendar (populated on next sync)
ALTER TABLE calendar_events ADD COLUMN IF NOT EXISTS sub_account_id UUID REFERENCES calendar_sub_accounts(id);
