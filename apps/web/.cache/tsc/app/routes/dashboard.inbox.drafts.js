import { apiFetch } from '~/lib/api';
const splitList = (v) => v ? v.split(',').map((s) => s.trim()).filter(Boolean) : [];
/**
 * Draft autosave target (EC-3). The ComposeModal posts here every 30s; previously
 * this route didn't exist and every save 404'd, losing the draft on close.
 *
 * Creates a draft on first save (no `id`) and PATCHes the same row thereafter, so
 * close-and-reopen can restore the body. Routes through the API worker's drafts
 * endpoints via the founder's JWT.
 */
export async function action({ request, context }) {
    const env = context.cloudflare.env;
    const form = await request.formData();
    const id = form.get('id') || '';
    const account_id = form.get('account_id');
    const reply_to_id = form.get('reply_to_id') || '';
    if (!account_id)
        return Response.json({ error: 'No account selected' }, { status: 400 });
    const payload = {
        account_id,
        to_emails: splitList(form.get('to_emails')),
        cc_emails: splitList(form.get('cc_emails')),
        subject: form.get('subject') ?? '',
        body_text: form.get('body') ?? '',
        status: 'draft',
    };
    if (reply_to_id)
        payload.reply_to_email_id = reply_to_id;
    const res = id
        ? await apiFetch(request, env, `/email/drafts/${id}`, {
            method: 'PATCH',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload),
        })
        : await apiFetch(request, env, '/email/drafts', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload),
        });
    if (!res.ok)
        return Response.json({ error: 'Failed to save draft' }, { status: 502 });
    const { draft } = (await res.json());
    return Response.json({ draft });
}
