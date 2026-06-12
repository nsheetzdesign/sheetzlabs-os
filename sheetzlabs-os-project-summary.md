# Sheetz Labs OS — Project Summary

_Last regenerated: 2026-06-12 (Prompt 57). Single-tenant founder operating system._

## What it is

A founder operating system: unified Gmail inbox, Google Calendar + Cal.com-grade public
booking, knowledge base, agents, content pipeline, analytics. Single-tenant — gated to the
founder (`nick@sheetzlabs.com`, plus the `e2e@sheetzlabs.com` test identity) by
`ALLOWED_USER_EMAILS` on **both** workers.

## Stack & infra

- pnpm workspaces + Turborepo. `apps/web` (React Router v7 SSR on Cloudflare Workers),
  `apps/api` (Hono on Workers), `apps/desktop` (Tauri v2 macOS shell), `apps/e2e`
  (Playwright), `packages/shared` (`@sheetzlabs/shared` — types + allowlist, direct-TS).
- Supabase Postgres (project `xffvoxcyrfnekdchrcbk`); migrations in `supabase/migrations/`,
  **applied manually via the IPv4 session pooler before push** (CI does not run them).
- Cloudflare Workers `sheetzlabs-web` + `sheetzlabs-api`; `deploy.yml` auto-deploys both on
  push to `main`.

## The 50–57 arc (mail + calendar hardening)

- **50** Read-only audit: 75 findings, D/D-/D/D/F/F.
- **51** API auth: global Supabase-JWT middleware + email allowlist; CORS locked; OAuth
  `state` CSRF nonces; PATCH column allowlists. Web calls API via `apiFetch`/`/api/*` proxy.
- **52A/52B** Two-way Gmail write-back (Gmail-first, soft-trash only); calendar sync
  deletion-aware + cron'd; idempotent booking reminders; DB-first→checked-Google→email order.
- **53** Flows + timezone: unified ComposeModal, reply threading via `rfc_message_id`,
  IANA-tz math (`lib/tz.ts`).
- **54A** Email UX parity: optimistic UI + undo, scheduled/undo-send, attachments, image
  proxy, per-account counts RPC, single-tenant allowlist (migrations 048–051).
- **54B** Cal.com-grade calendar/booking: slot engine (buffers/increment/window/cap),
  availability editor, public month-grid + tz selector + `.ics`, host reschedule, drag
  move/resize, now-line/keyboard (migration 052).
- **55** Sync-error fixes + the `apps/e2e` Playwright smoke suite (`pnpm e2e`).
- **56** Post-remediation re-audit: all 75 originals RESOLVED; 0 new Critical, 15 new Major.
- **57** Re-audit hardening (this pass): booking management tokens, image-proxy SSRF, `.ics`
  CR-injection, daily-cap race, drag write-back, + infra fixes. Mail/calendar **closed**.

## Test gate

`pnpm e2e` (Playwright, single-worker, runs against the **live prod** deployment with a real
founder JWT) is the exit gate. Suites: `email`, `email-scheduled`, `calendar`, `booking`,
`booking-rules`, `booking-security`, `image-proxy`, `allowlist`. The real web gate for builds
is `pnpm --filter web build` (the `apps/web` `tsc -b` typecheck is knowingly broken — its
Cloudflare tsconfig has no DOM lib).

## Technical rules (current; 7–11 updated by Prompt 57)

1. New route files **must** be registered in `apps/web/app/routes.ts` (explicit registry; no
   auto-discovery — unregistered routes 404).
2. Web→API only via `apiFetch` (server) or the `/api/*` proxy (client); never bare `fetch` to
   the API.
3. Migrations are expand-contract and applied via the pooler **before** pushing.
4. All guest/email input is escaped (`lib/escape.ts`) into HTML + Google events; emails use
   Resend JSON fields, never raw headers.
5. Gmail mutations write Gmail-first, then Supabase; no hard delete (soft-trash).
6. Calendar/booking mutations: **DB first → checked Google call (flag `calendar_sync_failed`
   on failure) → emails (logged, never roll back)**.
7. **Synced calendar event edits/drags are Google-first**: PATCH Google, check `.ok`, write
   the DB only on success; a Google failure returns non-2xx and the client reverts (no silent
   desync). Local-only events branch to a DB-truth write.
8. **Public booking endpoints require a per-booking management token** (constant-time compare,
   `lib/timing-safe.ts`); the booking UUID alone returns no PII and permits no mutation; 404
   on mismatch.
9. **Atomicity for races**: exact-slot via the partial unique index; daily cap via
   `create_booking_atomic()` (advisory-locked count+insert); OAuth nonce via
   `DELETE … RETURNING`; cron claims via conditional `UPDATE … RETURNING`.
10. **SSRF-sensitive fetches** (image proxy) parse the host as an IP in every encoding, block
    private/loopback/link-local/mapped ranges, `redirect:"manual"` (3xx→502), and serve
    `image/*` only.
11. **Crons are bounded**: every select that can back up is `.order(...).limit(...)`; secret
    comparisons are constant-time; breadcrumb tables are swept on a TTL.

## Residual register

Mail/calendar issue list is **empty**. Remaining cross-cutting residuals (all gated, with
triggers) live in `docs/audits/email-calendar-reaudit.md` (see the 2026-06-12 addendum):
plaintext OAuth tokens at rest, no RLS / service-role everywhere, missing `user_id` ownership
columns (multi-tenant trigger), alias From-header (EC-6), and image-proxy DNS-rebinding
(mitigated, not eliminated — trigger: if the proxy ever serves non-image content).

## Session workflow

1. Apply any new migration via the pooler.
2. Commit + push to `main` (CI auto-deploys web + api). 3. Verify `pnpm e2e` green.
