import { createClient } from "@supabase/supabase-js";
import type { Context, Next } from "hono";
import { isAllowedUser } from "@sheetzlabs/shared";
import { timingSafeEqual } from "../lib/timing-safe";

/**
 * Authentication middleware for the API worker.
 *
 * Verifies a Supabase JWT supplied as `Authorization: Bearer <token>` using an
 * anon-key client (`supabase.auth.getUser(token)`) and sets `c.set("userId", ...)`.
 *
 * A small public allowlist is exempt:
 *  - `GET /` and `GET /health`
 *  - `/booking/public/*` (slot display / create / cancel / reschedule — these get
 *    their own validation + rate limiting)
 *  - The Google OAuth *callback* routes only (Prompt 51B). Google redirects the
 *    browser here with no Authorization header, so they can't be authenticated;
 *    instead they validate a single-use, user-bound `state` nonce against the
 *    `oauth_states` table. The OAuth *start* routes (`POST .../start`) are NOT on
 *    the allowlist — they run behind this middleware so the nonce is bound to the
 *    authenticated founder, closing the open-link-anyone's-account hole (XC-2).
 *
 * Trusted server-to-server callers (the cron) may instead present
 * `X-Internal-Secret: <CRON_SECRET>` to reach internal endpoints.
 */

type Bindings = {
  SUPABASE_URL: string;
  SUPABASE_ANON_KEY: string;
  CRON_SECRET?: string;
  // Comma-separated single-tenant allowlist (Prompt 54A Part 0). A valid JWT is
  // not sufficient — the user's email must also be on this list.
  ALLOWED_USER_EMAILS?: string;
};

// Exact-path allowlist (no auth required). The OAuth callbacks are exact paths so
// the `.../start` initiation routes (which require auth) are NOT exempted.
const PUBLIC_EXACT = new Set([
  "/",
  "/health",
  "/email/auth/gmail/callback", // Google redirect — validated by user-bound state nonce
  "/calendar/auth/google/callback", // Google redirect — validated by user-bound state nonce
]);

// Prefix allowlist (no auth required).
const PUBLIC_PREFIXES = [
  "/booking/public/",
  "/stripe/webhook/", // Stripe-signed webhooks (verified by signature, not JWT)
];

function isPublicPath(path: string): boolean {
  if (PUBLIC_EXACT.has(path)) return true;
  return PUBLIC_PREFIXES.some((p) => path === p || path.startsWith(p));
}

export async function authMiddleware(
  c: Context<{ Bindings: Bindings; Variables: { userId: string } }>,
  next: Next
) {
  const path = c.req.path;

  if (isPublicPath(path)) {
    return next();
  }

  // Trusted internal caller (cron) — shared secret, compared in constant time so the
  // header (which grants the allowlist-bypassing internal-cron identity and is
  // checked on every non-public request) can't be recovered via a timing oracle
  // (NS-AUTH-1).
  const internalSecret = c.req.header("X-Internal-Secret");
  if (internalSecret && c.env.CRON_SECRET && timingSafeEqual(internalSecret, c.env.CRON_SECRET)) {
    c.set("userId", "internal-cron");
    return next();
  }

  const authHeader = c.req.header("Authorization") ?? "";
  const token = authHeader.startsWith("Bearer ") ? authHeader.slice(7).trim() : "";

  if (!token) {
    return c.json({ error: "Unauthorized" }, 401);
  }

  const supabase = createClient(c.env.SUPABASE_URL, c.env.SUPABASE_ANON_KEY, {
    auth: { autoRefreshToken: false, persistSession: false },
  });

  const {
    data: { user },
    error,
  } = await supabase.auth.getUser(token);

  if (error || !user) {
    return c.json({ error: "Unauthorized" }, 401);
  }

  // Single-tenant gate (Prompt 54A Part 0): a valid Supabase JWT is not enough —
  // the user's email must be on the allowlist, otherwise a self-registered
  // account could read the founder's data.
  if (!isAllowedUser(user.email, c.env)) {
    return c.json({ error: "Forbidden" }, 403);
  }

  c.set("userId", user.id);
  return next();
}
