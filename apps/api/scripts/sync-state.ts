/**
 * Sync-state diagnostic (rerunnable).
 * Usage: export $(cat .env.local | xargs) && npx tsx apps/api/scripts/sync-state.ts
 * Prints current sync state for every email + calendar account.
 */
import { createClient } from "@supabase/supabase-js";

const SUPABASE_URL = process.env.SUPABASE_URL!;
const SUPABASE_SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY!;
if (!SUPABASE_URL || !SUPABASE_SERVICE_ROLE_KEY) {
  console.error("Missing SUPABASE_URL / SUPABASE_SERVICE_ROLE_KEY");
  process.exit(1);
}
const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);

async function main() {
  console.log("=".repeat(80));
  console.log("EMAIL ACCOUNTS");
  console.log("=".repeat(80));
  const { data: email, error: e1 } = await supabase
    .from("email_accounts")
    .select(
      "id, email, sync_enabled, sync_status, sync_error, needs_reauth, last_history_id, sync_page_token, full_sync_completed, last_sync_at"
    )
    .order("email");
  if (e1) console.error("email_accounts error:", e1.message);
  for (const a of email ?? []) {
    console.log(JSON.stringify(a, null, 2));
  }

  console.log("\n" + "=".repeat(80));
  console.log("CALENDAR ACCOUNTS");
  console.log("=".repeat(80));
  // Try common shapes — calendar accounts may live in their own table.
  const { data: cal, error: e2 } = await supabase
    .from("calendar_accounts")
    .select("*")
    .order("email");
  if (e2) console.error("calendar_accounts error:", e2.message);
  for (const a of cal ?? []) {
    console.log(JSON.stringify(a, null, 2));
  }

  console.log("\n" + "=".repeat(80));
  console.log("CALENDARS (sub-calendars)");
  console.log("=".repeat(80));
  const { data: cals, error: e3 } = await supabase
    .from("calendars")
    .select("id, account_id, external_id, name, color, sync_token, visible, last_sync_at, sync_error")
    .order("name");
  if (e3) console.error("calendars error:", e3.message);
  for (const a of cals ?? []) console.log(JSON.stringify(a));
}

main().then(() => process.exit(0)).catch((e) => { console.error(e); process.exit(1); });
