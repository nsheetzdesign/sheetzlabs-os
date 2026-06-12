# Email + Calendar Re-Audit (Post-Remediation) — 2026-06-12

Closing read-only audit of the inbox and calendar/booking modules after the Prompt 50 audit and the 51–55 (+54A/54B) remediation arc. Two jobs: **(1)** verify every original finding is genuinely resolved in the code as deployed, and **(2)** audit the new surface the remediation itself introduced. Same severity rubric as Prompt 50. No code was changed. All file:line references verified against current `main` (`0bc3b07`).

Severity definitions — **Critical**: data loss, broken core flow, or security exposure reachable by an unauthenticated/cross-tenant actor. **Major**: degrades daily use, or a security/reliability gap whose exploitation is throttled only by the single-tenant allowlist or an unguessable token. **Polish**: defense-in-depth, cosmetic, or correctness gap with negligible blast radius.

---

## Executive Summary

The remediation is real and holds up under fresh-eyes verification: **all 75 original findings are dispositioned RESOLVED** except one deferred-by-design (EC-6 alias From-header) and three cosmetic partials (EU-13 help-modal a11y, CS-15 `$id`-page label, BK-18 reschedule date strip) — the D/D-/D/D/F/F scorecard is retired. The new surface introduced by the fixes carries **zero Criticals** but a cluster of Majors that are real and worth tracking: the image proxy's SSRF guard is string-pattern-only (redirect-follow, alternate IP encodings, and IPv4-mapped IPv6 all bypass it), the public `.ics` generator doesn't escape a bare CR, the slot engine has a daily-cap read-then-insert race and emits duplicate slots on overlapping windows, the calendar drag/edit PATCH silently desyncs the local DB when the Google call fails, and the `oauth_states` consume is a non-atomic read-then-delete. Every one of these is de-fanged in the current deployment by the single-tenant `ALLOWED_USER_EMAILS` gate (authenticated surfaces) or by unguessable v4-UUID bearer credentials (the public booking surface), so none rises to Critical — but they are the exact things that become Critical the moment a second tenant or a high-volume public link is added. **Ship verdict — daily-driver use: SHIP** (all original Criticals closed, residual issues are operational/defense-in-depth). **Ship verdict — public booking-link exposure: SHIP WITH CAVEATS** (the public booking/ics/cancel/reschedule routes rely on UUID-as-bearer with no management token, the rate-limiter fails open if its binding is absent, and the `.ics` has a CR-injection hole — acceptable for low-volume founder use, revisit before scaling public exposure).

---

## New Scorecard

Grades reflect the **current** state of each area — original findings resolved **and** new-surface issues factored in. Counts are of **new** findings introduced/uncovered by the remediation (the original findings are tabulated separately below).

| Area | Prev | Now | Critical | Major | Polish |
|------|------|-----|----------|-------|--------|
| Email sync (incl. crons/undo/oauth/e2e infra) | D | **A-** | 0 | 4 | 4 |
| Email compose/send | D- | **A** | 0 | 0 | 0 |
| Email UX (incl. image proxy, a11y) | D | **B+** | 0 | 4 | 3 |
| Calendar sync | D | **A-** | 0 | 1 | 2 |
| Booking system (public-facing) | F | **B** | 0 | 5 | 4 |
| Cross-cutting (auth/CORS/secrets) | F | **A-** | 0 | 1 | 4 |
| **Totals** | | | **0** | **15** | **17** |

Headline: **no new Critical findings.** The single-tenant authenticated gate and unguessable-UUID design are what hold the Majors below Critical; they are the load-bearing assumptions in the residual-risk register.

---

## Job 1 — Original-Findings Verification

Verdict legend: **R** = Resolved · **P** = Partially Resolved · **N** = Not Resolved · **D** = Deferred-by-Design (accepted ledger). Evidence is current file:line.

### Cross-Cutting

| Finding | Verdict | Evidence |
|---------|---------|----------|
| XC-1 API unauthenticated/open-CORS/service-role | **R** | Global `authMiddleware` (`apps/api/src/index.ts:74`) verifies Supabase JWT + email allowlist (`middleware/auth.ts:83-97`); narrow public allowlist (`auth.ts:37-48`). CORS locked to configured origins (`index.ts:52-70`). PATCH column allowlists (`calendar.ts:142-145`, `booking.ts:311-318`) — tokens unreachable. `GET /email/test-labels` deleted. Cron calls `runEmailSync` in-process (`scheduled.ts:107`). |
| XC-2 OAuth no `state` (CSRF) | **R** | `lib/oauth-state.ts` user-bound single-use nonce; gmail (`email.ts:51,74-77`) + calendar (`calendar.ts:50,74-76`) generate + consume; start routes authenticated; callback rejects invalid state 403. |
| XC-3 Silent-failure epidemic (~100 sites) | **R** | Systemic, not piecemeal: `{ok,error}` returns, per-row try/catch + atomic claims in cron (`scheduled.ts:319-414`), checked Google booleans → `calendar_sync_failed`, web bulk routes through API returning real status. Spot-checked 8 sites. |
| XC-4 Shared types unused | **R**(+D residual) | `packages/shared/types` exports `Email`/`Booking`/`BookingLink`/`CalendarEvent`/`AvailabilityRules`; adopted in web components + `booking.ts:12`/`slots.ts:15-19`; `getValidAccessToken` unified. Loose `any` on internal Supabase clients = accepted typing posture. |
| XC-5 Hardcoded prod URLs | **R** | Client files use same-origin `/api`; server loaders use `env.X ?? fallback`. Residual: one static UI label `sheetzlabs.com/book/` (`booking-links.tsx:141`) — display-only, copied link correct. |
| XC-6 Dead code/schema | **R** | Duplicate `/email/search` removed (escaping ported to live handler); legacy `parseGmailMessage` deleted; `/api/*` proxy registered. Minor dead-schema columns not exhaustively swept (Polish). |

