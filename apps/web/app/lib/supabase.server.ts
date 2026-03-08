import { createClient } from "@supabase/supabase-js";
import type { Database } from "@sheetzlabs/shared";

export function getSupabaseClient(env: {
  SUPABASE_URL: string;
  SUPABASE_ANON_KEY: string;
}) {
  return createClient<Database>(env.SUPABASE_URL, env.SUPABASE_ANON_KEY);
}
