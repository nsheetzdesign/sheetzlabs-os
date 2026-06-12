/**
 * Calendar-visibility isolation for the booking suite.
 *
 * The founder's account aggregates several shared calendars (a partner's calendar,
 * Holidays, Family) whose multi-day all-day events make the booking window fully
 * busy on every date — so there is no real availability to book against. For the
 * duration of the booking suite we hide every sub-calendar except the account's own
 * primary, so slots open up, then restore the exact prior visibility.
 *
 * The pre-change state is snapshotted to a file BEFORE any mutation, so a crashed
 * run is still restored by global-teardown reading that file. This only touches
 * reversible per-calendar *settings*, never any data.
 */
import { writeFileSync, readFileSync, existsSync, unlinkSync, mkdirSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { admin } from "./supabase";

const __dirname = dirname(fileURLToPath(import.meta.url));
const SNAPSHOT = resolve(__dirname, "../.auth/calvis.json");

interface VisRow {
  id: string;
  is_visible: boolean | null;
}

export async function isolateToPrimary(): Promise<void> {
  const db = admin();
  const { data: accts } = await db
    .from("calendar_accounts")
    .select("id, email")
    .eq("sync_enabled", true);

  const snapshot: VisRow[] = [];
  const plan: Array<{ id: string; want: boolean }> = [];

  for (const acct of accts ?? []) {
    const { data: subs } = await db
      .from("calendar_sub_accounts")
      .select("id, external_id, is_visible")
      .eq("account_id", acct.id);
    const list = subs ?? [];
    const primary =
      list.find((s) => s.external_id === acct.email) ??
      list.find((s) => s.external_id === "primary") ??
      list[0];
    for (const s of list) {
      snapshot.push({ id: s.id as string, is_visible: s.is_visible as boolean | null });
      plan.push({ id: s.id as string, want: !!primary && s.id === primary.id });
    }
  }

  // Persist BEFORE mutating so a crash mid-change is still restorable.
  mkdirSync(dirname(SNAPSHOT), { recursive: true });
  writeFileSync(SNAPSHOT, JSON.stringify(snapshot));

  for (const p of plan) {
    await db.from("calendar_sub_accounts").update({ is_visible: p.want }).eq("id", p.id);
  }
}

export async function restoreVisibility(): Promise<void> {
  if (!existsSync(SNAPSHOT)) return;
  const snapshot = JSON.parse(readFileSync(SNAPSHOT, "utf8")) as VisRow[];
  const db = admin();
  for (const s of snapshot) {
    await db.from("calendar_sub_accounts").update({ is_visible: s.is_visible }).eq("id", s.id);
  }
  unlinkSync(SNAPSHOT);
}
