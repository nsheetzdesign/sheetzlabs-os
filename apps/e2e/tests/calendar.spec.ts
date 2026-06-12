import { test, expect, type Page } from "@playwright/test";
import { admin } from "../lib/supabase";
import { api } from "../lib/api";
import {
  calendarAccount,
  createEventApi,
  getEventApi,
  deleteEventApi,
  seedEvent,
  deleteEventDb,
  type CalAccount,
} from "../lib/calendar";
import { pollFor } from "../lib/poll";
import { e2eSubject } from "../lib/tags";

const TZ = "America/Chicago";

/** "GMT-05:00" → "-05:00" for the given date in TZ (DST-correct). */
function tzOffset(date: Date): string {
  const s = new Intl.DateTimeFormat("en-US", {
    timeZone: TZ,
    timeZoneName: "longOffset",
  })
    .formatToParts(date)
    .find((p) => p.type === "timeZoneName")?.value;
  const m = s?.match(/GMT([+-]\d{2}:\d{2})/);
  return m ? m[1] : "+00:00";
}

/** YYYY-MM-DD for `daysOut` from now, in the host tz. */
function ymd(daysOut: number): string {
  const d = new Date(Date.now() + daysOut * 86_400_000);
  return d.toLocaleDateString("en-CA", { timeZone: TZ });
}

/** ISO instant for a wall-clock time on a TZ date, e.g. "09:00:00". */
function isoAt(daysOut: number, hms: string): string {
  const day = ymd(daysOut);
  const off = tzOffset(new Date(`${day}T12:00:00Z`));
  return `${day}T${hms}${off}`;
}

async function gotoDay(page: Page, offset: number) {
  await page.goto(`/dashboard/calendar?view=day&offset=${offset}`, { waitUntil: "networkidle" });
}

