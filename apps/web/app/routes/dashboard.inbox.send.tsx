import type { ActionFunctionArgs } from 'react-router';
import { apiFetch } from '~/lib/api';

const splitList = (v: string | null) =>
  v ? v.split(',').map((s) => s.trim()).filter(Boolean) : [];

/**
 * Real send (EC-2). Routes through the API worker's send path — the one real
 * implementation — instead of inserting a fake "sent" draft row. Creates the
 * draft, then sends it; returns a structured result the ComposeModal reads so it
 * can keep itself open with an inline error on failure (no close-before-resolve).
 */
export async function action({ request, context }: ActionFunctionArgs) {
  const env = context.cloudflare.env;
  const form = await request.formData();

  const account_id = form.get('account_id') as string;
  const to_emails = splitList(form.get('to_emails') as string | null);
  const cc_emails = splitList(form.get('cc_emails') as string | null);
  const subject = (form.get('subject') as string) ?? '';
  const body = (form.get('body') as string) ?? '';
  const reply_to_id = (form.get('reply_to_id') as string) || '';
  const send_at_input = (form.get('scheduled_for') as string) || '';
  const mode = (form.get('action') as string) || 'send';

  if (!account_id) return Response.json({ error: 'No account selected' }, { status: 400 });
  if (!to_emails.length) return Response.json({ error: 'Add at least one recipient' }, { status: 400 });

  // Undo-send (Prompt 54A Part 2): every send is persisted as a `scheduled` draft.
  // A normal send is scheduled 10s out so the user can undo; an explicit schedule
  // uses the chosen time. The every-minute cron claims due drafts and sends them
  // through the real send path — no separate "fake sent" insert.
  const UNDO_WINDOW_MS = 10_000;
  const send_at =
    mode === 'schedule' && send_at_input
      ? new Date(send_at_input).toISOString()
      : new Date(Date.now() + UNDO_WINDOW_MS).toISOString();

  const draftPayload: Record<string, unknown> = {
    account_id,
    to_emails,
    cc_emails,
    subject,
    body_text: body,
    status: 'scheduled',
    send_at,
    last_auto_saved_at: new Date().toISOString(),
  };
  if (reply_to_id) draftPayload.reply_to_email_id = reply_to_id;

  const res = await apiFetch(request, env, '/email/drafts', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(draftPayload),
  });
  if (!res.ok) {
    return Response.json({ error: 'Could not queue the message' }, { status: 502 });
  }
  const { draft } = (await res.json()) as { draft?: { id: string } };
  if (!draft?.id) {
    return Response.json({ error: 'Could not queue the message' }, { status: 502 });
  }

  if (mode === 'schedule' && send_at_input) {
    return Response.json({ success: true, scheduled: true, draftId: draft.id, sendAt: send_at });
  }
  // Normal send: client shows a 10s "Sending — Undo" affordance keyed on draftId.
  return Response.json({ success: true, undoable: true, draftId: draft.id, undoMs: UNDO_WINDOW_MS });
}
