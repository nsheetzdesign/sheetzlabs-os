import { test, expect, type Page } from "@playwright/test";
import { admin } from "../lib/supabase";
import { recipientAccount } from "../lib/email";

/**
 * Collapsible primary sidebar (Prompt 61).
 *
 *   ≥1024  fixed rail: collapse to a 64px icon rail ↔ 256px full; persisted to
 *          localStorage; toggle button + Cmd/Ctrl+\ shortcut; tooltips +
 *          accessible labels survive in the collapsed rail; content reflows.
 *   <1024  the rail is replaced by a hamburger-triggered, focus-trapped drawer.
 *
 * The invariant at every size + state: no horizontal PAGE scroll. These pages
 * need no seeded data — the founder session (default storageState) just loads
 * /dashboard, which renders the shell regardless of content.
 */

const EXPANDED_W = 256; // w-64
const COLLAPSED_W = 64; // w-16

async function expectNoPageHScroll(page: Page) {
  const overflow = await page.evaluate(
    () => document.documentElement.scrollWidth - document.documentElement.clientWidth,
  );
  expect(overflow, `page overflows horizontally by ${overflow}px`).toBeLessThanOrEqual(1);
}

async function railWidth(page: Page) {
  return (await page.getByTestId("main-sidebar").boundingBox())!.width;
}

test.describe("collapsible sidebar @ 1440", () => {
  test.use({ viewport: { width: 1440, height: 900 } });

  test("toggle collapses to an icon rail and back; content reflows, no h-scroll", async ({
    page,
  }) => {
    const pageErrors: string[] = [];
    page.on("pageerror", (e) => pageErrors.push(e.message));

    await page.goto("/dashboard", { waitUntil: "networkidle" });

    // Default is expanded (no auto-collapse).
    await expect(page.getByTestId("main-sidebar")).toBeVisible();
    expect(Math.abs((await railWidth(page)) - EXPANDED_W)).toBeLessThan(8);
    await expectNoPageHScroll(page);

    // The content area starts to the right of the full rail.
    const contentExpanded = (await page.getByTestId("dashboard-content").boundingBox())!;

    // Collapse via the bottom toggle. Poll until the width *settles* at the rail
    // (the 200ms transition means a mid-animation read would be larger than 64).
    await page.getByTestId("sidebar-toggle").click();
    await expect.poll(async () => railWidth(page)).toBeLessThan(COLLAPSED_W + 8);
    await expectNoPageHScroll(page);

    // Collapsed rail still exposes each nav item's name (title + aria-label),
    // so the accessible link is reachable even though the text is hidden.
    await expect(page.getByRole("link", { name: "Ventures" })).toBeVisible();
    await expect(page.getByRole("link", { name: "Calendar" })).toBeVisible();
    // Active-route highlight still reads in the rail.
    await expect(page.getByRole("link", { name: "Home" })).toHaveClass(/text-brand/);

    // Content reclaimed the space: its left edge moved left and it grew wider.
    const contentCollapsed = (await page.getByTestId("dashboard-content").boundingBox())!;
    expect(contentCollapsed.x).toBeLessThan(contentExpanded.x - 100);
    expect(contentCollapsed.width).toBeGreaterThan(contentExpanded.width + 100);

    // Expand again.
    await page.getByTestId("sidebar-toggle").click();
    await expect.poll(async () => railWidth(page)).toBeGreaterThan(EXPANDED_W - 8);
    await expectNoPageHScroll(page);

    expect(pageErrors, `uncaught JS errors: ${pageErrors.join("; ")}`).toHaveLength(0);
  });

  test("collapsed state persists across reload", async ({ page }) => {
    await page.goto("/dashboard", { waitUntil: "networkidle" });

    // Ensure collapsed.
    if ((await railWidth(page)) > EXPANDED_W - 100) {
      await page.getByTestId("sidebar-toggle").click();
      await expect.poll(async () => railWidth(page)).toBeLessThan(EXPANDED_W - 100);
    }

    await page.reload({ waitUntil: "networkidle" });
    await expect.poll(async () => railWidth(page)).toBeLessThan(COLLAPSED_W + 8);
    await expectNoPageHScroll(page);

    // Restore expanded for a clean shared localStorage state.
    await page.getByTestId("sidebar-toggle").click();
    await expect.poll(async () => railWidth(page)).toBeGreaterThan(EXPANDED_W - 8);
  });

  test("Cmd/Ctrl+\\ toggles the rail", async ({ page }) => {
    await page.goto("/dashboard", { waitUntil: "networkidle" });
    // Start expanded.
    expect(await railWidth(page)).toBeGreaterThan(EXPANDED_W - 8);

    await page.keyboard.press("Control+\\");
    await expect.poll(async () => railWidth(page)).toBeLessThan(EXPANDED_W - 100);

    await page.keyboard.press("Control+\\");
    await expect.poll(async () => railWidth(page)).toBeGreaterThan(EXPANDED_W - 8);
  });
});

