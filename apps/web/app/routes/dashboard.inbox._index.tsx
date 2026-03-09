import { useState, useEffect } from 'react';
import { useLoaderData, useFetcher, useSearchParams, useNavigate } from 'react-router';
import type { LoaderFunctionArgs, MetaFunction } from 'react-router';
import { getSupabaseClient } from '~/lib/supabase.server';
import { InboxSidebar } from '~/components/inbox/InboxSidebar';
import { EmailList, type Email } from '~/components/inbox/EmailList';
import { EmailPreview, type PreviewEmail } from '~/components/inbox/EmailPreview';

export const meta: MetaFunction = () => [{ title: 'Inbox — Sheetz Labs OS' }];

const SYSTEM_LABELS = [
  { id: 'sys-inbox', name: 'Inbox', icon: 'Inbox', color: '#71717a', type: 'system' as const },
  { id: 'sys-starred', name: 'Starred', icon: 'Star', color: '#71717a', type: 'system' as const },
  { id: 'sys-snoozed', name: 'Snoozed', icon: 'Clock', color: '#71717a', type: 'system' as const },
  { id: 'sys-sent', name: 'Sent', icon: 'Send', color: '#71717a', type: 'system' as const },
  { id: 'sys-drafts', name: 'Drafts', icon: 'File', color: '#71717a', type: 'system' as const },
  { id: 'sys-spam', name: 'Spam', icon: 'AlertTriangle', color: '#71717a', type: 'system' as const },
  { id: 'sys-trash', name: 'Trash', icon: 'Trash2', color: '#71717a', type: 'system' as const },
];

export async function loader({ request, context }: LoaderFunctionArgs) {
  const env = context.cloudflare.env;
  const supabase = getSupabaseClient(env);
  const url = new URL(request.url);
  const folder = url.searchParams.get('folder') || 'inbox';
  const account_id = url.searchParams.get('account');
  const label_id = url.searchParams.get('label');
  const search = url.searchParams.get('q');

  // Build emails query
  let query = supabase
    .from('emails')
    .select('id, subject, snippet, from_email, from_name, is_read, is_starred, received_at, thread_id')
    .order('received_at', { ascending: false })
    .limit(50);

  if (search) {
    query = query.or(`subject.ilike.%${search}%,from_email.ilike.%${search}%,snippet.ilike.%${search}%`);
  } else {
    if (folder === 'inbox') {
      query = query.eq('is_archived', false).eq('is_trashed', false).eq('is_spam', false);
    } else if (folder === 'starred') {
      query = query.eq('is_starred', true).eq('is_trashed', false);
    } else if (folder === 'sent') {
      query = query.eq('folder', 'SENT');
    } else if (folder === 'spam') {
      query = query.eq('is_spam', true);
    } else if (folder === 'trash') {
      query = query.eq('is_trashed', true);
    }
  }

  if (account_id) {
    query = query.eq('account_id', account_id);
  }

  const [{ data: emails }, { data: accounts }] = await Promise.all([
    query,
    supabase.from('email_accounts').select('id, email').order('email'),
  ]);

  // Build counts from current emails (simplified — unread in inbox)
  const allEmails = emails ?? [];
  const unreadInbox = allEmails.filter(e => !e.is_read).length;

  // Build accounts with system labels
  const accountsWithLabels = (accounts ?? []).map(account => ({
    id: account.id,
    email: account.email,
    labels: SYSTEM_LABELS,
  }));

  // Build counts per account (use first account's data for now)
  const counts: Record<string, { inbox: number; starred: number; snoozed: number; drafts: number; spam: number; trash: number }> = {};
  for (const account of accounts ?? []) {
    counts[account.id] = {
      inbox: unreadInbox,
      starred: 0,
      snoozed: 0,
      drafts: 0,
      spam: 0,
      trash: 0,
    };
  }

  return {
    emails: allEmails.map(e => ({
      ...e,
      has_attachments: false,
      labels: [],
    })),
    accounts: accountsWithLabels,
    counts,
    folder,
    accountId: account_id,
    labelId: label_id,
    search,
  };
}

