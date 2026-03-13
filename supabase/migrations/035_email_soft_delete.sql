-- Migration: 035_email_soft_delete.sql
-- Track permanently deleted emails from Gmail so they don't reappear after sync

ALTER TABLE emails
  ADD COLUMN IF NOT EXISTS is_deleted BOOLEAN DEFAULT false,
  ADD COLUMN IF NOT EXISTS deleted_at TIMESTAMPTZ;

-- Index for filtering out deleted emails efficiently
CREATE INDEX IF NOT EXISTS idx_emails_not_deleted
  ON emails(account_id, is_deleted)
  WHERE is_deleted = false;
