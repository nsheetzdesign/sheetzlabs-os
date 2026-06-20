/**
 * GitHub Actions monitoring — ingest + poll-with-ETag reconcile.
 *
 * Two entry points converge on a single idempotent write path (`ingestRun`):
 *   • the org-level `workflow_run` webhook (HMAC-verified in routes/github.ts), and
 *   • the poll-backfill cron (`pollNextRepo`), which rotates one repo per tick.
 *
 * Conventions mirrored from the existing codebase:
 *   • Column-allowlisted upsert (never spread the raw GitHub JSON) — the tickets
 *     mass-assignment guard.
 *   • Staleness gate: write only when incoming `updated_at` >= stored.
 *   • Auto-registering repos via INSERT ... ON CONFLICT DO NOTHING — no static list.
 *   • Atomic alert claim (`alerted_at` NULL → now()) before sending — the
 *     booking-reminder dedupe pattern; the ntfy fires only if the claim took a row.
 */
import type { createClient } from "@supabase/supabase-js";
import { timingSafeEqual } from "./timing-safe";
import { sendNtfy, type NtfyEnv } from "./ntfy";

type Supabase = ReturnType<typeof createClient<any>>;

export interface GithubEnv extends NtfyEnv {
  GITHUB_WEBHOOK_SECRET?: string;
  GITHUB_TOKEN?: string;
}

/** Conclusions that fire a failure alert. */
const ALERT_CONCLUSIONS = new Set(["failure", "timed_out", "cancelled"]);

// ── Signature verification ────────────────────────────────────────────────────

const hex = (buf: ArrayBuffer) =>
  [...new Uint8Array(buf)].map((b) => b.toString(16).padStart(2, "0")).join("");

/**
 * Verify a GitHub `X-Hub-Signature-256` header (HMAC-SHA256 of the raw body).
 * Fails closed: a missing secret, missing/malformed header, or mismatch ⇒ false.
 * The final compare is constant-time (timing-oracle safe, NS-AUTH-1).
 */
export async function verifyGithubSignature(
  rawBody: string,
  signatureHeader: string | undefined,
  secret: string | undefined,
): Promise<boolean> {
  if (!secret) return false; // fail closed — no secret configured ⇒ no access
  if (!signatureHeader || !signatureHeader.startsWith("sha256=")) return false;
  const provided = signatureHeader.slice("sha256=".length);

  const enc = new TextEncoder();
  const key = await crypto.subtle.importKey(
    "raw",
    enc.encode(secret),
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign"],
  );
  const mac = await crypto.subtle.sign("HMAC", key, enc.encode(rawBody));
  return timingSafeEqual(hex(mac), provided);
}

// ── Row mapping (column allowlist) ────────────────────────────────────────────

interface GithubRun {
  id: number;
  name?: string | null;
  workflow_id?: number | null;
  run_number?: number | null;
  event?: string | null;
  head_branch?: string | null;
  head_sha?: string | null;
  status?: string | null;
  conclusion?: string | null;
  html_url?: string | null;
  run_started_at?: string | null;
  updated_at?: string | null;
  actor?: { login?: string } | null;
  triggering_actor?: { login?: string } | null;
  repository?: { full_name?: string } | null;
}

/** Build a column-allowlisted row from a GitHub run object (never spread raw JSON). */
function buildRunRow(run: GithubRun, repoFullName: string) {
  return {
    run_id: run.id,
    repo_full_name: repoFullName,
    workflow_name: run.name ?? "(unnamed workflow)",
    workflow_id: run.workflow_id ?? null,
    run_number: run.run_number ?? null,
    event: run.event ?? null,
    head_branch: run.head_branch ?? null,
    head_sha: run.head_sha ?? null,
    status: run.status ?? "queued",
    conclusion: run.conclusion ?? null,
    actor: run.actor?.login ?? run.triggering_actor?.login ?? null,
    html_url: run.html_url ?? null,
    run_started_at: run.run_started_at ?? null,
    run_updated_at: run.updated_at ?? null,
  };
}

// ── Ingest (shared by webhook + poll) ─────────────────────────────────────────