test.describe("calendar", () => {
  let cal: CalAccount;

  test.beforeAll(async () => {
    cal = await calendarAccount();
  });

  test("week view loads with today's date highlighted in its column", async ({ page }) => {
    const pageErrors: string[] = [];
    page.on("pageerror", (e) => pageErrors.push(e.message));
    await page.goto("/dashboard/calendar?view=week&offset=0", { waitUntil: "networkidle" });

    // Today's day-of-month (in the pinned tz) is rendered emerald (isToday).
    const todayNum = new Date().toLocaleDateString("en-US", { timeZone: TZ, day: "numeric" });
    const highlighted = page.locator(".text-emerald-400", { hasText: new RegExp(`^${todayNum}$`) });
    await expect(highlighted.first()).toBeVisible();
    expect(pageErrors, pageErrors.join("; ")).toHaveLength(0);
  });

  test("event round-trip: create → renders at 9 AM → persists on reload → Google propagation → delete", async ({
    page,
  }) => {
    page.on("dialog", (d) => d.accept()); // confirm() on delete

    const title = e2eSubject("event");
    const start = isoAt(1, "09:00:00");
    const end = isoAt(1, "09:30:00");
    const eventId = await createEventApi(cal.id, title, start, end);

    try {
      // Google propagation: external_id is replaced with the real Google id.
      const propagated = await pollFor(
        async () => {
          const ev = await getEventApi(eventId);
          return ev && ev.external_id && !ev.external_id.startsWith("local-") ? ev : null;
        },
        { timeoutMs: 30_000, intervalMs: 3_000, label: "Google external_id" }
      );
      expect(propagated.external_id).not.toMatch(/^local-/);

      // Renders at the 9 AM line on the target day.
      await gotoDay(page, 1);
      const chip = page.locator("button", { hasText: title });
      await expect(chip).toBeVisible();
      await expect(chip).toContainText(/9:00\s*AM/i);

      // TZ persistence: reload and it's still there at 9 AM.
      await gotoDay(page, 1);
      await expect(page.locator("button", { hasText: title })).toContainText(/9:00\s*AM/i);

      // Delete via the UI (week-view modal → "Delete event").
      await page.locator("button", { hasText: title }).first().click();
      await page.getByRole("button", { name: "Delete event" }).click();
      await expect(page.locator("button", { hasText: title })).toHaveCount(0);

      // Gone from the API too (and from Google).
      await expect
        .poll(async () => (await getEventApi(eventId)) === null, { timeout: 20_000 })
        .toBe(true);
    } finally {
      await deleteEventApi(eventId).catch(() => null);
      await admin().from("calendar_events").delete().eq("id", eventId);
    }
  });

  test("all-day event renders in the all-day lane, not the time grid", async ({ page }) => {
    // (DB-seeded — the create API only makes timed events; the lane render is the check.)
    const title = e2eSubject("allday");
    const id = await seedEvent(cal.id, {
      title,
      start_at: `${ymd(1)}T00:00:00${tzOffset(new Date(`${ymd(1)}T12:00:00Z`))}`,
      end_at: `${ymd(2)}T00:00:00${tzOffset(new Date(`${ymd(2)}T12:00:00Z`))}`,
      all_day: true,
      all_day_end_date: ymd(1),
    });
    try {
      await gotoDay(page, 1);
      // The "all-day" lane label is present, and the event sits inside that lane.
      const laneLabel = page.getByText("all-day", { exact: true });
      await expect(laneLabel).toBeVisible();
      const lane = laneLabel.locator("xpath=..");
      await expect(lane.getByRole("button", { name: title })).toBeVisible();
    } finally {
      await deleteEventDb(id);
    }
  });

  test("overlapping events pack side-by-side and are both clickable", async ({ page }) => {
    const a = e2eSubject("ovlA");
    const b = e2eSubject("ovlB");
    const idA = await seedEvent(cal.id, { title: a, start_at: isoAt(1, "14:00:00"), end_at: isoAt(1, "15:00:00") });
    const idB = await seedEvent(cal.id, { title: b, start_at: isoAt(1, "14:30:00"), end_at: isoAt(1, "15:30:00") });
    try {
      await gotoDay(page, 1);
      const chipA = page.locator("button", { hasText: a });
      const chipB = page.locator("button", { hasText: b });
      await expect(chipA).toBeVisible();
      await expect(chipB).toBeVisible();

      const boxA = await chipA.boundingBox();
      const boxB = await chipB.boundingBox();
      expect(boxA && boxB).toBeTruthy();
      // Packed side-by-side: they do not share the same horizontal span.
      const sameLeft = Math.abs((boxA!.x ?? 0) - (boxB!.x ?? 0)) < 4;
      expect(sameLeft, "overlapping events should be column-packed, not stacked").toBeFalsy();

      // Both open their detail modal.
      await chipA.click();
      await expect(page.getByRole("heading", { name: a })).toBeVisible();
      await page.keyboard.press("Escape");
    } finally {
      await deleteEventDb(idA);
      await deleteEventDb(idB);
    }
  });

  test("calendar color persists across a change + reload", async () => {
    // Read a sub-calendar's current color, change it, re-read, assert; restore.
    const { data: sub } = await admin()
      .from("calendar_sub_accounts")
      .select("id, color")
      .eq("account_id", cal.id)
      .limit(1)
      .single();
    test.skip(!sub, "no sub-calendars to recolor");
    const original = (sub!.color as string) ?? "#2FE8B6";
    const next = original.toLowerCase() === "#ff5733" ? "#33c1ff" : "#ff5733";

    const patch = await api(`/calendar/sub-accounts/${sub!.id}`, {
      method: "PATCH",
      body: JSON.stringify({ color: next }),
    });
    expect(patch.ok).toBeTruthy();

    const { data: after } = await admin()
      .from("calendar_sub_accounts")
      .select("color")
      .eq("id", sub!.id)
      .single();
    expect((after!.color as string).toLowerCase()).toBe(next.toLowerCase());

    // Restore.
    await api(`/calendar/sub-accounts/${sub!.id}`, {
      method: "PATCH",
      body: JSON.stringify({ color: original }),
    });
  });
});
