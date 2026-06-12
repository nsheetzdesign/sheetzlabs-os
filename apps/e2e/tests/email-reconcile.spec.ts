import { test, expect } from "@playwright/test";
import { api } from "../lib/api";
import { admin } from "../lib/supabase";
import {
  primaryAccount,
  recipientAccount,
  send,
  findBySubject,
  findById,
  trigger,
  purgeSubject,
  type EmailAccount,
} from "../lib/email";
import { pollFor } from "../lib/poll";
import { e2eSubject } from "../lib/tags";

/**
 * Gmail full-state reconciliation (Prompt 59 Part 1/2).
 *
 * Deterministic fabricated-drift approach (the prompt's preferred variant): seed
 * an [E2E] email into the inbox, archive it through the app (so Gmail's
 * authoritative state is "archived"), then forcibly flip the LOCAL row back to an
 * active-INBOX state via the service client to manufacture exactly the fossil the
 * engine exists to repair. Running the reconcile endpoint must re-derive the row
 * from Gmail's truth and undo the drift.
 */
test.describe.configure({ mode: "serial" });

test.describe("email reconcile", () => {
  let sender: EmailAccount;
  let recipient: EmailAccount;
  const subject = e2eSubject("reconcile");

  test.beforeAll(async () => {
    sender = await primaryAccount();
    recipient = await recipientAccount();
  });

  test.afterAll(async () => {
    await purgeSubject(subject);
  });

  test("reconcile repairs a fabricated INBOX fossil", async () => {
    test.setTimeout(240_000);

    // 1. Seed an inbox email on the recipient account.
    await send(sender, recipient.email, subject, "Reconcile drift body.");
    const inboxEmail = await pollFor(
      async () => {
        await trigger(recipient.id);
        return findBySubject(subject, { folder: "INBOX" });
      },
      { timeoutMs: 180_000, intervalMs: 15_000, label: "reconcile seed in inbox" }
    );
    const id = inboxEmail.id;

    // 2. Archive it through the real API (Gmail-first write-back removes INBOX).
    const arch = await api("/email/bulk", {
      method: "POST",
      body: JSON.stringify({ action: "archive", email_ids: [id] }),
    });
    expect(arch.ok).toBeTruthy();
    const archived = await pollFor(
      async () => {
        const r = await findById(id);
        return r?.is_archived ? r : null;
      },
      { timeoutMs: 30_000, intervalMs: 3_000, label: "archived locally" }
    );
    expect(archived.is_archived).toBe(true);

    // 3. Fabricate the fossil: local says active-INBOX, Gmail says archived.
    const { error: driftErr } = await admin()
      .from("emails")
      .update({ folder: "INBOX", is_archived: false, is_trashed: false, is_spam: false })
      .eq("id", id);
    expect(driftErr, driftErr?.message).toBeFalsy();

    // Sanity: the drift is in place.
    const drifted = await findById(id);
    expect(drifted?.is_archived).toBe(false);
    expect(drifted?.folder).toBe("INBOX");

    // 4. Run the reconcile endpoint for the recipient account.
    const recon = await api<{
      success?: boolean;
      complete?: boolean;
      summary?: { folder_fixed: number; read_fixed: number; starred_fixed: number; deleted: number };
    }>(`/email/accounts/${recipient.id}/reconcile`, { method: "POST" });
    expect(recon.ok, JSON.stringify(recon.body)).toBeTruthy();
    expect(recon.body.success).toBe(true);
    // Our fabricated row is a guaranteed folder-drift candidate, so at least one fix.
    expect(recon.body.summary?.folder_fixed ?? 0).toBeGreaterThanOrEqual(1);

    // 5. The row is corrected back to Gmail's truth (archived).
    const fixed = await findById(id);
    expect(fixed?.is_archived).toBe(true);
  });
});
