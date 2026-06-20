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

// A CI-active card repo seeded directly on `repos` (hooked, denormalized last_run_*)
// with NO workflow_runs rows — so a ?repo= filter on it leaves the runs table empty,
// proving the card reads only the repos row. Plus a workflow-less (unhooked) repo
// that must NOT appear as a card.
const CARD_REPO = "nsheetzdesign/e2e-card-repo";
const CARD_REPO_SHORT = "e2e-card-repo";
const CARD_RUN_NUMBER = 4242;
const CARD_BRANCH = "e2e-card-branch";
const UNHOOKED_REPO = "nsheetzdesign/e2e-unhooked-repo";

interface RunRow {
  run_id: number;
  workflow_name: string;
  conclusion: string | null;
}

interface CardRow {
  full_name: string;
  last_run_conclusion: string | null;
  last_run_number: number | null;
  last_run_branch: string | null;
  hooked_at: string | null;
}

test.describe("repos & actions module", () => {
  test.beforeAll(async () => {
    const now = new Date().toISOString();
    // Clean any prior leftovers.
    await admin().from("workflow_runs").delete().eq("run_id", RUN_ID);
    await admin().from("repos").delete().in("full_name", [CARD_REPO, UNHOOKED_REPO]);

    // Seed one failed run for the table test.
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
      run_started_at: now,
      run_updated_at: now,
    });
    if (error) throw new Error(`run seed failed: ${error.message}`);

    // Seed the CI-active card repo (hooked, denormalized) + a workflow-less repo.
    const { error: repoErr } = await admin().from("repos").insert([
      {
        full_name: CARD_REPO,
        hooked_at: now,
        webhook_id: 999111222,
        last_run_status: "completed",
        last_run_conclusion: "failure",
        last_run_at: now,
        last_run_url: "https://github.com/nsheetzdesign/e2e-card-repo/actions/runs/1",
        last_run_number: CARD_RUN_NUMBER,
        last_run_branch: CARD_BRANCH,
        open_prs: 3,
        open_issues: 5,
      },
      { full_name: UNHOOKED_REPO, hooked_at: null }, // workflow-less → excluded from cards
    ]);
    if (repoErr) throw new Error(`repo seed failed: ${repoErr.message}`);
  });

  test.afterAll(async () => {
    await admin().from("workflow_runs").delete().eq("run_id", RUN_ID);
    await admin().from("repos").delete().in("full_name", [CARD_REPO, UNHOOKED_REPO]);
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

  test("GET /github/repos: failing-first, denormalized run#/branch, excludes workflow-less repos", async () => {
    const res = await api<{ repos: CardRow[] }>("/github/repos");
    expect(res.ok).toBeTruthy();
    expect(Array.isArray(res.body.repos)).toBeTruthy();

    // Only CI-active (hooked) repos are returned.
    expect(res.body.repos.every((r) => r.hooked_at)).toBeTruthy();
    expect(res.body.repos.some((r) => r.full_name === UNHOOKED_REPO)).toBeFalsy();

    // The seeded card carries its denormalized run number + branch off the repos row.
    const card = res.body.repos.find((r) => r.full_name === CARD_REPO);
    expect(card).toBeTruthy();
    expect(card?.last_run_number).toBe(CARD_RUN_NUMBER);
    expect(card?.last_run_branch).toBe(CARD_BRANCH);

    // Failing-first: no passing/none card precedes a failing one.
    const failing = new Set(["failure", "timed_out", "cancelled"]);
    const firstFailingIdx = res.body.repos.findIndex((r) => failing.has(r.last_run_conclusion ?? ""));
    const firstPassingIdx = res.body.repos.findIndex((r) => !failing.has(r.last_run_conclusion ?? ""));
    if (firstFailingIdx !== -1 && firstPassingIdx !== -1) {
      expect(firstFailingIdx).toBeLessThan(firstPassingIdx);
    }
  });

  test("cards stay fully populated (run#/branch) while a ?repo= filter is active", async ({ page }) => {
    // Filter the table to CARD_REPO, which has a card row but NO workflow_runs — so if
    // the card depended on the runs list it would be blank. It must still show #num + branch.
    await page.goto(`/dashboard/repos?repo=${encodeURIComponent(CARD_REPO)}`, {
      waitUntil: "networkidle",
    });
    const card = page.getByTestId("repo-card").filter({ hasText: CARD_REPO_SHORT });
    await expect(card).toBeVisible();
    await expect(card).toContainText(`#${CARD_RUN_NUMBER}`);
    await expect(card).toContainText(CARD_BRANCH);
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
