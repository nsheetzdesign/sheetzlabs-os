/**
 * Full Email Download Script
 * Runs locally via: export $(cat .env.local | xargs) && pnpm full-download
 *
 * Downloads all emails from all Gmail accounts into Supabase.
 * - Clears existing emails first for a clean slate
 * - Syncs labels before emails
 * - Assigns correct labels/folders
 * - Sets history ID for future incremental syncs
 * - Sends completion notifications (macOS + email)
 */

import { createClient } from "@supabase/supabase-js";
import { Resend } from "resend";
import { exec } from "child_process";

// ============================================
// ENV
// ============================================
const SUPABASE_URL = process.env.SUPABASE_URL!;
const SUPABASE_SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY!;
const GOOGLE_CLIENT_ID = process.env.GOOGLE_CLIENT_ID!;
const GOOGLE_CLIENT_SECRET = process.env.GOOGLE_CLIENT_SECRET!;
const RESEND_API_KEY = process.env.RESEND_API_KEY;
const NOTIFICATION_EMAIL = process.env.NOTIFICATION_EMAIL ?? "nick@sheetzlabs.com";

if (!SUPABASE_URL || !SUPABASE_SERVICE_ROLE_KEY || !GOOGLE_CLIENT_ID || !GOOGLE_CLIENT_SECRET) {
  console.error("Missing required env vars. Check SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY, GOOGLE_CLIENT_ID, GOOGLE_CLIENT_SECRET");
  process.exit(1);
}

const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);
const resend = RESEND_API_KEY ? new Resend(RESEND_API_KEY) : null;

// ============================================
// MAIN
// ============================================
async function main() {
  console.log("=== Full Email Download Script ===\n");
  const startTime = Date.now();

  const results: string[] = [];
  let totalEmails = 0;

  try {
    const { data: accounts, error } = await supabase
      .from("email_accounts")
      .select("*");

    if (error || !accounts) {
      throw new Error(`Failed to fetch accounts: ${error?.message}`);
    }

    console.log(`Found ${accounts.length} accounts to process\n`);

    for (const account of accounts) {
      console.log(`\n${"=".repeat(50)}`);
      console.log(`Processing: ${account.email}`);
      console.log(`${"=".repeat(50)}\n`);

      try {
        const count = await processAccount(account);
        totalEmails += count;
        results.push(`✅ ${account.email}: ${count} emails`);
      } catch (err) {
        const msg = err instanceof Error ? err.message : String(err);
        results.push(`❌ ${account.email}: ${msg}`);
        console.error(`Failed to process ${account.email}:`, err);
      }
    }

    const duration = Math.round((Date.now() - startTime) / 1000 / 60);
    const summary = [
      `Full email download finished in ${duration} minutes.`,
      `Total emails downloaded: ${totalEmails}`,
      "",
      "Results:",
      ...results,
    ].join("\n");

    console.log("\n=== Complete ===");
    console.log(summary);

    await notify("✅ Email Download Complete", summary);

  } catch (err) {
    const msg = err instanceof Error ? err.message : String(err);
    const summary = [
      `Full email download failed.`,
      `Error: ${msg}`,
      "",
      "Partial results:",
      ...(results.length ? results : ["No accounts processed"]),
    ].join("\n");

    console.error("\n=== FAILED ===");
    console.error(summary);

    await notify("❌ Email Download Failed", summary);
    process.exit(1);
  }
}

