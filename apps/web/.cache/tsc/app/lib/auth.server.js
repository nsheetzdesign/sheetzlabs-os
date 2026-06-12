import { createServerClient, parseCookieHeader, serializeCookieHeader, } from "@supabase/ssr";
import { isAllowedUser } from "@sheetzlabs/shared";
import { redirect } from "react-router";
export function createSupabaseServerClient(request, env) {
    const headers = new Headers();
    const supabase = createServerClient(env.SUPABASE_URL, env.SUPABASE_ANON_KEY, {
        cookies: {
            getAll() {
                return parseCookieHeader(request.headers.get("Cookie") ?? "") ?? [];
            },
            setAll(cookiesToSet) {
                cookiesToSet.forEach(({ name, value, options }) => headers.append("Set-Cookie", serializeCookieHeader(name, value, options)));
            },
        },
    });
    return { supabase, headers };
}
export async function requireAuth(request, env) {
    const { supabase, headers } = createSupabaseServerClient(request, env);
    const { data: { user }, } = await supabase.auth.getUser();
    if (!user) {
        throw redirect("/auth/login", { headers });
    }
    // Single-tenant gate (Prompt 54A Part 0). Web loaders read Supabase directly
    // with the service key, so the API's allowlist check is not enough on its own —
    // a non-allowlisted but otherwise-valid session must be signed out here.
    if (!isAllowedUser(user.email, env)) {
        await supabase.auth.signOut(); // emits Set-Cookie clears onto `headers`
        throw redirect("/auth/login?error=not_authorized", { headers });
    }
    return { user, headers };
}
