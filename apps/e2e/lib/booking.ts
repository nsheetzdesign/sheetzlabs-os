/** Booking-domain helpers: seed a wide-availability [E2E] link, find a real free
 *  slot against the host's live calendar, clean up. */
import { admin } from "./supabase";
import { api, apiPublic } from "./api";
import { calendarAccount } from "./calendar";

/** Wide availability so a free slot is easy to find: every day, long window, no
 *  notice requirement, far horizon. Host tz fixed for deterministic slot math. */
export function wideAvailability() {
  const day = { enabled: true, slots: [{ start: "08:00", end: "20:00" }] };
  return {
    timezone: "America/Chicago",
    days: {
      monday: day, tuesday: day, wednesday: day, thursday: day,
      friday: day, saturday: day, sunday: day,
    },
    buffer_before_minutes: 0,
    buffer_after_minutes: 0,
    minimum_notice_hours: 0,
    date_range_days: 30,
  };
}

export interface BookingLink {
  id: string;
  slug: string;
  title: string;
  duration_minutes: number;
}

export async function createLink(title: string, slug: string): Promise<BookingLink> {
  const cal = await calendarAccount();
  const res = await api<{ link?: BookingLink }>("/booking/links", {
    method: "POST",
    body: JSON.stringify({
      calendar_account_id: cal.id,
      slug,
      title,
      duration_minutes: 15,
      availability_rules: wideAvailability(),
    }),
  });
  if (!res.ok || !res.body?.link) {
    throw new Error(`createLink failed: ${res.status} ${JSON.stringify(res.body)}`);
  }
  return res.body.link;
}

export async function deleteLink(id: string) {
  await api(`/booking/links/${id}`, { method: "DELETE" }).catch(() => null);
}

/** Create a link with explicit duration + availability rules (rules-enforcement tests). */
export async function createLinkWith(
  title: string,
  slug: string,
  durationMinutes: number,
  rules: Record<string, unknown>,
): Promise<BookingLink> {
  const cal = await calendarAccount();
  const res = await api<{ link?: BookingLink }>("/booking/links", {
    method: "POST",
    body: JSON.stringify({
      calendar_account_id: cal.id,
      slug,
      title,
      duration_minutes: durationMinutes,
      availability_rules: rules,
    }),
  });
  if (!res.ok || !res.body?.link) {
    throw new Error(`createLinkWith failed: ${res.status} ${JSON.stringify(res.body)}`);
  }
  return res.body.link;
}

/** PATCH a link (edit round-trip tests). */
export async function patchLink(id: string, updates: Record<string, unknown>) {
  return api(`/booking/links/${id}`, { method: "PATCH", body: JSON.stringify(updates) });
}

/** Local YYYY-MM-DD for `daysFromNow` in the host tz (America/Chicago). */
export function dateNDaysOut(daysFromNow: number): string {
  const d = new Date(Date.now() + daysFromNow * 86_400_000);
  // en-CA gives ISO-style YYYY-MM-DD; pin the tz so it matches the host rules.
  return d.toLocaleDateString("en-CA", { timeZone: "America/Chicago" });
}

export interface FreeSlot {
  date: string;
  slot: string; // ISO datetime
}

/** Walk forward from `startDay` days out until a date returns ≥1 free slot. */
export async function findFreeSlot(slug: string, startDay = 2, maxDays = 14): Promise<FreeSlot> {
  for (let i = startDay; i < startDay + maxDays; i++) {
    const date = dateNDaysOut(i);
    const res = await apiPublic<{ slots?: string[] }>(`/booking/public/${slug}/slots?date=${date}`);
    const slots = res.body?.slots ?? [];
    if (slots.length) return { date, slot: slots[0] };
  }
  throw new Error(`No free slot found for ${slug} within ${maxDays} days`);
}

export interface BookResult {
  status: number;
  body: { success?: boolean; booking?: { id: string }; error?: string };
}

/** Direct public booking POST (used for guard/validation checks). */
export async function bookSlot(
  slug: string,
  scheduledAt: string,
  guestEmail: string,
  guestName = "[E2E] Guest"
): Promise<BookResult> {
  const res = await apiPublic<BookResult["body"]>(`/booking/public/${slug}`, {
    method: "POST",
    body: JSON.stringify({
      guest_name: guestName,
      guest_email: guestEmail,
      scheduled_at: scheduledAt,
      timezone: "America/Chicago",
    }),
  });
  return { status: res.status, body: res.body };
}

export async function getBookingDb(id: string) {
  const { data } = await admin()
    .from("bookings")
    .select("id, status, guest_email, scheduled_at")
    .eq("id", id)
    .single();
  return data;
}

/** Delete a link plus all its bookings (teardown for the booking suite). Each
 *  booking is host-cancelled first so its Google Calendar event is removed too. */
export async function purgeLink(linkId: string) {
  const { data: bookings } = await admin()
    .from("bookings")
    .select("id, calendar_event_id, status")
    .eq("booking_link_id", linkId);
  for (const b of bookings ?? []) {
    // Host cancel removes the Google event (best-effort). Skip if already cancelled
    // (the guest-cancel test handles its own).
    if (b.calendar_event_id && b.status !== "cancelled") {
      await api(`/booking/bookings/${b.id}`, { method: "DELETE" }).catch(() => null);
    }
  }
  await admin().from("bookings").delete().eq("booking_link_id", linkId);
  await admin().from("booking_links").delete().eq("id", linkId);
}
