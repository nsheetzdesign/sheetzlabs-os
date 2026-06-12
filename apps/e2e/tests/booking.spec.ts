import { test, expect } from "@playwright/test";
import { ENV } from "../lib/env";
import {
  createLink,
  purgeLink,
  findFreeSlot,
  bookSlot,
  getBookingDb,
  type BookingLink,
} from "../lib/booking";
import { e2eSubject } from "../lib/tags";
import { isolateToPrimary, restoreVisibility } from "../lib/calvis";

/**
 * Booking suite runs UNAUTHENTICATED (public pages + public API) — proving the auth
 * boundary works both ways. The [E2E] link is provisioned via the node API client
 * (Bearer), independent of the empty browser session.
 */
test.use({ storageState: { cookies: [], origins: [] } });

const GUEST = `e2e-guest@${ENV.GUEST_DOMAIN}`;

/** Select a date in the month-grid picker (BK-18), navigating months if needed. */
async function selectDate(page: import("@playwright/test").Page, ymd: string) {
  const cell = page.locator(`[data-date="${ymd}"]`);
  for (let i = 0; i < 4; i++) {
    if ((await cell.count()) > 0 && (await cell.isEnabled())) break;
    await page.getByRole("button", { name: "Next month" }).click();
  }
  await cell.click();
}

test.describe("booking", () => {
  let link: BookingLink;

  test.beforeAll(async () => {
    // Isolate busy to the account's primary calendar so real slots exist to book.
    await isolateToPrimary();
    const slug = `e2e-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 6)}`;
    link = await createLink(e2eSubject("test link"), slug);
  });

  test.afterAll(async () => {
    if (link) await purgeLink(link.id);
    await restoreVisibility();
  });

  test("public page loads: slots render and timezone label shows", async ({ page }) => {
    const free = await findFreeSlot(link.slug);
    await page.goto(`/book/${link.slug}`, { waitUntil: "networkidle" });

    await expect(page.getByRole("heading", { name: link.title })).toBeVisible();

    // Pick the free date → time step renders slots + the timezone label.
    await selectDate(page, free.date);
    await expect(page.getByTestId("timezone-label")).toContainText(/America\/Chicago/);
    await expect(
      page.getByRole("button", { name: /\d{1,2}:\d{2}\s*(AM|PM)/ }).first()
    ).toBeVisible();
  });

  test("book happy path: confirmation renders with manage links", async ({ page }) => {
    const free = await findFreeSlot(link.slug, 3);
    await page.goto(`/book/${link.slug}`, { waitUntil: "networkidle" });

    await selectDate(page, free.date);
    await page.getByRole("button", { name: /\d{1,2}:\d{2}\s*(AM|PM)/ }).first().click();

    await page.getByPlaceholder("Your name").fill("[E2E] Guest");
    await page.getByPlaceholder("you@example.com").fill(GUEST);
    await page.getByRole("button", { name: /Confirm Booking/i }).click();

    await expect(page.getByRole("heading", { name: /Booking Confirmed/i })).toBeVisible({
      timeout: 30_000,
    });
    // Manage links (Prompt 55 gap — added so guests can self-serve).
    await expect(page.getByRole("link", { name: /Reschedule/i })).toBeVisible();
    await expect(page.getByRole("link", { name: /Cancel/i })).toBeVisible();
  });

  test("double-book guard: second POST for the same slot → 409", async () => {
    const free = await findFreeSlot(link.slug, 6);
    const first = await bookSlot(link.slug, free.slot, GUEST);
    expect(first.status, JSON.stringify(first.body)).toBe(200);
    const second = await bookSlot(link.slug, free.slot, GUEST);
    expect(second.status).toBe(409);
  });

  test("validation: empty body → 422; past timestamp → rejected", async () => {
    const empty = await bookSlot(link.slug, "", "");
    // Empty guest fields + invalid datetime → zod 422.
    expect(empty.status).toBe(422);

    const past = await bookSlot(
      link.slug,
      new Date(Date.now() - 24 * 3600_000).toISOString(),
      GUEST
    );
    // Past time is never an offered slot → rejected (409 SLOT_UNAVAILABLE or 4xx).
    expect(past.status).toBeGreaterThanOrEqual(400);
    expect(past.status).toBeLessThan(500);
    expect(past.body.success).toBeFalsy();
  });

  test("guest cancel via the manage link sets the booking to cancelled", async ({ page }) => {
    const free = await findFreeSlot(link.slug, 9);
    const booked = await bookSlot(link.slug, free.slot, GUEST);
    expect(booked.status, JSON.stringify(booked.body)).toBe(200);
    const bookingId = booked.body.booking!.id;

    await page.goto(`/book/cancel/${bookingId}`, { waitUntil: "networkidle" });
    await page.getByRole("button", { name: /Yes, Cancel/i }).click();
    await expect(page.getByRole("heading", { name: /Booking Cancelled/i })).toBeVisible({
      timeout: 30_000,
    });

    const row = await getBookingDb(bookingId);
    expect(row?.status).toBe("cancelled");
  });

  test("garbage slug renders the styled error boundary, not the router default", async ({ page }) => {
    const resp = await page.goto("/book/this-slug-does-not-exist-xyz", { waitUntil: "networkidle" });
    expect(resp?.status()).toBe(404);
    // The BookingErrorBoundary renders branded copy — assert it, not a raw stack.
    const body = await page.locator("body").innerText();
    expect(body).not.toMatch(/Application Error|Unexpected Server Error/i);
    await expect(
      page.getByRole("heading", { name: /isn.?t available|not available/i })
    ).toBeVisible();
  });
});
