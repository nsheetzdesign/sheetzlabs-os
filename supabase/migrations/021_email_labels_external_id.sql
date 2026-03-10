-- Add external_id to email_labels for storing Gmail label IDs
ALTER TABLE email_labels ADD COLUMN IF NOT EXISTS external_id TEXT;
CREATE INDEX IF NOT EXISTS idx_email_labels_external ON email_labels(external_id);
