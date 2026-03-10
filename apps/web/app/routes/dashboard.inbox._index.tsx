import { useState, useEffect } from 'react';
import { useLoaderData, useFetcher, useSearchParams, useNavigate, useRevalidator } from 'react-router';
import { RefreshCw } from 'lucide-react';
import type { LoaderFunctionArgs, MetaFunction } from 'react-router';
import { getSupabaseClient } from '~/lib/supabase.server';
import { InboxSidebar } from '~/components/inbox/InboxSidebar';
import { EmailList, type Email } from '~/components/inbox/EmailList';
import { EmailPreview, type PreviewEmail } from '~/components/inbox/EmailPreview';
import { ComposeModal } from '~/components/inbox/ComposeModal';
import { ThreadView } from '~/components/inbox/ThreadView';

export const meta: MetaFunction = () => [{ title: 'Inbox — Sheetz Labs OS' }];

export async function loader({ request, context }: LoaderFunctionArgs) {
  const env = context.cloudflare.env;
  const supabase = getSupabaseClient(env);
  const url = new URL(request.url);
  const folder = url.searchParams.get('folder') || 'inbox';
  const account_id = url.searchParams.get('account') || null;
  const label_id = url.searchParams.get('label');
  const search = url.searchParams.get('q');

  // Build emails query — all fields needed for list + preview
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  let query: any = supabase
    .from('emails')
    .select(`
      id, account_id, external_id, thread_id,
      subject, snippet,
      from_name, from_email, to_emails, cc_emails,
      body_text, body_html,
      received_at, folder,
      is_read, is_starred, is_archived, is_trashed, is_spam,
      snoozed_until, has_attachments, attachment_count,
      ai_summary, ai_category,
      email_label_assignments(label_id, email_labels(id, name, color))
    `)
    .order('received_at', { ascending: false })
    .limit(100);

  if (search) {
    query = query.or(`subject.ilike.%${search}%,from_email.ilike.%${search}%,snippet.ilike.%${search}%`);
  } else {
    if (folder === 'inbox') {
      query = query.eq('folder', 'INBOX').eq('is_archived', false).eq('is_trashed', false).eq('is_spam', false);
    } else if (folder === 'starred') {
      query = query.eq('is_starred', true).eq('is_trashed', false);
    } else if (folder === 'sent') {
      query = query.eq('folder', 'SENT');
    } else if (folder === 'spam') {
      query = query.eq('is_spam', true);
    } else if (folder === 'trash') {
      query = query.eq('is_trashed', true);
    } else if (folder === 'snoozed') {
      query = query.not('snoozed_until', 'is', null);
    } else if (folder === 'drafts') {
      query = query.eq('folder', 'DRAFTS');
    } else if (folder === 'all mail') {
      query = query.eq('is_trashed', false);
    }
  }

  // Only filter by account if a specific one is selected (null = All Inboxes)
  if (account_id) {
    query = query.eq('account_id', account_id);
  }

  const [{ data: emails, error: emailsError }, { data: accounts }] = await Promise.all([
    query,
    supabase.from('email_accounts').select('id, email').order('email'),
  ]);

  console.log('[Inbox] Query result:', {
    count: emails?.length,
    error: emailsError,
    folder,
    accountId: account_id,
    firstEmail: emails?.[0] ? {
      id: emails[0].id,
      subject: emails[0].subject,
      folder: emails[0].folder,
      hasBody: !!emails[0].body_text || !!emails[0].body_html,
    } : null,
  });

  const accountIds = (accounts ?? []).map(a => a.id);

  // Fetch labels for all accounts from DB
  const { data: labelsData } = accountIds.length
    ? await supabase
        .from('email_labels')
        .select('*')
        .in('account_id', accountIds)
        .order('sort_order')
    : { data: [] };

  // Group labels by account
  const labelsByAccount = (labelsData ?? []).reduce<Record<string, any[]>>((acc, label) => {
    if (!acc[label.account_id]) acc[label.account_id] = [];
    acc[label.account_id]!.push(label);
    return acc;
  }, {});

  // For any account with no labels, seed system labels one by one
  for (const account of accounts ?? []) {
    if (!labelsByAccount[account.id]?.length) {
      console.log(`[Inbox] Seeding labels for account ${account.email} (${account.id})...`);

      const systemLabels = [
        { name: 'Inbox', icon: 'Inbox', sort_order: 1 },
        { name: 'Starred', icon: 'Star', sort_order: 2 },
        { name: 'Snoozed', icon: 'Clock', sort_order: 3 },
        { name: 'Sent', icon: 'Send', sort_order: 4 },
        { name: 'Drafts', icon: 'File', sort_order: 5 },
        { name: 'Spam', icon: 'AlertTriangle', sort_order: 90 },
        { name: 'Trash', icon: 'Trash2', sort_order: 91 },
        { name: 'All Mail', icon: 'Mail', sort_order: 92 },
      ];

      const seededLabels: any[] = [];
      for (const label of systemLabels) {
        const { data: inserted, error: upsertError } = await supabase
          .from('email_labels')
          .upsert(
            {
              account_id: account.id,
              name: label.name,
              type: 'system',
              icon: label.icon,
              sort_order: label.sort_order,
            },
            { onConflict: 'account_id,name', ignoreDuplicates: false }
          )
          .select('*')
          .single();

        if (upsertError) {
          console.error(`[Inbox] Failed to upsert label ${label.name} for ${account.email}:`, upsertError.message);
        } else if (inserted) {
          seededLabels.push(inserted);
        }
      }

      labelsByAccount[account.id] = seededLabels.length > 0
        ? seededLabels
        : systemLabels.map(l => ({ ...l, account_id: account.id, type: 'system' }));
      console.log(`[Inbox] Seeded ${seededLabels.length} labels for ${account.email}`);
    }
  }

  // Build accounts with their real labels
  const accountsWithLabels = (accounts ?? []).map(account => ({
    id: account.id,
    email: account.email,
    labels: labelsByAccount[account.id] ?? [],
  }));

  // Global counts (across all accounts)
  const [
    { count: gInbox },
    { count: gStarred },
    { count: gSnoozed },
    { count: gSpam },
    { count: gTrash },
    { count: gDrafts },
  ] = await Promise.all([
    supabase.from('emails').select('id', { count: 'exact', head: true }).eq('folder', 'INBOX').eq('is_archived', false).eq('is_trashed', false).eq('is_read', false),
    supabase.from('emails').select('id', { count: 'exact', head: true }).eq('is_starred', true).eq('is_trashed', false),
    supabase.from('emails').select('id', { count: 'exact', head: true }).not('snoozed_until', 'is', null),
    supabase.from('emails').select('id', { count: 'exact', head: true }).eq('is_spam', true).eq('is_trashed', false),
    supabase.from('emails').select('id', { count: 'exact', head: true }).eq('is_trashed', true),
    supabase.from('email_drafts').select('id', { count: 'exact', head: true }).eq('status', 'draft'),
  ]);

  const globalCounts = {
    inbox: gInbox ?? 0,
    starred: gStarred ?? 0,
    snoozed: gSnoozed ?? 0,
    spam: gSpam ?? 0,
    trash: gTrash ?? 0,
    drafts: gDrafts ?? 0,
  };

  // Per-account counts (simple: just unread inbox for each)
  const counts: Record<string, { inbox: number; starred: number; snoozed: number; drafts: number; spam: number; trash: number }> = {};
  for (const account of accounts ?? []) {
    const accountEmails = (emails ?? []).filter(e => e.account_id === account.id);
    counts[account.id] = {
      inbox: accountEmails.filter(e => !e.is_read).length,
      starred: 0,
      snoozed: 0,
      drafts: 0,
      spam: 0,
      trash: 0,
    };
  }

  return {
    emails: (emails ?? []).map(e => ({
      ...e,
      has_attachments: e.has_attachments ?? false,
      // Flatten label assignments to array of label objects
      labels: (e.email_label_assignments ?? []).map((a: any) => a.email_labels).filter(Boolean),
    })),
    accounts: accountsWithLabels,
    counts,
    globalCounts,
    folder,
    accountId: account_id,
    labelId: label_id,
    search,
  };
}

