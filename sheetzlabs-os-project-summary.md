# Sheetz Labs OS — Project Summary

_Last regenerated: 2026-06-12 (Prompt 62 — platform triage baseline). Single-tenant founder operating system._

## What it is

A founder operating system: ventures/pipeline, relationships CRM, finance (Stripe revenue +
expenses), unified Gmail inbox, Google Calendar + Cal.com-grade public booking, knowledge base
+ RSS feeds, AI agents, content/newsletter pipeline, learning/education, analytics, and a
chat/command palette. Single-tenant — gated to the founder (`nick@sheetzlabs.com`, plus the
`e2e@sheetzlabs.com` test identity) by `ALLOWED_USER_EMAILS` on **both** workers. A Tauri v2
macOS desktop shell wraps `app.sheetzlabs.com`.

## Stack & infra

- pnpm workspaces + Turborepo. `apps/web` (React Router v7 SSR on Cloudflare Workers),
  `apps/api` (Hono on Workers), `apps/desktop` (Tauri v2 macOS shell), `apps/e2e`
  (Playwright), `packages/shared` (`@sheetzlabs/shared` — types + allowlist, direct-TS).
- Supabase Postgres (project `xffvoxcyrfnekdchrcbk`); migrations 001–054 in
  `supabase/migrations/`, **applied manually via the IPv4 session pooler before push** (CI
  does not run them).
- Cloudflare Workers `sheetzlabs-web` + `sheetzlabs-api`; `deploy.yml` auto-deploys both on
  push to `main`.
- API auth chokepoint: global `authMiddleware` (Supabase JWT + email allowlist + constant-time
  `X-Internal-Secret` cron bypass) on every route except the public allowlist (`/`, `/health`,
  the two Google OAuth callbacks, `/booking/public/*`, `/stripe/webhook/*`).

## Module map (current state)

| Module | State | Sensitivity |
|---|---|---|
| Email (inbox) | shipped — **hardened** (50–60 arc) | PII + OAuth tokens |
| Calendar / Booking | shipped — **hardened** (50–57 arc) | PII + tokens |
| Ventures / Pipeline | shipped & used (old vintage) | low |
| Relationships (CRM) | shipped & used (old) | **HIGH — contact PII** |
| Finance / Revenue / Expenses | shipped & used (old) | **HIGH — money** |
| AI Agents | shipped & used (old) | **HIGH — privileged writes + injection surface** |
| Knowledge / RSS feeds | shipped & used (old) | med — ingests 3rd-party content |
| Content / Newsletter | shipped & used — newsletter sends live (old) | med — subscriber PII |
| Chat / Command palette | shipped & used (old) | med |
| MCP (venture context) | shipped & used (old) | low — SSRF surface |
| Analytics | shipped (`agent_performance` table dead) | low |
| Learning / Education | scaffold + seeds (content null until generated) | low |
| Desktop (Tauri shell) | shipped | low |

## The 50–61 arc

- **50–57 (mail + calendar hardening, CLOSED):** read-only audit (75 findings) → API auth +
  allowlist + CORS + OAuth CSRF nonces; two-way Gmail write-back (Gmail-first, soft-trash);
  deletion-aware cron'd calendar sync; idempotent booking reminders; unified ComposeModal +
  reply threading; IANA-tz math; optimistic UI + undo/scheduled send + attachments; Cal.com-grade
  slot engine + public booking; Playwright `pnpm e2e`; re-audit hardening (booking management
  tokens, image-proxy SSRF, `.ics` CR-injection, daily-cap race, drag write-back). Migrations
  ≤053. Mail/calendar issue list **empty**.
- **58** Inbox stale/trash bug — investigated, **not reproduced**; report-only.
- **59** Gmail reconciliation (`lib/email-reconcile.ts`, set-diff vs Gmail label sets) + weekly
  staggered cron + visible sync-status indicator. Migration 054. Cleared 14 phantom rows.
- **60** Responsive inbox layout (three-pane + draggable divider ≥xl, overlay <xl, nav drawer
  <lg). `pnpm e2e` 50 green.
