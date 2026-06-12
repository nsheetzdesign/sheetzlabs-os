/**
 * Authenticated API client for the e2e suite. Mints a real founder JWT via the
 * Supabase password grant (same credentials the browser login uses) and calls the
 * API the way the production web app does: Bearer token against API_URL. Exercises
 * the real auth boundary, so a regression there fails the suite too.
 */
import { createClient } from "@supabase/supabase-js";
import { ENV } from "./env";

let _tokenPromise: Promise<string> | null = null;

async function mintToken(): Promise<string> {
  const anon = createClient(ENV.SUPABASE_URL, ENV.SUPABASE_ANON_KEY, {
    auth: { autoRefreshToken: false, persistSession: false },
  });
  const { data, error } = await anon.auth.signInWithPassword({
    email: ENV.TEST_USER_EMAIL,
    password: ENV.TEST_USER_PASSWORD,
  });
  if (error || !data.session) {
    throw new Error(`Supabase sign-in failed: ${error?.message ?? "no session"}`);
  }
  return data.session.access_token;
}

export async function token(): Promise<string> {
  if (!_tokenPromise) _tokenPromise = mintToken();
  return _tokenPromise;
}

export interface ApiResponse<T = unknown> {
  status: number;
  ok: boolean;
  body: T;
}

/** Authenticated request against API_URL. */
export async function api<T = unknown>(
  path: string,
  init: RequestInit = {}
): Promise<ApiResponse<T>> {
  const jwt = await token();
  const res = await fetch(`${ENV.API_URL}${path}`, {
    ...init,
    headers: {
      Authorization: `Bearer ${jwt}`,
      "Content-Type": "application/json",
      ...(init.headers ?? {}),
    },
  });
  const text = await res.text();
  let body: unknown = text;
  try {
    body = text ? JSON.parse(text) : null;
  } catch {
    /* leave as text */
  }
  return { status: res.status, ok: res.ok, body: body as T };
}

/** Unauthenticated request against API_URL (for public-boundary assertions). */
export async function apiPublic<T = unknown>(
  path: string,
  init: RequestInit = {}
): Promise<ApiResponse<T>> {
  const res = await fetch(`${ENV.API_URL}${path}`, {
    ...init,
    headers: { "Content-Type": "application/json", ...(init.headers ?? {}) },
  });
  const text = await res.text();
  let body: unknown = text;
  try {
    body = text ? JSON.parse(text) : null;
  } catch {
    /* leave as text */
  }
  return { status: res.status, ok: res.ok, body: body as T };
}

/** Trigger a manual sync of one email account and wait for it to settle. */
export async function syncEmailAccount(accountId: string): Promise<ApiResponse> {
  return api(`/email/accounts/${accountId}/sync`, { method: "POST" });
}