// ============================================
// PROCESS ACCOUNT
// ============================================
async function processAccount(account: Record<string, unknown>): Promise<number> {
  // 1. Refresh token if needed
  console.log("1. Checking access token...");
  const accessToken = await getValidAccessToken(account);
  console.log("   ✓ Token valid\n");

  // 2. Sync labels first
  console.log("2. Syncing labels...");
  await syncLabelsForAccount(account.id as string, accessToken);
  console.log("   ✓ Labels synced\n");

  // 3. Build label map (external_id → local uuid)
  const { data: labels } = await supabase
    .from("email_labels")
    .select("id, external_id")
    .eq("account_id", account.id);

  const labelMap = new Map<string, string>(
    (labels ?? []).map((l: { id: string; external_id: string }) => [l.external_id, l.id])
  );
  console.log(`   Found ${labelMap.size} labels\n`);

  // 4. Clear existing emails for this account
  console.log("3. Clearing existing emails...");
  const { data: existingEmails } = await supabase
    .from("emails")
    .select("id")
    .eq("account_id", account.id);

  if (existingEmails && existingEmails.length > 0) {
    const emailIds = existingEmails.map((e: { id: string }) => e.id);

    // Delete label assignments in chunks (foreign key)
    for (let i = 0; i < emailIds.length; i += 100) {
      const chunk = emailIds.slice(i, i + 100);
      await supabase
        .from("email_label_assignments")
        .delete()
        .in("email_id", chunk);
    }

    // Delete emails
    await supabase.from("emails").delete().eq("account_id", account.id);
    console.log(`   ✓ Deleted ${existingEmails.length} existing emails\n`);
  } else {
    console.log("   ✓ No existing emails to delete\n");
  }

  // 5. Download all emails
  console.log("4. Downloading all emails from Gmail...\n");

  let pageToken: string | undefined;
  let totalDownloaded = 0;
  let pageCount = 0;
  const maxPages = 500; // 500 × 100 = 50,000 emails max

  do {
    const listUrl = new URL("https://gmail.googleapis.com/gmail/v1/users/me/messages");
    listUrl.searchParams.set("maxResults", "100");
    if (pageToken) listUrl.searchParams.set("pageToken", pageToken);

    const listResponse = await fetch(listUrl.toString(), {
      headers: { Authorization: `Bearer ${accessToken}` },
    });

    if (!listResponse.ok) {
      const errText = await listResponse.text();
      throw new Error(`Gmail list API error ${listResponse.status}: ${errText}`);
    }

    const listData = await listResponse.json() as {
      messages?: Array<{ id: string }>;
      nextPageToken?: string;
    };
    const messages = listData.messages ?? [];
    pageToken = listData.nextPageToken;
    pageCount++;

    console.log(`   Page ${pageCount}: Processing ${messages.length} messages...`);

    // Process in batches of 10 to stay within rate limits
    const batchSize = 10;
    for (let i = 0; i < messages.length; i += batchSize) {
      const batch = messages.slice(i, i + batchSize);

      await Promise.all(
        batch.map(async (msg) => {
          try {
            await downloadAndInsertEmail(
              account.id as string,
              msg.id,
              accessToken,
              labelMap
            );
            totalDownloaded++;
          } catch (err) {
            console.error(`      Failed to download ${msg.id}:`, err instanceof Error ? err.message : err);
          }
        })
      );

      // Avoid hitting Gmail rate limits
      await sleep(100);
    }

    console.log(`   ✓ Total downloaded: ${totalDownloaded}`);

    if (pageCount % 10 === 0) {
      console.log(`\n   --- Checkpoint: ${totalDownloaded} emails downloaded ---\n`);
    }
  } while (pageToken && pageCount < maxPages);

  // 6. Set history ID for future incremental syncs
  console.log("\n5. Setting history ID for incremental sync...");
  const profileRes = await fetch(
    "https://gmail.googleapis.com/gmail/v1/users/me/profile",
    { headers: { Authorization: `Bearer ${accessToken}` } }
  );

  if (profileRes.ok) {
    const profile = await profileRes.json() as { historyId?: string };
    if (profile.historyId) {
      await supabase
        .from("email_accounts")
        .update({ last_history_id: profile.historyId, full_sync_completed: true })
        .eq("id", account.id);
      console.log(`   ✓ History ID set: ${profile.historyId}\n`);
    }
  }

  console.log(`\n✅ Complete: ${totalDownloaded} emails downloaded for ${account.email}`);
  return totalDownloaded;
}

