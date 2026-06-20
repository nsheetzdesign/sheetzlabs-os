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
  API_URL?: string;
}

/** Common headers for GitHub REST calls (optionally ETag-conditional). */
function ghHeaders(env: GithubEnv, etag?: string | null): Record<string, string> {
  const h: Record<string, string> = {
    Authorization: `Bearer ${env.GITHUB_TOKEN}`,
    Accept: "application/vnd.github+json",
    "X-GitHub-Api-Version": "2022-11-28",
    "User-Agent": "sheetzlabs-os", // GitHub rejects requests without a UA
  };
  if (etag) h["If-None-Match"] = etag;
  return h;
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

  // (3) Denormalize the latest run onto the repos row so cards read one table with
  // no joins. Same upsert path for webhook + poll; only advances when this run is
  // newer than what's stored (guarded inside updateLastRun).
  await updateLastRun(supabase, repoFullName, row);

  // (4) Failure alert — webhook (real-time) only. Atomic claim, then ntfy only if
  // the claim took a row. The poll path (opts.alert falsy) never alerts.
  let alerted = false;
  if (opts.alert && row.conclusion && ALERT_CONCLUSIONS.has(row.conclusion)) {
    alerted = await claimAndAlert(supabase, row, env);
  }

  return { run_id: row.run_id, upserted, alerted };
}

/**
 * Advance repos.last_run_* to this run when it's newer than what's stored. Read-
 * then-write (not a `.or()` filter — avoids the PostgREST or-mutex pitfall noted in
 * memory). Called from ingestRun so webhook + poll denormalize identically.
 */