- **61** Collapsible main sidebar (64px icon rail ↔ 256px, `Cmd/Ctrl+\` toggle, SSR-safe
  `useSidebarCollapsed`); hamburger drawer <lg. New `sidebar.spec.ts`.
- **62 (this pass)** Read-only **platform triage** of the non-mail modules — architecture map,
  10-class pattern sweep, finance/Stripe deeper pass, risk-ranked roadmap. NO code changed. See
  `docs/audits/platform-triage.md`.

## Current open issues (from the Prompt 62 triage)

**Tier 1 — before new features / before enabling more agents:**
- **Agent prompt-injection → privileged DB write** (`agent-engine.ts`): external content (RSS/
  web-search) is `replaceAll`'d verbatim into Claude prompts, and model output is parsed into
  `.insert(payload)`/`.update(payload)`/`postToLinkedIn` gated only by action *type*, not
  payload columns. **Single-tenancy does not neutralize this** (the content is attacker-controlled
  even if the user is trusted). DB-write half is live; auto-LinkedIn-post half is latent. **This
  gates the agents module and the SaaS push** — agents warrants a full Prompt-50-style deep audit
  *before* finance and time-boxing.
- Stripe webhook handles only `invoice.paid` — refunds/disputes/churn produce no DB writes
  (financial-accuracy gap; webhook signature verification itself is **present & correct**).
- `dashboard.revenue` delete **action** is ungated (RR v7 actions skip ancestor-loader auth).
- `tickets.ts` has contradictory auth (N8N-key router middleware *after* the global JWT check →
  endpoints unreachable; web bypasses with a direct-Supabase convert race). Untangle before
  building time-boxing on tickets.

**Tier 2 — before SaaS / multi-tenant:** RLS is decorative (`USING(true)` / `role='authenticated'`,
no `user_id` columns on business tables) — must add ownership columns + scoped policies; per-user
ownership checks on learning/pipeline/mcp handlers; collapse the ~50 service-role-everywhere web
loaders onto `apiFetch`; OAuth-token encryption; `chat.ts:205` `.or()` injection; MCP SSRF.

**Tier 3 — hygiene:** mass-assignment allowlists (agents/content/knowledge); `.ok`/`JSON.parse`
guards on AI calls (learning ×3, agent-engine Serper/Brave, knowledge RSS); silent-error cleanup;
newsletter unsubscribe-link placeholder never substituted (CAN-SPAM); dead `agent_performance`;
desktop `csp: null`.

**Feature-readiness — time-boxing:** substrate (`calendar_events.is_time_block`/`task_id`, `tasks`,
`time_block_templates`, drag) is sound; fix two one-liners first (`time_block_templates` wide-open
RLS; add `tasks.estimated_minutes`) + untangle `tickets.ts` auth.

## Test gate

`pnpm e2e` (Playwright, single-worker, against the **live prod** deployment with a real founder
JWT) is the exit gate. Suites include `email`, `email-scheduled`, `calendar`, `booking`,
`booking-rules`, `booking-security`, `image-proxy`, `allowlist`, `sidebar`. The real web build
gate is `pnpm --filter web build` (the `apps/web` `tsc -b` typecheck is knowingly broken — its
Cloudflare tsconfig has no DOM lib).

## Technical rules (current)

1. New route files **must** be registered in `apps/web/app/routes.ts` (explicit registry; no
   auto-discovery — unregistered routes 404).
2. Web→API only via `apiFetch` (server) or the `/api/*` proxy (client); never bare `fetch` to
   the API. *(Known debt: ~50 web loaders still hold a service-role client directly — Tier 2.)*
3. Migrations are expand-contract and applied via the pooler **before** pushing.
4. All guest/email input is escaped (`lib/escape.ts`) into HTML + Google events; emails use
   Resend JSON fields, never raw headers.
5. Gmail mutations write Gmail-first, then Supabase; no hard delete (soft-trash).
6. Calendar/booking mutations: **DB first → checked Google call (flag `calendar_sync_failed`
   on failure) → emails (logged, never roll back)**.
7. **Synced calendar event edits/drags are Google-first**: PATCH Google, check `.ok`, write the
   DB only on success; a Google failure returns non-2xx and the client reverts (no silent desync).
8. **Public booking endpoints require a per-booking management token** (constant-time compare,
   `lib/timing-safe.ts`); the booking UUID alone returns no PII and permits no mutation.
9. **Atomicity for races**: exact-slot via the partial unique index; daily cap via
   `create_booking_atomic()`; OAuth nonce via `DELETE … RETURNING`; cron claims via conditional
   `UPDATE … RETURNING`.
10. **SSRF-sensitive fetches** parse the host as an IP in every encoding, block private/loopback/
    link-local/mapped ranges, `redirect:"manual"` (3xx→502), and serve `image/*` only.
    *(Watch: `mcp.ts` venture-health HEAD-fetches DB-stored URLs without this guard — Tier 2.)*
11. **Crons are bounded**: every select that can back up is `.order(...).limit(...)`; secret
    comparisons are constant-time; breadcrumb tables are swept on a TTL.
12. **Stripe webhooks are signature-verified** (`constructEventAsync` before any DB write); the
    endpoint is public *because* it is signature-gated.
13. **(Target, not yet enforced)** Agent/model output must be column-allowlisted before any DB
    write, and external-content fed to a model must be delimited as data — see Tier 1.
14. **RR v7 `action`s do NOT inherit ancestor-loader auth.** Every mutating action must establish
    auth *itself* — either `await requireAuth(request, context.cloudflare.env)` as its first line
    (when it mutates Supabase directly) or by routing the mutation through an auth-gated API endpoint
    via `apiFetch` (the API middleware is the real gate). A dashboard layout loader running
    `requireAuth` does **not** protect a child route's action. (Prompt 63 closed 27 such gaps.)

## Residual register

- Mail/calendar residuals (all gated, with triggers): `docs/audits/email-calendar-reaudit.md`.
- Non-mail modules — architecture map, pattern sweep, risk-ranked roadmap, finance deeper pass,
  time-boxing readiness: `docs/audits/platform-triage.md` (Prompt 62).
- Cross-cutting multi-tenant blockers: plaintext OAuth tokens at rest, decorative RLS /
  service-role everywhere, missing `user_id` ownership columns — all gated by the single-tenant
  allowlist; trigger = any multi-user / SaaS move.

## Session workflow

1. Apply any new migration via the pooler.
2. Commit + push to `main` (CI auto-deploys web + api).
3. Verify `pnpm e2e` green.
