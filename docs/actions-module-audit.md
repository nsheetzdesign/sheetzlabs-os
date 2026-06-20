# Repos & GitHub Actions Monitoring Module — Audit & Integration Plan

**Status:** Audit complete (read-only). No feature code written. Awaiting review before implementation.
**Date:** 2026-06-19

---

## PHASE 1 — AUDIT (findings)

### 1. Stack

| Layer | Tech | Version |
|---|---|---|
| Monorepo | pnpm workspaces + Turborepo | `apps/*`, `packages/*` |
| `apps/web` | React Router **v7** SSR on Cloudflare Workers | `react-router ^7.0.0`, `@react-router/dev ^7.0.0` |
| | React | `^19.0.0` |
| | Vite + Cloudflare plugin | `vite ^6.0.0`, `@cloudflare/vite-plugin ^1.0.0` |
| | Supabase | `@supabase/ssr ^0.9.0`, `@supabase/supabase-js ^2.98.0` |
| `apps/api` | Hono on Cloudflare Workers | `hono ^4.7.0` |
| Both workers | Wrangler | `^4.0.0` |
| Lang | TypeScript | `^5.7.0` |
| `packages/shared` | `@sheetzlabs/shared` — direct-TS, no build (`main: ./index.ts`) | — |

**Is this `saas-factory-template`?** **No.** No `saas-factory` / `saas_factory` / template-provenance reference anywhere (READMEs, package names, comments, git remotes). Git origin is `nsheetzdesign/sheetzlabs-os`; earliest commits are greenfield scaffold language. Key divergence: this is a **single-tenant founder OS** gated by an `ALLOWED_USER_EMAILS` allowlist (`nick@sheetzlabs.com` + e2e), with all data per-founder and **no multi-tenant / RLS `user_id` isolation**. There is a separate *SaaS Factory* integration decision (Option B, separate engine + `/factory` control-plane API) recorded in `docs/` — but that is a downstream product, not this repo's template lineage. Treat this repo as bespoke when modeling the new module.

### 2. Auth — how routes are protected

Two chokepoints, **no Cloudflare Access**. Security model = Supabase JWT + single-tenant email allowlist (`packages/shared/auth.ts` `isAllowedUser()`, fail-closed).

- **API worker** — global middleware on `*`: [apps/api/src/middleware/auth.ts](apps/api/src/middleware/auth.ts). Verifies `Authorization: Bearer <Supabase JWT>`, then enforces `ALLOWED_USER_EMAILS`. 401 no-token / 403 wrong-email. Two bypass classes:
  - `PUBLIC_EXACT` / `PUBLIC_PREFIXES` — e.g. `/stripe/webhook/`, `/tickets/sync/`, OAuth callbacks. These skip the JWT gate and verify **inside the handler** (signature or shared secret).
  - `X-Internal-Secret: <CRON_SECRET>` — constant-time check, lets the scheduled handler self-call internal HTTP routes.
- **Web worker** — `requireAuth(request, env)` in [apps/web/app/lib/auth.server.ts](apps/web/app/lib/auth.server.ts), called in the **dashboard layout loader** ([apps/web/app/routes/dashboard.tsx](apps/web/app/routes/dashboard.tsx)). All `/dashboard/*` children inherit it. **Note (Prompt 63): RR v7 `action`s do NOT inherit ancestor-loader auth** — every mutating action must call `await requireAuth(...)` as its first line.
- **Web → API calls** — never bare `fetch`. Server loaders/actions use `apiFetch` ([apps/web/app/lib/api.ts](apps/web/app/lib/api.ts)) which attaches the JWT; browser code hits the `/api/*` proxy ([apps/web/app/routes/api.$.tsx](apps/web/app/routes/api.$.tsx)) which injects the token server-side.

### 3. Supabase — migrations + client config

- **Migrations:** `supabase/migrations/`, convention `NNN_description.sql` (zero-padded 3-digit). Latest is **057** (`057_work_mode.sql`) → **next is `058`**. `supabase/config.toml` present (Postgres 17). **CI does NOT run migrations** — they are applied **manually via the IPv4 session pooler before push**, then `NOTIFY pgrst,'reload schema'`. Convention in this repo: **expand-only** migrations; `ALTER TYPE ADD VALUE` must run outside a txn (no `BEGIN`).
- **Clients:**
  - API (Hono): [apps/api/src/lib/supabase.ts](apps/api/src/lib/supabase.ts) — `createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY)`, **service-role only**.
  - Web session: [apps/web/app/lib/auth.server.ts](apps/web/app/lib/auth.server.ts) — `createServerClient` (@supabase/ssr) with ANON key + cookies.
  - Web loaders: [apps/web/app/lib/supabase.server.ts](apps/web/app/lib/supabase.server.ts) — service-role (anon fallback), server-only.
  - DB types: `Database` from `@sheetzlabs/shared`.