async function updateLastRun(
  supabase: Supabase,
  repoFullName: string,
  row: ReturnType<typeof buildRunRow>,
): Promise<void> {
  if (!row.run_started_at) return;
  const incoming = new Date(row.run_started_at).getTime();
  const { data: repo } = await supabase
    .from("repos")
    .select("last_run_at")
    .eq("full_name", repoFullName)
    .maybeSingle();
  const stored = repo?.last_run_at ? new Date(repo.last_run_at as string).getTime() : 0;
  if (incoming < stored) return; // an older run can't clobber a newer last_run
  await supabase
    .from("repos")
    .update({
      last_run_status: row.status,
      last_run_conclusion: row.conclusion,
      last_run_at: row.run_started_at,
      last_run_url: row.html_url,
      last_run_number: row.run_number,
      last_run_branch: row.head_branch,
    })
    .eq("full_name", repoFullName);
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

// ── Open issue / PR counts ────────────────────────────────────────────────────

/** Extract the rel="last" page number from a Link header (the pagination tail). */
function lastPageFromLink(link: string | null): number | null {
  if (!link) return null;
  const m = link.match(/[?&]page=(\d+)[^>]*>;\s*rel="last"/);
  return m ? Number(m[1]) : null;
}

interface RepoCountsRow {
  full_name: string;
  repo_etag: string | null;
  pulls_etag: string | null;
  open_issues: number;
  open_prs: number;
}

interface CountsResult {
  open_issues: number;
  open_prs: number;
  repo_etag: string | null;
  pulls_etag: string | null;
}

/**
 * Refresh open issue + PR counts for one repo, both ETag-conditional (core rate limit):
 *   • GET /repos/{o}/{r}                  → open_issues_count (issues + PRs combined).
 *   • GET .../pulls?state=open&per_page=1 → open PR count via the Link rel="last" page
 *     number; no Link header ⇒ the 0/1 length of the body.
 * open_issues = open_issues_count − open_prs. A 304 reuses the stored value; when only
 * the repo is 304 its count is reconstructed from stored (open_issues + open_prs), so a
 * PR-only change still recomputes correctly.
 */
async function refreshRepoCounts(env: GithubEnv, repo: RepoCountsRow): Promise<CountsResult> {
  const storedCount = repo.open_issues + repo.open_prs;
  let openIssuesCount = storedCount;
  let repoEtag = repo.repo_etag;
  let openPrs = repo.open_prs;
  let pullsEtag = repo.pulls_etag;

  // (a) repo → open_issues_count (issues + PRs)
  const rRes = await fetch(`https://api.github.com/repos/${repo.full_name}`, {
    headers: ghHeaders(env, repo.repo_etag),
  });
  if (rRes.status === 200) {
    const body = (await rRes.json()) as { open_issues_count?: number };
    openIssuesCount = body.open_issues_count ?? storedCount;
    repoEtag = rRes.headers.get("etag") ?? repoEtag;
  } // 304 / error → keep storedCount + repoEtag

  // (b) pulls → open PR count
  const pRes = await fetch(
    `https://api.github.com/repos/${repo.full_name}/pulls?state=open&per_page=1`,
    { headers: ghHeaders(env, repo.pulls_etag) },
  );
  if (pRes.status === 200) {
    const lastPage = lastPageFromLink(pRes.headers.get("link"));
    if (lastPage != null) {
      openPrs = lastPage; // per_page=1 → last page number == open PR count
    } else {
      const arr = (await pRes.json()) as unknown[];
      openPrs = Array.isArray(arr) ? arr.length : 0; // no Link ⇒ 0 or 1
    }
    pullsEtag = pRes.headers.get("etag") ?? pullsEtag;
  } // 304 / error → keep stored open_prs + pullsEtag

  return {
    open_issues: Math.max(0, openIssuesCount - openPrs),
    open_prs: openPrs,
    repo_etag: repoEtag,
    pulls_etag: pullsEtag,
  };
}

// ── Poll-with-ETag reconcile (runs + counts) ──────────────────────────────────

export interface PollResult {
  repo?: string;
  status?: number;
  ingested?: number;
  error?: string;
}

/**
 * Reconcile the single most-stale repo (ORDER BY last_polled_at ASC NULLS FIRST,
 * LIMIT 1) in one tick: poll its Actions runs (runs_etag, page 1 / per_page=50) AND
 * refresh its open issue/PR counts (repo_etag + pulls_etag). Each GET is ETag-
 * conditional — a 304 costs no rate budget. `last_polled_at` is bumped on every
 * outcome (304/200/error) so one broken repo can't pin the rotation; ETags only
 * advance on a 200.
 */
export async function pollNextRepo(env: GithubEnv, supabase: Supabase): Promise<PollResult> {
  if (!env.GITHUB_TOKEN) return { error: "GITHUB_TOKEN not configured" };

  const { data: repos, error } = await supabase
    .from("repos")
    .select("id, full_name, runs_etag, repo_etag, pulls_etag, open_issues, open_prs")
    .order("last_polled_at", { ascending: true, nullsFirst: true })
    .limit(1);
  if (error) return { error: error.message };

  const repo = repos?.[0];
  if (!repo) return {}; // nothing registered yet — webhook auto-registers on first event

  const nowIso = new Date().toISOString();
  const update: Record<string, unknown> = { last_polled_at: nowIso };
  let status: number | undefined;
  let ingested = 0;
  let pollError: string | undefined;

  // (1) Runs (runs_etag-conditional, page 1 only).
  try {
    const res = await fetch(
      `https://api.github.com/repos/${repo.full_name}/actions/runs?per_page=50&page=1`,
      { headers: ghHeaders(env, repo.runs_etag as string | null) },
    );
    status = res.status;
    if (res.status === 200) {
      const etag = res.headers.get("etag");
      const body = (await res.json()) as { workflow_runs?: GithubRun[] };
      for (const run of body.workflow_runs ?? []) {
        const result = await ingestRun(
          supabase,
          run,
          run.repository?.full_name ?? repo.full_name,
          env,
        );
        if (result.upserted) ingested++;
      }
      if (etag) update.runs_etag = etag;
    } else if (res.status !== 304) {
      pollError = (await res.text().catch(() => "")).slice(0, 200);
    }
  } catch (err) {
    pollError = err instanceof Error ? err.message : "runs poll failed";
  }

  // (2) Counts (repo_etag + pulls_etag-conditional) — independent of the runs result.
  try {
    const counts = await refreshRepoCounts(env, repo as RepoCountsRow);
    update.open_issues = counts.open_issues;
    update.open_prs = counts.open_prs;
    update.counts_synced_at = nowIso;
    if (counts.repo_etag) update.repo_etag = counts.repo_etag;
    if (counts.pulls_etag) update.pulls_etag = counts.pulls_etag;
  } catch (err) {
    console.error(`[github-counts] ${repo.full_name} failed:`, err);
  }

  await supabase.from("repos").update(update).eq("id", repo.id);
  return { repo: repo.full_name, status, ingested, error: pollError };
}

// ── Self-healing discovery (hourly) ───────────────────────────────────────────

/** The org/repo webhook target — derived from API_URL, prod default otherwise. */
function webhookUrl(env: GithubEnv): string {
  const base = (env.API_URL ?? "https://api.sheetzlabs.com").replace(/\/+$/, "");
  return `${base}/github/webhook`;
}

/** List every repo the token can see (owner + collaborator + org member), paginated. */
async function listAllUserRepos(env: GithubEnv): Promise<string[]> {
  const names: string[] = [];
  for (let page = 1; page <= 20; page++) {
    const res = await fetch(
      `https://api.github.com/user/repos?per_page=100&page=${page}&affiliation=owner,collaborator,organization_member`,
      { headers: ghHeaders(env) },
    );
    if (!res.ok) break;
    const arr = (await res.json()) as { full_name?: string }[];
    if (!arr.length) break;
    for (const r of arr) if (r.full_name) names.push(r.full_name);
    if (arr.length < 100) break;
  }
  return names;
}

/** Does the repo have at least one Actions workflow defined? */
async function repoHasWorkflows(env: GithubEnv, fullName: string): Promise<boolean> {
  const res = await fetch(`https://api.github.com/repos/${fullName}/actions/workflows`, {
    headers: ghHeaders(env),
  });
  if (!res.ok) return false;
  const body = (await res.json()) as { total_count?: number };
  return (body.total_count ?? 0) > 0;
}

type EnsureHookOutcome = "created" | "adopted" | "forbidden" | "error";

/**
 * Ensure a workflow_run webhook exists on a repo. Idempotent + duplicate-safe: lists
 * existing hooks first and ADOPTS one already pointing at our URL (recording its id +
 * hooked_at) instead of creating a second. Fails soft on 403 (token lacks Webhooks:
 * write) so the discovery sweep never crashes.
 */
async function ensureWebhook(
  env: GithubEnv,
  supabase: Supabase,
  fullName: string,
): Promise<EnsureHookOutcome> {
  const url = webhookUrl(env);

  const listRes = await fetch(`https://api.github.com/repos/${fullName}/hooks?per_page=100`, {
    headers: ghHeaders(env),
  });
  if (listRes.status === 403) return "forbidden";
  if (listRes.ok) {
    const hooks = (await listRes.json()) as { id: number; config?: { url?: string } }[];
    const existing = hooks.find((h) => h.config?.url === url);
    if (existing) {
      await supabase
        .from("repos")
        .update({ webhook_id: existing.id, hooked_at: new Date().toISOString() })
        .eq("full_name", fullName);
      return "adopted";
    }
  }

  const createRes = await fetch(`https://api.github.com/repos/${fullName}/hooks`, {
    method: "POST",
    headers: { ...ghHeaders(env), "Content-Type": "application/json" },
    body: JSON.stringify({
      name: "web",
      active: true,
      events: ["workflow_run"],
      config: { url, content_type: "json", secret: env.GITHUB_WEBHOOK_SECRET },
    }),
  });
  if (createRes.status === 403) return "forbidden";
  if (!createRes.ok) {
    console.error(`[github-discover] hook create failed for ${fullName}: ${createRes.status}`);
    return "error";
  }
  const created = (await createRes.json()) as { id: number };
  await supabase
    .from("repos")
    .update({ webhook_id: created.id, hooked_at: new Date().toISOString() })
    .eq("full_name", fullName);
  return "created";
}

export interface DiscoverResult {
  scanned: number;
  hooked: number; // created
  adopted: number;
  noWorkflow: number;
  webhooksForbidden: boolean;
  error?: string;
}

/**
 * Self-healing discovery (run ~hourly): scan every visible repo, register any new
 * ones, and ensure a webhook on each workflow-having repo that isn't hooked yet.
 * Idempotent — repos with hooked_at set are skipped without an API call, and repos
 * with no workflows are skipped (re-checked next sweep in case they add one).
 */
export async function discoverRepos(env: GithubEnv, supabase: Supabase): Promise<DiscoverResult> {
  const result: DiscoverResult = {
    scanned: 0,
    hooked: 0,
    adopted: 0,
    noWorkflow: 0,
    webhooksForbidden: false,
  };
  if (!env.GITHUB_TOKEN) return { ...result, error: "GITHUB_TOKEN not configured" };

  const names = await listAllUserRepos(env);
  result.scanned = names.length;
  if (names.length) {
    await supabase
      .from("repos")
      .upsert(names.map((full_name) => ({ full_name })), {
        onConflict: "full_name",
        ignoreDuplicates: true,
      });
  }

  // Only consider not-yet-hooked repos (hooked_at NULL) — the rest are skipped free.
  const { data: candidates, error } = await supabase
    .from("repos")
    .select("full_name")
    .is("hooked_at", null);
  if (error) return { ...result, error: error.message };

  for (const c of candidates ?? []) {
    const fullName = c.full_name as string;
    if (!(await repoHasWorkflows(env, fullName))) {
      result.noWorkflow++;
      continue;
    }
    const outcome = await ensureWebhook(env, supabase, fullName);
    if (outcome === "created") result.hooked++;
    else if (outcome === "adopted") result.adopted++;
    else if (outcome === "forbidden") {
      result.webhooksForbidden = true;
      break; // token can't write hooks — stop hammering, retry next sweep
    }
  }

  return result;
}

/**
 * Probe whether GITHUB_TOKEN carries the Webhooks permission (a GET /hooks needs it).
 * Used to confirm the fine-grained PAT prereq operationally without the token value.
 */
export async function probeWebhookPermission(
  env: GithubEnv,
  fullName: string,
): Promise<{ status: number; canManageHooks: boolean }> {
  if (!env.GITHUB_TOKEN) return { status: 0, canManageHooks: false };
  const res = await fetch(`https://api.github.com/repos/${fullName}/hooks?per_page=1`, {
    headers: ghHeaders(env),
  });
  return { status: res.status, canManageHooks: res.ok };
}
