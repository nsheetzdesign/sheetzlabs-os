import { createServerClient, parseCookieHeader, serializeCookieHeader, } from "@supabase/ssr";
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
    return { user, headers };
}
