import { createSupabaseServerClient } from "./auth.server";
const DEFAULT_API = "https://api.sheetzlabs.com";
/** Base URL for server-to-server calls (may use an internal hostname). */
export function getApiBase(env) {
    return env.INTERNAL_API_URL ?? env.API_URL ?? DEFAULT_API;
}
/** Read the current Supabase access token from the request cookies, if any. */
export async function getAccessToken(request, env) {
    const { supabase } = createSupabaseServerClient(request, env);
    const { data: { session }, } = await supabase.auth.getSession();
    return session?.access_token ?? null;
}
function buildUrl(base, path) {
    if (/^https?:\/\//.test(path))
        return path;
    return `${base}${path.startsWith("/") ? "" : "/"}${path}`;
}
/**
 * Fetch the API worker with the founder's JWT attached. Use this in every loader/
 * action that talks to an authenticated API route. (Public `/booking/public/*`
 * routes don't require a token, but attaching one when present is harmless.)
 */
export async function apiFetch(request, env, path, init = {}) {
    const token = await getAccessToken(request, env);
    const headers = new Headers(init.headers);
    if (token)
        headers.set("Authorization", `Bearer ${token}`);
    return fetch(buildUrl(getApiBase(env), path), { ...init, headers });
}
