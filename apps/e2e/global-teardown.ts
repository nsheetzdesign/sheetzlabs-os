/**
 * Global teardown: sweep any stranded [E2E] artifacts older than 1 hour. This is a
 * backstop — each spec cleans up its own subjects in afterEach — but a crashed run
 * can leave orphans, and we never want the founder's real data polluted with test
 * rows. Best-effort and never throws (a teardown failure must not fail the run).
 */
import { admin } from "./lib/supabase";
import { api } from "./lib/api";
import { E2E_TAG, olderThanCutoff } from "./lib/tags";
import { restoreVisibility } from "./lib/calvis";

async function sweepBookings(cutoff: string): Promise<number> {
  const db = admin();
  // [E2E] booking links (and their bookings, which we delete first to satisfy FKs).
  const { data: links } = await db
    .from("booking_links")
    .select("id")
    .ilike("title", `%${E2E_TAG}%`)
    .lt("created_at", cutoff);
  const linkIds = (links ?? []).map((l) => l.id as string);
  let n = 0;
  if (linkIds.length) {
    const { count: bc } = await db
      .from("bookings")
      .delete({ count: "exact" })
      .in("booking_link_id", linkIds);
    const { count: lc } = await db
      .from("booking_links")
      .delete({ count: "exact" })
      .in("id", linkIds);
    n += (bc ?? 0) + (lc ?? 0);
  }
  return n;
}

async function sweepCalendarEvents(cutoff: string): Promise<number> {
  const db = admin();
  const { data: events } = await db
    .from("calendar_events")
    .select("id")
    .ilike("title", `%${E2E_TAG}%`)
    .lt("created_at", cutoff);
  let n = 0;
  for (const e of events ?? []) {
    // Google-aware delete (removes the remote copy too) — falls back to local delete.
    const res = await api(`/calendar/events/${e.id}`, { method: "DELETE" }).catch(() => null);
    if (!res || !res.ok) {
      await db.from("calendar_events").delete().eq("id", e.id);
    }
    n++;
  }
  return n;
}

async function sweepEmails(cutoff: string): Promise<number> {
  const db = admin();
  // Self-sent [E2E] mail — trash via write-back so Gmail clears too.
  const { data: emails } = await db
    .from("emails")
    .select("id")
    .ilike("subject", `%${E2E_TAG}%`)
    .eq("is_deleted", false)
    .lt("created_at", cutoff)
    .limit(200);
  const ids = (emails ?? []).map((e) => e.id as string);
  if (!ids.length) return 0;
  const res = await api(`/email/bulk`, {
    method: "POST",
    body: JSON.stringify({ action: "trash", email_ids: ids }),
  }).catch(() => null);
  if (!res || !res.ok) {
    // Backstop: soft-delete locally so they don't resurface in the founder's inbox.
    await db
      .from("emails")
      .update({ is_trashed: true, is_deleted: true })
      .in("id", ids);
  }
  return ids.length;
}

export default async function globalTeardown() {
  const cutoff = olderThanCutoff(1);
  // Crash-safety net: if the booking suite died before restoring calendar
  // visibility, the snapshot file is still present — restore from it.
  await restoreVisibility().catch(() => {});
  try {
    const [b, c, e] = await Promise.all([
      sweepBookings(cutoff).catch(() => 0),
      sweepCalendarEvents(cutoff).catch(() => 0),
      sweepEmails(cutoff).catch(() => 0),
    ]);
    // eslint-disable-next-line no-console
    console.log(`[e2e] teardown sweep: ${b} booking rows, ${c} calendar events, ${e} emails.`);
  } catch (err) {
    // eslint-disable-next-line no-console
    console.warn("[e2e] teardown sweep error (ignored):", err);
  }
}
