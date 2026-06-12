/** Email-domain helpers for the e2e suite (seed via real API, assert via DB). */
import { admin } from "./supabase";
import { api, syncEmailAccount } from "./api";

export interface EmailAccount {
  id: string;
  email: string;
}

let _accounts: EmailAccount[] | null = null;

async function loadAccounts(): Promise<EmailAccount[]> {
  if (_accounts) return _accounts;
  const { data, error } = await admin()
    .from("email_accounts")
    .select("id, email")
    .eq("sync_enabled", true)
    .eq("needs_reauth", false)
    .order("email");
  if (error || !data?.length) throw new Error(`No usable email account: ${error?.message}`);
  _accounts = data as EmailAccount[];
  return _accounts;
}

/** Sender account. */
export async function primaryAccount(): Promise<EmailAccount> {
  return (await loadAccounts())[0];
}

/**
 * Recipient account — a DIFFERENT founder account so a sent message lands cleanly
 * in an INBOX. (A Gmail self-send to the same address gets both SENT+INBOX labels
 * and our folder logic classifies it SENT, so it would never show in Inbox.) Falls
 * back to the primary if only one account exists (round-trip then degrades to Sent).
 */
export async function recipientAccount(): Promise<EmailAccount> {
  const accts = await loadAccounts();
  return accts[1] ?? accts[0];
}

export interface SentResult {
  draftId: string;
  externalId: string | null;
  threadId: string | null;
}

/** Create + send a message via the real API send path (from `account` to `toEmail`). */
export async function send(
  account: EmailAccount,
  toEmail: string,
  subject: string,
  body: string,
  replyToEmailId?: string
): Promise<SentResult> {
  const draftPayload: Record<string, unknown> = {
    account_id: account.id,
    to_emails: [toEmail],
    subject,
    body_text: body,
    status: "draft",
  };
  if (replyToEmailId) draftPayload.reply_to_email_id = replyToEmailId;

  const draftRes = await api<{ draft?: { id: string } }>("/email/drafts", {
    method: "POST",
    body: JSON.stringify(draftPayload),
  });
  const draftId = draftRes.body?.draft?.id;
  if (!draftRes.ok || !draftId) {
    throw new Error(`draft create failed: ${draftRes.status} ${JSON.stringify(draftRes.body)}`);
  }

  const sendRes = await api<{ success?: boolean; id?: string; threadId?: string }>(
    `/email/drafts/${draftId}/send`,
    { method: "POST" }
  );
  if (!sendRes.ok || !sendRes.body?.success) {
    throw new Error(`send failed: ${sendRes.status} ${JSON.stringify(sendRes.body)}`);
  }
  return {
    draftId,
    externalId: sendRes.body.id ?? null,
    threadId: sendRes.body.threadId ?? null,
  };
}

export interface EmailRow {
  id: string;
  external_id: string;
  thread_id: string | null;
  subject: string;
  folder: string;
  is_starred: boolean;
  is_archived: boolean;
  is_trashed: boolean;
  is_deleted: boolean;
}

const EMAIL_COLS =
  "id, external_id, thread_id, subject, folder, is_starred, is_archived, is_trashed, is_deleted";

// Match by `ilike %subject%` rather than equality so a threaded reply (which the
// send path prefixes with "Re: ") is still found by its original subject token.
const contains = (s: string) => `%${s}%`;

/** Find a single email whose subject contains `subject`, optionally by folder. */
export async function findBySubject(
  subject: string,
  opts: { folder?: string; includeDeleted?: boolean } = {}
): Promise<EmailRow | null> {
  let q = admin().from("emails").select(EMAIL_COLS).ilike("subject", contains(subject));
  if (opts.folder) q = q.eq("folder", opts.folder);
  if (!opts.includeDeleted) q = q.eq("is_deleted", false);
  const { data } = await q.order("received_at", { ascending: false }).limit(1);
  return (data?.[0] as EmailRow | undefined) ?? null;
}

/** Fetch one email row by id (the specific copy a write-back mutated). */
export async function findById(id: string): Promise<EmailRow | null> {
  const { data } = await admin().from("emails").select(EMAIL_COLS).eq("id", id).single();
  return (data as EmailRow | null) ?? null;
}

/** All rows whose subject contains `subject` (e.g. SENT + INBOX copies, replies). */
export async function allBySubject(subject: string): Promise<EmailRow[]> {
  const { data } = await admin()
    .from("emails")
    .select(EMAIL_COLS)
    .ilike("subject", contains(subject))
    .eq("is_deleted", false);
  return (data ?? []) as EmailRow[];
}

export async function trigger(accountId: string) {
  return syncEmailAccount(accountId);
}

/** Hard-clean every trace of a subject (incl. "Re:" replies): trash via Gmail
 *  write-back, then local purge. */
export async function purgeSubject(subject: string) {
  const rows = await allBySubject(subject);
  const ids = rows.map((r) => r.id);
  if (ids.length) {
    await api("/email/bulk", {
      method: "POST",
      body: JSON.stringify({ action: "trash", email_ids: ids }),
    }).catch(() => null);
    // Local soft-delete backstop so nothing lingers in the founder's lists.
    await admin().from("emails").update({ is_trashed: true, is_deleted: true }).in("id", ids);
  }
  // Drop any drafts with this subject too.
  try {
    await admin().from("email_drafts").delete().ilike("subject", `%${subject}%`);
  } catch {
    /* best-effort */
  }
}
