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
/** Base URL for server-to-server calls (may use an internal hostname). */
export declare function getApiBase(env: ApiEnv): string;
/** Public, browser-reachable API origin (e.g. for OAuth `<a href>` links). */
export declare function getPublicApiBase(env: ApiEnv): string;
/** Read the current Supabase access token from the request cookies, if any. */
export declare function getAccessToken(request: Request, env: ApiEnv): Promise<string | null>;
/**
 * Fetch the API worker with the founder's JWT attached. Use this in every loader/
 * action that talks to an authenticated API route. (Public `/booking/public/*`
 * routes don't require a token, but attaching one when present is harmless.)
 */
export declare function apiFetch(request: Request, env: ApiEnv, path: string, init?: RequestInit): Promise<Response>;
export {};
