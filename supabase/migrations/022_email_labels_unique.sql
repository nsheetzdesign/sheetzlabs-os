-- Add unique constraint on (account_id, name) to email_labels
-- Required for upsert operations and to prevent duplicate system labels
ALTER TABLE email_labels
  ADD CONSTRAINT email_labels_account_id_name_key UNIQUE (account_id, name);