export interface IngestResult {
  run_id: number;
  upserted: boolean;
  alerted: boolean;
}

/**
 * Upsert one run and, if it concluded in failure, fire a deduped alert.
 *   1. Auto-register the repo (INSERT ... ON CONFLICT (full_name) DO NOTHING).
 *   2. Staleness-gated write keyed on run_id: insert when new, update only when the
 *      incoming `updated_at` is >= the stored one (a late webhook can't clobber a
 *      newer poll, and vice-versa).
 *   3. On a failing conclusion AND `opts.alert`, atomically claim `alerted_at` and
 *      send ntfy — only if the claim took a row.
 *
 * `opts.alert` is true ONLY for real-time webhook deliveries. The poll/backfill
 * path passes false (the default): it reconciles silently so registering a repo —
 * which pulls its entire recent run history at once — never fires a burst of alerts
 * for failures that already happened. A genuinely new failure alerts via its
 * webhook; a failure only the poll ever sees (a missed delivery) is backfilled
 * without an alert, which is the right trade vs. an alert storm.
 */
export async function ingestRun(
  supabase: Supabase,
  run: GithubRun,
  repoFullName: string,
  env: GithubEnv,
  opts: { alert?: boolean } = {},
): Promise<IngestResult> {
  // (1) Auto-register the repo so the poll loop will reconcile it later.
  await supabase
    .from("repos")
    .upsert({ full_name: repoFullName }, { onConflict: "full_name", ignoreDuplicates: true });

  const row = buildRunRow(run, repoFullName);

  // (2) Staleness-gated upsert on run_id.
  const { data: existing, error: selErr } = await supabase
    .from("workflow_runs")
    .select("id, run_updated_at")
    .eq("run_id", row.run_id)
    .maybeSingle();
  if (selErr) {
    console.error(`[github] select run ${row.run_id} failed: ${selErr.message}`);
    return { run_id: row.run_id, upserted: false, alerted: false };
  }

  let upserted = false;
  if (!existing) {
    const { error } = await supabase.from("workflow_runs").insert(row);
    if (error) {
      // A concurrent insert (webhook + poll racing the same new run) loses the
      // unique race — not an error worth surfacing; the winner persisted the row.
      console.warn(`[github] insert run ${row.run_id} skipped: ${error.message}`);
    } else {
      upserted = true;
    }
  } else {
    const incoming = row.run_updated_at ? new Date(row.run_updated_at).getTime() : 0;
    const stored = existing.run_updated_at ? new Date(existing.run_updated_at).getTime() : 0;
    if (incoming >= stored) {
      const { error } = await supabase
        .from("workflow_runs")
        .update({ ...row, updated_at: new Date().toISOString() })
        .eq("run_id", row.run_id);
      if (error) console.error(`[github] update run ${row.run_id} failed: ${error.message}`);
      else upserted = true;
    }
  }

  // (3) Failure alert — webhook (real-time) only. Atomic claim, then ntfy only if
  // the claim took a row. The poll path (opts.alert falsy) never alerts.
  let alerted = false;
  if (opts.alert && row.conclusion && ALERT_CONCLUSIONS.has(row.conclusion)) {
    alerted = await claimAndAlert(supabase, row, env);
  }

  return { run_id: row.run_id, upserted, alerted };
}

/**
 * Atomic claim + ntfy. `UPDATE ... SET alerted_at = now() WHERE run_id = ? AND
 * alerted_at IS NULL RETURNING id` — 0 rows back means another path (webhook vs
 * poll) already alerted, so we send nothing. If the send fails we release the
 * claim so a later observation retries. A skipped (no-op) send keeps the claim.
 */
