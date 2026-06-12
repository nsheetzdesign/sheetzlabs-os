import { apiFetch } from '~/lib/api';
const splitList = (v) => v ? v.split(',').map((s) => s.trim()).filter(Boolean) : [];
/**
 * Real send (EC-2). Routes through the API worker's send path — the one real
 * implementation — instead of inserting a fake "sent" draft row. Creates the
 * draft, then sends it; returns a structured result the ComposeModal reads so it
 * can keep itself open with an inline error on failure (no close-before-resolve).
 */
export async function action({ request, context }) {
    const env = context.cloudflare.env;
    const form = await request.formData();
    const account_id = form.get('account_id');
    const to_emails = splitList(form.get('to_emails'));
    const cc_emails = splitList(form.get('cc_emails'));
    const subject = form.get('subject') ?? '';
    const body = form.get('body') ?? '';
    const reply_to_id = form.get('reply_to_id') || '';
    const scheduled_for = form.get('scheduled_for') || '';
    const mode = form.get('action') || 'send';
    if (!account_id)
        return Response.json({ error: 'No account selected' }, { status: 400 });
    if (!to_emails.length)
        return Response.json({ error: 'Add at least one recipient' }, { status: 400 });
    const draftPayload = {
        account_id,
        to_emails,
        cc_emails,
        subject,
        body_text: body,
        status: 'draft',
    };
    if (reply_to_id)
        draftPayload.reply_to_email_id = reply_to_id;
    // Scheduled send is not yet wired to a cron (EC-4 → Prompt 54). Persist the draft
    // with its target time so it isn't lost, and tell the user it's queued.
    if (mode === 'schedule' && scheduled_for) {
        draftPayload.status = 'scheduled';
        draftPayload.scheduled_for = scheduled_for;
        const res = await apiFetch(request, env, '/email/drafts', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(draftPayload),
        });
        if (!res.ok)
            return Response.json({ error: 'Failed to schedule email' }, { status: 502 });
        return Response.json({ success: true, scheduled: true });
    }
    // 1. Create the draft.
    const createRes = await apiFetch(request, env, '/email/drafts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(draftPayload),
    });
    if (!createRes.ok) {
        return Response.json({ error: 'Could not create the message' }, { status: 502 });
    }
    const { draft } = (await createRes.json());
    if (!draft?.id) {
        return Response.json({ error: 'Could not create the message' }, { status: 502 });
    }
    // 2. Send it.
    const sendRes = await apiFetch(request, env, `/email/drafts/${draft.id}/send`, {
        method: 'POST',
    });
    if (!sendRes.ok) {
        const data = (await sendRes.json().catch(() => ({})));
        if (data.needs_reauth) {
            return Response.json({ error: 'This account needs to be reconnected before you can send.' }, { status: 409 });
        }
        return Response.json({ error: data.error ?? 'Failed to send. Please try again.' }, { status: 502 });
    }
    return Response.json({ success: true });
}
