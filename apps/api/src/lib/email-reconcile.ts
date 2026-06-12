/**
 * Gmail full-state reconciliation (Prompt 59 Part 1).
 *
 * History sync only moves forward. A label change made on another device during
 * the pre-52A era — when sync ignored label deltas — left the local row frozen:
 * the classic fossil is `folder='INBOX'` for mail Gmail archived months ago.
 * Nothing in the forward-only delta path ever reconciles that backlog.
 *
 * This engine does a periodic SET-DIFF against Gmail's authoritative label sets
 * and repairs drift. For each of INBOX / UNREAD / STARRED / TRASH / SPAM it pages
 * `users.messages.list(labelIds=X, fields=id)` to build Gmail's id set, then:
 *
 *  - UNREAD / STARRED: set membership IS the truth — correct the local boolean in
 *    bulk, no per-message metadata fetch needed.
 *  - INBOX drift (local "active inbox" state disagrees with Gmail's INBOX set):
 *    fetch that one message's labelIds (`format=minimal`) and re-derive the true
 *    state via the shared `applyLabelStateToEmail` — it may be archived, trashed,
 *    spam, or fully deleted (a metadata 404 → `is_deleted`).
 *  - Gmail INBOX ids with no local row at all: count only (full sync's job to
 *    import; reconcile never imports).
 *
 * The per-message metadata fetches are the only unbounded cost, so they're capped
 * per run (`METADATA_BUDGET`); a backlog larger than the cap leaves a
 * `reconcile_cursor` so the next cron tick continues — same shape as the
 * `sync_page_token` / `calendar_accounts.sync_cursor` continuations. The cheap
 * set-diff re-runs each pass and naturally re-discovers the still-drifted rows, so
 * the cursor only needs to carry "work remains", not the id list.
 */
import { applyLabelStateToEmail } from "../routes/email";
import { getValidAccessToken, ReauthRequiredError } from "./google-auth";

const GMAIL_API = "https://gmail.googleapis.com/gmail/v1/users/me";

// Per-run caps keep total Gmail subrequests well under the Workers 1,000 limit and
// share politely with the email/calendar syncs running in the same cron tick.
const LIST_PAGE_SIZE = 500; // ids per messages.list page
const MAX_LIST_PAGES = 50; // safety cap per label (≈25k ids) — founder mailbox is far under
const METADATA_BUDGET = 150; // per-message re-derives per run; remainder → reconcile_cursor

export interface ReconcileSummary {
  folder_fixed: number; // INBOX-drift rows re-derived to their true folder/flags
  read_fixed: number; // is_read corrected from the UNREAD set
  starred_fixed: number; // is_starred corrected from the STARRED set
  deleted: number; // drifted rows whose Gmail message 404'd → soft-deleted
  missing_local: number; // Gmail INBOX ids with no local row (full sync's job)
}

export interface ReconcileResult {
  account_id: string;
  email: string;
  complete: boolean;
  pending: number; // folder candidates still awaiting a metadata re-derive
  summary: ReconcileSummary;
  skipped?: string;
  error?: string;
}

const EMPTY_SUMMARY = (): ReconcileSummary => ({
  folder_fixed: 0,
  read_fixed: 0,
  starred_fixed: 0,
  deleted: 0,
  missing_local: 0,
});

function chunk<T>(arr: T[], size: number): T[][] {
  const out: T[][] = [];
  for (let i = 0; i < arr.length; i += size) out.push(arr.slice(i, i + size));
  return out;
}

/**
 * Parse a JSON response that may legitimately be EMPTY. With a `fields` mask, the
 * Gmail API returns a zero-length body when the mask selects nothing present —
 * e.g. a label page with no messages and no nextPageToken, or a message with no
 * labelIds. `res.json()` would throw "Unexpected end of JSON input" on that, so
 * read text first and treat empty as `{}`.
 */
async function jsonOrEmpty<T>(res: Response): Promise<T> {
  const text = await res.text();
  return (text ? JSON.parse(text) : {}) as T;
}

