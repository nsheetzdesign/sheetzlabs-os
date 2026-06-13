# Agents Module — Comprehensive Deep Audit (Prompt 64)

**Scope:** the full agent subsystem — injection→privileged-write path, execution/reliability, cost/loop safety, and cross-cutting auth.
**Method:** independent read-only pass (core engine + routes + cron read first-hand; seed migrations, web routes, and external-content ingestion via parallel read-only agents), then reconciled with the Prompt-62 platform triage.
**Date:** 2026-06-12 · **Status:** read-only. No code changed. Remediation is Prompt 65.

---

## Executive summary

The agent engine is unsafe **by construction**: external/attacker-controlled text is interpolated verbatim into a single concatenated prompt with no trust boundary (`buildPrompt`, `agent-engine.ts:384`), and model output is turned into **service-role database writes gated only by action *type*, never by payload** — `.insert(payload)` passes model-authored JSON straight to PostgREST (`agent-engine.ts:446–519`), so an injected model can mass-assign arbitrary columns and (via `update_relationship`/`update_task`) target arbitrary rows by id. The single worst path exploitable **today** is **meeting-prep**: a third party sends the founder a Google Calendar invite whose title/description carries a prompt-injection payload; it syncs into `calendar_events`, the founder clicks "Generate prep," and the injected text flows verbatim into a live tool-using run (web_search enabled) that can be steered to emit `create_task`/`create_knowledge` writes with attacker-chosen payloads. The damage is currently *contained* — single-tenancy stops cross-user reads, no agent holds `post_linkedin`/`queue_linkedin` (no auto-publish is wired), and AI drafts are not auto-sent — so the realized blast radius today is poisoned rows in the founder's own workspace plus attacker-chosen, founder-billed web/LLM spend on an **uncapped** budget with an **unbounded** agentic loop. **Verdict: safe to keep running for the single founder with eyes open, but NOT safe to (a) add any external-publish action to any agent, (b) onboard a second user, or (c) leave cost/loop uncapped — each is a one-line change away from a Critical.** This is a hardening job, not a teardown; the remediation is well-scoped and listed at the end.

---

## Scorecard

| Dimension | Grade | Critical | Major | Polish |
|---|---|---|---|---|
| Injection / action dispatch (Part A) | **D** | 2 | 2 | 1 |
| Execution / reliability (Part B) | **C−** | 0 | 3 | 2 |
| Cost / loop safety (Part B) | **D** | 0 | 2 | 1 |
| Cross-cutting (Part C) | **B−** | 0 | 1 | 3 |
| **Overall** | **C− / D+** | **2** | **8** | **7** |

Auth posture is the bright spot: every `/agents/*` route sits behind the global JWT + single-tenant allowlist chokepoint (`index.ts:74`, `middleware/auth.ts`), and Prompt 63's action-auth gating holds on the web side. The failure is entirely *inside* the trust boundary: once a request is admitted, nothing constrains what an injected model can cause.

---

## Data-flow diagram (external content → prompt → output → action → sink)