### 4. Module pattern (registration → route → API → nav)

`apps/web/app/routes.ts` is an **explicit route registry** — file-based discovery is NOT used. **New route files are 404 until added here** (recurring pitfall, called out in memory). Dashboard pages are children of the `dashboard` layout route.

**Concrete example — Agents module:**
1. **Register** ([apps/web/app/routes.ts](apps/web/app/routes.ts)):
   ```ts
   route("agents", "routes/dashboard.agents.tsx", [
     index("routes/dashboard.agents._index.tsx"),
     route("runs", "routes/dashboard.agents.runs.tsx", [ index(...), route(":id", ...) ]),
     route("performance", "routes/dashboard.agents.performance.tsx"),
     route(":slug", "routes/dashboard.agents.$slug.tsx"),
   ]),
   ```
2. **Layout** `dashboard.agents.tsx` — `PageTabs` + `<Outlet/>`, no loader (inherits auth).
3. **Index/list** `dashboard.agents._index.tsx` — loader calls `getSupabaseClient(env)` (or `apiFetch`) → renders cards/Badges.
4. **API** [apps/api/src/routes/agents.ts](apps/api/src/routes/agents.ts), mounted in [apps/api/src/index.ts](apps/api/src/index.ts) via `app.route("/agents", agents)`.
5. **Nav** — [apps/web/app/components/dashboard/Sidebar.tsx](apps/web/app/components/dashboard/Sidebar.tsx), `NAV_ITEMS` array (10 items today): `{ icon, label, to, exact? }`, rendered as `<NavLink>` with collapse-rail + optional badge/dot adornments.

### 5. GitHub integration & secrets/env

- **No existing GitHub integration.** No Octokit, no `GITHUB_TOKEN`/App/installation/webhook-secret in source — only profile links in the UI. **Greenfield.**
- **Secret/env management:** secrets via `wrangler secret put`, documented as a comment block in [apps/api/wrangler.toml](apps/api/wrangler.toml); typed in the `Bindings` interface in [apps/api/src/index.ts](apps/api/src/index.ts) and read as `c.env.X`. Local dev: `apps/api/.dev.vars`. Existing external-token precedents to mirror: `STRIPE_*`, `N8N_API_KEY`, `ANTHROPIC_API_KEY`, `RESEND` key, `LINKEDIN_ACCESS_TOKEN`.

### 6. Ingress / webhooks — in-app vs n8n

**Both webhooks are handled in-app (Hono routes), public-at-the-chokepoint then verified internally.** n8n is a *data source that pushes in*, not a general event bus.

- **Stripe** — `POST /stripe/webhook/:account` ([apps/api/src/routes/stripe.ts](apps/api/src/routes/stripe.ts)): public prefix → **HMAC signature** via `stripe.webhooks.constructEventAsync(payload, sig, webhookSecret)` → upsert revenue.
- **n8n tickets** — `POST /tickets/sync/:venture` ([apps/api/src/routes/tickets.ts](apps/api/src/routes/tickets.ts)): public prefix → **constant-time `Bearer N8N_API_KEY`** (`isAuthorizedN8n`, fail-closed) → **upsert by `(source, external_id)`** with an explicit **column allowlist** (never spreads the raw record — mass-assignment guard).

### 7. Alerting / notifications

- **No ntfy. No push.** Outbound notification today is **email only**, via **Resend** ([apps/api/src/lib/send-booking-email.ts](apps/api/src/lib/send-booking-email.ts), `sendBookingEmail` returns `{ok,error}`, fail-closed for retry).
- Triggered from cron in [apps/api/src/scheduled.ts](apps/api/src/scheduled.ts): booking reminders use **idempotent atomic claims** (`UPDATE … WHERE …_sent_at IS NULL`) then send + clear-on-failure for retry.
- **Cron:** single trigger `* * * * *` (every minute) in [apps/api/wrangler.toml](apps/api/wrangler.toml); [scheduled.ts](apps/api/src/scheduled.ts) gates each job by interval. Existing **staggered-reconcile precedent**: email reconciliation runs **one account per 15-min tick** (Prompt 59) — the exact pattern to copy for repo poll backfill.

### 8. Reusable UI (`apps/web/app/components/ui/`)

There is no literal "base-nova" package; the in-repo UI kit is this folder. Reuse:

| Component | File | Use for the module |
|---|---|---|
| `Badge` | `Badge.tsx` | **Status pills** — `<Badge value variant>`, color-mapped, `rounded-full px-2 py-0.5 font-mono text-xs`. Add a `workflow-status` variant (success/failure/in-progress/queued/cancelled). |
| `Button` | `Button.tsx` | primary/secondary/danger (re-run, refresh) |
| `PageTabs` | `PageTabs.tsx` | Runs / Repos sub-tabs |
| `EmptyState` | `EmptyState.tsx` | no-runs state |
| `Skeleton` | `Skeleton.tsx` | loading rows |
| `Toast` | `Toast.tsx` | action feedback |
| `Drawer` | `Drawer.tsx` | run-detail panel (focus-trapped) |
| `FormField`/`Input`/`Select` | resp. | filters |

Semantic Tailwind tokens already exist (Prompt 68): `success` / `caution` / `warning` / `danger` — reuse for run-status color.

---

## PHASE 2 — INTEGRATION PLAN

Grounded entirely in §1–8. Net-new surface: one migration, one API router + one webhook route + one cron block, one `lib/ntfy.ts`, one dashboard module (3 files) + 1 nav item.

### A. Supabase event-log schema — `058_workflow_runs.sql`

Expand-only, applied via pooler before push (§3). Single denormalized table, **upsert-on-change keyed by GitHub's `run_id`** (mirrors the tickets `(source, external_id)` upsert idiom in §6).

```sql
-- 058_workflow_runs.sql  (expand-only; apply via IPv4 session pooler, then NOTIFY pgrst)
create table if not exists workflow_runs (
  id              bigint generated always as identity primary key,
  run_id          bigint not null unique,        -- GitHub workflow_run.id  ← upsert key
  repo_full_name  text   not null,               -- "nsheetzdesign/sheetzlabs-os"
  workflow_name   text   not null,
  workflow_id     bigint,
  run_number      integer,
  event           text,                          -- push / pull_request / schedule / workflow_dispatch
  head_branch     text,
  head_sha        text,
  status          text   not null,               -- queued | in_progress | completed
  conclusion      text,                          -- success | failure | cancelled | timed_out | null
  actor           text,
  html_url        text,
  run_started_at  timestamptz,
  run_updated_at  timestamptz,                   -- GitHub's updated_at — staleness compare for upsert
  alerted_at      timestamptz,                   -- idempotent ntfy claim (mirrors *_sent_at)
  created_at      timestamptz not null default now(),
  updated_at      timestamptz not null default now()
);
create index if not exists workflow_runs_repo_idx       on workflow_runs (repo_full_name, run_started_at desc);
create index if not exists workflow_runs_conclusion_idx on workflow_runs (conclusion);
-- RLS: this repo is single-tenant + service-role only (§2/§3). Scope policies TO service_role,
-- NOT public USING(true) (the Prompt 66 triage lesson). No user_id column needed.
alter table workflow_runs enable row level security;
```
Optional `repos` table (watched-repo registry for the poll loop). For a single owner, can start with a static config list and add the table later — call out, don't over-build.

### B. Ingest — **in-app GitHub webhook handler (mirror Stripe), NOT n8n**

**Pick: in-app Hono route.** Why this matches the repo's pattern (§6):
- GitHub `workflow_run` webhooks are **HMAC-signed** (`X-Hub-Signature-256`) — structurally identical to the Stripe webhook this repo already runs. Verification is native Workers `crypto.subtle` (no new dep).
- Routing through n8n would add an external hop and a second secret for **zero benefit** — the Worker can receive GitHub directly. n8n here is reserved for *venture ticket sources*, not platform events. Adding GH-Actions to n8n would diverge from the established split.

**Route:** `POST /github/webhook` in new `apps/api/src/routes/github.ts`, mounted `app.route("/github", github)`.
- Add `/github/webhook` to `PUBLIC_PREFIXES` in [auth.ts](apps/api/src/middleware/auth.ts) (skip JWT gate).
- **Inside the handler:** read raw body → verify `X-Hub-Signature-256` HMAC-SHA256 against `GITHUB_WEBHOOK_SECRET` (constant-time, via `lib/timing-safe.ts`) → 401 on mismatch (Stripe pattern, fail-closed).
- Handle `X-GitHub-Event: workflow_run` (and `ping`). Map payload → **column-allowlisted upsert** on `run_id` (never spread raw JSON — §6 mass-assignment guard). Upsert on conflict only when incoming `run_updated_at` ≥ stored.
- New secret: `GITHUB_WEBHOOK_SECRET` (wrangler secret + `.dev.vars` + `Bindings`).

### C. Poll-with-ETag fallback (backfill + reconciliation)

