/**
 * Deletion-aware, paginated Google Calendar sync (Prompt 52B Part 1 — CS-1/2/11).
 *
 * Replaces the old upsert-only loop in `calendar.ts` that: capped at 250 events per
 * calendar (`nextPageToken` ignored), never saw deletions/cancellations (ghost rows
 * accumulated forever), and awaited one upsert per event over up to ~50 calendars
 * (subrequest blow-up). This module is the single source of truth, called by both
 * `POST /calendar/accounts/:id/sync` and the 15-minute cron.
 *
 * Behavior:
 *  - Pagination: loops `nextPageToken` per calendar with `singleEvents=true`.
 *  - Deletions: requests `showDeleted=true`; `status='cancelled'` events delete the
 *    local row (bookings.calendar_event_id is a plain TEXT Google-id, not a FK to
 *    calendar_events.id, so a hard delete is safe — verified against migration 027).
 *  - Window reconcile: every upserted row is stamped with this pass's `last_synced_at`;
 *    after a calendar is fetched start-to-finish, window rows older than the stamp
 *    (events that silently vanished from Google) are deleted. Reconcile runs ONLY for
 *    a fully-fetched calendar — never on a partial/budget-truncated fetch.
 *  - Batched upserts: rows collected per calendar and upserted in 100-row chunks on
 *    the (account_id, external_id) unique constraint (migration 013).
 *  - sub_account_id (migration 015's orphan column) + google_calendar_id populated so
 *    server-side sub-calendar filtering becomes possible (Prompt 53).
 *  - Subrequest budget: calendars processed sequentially under a per-run counter; if
 *    exhausted, the remaining calendar IDs + frozen window are persisted to
 *    `sync_cursor` and the next run resumes (same pattern as 52A fullSync).
 *  - Token: shared getValidAccessToken; ReauthRequiredError propagates to the caller,
 *    which flags + skips the account.
 */

import { getValidAccessToken as getGoogleAccessToken } from "./google-auth";

type GoogleEnv = { GOOGLE_CLIENT_ID: string; GOOGLE_CLIENT_SECRET: string };

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type Supabase = any;

// Conservative per-run cap. The cron invocation shares the Workers 1,000-subrequest
// limit with email sync (up to ~400) and agents, so calendar takes a slice and
// continues the tail next run via sync_cursor.
const SUBREQUEST_BUDGET = 300;
// Google's events.list maximum — one page usually covers a whole calendar's window.
const EVENTS_PAGE_SIZE = 2500;
const UPSERT_CHUNK = 100;
const WINDOW_PAST_DAYS = 7;
const WINDOW_FUTURE_DAYS = 60;

export interface CalendarSyncResult {
  synced: number;
  deleted: number;
  calendars: number;
  complete: boolean;
}

interface WorkItem {
  id: string; // Google calendar id
  subAccountId: string | null;
}

interface SyncCursor {
  remaining: WorkItem[];
  timeMin: string;
  timeMax: string;
}

/**
 * Sync one calendar account. Throws ReauthRequiredError (already flags the row) so the
 * caller can skip; other errors propagate for the caller to record. Idempotent and
 * resumable across runs.
 */
