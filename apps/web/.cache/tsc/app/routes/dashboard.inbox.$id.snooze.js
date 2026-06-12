import { apiFetch } from '~/lib/api';
// Routes through the API so snooze/unsnooze removes/re-adds the Gmail INBOX label
// and restores the original folder (ES-9), instead of touching Supabase only.
export async function action({ request, params, context }) {
    const { id } = params;
    const env = context.cloudflare.env;
    if (request.method === 'DELETE') {
        const res = await apiFetch(request, env, `/email/${id}/snooze`, { method: 'DELETE' });
        const data = await res.json().catch(() => ({ error: 'Unsnooze failed' }));
        return Response.json(data, { status: res.ok ? 200 : res.status });
    }
    const formData = await request.formData();
    const until = formData.get('until');
    const res = await apiFetch(request, env, `/email/${id}/snooze`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ until }),
    });
    const data = await res.json().catch(() => ({ error: 'Snooze failed' }));
    return Response.json(data, { status: res.ok ? 200 : res.status });
}
