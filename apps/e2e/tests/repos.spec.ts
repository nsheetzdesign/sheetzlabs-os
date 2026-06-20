/**
 * Repos & GitHub Actions module.
 *
 * Smoke coverage of the read path + the public webhook boundary:
 *  • UI: a seeded workflow_run row renders in the /dashboard/repos table with its
 *    conclusion badge.
 *  • API: GET /github/runs returns the seeded run and honors the ?conclusion filter.
 *  • Boundary: POST /github/webhook with no/invalid signature is rejected (401) —
 *    the handler fails closed, even though the route is public at the auth gate.
 *
 * Seeds via the service-role admin client (test scaffolding only); the UI/API are
 * exercised through the real founder session + JWT.
 */
import { test, expect } from "@playwright/test";
import { api, apiPublic } from "../lib/api";
import { admin } from "../lib/supabase";

const RUN_ID = 999000777; // fixed, unlikely to collide with a real GitHub run id
const REPO = "nsheetzdesign/e2e-actions-repo";
const WORKFLOW = "E2E Smoke Workflow";

interface RunRow {
  run_id: number;
  workflow_name: string;
  conclusion: string | null;
}

test.describe("repos & actions module", () => {
  test.beforeAll(async () => {
    // Clean any prior leftover, then seed one failed run.
    await admin().from("workflow_runs").delete().eq("run_id", RUN_ID);
    const { error } = await admin().from("workflow_runs").insert({
      run_id: RUN_ID,
      repo_full_name: REPO,
      workflow_name: WORKFLOW,
      run_number: 42,
      event: "push",
      head_branch: "main",
      head_sha: "abc1234def5678",
      status: "completed",
      conclusion: "failure",
      actor: "nsheetzdesign",
      html_url: "https://github.com/nsheetzdesign/e2e-actions-repo/actions/runs/999000777",
      run_started_at: new Date().toISOString(),
      run_updated_at: new Date().toISOString(),
    });
    if (error) throw new Error(`seed failed: ${error.message}`);
  });

  test.afterAll(async () => {
    await admin().from("workflow_runs").delete().eq("run_id", RUN_ID);
  });

  test("renders the seeded run with its conclusion badge", async ({ page }) => {
    await page.goto("/dashboard/repos", { waitUntil: "networkidle" });

    // The workflow name and a "failure" badge are visible in the table.
    await expect(page.getByText(WORKFLOW)).toBeVisible();
    const row = page.getByTestId("repos-run-row").filter({ hasText: WORKFLOW });
    await expect(row).toBeVisible();
    await expect(row.getByText("failure")).toBeVisible();

    // Overview cards render above the table (one per registered repo).
    await expect(page.getByTestId("repo-card").first()).toBeVisible();
  });

  test("GET /github/repos returns overview cards ordered failing-first", async () => {
    const res = await api<{ repos: Array<{ full_name: string; last_run_conclusion: string | null }> }>(
      "/github/repos",
    );
    expect(res.ok).toBeTruthy();
    expect(Array.isArray(res.body.repos)).toBeTruthy();
    // If any repo is failing, the first card must be a failing one (failing-first sort).
    const failing = new Set(["failure", "timed_out", "cancelled"]);
    const firstFailingIdx = res.body.repos.findIndex((r) => failing.has(r.last_run_conclusion ?? ""));
    const firstPassingIdx = res.body.repos.findIndex((r) => !failing.has(r.last_run_conclusion ?? ""));
    if (firstFailingIdx !== -1 && firstPassingIdx !== -1) {
      expect(firstFailingIdx).toBeLessThan(firstPassingIdx);
    }
  });

  test("GET /github/runs returns the run and honors the conclusion filter", async () => {
    const all = await api<{ runs: RunRow[] }>("/github/runs");
    expect(all.ok).toBeTruthy();
    expect(all.body.runs.some((r) => r.run_id === RUN_ID)).toBeTruthy();

    const failures = await api<{ runs: RunRow[] }>("/github/runs?conclusion=failure");
    expect(failures.body.runs.some((r) => r.run_id === RUN_ID)).toBeTruthy();

    const successes = await api<{ runs: RunRow[] }>("/github/runs?conclusion=success");
    expect(successes.body.runs.some((r) => r.run_id === RUN_ID)).toBeFalsy();
  });

  test("rejects an unsigned webhook (fails closed, 401)", async () => {
    const res = await apiPublic("/github/webhook", {
      method: "POST",
      headers: { "X-GitHub-Event": "workflow_run" },
      body: JSON.stringify({ workflow_run: { id: 1 }, repository: { full_name: REPO } }),
    });
    expect(res.status).toBe(401);
  });
});