/** Page messages.list for a label into a Set of Gmail message ids. */
async function fetchLabelIdSet(
  accessToken: string,
  labelId: string,
  includeSpamTrash: boolean
): Promise<{ ids: Set<string>; truncated: boolean }> {
  const ids = new Set<string>();
  let pageToken: string | undefined;
  let pages = 0;
  do {
    const url = new URL(`${GMAIL_API}/messages`);
    url.searchParams.set("labelIds", labelId);
    url.searchParams.set("maxResults", String(LIST_PAGE_SIZE));
    url.searchParams.set("fields", "messages/id,nextPageToken");
    if (includeSpamTrash) url.searchParams.set("includeSpamTrash", "true");
    if (pageToken) url.searchParams.set("pageToken", pageToken);

    const res = await fetch(url.toString(), { headers: { Authorization: `Bearer ${accessToken}` } });
    if (!res.ok) {
      const text = await res.text().catch(() => "");
      throw new Error(`Gmail list ${labelId} failed (${res.status}): ${text}`);
    }
    const data = await jsonOrEmpty<{ messages?: Array<{ id: string }>; nextPageToken?: string }>(res);
    for (const m of data.messages ?? []) ids.add(m.id);
    pageToken = data.nextPageToken;
    pages++;
  } while (pageToken && pages < MAX_LIST_PAGES);

  return { ids, truncated: Boolean(pageToken) };
}

interface LocalRow {
  id: string;
  external_id: string;
  folder: string | null;
  is_read: boolean;
  is_starred: boolean;
  is_archived: boolean;
  is_trashed: boolean;
  is_spam: boolean;
}

/** All non-deleted local rows for the account, paged past PostgREST's 1k cap. */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
async function loadLocalRows(supabase: any, accountId: string): Promise<LocalRow[]> {
  const out: LocalRow[] = [];
  const PAGE = 1000;
  for (let from = 0; ; from += PAGE) {
    const { data, error } = await supabase
      .from("emails")
      .select("id, external_id, folder, is_read, is_starred, is_archived, is_trashed, is_spam")
      .eq("account_id", accountId)
      .eq("is_deleted", false)
      .not("external_id", "is", null)
      .order("id", { ascending: true })
      .range(from, from + PAGE - 1);
    if (error) throw new Error(`local rows query failed: ${error.message}`);
    const rows = (data ?? []) as LocalRow[];
    out.push(...rows);
    if (rows.length < PAGE) break;
  }
  return out;
}

/** Bulk-set a single boolean column on a list of local ids, in chunks. */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
async function bulkSetBool(supabase: any, ids: string[], column: string, value: boolean): Promise<void> {
  for (const part of chunk(ids, 500)) {
    const { error } = await supabase.from("emails").update({ [column]: value }).in("id", part);
    if (error) console.error(`[reconcile] ${column}=${value} update failed: ${error.message}`);
  }
}

/**
 * Reconcile one account against Gmail's authoritative label sets. Never throws for
 * a flagged account (returns `skipped`); a hard failure mid-run is returned as
 * `error` so the caller can aggregate without aborting the batch.
 */