export async function syncCalendarAccount(
  account: Record<string, unknown>,
  env: GoogleEnv,
  supabase: Supabase
): Promise<CalendarSyncResult> {
  const accountId = account.id as string;
  const accessToken = await getGoogleAccessToken(account, env, supabase, "calendar_accounts");

  // A monotonically-increasing per-pass marker. Date.now() is fine in the worker.
  const runStamp = new Date().toISOString();
  let subrequests = 0;
  let synced = 0;
  let deleted = 0;

  // ── Resolve the work-list (resume from cursor, or start a fresh pass) ──────────
  const cursor = (account.sync_cursor as SyncCursor | null) ?? null;
  let workList: WorkItem[];
  let timeMin: string;
  let timeMax: string;

  if (cursor?.remaining?.length) {
    workList = cursor.remaining;
    timeMin = cursor.timeMin;
    timeMax = cursor.timeMax;
  } else {
    const now = Date.now();
    timeMin = new Date(now - WINDOW_PAST_DAYS * 86_400_000).toISOString();
    timeMax = new Date(now + WINDOW_FUTURE_DAYS * 86_400_000).toISOString();
    const { calendars, used } = await resolveCalendars(accountId, accessToken, supabase);
    subrequests += used;
    workList = calendars;
  }

  const calendarsThisRun = workList.length;
  const remaining = [...workList];

  // ── Process calendars sequentially under the subrequest budget ────────────────
  while (remaining.length > 0) {
    if (subrequests >= SUBREQUEST_BUDGET) break; // out of budget — persist + resume next run

    const cal = remaining[0];
    const seen = new Set<string>();
    const cancelled: string[] = [];
    const rows: Record<string, unknown>[] = [];
    let pageToken: string | undefined;
    let calComplete = true;

    // Paginate this calendar's events fully (within budget).
    do {
      if (subrequests >= SUBREQUEST_BUDGET) {
        calComplete = false;
        break;
      }
      const url = new URL(
        `https://www.googleapis.com/calendar/v3/calendars/${encodeURIComponent(cal.id)}/events`
      );
      url.searchParams.set("timeMin", timeMin);
      url.searchParams.set("timeMax", timeMax);
      url.searchParams.set("singleEvents", "true");
      url.searchParams.set("showDeleted", "true");
      url.searchParams.set("orderBy", "startTime");
      url.searchParams.set("maxResults", String(EVENTS_PAGE_SIZE));
      if (pageToken) url.searchParams.set("pageToken", pageToken);

      const res = await fetch(url.toString(), {
        headers: { Authorization: `Bearer ${accessToken}` },
      });
      subrequests++;

      if (!res.ok) {
        // A 404 means this sub-calendar was unshared/removed; skip it and move on.
        // Any other failure: don't reconcile (partial), leave existing rows intact.
        const text = await res.text().catch(() => "");
        console.error(`[calendar-sync] events.list ${cal.id} failed (${res.status}): ${text}`);
        calComplete = false;
        break;
      }

      const data = (await res.json()) as {
        items?: Array<Record<string, unknown>>;
        nextPageToken?: string;
      };

      for (const event of data.items ?? []) {
        const externalId = event.id as string;
        if (!externalId) continue;
        if (event.status === "cancelled") {
          cancelled.push(externalId);
          continue;
        }
        seen.add(externalId);
        rows.push({
          account_id: accountId,
          external_id: externalId,
          google_calendar_id: cal.id,
          sub_account_id: cal.subAccountId,
          last_synced_at: runStamp,
          ...parseGoogleEvent(event),
        });
      }

      pageToken = data.nextPageToken;
    } while (pageToken);

    // Batched upserts (100-row chunks) on the (account_id, external_id) constraint.
    for (let i = 0; i < rows.length; i += UPSERT_CHUNK) {
      const chunk = rows.slice(i, i + UPSERT_CHUNK);
      const { error } = await supabase
        .from("calendar_events")
        .upsert(chunk, { onConflict: "account_id,external_id" });
      if (error) {
        console.error(`[calendar-sync] upsert chunk failed for ${cal.id}: ${error.message}`);
        calComplete = false; // don't reconcile against a partially-written calendar
      } else {
        synced += chunk.length;
      }
    }

    // Explicit cancellations (showDeleted) → delete local rows.
    for (let i = 0; i < cancelled.length; i += UPSERT_CHUNK) {
      const chunk = cancelled.slice(i, i + UPSERT_CHUNK);
      const { error, count } = await supabase
        .from("calendar_events")
        .delete({ count: "exact" })
        .eq("account_id", accountId)
        .in("external_id", chunk);
      if (error) console.error(`[calendar-sync] cancel-delete failed for ${cal.id}: ${error.message}`);
      else deleted += count ?? 0;
    }

    // Window reconcile — ONLY when this calendar was fetched & written completely.
    if (calComplete) {
      const { error, count } = await supabase
        .from("calendar_events")
        .delete({ count: "exact" })
        .eq("account_id", accountId)
        .eq("google_calendar_id", cal.id)
        .eq("is_time_block", false)
        .gte("start_at", timeMin)
        .lte("start_at", timeMax)
        .not("external_id", "like", "local-%")
        .not("external_id", "like", "timeblock-%")
        .or(`last_synced_at.is.null,last_synced_at.lt.${runStamp}`);
      if (error) console.error(`[calendar-sync] reconcile failed for ${cal.id}: ${error.message}`);
      else deleted += count ?? 0;
    }

    if (calComplete) {
      remaining.shift(); // done with this calendar
    } else {
      break; // budget hit mid-calendar — resume this same calendar fresh next run
    }
  }

  // ── Persist continuation or finish ────────────────────────────────────────────
  const complete = remaining.length === 0;
  await supabase
    .from("calendar_accounts")
    .update({
      sync_cursor: complete ? null : ({ remaining, timeMin, timeMax } as SyncCursor),
      last_sync_at: complete ? new Date().toISOString() : (account.last_sync_at ?? null),
      sync_status: complete ? "idle" : "syncing",
      sync_error: null,
    })
    .eq("id", accountId);

  return { synced, deleted, calendars: calendarsThisRun, complete };
}

