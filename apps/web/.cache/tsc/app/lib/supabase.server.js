import { createClient } from "@supabase/supabase-js";
/**
 * Returns a Supabase client using the service role key, which bypasses RLS.
 *
 * This is safe to use in server-side loaders because:
 * 1. All dashboard routes are already protected by requireAuth in dashboard.tsx
 * 2. This is a single-tenant app — only the authenticated founder accesses data
 * 3. Service role key is never exposed to the client (server-only module)
 */
export function getSupabaseClient(env) {
    const key = env.SUPABASE_SERVICE_ROLE_KEY ?? env.SUPABASE_ANON_KEY;
    return createClient(env.SUPABASE_URL, key, {
        auth: {
            autoRefreshToken: false,
            persistSession: false,
        },
    });
}