### Email Sync

| Finding | Verdict | Evidence |
|---------|---------|----------|
| ES-1 No Gmail write-back (one-way sync) | **R** | `gmailModify`/`gmailTrash`/`gmailBatchModify` (`email.ts:2179-2225`); `applyBulk` writes Gmail-first per account (`:1093-1134`); read/star/archive/spam/trash/snooze all propagate. |
| ES-2 Expired historyId 404 sticks forever | **R** | `syncViaHistory` 404 → clears `last_history_id`/`full_sync_completed`, runs `fullSync`, re-anchors via `getProfile` (`email.ts:2666-2677`). |
| ES-3 Token refresh poisons account row | **R** | `lib/google-auth.ts:122-145` checks `response.ok`, detects `invalid_grant`→`needs_reauth`+throws, never writes undefined token, `refreshing_until` mutex; reconnect banner in both UIs. |
| ES-4 Bulk hard-delete bypasses soft delete | **R** | `delete` folded into `trash` (`email.ts:1008`) = Gmail trash + soft `is_trashed/is_deleted`. |
| ES-5 `is_deleted` never read | **R** | Central `baseEmailQuery` always `.eq("is_deleted",false)` (`email.ts:2113-2118`); every listed read path (messages, thread, search, resync, counts, check-updates) verified using it; search also gates trash/spam. |
| ES-6 Incremental sync ignores label deltas / no pagination | **R** | `syncViaHistory` paginates all pages before advancing cursor (`email.ts:2654-2702`); applies UNREAD/STARRED/INBOX/TRASH/SPAM deltas via `applyLabelStateToEmail`. |
| ES-7 fullSync 100-cap; legacy parser writes wrong data | **R** | `fullSync` paginates (`MAX_MESSAGES_PER_RUN=400`, `sync_page_token`), anchors historyId from `getProfile`. Legacy endpoint restored (P55) but delegates to `syncOneAccount`/`parseGmailMessageFull`; buggy parser deleted. |
| ES-8 Label deletes orphan; local labels can't reach Gmail | **R** | `syncLabelsForAccount` reconciles deletions (`email.ts:2550-2564`); `POST /labels` creates Gmail label first, stores `external_id` (`:881-903`). |
| ES-9 Snooze no Gmail propagation; loses folder | **R** | Validates `until` future→422 (`email.ts:1436-1439`); removes INBOX in Gmail; stores+restores `snooze_return_folder`; cron unsnooze writes back. |
| ES-10 Racy N+1 sync; missing count indexes | **R** | Batched `upsert(onConflict:"account_id,external_id")` (`email.ts:2291-2296`); migration 040 composite/partial indexes + `get_email_counts()` RPC. |
| ES-11 check-updates cursor skips unseen mail | **R** | Newest query folder-scoped to INBOX (`email.ts:1877-1887`). |
| ES-12 Bulk `affected` always 0 | **R** | Field replaced by real `succeeded` count + `failed[]` (`email.ts:1134`). |

### Email Compose/Send

| Finding | Verdict | Evidence |
|---------|---------|----------|
| EC-1 Reply threading missing | **R** | `rfc_message_id`/`rfc_references` captured at sync (`email.ts:2802-2803`, migration 044); In-Reply-To/References/`Re:`/`{raw,threadId}` on send (`:467-583`); `fetchRfcHeaders` backfill. |
| EC-2 ComposeModal Send didn't send | **R** | `dashboard.inbox.send.tsx` routes through API real send; no fake `status:'sent'`; full-page compose deleted. |
| EC-3 Draft autosave 404 | **R** | `dashboard.inbox.drafts.tsx` exists + registered (`routes.ts:97`). |
| EC-4 Scheduled send phantom | **R** | Migration 049 `send_at`; `processScheduledSends` atomic claim (`email.ts:738-746`) every minute. |
| EC-5 Attachments unsupported | **R** | Migration 050; multipart/mixed send (`email.ts:546-570`); send-attachments route; attachment download/cid proxy. |
| EC-6 Aliases unusable; HTML never sent | **P / D** | HTML multipart/alternative now sent (`email.ts:526-539`) = resolved. Alias From-header still primary (`:511`) = **accepted deferral** (alias From ledger). |
| EC-7 Blind autosave; stuck `sending` drafts | **R** | `last_auto_saved_at` written; failed send recovers draft to editable (`email.ts:460-461,588`). |
| EC-8 Header encoding / reply defects | **R** | RFC 2047 `encodeHeaderWord`/`encodeAddressList` (`email.ts:369-377,512-514`); forward carries body. |
| EC-9 Sent mail delayed; first-recipient logging | **R** | Sent row inserted immediately as SENT (`email.ts:600-621`). Logging still keys `to_emails[0]` — minor analytics detail, not a flagged deferral. |

