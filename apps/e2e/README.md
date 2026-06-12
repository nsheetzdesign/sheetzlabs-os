# @sheetzlabs/e2e — Playwright smoke suite

End-to-end regression gate for the email, calendar, and booking surfaces. Runs
against a **live deployment** (prod by default) and hits real Google APIs, so it is
designed to be run on demand and nightly — not on every push.

## What it covers

- **email.spec.ts** — inbox loads; send round-trip (Sent + Inbox arrival); write-back
  self-verifying loop (star/archive/trash survive a sync); reply threading; search
  (incl. an injection string); snooze leave/return; reconnect-banner canary; an
  undo check that auto-skips until 54A ships.
- **calendar.spec.ts** — week view loads with today highlighted; event round-trip
  (create → renders at 9 AM → reload persistence → Google propagation → delete via
  UI); all-day lane; overlap packing; color persistence.
- **booking.spec.ts** — runs **unauthenticated**: public page + slots + tz label;
  book happy path with manage links; double-book 409; validation (422 / past);
  guest cancel; garbage slug → styled error boundary.

Every mutating test **self-seeds** its subject tagged `[E2E]` and cleans up in
`afterAll`/teardown (including on failure). `global-teardown.ts` additionally sweeps
any stranded `[E2E]` artifacts older than 1 hour. No test reads or mutates
pre-existing founder data.

## Setup

1. Install deps + browser (from the repo root):

   ```bash
   pnpm install
   pnpm --filter @sheetzlabs/e2e install-browsers   # playwright install chromium
   ```

2. Ensure the repo-root `.env.local` (gitignored) has:

   | Var | Purpose |
   | --- | --- |
   | `TEST_USER_EMAIL` | Login email for the suite. A **dedicated** Supabase auth user (the app is single-tenant, so it sees the founder's connected Gmail/Calendar). |
   | `TEST_USER_PASSWORD` | Its password. |
   | `SUPABASE_URL`, `SUPABASE_ANON_KEY`, `SUPABASE_SERVICE_ROLE_KEY` | Already present — used for JWT minting + seeding/cleanup. |
   | `BASE_URL` *(optional)* | Web app under test. Default `https://app.sheetzlabs.com`. |
   | `API_URL` *(optional)* | API under test. Default `https://api.sheetzlabs.com`. |

   The dedicated test user `e2e@sheetzlabs.com` was provisioned via the Supabase
   admin API. To rotate it, set a new password via the admin API and update
   `TEST_USER_PASSWORD`.

## Run

```bash
pnpm e2e                 # from repo root (turbo-free passthrough)
# or
pnpm --filter @sheetzlabs/e2e e2e
pnpm --filter @sheetzlabs/e2e report   # open the last HTML report
```

Single worker, `retries=1`, trace-on-first-retry, HTML report in `apps/e2e/report/`.
Browser timezone is pinned to `America/Chicago` (calendar correctness depends on it).

## CI

`.github/workflows/e2e.yml` runs the suite on a nightly schedule and on manual
`workflow_dispatch`, with secrets `TEST_USER_EMAIL` / `TEST_USER_PASSWORD` (and the
Supabase keys), uploading the HTML report as an artifact.