/**
 * Enumerate the account's Google calendars (paginated calendarList) and ensure a
 * calendar_sub_accounts row exists for each so events can carry a sub_account_id.
 * New calendars are inserted with a default color; existing rows are left untouched
 * so a user's custom color/visibility (PATCH /sub-accounts) is never clobbered (CS-11).
 */
async function resolveCalendars(
  accountId: string,
  accessToken: string,
  supabase: Supabase
): Promise<{ calendars: WorkItem[]; used: number }> {
  let used = 0;
  const googleCals: Array<{ id: string; summary?: string; backgroundColor?: string }> = [];
  let pageToken: string | undefined;

  do {
    const url = new URL("https://www.googleapis.com/calendar/v3/users/me/calendarList");
    url.searchParams.set("maxResults", "250");
    if (pageToken) url.searchParams.set("pageToken", pageToken);
    const res = await fetch(url.toString(), {
      headers: { Authorization: `Bearer ${accessToken}` },
    });
    used++;
    if (!res.ok) {
      const text = await res.text().catch(() => "");
      throw new Error(`Google calendarList failed (${res.status}): ${text}`);
    }
    const data = (await res.json()) as {
      items?: Array<{ id: string; summary?: string; backgroundColor?: string }>;
      nextPageToken?: string;
    };
    googleCals.push(...(data.items ?? []));
    pageToken = data.nextPageToken;
  } while (pageToken);

  if (googleCals.length === 0) {
    googleCals.push({ id: "primary", summary: "Primary" });
  }

  // Look up which sub-accounts already exist; insert only the missing ones.
  const { data: existing } = await supabase
    .from("calendar_sub_accounts")
    .select("id, external_id")
    .eq("account_id", accountId);
  const idByExternal = new Map<string, string>();
  for (const row of existing ?? []) {
    idByExternal.set(row.external_id as string, row.id as string);
  }

  const toInsert = googleCals
    .filter((cal) => !idByExternal.has(cal.id))
    .map((cal) => ({
      account_id: accountId,
      external_id: cal.id,
      name: cal.summary || cal.id,
      color: cal.backgroundColor || "#2FE8B6",
    }));

  if (toInsert.length > 0) {
    const { data: inserted, error } = await supabase
      .from("calendar_sub_accounts")
      .upsert(toInsert, { onConflict: "account_id,external_id" })
      .select("id, external_id");
    if (error) {
      console.error(`[calendar-sync] sub-account upsert failed: ${error.message}`);
    } else {
      for (const row of inserted ?? []) {
        idByExternal.set(row.external_id as string, row.id as string);
      }
    }
  }

  return {
    calendars: googleCals.map((cal) => ({
      id: cal.id,
      subAccountId: idByExternal.get(cal.id) ?? null,
    })),
    used,
  };
}

/** Date string (YYYY-MM-DD) of `dateStr` minus `days`, all UTC/date-only math. */
function dateMinusDays(dateStr: string, days: number): string {
  const [y, m, d] = dateStr.split("-").map(Number);
  const t = Date.UTC(y, m - 1, d) - days * 86_400_000;
  return new Date(t).toISOString().slice(0, 10);
}

/**
 * Map a Google event resource to our `calendar_events` columns. For all-day events
 * (date-only start/end) we record `all_day_end_date` as the INCLUSIVE last day —
 * Google's `end.date` is exclusive — per the convention documented in migration 041.
 */
export function parseGoogleEvent(event: Record<string, unknown>) {
  const start = event.start as Record<string, string> | undefined;
  const end = event.end as Record<string, string> | undefined;
  const attendees = (event.attendees as Array<Record<string, string>> | undefined) ?? [];
  const organizer = event.organizer as Record<string, string> | undefined;
  const conferenceData = event.conferenceData as
    | { entryPoints?: Array<{ uri: string }> }
    | undefined;

  const allDay = !start?.dateTime;
  const allDayEndDate =
    allDay && end?.date ? dateMinusDays(end.date, 1) : null;

  return {
    title: (event.summary as string) || "(No title)",
    description: (event.description as string) || null,
    location: (event.location as string) || null,
    start_at: start?.dateTime || start?.date,
    end_at: end?.dateTime || end?.date,
    all_day: allDay,
    all_day_end_date: allDayEndDate,
    timezone: start?.timeZone || "America/Chicago",
    attendees: attendees.map((a) => ({
      email: a.email,
      name: a.displayName || null,
      status: a.responseStatus,
    })),
    organizer_email: organizer?.email || null,
    meeting_link:
      (event.hangoutLink as string) || conferenceData?.entryPoints?.[0]?.uri || null,
    status: (event.status as string) || "confirmed",
    recurring: !!(event.recurringEventId as string),
    recurrence_rule: (event.recurrence as string[] | undefined)?.[0] || null,
  };
}
