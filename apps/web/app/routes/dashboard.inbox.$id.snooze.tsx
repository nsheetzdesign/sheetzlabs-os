import type { ActionFunctionArgs } from 'react-router';
import { getSupabaseClient } from '~/lib/supabase.server';

export async function action({ request, params, context }: ActionFunctionArgs) {
  const { id } = params;
  const env = context.cloudflare.env;
  const supabase = getSupabaseClient(env);

  if (request.method === 'DELETE') {
    await supabase
      .from('emails')
      .update({ snoozed_until: null, folder: 'INBOX' })
      .eq('id', id!);
    return Response.json({ success: true });
  }

  const formData = await request.formData();
  const until = formData.get('until') as string;

  await supabase
    .from('emails')
    .update({ snoozed_until: until, folder: 'SNOOZED' })
    .eq('id', id!);

  return Response.json({ success: true });
}
