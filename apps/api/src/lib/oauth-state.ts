import type { SupabaseClient } from "@supabase/supabase-js";

/**
 * CSRF + ownership protection for OAuth flows (XC-2 / Prompt 51B).
 *
 * OAuth is initiated from the authenticated app. The authenticated start endpoint
 * generates a random nonce, persists it bound to the founder's `user_id` (10-min
 * TTL), and forwards it to Google as the `state` param. The public callback (which
 * Google redirects to, so it can't carry an Authorization header) looks the nonce
 * up, deletes it (single-use), and rejects unknown/expired/wrong-provider states.
 *
 * This replaces the old HttpOnly state cookie: the API lives on a different
 * subdomain than the app, so the callback couldn't see an app-set cookie, and an
 * unauthenticated start let anyone link their own Google account into the
 * single-tenant DB. The state row binds the flow to the user who started it.
 */

const STATE_TTL_MS = 10 * 60 * 1000; // 10 minutes

export function generateStateNonce(): string {
  const bytes = new Uint8Array(32);
  crypto.getRandomValues(bytes);
  return Array.from(bytes, (b) => b.toString(16).padStart(2, "0")).join("");
}

/**
 * Create a single-use OAuth state row bound to `userId` + `provider`, returning the
 * nonce to forward to Google as `state`.
 */
export async function createOAuthState(
  supabase: SupabaseClient,
  userId: string,
  provider: string
): Promise<string> {
  const nonce = generateStateNonce();
  const expiresAt = new Date(Date.now() + STATE_TTL_MS).toISOString();
  await supabase
    .from("oauth_states")
    .insert({ nonce, user_id: userId, provider, expires_at: expiresAt });
  return nonce;
}

/**
 * Validate the `state` returned by Google against the stored row and consume it.
 * Always deletes the row if found (single-use). Returns `{ valid: false }` for an
 * unknown, expired, or wrong-provider state; otherwise the bound `userId`.
 */
export async function consumeOAuthState(
  supabase: SupabaseClient,
  nonce: string | undefined,
  provider: string
): Promise<{ valid: boolean; userId?: string }> {
  if (!nonce) return { valid: false };

  // Atomic claim: DELETE ... RETURNING is a single statement, so of two concurrent
  // callbacks replaying the same captured `state` only one gets the row — the nonce
  // is truly single-use (NS-OAUTH-1). The prior read-then-delete could hand the row
  // to both before either delete landed.
  const { data } = await supabase
    .from("oauth_states")
    .delete()
    .eq("nonce", nonce)
    .select("user_id, provider, expires_at");

  const row = Array.isArray(data) ? data[0] : data;
  if (!row) return { valid: false };

  if (row.provider !== provider) return { valid: false };
  if (new Date(row.expires_at as string).getTime() < Date.now()) return { valid: false };

  return { valid: true, userId: row.user_id as string };
}