Webhooks can be missed (delivery failures, repo added before hook). Add a cron poll mirroring the **email-reconcile staggered cron** (§7: one unit per tick).
- New cron block in [scheduled.ts](apps/api/src/scheduled.ts) (e.g. every 15 min, **one watched repo per tick**) calling `GET /repos/{owner}/{repo}/actions/runs` with a stored **`ETag` → `If-None-Match`**. A `304 Not Modified` costs **no** rate-limit budget — true reconcile-cheaply. Persist the ETag (small `repos` row or KV).
- Same column-allowlisted upsert as the webhook → one write path, naturally idempotent on `run_id`.
- **Auth for polling:** a **fine-grained PAT** (`GITHUB_TOKEN`, read-only Actions scope on the owner's repos) — lowest-friction for a single-owner founder OS. A full **GitHub App** (installation-token JWT signing in Workers) is the alternative only if org-wide/multi-account scale is later needed; flagged, not built now. The PAT covers polling; the webhook needs only the shared secret — no App required for v1.

### D. ntfy-on-failure

**Honest finding (§7): there is no existing ntfy path** — current alerting is Resend email. So this is net-new, but kept tiny and modeled on the existing **idempotent-claim** alert idiom:
- New `apps/api/src/lib/ntfy.ts` — single `fetch` POST to `${NTFY_URL}/${NTFY_TOPIC}` with title/priority/click-through `html_url`. Returns `{ok,error}` (Resend-helper shape). New secrets `NTFY_URL` (default `https://ntfy.sh`) + `NTFY_TOPIC`.
- Fire when an upsert transitions to `conclusion in ('failure','timed_out','cancelled')` **and** `alerted_at is null`; claim atomically (`UPDATE … SET alerted_at=now() WHERE id=? AND alerted_at IS NULL`) before sending — exactly the booking-reminder dedupe pattern (§7), so a webhook + a poll seeing the same failure alert **once**.
- **Fallback:** if `NTFY_TOPIC` unset, degrade to the existing Resend path (or no-op) — don't hard-fail. Stays "reuse the existing alert path" where ntfy isn't configured.

### E. The panel (existing module pattern, §4 + §8)

- **Register** in [routes.ts](apps/web/app/routes.ts): `route("repos", "routes/dashboard.repos.tsx", [ index("routes/dashboard.repos._index.tsx"), route(":runId", "routes/dashboard.repos.$runId.tsx") ])`. **(Without this → 404, §4.)**
- **Files:** `dashboard.repos.tsx` (layout + `PageTabs`), `dashboard.repos._index.tsx` (loader via `apiFetch`/`getSupabaseClient` → table of recent runs: repo · workflow · branch · status `Badge` · actor · started-at; filter by repo/conclusion), `dashboard.repos.$runId.tsx` or a `Drawer` for run detail + "open on GitHub".
- **API reads:** `GET /github/runs` (+ `?repo=&conclusion=`) in `github.ts`, behind the global JWT gate.
- **Nav:** add to `NAV_ITEMS` in [Sidebar.tsx](apps/web/app/components/dashboard/Sidebar.tsx) — `{ icon: GitBranch, label: "Repos", to: "/dashboard/repos" }` (lucide `GitBranch`/`Github`). Optional failure-count badge reusing the inbox-badge adornment.
- **UI:** `Badge` (new `workflow-status` variant on success/caution/warning/danger tokens), `EmptyState`, `Skeleton`, `Toast`, `Button` (manual "Refresh / reconcile now").
- **Actions auth:** any mutating action (e.g. manual reconcile) calls `requireAuth` first (§2, Prompt 63).

### F. Secrets to add
`GITHUB_WEBHOOK_SECRET`, `GITHUB_TOKEN` (fine-grained PAT), `NTFY_URL`, `NTFY_TOPIC` — via `wrangler secret put` + `apps/api/.dev.vars` + `Bindings` in [index.ts](apps/api/src/index.ts), documented in the [wrangler.toml](apps/api/wrangler.toml) comment block.

### Implementation order (for the build prompt, not this phase)
1. Migration 058 (apply via pooler, reload schema).
2. `lib/ntfy.ts` + secrets/Bindings.
3. `routes/github.ts`: webhook (verify + upsert + alert) → mount + `PUBLIC_PREFIXES`.
4. `GET /github/runs` read endpoint.
5. Poll-with-ETag cron block in `scheduled.ts`.
6. Web module (routes.ts + 2–3 route files + Sidebar nav + Badge variant).
7. e2e smoke (`apps/e2e`) + seed a `workflow_runs` row (mailbox-empty-standalone lesson).

### Open questions for review
1. **Watched repos:** start static (config list) or build the `repos` registry table now?
2. **GitHub auth:** confirm fine-grained PAT (recommended) vs. full GitHub App.
3. **ntfy:** new ntfy path (recommended, per your goal) — confirm topic/URL, or prefer reusing Resend email alerts?
4. **Org-wide vs per-repo webhook:** one org webhook covering all repos, or per-repo hooks?
