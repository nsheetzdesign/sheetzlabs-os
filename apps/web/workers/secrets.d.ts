// Augment global Env with secrets set via `wrangler secret put`
// These are NOT in wrangler.toml (they're secrets, not plain vars)
interface Env {
  SUPABASE_URL: string;
  SUPABASE_ANON_KEY: string;
  // Product Supabase connections
  BOHP_SUPABASE_URL?: string;
  BOHP_SUPABASE_KEY?: string;
  TELOSI_SUPABASE_URL?: string;
  TELOSI_SUPABASE_KEY?: string;
  HOLIX_SUPABASE_URL?: string;
  HOLIX_SUPABASE_KEY?: string;
}
