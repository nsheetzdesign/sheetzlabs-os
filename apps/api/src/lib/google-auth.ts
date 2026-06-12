/**
 * Shared Google OAuth access-token helper (Prompt 52A Part 1 — ES-3 / CS-3 / XC-4).
 *
 * Replaces the three copy-pasted `getValidAccessToken` implementations in
 * `email.ts`, `calendar.ts`, and `booking.ts`. The old copies never checked
 * `response.ok`: on `invalid_grant` (a revoked refresh token) they wrote an
 * `undefined` access_token plus a fresh future `token_expires_at`, so the dead
 * token looked valid forever and every request 401'd with no surfacing.
 *
 * This version:
 *  - checks `response.ok` and parses the Google error body;
 *  - on `invalid_grant`, flags the account `needs_reauth` + `sync_error` and throws
 *    a typed {@link ReauthRequiredError} (callers skip the account, never abort);
 *  - on any other failure, throws the Google error message and never writes a token;
 *  - uses a lightweight `refreshing_until` mutex so a concurrent cron + manual sync
 *    don't both refresh — the loser re-reads the row and uses the fresh token.
 */

type GoogleEnv = { GOOGLE_CLIENT_ID: string; GOOGLE_CLIENT_SECRET: string };

export type AccountTable = "email_accounts" | "calendar_accounts";

export class ReauthRequiredError extends Error {
  email: string;
  constructor(email: string) {
    super(`Account ${email} requires reconnection (invalid_grant)`);
    this.name = "ReauthRequiredError";
    this.email = email;
  }
}

// How long a refresh claim is held before another caller may steal it (covers a
// crashed refresher). Google refreshes take well under this.
const REFRESH_CLAIM_MS = 30_000;

function isFresh(expiresAt: unknown, skewMs: number): boolean {
  if (!expiresAt) return false;
  const t = new Date(expiresAt as string).getTime();
  return Number.isFinite(t) && t > Date.now() + skewMs;
}

export async function getValidAccessToken(
  account: Record<string, unknown>,
  env: GoogleEnv,
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  supabase: any,
  table: AccountTable
): Promise<string> {
  const id = account.id as string;
  const email = (account.email as string) ?? id;

  if (account.needs_reauth === true) {
    throw new ReauthRequiredError(email);
  }

  // Still valid (1-min skew) — use as-is.
  if (isFresh(account.token_expires_at, 60_000) && account.access_token) {
    return account.access_token as string;
  }

  // --- Refresh mutex -------------------------------------------------------
  // Claim the refresh by writing refreshing_until, but only if nobody else holds
  // an unexpired claim. PostgREST returns the updated rows via .select(); a
  // non-empty result means we won.
  //
  // The claim condition is "refreshing_until IS NULL OR refreshing_until < now".
  // It used to be a single `.or(...)` filter, but PostgREST rejects the
  // combination of `.update()` + `.or()` + `.select()` with a misleading
  // "column ... does not exist" error (Prompt 55 — verified against prod; the
  // same op without `.select()` or with a single-column filter works). So we
  // split it into two disjoint single-filter UPDATEs: a row is either NULL or
  // non-NULL, so it matches exactly one, and each UPDATE is atomic per row.
  const nowIso = new Date().toISOString();
  const claimUntil = new Date(Date.now() + REFRESH_CLAIM_MS).toISOString();

  // 1) Claim if currently free (no prior claim).
  let won = false;
  const { data: claimedFree, error: claimErrorFree } = await supabase
    .from(table)
    .update({ refreshing_until: claimUntil })
    .eq("id", id)
    .is("refreshing_until", null)
    .select("id");
  if (claimErrorFree) {
    console.error(`[google-auth] claim error for ${email}:`, claimErrorFree.message);
  }
  if (claimedFree?.length) {
    won = true;
  } else {
    // 2) Otherwise steal an expired claim (covers a crashed refresher).
    const { data: claimedExpired, error: claimErrorExpired } = await supabase
      .from(table)
      .update({ refreshing_until: claimUntil })
      .eq("id", id)
      .lt("refreshing_until", nowIso)
      .select("id");
    if (claimErrorExpired) {
      console.error(`[google-auth] claim error for ${email}:`, claimErrorExpired.message);
    }
    if (claimedExpired?.length) won = true;
  }

  if (!won) {
    // Another caller is (or just finished) refreshing — re-read and reuse.
    const { data: fresh } = await supabase
      .from(table)
      .select("access_token, token_expires_at, needs_reauth")
      .eq("id", id)
      .single();
    if (fresh?.needs_reauth) throw new ReauthRequiredError(email);
    if (fresh?.access_token && isFresh(fresh.token_expires_at, 5_000)) {
      return fresh.access_token as string;
    }
    // The winner is still in-flight (or failed without writing). Fall through and
    // refresh ourselves as a fallback rather than returning a stale token.
  }

  // --- Perform the refresh -------------------------------------------------
  const response = await fetch("https://oauth2.googleapis.com/token", {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams({
      client_id: env.GOOGLE_CLIENT_ID,
      client_secret: env.GOOGLE_CLIENT_SECRET,
      refresh_token: account.refresh_token as string,
      grant_type: "refresh_token",
    }),
  });

  if (!response.ok) {
    const body = (await response.json().catch(() => ({}))) as {
      error?: string;
      error_description?: string;
    };
    if (body.error === "invalid_grant") {
      await supabase
        .from(table)
        .update({
          needs_reauth: true,
          sync_error: "Reconnect required — Google access was revoked.",
          refreshing_until: null,
        })
        .eq("id", id);
      throw new ReauthRequiredError(email);
    }
    await supabase.from(table).update({ refreshing_until: null }).eq("id", id);
    throw new Error(
      `Google token refresh failed (${response.status}): ${
        body.error_description ?? body.error ?? "unknown error"
      }`
    );
  }

  const tokens = (await response.json()) as {
    access_token?: string;
    expires_in?: number;
  };

  if (!tokens.access_token) {
    await supabase.from(table).update({ refreshing_until: null }).eq("id", id);
    throw new Error("Google token refresh returned no access_token");
  }

  await supabase
    .from(table)
    .update({
      access_token: tokens.access_token,
      token_expires_at: new Date(
        Date.now() + (tokens.expires_in ?? 3600) * 1000
      ).toISOString(),
      needs_reauth: false,
      sync_error: null,
      refreshing_until: null,
    })
    .eq("id", id);

  return tokens.access_token;
}