export async function reconcileAccount(
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  account: any,
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  env: any,
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  supabase: any
): Promise<ReconcileResult> {
  const summary = EMPTY_SUMMARY();

  if (account.needs_reauth) {
    return { account_id: account.id, email: account.email, complete: false, pending: 0, summary, skipped: "needs_reauth" };
  }

  try {
    const accessToken = await getValidAccessToken(account, env, supabase, "email_accounts");

    // Phase A — build Gmail's authoritative id sets. INBOX excludes spam/trash
    // (a trashed message is not in INBOX); the rest include spam/trash so the
    // membership is complete across every folder.
    const [inbox, unread, starred, trash, spam] = await Promise.all([
      fetchLabelIdSet(accessToken, "INBOX", false),
      fetchLabelIdSet(accessToken, "UNREAD", true),
      fetchLabelIdSet(accessToken, "STARRED", true),
      fetchLabelIdSet(accessToken, "TRASH", true),
      fetchLabelIdSet(accessToken, "SPAM", true),
    ]);
    const truncated = inbox.truncated || unread.truncated || starred.truncated || trash.truncated || spam.truncated;

    const localRows = await loadLocalRows(supabase, account.id);
    const localByExternal = new Map<string, LocalRow>();
    for (const r of localRows) localByExternal.set(r.external_id, r);

    // Phase B.1 — UNREAD / STARRED: set membership is the truth, no fetch needed.
    // Guard: if a set was truncated at the page cap it's INCOMPLETE, and using it
    // to derive `desired` would mass-misflip every row past the cap (a member that
    // didn't fit reads as a non-member). Skip that column's correction this run —
    // `truncated` already forces a continuation, so it re-runs.
    const readTrue: string[] = []; // should become is_read = true (NOT in UNREAD set)
    const readFalse: string[] = []; // should become is_read = false (in UNREAD set)
    const starTrue: string[] = [];
    const starFalse: string[] = [];
    for (const r of localRows) {
      if (!unread.truncated) {
        const desiredRead = !unread.ids.has(r.external_id);
        if (r.is_read !== desiredRead) (desiredRead ? readTrue : readFalse).push(r.id);
      }
      if (!starred.truncated) {
        const desiredStar = starred.ids.has(r.external_id);
        if (r.is_starred !== desiredStar) (desiredStar ? starTrue : starFalse).push(r.id);
      }
    }
    await bulkSetBool(supabase, readTrue, "is_read", true);
    await bulkSetBool(supabase, readFalse, "is_read", false);
    await bulkSetBool(supabase, starTrue, "is_starred", true);
    await bulkSetBool(supabase, starFalse, "is_starred", false);
    summary.read_fixed = readTrue.length + readFalse.length;
    summary.starred_fixed = starTrue.length + starFalse.length;

    // Phase B.2 — INBOX drift. A local row whose "active inbox" state disagrees
    // with Gmail's INBOX set has genuinely moved (archived/trashed/spam/deleted)
    // — re-derive its true state from the message's current labelIds.
    const candidates: string[] = [];
    for (const r of localRows) {
      const localActiveInbox =
        r.folder === "INBOX" && !r.is_archived && !r.is_trashed && !r.is_spam;
      if (localActiveInbox !== inbox.ids.has(r.external_id)) candidates.push(r.external_id);
    }

    // Gmail INBOX ids with no local row at all → count only (full sync imports).
    for (const ext of inbox.ids) {
      if (!localByExternal.has(ext)) summary.missing_local++;
    }

    const toProcess = candidates.slice(0, METADATA_BUDGET);
    for (const ext of toProcess) {
      const local = localByExternal.get(ext);
      if (!local) continue;
      const res = await fetch(`${GMAIL_API}/messages/${ext}?format=minimal&fields=labelIds`, {
        headers: { Authorization: `Bearer ${accessToken}` },
      });
      if (res.status === 404) {
        // Gone from Gmail entirely → soft-delete (mirrors syncViaHistory deletions).
        const { error } = await supabase
          .from("emails")
          .update({ is_trashed: true, is_deleted: true, deleted_at: new Date().toISOString() })
          .eq("id", local.id);
        if (error) console.error(`[reconcile] soft-delete failed for ${ext}: ${error.message}`);
        else summary.deleted++;
        continue;
      }
      if (!res.ok) {
        console.error(`[reconcile] metadata fetch failed for ${ext}: ${res.status}`);
        continue;
      }
      const data = await jsonOrEmpty<{ labelIds?: string[] }>(res);
      const { error } = await supabase
        .from("emails")
        .update(applyLabelStateToEmail(data.labelIds ?? []))
        .eq("id", local.id);
      if (error) console.error(`[reconcile] re-derive failed for ${ext}: ${error.message}`);
      else summary.folder_fixed++;
    }

    const pending = Math.max(0, candidates.length - toProcess.length);
    const complete = pending === 0 && !truncated;

    // Stamp last_reconciled_at only on a fully-drained pass. While work remains the
    // non-null cursor keeps the account eligible on the very next cron tick (it
    // doesn't wait out the weekly gate).
    await supabase
      .from("email_accounts")
      .update({
        reconcile_summary: summary,
        reconcile_cursor: complete ? null : { pending },
        ...(complete ? { last_reconciled_at: new Date().toISOString() } : {}),
      })
      .eq("id", account.id);

    return { account_id: account.id, email: account.email, complete, pending, summary };
  } catch (error: unknown) {
    // ReauthRequiredError already flagged the account row (needs_reauth) — surface
    // it as skipped, not a hard error, so the batch loop treats it like a paused account.
    if (error instanceof ReauthRequiredError) {
      return { account_id: account.id, email: account.email, complete: false, pending: 0, summary, skipped: "needs_reauth" };
    }
    const msg = error instanceof Error ? error.message : "Unknown error";
    return { account_id: account.id, email: account.email, complete: false, pending: 0, summary, error: msg };
  }
}
