-- Migration: 025_email_snippets_templates.sql

-- Email snippets (per-user text expansions)
CREATE TABLE IF NOT EXISTS email_snippets (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  trigger TEXT NOT NULL,
  title TEXT NOT NULL,
  content TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id, trigger)
);

CREATE INDEX IF NOT EXISTS idx_email_snippets_user_trigger ON email_snippets(user_id, trigger);

-- Default snippet templates (shared, seeded once)
CREATE TABLE IF NOT EXISTS email_snippet_defaults (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  trigger TEXT NOT NULL UNIQUE,
  title TEXT NOT NULL,
  content TEXT NOT NULL
);

INSERT INTO email_snippet_defaults (trigger, title, content) VALUES
  ('sig',      'Signature',       E'Best,\nNick Sheetz\nFounder, Sheetz Labs\nsheetzlabs.com'),
  ('intro',    'Introduction',    E'Hi there,\n\nI hope this email finds you well. I wanted to reach out because'),
  ('followup', 'Follow Up',       E'Hi,\n\nJust following up on my previous email. Let me know if you have any questions or would like to schedule a call.'),
  ('thanks',   'Thank You',       E'Thank you so much for your time. I really appreciate it.'),
  ('meeting',  'Meeting Request', E'Would you be available for a quick call this week? Here are a few times that work for me:\n\n- \n- \n- \n\nLet me know what works best for you.')
ON CONFLICT (trigger) DO NOTHING;

-- Email templates (saved full email templates per user)
CREATE TABLE IF NOT EXISTS email_templates (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  subject TEXT,
  body TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_email_templates_user ON email_templates(user_id);
