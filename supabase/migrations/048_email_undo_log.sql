-- Prompt 54A Part 1: undo log for reversible inbox actions.
--
-- Optimistic UI fires archive/trash/spam/snooze instantly and shows an "Undo"
-- toast. Undo replays the inverse mutation. The UI passes the affected ids
-- explicitly, but the `z` shortcut (and the e2e probe) call POST /email/undo with
-- an empty body meaning "undo my most recent undoable action" — which requires a
-- small server-side record of what was just done.
--
-- Rows are short-lived breadcrumbs, not an audit trail: each undoable bulk/snooze
-- action inserts one row; undoing marks it undone so it can't be popped twice.

CREATE TABLE IF NOT EXISTS email_undo_actions (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id     UUID NOT NULL,
  action      TEXT NOT NULL,              -- the original action: archive | trash | spam | snooze
  email_ids   UUID[] NOT NULL,            -- the ids that actually changed (the {succeeded} set)
  -- For snooze undo we need the per-email return folder to restore; captured as a
  -- JSON map of email_id -> folder so a bulk snooze can be reversed precisely.
  meta        JSONB,
  created_at  TIMESTAMPTZ NOT NULL DEFAULT now(),
  undone_at   TIMESTAMPTZ
);

-- "Most recent unundone action for this user" — the empty-body undo query.
CREATE INDEX IF NOT EXISTS idx_email_undo_pending
  ON email_undo_actions (user_id, created_at DESC)
  WHERE undone_at IS NULL;
