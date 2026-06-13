/**
 * Prompt 63 — action-auth class regression gate.
 *
 * Two defects this locks down:
 *  1. RR v7 `action` exports do NOT inherit the ancestor (dashboard) loader's auth,
 *     so a mutating action that hits Supabase directly without its own `requireAuth`
 *     runs for anyone. We assert that unauthenticated POSTs to previously-ungated
 *     web actions are redirected to /auth/login (the mutation never runs).
 *  2. `tickets.ts` auth was internally contradictory (N8N-key middleware after the
 *     global JWT gate) → every endpoint unreachable. We assert the convert endpoints
 *     are reachable AND authed, and that the N8N-only sync endpoint rejects callers
 *     without the N8N secret.
 *
 * Runs unauthenticated for the web-action checks; the tickets API checks mint a real
 * founder JWT via the shared `api()` helper. A non-existent (but well-formed) UUID is
 * used everywhere so nothing is actually mutated even in a worst-case regression.
 */
import { test, expect } from "@playwright/test";
import { ENV } from "../lib/env";
import { api, apiPublic } from "../lib/api";

// These checks manage their own (absent) session — never the shared founder one.
test.use({ storageState: { cookies: [], origins: [] } });

const NONEXISTENT_UUID = "00000000-0000-0000-0000-000000000000";

const isRedirect = (s: number) => [301, 302, 303, 307, 308].includes(s);

test.describe("RR v7 mutating actions require their own auth (Prompt 63)", () => {
  // Each previously-ungated action does a direct service-role mutation. Auth is the
  // first line of the action, so the redirect happens before any body parse/mutation.
  const ungatedActions: { name: string; path: string; form: Record<string, string> }[] = [
    {
      // `_index` route — RR targets an index action via the `?index` query param;
      // a bare POST would hit the parent layout (no action → 405), not the gate.
      name: "revenue delete",
      path: "/dashboard/revenue?index",
      form: { intent: "delete", id: NONEXISTENT_UUID },
    },
    {
      name: "ventures create",
      path: "/dashboard/ventures/new",
      form: { name: "e2e-should-not-create", slug: `e2e-noauth-${Date.now()}` },
    },
    {
      name: "relationships create",
      path: "/dashboard/relationships/new",
      form: { name: "e2e-should-not-create" },
    },
  ];

  for (const a of ungatedActions) {
    test(`unauthenticated ${a.name} is rejected (redirect to login)`, async ({ request }) => {
      const res = await request.post(`${ENV.BASE_URL}${a.path}`, {
        form: a.form,
        maxRedirects: 0,
        failOnStatusCode: false,
      });
      expect(isRedirect(res.status()), `expected a redirect, got ${res.status()}`).toBe(true);
      expect(res.headers()["location"] ?? "").toContain("/auth/login");
    });
  }
});

test.describe("tickets endpoint auth untangle (Prompt 63)", () => {
  test("convert-to-task is reachable AND authed (404 for missing ticket, not 401/403)", async () => {
    const res = await api(`/tickets/${NONEXISTENT_UUID}/convert-to-task`, { method: "POST" });
    // Reachable (not blocked by a contradictory router middleware) and authed
    // (founder JWT accepted): the ticket simply doesn't exist → 404.
    expect(res.status).toBe(404);
  });

  test("convert-to-task rejects unauthenticated callers (401)", async () => {
    const res = await apiPublic(`/tickets/${NONEXISTENT_UUID}/convert-to-task`, { method: "POST" });
    expect(res.status).toBe(401);
  });

  test("convert-to-milestone rejects unauthenticated callers (401)", async () => {
    const res = await apiPublic(`/tickets/${NONEXISTENT_UUID}/convert-to-milestone`, { method: "POST" });
    expect(res.status).toBe(401);
  });

  test("N8N sync endpoint is reachable but rejects callers without the N8N secret (401)", async () => {
    // On the public-prefix allowlist (JWT gate skipped) but gated by the in-handler
    // N8N key check. Neither an absent key nor a founder JWT is the N8N secret → 401,
    // and crucially NOT a venture-lookup 404 (auth is checked first).
    const noKey = await apiPublic("/tickets/sync/e2e-nonexistent-venture", {
      method: "POST",
      body: JSON.stringify({ records: [] }),
    });
    expect(noKey.status).toBe(401);

    const founderJwt = await api("/tickets/sync/e2e-nonexistent-venture", {
      method: "POST",
      body: JSON.stringify({ records: [] }),
    });
    expect(founderJwt.status).toBe(401);
  });
});
