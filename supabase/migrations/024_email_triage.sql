-- Migration: 024_email_triage.sql
-- Add triage classification fields to emails table

ALTER TABLE emails
  ADD COLUMN IF NOT EXISTS triage_category TEXT DEFAULT 'other';

ALTER TABLE emails
  ADD COLUMN IF NOT EXISTS triage_confidence FLOAT;

ALTER TABLE emails
  ADD COLUMN IF NOT EXISTS triaged_at TIMESTAMPTZ;

-- Index for efficient filtering by triage category
CREATE INDEX IF NOT EXISTS idx_emails_triage_category
  ON emails(account_id, triage_category);

-- Backfill triage_category from existing ai_category where possible
UPDATE emails SET triage_category = CASE
  WHEN ai_category = 'action_required' THEN 'important'
  WHEN ai_category = 'newsletter'      THEN 'newsletter'
  WHEN ai_category = 'automated'       THEN 'notification'
  WHEN ai_category = 'spam'            THEN 'other'
  ELSE 'other'
END
WHERE triage_category IS NULL OR triage_category = 'other';