### Email UX

| Finding | Verdict | Evidence |
|---------|---------|----------|
| EU-1 Unsanitized email HTML (XSS) | **R** | **Zero** `dangerouslySetInnerHTML` on email content. Three render sites use `EmailHtmlFrame` (DOMPurify `FORBID_TAGS script/iframe/object/embed/form` + sandboxed iframe **without** `allow-scripts`, `EmailHtmlFrame.tsx:156-159,222`). Only remaining `dangerouslySetInnerHTML` is internal markdown (`dashboard.knowledge.$slug.tsx:305`) — out of scope. |
| EU-2 Thread view unreachable | **R** | `/api/*` proxy (`api.$.tsx`) registered (`routes.ts:7`); thread fetch uses it (`_index.tsx:392`). |
| EU-3 Shortcuts hijack modifier combos | **R** | `if(e.metaKey||e.ctrlKey||e.altKey) return` (`useEmailKeyboardShortcuts.ts:65`). |
| EU-4 No optimistic UI | **R** | Optimistic-removed id set w/ prune-on-confirm + failure reconcile (`_index.tsx:274-304`); separate fetchers. |
| EU-5 No undo | **R** | Toast system + `dashboard.inbox.undo.tsx` (`routes.ts:99`); `z` binding; undo-send via scheduled draft + cancel-send window. |
| EU-6 Search injection / no operators / trash included | **R** | Routes through API `/email/search`; escapes `%_\` + double-quote-wraps `.or()` (`email.ts:1551,1579-1583`); `to:` array containment; trash/spam excluded; migration 045 FTS/trgm. |
| EU-7 Per-account counts from visible page | **R** | `get_email_counts_by_account()` RPC (migration 051) in loader (`_index.tsx:156`). |
| EU-8 Create-label 404 | **R** | `dashboard.inbox.labels.tsx` exists + registered (`routes.ts:98`). |
| EU-9 No remote-image blocking | **R** | `GET /email/image-proxy`; frame rewrites img/srcset/CSS-url through proxy w/ `no-referrer`. (New SSRF gaps in Job 2.) |
| EU-10 Dark-mode rendering lossy | **R** | `EmailHtmlFrame` light-document model, non-`!important` so branding survives. |
| EU-11 Missing states; quoted text not collapsed | **R** | Quoted-reply collapse toggle; skeletons; error toasts; inline quick-reply. |
| EU-12 j/k no scroll; range-select dead | **R** | `scrollIntoView` on focus; shift-range via `anchorIndex`. |
| EU-13 A11y gaps | **P** | ComposeModal `role=dialog`+`aria-modal`+Esc; email rows `role=button`+aria-label. Residual: `KeyboardShortcutsHelp.tsx` lacks `role=dialog`/`aria-modal`/focus-trap (Polish). |
| EU-14 Unthrottled focus-sync; markAsRead on read | **R** | Throttled 2-min (`_index.tsx:361`); skip already-read (`:388`). |
| EU-15 Draft Load discards body | **R** | Buggy full-page compose deleted; drafts persist/restore `body_text`. |

### Calendar Sync

| Finding | Verdict | Evidence |
|---------|---------|----------|
| CS-1 Google deletions never propagate | **R** | `calendar-sync.ts` `showDeleted=true` (`:129`); cancelled hard-deleted (`:188-198`); window-reconcile w/ `calComplete` guard (`:200-221`). |
| CS-2 250-cap + sequential upserts | **R** | `nextPageToken` loop; batched 100-row upserts (`:174-186`); `SUBREQUEST_BUDGET=300` + `sync_cursor` resume. |
| CS-3 Token refresh no error handling | **R** | Shared `getValidAccessToken` (`google-auth.ts`); `calendar.ts:998-1005` delegates; banner + cron skip `needs_reauth`. |
| CS-4 All-day dropped / wrong end semantics | **R** | `all_day_end_date` inclusive normalization (`calendar-sync.ts:342-343`, migration 041); sticky all-day lane (`_index.tsx:1556-1589`). |
| CS-5 Week grid in UTC | **R** | `lib/tz.ts` Intl math + `tz` cookie; loader `getWeekBounds`/`getDayBounds` (`_index.tsx:203-229`). |
| CS-6 datetime-local parsed on UTC server | **R** | `localInputToUtcIso` client-side in all create/edit/drag paths. |
| CS-7 Overlapping events stacked | **R** | `packDayColumns` lane-partitioning (`_index.tsx:148-182`). |
| CS-8 No calendar sync cron | **R** | `syncAllCalendars` every 15 min (`scheduled.ts:125-127`), per-account try/catch. |
| CS-9 Account delete silently fails | **R** | Migration 043 FK `SET NULL`; delete 404s/409s/revokes token/checks errors (`calendar.ts:161-217`). |
| CS-10 Color chain self-defeating | **R** | `resolveCalendarColor` = override→sub-cal→account→default (`_index.tsx:114-123`); chips + swatch agree. |
| CS-11 Visibility session-only; colors clobbered | **R** | `is_visible` persisted + server-filtered; `sub_account_id` populated by sync; `color_is_custom` protects (migration 046). |
| CS-12 Broken 7-col day view; multi-day mishandled | **R** | Single-column day view; overlap-based loader window; `timedEventInDay` clamps multi-day. |
| CS-13 display_name missing; render-phase setState | **R** | Loader selects `display_name`; edit modals gate on success in `useEffect` (`$id.tsx:130-141`). |
| CS-14 No now-line/keyboard/drag | **R** | 24h grid, now-line, scroll-to-now, `t/←/→/d/w/c`, drag-move+resize Google-first (`_index.tsx:1055-1151`). |
| CS-15 Form validation; stuck "Generating…" | **P** | `end>start` client+server; index-modal Generate Brief has idle→generating→ready/failed + polling. Residual: `$id.tsx:442` standalone page keeps simple label (Polish). |

### Booking System

| Finding | Verdict | Evidence |
|---------|---------|----------|
| BK-1 Double-booking / no availability check | **R** | `validateBookingRequest` in create (`booking.ts:622`) **and** reschedule (`:881`); partial unique index (migration 036); 23505→409 (`:653-656`,`:905-908`). |
| BK-2 Slot math in UTC | **R** | `lib/slots.ts` host-IANA via Intl/`zonedTimeToUtc`. |
| BK-3 Busy-fetch fails open | **R** | `fetchBusyForDate` `{ok:false}` on error → 503; create+reschedule abort (`booking.ts:617,877`). |
| BK-4 Guest input raw into email HTML | **R** | Zod limits + `escapeHtml` (`lib/escape.ts`) on all guest values in templates + Google event. |
| BK-5 No rate limiting | **R** | Per-IP middleware `/public/*` (`booking.ts:426-440`), bindings in `wrangler.toml`. (Fails open if binding absent — residual register.) |
| BK-6 Reminder cron not idempotent | **R** | Migration 042 `*_sent_at` timestamps; atomic claim (`scheduled.ts:355-365`); per-row try/catch; flag on confirmed send. |
| BK-7 `requires_confirmation` half-implemented | **R** | Column dropped (migration 047); always `status:"confirmed"`; no pending path remains. |
| BK-8 Booking failure silent on public page | **R** | `book.$slug.tsx:147-167` surfaces 409/422/503, re-fetches slots on 409. |
| BK-9 Cancel/reschedule partial state | **R** | DB-first→checked Google (`calendar_sync_failed`)→emails, all three paths. |
| BK-10 Slots check only primary cal | **R** | `fetchBusyForDate` freeBusy across visible sub-cals + union local bookings (`booking.ts:136-181`). |
| BK-11 Busy ignores transparency/declined/all-day | **R** | Switched to Google `freeBusy` API which excludes them by design. |
| BK-12 Meet creation failure silent | **R** | `gcalRes.ok` checked → `calendar_sync_failed`; email copy gated on `calendarInviteSent`. |
| BK-13 Availability rules half-implemented | **R** | `slots.ts` enforces both buffers, fixed increment, rolling window, daily cap, min-notice. |
| BK-14 Links uneditable; Pencil deactivates | **R** | `EditModal`+`AvailabilityEditor`; Pencil opens modal; active-toggle is a separate switch. |
| BK-15 No tz selector / .ics / manage links | **R** | `TzSelector`; Google/Outlook/.ics + manage links; `/public/:id/ics` + `lib/ics.ts`; .ics attached to email. |
| BK-16 No reschedule guard / ErrorBoundary | **R** | Cancelled+past guard (`book.reschedule:133-151`); `BookingErrorBoundary` on all three public routes. |
| BK-17 Public endpoints over-expose | **R** | `/public/:slug` strips account to `host_name`; reschedule loader trims rules; no guest_notes/email/token leaked; `scheduled_at` zod+NaN validated. (IDOR nuance in Job 2.) |
| BK-18 Public page polish | **P** | `MonthGrid` + guest-tz date keys + client notice/window + host avatar on main page. Residual: reschedule page still flat strip not filtering per-day `enabled` (server authoritative — cosmetic). |

**Job 1 tally:** 75 findings → **69 Resolved**, **5 Partially Resolved** (EC-6, EU-13, CS-15, BK-18 — all Polish-level residuals; EC-6's residual is itself the accepted alias deferral), **0 Not Resolved**, **0 unjustified deferrals**. No fix re-opened a closed hole; the 54B-introduced SSR TDZ crash is confirmed fixed (`dayBoundaries` `useMemo` at `_index.tsx:984-987` precedes all dependents).

---

## Job 2 — New-Surface Findings

Code that didn't exist at the original audit, examined as a fresh attacker/reliability target. **All trust-model context is load-bearing on severity** — see the residual-risk register for trigger conditions.

### Image Proxy (`GET /email/image-proxy`)

#### [MAJOR] NS-IMG-1: Redirect-follow SSRF — hops not re-validated
- **File:** `apps/api/src/routes/email.ts:1285` (`redirect:"follow"`), guard runs once on the original URL (`:1275`)
- **Issue:** The `isPrivateHost` guard validates only the initial URL; Cloudflare then follows `Location` hops internally with no re-check. An attacker-controlled public host (referenced in an email's `<img src>`, auto-rewritten through the proxy by `EmailHtmlFrame.tsx`) can 302→`http://169.254.169.254/...` or any private IP. The most exploitable of the proxy gaps. Combined with NS-IMG-4 a `200 application/octet-stream` metadata body would be returned to the client.
- **Mitigation in place:** authenticated + single-tenant; Cloudflare egress itself restricts some internal ranges. **Fix direction:** `redirect:"manual"` + re-run `isPrivateHost` per hop (cap ~3).

#### [MAJOR] NS-IMG-2: SSRF guard misses alternate IP encodings
- **File:** `apps/api/src/routes/email.ts:1251-1266` (`isPrivateHost`); regex `:1254` matches only canonical dotted-decimal
- **Issue:** Decimal (`http://2130706433/`=127.0.0.1), octal (`0177.0.0.1`), hex (`0x7f000001`), and short forms (`127.1`) bypass the string guard; `169.254.169.254` as decimal `2852039166` evades the metadata block entirely. Workers' egress parses these.

#### [MAJOR] NS-IMG-3: IPv6 / IPv4-mapped IPv6 bypass
- **File:** `apps/api/src/routes/email.ts:1264` (only exact `::1` + `fc`/`fd`/`fe80` prefixes)
- **Issue:** `[::ffff:127.0.0.1]`, `[::ffff:169.254.169.254]`, expanded loopback `0:0:0:0:0:0:0:1`, and `[::]` all return `false` → allowed.

#### [MAJOR] NS-IMG-4: `application/octet-stream` content-type escape hatch
- **File:** `apps/api/src/routes/email.ts:1292-1295` (allows `image/*` **or** `application/octet-stream`; absent type defaults to octet-stream `:1292`)
- **Issue:** Defeats the image-only constraint for data-exfil — arbitrary bytes (metadata JSON, internal API bodies) pass through if labeled/defaulted octet-stream. `nosniff` + `<img>` context blunts XSS but not exfiltration. **Fix direction:** require strict `image/*`.

**Image-proxy passes (confirmed correct):** scheme allowlist http(s)-only (`:1274`), response-size cap declared+actual 10 MB (`:1296-1300`), `nosniff` (`:1308`), authenticated (not in public allowlist), url-keyed cache (no cross-target poisoning).

#### [POLISH] NS-IMG-5: DNS-rebinding TOCTOU + content-type passthrough cache
- String-only guard provides no protection against a hostname that resolves to a private IP at fetch time; resolve-and-pin is infeasible on Workers (`fetch` owns DNS), so platform-bounded. Proxied `Content-Type` is cached verbatim 24h (`:1305-1306`) — low risk behind auth.

### Public `.ics` + Booking Surface

#### [MAJOR] NS-ICS-1: `esc()` does not escape bare CR (`\r`) → ICS property/line injection
- **File:** `apps/api/src/lib/ics.ts:33-39` — escapes `\ , ; \n` but **not** `\r`; document joined with `\r\n` (`:84`)
- **Issue:** `guest_name`/`guest_notes` (`z.string().min(1).max(120/2000)`, no char-class restriction, `booking.ts:64-70`) flow into `SUMMARY`/`DESCRIPTION`/`ATTENDEE;CN=`. A name containing a lone `\r` injects a raw CR mid-value; lenient calendar parsers treat it as a line boundary, allowing arbitrary VEVENT properties. LF is escaped, so the gap is **CR-only**. **Fix direction:** `.replace(/\r\n|\r|\n/g,"\\n")` and reject control chars at the zod layer.

#### [MAJOR] NS-BK-1: Public routes expose guest PII under UUID-only access (IDOR)
- **File:** `booking.ts:507-519` (booking detail returns `guest_name`+`guest_email`), `:991-1036` (`.ics` returns guest+host email)
- **Issue:** `/booking/public/*` is fully unauthenticated (`middleware/auth.ts:45-46`); the booking row PK is the only access control, no management token. Anyone with a booking UUID reads guest PII.
- **Mitigation in place:** UUID is `gen_random_uuid()` (~122-bit, not enumerable) — this is what keeps it Major not Critical. The risk is realized only on UUID leak (URLs, email, referrer, shared history).

#### [MAJOR] NS-BK-2: Cancel/reschedule authorized by UUID alone — no capability token
- **File:** `booking.ts:522-576` (cancel), `:976-986` (reschedule)
- **Issue:** Possession of the (unguessable) UUID is sufficient to cancel/reschedule, delete the Google event, and fire emails. No per-booking secret. Anyone the guest forwards the link to gets full mutate authority. Calendly/Cal.com use a separate unguessable management token precisely so the row PK isn't the credential. **Fix direction:** per-booking management token required on cancel/reschedule.

#### [POLISH] NS-ICS-2 / NS-BK-3: ICS folding + PII cache headers
- `ics.ts:42-54` `fold()` counts UTF-16 code units, not 75 octets — multibyte content can exceed limit / split mid-char (interop cosmetic). The PII-bearing `.ics` response (`booking.ts:1029-1035`) sets no `Cache-Control: no-store`.

**Booking passes (confirmed):** no email header injection (Resend JSON fields, not raw headers); HTML escaped into emails; guest-field length/format validated; `.ics` `Content-Type: text/calendar` + `Content-Disposition: attachment`; UUID unguessability.

### Slot Engine + Calendar Drag

#### DST slot-math reasoning (the untested bug class) — **CORRECT, no bug**
Verified empirically by running the engine. `zonedTimeToUtc` (`slots.ts:63-72`) uses proper IANA conversion via `Intl.DateTimeFormat` offset derivation (`tzOffsetMs`, `:37-57`) — **not** fixed-offset math — with a one-pass refinement against the shifted instant to settle transition boundaries. `computeSlotsForDate` (`:149-169`) converts each window's wall-clock start/end to a UTC instant per-window, then strides in **UTC milliseconds**.
- **Spring-forward (America/New_York, 2026-03-08, 02:00–03:00 local does not exist):** a `00:00–06:00` window correctly spans only **5 real hours**; the UTC stride skips the missing wall-clock hour (local times jump `01:30→03:00`). A POST of the non-existent `02:30` collapses (via the refine step) to the same UTC instant as `01:30`, so it validates against a real offered slot rather than creating a phantom.
- **Fall-back (America/New_York, 2026-11-01, 01:00–02:00 local repeats):** each local time maps to exactly one UTC instant (the first/EDT occurrence) because windows are generated by UTC stride from a single `zonedTimeToUtc(start)` anchor; the repeated EST hour is never emitted — **no duplicate slots.**
- **Verdict:** slots are NOT wrong on either transition. This is the one thing nothing had tested, and it holds.

#### [MAJOR] NS-SLOT-1: Overlapping/adjacent availability windows emit duplicate slots
- **File:** `apps/api/src/lib/slots.ts:148-169`
- **Issue:** `computeSlotsForDate` flattens every window in `dayRule.slots` into one array with no dedup/merge. Windows `09:00–11:00` + `10:00–12:00` emit 10:00 and 10:30 twice → duplicate buttons on the public grid. `validateBookingRequest` is unaffected (uses `.includes()`). **Fix direction:** dedup/merge windows before returning.

#### [MAJOR] NS-SLOT-2: Daily-cap read-then-insert race; unique index does not cover it
- **File:** `booking.ts:621-631` (create), `:880-890` (reschedule); index `migration 036`
- **Issue:** `validateBookingRequest` reads `bookedToday` then inserts. Two concurrent bookings for **different slots on the same capped day** both read `cap-1`, both pass, both insert. The partial unique index is `(booking_link_id, scheduled_at)` — it prevents exact-slot double-booking only, **not** the per-day cap (different `scheduled_at`). So `max_bookings_per_day` can be exceeded under concurrency. Distinct from the exact-slot race, which **is** DB-guarded.

#### [MAJOR] NS-CAL-1: Drag/edit PATCH silently desyncs DB when Google call fails
- **File:** `apps/api/src/routes/calendar.ts:498-555` (`PATCH /events/:id`)
- **Issue:** Ordering is Google-first (PATCH at `:522`), but the response is read only inside `if (gcalRes.ok)` (`:531`) — a non-2xx (404/403/410) is silently ignored, the catch merely `console.error`s (`:543-545`), and the DB `update` runs **unconditionally** afterward (`:548`). Unlike the booking create/reschedule paths (which set `calendar_sync_failed`), this drag/edit path has **no failure flag and no abort**: a drag moves the local event while Google stays put, with no record and no user feedback — silent calendar desync. Verified directly. **Fix direction:** check `gcalRes.ok`, set `calendar_sync_failed` (or surface error) on failure, mirroring `BK-9`.

#### [POLISH] NS-SLOT-3 / NS-CAL-2: Silent slot defaults + no owner scoping
- `slots.ts:141-142`: `buffer_after_minutes ?? 15` and `minimum_notice_hours ?? 24` impose non-zero behavior a host never configured (intentional but worth a config audit). `calendar.ts:467-471` (and `/accounts` list, delete) scope event queries by `id` only, no owner column — structurally unsafe at multi-tenant, currently safe behind the allowlist.

### Auth / Crons / Undo / OAuth-State

#### [MAJOR] NS-AUTH-1: `X-Internal-Secret` comparison is not constant-time
- **File:** `apps/api/src/middleware/auth.ts:67` (`internalSecret === c.env.CRON_SECRET`)
- **Issue:** `===` short-circuits on first differing byte. The header grants the `internal-cron` identity that bypasses JWT + allowlist, and the check is reachable on every non-public request. A timing oracle could in theory recover the secret. **Fix direction:** `crypto.subtle.timingSafeEqual` or constant-time XOR. (Mitigation: the matching secret is only ever attached server-side by the cron and never forwarded by the proxy or CORS-allowed.)

#### [MAJOR] NS-CRON-1: Every-minute + %15 passes share one subrequest budget; reminder selects unbounded
- **File:** `apps/api/src/scheduled.ts:91-127`, reminder candidate selects `:331-337` (no `.limit()`)
- **Issue:** At minutes %15 (0/15/30/45), `unsnoozeEmails`(100) + `processScheduledSends`(50) + `runEmailSync` + `processBookingReminders` (unbounded) + `markCompletedBookings` + `syncAllCalendars` all run in one `scheduled()` invocation sharing the Workers subrequest cap (1000 paid / 50 free) and 30s wall-clock. A reminder backlog × (claim + guest send + host send) can blow the budget and kill the invocation mid-batch. **Fix direction:** `.limit()` on reminder selects; stagger %15 passes to different minute offsets.

#### [MAJOR] NS-UNDO-1: `email_undo_actions` has no TTL and no cleanup cron
- **File:** migration `048_email_undo_log.sql` (no expiry column); `scheduled.ts` has zero references to the table
- **Issue:** Every archive/trash/spam/snooze inserts a breadcrumb; rows are only marked `undone_at`, never deleted → unbounded growth. The empty-body "undo last" (`email.ts:1202-1214`) filters only `undone_at IS NULL`, not recency, so pressing `z` long after the toast expired silently reverses a days-old action. **Fix direction:** `created_at` sweep + recency bound on the empty-body lookup.

#### [MAJOR] NS-UNDO-2: Bulk/undo act on raw `email_ids` with no ownership check
- **File:** `apps/api/src/routes/email.ts:1039-1042` (`applyBulk` loads `emails WHERE id IN (ids)` — no account-ownership filter); `/bulk`, `/undo` routes
- **Issue:** `emails` has no `user_id` (ownership is `account_id→email_accounts`); neither route constrains `email_ids` to the caller's accounts. A `{action:"trash", email_ids:[<any uuid>]}` acts on any email row. **Currently de-fanged by single-tenant allowlist** (one founder owns all rows) but zero defense-in-depth — breaks the instant a second account/user is added. **Fix direction:** filter targets to accounts owned by `c.get("userId")`.

#### [MAJOR] NS-OAUTH-1: `oauth_states` consume is a non-atomic read-then-delete (CSRF nonce reuse)
- **File:** `apps/api/src/lib/oauth-state.ts:55-69` (`SELECT … maybeSingle()` then separate `DELETE`)
- **Issue:** Two concurrent callbacks with the same captured `state` can both complete the SELECT before either DELETE lands → the single-use CSRF nonce is consumed twice. **Fix direction:** `DELETE … WHERE nonce=$1 RETURNING …` and treat zero rows as invalid (the same atomic-claim pattern the reminder cron uses correctly).
- **Confirmed correct in oauth-state:** expiry enforced on consume (`:67`), 256-bit `crypto.getRandomValues` entropy (`:20-24`), stale-state cleanup runs every minute (`scheduled.ts:98-102`).

### e2e Harness (does it weaken prod?)

#### [POLISH] NS-E2E-1: Teardown sweeps prod by `[E2E]` substring match — pattern-collision risk
- **File:** `apps/e2e/global-teardown.ts` (`.ilike("subject","%[E2E]%")` `:61`, booking-link/event title sweeps `:18,:41`), tag `lib/tags.ts:5` (`E2E_TAG="[E2E]"`), target `lib/env.ts:29-30` (defaults to **`https://app.sheetzlabs.com` / `api.sheetzlabs.com` — prod**)
- **Issue:** The nightly suite runs against prod with the service-role `admin()` client and sweeps anything whose subject/title contains the literal `[E2E]`. A real founder email/calendar event/booking-link that happens to contain `[E2E]` would be soft-deleted (emails: `is_trashed/is_deleted`) or hard-deleted (booking links + their bookings, `:24-30`). Collision is unlikely with that bracketed tag, but the sweep is unscoped beyond the substring and runs against live data. The sweep is correctly time-bounded (>1h old) and FK-ordered, and failures are swallowed (`:96`) so a bad sweep won't fail CI — which also means a wrongful delete is silent. **Note:** the self-sent-mail sweep (`:57-62`) filters by subject only, not sender, so inbound mail with the tag is also in scope.
- **Related:** the test identity `e2e@sheetzlabs.com` is a **second allowlisted user** (memory: `ALLOWED_USER_EMAILS`) running with founder-equivalent access against prod — this is a limited live instance of the NS-UNDO-2 / NS-CAL-2 "second account" trigger, since that identity can already reach the founder's email/calendar rows (no `user_id` scoping). Acceptable because it's a controlled test account, but it is the one place the single-tenant assumption is already relaxed.

#### [POLISH] NS-MISC: catch/ordering/single-use nits
- `scheduled.ts:255-260` empty `catch {}` swallows scheduled-content failure reason. `:429` `markCompletedBookings` `limit(500)` with no `.order()` can starve the oldest backlog. `email.ts:1216-1238` explicit-undo applies the inverse even with no breadcrumb (idempotent in practice, but single-use not truly enforced). `worker-configuration.d.ts:10` carries a stale/wrong allowlist literal (`@yardi.com`) — generated type only, not runtime, but a copy-paste landmine. CORS reflects `localhost`/`127.0.0.1` with `credentials:true` in prod (`index.ts:62-68`) — unnecessary surface, low blast radius (API is JWT-in-header, not cookie-auth).

---

## Residual-Risk Register

Each item is currently acceptable; the **trigger** is the condition under which it must be addressed.

| Risk | Severity now | Trigger |
|------|--------------|---------|
| OAuth tokens stored plaintext at rest | Deferred (ledger) | Before any shared DB / non-founder access |
| No RLS; service-role client everywhere | Deferred (ledger) | Before multi-tenant |
| No `user_id` ownership on `emails`/`calendar_events`/`calendar_accounts`/`bookings` (NS-UNDO-2, NS-CAL-2) | Major, gated by allowlist | **Before adding a second allowlisted user/account** — cross-user mutate becomes live |
| Alias From-header always primary (EC-6) | Deferred (ledger) | When send-as-alias is a product requirement |
| `$id` calendar page duplicates index modal (CS-13/CS-15 residual) | Deferred (ledger) | Refactor opportunity, not a bug |
| Image-proxy SSRF guard string-only (NS-IMG-1..4) | Major, gated by auth + CF egress | Before exposing the proxy unauthenticated, or before relying on it as a security boundary |
| Public booking = UUID-as-bearer, no management token (NS-BK-1/2) | Major, gated by UUID entropy | Before high-volume public links or any compliance requirement on guest PII |
| `.ics` CR-injection (NS-ICS-1) | Major | Fix proactively — cheap; depends only on a malicious guest + lenient client |
| Daily-cap concurrency overrun (NS-SLOT-2) | Major | Before any link where exceeding `max_bookings_per_day` by 1+ matters (paid/limited slots) |
| Calendar drag silent desync (NS-CAL-1) | Major | Fix proactively — contradicts the established Google-first+flag pattern |
| Cron subrequest budget under backlog (NS-CRON-1) | Major | Before reminder/scheduled-send volume grows, or if on the 50-subrequest plan |
| `email_undo_actions` unbounded + stale-replay (NS-UNDO-1) | Major | Add a sweep before the table grows; recency bound is a correctness fix anytime |
| `oauth_states` consume race (NS-OAUTH-1) | Major | Fix proactively — small atomic-claim change |
| `X-Internal-Secret` non-constant-time (NS-AUTH-1) | Major | Fix proactively — one-line `timingSafeEqual` |
| Rate-limiter fails open if binding absent (BK-5 note) | Polish, plan-dependent | Verify bindings present in prod; before relying on it for abuse defense |

---

## Completion Checklist

- [x] Independent pass of each new surface completed before reading the original audit
- [x] All 75 original findings dispositioned with current evidence (69 Resolved, 5 Partial/Polish-residual, 0 Not Resolved, 0 unjustified deferrals)
- [x] All 9 new-surface areas examined (auth/allowlist/proxy, image proxy, .ics, undo, oauth_states, crons, drag PATCH, slot engine, e2e)
- [x] DST slot-math reasoning shown explicitly — verified correct on both spring-forward and fall-back
- [x] New findings severity-classified in original-audit format; residual-risk register with triggers
- [x] NO code changes made