export default function Inbox() {
  const { emails, accounts, counts, globalCounts, folder, accountId, labelId, search } = useLoaderData<typeof loader>();
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();
  const fetcher = useFetcher();
  const revalidator = useRevalidator();
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
  const [activeEmail, setActiveEmail] = useState<PreviewEmail | null>(null);
  const [focusIndex, setFocusIndex] = useState(0);
  const [draggedEmailIds, setDraggedEmailIds] = useState<string[]>([]);
  const [showCompose, setShowCompose] = useState(false);
  const [composeProps, setComposeProps] = useState<{
    replyTo?: any;
    replyAll?: boolean;
    forward?: boolean;
  } | null>(null);
  const [threadEmails, setThreadEmails] = useState<any[] | null>(null);

  // Handle URL params for compose (reply/forward links)
  useEffect(() => {
    const replyId = searchParams.get('reply');
    const forwardId = searchParams.get('forward');
    const replyAll = searchParams.get('all') === 'true';

    if (replyId || forwardId) {
      const email = emails.find((e: any) => e.id === (replyId || forwardId));
      if (email) {
        setComposeProps({
          replyTo: email,
          replyAll,
          forward: !!forwardId,
        });
        setShowCompose(true);
      }
    }
  }, [searchParams, emails]);

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
            handleOpenEmail(emails[focusIndex] as PreviewEmail);
          }
          break;
        case 'u':
          e.preventDefault();
          setActiveEmail(null);
          setThreadEmails(null);
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
        case 'c':
          e.preventDefault();
          setShowCompose(true);
          setComposeProps(null);
          break;
        case 'r':
          e.preventDefault();
          if (activeEmail) {
            setComposeProps({ replyTo: activeEmail });
            setShowCompose(true);
          }
          break;
        case 'Escape':
          setActiveEmail(null);
          setThreadEmails(null);
          setSelectedIds(new Set());
          break;
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [emails, focusIndex, activeEmail]);

  const handleRefresh = async () => {
    setIsRefreshing(true);
    try {
      await fetch('/dashboard/inbox/sync', { method: 'POST' });
      revalidator.revalidate();
    } catch (error) {
      console.error('[Inbox] Sync failed:', error);
    } finally {
      setIsRefreshing(false);
    }
  };

  // Auto-sync on window focus
  useEffect(() => {
    const onFocus = async () => {
      try {
        await fetch('/dashboard/inbox/sync', { method: 'POST' });
        revalidator.revalidate();
      } catch {
        // ignore focus sync errors
      }
    };
    window.addEventListener('focus', onFocus);
    return () => window.removeEventListener('focus', onFocus);
  }, []);

  // Polling sync every 3 minutes
  useEffect(() => {
    const interval = setInterval(async () => {
      try {
        await fetch('/dashboard/inbox/sync', { method: 'POST' });
        revalidator.revalidate();
      } catch {
        // ignore interval sync errors
      }
    }, 3 * 60 * 1000);
    return () => clearInterval(interval);
  }, []);

  const handleOpenEmail = async (email: PreviewEmail) => {
    setActiveEmail(email);
    markAsRead(email.id);

    if (email.thread_id) {
      try {
        const res = await fetch(`/api/email/thread/${email.thread_id}`);
        if (res.ok) {
          const { thread } = await res.json() as { thread: any[] };
          if (thread && thread.length > 1) {
            setThreadEmails(thread);
            return;
          }
        }
      } catch {
        // Thread load failed — fall back to single email view
      }
    }
    setThreadEmails(null);
  };

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

  const handleFolderSelect = (newFolder: string, newAccountId?: string | null) => {
    const params = new URLSearchParams();
    params.set('folder', newFolder);
    if (newAccountId) params.set('account', newAccountId);
    setSearchParams(params);
    setActiveEmail(null);
    setThreadEmails(null);
    setSelectedIds(new Set());
  };

  const handleLabelSelect = (lid: string, aid: string) => {
    const params = new URLSearchParams();
    params.set('label', lid);
    params.set('account', aid);
    setSearchParams(params);
    setActiveEmail(null);
    setThreadEmails(null);
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

  const closeCompose = () => {
    setShowCompose(false);
    setComposeProps(null);
    const params = new URLSearchParams(searchParams);
    params.delete('reply');
    params.delete('forward');
    params.delete('all');
    setSearchParams(params);
  };

  return (
    <div className="flex h-full">
      <InboxSidebar
        accounts={accounts}
        counts={counts}
        globalCounts={globalCounts}
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
          <div className="p-3 border-b border-zinc-800 flex gap-2">
            <form onSubmit={handleSearch} className="flex-1">
              <input
                id="inbox-search"
                type="text"
                name="q"
                defaultValue={search || ''}
                placeholder="Search emails..."
                className="w-full bg-zinc-800 border border-zinc-700 rounded-lg px-4 py-2 text-sm focus:outline-none focus:border-emerald-500"
              />
            </form>
            <button
              onClick={handleRefresh}
              disabled={isRefreshing || revalidator.state === 'loading'}
              title="Sync emails"
              className="flex items-center gap-1.5 px-3 py-1.5 text-sm text-zinc-400 hover:text-white hover:bg-zinc-800 rounded disabled:opacity-50 transition-colors"
            >
              <RefreshCw
                size={14}
                className={isRefreshing || revalidator.state === 'loading' ? 'animate-spin' : ''}
              />
            </button>
          </div>
          <EmailList
            emails={emails as Email[]}
            selectedIds={selectedIds}
            activeEmailId={activeEmail?.id ?? null}
            onSelect={toggleSelect}
            onSelectAll={() => setSelectedIds(new Set(emails.map(e => e.id)))}
            onClearSelection={() => setSelectedIds(new Set())}
            onOpen={(email) => handleOpenEmail(email as PreviewEmail)}
            onDragStart={handleDragStart}
          />
        </div>

        {/* Preview / Thread Pane */}
        <div className={`${activeEmail ? 'flex-1' : 'hidden md:flex md:flex-1'}`}>
          {threadEmails && threadEmails.length > 1 ? (
            <ThreadView
              emails={threadEmails}
              onReply={(email) => {
                setComposeProps({ replyTo: email });
                setShowCompose(true);
              }}
              onReplyAll={(email) => {
                setComposeProps({ replyTo: email, replyAll: true });
                setShowCompose(true);
              }}
              onForward={(email) => {
                setComposeProps({ replyTo: email, forward: true });
                setShowCompose(true);
              }}
              onClose={() => {
                setActiveEmail(null);
                setThreadEmails(null);
              }}
            />
          ) : (
            <EmailPreview
              email={activeEmail}
              onClose={() => {
                setActiveEmail(null);
                setThreadEmails(null);
              }}
              onReply={() => {
                setComposeProps({ replyTo: activeEmail });
                setShowCompose(true);
              }}
              onReplyAll={() => {
                setComposeProps({ replyTo: activeEmail, replyAll: true });
                setShowCompose(true);
              }}
              onForward={() => {
                setComposeProps({ replyTo: activeEmail, forward: true });
                setShowCompose(true);
              }}
            />
          )}
        </div>
      </div>

      <ComposeModal
        isOpen={showCompose}
        onClose={closeCompose}
        replyTo={composeProps?.replyTo}
        replyAll={composeProps?.replyAll}
        forward={composeProps?.forward}
        accountId={accounts[0]?.id || ''}
        accountEmail={accounts[0]?.email || ''}
      />
    </div>
  );
}
