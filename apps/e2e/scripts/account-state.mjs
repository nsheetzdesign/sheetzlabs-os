#!/usr/bin/env node
/**
 * Prompt 58 diagnostic — dump Gmail sync/token state for all email accounts.
 * Rerunnable. Reads service-role creds from repo-root .env.local.
 *
 *   node scripts/account-state.mjs
 */
import { createClient } from "@supabase/supabase-js";
import { config } from "dotenv";
import { fileURLToPath } from "node:url";
import { dirname, resolve } from "node:path";
import { existsSync } from "node:fs";

const __dirname = dirname(fileURLToPath(import.meta.url));
// Walk up from this file until we find the repo-root .env.local.
let dir = __dirname;
for (let i = 0; i < 6; i++) {
  const candidate = resolve(dir, ".env.local");
  if (existsSync(candidate)) {
    config({ path: candidate });
    break;
  }
  dir = resolve(dir, "..");
}

const url = process.env.SUPABASE_URL;
const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
if (!url || !key) {
  console.error("Missing SUPABASE_URL / SUPABASE_SERVICE_ROLE_KEY in .env.local");
  process.exit(1);
}

const supabase = createClient(url, key, { auth: { persistSession: false } });

const COLS =
  "id, email, sync_enabled, sync_status, sync_error, needs_reauth, refreshing_until, last_history_id, sync_page_token, last_sync_at, last_reconciled_at, reconcile_cursor, reconcile_summary, token_expires_at, created_at";

const { data, error } = await supabase
  .from("email_accounts")
  .select(COLS)
  .order("created_at", { ascending: true });

if (error) {
  console.error("Query failed:", error.message);
  process.exit(1);
}

console.log(`\n=== email_accounts (${data.length}) @ ${new Date().toISOString()} ===\n`);
for (const a of data) {
  const stale = a.last_sync_at
    ? `${Math.round((Date.now() - new Date(a.last_sync_at).getTime()) / 60000)}m ago`
    : "never";
  const tokExp = a.token_expires_at
    ? `${Math.round((new Date(a.token_expires_at).getTime() - Date.now()) / 60000)}m`
    : "null";
  console.log(`• ${a.email}  [${a.id}]`);
  console.log(`    sync_enabled:     ${a.sync_enabled}`);
  console.log(`    sync_status:      ${a.sync_status}`);
  console.log(`    sync_error:       ${a.sync_error ?? "null"}`);
  console.log(`    needs_reauth:     ${a.needs_reauth}`);
  console.log(`    refreshing_until: ${a.refreshing_until ?? "null"}`);
  console.log(`    last_history_id:  ${a.last_history_id ?? "null"}`);
  console.log(`    sync_page_token:  ${a.sync_page_token ? a.sync_page_token.slice(0, 16) + "…" : "null"}`);
  console.log(`    last_sync_at:     ${a.last_sync_at ?? "null"}  (${stale})`);
  const reconStale = a.last_reconciled_at
    ? `${Math.round((Date.now() - new Date(a.last_reconciled_at).getTime()) / 3600000)}h ago`
    : "never";
  console.log(`    last_reconciled:  ${a.last_reconciled_at ?? "null"}  (${reconStale})`);
  console.log(`    reconcile_cursor: ${a.reconcile_cursor ? JSON.stringify(a.reconcile_cursor) : "null"}`);
  console.log(`    reconcile_summary:${a.reconcile_summary ? " " + JSON.stringify(a.reconcile_summary) : " null"}`);
  console.log(`    token_expires:    ${a.token_expires_at ?? "null"}  (in ${tokExp})`);
  console.log("");
}

// Count emails per account + newest message timestamp, to gauge sync freshness.
for (const a of data) {
  const { count } = await supabase
    .from("emails")
    .select("id", { count: "exact", head: true })
    .eq("account_id", a.id);
  const { data: newest } = await supabase
    .from("emails")
    .select("received_at, subject")
    .eq("account_id", a.id)
    .order("received_at", { ascending: false })
    .limit(1);
  console.log(
    `  ${a.email}: ${count ?? "?"} emails, newest received_at=${newest?.[0]?.received_at ?? "none"}`,
  );
}
console.log("");
