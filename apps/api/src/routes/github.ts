import { Hono } from "hono";
import { createClient } from "@supabase/supabase-js";
import {
  verifyGithubSignature,
  ingestRun,
  pollNextRepo,
  discoverRepos,
  probeWebhookPermission,
} from "../lib/github";

type Bindings = {
  SUPABASE_URL: string;
  SUPABASE_SERVICE_ROLE_KEY: string;
  GITHUB_WEBHOOK_SECRET: string;
  GITHUB_TOKEN: string;
  NTFY_URL: string;
  NTFY_TOPIC: string;
  API_URL: string;
};

// Untyped client — `repos`/`workflow_runs` aren't in the generated Database types
// (same convention as routes/work.ts for the Prompt 67 tables).
function db(env: Bindings) {
  return createClient(env.SUPABASE_URL, env.SUPABASE_SERVICE_ROLE_KEY);
}

const github = new Hono<{ Bindings: Bindings }>();

/**
 * POST /github/webhook
 *
 * The single org-level `workflow_run` webhook on nsheetzdesign. Public at the auth
 * chokepoint (on PUBLIC_PREFIXES) then signature-verified HERE — the Stripe-webhook
 * shape. The raw body must be read before parsing for the HMAC to match.
 */
github.post("/webhook", async (c) => {
  const raw = await c.req.text();
  const sig = c.req.header("X-Hub-Signature-256");
  const ok = await verifyGithubSignature(raw, sig, c.env.GITHUB_WEBHOOK_SECRET);
  if (!ok) {
    return c.json({ error: "Invalid signature" }, 401);
  }

  const eventType = c.req.header("X-GitHub-Event");
  if (eventType === "ping") {
    return c.json({ ok: true, pong: true });
  }
  if (eventType !== "workflow_run") {
    // We only subscribe to workflow_run; ack anything else so GitHub doesn't retry.
    return c.json({ ok: true, ignored: eventType ?? "unknown" });
  }

  let payload: { workflow_run?: unknown; repository?: { full_name?: string } };
  try {
    payload = JSON.parse(raw);
  } catch {
    return c.json({ error: "Invalid JSON body" }, 400);
  }

  const run = payload.workflow_run;
  const repoFullName = payload.repository?.full_name;
  if (!run || !repoFullName) {
    return c.json({ error: "Missing workflow_run or repository" }, 400);
  }

  const supabase = db(c.env);
  // Real-time delivery → this is the path that alerts on failures.
  const result = await ingestRun(supabase, run as never, repoFullName, c.env, { alert: true });
  return c.json({ ok: true, ...result });
});

/**
 * GET /github/runs?repo=&conclusion=
 *
 * Behind the global JWT gate. Returns recent runs (newest first, capped) plus the
 * registered repos for the filter UI.
 */
github.get("/runs", async (c) => {
  const supabase = db(c.env);
  const repo = c.req.query("repo");
  const conclusion = c.req.query("conclusion");

  let query = supabase
    .from("workflow_runs")
    .select("*")
    .order("run_started_at", { ascending: false, nullsFirst: false })
    .limit(100);
  if (repo) query = query.eq("repo_full_name", repo);
  if (conclusion) query = query.eq("conclusion", conclusion);

  const { data: runs, error } = await query;
  if (error) return c.json({ error: error.message }, 500);

  const { data: repos } = await supabase
    .from("repos")
    .select("full_name, last_polled_at")
    .order("full_name", { ascending: true });

  return c.json({ runs: runs ?? [], repos: repos ?? [] });
});

/**
 * GET /github/repos
 *
 * Behind the JWT gate. One row per repo for the overview cards: denormalized
 * last_run_*, open issue/PR counts, and sync timestamps. Ordered failing-first
 * (last_run_conclusion in the failure set), then by most-recent run.
 */
github.get("/repos", async (c) => {
  const supabase = db(c.env);
  const { data, error } = await supabase
    .from("repos")
    .select(
      "full_name, last_run_status, last_run_conclusion, last_run_at, last_run_url, " +
        "open_issues, open_prs, counts_synced_at, hooked_at",
    );
  if (error) return c.json({ error: error.message }, 500);

  const FAILING = new Set(["failure", "timed_out", "cancelled"]);
  const rows = (data ?? []) as unknown as Array<{
    last_run_conclusion: string | null;
    last_run_at: string | null;
  }>;
  const repos = rows.slice().sort((a, b) => {
    const af = FAILING.has(a.last_run_conclusion ?? "") ? 0 : 1;
    const bf = FAILING.has(b.last_run_conclusion ?? "") ? 0 : 1;
    if (af !== bf) return af - bf; // failing first
    const at = a.last_run_at ? new Date(a.last_run_at).getTime() : 0;
    const bt = b.last_run_at ? new Date(b.last_run_at).getTime() : 0;
    return bt - at; // then most-recent run
  });

  return c.json({ repos });
});

/**
 * POST /github/reconcile
 *
 * Manual "reconcile now" — runs one poll-with-ETag tick (one repo, most-stale
 * first). `?discover=1` also runs the self-healing discovery sweep + a Webhooks-
 * permission probe (used to confirm the fine-grained PAT prereq operationally).
 * Behind the JWT gate (the web action calls requireAuth first); the cron reaches
 * the same logic directly via pollNextRepo / discoverRepos.
 */
github.post("/reconcile", async (c) => {
  const supabase = db(c.env);
  const result = await pollNextRepo(c.env, supabase);

  if (c.req.query("discover") === "1") {
    const discovery = await discoverRepos(c.env, supabase);
    const permission = await probeWebhookPermission(c.env, "nsheetzdesign/sheetzlabs-os");
    return c.json({ ok: !result.error, ...result, discovery, permission });
  }

  return c.json({ ok: !result.error, ...result });
});

export default github;
