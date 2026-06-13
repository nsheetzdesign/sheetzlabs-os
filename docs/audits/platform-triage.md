# Platform Triage — Architecture Map, Known-Pattern Sweep, Risk-Ranked Roadmap

**Prompt 62 · 2026-06-12 · read-only triage · NO code changed.**

Scope: whole repo (`apps/api`, `apps/web`, `apps/desktop`, `supabase/migrations` 001–054). Method: 5 parallel read-only module agents + lead grep sweeps + first-hand verification of every Critical claim. Depth = triage (flag + rank), not the line-by-line deep audit the mail/calendar arc got (Prompts 50–60). The mail/calendar/booking trio is treated as **already remediated** (post-Prompt-57 baseline) and is summarized, not re-swept.

---

## 1. Executive Summary

**Verdict: the platform is safe to keep building *internal, single-tenant* features on — but there is exactly one Tier-1 item that gates the AI-agent surface, and a cluster of structural items that hard-gate any multi-tenant / SaaS move.**

The single-tenant allowlist (`ALLOWED_USER_EMAILS` = `nick@sheetzlabs.com`, enforced on both workers) is the load-bearing control for the entire platform. Almost every "Major" below is *latent* because of it: the service-role-everywhere data layer, the unscoped RLS policies, and the missing per-user ownership checks are all real but only become exploitable the moment a second user exists. **Do not ship multi-tenant without clearing Tier 2.**

The one finding that is *not* fully neutralized by single-tenancy:

> **TIER-1 GATE — Agent prompt-injection → privileged DB write (`agent-engine.ts`).** Agents ingest third-party-writable content (RSS/knowledge clips, web-search results — and optionally email) verbatim into Claude prompts (`buildPrompt` raw `replaceAll`, line 390), then parse the model's output into `.insert(payload)` / `.update(payload)` / `postToLinkedIn` calls gated **only by action *type*, never by payload columns** (`executeActions`, lines 423–510). Single-tenancy does **not** close this: the *content* an agent reads (an RSS item body, a future inbound email) is attacker-controlled even though the *user* is trusted. The DB-write half of the path is live today via seeded `knowledge`/`web_search` agents; the auto-`post_linkedin` half is latent (capability present in code, not currently wired to any seeded agent). **This gates enabling any new agent and gates the SaaS push.**

Everything else is a known-class, well-understood hardening backlog. Stripe's webhook signature verification is **present and correct** — finance's risk is reconciliation drift and a couple of route-auth gaps, not a broken webhook. The web app leaks no secrets, the JWT proxy is sound, and the SSR-storage hydration class (the sidebar bug) is now **zero instances** repo-wide.