```
                    EXTERNAL / UNTRUSTED CONTENT
   ┌─────────────┬──────────────┬───────────────┬──────────────────┐
   │ Inbound     │ Google Cal   │ RSS feeds     │ Web pages        │
   │ email       │ invite       │ feed_items    │ (Serper/Brave)   │
   │ subj/snippet│ title/desc/  │ title/content │ title/snippet/   │
   │             │ attendees    │ (verbatim)    │ answerBox (raw)  │
   └──────┬──────┴──────┬───────┴───────┬───────┴────────┬─────────┘
          │             │               │ (founder "save"/"process" ── 2-step)
          │             │               ▼                │
          │             │         knowledge table        │
          │             │               │                │
          ▼             ▼               ▼                ▼
   gatherContext()  calendar_      gatherContext()   performWebSearch()
   case "emails"    events read    case "knowledge"  (Serper/Brave)
   (verbatim cols)  (route input)  (SELECT *, verbatim) (raw, no .ok)
          │             │               │                │
          └─────────────┴───────┬───────┴────────────────┘
                                 ▼
              ╔══════════════ GATE 0 (ABSENT) ══════════════╗
              ║ buildPrompt(): replaceAll {{var}} → verbatim ║   ← agent-engine.ts:384
              ║ NO delimiter, NO escaping, NO system/data    ║      NO TRUST BOUNDARY
              ║ separation. One concatenated user string.    ║
              ╚══════════════════════╤═══════════════════════╝
                                     ▼
                   anthropic.messages.create()
              ┌──────────────────────┴───────────────────────┐
              │ executeAgent (NO tools)   executeAgentWithTools│
              │  cron / /run / draft-ai    while(true) loop,   │  ← GATE: loop has
              │  → web_search INERT        web_search LIVE      │     NO max-iteration
              │                            (pipeline, meeting)  │     NO timeout (Major)
              └──────────────────────┬───────────────────────┘
                                     ▼  free-text output
              ╔═══════════ GATE 1 (TYPE ONLY) ═══════════╗
              ║ regex ```action:TYPE``` + allowedActions  ║   ← agent-engine.ts:405,411
              ║ .includes(TYPE)  →  ✅ type checked        ║      payload NOT checked
              ╠═══════════ GATE 2 (ABSENT) ══════════════╣
              ║ JSON.parse(payload) → .insert(payload)    ║   ← agent-engine.ts:446-519
              ║ NO column allowlist, NO shape validation, ║      MASS ASSIGNMENT
              ║ model picks id for update_* (IDOR)        ║      BY THE MODEL
              ╚══════════════════════╤═══════════════════╝
                                     ▼  SERVICE-ROLE writes (RLS bypassed)
   ┌──────────┬──────────┬───────────┬──────────┬───────────┬──────────────┐
   │ tasks    │ knowledge│ relation- │ email_   │ calendar_ │ content_queue│
   │          │          │ ships     │ drafts   │ events    │ → cron auto- │
   │          │          │ (by id)   │          │           │   posts (lat)│
   └──────────┴──────────┴───────────┴──────────┴───────────┴──────┬───────┘
                                                                    ▼
                                                       postToLinkedIn (LATENT —
                                                       no agent holds the action;
                                                       content_queue 'scheduled'
                                                       rows auto-post via cron)
```

**Gate inventory:** Gate 0 (prompt trust boundary) = **absent**. Gate 1 (action-type allowlist) = **present** (`output_actions` enforced). Gate 2 (payload/column validation) = **absent**. Loop bound / cost cap / timeout = **absent**.

---

## Part A — Injection → privileged action

### AG-A1 (CRITICAL) — No trust boundary: external content interpolated verbatim into the prompt
`buildPrompt` (`apps/api/src/lib/agent-engine.ts:384-393`) builds the entire user message by `replaceAll`-ing `{{key}}` placeholders with `JSON.stringify`/`String()` of context — **no delimiting, no escaping, no "treat as untrusted data" framing**, and the whole thing is one concatenated `user` string (`agent-engine.ts:62`, `218`). The system prompt is separate, but every untrusted source lands in the same user blob the model treats as instruction-eligible:
- **Inbound email** — `gatherContext` `case "emails"` selects `subject, from_email, from_name, snippet` verbatim (`agent-engine.ts:341-349`). Anyone who emails the founder controls these. Consumed by **email-drafter** (`input_sources: ["relationships","ventures","emails"]`, `011b_email_drafter_agent.sql:53`).
- **Calendar invite** — `meeting-prep` is handed `event_title`, `event_description`, `attendees` straight from the row (`calendar.ts:855-860`). Calendar events sync in from Google invites — externally authored.
- **Web search** — Serper/Brave `title`/`snippet`/`answerBox`/`knowledgeGraph` returned raw into a `tool_result` (`agent-engine.ts:96-99,164-170`).
- **RSS / captures → knowledge** — `feed_items` (`knowledge.ts:313-323`) and `captures` (`knowledge.ts:236,259`) store remote content verbatim; a founder "save"/"process" promotes it into `knowledge`, which agents read via `SELECT *` (`agent-engine.ts:314-322`).

