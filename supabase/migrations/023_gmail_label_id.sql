-- 023_gmail_label_id.sql
-- Switch email_labels unique key from (account_id, name) to (account_id, external_id)
-- so Gmail labels are reliably identified by their Gmail ID, not display name.

-- Step 1: Backfill external_id for known system labels
UPDATE email_labels SET external_id = 'INBOX'    WHERE name = 'Inbox'    AND (external_id IS NULL OR external_id = '');
UPDATE email_labels SET external_id = 'STARRED'  WHERE name = 'Starred'  AND (external_id IS NULL OR external_id = '');
UPDATE email_labels SET external_id = 'SENT'     WHERE name = 'Sent'     AND (external_id IS NULL OR external_id = '');
UPDATE email_labels SET external_id = 'DRAFT'    WHERE name = 'Drafts'   AND (external_id IS NULL OR external_id = '');
UPDATE email_labels SET external_id = 'SPAM'     WHERE name = 'Spam'     AND (external_id IS NULL OR external_id = '');
UPDATE email_labels SET external_id = 'TRASH'    WHERE name = 'Trash'    AND (external_id IS NULL OR external_id = '');
UPDATE email_labels SET external_id = 'SNOOZED'  WHERE name = 'Snoozed'  AND (external_id IS NULL OR external_id = '');
UPDATE email_labels SET external_id = 'ALL_MAIL' WHERE name = 'All Mail' AND (external_id IS NULL OR external_id = '');

-- Step 2: Any remaining labels without an external_id get name as fallback
UPDATE email_labels SET external_id = name WHERE external_id IS NULL OR external_id = '';

-- Step 3: Drop the name-based unique constraint (added in migration 022)
ALTER TABLE email_labels DROP CONSTRAINT IF EXISTS email_labels_account_id_name_key;

-- Step 4: Add external_id-based unique constraint
ALTER TABLE email_labels
  ADD CONSTRAINT email_labels_account_id_external_id_key
  UNIQUE (account_id, external_id);

-- Step 5: Add Gmail label visibility columns
ALTER TABLE email_labels
  ADD COLUMN IF NOT EXISTS label_list_visibility TEXT DEFAULT 'labelShow';
ALTER TABLE email_labels
  ADD COLUMN IF NOT EXISTS message_list_visibility TEXT DEFAULT 'show';

-- Step 6: Composite index for fast lookup by account + external_id
CREATE INDEX IF NOT EXISTS idx_email_labels_account_external_id
  ON email_labels(account_id, external_id);

-- Step 7: Update the seed function to use external_id
CREATE OR REPLACE FUNCTION seed_email_labels_for_account(p_account_id UUID)
RETURNS void AS $$
BEGIN
  INSERT INTO email_labels (account_id, name, type, icon, sort_order, external_id) VALUES
    (p_account_id, 'Inbox',    'system', 'Inbox',         1,  'INBOX'),
    (p_account_id, 'Starred',  'system', 'Star',          2,  'STARRED'),
    (p_account_id, 'Snoozed',  'system', 'Clock',         3,  'SNOOZED'),
    (p_account_id, 'Sent',     'system', 'Send',          4,  'SENT'),
    (p_account_id, 'Drafts',   'system', 'File',          5,  'DRAFT'),
    (p_account_id, 'Spam',     'system', 'AlertTriangle', 90, 'SPAM'),
    (p_account_id, 'Trash',    'system', 'Trash2',        91, 'TRASH'),
    (p_account_id, 'All Mail', 'system', 'Mail',          92, 'ALL_MAIL')
  ON CONFLICT (account_id, external_id) DO NOTHING;
END;
$$ LANGUAGE plpgsql;
