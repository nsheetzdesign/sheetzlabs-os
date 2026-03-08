// Augment global Env with secrets set via `wrangler secret put`
// These are NOT in wrangler.toml (they're secrets, not plain vars)
interface Env {
  SUPABASE_URL: string;
  SUPABASE_ANON_KEY: string;
}
