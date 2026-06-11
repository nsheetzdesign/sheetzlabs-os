-- 041_calendar_sync_52b.sql
-- Prompt 52B Parts 1-3: deletion-aware paginated calendar sync, cron, all-day storage.
--
-- 1. calendar_accounts sync bookkeeping
--    52A's shared getValidAccessToken writes `sync_error` to calendar_accounts but
--    the column was never created (the write silently no-op'd). Add it, plus a
--    `sync_status` for the new cron's per-account error recording. The existing
--    `last_sync_at` (migration 013) remains the "last successful sync" timestamp.
ALTER TABLE calendar_accounts
  ADD COLUMN IF NOT EXISTS sync_error TEXT,
  ADD COLUMN IF NOT EXISTS sync_status TEXT,
  -- Continuation point for a paginated sync that ran out of its per-run subrequest
  -- budget (mirrors email_accounts.sync_page_token, ES-7). Holds the calendar IDs
  -- not yet processed this pass plus the frozen [timeMin,timeMax] window; cleared
  -- to NULL on a fully-completed pass. See calendar-sync.ts.
  ADD COLUMN IF NOT EXISTS sync_cursor JSONB;

-- 2. All-day end semantics (CS-4 storage half).
--    Google represents all-day events with date-only start/end where `end.date` is
--    EXCLUSIVE (a single-day event on the 11th has start.date=2026-06-11,
--    end.date=2026-06-12). Storing that verbatim made every all-day event span an
--    extra day. We add a dedicated DATE column holding the INCLUSIVE last day
--    (= end.date − 1 day). Convention, documented here and honored by calendar-sync.ts:
--      • all_day = true  → event covers [date(start_at) .. all_day_end_date] inclusive, date-only
--      • all_day_end_date is NULL for timed events
--    Date-only storage sidesteps the midnight-UTC timezone shift entirely; the
--    rendering half (sticky all-day lane) lands in Prompt 53.
ALTER TABLE calendar_events
  ADD COLUMN IF NOT EXISTS all_day_end_date DATE,
  -- Per-sync reconcile marker (CS-1). Every row touched by a sync pass is stamped
  -- with that pass's timestamp; after a calendar is fully fetched, rows in the
  -- window whose marker is older than the current pass are events that vanished
  -- from Google (deleted/cancelled) and are removed. Avoids a giant NOT IN list.
  ADD COLUMN IF NOT EXISTS last_synced_at TIMESTAMPTZ;

-- Backfill existing all-day rows: end_at was stored as Google's exclusive end at
-- midnight UTC, so the inclusive last day is (end_at::date − 1). Guard against a
-- malformed row where end_at <= start_at by flooring at the start date.
UPDATE calendar_events
SET all_day_end_date = GREATEST(
  (end_at AT TIME ZONE 'UTC')::date - 1,
  (start_at AT TIME ZONE 'UTC')::date
)
WHERE all_day = true AND all_day_end_date IS NULL;

-- 3. The sync upserts on (account_id, external_id). That UNIQUE constraint already
--    exists from migration 013 (`UNIQUE(account_id, external_id)`); documented here
--    so the onConflict target in calendar-sync.ts is traceable. No change needed.
