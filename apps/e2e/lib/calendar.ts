/** Calendar-domain helpers. Real Google events via the API; DB-seeded events (with
 *  `local-` external ids the sync reconcile skips) for pure UI-rendering checks. */
import { admin } from "./supabase";
import { api } from "./api";

export interface CalAccount {
  id: string;
  email: string;
}

let _cal: CalAccount | null = null;
export async function calendarAccount(): Promise<CalAccount> {
  if (_cal) return _cal;
  const { data, error } = await admin()
    .from("calendar_accounts")
    .select("id, email")
    .eq("sync_enabled", true)
    .eq("needs_reauth", false)
    .order("email")
    .limit(1)
    .single();
  if (error || !data) throw new Error(`No usable calendar account: ${error?.message}`);
  _cal = data as CalAccount;
  return _cal;
}

export interface CalEvent {
  id: string;
  external_id: string;
  title: string;
  start_at: string;
  end_at: string;
  all_day: boolean;
}

const COLS = "id, external_id, title, start_at, end_at, all_day, google_calendar_id";

/** Create a real timed event via the API (pushes to Google), return its local id. */
export async function createEventApi(
  accountId: string,
  title: string,
  startAt: string,
  endAt: string
): Promise<string> {
  const res = await api<{ event?: { id: string } }>("/calendar/events", {
    method: "POST",
    body: JSON.stringify({ account_id: accountId, title, start_at: startAt, end_at: endAt }),
  });
  const id = res.body?.event?.id;
  if (!res.ok || !id) throw new Error(`event create failed: ${res.status} ${JSON.stringify(res.body)}`);
  return id;
}

export async function getEventApi(id: string): Promise<CalEvent | null> {
  const res = await api<{ event?: CalEvent }>(`/calendar/events/${id}`);
  return res.body?.event ?? null;
}

export async function deleteEventApi(id: string) {
  return api(`/calendar/events/${id}`, { method: "DELETE" });
}

/** Seed an event straight into the DB (UI-rendering checks). `local-` prefix keeps
 *  the calendar reconcile from deleting it. Returns the row id. */
export async function seedEvent(
  accountId: string,
  fields: {
    title: string;
    start_at: string;
    end_at: string;
    all_day?: boolean;
    all_day_end_date?: string | null;
  }
): Promise<string> {
  const externalId = `local-e2e-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`;
  const { data, error } = await admin()
    .from("calendar_events")
    .insert({
      account_id: accountId,
      external_id: externalId,
      title: fields.title,
      start_at: fields.start_at,
      end_at: fields.end_at,
      all_day: fields.all_day ?? false,
      all_day_end_date: fields.all_day_end_date ?? null,
      timezone: "America/Chicago",
      status: "confirmed",
    })
    .select("id")
    .single();
  if (error || !data) throw new Error(`seedEvent failed: ${error?.message}`);
  return data.id as string;
}

export async function deleteEventDb(id: string) {
  await admin().from("calendar_events").delete().eq("id", id);
}

/** Find a seeded/real event row by id (DB read, bypasses API). */
export async function getEventDb(id: string): Promise<CalEvent | null> {
  const { data } = await admin().from("calendar_events").select(COLS).eq("id", id).single();
  return (data as CalEvent) ?? null;
}
