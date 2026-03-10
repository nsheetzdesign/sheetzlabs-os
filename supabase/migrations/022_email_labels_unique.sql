-- Add unique constraint on (account_id, name) to email_labels
-- Required for upsert operations and to prevent duplicate system labels
-- Wrapped in DO block to be idempotent (constraint may already exist from migration 020)
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint
    WHERE conname = 'email_labels_account_id_name_key'
  ) THEN
    ALTER TABLE email_labels
      ADD CONSTRAINT email_labels_account_id_name_key UNIQUE (account_id, name);
  END IF;
END $$;
