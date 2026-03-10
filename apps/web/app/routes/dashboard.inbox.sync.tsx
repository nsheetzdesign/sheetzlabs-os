import type { ActionFunctionArgs } from 'react-router';
import { getSupabaseClient } from '~/lib/supabase.server';

export async function action({ request, context }: ActionFunctionArgs) {
  const env = context.cloudflare.env as Record<string, string>;
  const supabase = getSupabaseClient(env as any);
  const apiUrl = env.INTERNAL_API_URL ?? 'https://api.sheetzlabs.com';

  // Parse form data to check for special intents
  const formData = await request.formData().catch(() => new FormData());
  const intent = formData.get('intent') as string | null;

  // Full sync for a specific account
  if (intent === 'full-sync') {
    const accountId = formData.get('accountId') as string;
    if (!accountId) {
      return Response.json({ success: false, error: 'accountId required' }, { status: 400 });
    }
    try {
      const res = await fetch(`${apiUrl}/email/accounts/${accountId}/full-sync`, {
        method: 'POST',
      });
      const data = await res.json();
      return Response.json(data);
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : String(error);
      return Response.json({ success: false, error: message }, { status: 500 });
    }
  }

  // Regular sync — all enabled accounts
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
      if (res.ok) {
        results.push({
          accountId: account.id,
          email: account.email,
          success: true,
          labelSync: data.labelSync as { total: number; system: number; user: number; userLabelNames: string[] } | undefined,
          emailSync: data.emailSync as { synced: number } | undefined,
        });
      } else {
        results.push({
          accountId: account.id,
          email: account.email,
          success: false,
          error: (data.error as string) ?? 'Sync failed',
        });
      }
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : String(error);
      console.error(`[Sync] Error for ${account.email}:`, message);
      results.push({ accountId: account.id, email: account.email, error: message, success: false });
    }
  }

  return Response.json({
    success: results.every(r => r.success),
    accounts: results.map(r => ({
      accountId: r.accountId,
      email: r.email,
      success: r.success,
      error: r.success ? null : (r.error || 'Unknown error'),
      labels: {
        total: r.labelSync?.total || 0,
        system: r.labelSync?.system || 0,
        user: r.labelSync?.user || 0,
        userLabelNames: r.labelSync?.userLabelNames || [],
      },
      emails: {
        synced: r.emailSync?.synced || 0,
      },
    })),
  });
}
