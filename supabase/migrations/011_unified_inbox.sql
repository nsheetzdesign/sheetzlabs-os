-- 011_unified_inbox.sql
-- Email accounts (supports multiple Gmail accounts)
CREATE TABLE email_accounts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email TEXT NOT NULL UNIQUE,
  provider TEXT DEFAULT 'gmail',
  access_token TEXT,
  refresh_token TEXT,
  token_expires_at TIMESTAMPTZ,
  sync_enabled BOOLEAN DEFAULT true,
  last_sync_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Email messages (cached locally)
CREATE TABLE emails (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  account_id UUID REFERENCES email_accounts(id) ON DELETE CASCADE,
  external_id TEXT NOT NULL,
  thread_id TEXT,

  subject TEXT,
  snippet TEXT,
  from_email TEXT,
  from_name TEXT,
  to_emails TEXT[],
  cc_emails TEXT[],
  bcc_emails TEXT[],

  body_text TEXT,
  body_html TEXT,

  labels TEXT[],
  is_read BOOLEAN DEFAULT false,
  is_starred BOOLEAN DEFAULT false,
  is_draft BOOLEAN DEFAULT false,
  has_attachments BOOLEAN DEFAULT false,

  ai_category TEXT, -- 'action_required', 'fyi', 'newsletter', 'automated', 'spam'
  ai_priority TEXT, -- 'high', 'medium', 'low'
  ai_summary TEXT,
  relationship_id UUID REFERENCES relationships(id),

  received_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT now(),

  UNIQUE(account_id, external_id)
);

-- Email drafts
CREATE TABLE email_drafts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  account_id UUID REFERENCES email_accounts(id),
  reply_to_email_id UUID REFERENCES emails(id),

  to_emails TEXT[],
  cc_emails TEXT[],
  subject TEXT,
  body_text TEXT,
  body_html TEXT,

  agent_run_id UUID REFERENCES agent_runs(id),

  status TEXT DEFAULT 'draft', -- 'draft', 'sending', 'sent', 'failed'
  sent_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Indexes
CREATE INDEX idx_emails_account ON emails(account_id);
CREATE INDEX idx_emails_thread ON emails(thread_id);
CREATE INDEX idx_emails_received ON emails(received_at DESC);
CREATE INDEX idx_emails_category ON emails(ai_category);
CREATE INDEX idx_emails_from ON emails(from_email);
CREATE INDEX idx_emails_relationship ON emails(relationship_id);
CREATE INDEX idx_email_drafts_account ON email_drafts(account_id);

-- RLS
ALTER TABLE email_accounts ENABLE ROW LEVEL SECURITY;
ALTER TABLE emails ENABLE ROW LEVEL SECURITY;
ALTER TABLE email_drafts ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow all for service role" ON email_accounts FOR ALL USING (true);
CREATE POLICY "Allow all for service role" ON emails FOR ALL USING (true);
CREATE POLICY "Allow all for service role" ON email_drafts FOR ALL USING (true);
