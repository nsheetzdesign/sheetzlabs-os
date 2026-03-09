-- 020_inbox_gmail_features.sql
-- ============================================
-- EMAIL LABELS (System + Custom)
-- ============================================
CREATE TABLE email_labels (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  account_id UUID REFERENCES email_accounts(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  color TEXT DEFAULT '#2FE8B6',
  type TEXT DEFAULT 'user', -- 'system' or 'user'
  icon TEXT, -- lucide icon name
  sort_order INTEGER DEFAULT 100,
  is_visible BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT now(),
  UNIQUE(account_id, name)
);
-- ============================================
-- EMAIL-LABEL ASSIGNMENTS (Many-to-Many)
-- ============================================
CREATE TABLE email_label_assignments (
  email_id UUID REFERENCES emails(id) ON DELETE CASCADE,
  label_id UUID REFERENCES email_labels(id) ON DELETE CASCADE,
  assigned_at TIMESTAMPTZ DEFAULT now(),
  PRIMARY KEY (email_id, label_id)
);
-- ============================================
-- EXTEND EMAILS TABLE
-- ============================================
ALTER TABLE emails ADD COLUMN IF NOT EXISTS folder TEXT DEFAULT 'INBOX';
ALTER TABLE emails ADD COLUMN IF NOT EXISTS is_archived BOOLEAN DEFAULT false;
ALTER TABLE emails ADD COLUMN IF NOT EXISTS is_trashed BOOLEAN DEFAULT false;
ALTER TABLE emails ADD COLUMN IF NOT EXISTS is_spam BOOLEAN DEFAULT false;
ALTER TABLE emails ADD COLUMN IF NOT EXISTS snoozed_until TIMESTAMPTZ;
ALTER TABLE emails ADD COLUMN IF NOT EXISTS thread_id TEXT;
ALTER TABLE emails ADD COLUMN IF NOT EXISTS snippet TEXT;
ALTER TABLE emails ADD COLUMN IF NOT EXISTS has_attachments BOOLEAN DEFAULT false;
ALTER TABLE emails ADD COLUMN IF NOT EXISTS attachment_count INTEGER DEFAULT 0;
-- ============================================
-- EXTEND EMAIL_ACCOUNTS FOR SYNC
-- ============================================
ALTER TABLE email_accounts ADD COLUMN IF NOT EXISTS last_history_id TEXT;
ALTER TABLE email_accounts ADD COLUMN IF NOT EXISTS sync_status TEXT DEFAULT 'idle'; -- 'idle', 'syncing', 'error'
ALTER TABLE email_accounts ADD COLUMN IF NOT EXISTS sync_error TEXT;
ALTER TABLE email_accounts ADD COLUMN IF NOT EXISTS full_sync_completed BOOLEAN DEFAULT false;
-- ============================================
-- EMAIL DRAFTS EXTEND
-- ============================================
ALTER TABLE email_drafts ADD COLUMN IF NOT EXISTS is_minimized BOOLEAN DEFAULT false;
ALTER TABLE email_drafts ADD COLUMN IF NOT EXISTS last_auto_saved_at TIMESTAMPTZ;
ALTER TABLE email_drafts ADD COLUMN IF NOT EXISTS scheduled_for TIMESTAMPTZ;
-- ============================================
-- INDEXES
-- ============================================
CREATE INDEX IF NOT EXISTS idx_email_labels_account ON email_labels(account_id);
CREATE INDEX IF NOT EXISTS idx_email_labels_type ON email_labels(type);
CREATE INDEX IF NOT EXISTS idx_email_label_assignments_email ON email_label_assignments(email_id);
CREATE INDEX IF NOT EXISTS idx_email_label_assignments_label ON email_label_assignments(label_id);
CREATE INDEX IF NOT EXISTS idx_emails_archived ON emails(is_archived) WHERE is_archived = true;
CREATE INDEX IF NOT EXISTS idx_emails_trashed ON emails(is_trashed) WHERE is_trashed = true;
CREATE INDEX IF NOT EXISTS idx_emails_snoozed ON emails(snoozed_until) WHERE snoozed_until IS NOT NULL;
CREATE INDEX IF NOT EXISTS idx_emails_thread ON emails(thread_id);
CREATE INDEX IF NOT EXISTS idx_emails_account_folder ON emails(account_id, folder);
-- ============================================
-- RLS
-- ============================================
ALTER TABLE email_labels ENABLE ROW LEVEL SECURITY;
ALTER TABLE email_label_assignments ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Allow all for service role" ON email_labels FOR ALL USING (true);
CREATE POLICY "Allow all for service role" ON email_label_assignments FOR ALL USING (true);
-- ============================================
-- FUNCTION: Seed system labels for new account
-- ============================================
CREATE OR REPLACE FUNCTION seed_email_labels_for_account(p_account_id UUID)
RETURNS void AS $$
BEGIN
  INSERT INTO email_labels (account_id, name, type, icon, sort_order) VALUES
    (p_account_id, 'Inbox', 'system', 'Inbox', 1),
    (p_account_id, 'Starred', 'system', 'Star', 2),
    (p_account_id, 'Snoozed', 'system', 'Clock', 3),
    (p_account_id, 'Sent', 'system', 'Send', 4),
    (p_account_id, 'Drafts', 'system', 'File', 5),
    (p_account_id, 'Spam', 'system', 'AlertTriangle', 90),
    (p_account_id, 'Trash', 'system', 'Trash2', 91),
    (p_account_id, 'All Mail', 'system', 'Mail', 92)
  ON CONFLICT (account_id, name) DO NOTHING;
END;
$$ LANGUAGE plpgsql;
-- ============================================
-- FUNCTION: Unsnooze emails (called by cron)
-- ============================================
CREATE OR REPLACE FUNCTION unsnooze_emails()
RETURNS INTEGER AS $$
DECLARE
  affected INTEGER;
BEGIN
  UPDATE emails
  SET snoozed_until = NULL, folder = 'INBOX'
  WHERE snoozed_until IS NOT NULL
    AND snoozed_until <= now();

  GET DIAGNOSTICS affected = ROW_COUNT;
  RETURN affected;
END;
$$ LANGUAGE plpgsql;
