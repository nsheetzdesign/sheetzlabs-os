import { test, expect } from "@playwright/test";

/**
 * Inbox sync-status indicator (Prompt 59 Part 3).
 *
 * The three sync paths (background poll, focus-sync, manual refresh) used to
 * swallow non-ok / thrown responses, so a transient failure looked like a frozen
 * inbox. The header now renders a visible indicator. These tests assert it renders
 * and that a forced-failing manual sync flips it to the amber "sync issue" state
 * with a Retry affordance and an error toast.
 */
test.describe("sync status indicator", () => {
  test("renders in the inbox header", async ({ page }) => {
    await page.goto("/dashboard/inbox", { waitUntil: "networkidle" });
    await expect(page.getByTestId("sync-status")).toBeVisible();
  });

  test("a failing manual sync shows the amber issue state + toast", async ({ page }) => {
    // Force the sync action to report a failed account (res.ok, but success:false).
    await page.route("**/dashboard/inbox/sync", (route) =>
      route.fulfill({
        status: 200,
        contentType: "application/json",
        body: JSON.stringify({
          success: false,
          accounts: [{ email: "e2e@sheetzlabs.com", success: false, error: "forced e2e failure" }],
        }),
      })
    );

    await page.goto("/dashboard/inbox", { waitUntil: "networkidle" });

    // Trigger a manual sync via the Refresh button.
    await page.getByTitle("Sync emails").click();

    // Indicator flips to the amber issue state with Retry.
    const issue = page.locator('[data-testid="sync-status"][data-state="issue"]');
    await expect(issue).toBeVisible();
    await expect(issue.getByText(/sync issue/i)).toBeVisible();
    await expect(issue.getByRole("button", { name: /retry/i })).toBeVisible();

    // Manual failure also toasts.
    await expect(page.getByText(/sync failed/i).first()).toBeVisible();

    // Clicking the chip reveals the underlying error detail (scoped to the detail
    // panel — the toast also contains the error text).
    await issue.getByText(/sync issue/i).click();
    await expect(page.getByTestId("sync-error-detail")).toContainText(/forced e2e failure/i);
  });
});
