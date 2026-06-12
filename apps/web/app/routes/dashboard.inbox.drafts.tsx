import type { ActionFunctionArgs } from 'react-router';
import { apiFetch } from '~/lib/api';

const splitList = (v: string | null) =>
  v ? v.split(',').map((s) => s.trim()).filter(Boolean) : [];

/**
 * Draft autosave target (EC-3). The ComposeModal posts here every 30s; previously
 * this route didn't exist and every save 404'd, losing the draft on close.
 *
 * Creates a draft on first save (no `id`) and PATCHes the same row thereafter, so
 * close-and-reopen can restore the body. Routes through the API worker's drafts
 * endpoints via the founder's JWT.
 */
export async function action({ request, context }: ActionFunctionArgs) {
  const env = context.cloudflare.env;
  const form = await request.formData();

  const id = (form.get('id') as string) || '';
  const account_id = form.get('account_id') as string;
  const reply_to_id = (form.get('reply_to_id') as string) || '';

  if (!account_id) return Response.json({ error: 'No account selected' }, { status: 400 });

  const payload: Record<string, unknown> = {
    account_id,
    to_emails: splitList(form.get('to_emails') as string | null),
    cc_emails: splitList(form.get('cc_emails') as string | null),
    subject: (form.get('subject') as string) ?? '',
    body_text: (form.get('body') as string) ?? '',
    status: 'draft',
  };
  if (reply_to_id) payload.reply_to_email_id = reply_to_id;

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

  if (!res.ok) return Response.json({ error: 'Failed to save draft' }, { status: 502 });
  const { draft } = (await res.json()) as { draft?: { id: string } };
  return Response.json({ draft });
}
