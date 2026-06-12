-- Prompt 57 (NS-BK-1/2): per-booking management token kills "UUID-as-bearer".
--
-- Until now the only credential guarding a public booking's PII + cancel/reschedule
-- authority was the row's primary key (a v4 UUID). Anyone the guest forwarded the
-- link to had full mutate authority. We add an independent 32-byte random token; the
-- public detail/cancel/reschedule/.ics endpoints now require `?token=` to match
-- (constant-time) and 404 on mismatch, so the UUID alone no longer returns PII or
-- permits mutation. Authenticated host endpoints are unaffected (JWT-gated).
--
-- Expand-only + idempotent. `gen_random_bytes` needs pgcrypto (present on Supabase).

CREATE EXTENSION IF NOT EXISTS pgcrypto;

ALTER TABLE bookings
  ADD COLUMN IF NOT EXISTS management_token TEXT;

-- Backfill existing FUTURE, non-cancelled bookings so their already-sent manage
-- links keep working once enforcement turns on. Past/cancelled bookings are left
-- null (nothing actionable to protect; their endpoints simply 404 without a token).
UPDATE bookings
  SET management_token = encode(gen_random_bytes(32), 'hex')
  WHERE management_token IS NULL
    AND status <> 'cancelled'
    AND scheduled_at > now();

-- ── Atomic create with race-free daily cap (NS-SLOT-2) ───────────────────────
-- The old path read `count(bookings on day)` then inserted in a separate statement,
-- so two concurrent bookings for DIFFERENT slots on a capped day could both observe
-- cap-1 and both insert, overrunning max_bookings_per_day (the unique index only
-- guards the exact-slot collision). This function serializes per (link, day) via a
-- transaction-scoped advisory lock, re-counts under the lock, then inserts — so the
-- cap and the insert share one transaction boundary. Raises:
--   * 'DAILY_CAP_EXCEEDED' (errcode P0001) when the day is full
--   * 23505 (unique_violation) when the exact slot was just taken
-- both of which the caller maps to 409.
CREATE OR REPLACE FUNCTION create_booking_atomic(
  p_booking_link_id     UUID,
  p_calendar_account_id UUID,
  p_guest_name          TEXT,
  p_guest_email         TEXT,
  p_guest_notes         TEXT,
  p_scheduled_at        TIMESTAMPTZ,
  p_duration_minutes    INT,
  p_timezone            TEXT,
  p_management_token    TEXT,
  p_day_start           TIMESTAMPTZ,
  p_day_end             TIMESTAMPTZ,
  p_max_per_day         INT
) RETURNS bookings
LANGUAGE plpgsql
AS $$
DECLARE
  v_count INT;
  v_row   bookings;
BEGIN
  -- Serialize concurrent bookings for this link+day. Released automatically at
  -- transaction end. Two int4 keys avoid collisions across links/days.
  PERFORM pg_advisory_xact_lock(
    hashtext(p_booking_link_id::text),
    hashtext(p_day_start::text)
  );

  IF p_max_per_day IS NOT NULL THEN
    SELECT count(*) INTO v_count
      FROM bookings
     WHERE booking_link_id = p_booking_link_id
       AND status <> 'cancelled'
       AND scheduled_at >= p_day_start
       AND scheduled_at <  p_day_end;
    IF v_count >= p_max_per_day THEN
      RAISE EXCEPTION 'DAILY_CAP_EXCEEDED';
    END IF;
  END IF;

  INSERT INTO bookings (
    booking_link_id, calendar_account_id, guest_name, guest_email, guest_notes,
    scheduled_at, duration_minutes, timezone, management_token, status
  ) VALUES (
    p_booking_link_id, p_calendar_account_id, p_guest_name, p_guest_email, p_guest_notes,
    p_scheduled_at, p_duration_minutes, p_timezone, p_management_token, 'confirmed'
  ) RETURNING * INTO v_row;

  RETURN v_row;
END;
$$;
