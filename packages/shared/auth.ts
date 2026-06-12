/**
 * Single-tenant user allowlist (Prompt 54A Part 0).
 *
 * The app is single-tenant but Supabase auth will issue a valid JWT to any
 * self-registered account. Without this gate, any registered user can read the
 * founder's data through both the API (JWT-authed) and the web loaders (which
 * hit Supabase directly with the service key). We close that hole by checking
 * the authenticated user's email against an env-provided allowlist on BOTH
 * workers.
 *
 * The shared package has no access to `process.env` / worker bindings, so the
 * caller passes the env object (or just the CSV string). This keeps a single
 * source of truth for the parsing/matching rules while letting each worker
 * supply its own `ALLOWED_USER_EMAILS` binding.
 */

export interface AllowlistEnv {
  ALLOWED_USER_EMAILS?: string;
}

/** Parse the comma-separated allowlist into a normalized (lowercased, trimmed) set. */
export function parseAllowedEmails(csv: string | undefined | null): Set<string> {
  return new Set(
    (csv ?? "")
      .split(",")
      .map((e) => e.trim().toLowerCase())
      .filter(Boolean),
  );
}

/**
 * Returns true iff `email` is on the allowlist.
 *
 * Fail-closed: if no allowlist is configured (empty/unset), NOBODY is allowed.
 * This is deliberate — a missing env var must not silently open the app to
 * every registered Supabase user.
 */
export function isAllowedUser(
  email: string | undefined | null,
  envOrCsv: AllowlistEnv | string | undefined | null,
): boolean {
  if (!email) return false;
  const csv = typeof envOrCsv === "string" ? envOrCsv : envOrCsv?.ALLOWED_USER_EMAILS;
  const allowed = parseAllowedEmails(csv);
  if (allowed.size === 0) return false;
  return allowed.has(email.trim().toLowerCase());
}
