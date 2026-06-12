-- Prompt 54A Part 3: attachment metadata.
--
-- We persist metadata only (filename / type / size / Gmail attachment id), never
-- the bytes — downloads stream straight from Gmail's
-- users.messages.attachments.get on demand. `content_id` links inline `cid:` images
-- in the HTML body to their part so EmailHtmlFrame can resolve them.

CREATE TABLE IF NOT EXISTS email_attachments (
  id                  UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email_id            UUID NOT NULL REFERENCES emails(id) ON DELETE CASCADE,
  filename            TEXT,
  mime_type           TEXT,
  size_bytes          BIGINT,
  gmail_attachment_id TEXT,        -- Gmail body.attachmentId for the fetch
  content_id          TEXT,        -- Content-ID (cid:) for inline images, <> stripped
  part_id             TEXT,        -- MIME partId, stable per message version
  is_inline           BOOLEAN NOT NULL DEFAULT false,
  created_at          TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_email_attachments_email ON email_attachments (email_id);
CREATE INDEX IF NOT EXISTS idx_email_attachments_cid
  ON email_attachments (email_id, content_id)
  WHERE content_id IS NOT NULL;
