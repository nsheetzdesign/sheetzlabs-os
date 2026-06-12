# Diagnostic scripts

Rerunnable, read-only diagnostics from the Prompt 58 inbox/trash triage. They read
service-role creds from the repo-root `.env.local` and hit the live Supabase / API
exactly as production does. Run from the repo root.

- **`account-state.mjs`** — dumps Gmail sync/token state (`sync_error`,
  `needs_reauth`, `refreshing_until`, `last_sync_at`, `last_reconciled_at`) plus
  per-account email counts and the newest synced message. First stop when the
  inbox looks stale. Run: `node apps/e2e/scripts/account-state.mjs`
- **`founder-probe.mjs`** — mints a genuine `nick@sheetzlabs.com` session via the
  admin magic-link flow and calls the API worker as the web app does
  (`Authorization: Bearer <jwt>`), capturing verbatim status + body for
  `GET /email/accounts`, `POST /email/sync`, and (with `--trash`) a trash/untrash
  round-trip on a self-sent `[E2E]` probe. Run:
  `node apps/e2e/scripts/founder-probe.mjs [--trash]`
