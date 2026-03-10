import type { ActionFunctionArgs } from 'react-router';
import { getSupabaseClient } from '~/lib/supabase.server';

export async function action({ request, context }: ActionFunctionArgs) {
  const env = context.cloudflare.env;
  const supabase = getSupabaseClient(env);
  const formData = await request.formData();

  const account_id = formData.get('account_id') as string;
  const to_emails = formData.get('to_emails') as string;
  const cc_emails = formData.get('cc_emails') as string;
  const bcc_emails = formData.get('bcc_emails') as string;
  const subject = formData.get('subject') as string;
  const body = formData.get('body') as string;
  const scheduled_for = formData.get('scheduled_for') as string;

  const { data: account } = await supabase
    .from('email_accounts')
    .select('id')
    .eq('id', account_id)
    .single();

  if (!account) {
    return Response.json({ error: 'Account not found' }, { status: 404 });
  }

  // TODO: Implement actual Gmail API send
  // For now, record in email_drafts with sent/scheduled status
  const { data: draft } = await supabase
    .from('email_drafts')
    .insert({
      account_id,
      to_emails: to_emails ? to_emails.split(',').map((s: string) => s.trim()).filter(Boolean) : [],
      cc_emails: cc_emails ? cc_emails.split(',').map((s: string) => s.trim()).filter(Boolean) : [],
      subject,
      body_text: body,
      status: scheduled_for ? 'scheduled' : 'sent',
      scheduled_for: scheduled_for || null,
    })
    .select()
    .single();

  return Response.json({ success: true, draft });
}
