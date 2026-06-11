-- 038_email_token_reauth.sql
-- Prompt 52A Part 1 (ES-3 / CS-3): token refresh hardening.
--
-- The shared getValidAccessToken helper now detects an `invalid_grant` (revoked
-- refresh token) and flags the account `needs_reauth` instead of poisoning the row
-- with an undefined token. A `refreshing_until` claim column provides a lightweight
-- mutex so concurrent cron + manual sync don't double-refresh. `sync_page_token`
-- lets the paginated full sync continue across cron runs (ES-7).

ALTER TABLE email_accounts
  ADD COLUMN IF NOT EXISTS needs_reauth BOOLEAN DEFAULT false,
  ADD COLUMN IF NOT EXISTS refreshing_until TIMESTAMPTZ,
  ADD COLUMN IF NOT EXISTS sync_page_token TEXT;

ALTER TABLE calendar_accounts
  ADD COLUMN IF NOT EXISTS needs_reauth BOOLEAN DEFAULT false,
  ADD COLUMN IF NOT EXISTS refreshing_until TIMESTAMPTZ;
