/**
 * Service-role Supabase client for the e2e suite. Used ONLY for test scaffolding:
 * asserting persisted state (did the write-back land?), seeding the dedicated
 * booking link, and teardown sweeps. Tests never use it to fake UI state.
 */
import { createClient, type SupabaseClient } from "@supabase/supabase-js";
import { ENV } from "./env";

let _admin: SupabaseClient | null = null;

export function admin(): SupabaseClient {
  if (!_admin) {
    _admin = createClient(ENV.SUPABASE_URL, ENV.SUPABASE_SERVICE_ROLE_KEY, {
      auth: { autoRefreshToken: false, persistSession: false },
    });
  }
  return _admin;
}

/** The founder's Supabase auth user id — resolved once from the login email. */
let _userId: string | null = null;
export async function founderUserId(): Promise<string> {
  if (_userId) return _userId;
  const { data, error } = await admin().auth.admin.listUsers();
  if (error) throw new Error(`listUsers failed: ${error.message}`);
  const u = data.users.find((u) => u.email === ENV.TEST_USER_EMAIL);
  if (!u) throw new Error(`No Supabase user for ${ENV.TEST_USER_EMAIL}`);
  _userId = u.id;
  return _userId;
}
