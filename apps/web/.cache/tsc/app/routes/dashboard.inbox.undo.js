import { apiFetch } from '~/lib/api';
/**
 * Undo a reversible inbox action (Prompt 54A Part 1). The undo toast posts the
 * affected ids + original action so the inverse mutation replays precisely; the
 * `z` shortcut posts an empty body meaning "undo my most recent action". Both
 * route through the API's write-back-aware /email/undo so the reversal lands in
 * Gmail too.
 */
export async function action({ request, context }) {
    const env = context.cloudflare.env;
    const formData = await request.formData();
    const actionType = formData.get('action');
    const idsRaw = formData.get('email_ids');
    const email_ids = idsRaw ? JSON.parse(idsRaw) : undefined;
    const body = actionType && email_ids?.length ? JSON.stringify({ action: actionType, email_ids }) : JSON.stringify({});
    const res = await apiFetch(request, env, '/email/undo', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body,
    });
    const data = await res.json().catch(() => ({ error: 'Undo failed' }));
    return Response.json(data, { status: res.ok ? 200 : res.status });
}
