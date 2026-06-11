import { getSupabaseClient } from '~/lib/supabase.server';
import { apiFetch } from '~/lib/api';
export async function action({ request, context }) {
    const env = context.cloudflare.env;
    const supabase = getSupabaseClient(env);
    // Parse form data to check for special intents
    const formData = await request.formData().catch(() => new FormData());
    const intent = formData.get('intent');
    // Full sync for a specific account
    if (intent === 'full-sync') {
        const accountId = formData.get('accountId');
        if (!accountId) {
            return Response.json({ success: false, error: 'accountId required' }, { status: 400 });
        }
        try {
            const res = await apiFetch(request, env, `/email/accounts/${accountId}/full-sync`, {
                method: 'POST',
            });
            const data = await res.json();
            return Response.json(data);
        }
        catch (error) {
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
            const res = await apiFetch(request, env, `/email/accounts/${account.id}/sync`, {
                method: 'POST',
            });
            const data = await res.json();
            if (res.ok) {
                results.push({
                    accountId: account.id,
                    email: account.email,
                    success: true,
                    labelSync: data.labelSync,
                    emailSync: data.emailSync,
                });
            }
            else {
                results.push({
                    accountId: account.id,
                    email: account.email,
                    success: false,
                    error: data.error ?? 'Sync failed',
                });
            }
        }
        catch (error) {
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