test.describe("sidebar narrow-width drawer @ 900", () => {
  test.use({ viewport: { width: 900, height: 800 } });

  test("rail is hidden; hamburger opens a focus-trapped drawer, Esc closes", async ({ page }) => {
    await page.goto("/dashboard", { waitUntil: "networkidle" });

    // The fixed rail is hidden below lg.
    await expect(page.getByTestId("main-sidebar")).toBeHidden();

    const trigger = page.getByRole("button", { name: "Open navigation menu" });
    await expect(trigger).toBeVisible();
    await trigger.click();

    const drawer = page.getByRole("dialog", { name: "Main navigation" });
    await expect(drawer).toBeVisible();
    await expect(drawer.getByRole("link", { name: "Ventures" })).toBeVisible();
    await expectNoPageHScroll(page);

    await page.keyboard.press("Escape");
    await expect(drawer).toBeHidden();
    await expectNoPageHScroll(page);
  });

  test("on the inbox route the two drawer triggers are distinct", async ({ page }) => {
    await page.goto("/dashboard/inbox", { waitUntil: "networkidle" });

    const navTrigger = page.getByRole("button", { name: "Open navigation menu" });
    const mailTrigger = page.getByRole("button", { name: "Open mailboxes" });
    await expect(navTrigger).toBeVisible();
    await expect(mailTrigger).toBeVisible();

    // Each opens its own, separately-labelled drawer.
    await navTrigger.click();
    await expect(page.getByRole("dialog", { name: "Main navigation" })).toBeVisible();
    await page.keyboard.press("Escape");
    await expect(page.getByRole("dialog", { name: "Main navigation" })).toBeHidden();

    await mailTrigger.click();
    await expect(page.getByRole("dialog", { name: "Mailboxes and folders" })).toBeVisible();
    await page.keyboard.press("Escape");
  });
});

/**
 * Nav indicators (Prompt 68): the Inbox unread badge + the Calendar proximity dot.
 * Both render from the dashboard loader (global unread RPC + today's events). We
 * assert the badge tracks the live unread total and hides at zero, and that the
 * calendar dot is always present with a semantic colour token.
 */
test.describe("nav indicators @ 1440", () => {
  test.use({ viewport: { width: 1440, height: 900 } });

  /** Live global unread inbox total, straight from the same RPC the loader uses. */
  async function readUnread(): Promise<number> {
    const { data } = await admin().rpc("get_email_counts", { p_account_id: null });
    const row = Array.isArray(data) ? data[0] : data;
    return Number(row?.inbox ?? 0) || 0;
  }

  const badgeText = (n: number) => (n > 99 ? "99+" : String(n));

  // The global unread total is SHARED, live state — other tests' syncs can nudge
  // it between reads. So we never assert an absolute remembered number; we assert
  // the badge matches the RPC value read at (near) the same moment, and that
  // seeding/removing a row moves it the right direction.
  async function expectBadgeMatchesLive(page: Page) {
    const badge = page.getByTestId("nav-inbox-badge");
    const live = await readUnread();
    if (live === 0) {
      await expect(badge).toHaveCount(0);
    } else {
      await expect(badge).toHaveText(badgeText(live));
    }
    return live;
  }

  test("inbox badge reflects the unread count and hides at zero", async ({ page }) => {
    // Reflects the live count (and hides when that count is zero).
    await page.goto("/dashboard", { waitUntil: "networkidle" });
    const before = await expectBadgeMatchesLive(page);

    // Seed one UNREAD inbox email → the count goes up; the badge tracks it.
    const recipient = await recipientAccount();
    const { data, error } = await admin()
      .from("emails")
      .insert({
        account_id: recipient.id,
        external_id: `e2e-badge-${Date.now()}`,
        subject: "[E2E] badge unread",
        from_email: "noreply@example.com",
        from_name: "Badge Seed",
        to_emails: [recipient.email],
        body_text: "unread badge seed",
        folder: "INBOX",
        is_read: false,
        is_archived: false,
        is_trashed: false,
        is_spam: false,
        is_deleted: false,
        received_at: new Date().toISOString(),
      })
      .select("id")
      .single();
    expect(error, error?.message).toBeFalsy();
    const seededId = (data as { id: string } | null)?.id;
    expect(seededId).toBeTruthy();

    try {
      await page.reload({ waitUntil: "networkidle" });
      const withSeed = await expectBadgeMatchesLive(page);
      expect(withSeed, "seeding an unread row should raise the count").toBeGreaterThan(before);
      await expect(page.getByTestId("nav-inbox-badge")).toBeVisible();

      // Collapsed rail shows the presence dot instead of the number.
      await page.getByTestId("sidebar-toggle").click();
      await expect(page.getByTestId("nav-inbox-dot")).toBeVisible();
      await page.getByTestId("sidebar-toggle").click(); // restore expanded
    } finally {
      await admin().from("emails").delete().eq("id", seededId);
    }

    // After removing the seed the badge again matches the live count.
    await page.reload({ waitUntil: "networkidle" });
    await expectBadgeMatchesLive(page);
  });

  test("calendar proximity dot is always present with a semantic colour", async ({ page }) => {
    await page.goto("/dashboard", { waitUntil: "networkidle" });
    const dot = page.getByTestId("nav-calendar-dot");
    await expect(dot).toBeVisible();
    // One of the four semantic tokens (no hardcoded hex).
    await expect(dot).toHaveClass(/bg-(success|caution|warning|danger)/);
  });
});
