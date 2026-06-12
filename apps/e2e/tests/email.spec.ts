import { test, expect } from "@playwright/test";
import { api } from "../lib/api";
import {
  primaryAccount,
  recipientAccount,
  send,
  findBySubject,
  findById,
  allBySubject,
  trigger,
  purgeSubject,
  type EmailAccount,
  type EmailRow,
} from "../lib/email";
import { pollFor } from "../lib/poll";
import { e2eSubject } from "../lib/tags";

/**
 * Email smoke suite. Serial: a single seeded round-trip email is reused by the
 * write-back / reply / snooze checks (the prompt's "on the seeded email"). All
 * artifacts are tagged [E2E] and purged in afterAll — including on failure.
 */
test.describe.configure({ mode: "serial" });

test.describe("email", () => {
  let sender: EmailAccount;
  let recipient: EmailAccount;
  const subject = e2eSubject("send");
  let inboxEmail: EmailRow; // the INBOX copy on the recipient account
  const createdSubjects: string[] = [subject];

  test.beforeAll(async () => {
    sender = await primaryAccount();
    recipient = await recipientAccount();
  });

  test.afterAll(async () => {
    for (const s of createdSubjects) await purgeSubject(s);
  });

  test("inbox loads with accounts, folders, and a non-empty list", async ({ page }) => {
    const pageErrors: string[] = [];
    page.on("pageerror", (e) => pageErrors.push(e.message));

    await page.goto("/dashboard/inbox", { waitUntil: "networkidle" });

    // Sidebar account renders. The sidebar shows the account's local-part (it has
    // rendered `email.split('@')[0]` for ~3 months); the full address only appears
    // in the settings panel, not the always-visible list. Asserting the full
    // address made this canary depend on the founder's live mailbox happening to
    // surface it in a visible row — flaky. Assert the local-part the sidebar
    // actually renders.
    const localPart = sender.email.split("@")[0];
    await expect(page.getByText(localPart, { exact: false }).first()).toBeVisible();
    // The Inbox folder label is present.
    await expect(page.getByText(/Inbox/i).first()).toBeVisible();
    // The message list has at least one row (founder mailbox is non-empty).
    await expect(page.getByTestId("email-row").first()).toBeVisible();

    expect(pageErrors, `uncaught JS errors: ${pageErrors.join("; ")}`).toHaveLength(0);
  });

  test("send round-trip: Sent immediately, Inbox within 2 sync cycles", async () => {
    const sent = await send(sender, recipient.email, subject, "Round-trip body.");
    expect(sent.externalId).toBeTruthy();

    // Sent copy is written immediately on the sender account (no sync needed).
    const sentRow = await pollFor(
      async () => {
        const rows = await allBySubject(subject);
        return rows.find((r) => r.folder === "SENT") ?? null;
      },
      { timeoutMs: 30_000, intervalMs: 2_000, label: "Sent row" }
    );
    expect(sentRow.folder).toBe("SENT");

    // Inbox copy on the recipient — trigger sync and poll (≤ ~3 min).
    inboxEmail = await pollFor(
      async () => {
        await trigger(recipient.id);
        return findBySubject(subject, { folder: "INBOX" });
      },
      { timeoutMs: 180_000, intervalMs: 15_000, label: "Inbox arrival" }
    );
    expect(inboxEmail.folder).toBe("INBOX");
    expect(inboxEmail.is_trashed).toBe(false);
  });

  test("write-back self-verifying loop: star → archive → trash survive sync", async () => {
    test.setTimeout(180_000); // three write-back + sync cycles
    expect(inboxEmail, "depends on the seeded inbox email").toBeTruthy();
    // Mutate + verify the SPECIFIC INBOX copy by id — querying by subject could
    // return the sender's SENT copy, which these flags never touch.
    const id = inboxEmail.id;

    // STAR → sync → still starred (reverts if write-back to Gmail silently failed).
    let res = await api("/email/bulk", {
      method: "POST",
      body: JSON.stringify({ action: "star", email_ids: [id] }),
    });
    expect(res.ok).toBeTruthy();
    const starred = await pollFor(
      async () => {
        await trigger(recipient.id);
        const r = await findById(id);
        return r?.is_starred ? r : null;
      },
      { timeoutMs: 60_000, intervalMs: 10_000, label: "still starred after sync" }
    );
    expect(starred.is_starred).toBe(true);

    // ARCHIVE → sync → archived (and no longer an active inbox row).
    res = await api("/email/bulk", {
      method: "POST",
      body: JSON.stringify({ action: "archive", email_ids: [id] }),
    });
    expect(res.ok).toBeTruthy();
    const archived = await pollFor(
      async () => {
        await trigger(recipient.id);
        const r = await findById(id);
        return r && r.is_archived && !r.is_trashed ? r : null;
      },
      { timeoutMs: 60_000, intervalMs: 10_000, label: "archived after sync" }
    );
    expect(archived.is_archived).toBe(true);

    // TRASH → sync → in Trash.
    res = await api("/email/bulk", {
      method: "POST",
      body: JSON.stringify({ action: "trash", email_ids: [id] }),
    });
    expect(res.ok).toBeTruthy();
    const trashed = await pollFor(
      async () => {
        await trigger(recipient.id);
        const r = await findById(id);
        return r?.is_trashed ? r : null;
      },
      { timeoutMs: 60_000, intervalMs: 10_000, label: "trashed after sync" }
    );
    expect(trashed.is_trashed).toBe(true);
  });

  test("reply threading: reply shares the thread and the thread renders both", async () => {
    // Re-seed a fresh inbox email (the prior one was trashed by the write-back test).
    const replySubject = e2eSubject("thread");
    createdSubjects.push(replySubject);
    await send(sender, recipient.email, replySubject, "Original for threading.");
    const original = await pollFor(
      async () => {
        await trigger(recipient.id);
        return findBySubject(replySubject, { folder: "INBOX" });
      },
      { timeoutMs: 180_000, intervalMs: 15_000, label: "threading original in inbox" }
    );
    expect(original.thread_id).toBeTruthy();

    // Reply from the recipient account back to the sender, threaded on the original.
    // (The send path prefixes "Re: ", so we key off the shared thread, not subject.)
    await send(recipient, sender.email, replySubject, "The reply.", original.id);

    // The thread view endpoint returns both the original and the reply.
    const threadMsgs = await pollFor(
      async () => {
        const res = await api<{ thread?: unknown[] }>(`/email/thread/${original.thread_id}`);
        const msgs = (res.body.thread ?? []) as unknown[];
        return msgs.length >= 2 ? msgs : null;
      },
      { timeoutMs: 60_000, intervalMs: 5_000, label: "two messages in thread" }
    );
    expect(threadMsgs.length).toBeGreaterThanOrEqual(2);
  });

  test("undo archive (54A feature-gated)", async () => {
    // The undo endpoint ships in 54A. Skip cleanly until it exists so this spec is
    // valid both before and after that lands.
    const probe = await api("/email/undo", { method: "POST", body: JSON.stringify({}) });
    test.skip(probe.status === 404, "undo endpoint not present yet (pre-54A)");

    const undoSubject = e2eSubject("undo");
    createdSubjects.push(undoSubject);
    await send(sender, recipient.email, undoSubject, "Undo body.");
    const seeded = await pollFor(
      async () => {
        await trigger(recipient.id);
        return findBySubject(undoSubject, { folder: "INBOX" });
      },
      { timeoutMs: 180_000, intervalMs: 15_000, label: "undo seed in inbox" }
    );
    await api("/email/bulk", {
      method: "POST",
      body: JSON.stringify({ action: "archive", email_ids: [seeded.id] }),
    });
    const undo = await api("/email/undo", { method: "POST", body: JSON.stringify({}) });
    expect(undo.ok).toBeTruthy();
    const back = await findBySubject(undoSubject, { folder: "INBOX" });
    expect(back?.is_archived ?? true).toBeFalsy();
  });

  test("search: finds seeded subject; injection string is handled safely", async () => {
    // Seed a findable, currently-live email.
    const searchSubject = e2eSubject("search");
    createdSubjects.push(searchSubject);
    await send(sender, recipient.email, searchSubject, "Searchable body.");
    await pollFor(
      async () => {
        await trigger(recipient.id);
        return findBySubject(searchSubject, {});
      },
      { timeoutMs: 180_000, intervalMs: 15_000, label: "search seed synced" }
    );

    const found = await api<{ emails?: Array<{ subject: string }> }>(
      `/email/search?q=${encodeURIComponent(searchSubject)}`
    );
    expect(found.ok).toBeTruthy();
    expect((found.body.emails ?? []).some((e) => e.subject === searchSubject)).toBeTruthy();

    // SQL/LIKE injection attempt → no 500, sane (likely empty) result.
    const inject = await api<{ emails?: unknown[] }>(
      `/email/search?q=${encodeURIComponent("test,)inject")}`
    );
    expect(inject.status).toBeLessThan(500);
    expect(Array.isArray(inject.body.emails ?? [])).toBeTruthy();
  });

  test("snooze: leaves inbox then returns", async () => {
    // Inbox arrival + a ~15s snooze + the every-minute unsnooze cron + sync.
    test.setTimeout(240_000);
    const snoozeSubject = e2eSubject("snooze");
    createdSubjects.push(snoozeSubject);
    await send(sender, recipient.email, snoozeSubject, "Snooze body.");
    const seeded = await pollFor(
      async () => {
        await trigger(recipient.id);
        return findBySubject(snoozeSubject, { folder: "INBOX" });
      },
      { timeoutMs: 150_000, intervalMs: 15_000, label: "snooze seed in inbox" }
    );

    // Short snooze so the every-minute cron returns it quickly; still far enough
    // out that the "left the inbox" check below reliably runs before the cron tick.
    const until = new Date(Date.now() + 15_000).toISOString();
    const sres = await api(`/email/${seeded.id}/snooze`, {
      method: "POST",
      body: JSON.stringify({ until }),
    });
    expect(sres.ok).toBeTruthy();

    // Left the inbox (snoozed_until set, moved out of INBOX).
    const left = await findById(seeded.id);
    expect(left?.folder).not.toBe("INBOX");

    // The minute-cron unsnooze restores it to INBOX.
    const returned = await pollFor(
      async () => {
        const r = await findById(seeded.id);
        return r?.folder === "INBOX" ? r : null;
      },
      { timeoutMs: 150_000, intervalMs: 10_000, label: "snooze return to inbox" }
    );
    expect(returned.folder).toBe("INBOX");
  });

  test("reconnect banner absent: all accounts healthy (canary)", async ({ page }) => {
    const res = await api<{ accounts?: Array<{ needs_reauth?: boolean; email: string }> }>(
      "/email/accounts"
    );
    expect(res.ok).toBeTruthy();
    const flagged = (res.body.accounts ?? []).filter((a) => a.needs_reauth);
    expect(flagged, `accounts needing reauth: ${flagged.map((a) => a.email).join(", ")}`).toHaveLength(0);

    // And the inbox UI shows no "reconnect"/"reauth" banner.
    await page.goto("/dashboard/inbox", { waitUntil: "networkidle" });
    await expect(page.getByText(/reconnect|needs to be reconnected|re-?authenticate/i)).toHaveCount(0);
  });
});
