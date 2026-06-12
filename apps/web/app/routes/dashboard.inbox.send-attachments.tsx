import type { ActionFunctionArgs } from 'react-router';
import { apiFetch } from '~/lib/api';

/**
 * Send with attachments (Prompt 54A Part 3). Forwards the compose payload + inline
 * base64 attachments to the API, which builds multipart/mixed and sends now. These
 * send immediately (no +10s undo window) since attachment bytes aren't persisted.
 */
export async function action({ request, context }: ActionFunctionArgs) {
  const env = context.cloudflare.env;
  const payload = await request.json();

  const res = await apiFetch(request, env, '/email/send-with-attachments', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });
  const data = await res.json().catch(() => ({ error: 'Send failed' }));
  return Response.json(data, { status: res.ok ? 200 : res.status });
}
