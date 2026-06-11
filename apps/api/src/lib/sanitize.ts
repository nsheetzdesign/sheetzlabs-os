/**
 * Strip OAuth secrets from an account row before returning it in an API response.
 * Never let access_token / refresh_token / token_expires_at reach a client.
 */
export function sanitizeAccount<T extends Record<string, unknown> | null | undefined>(
  account: T
): T {
  if (!account || typeof account !== "object") return account;
  const {
    access_token: _a,
    refresh_token: _r,
    token_expires_at: _e,
    ...safe
  } = account as Record<string, unknown>;
  return safe as T;
}