async function claimAndAlert(
  supabase: Supabase,
  row: ReturnType<typeof buildRunRow>,
  env: GithubEnv,
): Promise<boolean> {
  const { data: claimed, error: claimErr } = await supabase
    .from("workflow_runs")
    .update({ alerted_at: new Date().toISOString() })
    .eq("run_id", row.run_id)
    .is("alerted_at", null)
    .select("id");

  if (claimErr) {
    console.error(`[github] alert claim failed for run ${row.run_id}: ${claimErr.message}`);
    return false;
  }
  if (!claimed?.length) return false; // already alerted by the other path

  const branch = row.head_branch ? ` · ${row.head_branch}` : "";
  const num = row.run_number != null ? ` · run #${row.run_number}` : "";
  const res = await sendNtfy({
    env,
    title: `CI ${row.conclusion}: ${row.workflow_name}`,
    message: `${row.repo_full_name}${branch}${num}`,
    priority: "high",
    tags: ["x"], // ntfy renders → ❌
    click: row.html_url ?? undefined,
  });

  if (!res.ok) {
    // Release the claim so the next webhook/poll retries the alert.
    await supabase.from("workflow_runs").update({ alerted_at: null }).eq("run_id", row.run_id);
    console.error(`[github] ntfy failed for run ${row.run_id}: ${res.error}; claim cleared`);
    return false;
  }
  return true; // sent (or a no-op skip when NTFY_TOPIC is unset — claim kept)
}

// ── Poll-with-ETag reconcile ──────────────────────────────────────────────────

export interface PollResult {
  repo?: string;
  status?: number;
  ingested?: number;
  error?: string;
}

/**
 * Reconcile the single most-stale repo (ORDER BY last_polled_at ASC NULLS FIRST,
 * LIMIT 1). Fetches page 1 only (per_page=50) of the Actions runs list, replaying
 * the stored ETag as `If-None-Match`:
 *   • 304 Not Modified → nothing changed, no rate-limit cost; bump last_polled_at.
 *   • 200 → store the new ETag, ingest each run, bump last_polled_at.
 *   • non-2xx / throw → bump last_polled_at anyway so one broken repo can't pin the
 *     rotation; the ETag is left untouched.
 */
export async function pollNextRepo(env: GithubEnv, supabase: Supabase): Promise<PollResult> {
  if (!env.GITHUB_TOKEN) return { error: "GITHUB_TOKEN not configured" };

  const { data: repos, error } = await supabase
    .from("repos")
    .select("id, full_name, etag")
    .order("last_polled_at", { ascending: true, nullsFirst: true })
    .limit(1);
  if (error) return { error: error.message };

  const repo = repos?.[0];
  if (!repo) return {}; // nothing registered yet — webhook auto-registers on first event

  const nowIso = new Date().toISOString();
  try {
    const headers: Record<string, string> = {
      Authorization: `Bearer ${env.GITHUB_TOKEN}`,
      Accept: "application/vnd.github+json",
      "X-GitHub-Api-Version": "2022-11-28",
      "User-Agent": "sheetzlabs-os", // GitHub rejects requests without a UA
    };
    if (repo.etag) headers["If-None-Match"] = repo.etag;

    const res = await fetch(
      `https://api.github.com/repos/${repo.full_name}/actions/runs?per_page=50&page=1`,
      { headers },
    );

    if (res.status === 304) {
      await supabase.from("repos").update({ last_polled_at: nowIso }).eq("id", repo.id);
      return { repo: repo.full_name, status: 304, ingested: 0 };
    }

    if (!res.ok) {
      await supabase.from("repos").update({ last_polled_at: nowIso }).eq("id", repo.id);
      const body = await res.text().catch(() => "");
      return { repo: repo.full_name, status: res.status, error: body.slice(0, 200) };
    }

    const etag = res.headers.get("etag");
    const body = (await res.json()) as { workflow_runs?: GithubRun[] };

    let ingested = 0;
    for (const run of body.workflow_runs ?? []) {
      const result = await ingestRun(
        supabase,
        run,
        run.repository?.full_name ?? repo.full_name,
        env,
      );
      if (result.upserted) ingested++;
    }

    await supabase
      .from("repos")
      .update({ etag: etag ?? repo.etag, last_polled_at: nowIso })
      .eq("id", repo.id);
    return { repo: repo.full_name, status: 200, ingested };
  } catch (err) {
    await supabase.from("repos").update({ last_polled_at: nowIso }).eq("id", repo.id);
    return { repo: repo.full_name, error: err instanceof Error ? err.message : "poll failed" };
  }
}
