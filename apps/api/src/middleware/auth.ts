import { createClient } from "@supabase/supabase-js";
import type { Context, Next } from "hono";

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
 *  - The Google OAuth start + callback routes. These are reached by full-page
 *    browser navigation (and Google's redirect), neither of which can carry an
 *    Authorization header; they are protected by an HttpOnly `state` nonce cookie
 *    instead (see the OAuth handlers). NOTE: the prompt asked for the OAuth *start*
 *    routes to require auth, but that is incompatible with `<a href>` initiation and
 *    the cross-subdomain state cookie that the callback depends on. The audit (XC-2)
 *    only requires a `state` nonce, which we implement — flagged in the summary.
 *
 * Trusted server-to-server callers (the cron) may instead present
 * `X-Internal-Secret: <CRON_SECRET>` to reach internal endpoints.
 */

type Bindings = {
  SUPABASE_URL: string;
  SUPABASE_ANON_KEY: string;
  CRON_SECRET?: string;
};

// Exact-path allowlist (no auth required).
const PUBLIC_EXACT = new Set(["/", "/health"]);

// Prefix allowlist (no auth required).
const PUBLIC_PREFIXES = [
  "/booking/public/",
  "/email/auth/gmail", // start + /callback
  "/calendar/auth/google", // start + /callback
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

  // Trusted internal caller (cron) — shared secret.
  const internalSecret = c.req.header("X-Internal-Secret");
  if (internalSecret && c.env.CRON_SECRET && internalSecret === c.env.CRON_SECRET) {
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

  c.set("userId", user.id);
  return next();
}
