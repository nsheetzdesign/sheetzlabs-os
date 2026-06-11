import type { ActionFunctionArgs } from 'react-router';
import { apiFetch } from '~/lib/api';

/**
 * Bulk inbox actions now route through the API worker (Prompt 52A — ES-1), which
 * writes back to Gmail FIRST (messages.batchModify / trash) and only then updates
 * Supabase. The old direct-Supabase path never reached Gmail, so every action
 * silently reverted on the next sync.
 */
export async function action({ request, context }: ActionFunctionArgs) {
  const env = context.cloudflare.env;
  const formData = await request.formData();

  const actionType = formData.get('action') as string;
  const emailIds: string[] = JSON.parse((formData.get('email_ids') as string) || '[]');
  const labelId = formData.get('label_id') as string | null;

  if (!emailIds.length) {
    return Response.json({ error: 'No emails specified' }, { status: 400 });
  }

  const res = await apiFetch(request, env, '/email/bulk', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ action: actionType, email_ids: emailIds, label_id: labelId ?? undefined }),
  });

  const data = await res.json().catch(() => ({ error: 'Bulk action failed' }));
  return Response.json(data, { status: res.ok ? 200 : res.status });
}
