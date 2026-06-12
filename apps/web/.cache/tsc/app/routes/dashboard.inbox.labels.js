import { apiFetch } from '~/lib/api';
/**
 * Create-label target for the InboxSidebar (EU-8). Previously posted to an
 * unregistered route (silent 404). Routes through the 52A Gmail-first
 * `POST /email/labels`, so the label is created in Gmail and applyable there.
 */
export async function action({ request, context }) {
    const env = context.cloudflare.env;
    const form = await request.formData();
    const account_id = form.get('account_id');
    const name = (form.get('name') ?? '').trim();
    if (!account_id || !name) {
        return Response.json({ error: 'Account and label name are required' }, { status: 400 });
    }
    const res = await apiFetch(request, env, '/email/labels', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ account_id, name }),
    });
    const data = (await res.json().catch(() => ({})));
    if (!res.ok) {
        return Response.json({ error: data.error ?? 'Failed to create label' }, { status: res.status });
    }
    return Response.json({ label: data.label });
}