export default function Inbox() {
  const { emails, accounts, counts, folder, accountId, labelId, search } = useLoaderData<typeof loader>();
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();
  const fetcher = useFetcher();
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
  const [activeEmail, setActiveEmail] = useState<PreviewEmail | null>(null);
  const [focusIndex, setFocusIndex] = useState(0);
  const [draggedEmailIds, setDraggedEmailIds] = useState<string[]>([]);

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      const tag = (e.target as HTMLElement).tagName;
      if (tag === 'INPUT' || tag === 'TEXTAREA') return;

      switch (e.key) {
        case 'j':
          e.preventDefault();
          setFocusIndex(i => Math.min(i + 1, emails.length - 1));
          break;
        case 'k':
          e.preventDefault();
          setFocusIndex(i => Math.max(i - 1, 0));
          break;
        case 'o':
        case 'Enter':
          e.preventDefault();
          if (emails[focusIndex]) {
            setActiveEmail(emails[focusIndex] as PreviewEmail);
            markAsRead(emails[focusIndex].id);
          }
          break;
        case 'u':
          e.preventDefault();
          setActiveEmail(null);
          break;
        case 'e':
          e.preventDefault();
          handleBulkAction('archive');
          break;
        case '#':
          e.preventDefault();
          handleBulkAction('trash');
          break;
        case 's':
          e.preventDefault();
          if (emails[focusIndex]) {
            handleBulkAction(emails[focusIndex].is_starred ? 'unstar' : 'star');
          }
          break;
        case 'x':
          e.preventDefault();
          if (emails[focusIndex]) toggleSelect(emails[focusIndex].id);
          break;
        case '/':
          e.preventDefault();
          document.getElementById('inbox-search')?.focus();
          break;
        case 'Escape':
          setActiveEmail(null);
          setSelectedIds(new Set());
          break;
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [emails, focusIndex]);

  // Auto-sync on window focus
  useEffect(() => {
    const onFocus = () => {
      fetcher.submit({}, { method: 'post', action: '/dashboard/inbox/sync' });
    };
    window.addEventListener('focus', onFocus);
    return () => window.removeEventListener('focus', onFocus);
  }, []);

  // Polling sync every 3 minutes
  useEffect(() => {
    const interval = setInterval(() => {
      fetcher.submit({}, { method: 'post', action: '/dashboard/inbox/sync' });
    }, 3 * 60 * 1000);
    return () => clearInterval(interval);
  }, []);

  const toggleSelect = (id: string) => {
    setSelectedIds(prev => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const handleBulkAction = (action: string) => {
    const ids = selectedIds.size > 0
      ? Array.from(selectedIds)
      : emails[focusIndex] ? [emails[focusIndex].id] : [];
    if (ids.length === 0) return;
    fetcher.submit(
      { action, email_ids: JSON.stringify(ids) },
      { method: 'post', action: '/dashboard/inbox/bulk' }
    );
    setSelectedIds(new Set());
  };

  const markAsRead = (id: string) => {
    fetcher.submit(
      { action: 'read', email_ids: JSON.stringify([id]) },
      { method: 'post', action: '/dashboard/inbox/bulk' }
    );
  };

  const handleFolderSelect = (newFolder: string, newAccountId?: string) => {
    const params = new URLSearchParams();
    params.set('folder', newFolder);
    if (newAccountId) params.set('account', newAccountId);
    setSearchParams(params);
    setActiveEmail(null);
    setSelectedIds(new Set());
  };

  const handleLabelSelect = (lid: string, aid: string) => {
    const params = new URLSearchParams();
    params.set('label', lid);
    params.set('account', aid);
    setSearchParams(params);
    setActiveEmail(null);
  };

  const handleDragStart = (_e: React.DragEvent, emailIds: string[]) => {
    setDraggedEmailIds(emailIds);
  };

  const handleDragOver = (e: React.DragEvent, _target: { type: string; id: string; accountId: string }) => {
    e.preventDefault();
  };

  const handleDrop = (e: React.DragEvent, target: { type: string; id: string; accountId: string }) => {
    e.preventDefault();
    if (draggedEmailIds.length === 0) return;
    if (target.type === 'folder') {
      const actionMap: Record<string, string> = {
        Trash: 'trash',
        Spam: 'spam',
        Inbox: 'unarchive',
        'All Mail': 'archive',
      };
      const action = actionMap[target.id];
      if (action) {
        fetcher.submit(
          { action, email_ids: JSON.stringify(draggedEmailIds) },
          { method: 'post', action: '/dashboard/inbox/bulk' }
        );
      }
    } else if (target.type === 'label') {
      fetcher.submit(
        { action: 'add_label', email_ids: JSON.stringify(draggedEmailIds), label_id: target.id },
        { method: 'post', action: '/dashboard/inbox/bulk' }
      );
    }
    setDraggedEmailIds([]);
  };

  const handleSearch = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const q = formData.get('q') as string;
    setSearchParams(q ? { q } : { folder: 'inbox' });
  };

  return (
    <div className="flex h-full">
      <InboxSidebar
        accounts={accounts}
        counts={counts}
        activeFolder={folder}
        activeAccountId={accountId}
        activeLabel={labelId}
        onSelectFolder={handleFolderSelect}
        onSelectLabel={handleLabelSelect}
        onDragOver={handleDragOver}
        onDrop={handleDrop}
      />

      <div className="flex-1 flex overflow-hidden">
        {/* Email List */}
        <div className={`${activeEmail ? 'hidden md:flex md:w-96' : 'flex-1'} flex-col border-r border-zinc-800`}>
          {/* Search Bar */}
          <form onSubmit={handleSearch} className="p-3 border-b border-zinc-800">
            <input
              id="inbox-search"
              type="text"
              name="q"
              defaultValue={search || ''}
              placeholder="Search emails..."
              className="w-full bg-zinc-800 border border-zinc-700 rounded-lg px-4 py-2 text-sm focus:outline-none focus:border-emerald-500"
            />
          </form>
          <EmailList
            emails={emails as Email[]}
            selectedIds={selectedIds}
            activeEmailId={activeEmail?.id ?? null}
            onSelect={toggleSelect}
            onSelectAll={() => setSelectedIds(new Set(emails.map(e => e.id)))}
            onClearSelection={() => setSelectedIds(new Set())}
            onOpen={(email) => {
              setActiveEmail(email as PreviewEmail);
              markAsRead(email.id);
            }}
            onDragStart={handleDragStart}
          />
        </div>

        {/* Preview Pane */}
        <div className={`${activeEmail ? 'flex-1' : 'hidden md:flex md:flex-1'}`}>
          <EmailPreview
            email={activeEmail}
            onClose={() => setActiveEmail(null)}
            onReply={() => navigate(`/dashboard/inbox/compose?reply_to=${activeEmail?.id}`)}
            onReplyAll={() => navigate(`/dashboard/inbox/compose?reply_to=${activeEmail?.id}&all=true`)}
            onForward={() => navigate(`/dashboard/inbox/compose?forward=${activeEmail?.id}`)}
          />
        </div>
      </div>
    </div>
  );
}
