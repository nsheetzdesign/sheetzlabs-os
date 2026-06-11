-- Prompt 51B / XC-2: user-bound OAuth state for authenticated initiation.
-- OAuth is now started from the authenticated app: the start endpoint inserts a
-- single-use nonce bound to the founder's user id, and the public Google callback
-- validates + deletes it (single-use, 10-min TTL). This replaces the old HttpOnly
-- `state` cookie, which the cross-subdomain callback couldn't rely on and which let
-- anyone complete the flow and link their own account into the single-tenant DB.
-- Expired rows are swept by the scheduled worker.
CREATE TABLE IF NOT EXISTS oauth_states (
  nonce TEXT PRIMARY KEY,
  user_id UUID NOT NULL,
  provider TEXT NOT NULL,
  expires_at TIMESTAMPTZ NOT NULL,
  created_at TIMESTAMPTZ DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_oauth_states_expires_at ON oauth_states(expires_at);

-- Service-role only (no row-level access); the API worker is the sole reader/writer.
ALTER TABLE oauth_states ENABLE ROW LEVEL SECURITY;
