import { test, expect } from "@playwright/test";
import { api } from "../lib/api";
import { primaryAccount } from "../lib/email";
import { admin } from "../lib/supabase";
import { e2eSubject } from "../lib/tags";

/**
 * Prompt 54B Part 0.1: a scheduled send (an `email_drafts` row with a future
 * send_at) must be visible AND cancellable in the Drafts view — otherwise it's
 * invisible and unrecoverable once the undo toast expires. Authenticated suite.
 */
test.describe("scheduled drafts", () => {
  let draftId: string;
  const subject = e2eSubject("scheduled");

  test.beforeAll(async () => {
    const account = await primaryAccount();
    // Schedule an hour out so the every-minute cron can't claim it mid-test.
    const sendAt = new Date(Date.now() + 60 * 60 * 1000).toISOString();
    const res = await api<{ draft?: { id: string } }>("/email/drafts", {
      method: "POST",
      body: JSON.stringify({
        account_id: account.id,
        to_emails: ["e2e@sheetzlabs.com"],
        subject,
        body_text: "[E2E] scheduled body",
        status: "scheduled",
        send_at: sendAt,
        last_auto_saved_at: new Date().toISOString(),
      }),
    });
    if (!res.ok || !res.body?.draft?.id) {
      throw new Error(`seed scheduled draft failed: ${res.status} ${JSON.stringify(res.body)}`);
    }
    draftId = res.body.draft.id;
  });

  test.afterAll(async () => {
    if (draftId) await admin().from("email_drafts").delete().eq("id", draftId);
  });

  test("scheduled draft is visible in Drafts and can be cancelled", async ({ page }) => {
    await page.goto("/dashboard/inbox?folder=drafts", { waitUntil: "networkidle" });

    const row = page.getByTestId("scheduled-draft-row").filter({ hasText: subject });
    await expect(row).toBeVisible({ timeout: 15_000 });

    await row.getByRole("button", { name: /Cancel/i }).click();

    // The row leaves the Scheduled list once it flips back to a plain draft.
    await expect(row).toBeHidden({ timeout: 15_000 });

    // Authoritative check: the draft is now status='draft', not 'scheduled'.
    const { data } = await admin()
      .from("email_drafts")
      .select("status")
      .eq("id", draftId)
      .single();
    expect(data?.status).toBe("draft");
  });
});