**Sequencing verdict (answering the prompt's explicit question):**
1. **Agents jumps ahead of finance and time-boxing.** It is the only module with a live, single-tenancy-resistant exploit class. It needs its deep audit *before* the SaaS push and ideally before enabling more agents.
2. **Finance is second** — a targeted hardening pass (3 fixes + reconciliation), not a full deep audit.
3. **Time-boxing can proceed** on the `tickets`/`tasks`/`calendar_events.is_time_block` substrate after two one-line fixes (a wide-open RLS policy + a missing `estimated_minutes` column). The substrate is sound; the surrounding auth on `tickets` is broken and must be untangled first.

---

## 2. Architecture Map

Source of truth: `apps/web/app/routes.ts`, `apps/api/src/index.ts` + `routes/*`, migrations 001–054, dashboard nav.

| Module | State | API surface | Key tables | External APIs | Cron | Sensitivity | Vintage |
|---|---|---|---|---|---|---|---|
| **Ventures** | shipped & used | none (web → Supabase direct) | `ventures`, `venture_connections`, `venture_stack`, `venture_links`, `venture_docs`, `milestones` | — | no | low (internal metadata) | 001/002/007 — old |
| **Pipeline** | shipped & used | `pipeline.ts` (evaluate) | `pipeline`, `pipeline_evaluations` | Anthropic, web search | manual | low | 009 — old |
| **Tickets / Tasks** | shipped & used; **auth broken** | `tickets.ts` (sync, convert) | `tickets`, `tasks`, `milestones` | n8n (ingest) | no | low-med (submitter PII) | early — old |
| **Relationships (CRM)** | shipped & used (real) | none (web → Supabase direct) | `relationships`, `interactions` | — | no | **HIGH — contact PII** | 001/003 — old |
| **Finance / Revenue / Expenses** | shipped & used | `stripe.ts` (webhook), `expenses.ts` (n8n sync) | `revenue`, `expenses`, `expense_connections`, `stripe_connections`, `stripe_product_mappings`, `subscriptions` | **Stripe**, Cloudflare billing | none | **HIGH — money** | 005/006 — old |
| **Knowledge** | shipped & used | `knowledge.ts` | `knowledge`, `tags`, `captures`, `feed_sources`, `feed_items` | RSS (external), Anthropic | feeds daily 06:00 UTC | med — **ingests 3rd-party content (injection)** | 004/016 — old |
| **Content / Newsletter** | shipped & used (newsletter sends live) | `content.ts` | `content`, `content_calendar`, `content_templates`, `newsletter_subscribers`, `newsletter_sends` | **Resend**, **LinkedIn** | content_queue per tick | med — subscriber PII | 017 — old |
| **AI Agents** | shipped & used | `agents.ts`, `agent-engine.ts` | `agents`, `agent_runs`, `agent_actions`, `content_queue`, `pipeline_evaluations` | **Anthropic**, Serper, Brave, LinkedIn | yes — `shouldRunNow()` | **HIGH — privileged writes + injection surface** | 008/009/010 — old |
| **Analytics** | shipped & used (snapshot); `agent_performance` **dead** | `analytics.ts` | `analytics_snapshots`, `agent_performance` (dead) | — | daily snapshot 00:00 UTC | low | 018 — old |
| **Chat / Command palette** | shipped & used | `chat.ts` | `chat_conversations`, `chat_messages`, `quick_actions` | Anthropic (sonnet + haiku router) | no | med — pulls DB context into prompts | 019 — old |
| **MCP (venture context)** | shipped & used | `mcp.ts` (context, health) | venture_* (read-only bundle) | HEAD pings to DB-stored URLs | no | low — **SSRF surface** | mid |
| **Email (inbox)** | shipped & used — **hardened** | `email.ts` (3003 LOC) | `emails`, `email_*`, `email_accounts` | Gmail, Anthropic, Resend | poll/reconcile crons | **HIGH — PII + OAuth tokens** | 011–054 — **post-hardening** |
| **Calendar / Booking** | shipped & used — **hardened** | `calendar.ts`, `booking.ts` | `calendar_*`, `bookings`, `booking_links` | Google Calendar | sync 15min, reminders | med-high — PII + tokens | 013–053 — **post-hardening** |
| **Learning / Education** | **scaffold + seeds** (lesson content null until generated) | `learning.ts` | `learning_paths/modules/lessons/exercises/progress/conversations/messages` | Anthropic | no | low | 030–034 — old |
| **Desktop (Tauri)** | shipped (shell over `app.sheetzlabs.com`) | n/a | n/a | n/a | n/a | low | recent |

### Shared code & multi-tenant seams

- **Auth chokepoint (good):** every API route except a tiny exact/prefix allowlist (`/`, `/health`, the two Google OAuth callbacks, `/booking/public/*`, `/stripe/webhook/*`) runs behind `authMiddleware` → Supabase JWT + `isAllowedUser` allowlist + constant-time `X-Internal-Secret` cron bypass. This is the platform's strongest control.
- **Two rogue auth models bypass the chokepoint's intent:** `tickets.ts` and `expenses.ts` each install their *own* `Bearer N8N_API_KEY` router middleware that runs *after* the global JWT check — see **A-1**. This is the only place the auth story is internally contradictory.
- **Service-role everywhere:** ~50 web loaders/actions hold a service-role Supabase client directly (`getSupabaseClient` from `supabase.server.ts`) instead of routing through the API. Keys never reach the browser (confirmed — server-only), so this is *structural debt*, not a live leak — but it duplicates business logic across two workers and means the API's validation/audit surface is bypassed for most reads.
- **RLS is decorative.** Almost every table uses `CREATE POLICY ... USING (true)` or `auth.role() = 'authenticated'` with **no `user_id` scoping and no `user_id` column** on the business tables (revenue, expenses, relationships, ventures, pipeline, tickets…). RLS provides *zero* tenant isolation today; the allowlist is the only thing standing between users. **This is the multi-tenant seam** — it must be rebuilt (ownership columns + scoped policies) before SaaS.
- **External-content ingress points** (prompt-injection surface): `knowledge` RSS feeds → `feed_items.content` → Claude; `agents` web-search → Claude; inbound `emails` → (optionally) agent context. All flow through `agent-engine.ts` with no sanitization boundary.

---

## 3. Known-Pattern Sweep

Counts are across `apps/api` + `apps/web` (mail/calendar/booking excluded from "new" counts — already remediated). Severity is the worst instance of the class.

| # | Class | Hits (new code) | Worst offender | Severity |
|---|---|---|---|---|
| 1 | **Auth gap / route not behind middleware** | 3 distinct | `tickets.ts:27-33` contradictory N8N-key-after-JWT → endpoints unreachable; `dashboard.revenue._index.tsx:44` delete **action** ungated (RR actions skip ancestor loader); `expenses.ts:34` separate N8N auth model | **Major** |
| 2 | **Mass assignment** (`.update/.insert(body|payload)` no allowlist) | ~13 | `agent-engine.ts:447,452,459,493,504` model-controlled payload → arbitrary columns; `agents.ts:183`; `content.ts:73,109,311,328`; `knowledge.ts:218,236,288` | **Critical** (agent-engine) |
| 3 | **Silent error-swallow** (`catch {}` / unchecked `{error}` / no `res.ok`) | ~30+ api, ~10 web | `email.ts` (6, audited); new code: `agent-engine.ts`, `agents.ts:272`, web `ComposeModal.tsx` ×4, `dashboard.settings.expenses.tsx` (all 3 branches), revenue/tickets bulk actions discard `{error}` | Minor–Major (volume) |
| 4 | **PostgREST `.or()` injection** | 1 live | `chat.ts:205` raw user `search` interpolated into `.or(name.ilike.%${search}%,...)` | **Major** |
| 5 | **`localStorage` in `useState(()=>)` initializer** | **0** | — (sidebar fix removed the only one; `useSidebarCollapsed.ts`/`useListWidth.ts` confirmed SSR-safe) | — clean |
| 6 | **External call without `.ok`** | ~8 | `learning.ts` 3 of 4 Anthropic calls unchecked (raw `data.content[0].text` → 500 + error-body leak); `agent-engine.ts:151-196` Serper/Brave; `knowledge.ts:307` RSS; `dashboard.content.new.tsx:45,58` | **Critical** (learning) |
| 7 | **External mutation not "confirm-first"** (drift) | finance | `stripe.ts` revenue = write-once webhook cache, no reconcile vs Stripe API; expenses sync stubbed ("coming soon") | **Major** |
| 8 | **Plaintext secrets in DB** | 0 new | only the known OAuth-token case (mail/calendar, accepted). Stripe/LinkedIn/Resend keys are Worker secrets. *Note: verify `expense_connections` doesn't store provider creds before SaaS.* | — / watch |
| 9 | **Webhook signature unverified** | **0** | Stripe `constructEventAsync(payload, sig, secret)` runs before any DB write — **PASS**. No other webhooks exist. | — clean |
| 10 | **Type divergence / dead schema** | several | `agent_performance` table never written (dead); `tickets.ts` hand-rolled `TicketRecord`; `pipeline.ts` inlines `createClient` ×3; learning scaffold; pervasive `USING(true)` RLS | Minor (hygiene) |

**Cross-cutting structural callout — `USING (true)` RLS.** Migrations 004, 008, 009, 013, 016, 017, 018 (and the `relationships`/`pipeline_evaluations`/`time_block_templates` tables specifically) ship policies that evaluate true for *any* role including anon. They are inert today because the API uses the service-role key exclusively and the allowlist gates users — but they are not the defense-in-depth they appear to be. This is the single biggest line-item for the multi-tenant migration.

---

## 4. Finance / Stripe (deeper pass)

**Webhook (`stripe.ts`):**
- **Signature verification — PRESENT & CORRECT** (`stripe.ts:71`, async Workers-compatible, on raw `c.req.text()` before any parse; missing sig → 400; bad sig → 400). The endpoint is on the public allowlist precisely *because* it is signature-gated. ✅
- **Idempotency — partial.** Replay safety rests solely on `revenue.upsert({onConflict:"stripe_invoice_id"})`. Fine for the one handled event; there is **no `stripe_events` table**, so any future non-invoice-keyed handler would have no replay protection and there is no delivery audit trail. (Major)
- **Event coverage — only `invoice.paid`.** `charge.refunded`, `charge.dispute.created`, `invoice.payment_failed`, `customer.subscription.deleted` are ACK'd (`{received:true}`) but produce **zero DB writes** — a chargeback, refund, or churn leaves no local trace. (Critical for financial accuracy)
- **DB write is column-safe** (explicit object literal, no raw body). ✅

**Endpoints & data:**
- `revenue` reads via web loader are auth-gated (ancestor `dashboard.tsx` loader runs `requireAuth`); the **delete action is not** (`dashboard.revenue._index.tsx:44` — RR v7 actions don't run ancestor loaders; service-role delete with no check). **F-3, Major.**
- `expenses.ts` sits behind its own `N8N_API_KEY` middleware (separate from the JWT chokepoint) — the founder UI can't reach it and a leaked N8N key syncs arbitrary expense rows. **Major.**
- `agent-engine.ts:599` `syncExpenses` upserts a raw `Record<string,unknown>` from a provider/AI response into `expenses` — **mass assignment on financial rows. F-5, Major.**
- **No `user_id` on any financial table; RLS = "authenticated".** Single-tenant-safe today; instant cross-user exposure if multi-tenant. **Major (multi-tenant gate).**

**Reconciliation drift (same class as the email→Gmail drift that needed Prompt 59):** revenue is a write-once webhook cache. Missed webhooks, endpoint downtime, pre-registration invoices, refunds/voids → permanent silent divergence from Stripe. No `POST /stripe/accounts/:id/reconcile` exists. **F-10, Major.**

**Finance verdict:** targeted hardening pass, **not** a full deep audit. Fix F-3 (revenue action auth), F-5 (expense upsert allowlist), add refund/dispute handlers, then schedule a reconcile job. The webhook core is sound.

---

## 5. Risk-Ranked Roadmap

### Tier 1 — do before any new feature / before enabling more agents

| Item | Module | Fix sketch | Belongs to |
|---|---|---|---|
| **T1-A** Agent injection → privileged write | agents | Delimit DB-content in prompts (XML fence + "data, not instructions" boundary); strip ` ```action:` from injected context values; **column-allowlist every `executeActions` insert/update** (no raw `payload`); gate `post_linkedin`/external-publish behind human review | *Prompt 63 — Agent hardening* |
| **T1-B** Stripe refund/dispute/churn unhandled | finance | Add handlers for `charge.refunded`, `charge.dispute.created`, `customer.subscription.deleted`, `invoice.payment_failed` (or at minimum persist + alert) | *Prompt 64 — Finance hardening* |
| **T1-C** Revenue delete action ungated | finance | Add `requireAuth` to `dashboard.revenue` action (and audit all web *actions* for the same RR-actions-skip-ancestor-loader gap) | *Prompt 64* |
| **T1-D** `tickets.ts` contradictory auth | tickets | Decide: n8n-webhook-only (drop from JWT chokepoint, validate N8N key, no JWT) **or** founder-facing (drop local middleware, use global auth). Required before time-boxing builds on tickets | *Prompt 65 — Time-box prep* |

*Note T1-A is genuinely single-tenancy-resistant; T1-B/C/D are financial-integrity / correctness gates rather than live external breaches.*

### Tier 2 — do before SaaS / multi-tenant

- **Rebuild RLS for real tenancy:** add `owner_id`/`user_id` to every business table (revenue, expenses, relationships, ventures, pipeline, tickets, knowledge, content, agents, learning…) and replace `USING(true)`/`role='authenticated'` with row-scoped policies. *Largest single line-item.*
- **Per-user ownership checks** on every API handler currently scoped only by the allowlist: learning conversations/progress/messages (no `.eq("user_id",…)`), pipeline evaluate, mcp context. Today these read "all rows."
- **Collapse the service-role-everywhere web layer:** migrate the ~50 direct-Supabase web loaders/actions onto `apiFetch`/the `/api/*` proxy so the API owns validation + audit. Mechanical, module-by-module.
- **Token encryption + secret hygiene:** revisit OAuth-token-at-rest (currently plaintext, accepted single-tenant) and confirm `expense_connections` stores no provider creds; static `LINKEDIN_ACCESS_TOKEN` has no refresh — will silently fail.
- **`chat.ts:205` `.or()` injection** — replace interpolation with chained `.ilike()`; multi-user makes this exploitable.
- **MCP SSRF** (`mcp.ts` `/ventures/:slug/health` HEAD-fetches DB-stored URLs) — validate scheme/host, block private ranges.

### Tier 3 — polish / hygiene (per module)

- **Mass-assignment allowlists** on the non-agent sites: `agents.ts:183`, `content.ts:73/109/311/328`, `knowledge.ts:218/236/288` (defense-in-depth even single-tenant).
- **`.ok` + `JSON.parse` guards** on AI/external calls: `learning.ts` (3 sites — currently 500s + leak error body), `agent-engine.ts` Serper/Brave, `knowledge.ts` RSS, `content.ts` AI generate, `dashboard.content.new.tsx`.
- **Silent-error cleanup:** the ~40 `catch{}`/unchecked-`{error}` sites — prioritize web *actions* that return `{ok:true}` on failure (revenue/tickets/settings).
- **Newsletter compliance:** `content.ts:569` `{{unsubscribe_url}}` placeholder is never substituted → every newsletter ships a dead unsubscribe link (CAN-SPAM/GDPR). Generate a signed token + `/newsletter/unsubscribe` endpoint.
- **Dead/divergent:** drop or implement `agent_performance`; replace hand-rolled `TicketRecord` with generated types; standardize `pipeline.ts` on `getSupabaseClient`.
- **Desktop:** set a concrete CSP (`tauri.conf.json` currently `"csp": null`) — low risk (capability locks navigation to `app.sheetzlabs.com/*`) but free hardening.

### Module deep-audit recommendations (ranked)

1. **Agents — YES, full Prompt-50-style deep audit, and it jumps ahead of finance and time-boxing.** It is the only module with a live exploit class that single-tenancy does not neutralize, and the `executeActions` surface (8 write targets + LinkedIn publish, all model-driven) is exactly the kind of privileged, externally-influenced code path the mail audit was built to find. **Needs its audit before the SaaS push.**
2. **Finance — targeted hardening pass, not a full deep audit.** Webhook core is sound; close F-3/F-5, add event handlers + reconcile. Re-audit only if it grows (Connect, payouts, multi-account).
3. **Knowledge — light deep-dive**, bundled with the agent audit (it's the upstream half of the injection path: RSS → `feed_items` → agent prompt).
4. **Relationships — schema/tenancy review only** (highest-PII module, zero user-scoping) — folds into the Tier-2 RLS rebuild.
5. Learning, Pipeline, Analytics, MCP, Content — no standalone deep audit; fold their findings into Tier 2/3.

### Feature-readiness — time-boxing

The substrate is **conditionally sound**:
- ✅ `calendar_events.is_time_block` (bool) + `calendar_events.task_id` FK already exist, live & indexed (migration 013). Calendar drag-move/resize is live and Google-first (post-Prompt-57).
- ✅ `tasks` (status/priority/due_date/milestone_id/venture_id) is a clean scheduling substrate.
- ✅ `time_block_templates` schema exists.
- ⚠️ **Fix first (both one-liners):** (a) `time_block_templates` RLS is `USING(true)` wide-open — scope it before building template CRUD; (b) `tasks` has **no `estimated_minutes`/duration column** — add one (nullable int) or the scheduler has no ground-truth block length.
- ⚠️ **Untangle `tickets.ts` auth (T1-D)** before exposing any "schedule this ticket" shortcut, and fix the ticket→task convert race (`dashboard.tickets._index.tsx:78` does a non-atomic direct-Supabase bulk convert).

**Build-readiness verdict:** time-boxing can proceed in parallel with the agent audit, *after* T1-D + the two one-line substrate fixes. It does **not** need to wait on the full Tier-2 RLS rebuild (single-tenant).

---

## 6. Residual register / pointers

- Mail/calendar/booking residuals: `docs/audits/email-calendar-reaudit.md`.
- This triage supersedes nothing it found in those modules; it only *adds* the non-mail modules.
- Current-state baseline: `sheetzlabs-os-project-summary.md` (regenerated alongside this doc, Prompt 62).
- E2E gate: `pnpm e2e` (Playwright, `apps/e2e`) — green at Prompt 61.
