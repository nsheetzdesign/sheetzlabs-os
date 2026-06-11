# Email + Calendar Audit — 2026-06-11

Read-only audit of the inbox and calendar/booking modules (built Prompts 16–17, 23A–G, 37–40) against industry benchmarks: Superhuman/Gmail for email, Cal.com/Notion Calendar for calendar. No code was changed. All file:line references verified against current `main` (3e13648).

## Executive Summary

The modules are feature-ambitious demo-quality shells with systemic correctness, security, and reliability gaps; overall grade **D**. The four most dangerous problems are: (1) the entire API worker is **unauthenticated with open CORS while using the service-role key**, so anyone on the internet can read all mail, send as the user, and overwrite OAuth tokens; (2) email HTML bodies are rendered with `dangerouslySetInnerHTML` and **no sanitization anywhere** — a live XSS vector from any sender; (3) the booking flow performs **no availability re-check and has no unique constraint at confirmation**, so double-booking (and booking arbitrary times like 3 AM via direct POST) is trivial, and slot math runs in UTC instead of the host's timezone; (4) several shipped UI flows are silently broken — the compose modal's Send button doesn't send email, draft autosave and label creation POST to unregistered routes (404), and the thread view fetches a nonexistent endpoint, making it dead code in production. Recommended fix order: security hardening first (auth, XSS, booking validation, rate limiting), then sync correctness (Gmail write-back, historyId expiry, calendar deletions/cron, timezones), then the broken UI flows, then UX polish (optimistic UI, undo, keyboard, booking page trust signals).

## Scorecard

| Area | Grade | Critical | Major | Polish |
|------|-------|----------|-------|--------|
| Email sync | D | 4 | 6 | 5 |
| Email compose/send | D- | 3 | 3 | 5 |
| Email UX | D | 2 | 9 | 5 |
| Calendar sync | D | 7 | 10 | 5 |
| Booking system | F | 9 | 10 | 6 |
| Cross-cutting | F | 2 | 4 | 2 |

Severity definitions — **Critical**: data loss, broken core flow, or security. **Major**: degrades daily use. **Polish**: UX/visual gap vs. industry standard.

---

## Findings

### Cross-Cutting (read these first — they amplify everything else)

#### [CRITICAL] XC-1: Entire API is unauthenticated, open-CORS, service-role-backed
- **File:** `apps/api/src/index.ts:44-67` (`app.use("*", cors())`, no auth middleware); every handler builds `createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY)` (e.g. `apps/api/src/routes/email.ts:24,84,187,380`, `calendar.ts:104-128`, `booking.ts:153-163`)
- **Issue:** Anyone can `GET /email/messages` (read all mail), `POST /email/drafts/:id/send` (send as the user), `DELETE /email/accounts/:id`, `GET /booking/bookings` (all guest emails/notes), `DELETE /booking/links/:id`. Worse, `PATCH /calendar/accounts/:id` (`calendar.ts:104-117`) and `PATCH /booking/links/:id` (`booking.ts:127-141`) pass the raw body to `.update()` — mass assignment lets an attacker overwrite `access_token`/`refresh_token`. OAuth tokens are stored plaintext. A debug endpoint `GET /email/test-labels/:accountId` (`email.ts:554-594`) leaks token expiry and raw Gmail responses. The cron even relies on this exposure, HTTP-fetching its own public `/email/sync` (`scheduled.ts:77-80`).
- **Industry standard:** Bearer/JWT auth middleware on all non-public routes, user-scoped clients under RLS, encrypted token storage, no debug endpoints in prod.
- **Fix complexity:** M

#### [CRITICAL] XC-2: OAuth callbacks have no `state` parameter (CSRF on account linking)
- **File:** `apps/api/src/routes/email.ts:33-52,55-108`; `apps/api/src/routes/calendar.ts:55-101`
- **Issue:** Both Gmail and Calendar OAuth flows build the auth URL without `state` and the callbacks accept any code — an attacker can trick the victim into linking the attacker's account (login CSRF). The email callback also ignores the upsert error and redirects `?connected=true` even on DB failure (`email.ts:85-107`).
- **Industry standard:** Random `state` nonce stored server-side/cookie, verified on callback.
- **Fix complexity:** S

