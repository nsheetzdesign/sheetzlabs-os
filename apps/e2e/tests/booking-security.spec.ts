import { test, expect } from "@playwright/test";
import { randomBytes } from "node:crypto";
import { ENV } from "../lib/env";
import {
  createLinkWith,
  purgeLink,
  findFreeSlot,
  bookSlot,
  getBookingDb,
  type BookingLink,
} from "../lib/booking";
import { apiPublic } from "../lib/api";
import { admin } from "../lib/supabase";
import { calendarAccount } from "../lib/calendar";
import { e2eSubject } from "../lib/tags";
import { isolateToPrimary, restoreVisibility } from "../lib/calvis";

/**
 * Prompt 57: lock in the public-surface hardening — management-token enforcement
 * (NS-BK-1/2), the daily-cap concurrency guard (NS-SLOT-2), and the .ics CR-injection
 * fix (NS-ICS-1). Runs unauthenticated against the public booking API (links + direct
 * rows provisioned via the node admin/API clients).
 */
test.use({ storageState: { cookies: [], origins: [] } });

const GUEST = `e2e-guest@${ENV.GUEST_DOMAIN}`;
const slug = (p: string) => `e2e-${p}-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 6)}`;
const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms));

/** Cap-1, 30-min, every day 08:00–20:00, 30-day window, no notice/buffers. */
function capOneRules() {
  const day = { enabled: true, slots: [{ start: "08:00", end: "20:00" }] };
  return {
    timezone: "America/Chicago",
    days: { monday: day, tuesday: day, wednesday: day, thursday: day, friday: day, saturday: day, sunday: day },
    buffer_before_minutes: 0,
    buffer_after_minutes: 0,
    minimum_notice_hours: 0,
    date_range_days: 30,
    max_bookings_per_day: 1,
    slot_increment_minutes: 30,
  };
}

/** YYYY-MM-DD (host tz) for `n` days out — mirrors lib/booking.dateNDaysOut. */
function dateNDaysOut(n: number): string {
  return new Date(Date.now() + n * 86_400_000).toLocaleDateString("en-CA", { timeZone: "America/Chicago" });
}

/** Find a day offering ≥2 free slots; returns the first two. */
async function twoSlotsSameDay(linkSlug: string, startDay = 2): Promise<[string, string]> {
  for (let i = startDay; i < startDay + 20; i++) {
    const date = dateNDaysOut(i);
    const res = await apiPublic<{ slots?: string[] }>(`/booking/public/${linkSlug}/slots?date=${date}`);
    const slots = res.body?.slots ?? [];
    if (slots.length >= 2) return [slots[0], slots[1]];
  }
  throw new Error(`no day with 2 free slots for ${linkSlug}`);
}

/** One raw public booking POST (no 429 back-off — used to race two at once). */
function rawBook(linkSlug: string, scheduledAt: string) {
  return apiPublic<{ success?: boolean; error?: string }>(`/booking/public/${linkSlug}`, {
    method: "POST",
    body: JSON.stringify({
      guest_name: "[E2E] Guest",
      guest_email: GUEST,
      scheduled_at: scheduledAt,
      timezone: "America/Chicago",
    }),
  });
}