// ============================================
// DOWNLOAD & INSERT SINGLE EMAIL
// ============================================
async function downloadAndInsertEmail(
  accountId: string,
  gmailMessageId: string,
  accessToken: string,
  labelMap: Map<string, string>
): Promise<void> {
  const msgRes = await fetch(
    `https://gmail.googleapis.com/gmail/v1/users/me/messages/${gmailMessageId}?format=full`,
    { headers: { Authorization: `Bearer ${accessToken}` } }
  );

  if (!msgRes.ok) {
    throw new Error(`Failed to fetch message ${gmailMessageId}: ${msgRes.status}`);
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const msg = await msgRes.json() as Record<string, any>;
  const emailRow = parseGmailMessageFull(msg, accountId);

  const { data: inserted, error } = await supabase
    .from("emails")
    .insert(emailRow)
    .select("id")
    .single();

  if (error) {
    throw new Error(`Insert failed: ${error.message}`);
  }

  if (inserted) {
    await assignEmailLabels(inserted.id, msg.labelIds ?? [], labelMap);
  }
}

// ============================================
// PARSE GMAIL MESSAGE (matches email.ts exactly)
// ============================================
// eslint-disable-next-line @typescript-eslint/no-explicit-any
function parseGmailMessageFull(msg: Record<string, any>, accountId: string): Record<string, unknown> {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const headers: Array<{ name: string; value: string }> = msg.payload?.headers ?? [];
  const getHeader = (name: string) =>
    headers.find((h) => h.name.toLowerCase() === name.toLowerCase())?.value ?? "";

  const bodyText = extractBody(msg.payload, "text/plain");
  const bodyHtml = extractBody(msg.payload, "text/html");

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const attachmentParts = (msg.payload?.parts ?? []).filter(
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (p: any) => p.filename && p.filename.length > 0
  );

  const labels: string[] = msg.labelIds ?? [];
  let folder = "INBOX";
  if (labels.includes("SENT")) folder = "SENT";
  if (labels.includes("TRASH")) folder = "TRASH";
  if (labels.includes("SPAM")) folder = "SPAM";
  if (labels.includes("DRAFT")) folder = "DRAFTS";

  const fromHeader = getHeader("from");
  const fromMatch = fromHeader.match(/^(?:"?([^"]*)"?\s*)?<?([^>]+)>?$/);

  return {
    account_id: accountId,
    external_id: msg.id,
    thread_id: msg.threadId,
    subject: getHeader("subject"),
    from_email: fromMatch?.[2] ?? fromHeader,
    from_name: fromMatch?.[1]?.replace(/"/g, "").trim() ?? "",
    to_emails: getHeader("to").split(",").map((e: string) => e.trim().replace(/.*<|>/g, "")).filter(Boolean),
    cc_emails: getHeader("cc").split(",").map((e: string) => e.trim().replace(/.*<|>/g, "")).filter(Boolean),
    body_text: bodyText,
    body_html: bodyHtml,
    snippet: msg.snippet ?? "",
    received_at: new Date(parseInt(msg.internalDate)).toISOString(),
    folder,
    is_read: !labels.includes("UNREAD"),
    is_starred: labels.includes("STARRED"),
    is_archived: !labels.includes("INBOX") && folder === "INBOX",
    is_trashed: labels.includes("TRASH"),
    is_spam: labels.includes("SPAM"),
    has_attachments: attachmentParts.length > 0,
    attachment_count: attachmentParts.length,
  };
}

// ============================================
// ASSIGN LABELS
// ============================================
async function assignEmailLabels(
  emailId: string,
  gmailLabelIds: string[],
  labelMap: Map<string, string>
): Promise<void> {
  if (!gmailLabelIds.length) return;

  const assignments = gmailLabelIds
    .map((gmailLabelId) => {
      const localLabelId = labelMap.get(gmailLabelId);
      if (!localLabelId) return null;
      return { email_id: emailId, label_id: localLabelId };
    })
    .filter(Boolean) as Array<{ email_id: string; label_id: string }>;

  if (assignments.length > 0) {
    await supabase.from("email_label_assignments").insert(assignments);
  }
}

// ============================================
// SYNC LABELS (matches email.ts exactly)
// ============================================
async function syncLabelsForAccount(accountId: string, accessToken: string): Promise<void> {
  const response = await fetch(
    "https://gmail.googleapis.com/gmail/v1/users/me/labels",
    { headers: { Authorization: `Bearer ${accessToken}` } }
  );

  if (!response.ok) {
    const errText = await response.text();
    throw new Error(`Gmail labels API error ${response.status}: ${errText}`);
  }

  const body = await response.json() as {
    labels?: Array<{
      id: string;
      name: string;
      type?: string;
      labelListVisibility?: string;
      messageListVisibility?: string;
      color?: { backgroundColor?: string };
    }>;
  };

  const { labels } = body;
  const systemLabelIds = ["INBOX", "SENT", "DRAFT", "TRASH", "SPAM", "STARRED", "UNREAD", "IMPORTANT"];

  for (const label of labels ?? []) {
    if (label.id.startsWith("CATEGORY_")) continue;
    if (label.id === "IMPORTANT" || label.id === "UNREAD") continue;
    if (label.type !== "user" && label.labelListVisibility === "labelHide") continue;

    const isSystem = systemLabelIds.includes(label.id) || label.type === "system";

    let name = label.name;
    let icon = "Tag";
    let sortOrder = 100;

    if (label.id === "INBOX")        { name = "Inbox";   icon = "Inbox";         sortOrder = 1; }
    else if (label.id === "STARRED") { name = "Starred"; icon = "Star";          sortOrder = 2; }
    else if (label.id === "SENT")    { name = "Sent";    icon = "Send";          sortOrder = 4; }
    else if (label.id === "DRAFT")   { name = "Drafts";  icon = "File";          sortOrder = 5; }
    else if (label.id === "SPAM")    { name = "Spam";    icon = "AlertTriangle"; sortOrder = 90; }
    else if (label.id === "TRASH")   { name = "Trash";   icon = "Trash2";        sortOrder = 91; }

    await supabase.from("email_labels").upsert(
      {
        account_id: accountId,
        name,
        type: isSystem ? "system" : "user",
        icon,
        sort_order: sortOrder,
        color: label.color?.backgroundColor ?? (isSystem ? "#71717a" : "#2FE8B6"),
        external_id: label.id,
        label_list_visibility: label.labelListVisibility ?? "labelShow",
        message_list_visibility: label.messageListVisibility ?? "show",
      },
      { onConflict: "account_id,external_id" }
    );
  }

  // Ensure synthetic labels exist
  await supabase.from("email_labels").upsert(
    [
      { account_id: accountId, name: "Snoozed",  external_id: "SNOOZED",  type: "system", icon: "Clock", sort_order: 3,  color: "#71717a" },
      { account_id: accountId, name: "All Mail", external_id: "ALL_MAIL", type: "system", icon: "Mail",  sort_order: 92, color: "#71717a" },
    ],
    { onConflict: "account_id,external_id" }
  );
}

// ============================================
// TOKEN REFRESH
// ============================================
async function getValidAccessToken(account: Record<string, unknown>): Promise<string> {
  // Use existing token if not expiring within 60s
  if (new Date(account.token_expires_at as string) > new Date(Date.now() + 60000)) {
    return account.access_token as string;
  }

  console.log("   Token expired, refreshing...");

  const refreshRes = await fetch("https://oauth2.googleapis.com/token", {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams({
      client_id: GOOGLE_CLIENT_ID,
      client_secret: GOOGLE_CLIENT_SECRET,
      refresh_token: account.refresh_token as string,
      grant_type: "refresh_token",
    }),
  });

  if (!refreshRes.ok) {
    const errText = await refreshRes.text();
    throw new Error(`Token refresh failed: ${errText}`);
  }

  const tokens = await refreshRes.json() as { access_token: string; expires_in: number };

  await supabase
    .from("email_accounts")
    .update({
      access_token: tokens.access_token,
      token_expires_at: new Date(Date.now() + tokens.expires_in * 1000).toISOString(),
    })
    .eq("id", account.id as string);

  return tokens.access_token;
}

// ============================================
// BODY EXTRACTION
// ============================================
function extractBody(payload: Record<string, unknown> | undefined, mimeType: string): string {
  if (!payload) return "";

  const body = payload.body as { data?: string } | undefined;
  if (payload.mimeType === mimeType && body?.data) {
    try {
      return decodeBase64(body.data as string);
    } catch {
      return "";
    }
  }

  if (payload.parts) {
    for (const part of payload.parts as Array<Record<string, unknown>>) {
      const result = extractBody(part, mimeType);
      if (result) return result;
    }
  }

  return "";
}

function decodeBase64(data: string): string {
  const standard = data.replace(/-/g, "+").replace(/_/g, "/");
  const binary = atob(standard);
  const bytes = new Uint8Array(binary.length);
  for (let i = 0; i < binary.length; i++) bytes[i] = binary.charCodeAt(i);
  try {
    return new TextDecoder("utf-8").decode(bytes);
  } catch {
    return new TextDecoder("latin1").decode(bytes);
  }
}

// ============================================
// NOTIFICATIONS
// ============================================
async function notify(title: string, body: string): Promise<void> {
  // macOS native notification
  const message = body.split("\n")[0]; // first line only for toast
  const script = `display notification "${message.replace(/"/g, "'")}" with title "${title.replace(/"/g, "'")}" sound name "Glass"`;
  exec(`osascript -e '${script}'`, () => {});

  // Email via Resend (optional)
  if (resend && NOTIFICATION_EMAIL) {
    try {
      await resend.emails.send({
        from: "Sheetz Labs <notifications@sheetzlabs.com>",
        to: NOTIFICATION_EMAIL,
        subject: title,
        text: body,
      });
      console.log("📧 Notification email sent");
    } catch (err) {
      console.error("Failed to send notification email:", err instanceof Error ? err.message : err);
    }
  }
}

// ============================================
// UTILS
// ============================================
function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

// ============================================
// RUN
// ============================================
main().catch((err) => {
  console.error("Unhandled error:", err);
  process.exit(1);
});
