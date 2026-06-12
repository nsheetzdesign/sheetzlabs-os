import { test, expect } from "@playwright/test";
import { ENV } from "../lib/env";
import {
  createLinkWith,
  patchLink,
  purgeLink,
  findFreeSlot,
  bookSlot,
  dateNDaysOut,
  type BookingLink,
} from "../lib/booking";
import { apiPublic } from "../lib/api";
import { e2eSubject } from "../lib/tags";
import { isolateToPrimary, restoreVisibility } from "../lib/calvis";

/**
 * Prompt 54B Part 6: lock in the Cal.com-grade availability enforcement, the
 * booking-link edit round-trip, the .ics endpoint, and the public tz selector.
 * Runs unauthenticated against the public booking API + page (links provisioned
 * via the node API client).
 */
test.use({ storageState: { cookies: [], origins: [] } });

const GUEST = `e2e-guest@${ENV.GUEST_DOMAIN}`;

/** 30-min slots, every day 08:00–20:00 Chicago, 14-day window, cap 1/day. */
function tightRules() {
  const day = { enabled: true, slots: [{ start: "08:00", end: "20:00" }] };
  return {
    timezone: "America/Chicago",
    days: { monday: day, tuesday: day, wednesday: day, thursday: day, friday: day, saturday: day, sunday: day },
    buffer_before_minutes: 0,
    buffer_after_minutes: 0,
    minimum_notice_hours: 0,
    date_range_days: 14,
    max_bookings_per_day: 1,
    slot_increment_minutes: 30,
  };
}

const slug = (p: string) => `e2e-${p}-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 6)}`;

test.describe("booking rules enforcement", () => {
  let link: BookingLink;

  test.beforeAll(async () => {
    await isolateToPrimary();
    link = await createLinkWith(e2eSubject("rules"), slug("rules"), 30, tightRules());
  });
  test.afterAll(async () => {
    if (link) await purgeLink(link.id);
    await restoreVisibility();
  });

  test("off-increment time → 422", async () => {
    const free = await findFreeSlot(link.slug, 2);
    // +15min lands off the 30-min grid → never an offered slot.
    const offGrid = new Date(new Date(free.slot).getTime() + 15 * 60_000).toISOString();
    const res = await bookSlot(link.slug, offGrid, GUEST);
    expect(res.status, JSON.stringify(res.body)).toBe(422);
  });

  test("beyond the rolling window → 422", async () => {
    const free = await findFreeSlot(link.slug, 2);
    // Same wall-time, 40 days out — past the 14-day window.
    const far = new Date(new Date(free.slot).getTime() + 40 * 86_400_000).toISOString();
    const res = await bookSlot(link.slug, far, GUEST);
    expect(res.status, JSON.stringify(res.body)).toBe(422);
  });

  test("over the daily cap → 409", async () => {
    const free = await findFreeSlot(link.slug, 5);
    const first = await bookSlot(link.slug, free.slot, GUEST);
    expect(first.status, JSON.stringify(first.body)).toBe(200);
    // A different valid grid time the same day — rejected by the 1/day cap.
    const second = new Date(new Date(free.slot).getTime() + 30 * 60_000).toISOString();
    const res = await bookSlot(link.slug, second, GUEST);
    expect(res.status, JSON.stringify(res.body)).toBe(409);
  });

  test(".ics endpoint returns a valid VCALENDAR", async () => {
    const free = await findFreeSlot(link.slug, 8);
    const booked = await bookSlot(link.slug, free.slot, GUEST);
    expect(booked.status, JSON.stringify(booked.body)).toBe(200);
    const id = booked.body.booking!.id;

    const res = await apiPublic<string>(`/booking/public/${id}/ics`);
    expect(res.status).toBe(200);
    const ics = String(res.body);
    expect(ics).toContain("BEGIN:VCALENDAR");
    expect(ics).toContain("END:VCALENDAR");
    expect(ics).toContain("BEGIN:VEVENT");
    expect(ics).toContain("DTSTART:");
    expect(ics).toContain(`UID:booking-${id}`);
  });
});

test.describe("booking link edit round-trip", () => {
  let link: BookingLink;

  test.beforeAll(async () => {
    await isolateToPrimary();
    // 30-min, every day 08:00–20:00, big window, no cap.
    const day = { enabled: true, slots: [{ start: "08:00", end: "20:00" }] };
    link = await createLinkWith(e2eSubject("edit"), slug("edit"), 30, {
      timezone: "America/Chicago",
      days: { monday: day, tuesday: day, wednesday: day, thursday: day, friday: day, saturday: day, sunday: day },
      minimum_notice_hours: 0,
      date_range_days: 30,
    });
  });
  test.afterAll(async () => {
    if (link) await purgeLink(link.id);
    await restoreVisibility();
  });

  test("duration change is reflected in the offered slots", async () => {
    const date = dateNDaysOut(3);
    const before = await apiPublic<{ slots?: string[] }>(`/booking/public/${link.slug}/slots?date=${date}`);
    const beforeCount = before.body?.slots?.length ?? 0;
    expect(beforeCount).toBeGreaterThan(0);

    // Lengthen to 60 minutes → stride defaults to the new duration → fewer slots.
    const patched = await patchLink(link.id, { duration_minutes: 60 });
    expect(patched.ok, JSON.stringify(patched.body)).toBeTruthy();

    const after = await apiPublic<{ slots?: string[]; duration?: number }>(`/booking/public/${link.slug}/slots?date=${date}`);
    expect(after.body?.duration).toBe(60);
    expect((after.body?.slots?.length ?? 0)).toBeLessThan(beforeCount);
  });
});

test.describe("public booking page — timezone selector", () => {
  let link: BookingLink;

  test.beforeAll(async () => {
    await isolateToPrimary();
    const day = { enabled: true, slots: [{ start: "08:00", end: "20:00" }] };
    link = await createLinkWith(e2eSubject("tz"), slug("tz"), 30, {
      timezone: "America/Chicago",
      days: { monday: day, tuesday: day, wednesday: day, thursday: day, friday: day, saturday: day, sunday: day },
      minimum_notice_hours: 0,
      date_range_days: 30,
    });
  });
  test.afterAll(async () => {
    if (link) await purgeLink(link.id);
    await restoreVisibility();
  });

  test("changing the timezone shifts displayed slot times", async ({ page }) => {
    const free = await findFreeSlot(link.slug, 2);
    await page.goto(`/book/${link.slug}`, { waitUntil: "networkidle" });

    // Navigate the month grid to the free date.
    const cell = page.locator(`[data-date="${free.date}"]`);
    for (let i = 0; i < 4; i++) {
      if ((await cell.count()) > 0 && (await cell.isEnabled())) break;
      await page.getByRole("button", { name: "Next month" }).click();
    }
    await cell.click();

    const firstSlot = page.getByRole("button", { name: /\d{1,2}:\d{2}\s*(AM|PM)/ }).first();
    await expect(firstSlot).toBeVisible();
    const before = (await firstSlot.textContent())?.trim();

    // Switch to New York (+1h from Chicago) → the same instant renders an hour later.
    await page.getByLabel("Timezone").first().selectOption("America/New_York");
    const after = (await firstSlot.textContent())?.trim();

    expect(after).not.toBe(before);
  });
});