test.describe("public booking security", () => {
  let link: BookingLink;

  test.beforeAll(async () => {
    await isolateToPrimary();
    link = await createLinkWith(e2eSubject("sec"), slug("sec"), 30, capOneRules());
  });
  test.afterAll(async () => {
    if (link) await purgeLink(link.id);
    await restoreVisibility();
  });

  test("management token gates PII + mutation; bare UUID → 404", async () => {
    const free = await findFreeSlot(link.slug, 2);
    const booked = await bookSlot(link.slug, free.slot, GUEST);
    expect(booked.status, JSON.stringify(booked.body)).toBe(200);
    const id = booked.body.booking!.id;
    const token = booked.body.booking!.management_token;
    expect(token, "create response must carry a management token").toBeTruthy();

    // GETs are not rate-limited → deterministic 404 without/with a wrong token.
    expect((await apiPublic(`/booking/public/booking/${id}`)).status).toBe(404);
    expect((await apiPublic(`/booking/public/booking/${id}?token=deadbeef`)).status).toBe(404);
    expect((await apiPublic(`/booking/public/${id}/ics`)).status).toBe(404);
    expect((await apiPublic(`/booking/public/reschedule/${id}`)).status).toBe(404);

    // Correct token → 200 + PII returned (and never echoes the token back).
    const ok = await apiPublic<{ booking?: { guest_email?: string; management_token?: string } }>(
      `/booking/public/booking/${id}?token=${token}`,
    );
    expect(ok.status).toBe(200);
    expect(ok.body.booking?.guest_email).toBe(GUEST);
    expect(ok.body.booking?.management_token).toBeUndefined();

    // .ics with the token → 200 VCALENDAR.
    const ics = await apiPublic<string>(`/booking/public/${id}/ics?token=${token}`);
    expect(ics.status).toBe(200);
    expect(String(ics.body)).toContain("BEGIN:VCALENDAR");

    // Cancel WITHOUT the token must not mutate (status may be 404 or a rate-limit
    // 429, but the booking must remain confirmed either way).
    const cancel = await apiPublic(`/booking/public/cancel/${id}`, { method: "POST" });
    expect(cancel.status).not.toBe(200);
    expect((await getBookingDb(id))?.status).toBe("confirmed");
  });

  test("daily-cap race: two parallel POSTs at cap-1 → exactly one 201, one 409", async () => {
    // Retry against a fresh day if the IP rate-limiter (5/60s) bites; a new day
    // resets the cap to 0 so the race is re-runnable cleanly.
    for (let attempt = 0; attempt < 5; attempt++) {
      const [s1, s2] = await twoSlotsSameDay(link.slug, 3 + attempt * 2);
      const [r1, r2] = await Promise.all([rawBook(link.slug, s1), rawBook(link.slug, s2)]);
      if (r1.status === 429 || r2.status === 429) {
        await sleep(13_000);
        continue;
      }
      const statuses = [r1.status, r2.status].sort((a, b) => a - b);
      expect(statuses, `bodies: ${JSON.stringify([r1.body, r2.body])}`).toEqual([200, 409]);
      return;
    }
    throw new Error("rate-limited on every cap-race attempt");
  });

  test("CR-injected guest name yields a valid, non-injected .ics", async () => {
    // Insert directly via admin() (bypasses the zod control-char reject) to simulate
    // hostile data reaching buildIcs — the esc() hardening is the last line.
    const cal = await calendarAccount();
    const token = randomBytes(32).toString("hex");
    const when = new Date(Date.now() + 8 * 86_400_000);
    when.setUTCHours(18, 0, 0, 0);
    const { data: bk, error } = await admin()
      .from("bookings")
      .insert({
        booking_link_id: link.id,
        calendar_account_id: cal.id,
        guest_name: "Eve\r\nSUMMARY:INJECTED\r\nX-EVIL:1",
        guest_email: GUEST,
        scheduled_at: when.toISOString(),
        duration_minutes: 30,
        timezone: "America/Chicago",
        status: "confirmed",
        management_token: token,
      })
      .select("id")
      .single();
    expect(error, JSON.stringify(error)).toBeFalsy();
    const id = bk!.id as string;

    try {
      const res = await apiPublic<string>(`/booking/public/${id}/ics?token=${token}`);
      expect(res.status).toBe(200);
      const ics = String(res.body);
      expect(ics).toContain("BEGIN:VCALENDAR");
      expect(ics).toContain("BEGIN:VEVENT");

      // The injected properties must NOT appear as their own lines — they were
      // collapsed into the escaped ATTENDEE value, not promoted to VEVENT props.
      const lines = ics.split("\r\n");
      expect(lines.some((l) => l.startsWith("SUMMARY:INJECTED"))).toBeFalsy();
      expect(lines.some((l) => l.startsWith("X-EVIL:"))).toBeFalsy();
      // No bare CR: every CR must be part of a CRLF line ending.
      expect(/\r(?!\n)/.test(ics)).toBeFalsy();
    } finally {
      await admin().from("bookings").delete().eq("id", id);
    }
  });
});
