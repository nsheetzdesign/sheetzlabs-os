import type { ActionFunctionArgs } from 'react-router';
import { apiFetch } from '~/lib/api';

/**
 * Undo a send within the 10s window, or cancel a scheduled draft (Prompt 54A
 * Part 2). Flips the draft back to status='draft' — only succeeds if the cron
 * hasn't already claimed/sent it.
 */
export async function action({ request, context }: ActionFunctionArgs) {
  const env = context.cloudflare.env;
  const form = await request.formData();
  const draftId = form.get('draft_id') as string | null;
  if (!draftId) return Response.json({ error: 'draft_id required' }, { status: 400 });

  const res = await apiFetch(request, env, `/email/drafts/${draftId}/cancel-send`, {
    method: 'POST',
  });
  const data = await res.json().catch(() => ({ cancelled: false }));
  return Response.json(data, { status: res.ok ? 200 : res.status });
}
