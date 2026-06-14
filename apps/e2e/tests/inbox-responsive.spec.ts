import { test, expect, type Page } from "@playwright/test";
import { primaryAccount, recipientAccount, send, findBySubject, trigger, purgeSubject } from "../lib/email";
import { pollFor } from "../lib/poll";
import { e2eSubject } from "../lib/tags";
import { admin } from "../lib/supabase";

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

/**
 * Email iframe containment (Prompt 68). A fixed-width newsletter (1200px table +
 * an unbreakable line + a 1200px image) must render INSIDE the preview-pane iframe
 * — horizontal scroll lives in the iframe document, never on the pane or page.
 *
 * The prior responsive specs exercised the empty/selection state; this opens a
 * deliberately-too-wide HTML email. We insert the row straight into the DB (the
 * web inbox reads from the DB) so we control the body_html exactly and skip the
 * Gmail round-trip.
 */
test.describe("email iframe containment", () => {
  const subject = e2eSubject("wide-html");
  let emailId: string | null = null;

  // A rigid newsletter far wider than any half-screen pane.
  const WIDE_HTML = `
    <table width="1200" cellpadding="0" cellspacing="0" style="width:1200px;border-collapse:collapse">
      <tr><td style="width:1200px;background:#003a9b;color:#fff;padding:24px;font-size:28px">
        Jobs picked for you
      </td></tr>
      <tr><td style="width:1200px;padding:24px">
        <p style="white-space:nowrap;font-size:16px">
          ThisIsADeliberatelyUnbreakableSingleWordThatIsFarWiderThanAnyHalfScreenReadingPaneToForceHorizontalOverflowInsideTheIframeDocumentBodyXXXXXXXXXXXXXXXXXXXX
        </p>
        <img src="https://example.com/banner.png" width="1200" height="200"
             alt="banner" style="width:1200px;height:200px;display:block;background:#ddd" />
      </td></tr>
    </table>`;

  test.beforeAll(async () => {
    const recipient = await recipientAccount();
    const { data, error } = await admin()
      .from("emails")
      .insert({
        account_id: recipient.id,
        external_id: `e2e-wide-${Date.now()}`,
        subject,
        from_email: "newsletter@example.com",
        from_name: "Wide Newsletter",
        to_emails: [recipient.email],
        body_html: WIDE_HTML,
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
    emailId = (data as { id: string } | null)?.id ?? null;
    expect(emailId).toBeTruthy();
  });

  test.afterAll(async () => {
    if (emailId) await admin().from("emails").delete().eq("id", emailId);
  });

  for (const width of [1440, 900] as const) {
    test(`wide HTML email stays inside the pane — no page h-scroll @ ${width}`, async ({ page }) => {
      await page.setViewportSize({ width, height: 900 });
      await page.goto("/dashboard/inbox", { waitUntil: "networkidle" });

      // Open our seeded wide email.
      const row = page.getByTestId("email-row").filter({ hasText: "wide-html" }).first();
      await expect(row).toBeVisible();
      await row.click();

      // The sandboxed iframe renders the body.
      const iframeEl = page.locator('iframe[title="Email content"]');
      await expect(iframeEl).toBeVisible();
      await expectNoPageHScroll(page);

      // The iframe element itself never exceeds the viewport (it's clamped to its
      // pane), so the 1200px content cannot bleed onto the page.
      const ifBox = (await iframeEl.boundingBox())!;
      expect(ifBox.width, "iframe wider than viewport").toBeLessThanOrEqual(width + 1);

      // And the overflow is REAL but contained: the iframe document scrolls
      // horizontally inside itself (content wider than the iframe viewport).
      const cf = await (await iframeEl.elementHandle())!.contentFrame();
      const dims = await cf!.evaluate(() => ({
        scrollW: document.body.scrollWidth,
        clientW: document.documentElement.clientWidth,
      }));
      expect(dims.scrollW, "expected the 1200px content to overflow the iframe").toBeGreaterThan(
        dims.clientW,
      );

      await expectNoPageHScroll(page);
    });
  }
});