#### [MAJOR] XC-3: Silent-failure epidemic — ~100 unchecked error sites
- **Issue:** Virtually no Supabase `{ error }` result is checked and most `fetch` calls skip `res.ok`; many catches are empty. Full inventory:
  - **email.ts** — empty catches: `522-524` (resync-bodies loop), `992-994` (per-message in full-sync — token expiry mid-sync silently skips pages), `1481-1490` (triage swallows Anthropic errors, fabricates confidence 0.5). Unchecked Supabase writes/reads: lines `25, 85-100, 115-117, 150-153, 178, 230-258, 291, 299-303, 316, 326, 334, 354` (draft insert failure returns `{draft:null}` HTTP 200), `362-374, 390, 424-445, 519, 607, 615-634, 647, 658-675, 728, 751-770, 786, 838, 856-886, 960-1004, 1618, 1635, 1675, 1702, 1711-1761`. `getValidAccessToken` (`1342-1370`) never checks `response.ok`.
  - **scheduled.ts** — `:74` `unsnooze_emails` RPC result discarded; `:79` cron sync fetch unchecked; `:130-132` empty catch in feed loop; `:144-150,174,181-187,211` reminder selects/updates unchecked.
  - **calendar.ts** — `26-30, 89-98, 109-116, 124-125` (account delete FK failure returns `{success:true}` — see CS-9), `209-218` (sync upserts; `syncedCount` counts failures as synced), `252-266, 294-308` (event insert may return `{event:null}` 200), `363-374, 451-465, 573-575, 604-609, 715-721, 754, 786-794, 816-823, 855-861`.
  - **booking.ts** — `146, 175-178, 342-345` (cancel proceeds to gcal+emails even if DB update failed), `189-191, 356-358, 477-479, 589-591` (empty catches on Google Calendar delete/create/patch — not even console.error), `210-213, 377-380, 503-506, 611-614` (`sendBookingEmail` boolean ignored at 8 call sites), `268-276` (`calRes.ok` unchecked — see BK-5), `471-474`.
  - **send-booking-email.ts:14-24** — catches everything, returns `false`; Resend SDK `{ error }` payload never inspected.
  - **Web inbox** — `dashboard.inbox._index.tsx:308-310` (empty catch, focus sync), `:336-338` (empty catch masking the dead thread route EU-2), `:359-363` (bulk fetcher result unchecked); `ComposeModal.tsx:169,387` (`.catch(() => {})`), `:224-226,309-311` (catch-ignore on template save / AI draft), `:443-459` (modal closes before fetcher resolves; `fetcher.data` never read); `dashboard.inbox.bulk.tsx:17-86` (every update's error ignored, always returns `{success:true}`); `dashboard.inbox.$id.tsx:52-64`, `$id.star.tsx:11`, `$id.snooze.tsx:10-23` (errors ignored); `dashboard.inbox.compose.tsx:106-113`; `draft-ai.tsx:19` (`res.json()` without `res.ok`); `SnoozePicker.tsx:83-90` (navigates away before fetcher resolves).
  - **Web calendar** — `dashboard.calendar._index.tsx:179` (empty catch on sub-calendar fetch), `:207-265` (all action fetches discard `res.ok`), `:301` + `booking-links.tsx:101` (`setTimeout(onClose, 100)` closes modal before result known), `:621` (detail modal renders null body on failure); `dashboard.calendar.$id.tsx:51,57,73`; `book.$slug.tsx:106-108` (booking failure invisible — BK-9), `book.reschedule.$bookingId.tsx:109`, `book.cancel.$bookingId.tsx:41-53` (no try/catch; network error strands "Cancelling..." forever); `booking-links.tsx:46-47` + `bookings.tsx:25` (loader `res.json()` without `res.ok`).
- **Industry standard:** Every mutation surfaces failure to the caller/UI; crons log and alert.
- **Fix complexity:** L (systemic; fix alongside each remediation prompt)

#### [MAJOR] XC-4: Shared types unused — shapes hand-rolled and divergent everywhere
- **File:** `packages/shared/types/database.types.ts` has generated row types for `emails`, `bookings`, `booking_links`, `calendar_events`, etc. — never imported by any inbox/calendar file. `apps/api/src/lib/supabase.ts:9-11` exports a typed client that `email.ts` never uses (it constructs ~40 untyped clients).
- **Issue:** Four divergent `Email` interfaces (`EmailList.tsx:9-21`, `EmailPreview.tsx:8-23` — which reads nonexistent `email.snippet` at `:184`, `ThreadView.tsx:5-17` — `to_emails: string` vs array elsewhere, `ComposeModal.tsx:23-31`); three divergent `Booking` shapes (`bookings.tsx:8-19`, `book.cancel:6-15`, `book.reschedule:19-27`); `AvailabilityRules` duplicated in 3 files. Explicit `any` + eslint-disables: `email.ts:603,812,849,1030,1121,1341,1360,1502,1524,1615,1641,1684,1768,1778`; `calendar.ts:836`; `booking.ts:50`; `_index.tsx:28,103,125,210,245,249`; `InboxSidebar.tsx:457-460`. `getValidAccessToken` is copy-pasted across `email.ts`, `calendar.ts:833-864`, and `booking.ts:47-78` — three copies to fix for the token bug (ES-3/CS-3). The `display_name` bug (CS-13) is a direct consequence of hand-rolled selects.
- **Fix complexity:** M

#### [MAJOR] XC-5: Hardcoded production URLs bypass env config
- **File:** `ComposeModal.tsx:5`, `useEmailPolling.ts:4`, `dashboard.inbox.compose.tsx:77`, `InboxSidebar.tsx:281`, `book.cancel.$bookingId.tsx:41`, `dashboard.calendar.booking-links.tsx:170` (copy-link uses `https://sheetzlabs.com`, app serves from `app.sheetzlabs.com`)
- **Issue:** Local dev hits production API; cancel page ignores the `apiUrl` its own loader returns; copied booking links may 404 on the wrong domain.
- **Fix complexity:** S

#### [POLISH] XC-6: Dead code / dead schema inventory
- Duplicate `GET /email/search` at `email.ts:1110-1140` — unreachable (first registration at `:794` wins); the dead one has the correct wildcard escaping.
- `seed_email_labels_for_account` RPC (migrations 020/023) — never called from TS; superseded by `syncLabelsForAccount`.
- `emails.labels TEXT[]` (011) written only by the legacy parser, never queried. `email_drafts.scheduled_for`, `is_minimized`, `last_auto_saved_at` (020) — zero references. `bcc_emails` never populated.
- Legacy `POST /email/accounts/:id/sync` + `parseGmailMessage` + inline triage (`email.ts:185-270,1372-1402`) — superseded, and writes wrong data (ES-7).
- `calendar_events.sub_account_id` (015) never written; `recurrence_rule` effectively always null under `singleEvents=true`; `ai_prep_doc_id` (013) never linked; `bookings.status='completed'` never set; `cancellationEmail`'s `isHost` param unused (`booking-emails.ts:162-199`); duplicate calendar-list endpoints (`calendar.ts:131-160` vs `:763-804`).
- Web: `ThreadView.tsx` dead in production (EU-2); `EmailPreview.tsx:111-116` Snooze/More buttons have no onClick; `ComposeModal.tsx:650-652` attach button does nothing; `_index.tsx:78-89` console.log debugging in the loader plus per-request label-seeding migration logic (`:110-155`); `EventDetailModal` (`dashboard.calendar._index.tsx:385-626`) near-duplicates the whole `$id` page.
- **Fix complexity:** S–M (delete during remediation)

---

### 1. Email — Sync Correctness & Reliability (Grade: D)

#### [CRITICAL] ES-1: Local mutations never write back to Gmail — one-way sync masquerading as two-way
- **File:** `apps/api/src/routes/email.ts:316,326,334,654-678,683-741,746-773` (read/star/archive/trash/spam/labels/snooze all update only Supabase); scope `gmail.modify` requested at `:37` but zero `users.messages.modify`/`trash`/`batchModify` calls exist
- **Issue:** Archives, stars, read-state, labels, and snoozes silently revert: the full-sync update path (`email.ts:960-967`) overwrites local flags with Gmail's state, and Gmail (phone, web) never sees the change.
- **Industry standard:** Every mutation issues `users.messages.modify` (or batchModify for bulk).
- **Fix complexity:** L

#### [CRITICAL] ES-2: Expired `historyId` (404) never handled — incremental sync silently sticks forever
- **File:** `apps/api/src/routes/email.ts:1685-1705` (`syncViaHistory` never checks `response.ok`)
- **Issue:** Gmail returns 404 when `startHistoryId` is too old (~1 week). The parsed body has no `history`, the function returns 0, `last_history_id` is never advanced, and since `full_sync_completed=true` (`:869-877`) the account replays the dead historyId on every 5-minute cron run. **No new mail ever syncs again and no error is recorded** (sync_status reset to "idle" at `:877`).
- **Industry standard:** On 404, clear historyId and fall back to full resync.
- **Fix complexity:** S

#### [CRITICAL] ES-3: Token refresh failure swallowed and poisons the account row
- **File:** `apps/api/src/routes/email.ts:1342-1370`; same pattern duplicated at `calendar.ts:833-864` and `booking.ts:47-78`
- **Issue:** No `response.ok` check. On `invalid_grant` (revoked refresh token), `tokens.access_token` is `undefined`; the update writes a fresh future `token_expires_at` while the undefined token is dropped — so the stale token is considered valid forever. Result: perpetual 401s with a misleading `sync_error`, no `needs_reauth` flag, nothing surfaced to the UI. Also no refresh mutex: concurrent cron + manual sync both refresh (`sync_status` written but never checked as a lock, `:856-863`).
- **Industry standard:** Detect `invalid_grant`, flag account `needs_reauth`, surface a "reconnect" banner.
- **Fix complexity:** M

#### [CRITICAL] ES-4: Bulk "delete" hard-deletes rows, bypassing soft delete — then resync resurrects them
- **File:** `apps/api/src/routes/email.ts:704-706`
- **Issue:** `case "delete"` does `.delete()` while Gmail-side deletes are soft-deleted (`:1710-1716`) — two inconsistent delete paths. The email still exists in Gmail, so the next full sync re-imports it (`:939-943` existence check misses, re-insert at `:982`) with triage fields reset. Migration 035's soft delete is bypassed entirely. No undo.
- **Industry standard:** Soft delete locally + `users.messages.trash` remotely; hard delete only via explicit "delete forever."
- **Fix complexity:** S

#### [MAJOR] ES-5: `is_deleted` (migration 035) is written but never read by ANY API query
- **File:** Sole API reference is the write at `email.ts:1713`. Unfiltered queries: `GET /messages` `:281-291` (also doesn't exclude `is_trashed`/`is_spam` — trash appears in default list), `GET /messages/:id` + thread `:299-313`, `GET /thread/:threadId` `:782-786`, `GET /search` `:813-838`, `/counts` `:1033-1065` (snoozed + trash counts include deleted), `/check-updates` `:1082-1088`, `/resync-bodies` `:491-496`. Web: `dashboard.inbox.$id.tsx:18-33` loads deleted emails and their siblings by URL. Only `dashboard.inbox._index.tsx:42` filters it.
- **Issue:** Deleted-in-Gmail messages resurface in thread view, search, counts, and the detail page.
- **Fix complexity:** S

#### [MAJOR] ES-6: Incremental sync ignores read/star/archive label changes and has no pagination
- **File:** `email.ts:1687` requests `labelAdded`/`labelRemoved` but handlers (`:1719-1738`) act only on `TRASH`; `:1686-1698` performs a single fetch with no `nextPageToken` loop while advancing `last_history_id` (`:1759-1761`)
- **Issue:** Read/star/archive done on phone never reflects locally; on a busy interval, history beyond page 1 is silently dropped and permanently skipped.
- **Fix complexity:** M

#### [MAJOR] ES-7: Cron full-sync caps at the newest 100 messages; legacy sync endpoint writes wrong data
- **File:** `fullSync` at `email.ts:1643-1676` (`maxResults=100`, no pagination, then `full_sync_completed=true` at `:877`; `last_history_id` derived from newest message instead of `users.getProfile`). Legacy `POST /accounts/:id/sync` (`:185-270`) uses `parseGmailMessage` (`:1372-1402`) which omits `folder`/`is_trashed`/`is_spam`/`is_archived` — every message lands as INBOX — and runs an inline Anthropic triage call per message. Folder-derivation logic is triplicated (`:954-959`, `:1782-1787`, absent in legacy parser).
- **Fix complexity:** M (paginate `fullSync`; delete the legacy endpoint)

#### [MAJOR] ES-8: Gmail label deletes orphan local labels and assignments; local labels can't reach Gmail
- **File:** `syncLabelsForAccount` (`email.ts:1525-1610`) only upserts — labels deleted in Gmail persist forever with stale `email_label_assignments`. `POST /labels` (`:611-622`) creates local labels with no `external_id` and never calls Gmail — they can't be applied Gmail-side and collide as `(account_id, NULL)` duplicates.
- **Fix complexity:** M

#### [MAJOR] ES-9: Snooze doesn't propagate to Gmail and unsnooze loses the original folder
- **File:** `email.ts:746-773`; `unsnooze_emails()` RPC (migration 020) called every minute (`scheduled.ts:74`, result unchecked)
- **Issue:** Storage is UTC timestamptz (fine), but no validation that `until` is future/parseable (invalid input → swallowed Postgres error, `{email:null}` 200). The RPC unconditionally restores `folder='INBOX'` — original folder isn't stored. Message stays visible in Gmail on other devices (consequence of ES-1). `counts.snoozed` (`:1045-1048`) counts trashed/deleted snoozed emails, and the snoozed view shows already-expired snoozes (`_index.tsx:60`).
- **Fix complexity:** M

#### [MAJOR] ES-10: Insert-after-check sync is racy and N+1; counts queries lack supporting indexes
- **File:** Per-message `SELECT ... .single()` existence checks inside loops (`email.ts:211-216, 939-943, 1652, 1742`) — should be a batched upsert on the existing `(account_id, external_id)` unique constraint; the check at `:939-943` omits `account_id` (multi-account label assignments could attach to the wrong row, `:968`). `assignEmailLabels` (`:1616-1635`) is 3 queries per message. `/counts` (`:1033-1065`) issues 6 sequential count queries; no index covers `is_read`/`is_starred`/`is_archived` (migration 020's `idx_emails_account_folder` covers only `(account_id, folder)`) — sequential scans on a 6,000+-row table.
- **Fix complexity:** M

#### [POLISH] ES-11: `/check-updates` cursor advances past unseen mail
- **File:** `email.ts:1094-1101` — the "newest" query has no folder filter, so a new SENT/SPAM message advances the client cursor past unseen INBOX mail.
- **Fix complexity:** S

#### [POLISH] ES-12: Bulk action `affected` counts always 0
- **File:** `email.ts:693-735` — supabase-js returns `count: null` unless `{ count: "exact" }` is passed; every bulk response reports `affected: 0`.
- **Fix complexity:** S

---

### 2. Email — Composition & Send (Grade: D-)

#### [CRITICAL] EC-1: Reply threading completely missing — every reply starts a new thread
- **File:** `apps/api/src/routes/email.ts:395-421` (`/drafts/:id/send`)
- **Issue:** MIME contains only To/Cc/Subject/Content-Type. No `In-Reply-To`, no `References`, no `threadId` in the send payload, no `Re:` prefix. The RFC `Message-ID` header isn't even captured during sync (`parseGmailMessageFull`, `:1769-1814`), so the data to thread doesn't exist. Recipients see broken threads; Sent never groups.
- **Industry standard:** Set `In-Reply-To`/`References` from the original Message-ID and pass `{ raw, threadId }`.
- **Fix complexity:** M

#### [CRITICAL] EC-2: ComposeModal "Send" doesn't send email
- **File:** `apps/web/app/components/inbox/ComposeModal.tsx:443-459` posts to `/dashboard/inbox/send`; `apps/web/app/routes/dashboard.inbox.send.tsx:27-43` contains `// TODO: Implement actual Gmail API send` and only inserts an `email_drafts` row with `status: 'sent'`
- **Issue:** The modal closes immediately with no error; the user believes the email was sent. It wasn't. (The full-page compose at `dashboard.inbox.compose.tsx:79-104` does send via the API worker — two divergent compose implementations, only one real.) `send.tsx` also ignores `reply_to_id` and the `schedule` action field.
- **Industry standard:** Send means send; failure means a visible error.
- **Fix complexity:** M

#### [CRITICAL] EC-3: Draft autosave POSTs to a nonexistent route — drafts silently never saved
- **File:** `ComposeModal.tsx:421-441` submits to `/dashboard/inbox/drafts` every 30 s; no `dashboard.inbox.drafts.tsx` exists and nothing is registered in `apps/web/app/routes.ts` (the project's known recurring 404 failure mode)
- **Issue:** Every autosave 404s; the fetcher error is never read. Close the tab, lose the draft.
- **Fix complexity:** S

#### [MAJOR] EC-4: Scheduled send is a phantom feature
- **File:** `email_drafts.scheduled_for` (migration 020) has zero code references in api or web; `scheduled.ts` never queries `email_drafts`
- **Issue:** Anything "scheduled" silently never sends.
- **Fix complexity:** M

#### [MAJOR] EC-5: Attachments unsupported end-to-end
- **File:** Sync stores only `has_attachments`/`attachment_count` (`email.ts:1811-1812`) — no filename/mimeType/attachmentId, no download endpoint, no send-with-attachment; `ComposeModal.tsx:650-652` paperclip button does nothing
- **Industry standard:** Minimum bar is attachment metadata + on-demand `attachments.get` proxy + upload on send.
- **Fix complexity:** L

#### [MAJOR] EC-6: Aliases synced but unusable; HTML/multipart never sent
- **File:** Alias subsystem exists (migration 012; `email.ts:127-180`) but send builds no `From:` header (`:395-404`) — always sends as primary. `body_html` column exists but send is hardcoded `text/plain` (`:399`).
- **Fix complexity:** S

#### [POLISH] EC-7: Draft autosave is blind last-write-wins; stuck `sending` drafts vanish
- **File:** `email.ts:358-369` (no conflict/version check; `last_auto_saved_at` never written); `:390` sets `status='sending'` before the Gmail call with no recovery — after a worker crash the draft disappears from the list (`:347` filters `status='draft'`) forever
- **Fix complexity:** S

#### [POLISH] EC-8: Header encoding and reply-composition defects
- **File:** `email.ts:396-398` — Subject/display names not RFC 2047 encoded (non-ASCII subjects emit raw UTF-8 in headers). `ComposeModal.tsx:408` — reply quote header uses today's date, not the original message date. `:402-405` — "reply-all" copies only `cc_emails`, dropping original To recipients. `:393-400` — forward drops HTML body and attachments.
- **Fix complexity:** S

#### [POLISH] EC-9: Sent mail doesn't appear until next sync; interaction logging only checks first recipient
- **File:** `email.ts:424-445` — sent message never inserted into `emails` immediately; relationship logging checks `to_emails[0]` only (`:433`)
- **Fix complexity:** S

---

### 3. Email — UX vs. Superhuman/Gmail (Grade: D)

#### [CRITICAL] EU-1: Unsanitized HTML email bodies injected into the app DOM — XSS
- **File:** `apps/web/app/components/inbox/EmailPreview.tsx:181`, `ThreadView.tsx:170`, `apps/web/app/routes/dashboard.inbox.$id.tsx:236` — all `dangerouslySetInnerHTML={{ __html: email.body_html }}` (the third wraps it in `forceEmailDarkMode`, which only concatenates a `<style>` block — `apps/web/app/lib/email-utils.ts:44`)
- **Issue:** **Explicitly verified: no sanitizer exists anywhere.** No DOMPurify/sanitize-html in `apps/web/package.json`; grep for sanitize/DOMPurify across `apps/web` returns zero hits; no iframe sandboxing. Any sender can deliver `<img onerror=...>`/`<svg onload>` that executes in the app origin, which holds the session and same-origin access to every dashboard route.
- **Industry standard:** Gmail/Superhuman sanitize server-side and render in a sandboxed iframe with strict CSP; minimum bar is DOMPurify with an allowlist.
- **Fix complexity:** M

#### [CRITICAL] EU-2: Thread view is unreachable — fetches a route that doesn't exist
- **File:** `dashboard.inbox._index.tsx:328` — `fetch('/api/email/thread/${id}')` is a relative URL on the web origin; `routes.ts` registers no `/api/*` route and the worker has no proxy. The real endpoint is on the API worker (`email.ts:778`).
- **Issue:** The fetch always 404s; the empty catch (`:336-338`) silently falls back to single-email preview. **ThreadView.tsx is dead code in production.**
- **Fix complexity:** S

#### [MAJOR] EU-3: Keyboard shortcuts hijack browser/system modifier combos
- **File:** `apps/web/app/hooks/useEmailKeyboardShortcuts.ts:50-130`
- **Issue:** No top-level `metaKey/ctrlKey/altKey` guard (only `f` checks, `:113`). With list focus: **Cmd+C opens compose** (`:94-97`), **Cmd+A opens reply-all** (`:106-109`), **Cmd+R blocks browser refresh and opens reply** (`:99-104`). The INPUT/TEXTAREA guard itself is correct (`:38-46`). Shortcuts also don't work on the standalone `$id`/compose routes (hook mounted only in `_index.tsx:483`), and Escape doesn't close the help modal or ComposeModal.
- **Industry standard:** `if (e.metaKey || e.ctrlKey || e.altKey) return;` — one line.
- **Fix complexity:** S

#### [MAJOR] EU-4: No optimistic UI — every action waits a full revalidation round-trip
- **File:** `dashboard.inbox._index.tsx:352-376`, `EmailList.tsx:52-67`, `EmailPreview.tsx:49-59`
- **Issue:** Archive/trash/star/read submit to `/dashboard/inbox/bulk` then wait for the index loader to re-run ~8 Supabase queries (`_index.tsx:73-179`, including a per-account label-seed loop). Rows don't move until the round-trip completes. Only the detail-route star is optimistic (`$id.tsx:81-84`). A single shared fetcher (`_index.tsx:234`) is reused for read/bulk/drag — concurrent submissions cancel each other.
- **Industry standard:** Superhuman's defining feature is <100 ms perceived action; Gmail removes the row instantly with an undo toast.
- **Fix complexity:** M

#### [MAJOR] EU-5: No undo anywhere — no undo send, no undo archive/trash toast
- **File:** `bulk.tsx:18-41` (immediate), `ComposeModal.tsx:443-459` / `compose.tsx:79-104` (send fires immediately); `z` unbound; no toast system
- **Industry standard:** Undo send (5–30 s window) and undo toast for destructive actions are table stakes.
- **Fix complexity:** M

#### [MAJOR] EU-6: Search has a PostgREST filter-injection bug, no operators in the UI path, and includes trash/spam
- **File:** `dashboard.inbox._index.tsx:46-48` — `query.or(\`subject.ilike.%${search}%,...\`)` interpolates raw input into a PostgREST `.or()` string: input containing `,` or `)` (e.g. `foo,is_starred.eq.true`) injects arbitrary filters. Folder exclusions are skipped while searching, so trashed/spam emails appear. Server-side, the API's live `/email/search` does parse `from:/to:/is:/has:` operators (`email.ts:802-833`) — but the web UI doesn't use it, `to:` ilikes a TEXT[] column (`:822`), `%`/`_` aren't escaped (the escaped version is the unreachable duplicate at `:1110`), and free-text ilike over `body_text` has no trigram/FTS index — sequential scans over 6,000+ rows.
- **Industry standard:** Parameterized filters, server-side operator parsing on an indexed tsvector/pg_trgm column, debounced as-you-type UI.
- **Fix complexity:** M

#### [MAJOR] EU-7: Per-account sidebar counts computed from the visible 100-row page — wrong in most folders
- **File:** `_index.tsx:190-202` — per-account inbox count filters the currently loaded (folder-filtered, 100-row-limited) page; viewing Trash makes each account's "inbox" badge show unread-trash counts; starred/snoozed/drafts/spam/trash per-account counts hardcoded 0 (`:196-200`), so `InboxSidebar.tsx:183-212` folder rows never show counts. Global counts (`:165-188`) are real but "snoozed" counts expired snoozes (`:175`) and updates only on revalidation/60 s poll.
- **Fix complexity:** M

#### [MAJOR] EU-8: "Create label" posts to a nonexistent route
- **File:** `InboxSidebar.tsx:254-268` — `fetcher.submit(..., { action: '/dashboard/inbox/labels' })`; route not registered, file doesn't exist → silent 404. Also uses native `prompt()`.
- **Fix complexity:** S

#### [MAJOR] EU-9: No remote-image blocking / tracking-pixel protection
- **File:** Same three render sites as EU-1; `email-utils.ts:29-32` styles images, confirming they load
- **Issue:** Tracking pixels fire on open, leaking open time/IP to senders.
- **Industry standard:** Gmail proxies all images; Superhuman blocks trackers and labels them.
- **Fix complexity:** M

#### [MAJOR] EU-10: Dark-mode email rendering inconsistent and lossy
- **File:** Preview/thread render raw HTML inside `prose prose-invert` with no color handling (`EmailPreview.tsx:179-181`, `ThreadView.tsx:168-170`) — black-text-on-transparent emails are unreadable on zinc-900. Where `forceEmailDarkMode` is used (`$id.tsx:236`), it nukes ALL colors (`email-utils.ts:11-15`: `* { color:#e4e4e7 !important; background-color:transparent !important }`), destroying branded emails and buttons.
- **Fix complexity:** M

#### [MAJOR] EU-11: Loading/empty/error states largely missing; quoted text never collapsed
- **File:** Empty state is bare "No emails" (`EmailList.tsx:148-151`); no navigation skeletons anywhere in `_index.tsx`; no thread-loading state (`:322-341`); ComposeModal has no error state; no search "no results" state. No `.gmail_quote`/blockquote trimming anywhere — replies show the full quoted pyramid; collapsed thread rows snippet `body_text?.slice(0,100)` including quoted text (`ThreadView.tsx:144-148`); "Quick reply" just opens the compose modal (`:207-214`) — no inline reply.
- **Fix complexity:** M

#### [POLISH] EU-12: j/k focus doesn't scroll the list; focus-advance off-by-one; shift-range-select wired but dead
- **File:** `EmailList.tsx:50` (`listRef` unused — no `scrollIntoView`); `_index.tsx:373` (off-by-one against post-removal length); `EmailList.tsx:179-184` passes `e.shiftKey` as `multi` but `toggleSelect` (`_index.tsx:343-350`) ignores it. Missing standard shortcuts: `z`, `[`/`]`, `Shift+U`, `g i`, `!`.
- **Fix complexity:** S–M

#### [POLISH] EU-13: Accessibility gaps across all inbox modals and rows
- **File:** No focus trap/`role="dialog"`/`aria-modal`/focus-restore in `ComposeModal.tsx:517+`, `KeyboardShortcutsHelp.tsx:50+`, snippet/template modals; email rows are clickable `<div>`s (`EmailList.tsx:160-176`); icon buttons rely on `title` only; native `confirm()`/`prompt()` for destructive flows.
- **Fix complexity:** M

#### [POLISH] EU-14: Window-focus auto-sync unthrottled; markAsRead fires for already-read emails
- **File:** `_index.tsx:303-314` (POST per focus, fans out per-account API syncs), `:323-324`
- **Fix complexity:** S

#### [POLISH] EU-15: Draft "Load" restores only to/subject, silently discarding the body
- **File:** `dashboard.inbox.compose.tsx:259-266`
- **Fix complexity:** S

---

### 4. Calendar — Sync & Data Correctness (Grade: D)

#### [CRITICAL] CS-1: Google deletions/cancellations never propagate — ghost events accumulate forever
- **File:** `apps/api/src/routes/calendar.ts:196-222` — upsert-only sync over a timeMin/timeMax window without `showDeleted=true` and without `syncToken`
- **Issue:** Events deleted or cancelled in Google just stop appearing in the response; local rows are never removed or marked cancelled. The UI and the AI time-block suggester (`:626-630`) treat ghosts as real.
- **Industry standard:** Incremental sync with `syncToken` + cancelled-status handling, or full-window reconcile that deletes absent rows.
- **Fix complexity:** M

#### [CRITICAL] CS-2: Sync silently caps at 250 events/calendar and loops sequential upserts
- **File:** `calendar.ts:197-204` (`maxResults=250`, `nextPageToken` ignored); `:209-218` (one awaited upsert per event, looped over up to 50 calendars — up to ~12,500 sequential subrequests vs Workers' 1,000 limit)
- **Issue:** Busy 67-day windows lose events silently; large accounts will blow the subrequest limit mid-sync.
- **Fix complexity:** S–M (paginate; batch `upsert(rows[])` per calendar)

#### [CRITICAL] CS-3: Calendar/booking token refresh has zero error handling (duplicate of ES-3 pattern)
- **File:** `calendar.ts:833-864`, `booking.ts:47-78`
- **Issue:** `invalid_grant` writes `undefined` over the previously valid token, `token_expires_at` becomes `Invalid Date` (→ refresh storm on every request), and `Bearer undefined` is sent to Google. No `needs_reauth`, no surfacing.
- **Fix complexity:** M (fix once, share the helper — see XC-4)

#### [CRITICAL] CS-4: All-day events silently dropped from the week grid, and stored with wrong end semantics
- **File:** `apps/web/app/routes/dashboard.calendar._index.tsx:116` (`if (e.all_day) return false;` — no all-day lane exists in the grid, `:1032-1084`); storage: `calendar.ts:879-881` stores Google's **exclusive** all-day `end.date` verbatim as midnight-UTC `TIMESTAMPTZ` — a 1-day event spans into the next day and shifts a day for any viewer west of UTC
- **Issue:** Birthdays, OOO, holidays — loaded by the loader then thrown away; stored data is wrong even if rendered.
- **Industry standard:** Dedicated sticky all-day lane; date-only storage or end-exclusive normalization.
- **Fix complexity:** M

#### [CRITICAL] CS-5: Week grid computed in UTC on the server — every column shifts a day for US users
- **File:** `_index.tsx:99-104,144-154,192` (loader computes Sunday-00:00 UTC on a UTC worker), `:1018-1021` (hardcoded `Sun…Sat` headers against UTC dates)
- **Issue:** For a US user, Saturday's date renders under "Sun" in every column, and the loader's event window (`:160-161`) clips local Sunday-morning/Saturday-night events. Also an SSR hydration mismatch (`formatTime`/`isToday` evaluate differently server vs client).
- **Fix complexity:** M (compute week range client-side or pass IANA tz to the loader)

#### [CRITICAL] CS-6: Event create/edit parses `datetime-local` on the UTC server — meetings stored hours off
- **File:** `_index.tsx:230-231` (`create_event` action), `dashboard.calendar.$id.tsx:64-65` (edit)
- **Issue:** `new Date("2026-06-11T09:00")` in a UTC worker = 09:00 UTC, not local. A Chicago user's 9 AM meeting becomes 4 AM. The drag-to-block path converts client-side and is correct (`:766-782`) — the two creation paths disagree.
- **Fix complexity:** S (convert to ISO client-side before submit)

#### [CRITICAL] CS-7: Overlapping events render fully stacked — earlier event invisible and unclickable
- **File:** `_index.tsx:754-764` (`left:2, right:2`, fixed zIndex), `:1065-1080` — no column-packing algorithm
- **Industry standard:** Google/Notion side-by-side lane partitioning.
- **Fix complexity:** M

#### [MAJOR] CS-8: No calendar sync cron — DB cache updates only on manual sync
- **File:** `apps/api/src/scheduled.ts` (email sync + reminders only); `wrangler.toml` cron `* * * * *` never touches `/calendar/accounts/:id/sync`
- **Issue:** Dashboard, unscheduled-tasks logic (`calendar.ts:482-501`), and AI suggestions all read a stale cache.
- **Fix complexity:** S

#### [MAJOR] CS-9: Account delete silently fails and orphans tokens; no Google token revocation
- **File:** `calendar.ts:120-128` — `bookings.calendar_account_id` FK (027, no CASCADE) makes the delete fail when bookings exist; the unchecked error is dropped and `{success:true}` returned with the account (and its tokens) still in the DB, after events were already deleted.
- **Fix complexity:** S

#### [MAJOR] CS-10: Color priority chain self-defeating; sidebar and event chips disagree
- **File:** `_index.tsx:726-736` — event chain is session override → **account → sub-cal DB** → default, but the sidebar color picker **persists to the sub-cal DB color** (`:922-926`), which sits below account color: the user's pick works until refresh, then silently reverts. Sidebar swatch (`:893`) uses sub-cal-before-account — the opposite order — so swatches and chips can disagree on the same calendar.
- **Issue:** The chain matches the stated design, but the design shadows the only thing the picker persists.
- **Fix complexity:** S (swap to sub-cal-first in the event chain)

#### [MAJOR] CS-11: Sub-calendar visibility session-only; `sub_account_id` never populated; colors clobbered on list
- **File:** `_index.tsx:712,745-752` (toggle is pure `useState`, filter client-side, never reads/writes `is_visible` despite the action supporting it at `:250-251`); migration 015's `calendar_events.sub_account_id` never written by sync (`calendar.ts:209-218`) so server-side filtering is impossible; `GET /accounts/:id/calendars` (`calendar.ts:785-795`) upserts `color: cal.backgroundColor` on every list, overwriting custom colors set via `PATCH /sub-accounts/:id`.
- **Fix complexity:** S each

#### [MAJOR] CS-12: Day view renders a broken 7-column week; multi-day/ongoing events mishandled
- **File:** `_index.tsx:147-154` vs `:1015-1084` (day view still renders 7 hardcoded `Sun…Sat` columns — Wednesday appears under "Sun" with 6 empty columns); `getEventsForDay` (`:112-122`) matches start date only (2-day events render once); loader filters `gte("start_at", start)` (`:160-161`) so still-ongoing events that started before the window never load.
- **Fix complexity:** M

#### [MAJOR] CS-13: Event detail/edit reliability — `display_name` never loaded, render-phase setState, errors swallowed
- **File:** `_index.tsx:163` (select omits `display_name`, yet `:870` renders it and the settings modal seeds from it — always blank); `dashboard.calendar.$id.tsx:126-129` (`setIsEditing` + `revalidate()` called during render, fires on ANY fetcher completion); `_index.tsx:407-415` (edit modal closes on any idle transition — failure looks like success); `:621` (detail modal renders empty body forever on fetch failure); no delete or RSVP for regular events (`:608-617`, `$id.tsx:437-448` — delete is time-block-only; attendee statuses read-only).
- **Fix complexity:** S–M

#### [POLISH] CS-14: No now-line, no scroll-to-now, grid hides 12–4 AM, no keyboard shortcuts, no drag-move/resize
- **File:** `_index.tsx:1032-1084` (no now indicator/scroll), `:15-18` (`START_HOUR=4`; `:127` clamps early events to the 4 AM line), no `t`/arrow-nav/`c` bindings, no event drag-move/resize (drag exists only for task→time-block, `:766-782`)
- **Industry standard:** Notion Calendar is keyboard-first with full drag interactions.
- **Fix complexity:** M–L

#### [POLISH] CS-15: Form validation gaps; "Generate Brief" can stick at "Generating…"
- **File:** `_index.tsx:322-333` (no end>start check — negative-duration events possible), `:221-222` (attendee emails unvalidated → straight to Google API), `:586-589` + `$id.tsx:410-415` (label reads `ai_prep_generated ? "Generating…"` — a prepped event with a missing knowledge link shows a permanently disabled "Generating…" button; no polling for results)
- **Fix complexity:** S

---

### 5. Calendar — Booking System vs. Cal.com (Grade: F)

#### [CRITICAL] BK-1: Zero availability check at confirmation — double-booking is trivial
- **File:** `apps/api/src/routes/booking.ts:386-429`; schema `supabase/migrations/027_calendar_booking.sql`
- **Issue:** **Explicitly verified.** The create handler validates only field presence (`:397`), then inserts `scheduled_at` verbatim. No re-fetch of busy times, no check that the time falls on an offered slot, no check against existing bookings, no transaction/lock, and **no unique constraint** on `(booking_link_id, scheduled_at)` in migration 027. Two concurrent guests booking the same slot both get `success: true`, two Meet links, four emails. A direct POST can book any arbitrary time — 3 AM, the past, a disabled day — because availability rules exist only in the slot-display endpoint (`:237-311`). Reschedule (`:539-569`) has the same hole.
- **Industry standard:** Cal.com re-validates against live busy times inside the booking handler and holds a uniqueness/idempotency guard per slot.
- **Fix complexity:** M (validate slot + busy in handler; partial unique index `(booking_link_id, scheduled_at) WHERE status != 'cancelled'`; handle 23505)

#### [CRITICAL] BK-2: Slot computation runs in the worker's timezone (UTC) — host timezone ignored
- **File:** `booking.ts:39-44` (`parseTime` parses `date + "T00:00:00"` in worker-local = UTC), `:254` (day-of-week via `toLocaleDateString` without `timeZone`), `:265-270` (busy window uses the same wrong UTC day bounds); `availability_rules.timezone` (`:21`) is never read during slot generation
- **Issue:** A 9–5 America/Chicago window is offered as 9–5 **UTC** (3–11 AM Chicago). Every booking lands hours off intent.
- **Industry standard:** All slot math in the host's availability timezone.
- **Fix complexity:** M

#### [CRITICAL] BK-3: Busy-time fetch failure ⇒ all slots offered as free (fails open)
- **File:** `booking.ts:268-281` — the `fetch` doesn't check `calRes.ok` (a 401 yields `items: undefined` → no busy times), and the catch is explicit: `// If we can't fetch calendar, still return slots (no conflicts)`
- **Issue:** Expired token = guests book over real meetings.
- **Industry standard:** Cal.com fails closed (errors the slot request).
- **Fix complexity:** S

#### [CRITICAL] BK-4: Guest input interpolated raw into email HTML — phishing relay from your domain
- **File:** `booking.ts:397-420` (unbounded `guest_name`/`guest_email`/`guest_notes`, no email-format or length validation) → `apps/api/src/lib/booking-emails.ts:58,70,103-112,144` (`<p>${data.notes}</p>` etc.) and the Google event description (`booking.ts:448`)
- **Issue:** Arbitrary HTML/links injected into emails sent from `bookings@sheetzlabs.com` to attacker-chosen addresses.
- **Industry standard:** Validated payloads (zod), escaped templating (React Email).
- **Fix complexity:** S

#### [CRITICAL] BK-5: No rate limiting on public booking endpoints — email-spam amplification
- **File:** `booking.ts:386` (also `/public/cancel`, `/public/reschedule`) — each anonymous POST sends 2 Resend emails (`:503,506`) and creates a Google event with `sendUpdates=all` (`:439`); no CAPTCHA, no per-IP limit, no idempotency key
- **Fix complexity:** M (Cloudflare rate-limit rule or Turnstile)

#### [CRITICAL] BK-6: Reminder cron is not idempotent and one bad row blocks all reminders
- **File:** `apps/api/src/scheduled.ts:144-212`; `apps/api/src/lib/send-booking-email.ts:21-24`
- **Issue:** **Explicitly verified.** Flow is send → send → `update({ reminder_24h_sent: true })`. `sendBookingEmail` never throws (returns `false`, ignored), so **Resend failures still mark the reminder sent** (silent loss); a worker eviction between send and update re-sends on the next 5-minute run (duplicate); the select-then-update is not an atomic claim, so overlapping invocations duplicate sends. If a booking's `calendar_accounts` join is null (account deleted), `:153` throws on `.email` of null and **aborts the loop, blocking all remaining reminders forever**. Migration 028 uses booleans instead of `*_sent_at` timestamps, precluding the claim pattern.
- **Industry standard:** Atomic conditional-update claim per reminder; flag only on confirmed send; per-row try/catch.
- **Fix complexity:** S

#### [CRITICAL] BK-7: `requires_confirmation` half-implemented — pending bookings get "Confirmed" emails and a calendar event, and can never be approved
- **File:** `booking.ts:424` sets `status: "pending"`, but `:431-479` creates the Google event with invites and `:502-506` sends "Booking Confirmed" unconditionally; no approve/decline endpoint exists anywhere; pending bookings are excluded from reminders (`scheduled.ts:148`)
- **Fix complexity:** M (gate event+emails on status, add approval endpoint) or S (drop the flag)

#### [CRITICAL] BK-8: Booking failure is completely silent on the public page
- **File:** `apps/web/app/routes/book.$slug.tsx:106-108` — only `success === true` is handled; on error the button reverts from "Confirming…" with no message. Same in `book.reschedule.$bookingId.tsx:109`.
- **Issue:** The guest cannot tell whether they're booked — fatal for an outward-facing flow.
- **Industry standard:** Cal.com surfaces "slot no longer available" and re-fetches slots.
- **Fix complexity:** S

#### [CRITICAL] BK-9: Cancel/reschedule leave partial state — Google swallowed, emails fire regardless
- **File:** `booking.ts:175-192` (host cancel), `:342-359` (guest cancel), `:558-592` (reschedule) — order is DB update (error unchecked) → gcal delete/patch in empty catch → emails (failures swallowed)
- **Issue:** On token failure the host's calendar still shows the meeting while both parties got cancellation emails. No retry, no log.
- **Fix complexity:** M

#### [MAJOR] BK-10: Slots check only the `primary` calendar; local/pending bookings never consulted
- **File:** `booking.ts:268-271` — sub-calendar events don't block slots; bookings whose Google event creation failed (BK-12) exist only in the DB and are invisible to availability.
- **Industry standard:** Cal.com aggregates busy across all selected calendars + its own bookings table.
- **Fix complexity:** M

#### [MAJOR] BK-11: Busy filter ignores transparency/declined/all-day semantics
- **File:** `booking.ts:275-278` — `transparency: "transparent"` events, declined invites, and all-day birthdays all block; all-day `start.date` parses to midnight UTC and blocks the whole UTC day.
- **Fix complexity:** S

#### [MAJOR] BK-12: Meet/event creation failure is silent and unrecoverable
- **File:** `booking.ts:462-479` — `gcalRes.ok` false isn't even caught; `calendar_event_id`/`meet_link` stay null while the guest's email promises "A calendar invitation has been sent" (`booking-emails.ts:72`). Nothing flags the booking for repair.
- **Fix complexity:** S (log + `calendar_sync_failed` marker; fallback location text)

#### [MAJOR] BK-13: Availability rules half-implemented — `buffer_before_minutes` and `date_range_days` never enforced server-side; no daily cap; nonstandard slot stride
- **File:** `booking.ts:31-34` (defined), `:286-308` (only `buffer_after_minutes` + `minimum_notice_hours` used; stride = duration + bufferAfter → stair-stepping :00/:45/:30 slots; no max-days-out — year-2099 slots bookable via API)
- **Industry standard:** Cal.com: both buffers, min-notice, rolling window, daily caps, fixed slot increments.
- **Fix complexity:** S each

#### [MAJOR] BK-14: Booking links cannot be edited; availability rules hardcoded with no UI
- **File:** `apps/web/app/routes/dashboard.calendar.booking-links.tsx:8-23` — every link gets `DEFAULT_AVAILABILITY` (`timezone: "America/Chicago"`, M–F 9–5); no edit form, no availability editor — changing duration requires delete + recreate. The toggle-active button renders a **Pencil icon** (`:254-262`) — users clicking "edit" silently deactivate their public link, with the response ignored.
- **Industry standard:** The availability editor is the core of Cal.com.
- **Fix complexity:** L (editor) + S (icon)

#### [MAJOR] BK-15: Guest timezone detected but never shown or selectable; no .ics/add-to-calendar/manage links on confirmation
- **File:** `book.$slug.tsx:118` (Intl tz sent on submit only; slots render via `toLocaleTimeString` — correct but unlabeled, no tz dropdown); `:126-152` (success card has no .ics, no Google/Outlook links, and never surfaces the cancel/reschedule URLs even though `bookFetcher.data.booking` (`:73`) contains the id)
- **Industry standard:** Cal.com shows the detected timezone prominently with a selector, plus calendar-add and manage links.
- **Fix complexity:** M

#### [MAJOR] BK-16: Reschedule page has no cancelled/past guard; no ErrorBoundary on any public route
- **File:** `book.reschedule.$bookingId.tsx:29-38` (status typed but never checked — cancelled/past bookings reschedulable); zero `ErrorBoundary` exports across `apps/web/app/routes` and `root.tsx` — invalid slug/booking-id throws `Response(404)` into React Router's unstyled default error screen, shown to external guests
- **Fix complexity:** S

#### [MAJOR] BK-17: Public endpoints over-expose data
- **File:** `booking.ts:221-234` (`/public/:slug` returns internal `calendar_account_id`), `:314-326` (booking detail exposes `guest_name`/`guest_email` to any UUID holder — acceptable alone, but XC-1's unauthenticated `GET /booking/bookings` leaks all UUIDs), `:522-536` (reschedule loader additionally exposes `guest_notes` + full `availability_rules`); `scheduled_at` is never format-validated (`new Date(garbage)` → `Invalid Date` propagates into NaN math at `:436` and "Invalid Date" emails)
- **Fix complexity:** S

#### [POLISH] BK-18: Public page polish vs Cal.com
- **File:** `book.$slug.tsx:86-93` — flat date strip (no month grid); `toISOString().split("T")[0]` keys dates in UTC (evening US guests see off-by-one days); `minimum_notice_hours` not applied client-side (today shows, then "No available times"). `book.reschedule.$bookingId.tsx:81-85` ignores per-day `enabled` rules (offers disabled weekends, then empty). Hardcoded `"en-US"` locale on all public pages. No host name/avatar/logo (API returns `display_name` — unused). Guest form bypasses native validation (`:288-316` button onClick, `a@b` books fine — though real validation belongs server-side, see BK-4). `dashboard.calendar.bookings.tsx`: dates without year, raw IANA tz string, unbounded loader, no host-side reschedule.
- **Fix complexity:** S–M

---

## Recommended Remediation Order

The work clusters naturally into four implementation prompts. Security first — the modules should not face the internet in their current state.

### Prompt 51 — Security hardening (do first, ~all S/M fixes)
1. **XC-1**: Auth middleware on the API worker (all non-`/book`/`/booking/public` routes); restrict CORS; allowlist updatable columns on every PATCH; remove `GET /email/test-labels`; stop the cron from calling its own public endpoint.
2. **EU-1**: Sanitize email HTML (DOMPurify via a shared `renderEmailHtml` util, ideally inside a sandboxed iframe) — single highest-risk client fix.
3. **BK-1/BK-2/BK-3**: Re-validate slot + live busy times inside the booking and reschedule handlers, in the host's timezone; add partial unique index on `(booking_link_id, scheduled_at) WHERE status != 'cancelled'`; fail closed on busy-fetch errors.
4. **BK-4/BK-5**: Escape all email-template interpolation + validate guest input; rate-limit public booking endpoints (Cloudflare rule or Turnstile).
5. **XC-2**: Add OAuth `state` to both flows.

### Prompt 52 — Sync & data correctness (email + calendar backends)
1. **ES-3/CS-3**: One shared `getValidAccessToken` with `invalid_grant` detection, `needs_reauth` flag, and a reconnect banner in both UIs.
2. **ES-2**: historyId-404 → full-resync fallback; **ES-6**: history pagination + apply UNREAD/STARRED/INBOX label deltas; **ES-7**: paginate `fullSync`, derive historyId from `getProfile`, delete the legacy sync endpoint/parser.
3. **ES-1**: Gmail write-back for read/star/archive/trash/labels/snooze (`messages.modify`/`batchModify`) — largest single item, unlocks trust in every UI action.
4. **ES-4/ES-5**: Route bulk-delete through soft delete + Gmail trash; add `is_deleted` (and trash/spam) filters to every email query listed in ES-5.
5. **CS-1/CS-2/CS-8**: Calendar sync — pagination, batched upserts, deletion/cancellation reconciliation, sync cron, populate `sub_account_id`.
6. **CS-4 (storage half)/BK-6/BK-9/BK-12**: All-day end-date normalization; atomic reminder claims flagged only on send success with per-row try/catch; ordered cancel/reschedule with logged gcal failures; flag Meet-creation failures.
7. **ES-8/ES-9/ES-10**: Label deletion sync, snooze folder restore + Gmail propagation, batched upsert sync + counts indexes.

### Prompt 53 — Broken flows & timezone correctness (web)
1. **EC-2/EC-3/EU-8**: Make ComposeModal send real (route through the API send path), add the missing `/dashboard/inbox/drafts` and `/labels` routes (or repoint to the API), unify the two compose implementations.
2. **EC-1**: Reply threading — capture Message-ID at sync, set In-Reply-To/References/threadId/`Re:` on send.
3. **EU-2**: Point thread view at the API worker URL — un-deadens ThreadView.
4. **CS-5/CS-6/CS-7/CS-4 (render half)/CS-12**: Calendar timezone fixes (client-computed week range, client-side ISO conversion for create/edit), overlap lane-packing, all-day lane, real day view, multi-day spanning.
5. **BK-8/BK-16/BK-7**: Surface booking failures on public pages, ErrorBoundaries, reschedule guards; finish or remove `requires_confirmation`.
6. **CS-10/CS-11/CS-13**: Color chain fix (sub-cal before account), persist visibility toggles, stop clobbering custom colors, load `display_name`, fix the render-phase setState.
7. **EU-6**: Parameterize the search filter (injection fix) and route search through the API operators path; delete the duplicate `/search`; add a pg_trgm/tsvector index.

### Prompt 54 — Industry-standard UX (Superhuman/Cal.com parity)
1. **EU-4/EU-5**: Optimistic UI on archive/trash/star/read + undo toast; undo send window.
2. **EU-3/EU-12**: Modifier-key guard, scroll-on-j/k, range select, missing shortcuts (`z`, `[`/`]`, `Shift+U`); mount shortcuts on detail routes.
3. **EU-7/EU-11**: Real per-account counts (DB-backed), loading/empty/error states everywhere, quoted-text collapsing, inline reply.
4. **EU-9/EU-10**: Remote-image proxy/blocking; proper dark-mode email rendering (`color-scheme`, preserve branding).
5. **EC-4/EC-5/EC-6**: Scheduled send cron, attachments (metadata + download proxy + upload), alias From support, HTML multipart send.
6. **BK-13/BK-14/BK-15/BK-18**: Availability editor UI + buffer/notice/range/daily-cap enforcement, fixed slot increments, timezone display + selector on /book, .ics + add-to-calendar + manage links, month-grid date picker, branding.
7. **CS-14/CS-15, EU-13, XC-4/XC-5/XC-6**: Now-line + scroll-to-now + keyboard nav + drag-move/resize, form validation, a11y pass, shared types adoption, env-based URLs, dead-code removal.

---

## Completion Checklist

- [x] All email routes/components/migrations read (email.ts fully; all 12 inbox routes; all 6 inbox components; migrations 011, 011b, 012, 020–025, 035)
- [x] All calendar routes/components/migrations read (calendar.ts, booking.ts, scheduled.ts, booking-emails.ts, send-booking-email.ts; all 5 dashboard.calendar routes + 3 public /book routes; migrations 013–015, 027–029)
- [x] Every silent failure instance listed (XC-3 — ~100 sites across api and web)
- [x] HTML email sanitization explicitly verified — **MISSING**: no sanitizer dependency, no sanitize call, raw `dangerouslySetInnerHTML` at 3 render sites (EU-1)
- [x] Booking race condition explicitly verified — **PRESENT**: no availability re-check at confirmation, no unique constraint, no transaction (BK-1)
- [x] Audit report written to docs/audits/email-calendar-audit.md
- [x] NO code changes made