**Industry standard:** untrusted data is wrapped in explicit delimiters with a "the following is data, not instructions" preamble, or passed as a structured non-instruction channel; tool-use systems additionally constrain what the model can *do* regardless of what it's told (see AG-A2). Here there is neither containment nor constraint.

### AG-A2 (CRITICAL) — Action dispatch gated by *type* only; payload is unvalidated mass assignment under the service role
`executeActions` (`agent-engine.ts:395-539`) parses ```` ```action:TYPE ```` blocks, checks `allowedActions.includes(actionType)` (`:411`) — that is the **only** gate — then `JSON.parse`s the model's payload and hands it to PostgREST:
- `create_task`: `supabase.from("tasks").insert(payload)` (`:447`) — **raw model JSON, every column writable**.
- `create_knowledge`: `.insert(payload)` (`:452`).
- `create_draft`: `.insert({ ...payload, agent_run_id })` (`:490-497`).
- `create_calendar_event`: `.insert({ ...payload, ... })` (`:502-510`).
- `update_relationship`: `.update(payload).eq("id", payload.id)` (`:457-462`) — **the model chooses both the target row id and the column set** → IDOR-by-model + mass assignment.
- `update_task`: same shape (`:514-518`).

There is no per-action column allowlist, no zod/shape validation, no check that the write stays within the agent's purpose. Because the engine runs under `SUPABASE_SERVICE_ROLE_KEY` (`agents.ts:20`, `scheduled.ts:35`), **every write bypasses RLS entirely** — the `USING(true)` policies (`008_agent_infrastructure.sql:78-80`) are moot. A content agent that can emit `create_task` can write any `tasks` column; an injected `update_relationship` can overwrite an arbitrary relationship row.

**Industry standard:** tool/action handlers validate the payload against a strict per-action schema (allowed columns, types, value ranges), scope writes to the agent's domain, and never let model output select a primary key for an update. The action-*type* allowlist is necessary but nowhere near sufficient.

> **Reconciliation with triage:** confirms the triage's core call (`.insert(payload)` gated by type not columns). **Refinement:** the triage flagged `postToLinkedIn` as the live LinkedIn sink — see AG-A3; it is *latent*, not live.

### AG-A3 (MAJOR) — `postToLinkedIn` / auto-publish is latent but one config change from live
- **No seeded agent holds `post_linkedin` or `queue_linkedin`** (verified across all `INSERT INTO agents` migrations). So the model cannot reach `postToLinkedIn` through any of the 16 agents today.
- **But the auto-publish machinery is live and uncontrolled:** the `post_linkedin` action posts immediately (`agent-engine.ts:481-483` → `:541`), and `queue_linkedin` with `payload.post_now` writes `content_queue` with `status:"scheduled"` (`:466-479`). The cron then **auto-posts every `scheduled` row whose `scheduled_for <= now`** with no human gate (`scheduled.ts:67-75` → `postScheduledContent` → `postToLinkedIn`). `scheduled_for` defaults to `now()` (`:473`).
- The web review UI (`dashboard.agents.content.tsx`) only ever sets `draft`→`scheduled` on an explicit human "Post Now"/schedule click, so the *human* path is gated. The *machine* path is not: granting any web_search/email-reading agent the `post_linkedin` action (a single `PATCH /agents/:slug` or seed edit — see AG-C1) turns AG-A1+AG-A2 into **injected-content → public LinkedIn post**, fully automated.

**Industry standard:** outbound publish actions are queued-for-approval by default with an immutable human-approval step; "post now" is never reachable directly from model output.

### AG-A4 (MAJOR) — `web_search` returns attacker-controlled web content raw, with no transport check
`performWebSearch` (`agent-engine.ts:151-197`) maps Serper `organic`/`answerBox`/`knowledgeGraph` and Brave results into the tool result with **zero sanitization**, and calls `await response.json()` with **no `.ok` check** — a Serper/Brave 4xx/5xx body is parsed as if successful (best case: `.organic ?? []` empties it; worst case for `answerBox`/`knowledgeGraph`: raw error object injected). An attacker who ranks for a query the agent will run controls `snippet`/`answerBox` text that flows verbatim into the loop (AG-A1).

### Output-parsing note (not a separate finding)
Output → action is via regex over free text (`agent-engine.ts:405`), so a malformed/no-action response simply yields no actions (fail-safe on parse). The model **cannot** emit an action outside `output_actions` (Gate 1 holds). The danger is entirely in *what a permitted action's payload may contain* (AG-A2), not in conjuring new action types.

---

## Part B — Execution & reliability

### AG-B1 (MAJOR) — Unbounded agentic loop: no max-iteration, no timeout, no abort
`executeAgentWithTools` runs `while (true)` (`agent-engine.ts:69-105`), breaking only when the model stops emitting tool calls. There is **no iteration cap, no wall-clock timeout, no token-budget exit.** A model that keeps emitting `web_search` calls (whether by injection or by genuinely looping) drives an unbounded sequence of real Anthropic calls *and* Serper/Brave calls until the Workers CPU/subrequest limit kills the invocation — every iteration is billable. This is the single clearest runaway-cost vector.

**Industry standard:** agentic loops carry a hard max-iteration count (e.g. 5–10), a wall-clock deadline, and a cumulative-token ceiling that forces a final answer.

### AG-B2 (MAJOR) — No cost cap anywhere (per-run or per-day)
`cost_cents` is *computed and recorded* (`agent-engine.ts:112,227`) but **never enforced** — nothing reads prior spend before launching a run. There is no per-agent, per-run, or per-day token/dollar budget. Combined with AG-B1 and the cron auto-running every enabled scheduled agent (`scheduled.ts:46-64`), a misbehaving or injected agent has no spend ceiling. (Grep for `cost_cap`/`budget`/`rate.limit` over the agent path returns only the booking rate-limiter and Workers subrequest budgets — nothing for LLM spend.)

### AG-B3 (MAJOR) — No run-overlap protection and no stuck-`running` recovery
- **Overlap:** the cron inserts a fresh `agent_runs` row with `status:"running"` whenever `shouldRunNow` matches (`scheduled.ts:46-62`), with **no check that the agent's previous run finished.** A run that outlives its minute (long web_search loop) will be launched again on the next matching tick → concurrent duplicate runs. The reminders/`processScheduledSends` claim-pattern lesson (atomic `UPDATE … WHERE …_at IS NULL`) is **not applied** to agent runs.
- **Stuck state:** if the worker is evicted mid-run (CPU/subrequest cap, `waitUntil` cutoff), the row stays `"running"` forever — `executeAgent`/`executeAgentWithTools` only flip to `completed`/`failed` inside their own try/catch (`agent-engine.ts:124-148,231-255`), which a hard kill skips. The email pipeline *does* crash-recover stuck `"sending"` rows (`scheduled.ts:95`); **agent_runs has no equivalent sweep.** `agent_actions` already written before a mid-run crash are left orphaned against a never-completing run.

### AG-B4 (MAJOR) — `learning.ts` AI endpoints: raw fetch, no `.ok`, unguarded output parse
The education endpoints call Anthropic via raw `fetch` and read `data.content[0].text` with **no status check**: guarded once (`learning.ts:188` guards `:190`) but **unguarded at `:261`, `:312`, `:458`**. A non-2xx Anthropic response returns `{type:"error",...}` with no `content` array → `data.content[0]` throws `TypeError`, and these handlers have no try/catch → unhandled 500 leaking the raw error. `/generate/curriculum` additionally `JSON.parse`s a regex-extracted blob from model output (`learning.ts:262-269`) with no schema validation before returning it. (Education agents themselves hold no `output_actions`, so this is a reliability/error-handling finding, not an injection one.)

### AG-B5 (POLISH) — content_queue approval flow is human-gated *from the UI* (good), but not structurally
The review surface (`dashboard.agents.content.tsx`) shows agent-generated `content_queue` drafts in full and only posts on an explicit, `requireAuth`-gated "Post Now" click → authed `POST /agents/content/queue/:id/post` (`agents.ts:99-116`). **Verdict: gated, human-in-the-loop — no auto-publish from this UI.** The structural gap is AG-A3: the cron auto-posts `scheduled` rows regardless of how they reached that status, so the gate lives in convention (no agent emits `queue_linkedin`) rather than in the machine.

### AG-B6 (POLISH) — Observability is thin; `agent_performance` is a dead table
- The runs list surfaces failed-run count + error-rate and per-run `error_message` (`dashboard.agents.runs._index.tsx`, `runs.$id.tsx:131-140`) — failures are *visible* (unlike the pre-59 inbox).
- **Gaps:** the Performance tab is a literal stub ("coming soon", `dashboard.agents.performance.tsx`); **cost is never surfaced** in the runs UI (tokens only); nothing flags a stuck-`running` row as stale (it shows an amber pill indefinitely). The `agent_performance` table (`018_analytics.sql:52`) is **never written or read** by any route — dead schema.

---

## Part C — Cross-cutting

### AG-C1 (MAJOR) — `PATCH /agents/:slug` is full mass assignment over the thing that defines agent power
`agents.patch("/:slug")` does `supabase.from("agents").update(body)` with the **entire request body** (`agents.ts:176-190`) — no column allowlist. A single authenticated request can rewrite `system_prompt`, `output_actions`, `model`, `max_tokens`, `schedule`, and `enabled`. This is founder-authenticated (single-tenant, so not a privilege escalation *between users*), but it is the **enable switch for every latent Critical**: one PATCH adds `post_linkedin` to a web-reading agent (AG-A3), points `model` at an arbitrary string, or sets a runaway `schedule`. It is the calendar-account mass-assignment class applied to the agent definition itself, with the largest possible blast radius.

**Industry standard:** config-mutation endpoints allowlist editable fields; power-granting fields (permitted actions, model, schedule) require a separate, explicit, audited path.

### AG-C2 (POLISH) — Auth posture is correct (confirm, don't fix)
All `/agents/*` routes are behind the global `authMiddleware` JWT + `ALLOWED_USER_EMAILS` gate (`index.ts:74`, `middleware/auth.ts:62-111`); the cron reaches internal HTTP endpoints via the constant-time `X-Internal-Secret` path. Web actions that mutate (`$slug.tsx` run/toggle, `content.tsx` post/delete) call `requireAuth` as their first line per Prompt 63. No `.or()` user-input injection exists in `agents.ts` (the only `.or`-style filters are absent; queries are `.eq` on path params). **No regression from Prompt 63.**

### AG-C3 (POLISH) — Legacy n8n run endpoints write a divergent column shape
`POST /agents/runs` and `PATCH /agents/runs/:id` (`agents.ts:193-239`) write `tokens_used` (the old `004` column), while the engine writes `tokens_input`/`tokens_output`/`cost_cents` (`008`). Two coexisting token schemas on one table → the runs UI reads `tokens_used` (so engine runs show blank tokens there) while `$slug.tsx` reads `cost_cents`. Type/shape divergence; harmless but confusing. These endpoints are now behind the JWT gate (post-51), so the n8n automation must present a token to use them — confirm n8n still can, or they are orphaned.

### AG-C4 (POLISH) — Hardcoded Sonnet pricing in cost math
`costCents = (tokensInput*3 + tokensOutput*15)/10000` (`agent-engine.ts:112,227`) hardcodes Sonnet-4 pricing with a "Claude Sonnet 4" comment. `model` is per-agent and PATCH-mutable (AG-C1); any override silently mis-costs. Minor today (all 16 seeds use the default model) but a latent correctness bug.

### AG-C5 (register, don't fix) — Multi-tenant readiness
No agent table (`agents`, `agent_runs`, `agent_actions`, `content_queue`, `agent_performance`) carries a `user_id`; all RLS is decorative `USING(true)`. `gatherContext` reads global tables (all ventures/revenue/emails/etc.). When a second user exists, every agent reads and writes across all users' data and the single-tenant allowlist no longer contains AG-A1/AG-A2. This is the platform-wide multi-tenant blocker; register here, address platform-wide.

---

## Per-agent risk table (16 agents)

"Web_search live?" reflects the **executor actually used**: `executeAgent` (cron / `/run` / `draft-with-ai`) passes **no tools**, so `web_search` is inert there; only `executeAgentWithTools` (pipeline `/:id/evaluate` and calendar meeting-prep) executes it.

| Agent | Dept | Enabled | Trigger | Executor | web_search live | Untrusted input reaching prompt | Worst-case action today | Exploitable now? |
|---|---|---|---|---|---|---|---|---|
| **meeting-prep** | executive | yes | manual (calendar "prep") | **withTools** | **yes** | **Calendar invite title/desc/attendees (external) + live web** | `create_task`, `create_knowledge` (mass-assign) | **YES — cleanest path** |
| **email-drafter** | marketing | yes | manual ("draft with AI") | executeAgent | no | **Inbound email subject/snippet (external, unauth)** | `create_draft` + `update_relationship` (IDOR by id) | **YES** |
| **idea-evaluator** | product | yes | manual (`/pipeline/:id/evaluate`) | **withTools** | **yes** | Pipeline notes (founder) + **live web** | `create_evaluation`/`create_task`/`create_knowledge` | **YES (web-content vector)** |
| **news-curator** | research | yes | **cron** `0 7 * * 1-5` | executeAgent | no (inert) | `knowledge` (poisonable via RSS/capture, 2-step) | `create_knowledge` | Partial — 2-step via poisoned `knowledge` |
| **content-writer** | marketing | yes | manual | executeAgent | no | `knowledge` (poisonable, 2-step) | `create_knowledge` | Partial — 2-step |
| **newsletter-curator** | marketing | yes | **cron** `0 9 * * 4` | executeAgent | no | `knowledge` + `content_queue` (poisonable, 2-step) | `create_knowledge` | Partial — 2-step |
| **competitor-intel** | research | yes | **cron** `0 10 * * 1` | executeAgent | no (inert) | `ventures` (internal) | `create_knowledge`/`create_task` | Low (web inert on cron) |
| **relationship-nudger** | operations | yes | **cron** `0 8 * * 1-5` | executeAgent | no | `relationships` (notes may be inbound) | `create_task`/`create_knowledge` | Low–medium |
| **task-prioritizer** | operations | yes | **cron** `0 6 * * 1-5` | executeAgent | no | `calendar_events` (invite text) | `update_task`, `create_calendar_event` | Low–medium |
| **system-health** | operations | yes | **cron** `0 */6 * * *` | executeAgent | no | internal telemetry | `create_task`/`create_knowledge` | Low |
| **decision-support** | executive | yes | manual | executeAgent | no | internal + founder `{{user_query}}` | `create_task`/`create_knowledge` | Low |
| **pm-assistant** | product | yes | manual | executeAgent | no | internal | `create_task`/`create_knowledge` | Low |
| **expense-auditor** | finance | yes | **cron** `0 8 1 * *` | executeAgent | no | internal financial | `create_task`/`create_knowledge` | Low |
| **curriculum-generator** | education | yes | manual (learning route) | n/a | no | topic (founder) | **none** (`output_actions: []`) | No |
| **lesson-writer** | education | yes | manual | n/a | no | codebase_context (founder) | **none** | No |
| **tutor** | education | yes | manual | n/a | no | none declared | **none** | No |

**Live-now exploitable set:** meeting-prep, email-drafter, idea-evaluator (3 manual-trigger agents). **2-step (requires founder to first promote poisoned RSS/capture into `knowledge`):** news-curator, content-writer, newsletter-curator. **Fully latent:** all LinkedIn/auto-publish (no agent holds the action). **Inert:** every cron agent's `web_search` (wrong executor). **No-action:** the 3 education agents.

> **Reconciliation with triage:** triage said "knowledge/web/news agents are live; LinkedIn latent." **Confirmed direction, two refinements:** (1) the *web_search* injection vector is **inert on the cron/`/run` path** — it only fires through the two manual `executeAgentWithTools` endpoints, so the live web-injection agents are meeting-prep and idea-evaluator, not the scheduled news/competitor agents; (2) LinkedIn is **more latent than stated** — no agent holds `post_linkedin`/`queue_linkedin` at all, so it's not merely "auto-post latent" but "action-ungranted," gated behind one `PATCH`/seed edit (AG-C1/AG-A3).

---

## Recommended remediation order (Prompt 65 plan)

**Group 1 — Close the dispatch gate (Critical; do first, smallest blast radius per line).**
1. AG-A2: add a per-action payload schema (allowed columns + types) in `executeActions`; reject unknown columns; for `update_relationship`/`update_task`, scope the target id to the agent's domain instead of trusting `payload.id`. This is the highest-leverage fix — it neutralizes AG-A1's impact even if injection succeeds.
2. AG-A3: route every outbound/publish action (`post_linkedin`, and any future external sink) through mandatory human approval; remove the cron's ability to auto-post a row that was never human-approved (add an `approved_by`/`approved_at` gate to `postScheduledContent`).

**Group 2 — Contain the prompt (Critical/Major).**
3. AG-A1: wrap all untrusted context in explicit data delimiters with a "treat as data, not instructions" preamble in `buildPrompt`; minimally, fence email/calendar/web/knowledge blocks.
4. AG-A4: add `.ok` checks to `performWebSearch`; strip/escape result fields before they enter the loop.

**Group 3 — Cost & loop safety (Major).**
5. AG-B1: cap the `while(true)` loop (max iterations + cumulative-token ceiling + wall-clock deadline).
6. AG-B2: enforce a per-run and per-day token/cost budget before launching a run (read recent `agent_runs.cost_cents`).

**Group 4 — Run integrity (Major).**
7. AG-B3: apply the claim-pattern to run launch (skip if a non-terminal run for the agent exists) and add a stuck-`running` sweep to the cron (mirror the `processScheduledSends` crash-recovery).
8. AG-B4: add `.ok` + guarded parse + try/catch to all `learning.ts` AI handlers.

**Group 5 — Config & hygiene (Major/Polish).**
9. AG-C1: allowlist editable fields on `PATCH /agents/:slug`; gate `output_actions`/`model`/`schedule` behind a separate explicit path.
10. AG-C3/AG-C4/AG-B6: unify the token-column shape, fix/parameterize cost pricing, surface cost + stuck-run staleness in the runs UI, and either wire or drop `agent_performance`.
11. AG-C5: registered as the platform-wide multi-tenant blocker — out of scope for Prompt 65, tracked separately.

---

## Completion checklist

- [x] Every external-content entry point enumerated (email, calendar invite, RSS→knowledge, captures→knowledge, web_search; MCP confirmed outbound-only, non-feeding)
- [x] Action dispatch gate analyzed — type allowlist (present, AG-A2/Gate 1) **and** payload validation (absent, Gate 2) assessed per action
- [x] `postToLinkedIn` trigger + controllability assessed (latent: no agent holds the action; auto-post machinery live — AG-A3)
- [x] Per-agent exploitable-now-vs-latent table complete (16 agents; executor nuance applied)
- [x] Cost/loop/timeout protection explicitly verified — **all absent** (AG-B1/AG-B2)
- [x] Run-integrity + cron-overlap + stuck-`running` analyzed (AG-B3)
- [x] content_queue approval flow assessed — UI-gated, structurally ungated (AG-B5/AG-A3)
- [x] Reconciled with Prompt-62 triage (confirmed core; refined web_search-inert-on-cron and LinkedIn-ungranted)
- [x] NO code changed
