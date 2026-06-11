import { createSupabaseServerClient } from "./auth.server";

/**
 * Centralized helper for calling the API worker from web loaders/actions.
 *
 * The API worker now authenticates every non-public route (XC-1), so server-side
 * calls must forward the founder's Supabase JWT as `Authorization: Bearer <token>`.
 * Client-side calls go through the same-origin `/api/*` proxy (routes/api.$.tsx)
 * instead, so the token never reaches client JS.
 *
 * URL resolution kills the hardcoded production URLs (XC-5): prefer a configured
 * base, fall back to the public API origin.
 */

type ApiEnv = {
  SUPABASE_URL: string;
  SUPABASE_ANON_KEY: string;
  API_URL?: string;
  INTERNAL_API_URL?: string;
};

const DEFAULT_API = "https://api.sheetzlabs.com";

/** Base URL for server-to-server calls (may use an internal hostname). */
export function getApiBase(env: ApiEnv): string {
  return env.INTERNAL_API_URL ?? env.API_URL ?? DEFAULT_API;
}

/** Public, browser-reachable API origin (e.g. for OAuth `<a href>` links). */
export function getPublicApiBase(env: ApiEnv): string {
  return env.API_URL ?? DEFAULT_API;
}

/** Read the current Supabase access token from the request cookies, if any. */
export async function getAccessToken(request: Request, env: ApiEnv): Promise<string | null> {
  const { supabase } = createSupabaseServerClient(request, env);
  const {
    data: { session },
  } = await supabase.auth.getSession();
  return session?.access_token ?? null;
}

function buildUrl(base: string, path: string): string {
  if (/^https?:\/\//.test(path)) return path;
  return `${base}${path.startsWith("/") ? "" : "/"}${path}`;
}

/**
 * Fetch the API worker with the founder's JWT attached. Use this in every loader/
 * action that talks to an authenticated API route. (Public `/booking/public/*`
 * routes don't require a token, but attaching one when present is harmless.)
 */
export async function apiFetch(
  request: Request,
  env: ApiEnv,
  path: string,
  init: RequestInit = {}
): Promise<Response> {
  const token = await getAccessToken(request, env);
  const headers = new Headers(init.headers);
  if (token) headers.set("Authorization", `Bearer ${token}`);
  return fetch(buildUrl(getApiBase(env), path), { ...init, headers });
}
