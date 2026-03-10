import type { ActionFunctionArgs } from 'react-router';
import { getSupabaseClient } from '~/lib/supabase.server';

export async function action({ request, context }: ActionFunctionArgs) {
  const env = context.cloudflare.env;
  const supabase = getSupabaseClient(env);
  const formData = await request.formData();

  const actionType = formData.get('action') as string;
  const emailIds: string[] = JSON.parse((formData.get('email_ids') as string) || '[]');
  const labelId = formData.get('label_id') as string | null;

  if (!emailIds.length) {
    return Response.json({ error: 'No emails specified' }, { status: 400 });
  }

  switch (actionType) {
    case 'archive':
      await supabase
        .from('emails')
        .update({ is_archived: true, folder: 'ARCHIVE' })
        .in('id', emailIds);
      break;
    case 'unarchive':
      await supabase
        .from('emails')
        .update({ is_archived: false, folder: 'INBOX' })
        .in('id', emailIds);
      break;
    case 'trash':
      await supabase
        .from('emails')
        .update({ is_trashed: true, folder: 'TRASH' })
        .in('id', emailIds);
      break;
    case 'spam':
      await supabase
        .from('emails')
        .update({ is_spam: true, folder: 'SPAM' })
        .in('id', emailIds);
      break;
    case 'read':
      await supabase
        .from('emails')
        .update({ is_read: true })
        .in('id', emailIds);
      break;
    case 'unread':
      await supabase
        .from('emails')
        .update({ is_read: false })
        .in('id', emailIds);
      break;
    case 'star':
      await supabase
        .from('emails')
        .update({ is_starred: true })
        .in('id', emailIds);
      break;
    case 'unstar':
      await supabase
        .from('emails')
        .update({ is_starred: false })
        .in('id', emailIds);
      break;
    case 'add_label':
      if (labelId) {
        for (const emailId of emailIds) {
          await supabase
            .from('email_label_assignments')
            .upsert({ email_id: emailId, label_id: labelId });
        }
      }
      break;
    case 'remove_label':
      if (labelId) {
        await supabase
          .from('email_label_assignments')
          .delete()
          .in('email_id', emailIds)
          .eq('label_id', labelId);
      }
      break;
  }

  return Response.json({ success: true });
}
