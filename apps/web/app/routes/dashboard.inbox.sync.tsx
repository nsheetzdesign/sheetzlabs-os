import type { ActionFunctionArgs } from 'react-router';
import { json } from 'react-router';
import { getSupabaseClient } from '~/lib/supabase.server';

export async function action({ context }: ActionFunctionArgs) {
  const env = context.cloudflare.env as Record<string, string>;
  const supabase = getSupabaseClient(env as any);
  const apiUrl = env.INTERNAL_API_URL ?? 'https://api.sheetzlabs.com';

  const { data: accounts } = await supabase
    .from('email_accounts')
    .select('id, email')
    .eq('sync_enabled', true);

  const results = [];

  for (const account of accounts ?? []) {
    try {
      const res = await fetch(`${apiUrl}/email/accounts/${account.id}/sync`, {
        method: 'POST',
      });
      const data = await res.json() as Record<string, unknown>;
      results.push({ account: account.email, ...data, success: res.ok });
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : String(error);
      console.error(`[Sync] Error for ${account.email}:`, message);
      results.push({ account: account.email, error: message, success: false });
    }
  }

  return json({ results, synced_at: new Date().toISOString() });
}
