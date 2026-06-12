import { test, expect, type Page } from "@playwright/test";
import { primaryAccount, recipientAccount, send, findBySubject, trigger, purgeSubject } from "../lib/email";
import { pollFor } from "../lib/poll";
import { e2eSubject } from "../lib/tags";

/**
 * Responsive inbox layout (Prompt 60). Runs the "inbox loads" + one selection
 * flow across a viewport matrix and asserts the per-breakpoint behaviour:
 *
 *   ≥1280  three-pane: list + preview side-by-side, draggable divider, no back control
 *   <1280  two-pane:   selecting an email overlays the preview with a Back control
 *   <1024  nav collapses to a hamburger-triggered, focus-trapped drawer
 *
 * The invariant at every size: no horizontal PAGE scroll (scrollWidth ≤ innerWidth)
 * and the list is always reachable. The e2e mailbox is otherwise empty, so we seed
 * one tagged INBOX email up front (so there's a row to select) and purge it after.
 */

async function expectNoPageHScroll(page: Page) {
  const overflow = await page.evaluate(
    () => document.documentElement.scrollWidth - document.documentElement.clientWidth,
  );
  // Allow 1px for sub-pixel rounding; anything more is a real horizontal bleed.
  expect(overflow, `page overflows horizontally by ${overflow}px`).toBeLessThanOrEqual(1);
}

const VIEWPORTS = [
  { name: "desktop 1440", width: 1440, height: 900, threePane: true, inlineNav: true },
  { name: "split 1100", width: 1100, height: 800, threePane: false, inlineNav: true },
  { name: "tablet 900", width: 900, height: 800, threePane: false, inlineNav: false },
  { name: "mobile 390", width: 390, height: 844, threePane: false, inlineNav: false },
] as const;

test.describe("inbox responsive layout", () => {
  const subject = e2eSubject("responsive");

  test.beforeAll(async () => {
    test.setTimeout(200_000);
    const sender = await primaryAccount();
    const recipient = await recipientAccount();
    await send(sender, recipient.email, subject, "Responsive layout seed body.");
    // The web inbox reads straight from the DB, so we only need the INBOX row to
    // land — trigger the recipient sync and poll until it does (≤ ~3 min).
    await pollFor(
      async () => {
        await trigger(recipient.id);
        return findBySubject(subject, { folder: "INBOX" });
      },
      { timeoutMs: 180_000, intervalMs: 15_000, label: "seed inbox arrival" },
    );
  });

  test.afterAll(async () => {
    await purgeSubject(subject);
  });

  for (const vp of VIEWPORTS) {
    test(`loads + selects with no page overflow @ ${vp.name}`, async ({ page }) => {
      const pageErrors: string[] = [];
      page.on("pageerror", (e) => pageErrors.push(e.message));

      await page.setViewportSize({ width: vp.width, height: vp.height });
      await page.goto("/dashboard/inbox", { waitUntil: "networkidle" });

      // List is present and reachable at every size.
      const firstRow = page.getByTestId("email-row").first();
      await expect(firstRow).toBeVisible();
      await expect(page.getByTestId("inbox-list-pane")).toBeVisible();
      await expectNoPageHScroll(page);

      // Nav: inline at ≥lg, hamburger drawer below it.
      const hamburger = page.getByRole("button", { name: "Open mailboxes" });
      if (vp.inlineNav) {
        await expect(hamburger).toBeHidden();
      } else {
        await expect(hamburger).toBeVisible();
        await hamburger.click();
        const drawer = page.getByRole("dialog", { name: "Mailboxes and folders" });
        await expect(drawer).toBeVisible();
        await expectNoPageHScroll(page);
        // Esc closes the focus-trapped drawer.
        await page.keyboard.press("Escape");
        await expect(drawer).toBeHidden();
      }

      // Selection flow.
      await firstRow.click();
      const back = page.getByRole("button", { name: "Back to list" });

      if (vp.threePane) {
        // Three-pane: list stays beside the preview, divider present, no back.
        await expect(page.getByTestId("inbox-list-pane")).toBeVisible();
        await expect(page.getByTestId("inbox-divider")).toBeVisible();
        await expect(back).toBeHidden();
      } else {
        // Overlay: preview covers the list with a Back control; back returns.
        await expect(back).toBeVisible();
        await expectNoPageHScroll(page);
        await back.click();
        await expect(page.getByTestId("email-row").first()).toBeVisible();
      }

      await expectNoPageHScroll(page);
      expect(pageErrors, `uncaught JS errors: ${pageErrors.join("; ")}`).toHaveLength(0);
    });
  }

  test("divider drag resizes the list and persists across reload", async ({ page }) => {
    await page.setViewportSize({ width: 1440, height: 900 });
    await page.goto("/dashboard/inbox", { waitUntil: "networkidle" });

    const listPane = page.getByTestId("inbox-list-pane");
    await expect(listPane).toBeVisible();
    const before = (await listPane.boundingBox())!.width;

    const divider = page.getByTestId("inbox-divider");
    const box = (await divider.boundingBox())!;
    const cy = box.y + box.height / 2;

    // Drag the divider ~140px to the right (pointer events).
    await page.mouse.move(box.x + box.width / 2, cy);
    await page.mouse.down();
    await page.mouse.move(box.x + 140, cy, { steps: 12 });
    await page.mouse.up();

    const after = (await listPane.boundingBox())!.width;
    expect(after, "list pane should widen after dragging right").toBeGreaterThan(before + 60);

    // Width survives a reload (persisted to localStorage).
    await page.reload({ waitUntil: "networkidle" });
    const reloaded = (await page.getByTestId("inbox-list-pane").boundingBox())!.width;
    expect(Math.abs(reloaded - after), "persisted width should match").toBeLessThan(8);

    // Double-click resets back toward the default.
    await page.getByTestId("inbox-divider").dblclick();
    const reset = (await page.getByTestId("inbox-list-pane").boundingBox())!.width;
    expect(reset, "double-click resets the divider").toBeLessThan(after - 40);
  });
});
