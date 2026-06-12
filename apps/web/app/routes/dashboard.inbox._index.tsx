import { useState, useEffect, useMemo, useCallback, useRef } from 'react';
import { useLoaderData, useFetcher, useSearchParams, useNavigate, useNavigation, useRevalidator, Form } from 'react-router';
import { RefreshCw, Inbox as InboxIcon, Star, Mail, Bell, AlertTriangle, X } from 'lucide-react';
import type { LoaderFunctionArgs, MetaFunction } from 'react-router';
import { getSupabaseClient } from '~/lib/supabase.server';
import { apiFetch } from '~/lib/api';
import { InboxSidebar } from '~/components/inbox/InboxSidebar';
import { EmailList, type Email } from '~/components/inbox/EmailList';
import { EmailPreview, type PreviewEmail } from '~/components/inbox/EmailPreview';
import { ComposeModal } from '~/components/inbox/ComposeModal';
import { ThreadView } from '~/components/inbox/ThreadView';
import { KeyboardShortcutsHelp } from '~/components/email/KeyboardShortcutsHelp';
import { useToasts, ToastContainer } from '~/components/ui/Toast';
import { EmailListSkeleton } from '~/components/ui/Skeleton';
import { useEmailKeyboardShortcuts } from '~/hooks/useEmailKeyboardShortcuts';
import { useEmailPolling } from '~/hooks/useEmailPolling';

// Human-readable past-tense labels for the undo toast, keyed by action.
const UNDO_LABELS: Record<string, string> = {
  archive: 'Archived',
  trash: 'Trashed',
  spam: 'Marked as spam',
  snooze: 'Snoozed',
};

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
      triage_category,
      email_label_assignments(label_id, email_labels(id, name, color)),
      email_attachments(id, filename, mime_type, size_bytes, gmail_attachment_id, content_id, is_inline)
    `)
    .eq('is_deleted', false)
    .order('received_at', { ascending: false })
    .limit(100);

  // NOTE: search is NOT handled here — it routes through the API's /email/search
  // (operator-aware, injection-safe, indexed). See the search branch below (EU-6).
  if (!search) {
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

  // Search routes through the API's operator-aware, injection-safe /email/search
  // (EU-6). Folder browsing stays on the direct Supabase query.
  const accountsPromise = supabase
    .from('email_accounts')
    .select('id, email, needs_reauth')
    .order('email');

  let emails: any[] | null = null;
  let emailsError: { message: string } | null = null;
  let accounts: { id: string; email: string; needs_reauth?: boolean }[] | null = null;

  if (search) {
    const params = new URLSearchParams({ q: search });
    if (account_id) params.set('account_id', account_id);
    const [searchRes, accountsRes] = await Promise.all([
      apiFetch(request, env, `/email/search?${params.toString()}`),
      accountsPromise,
    ]);
    accounts = accountsRes.data;
    if (searchRes.ok) {
      const data = (await searchRes.json()) as { emails?: any[] };
      emails = data.emails ?? [];
    } else {
      emails = [];
      emailsError = { message: `search failed (${searchRes.status})` };
    }
  } else {
    const [emailsRes, accountsRes] = await Promise.all([query, accountsPromise]);
    emails = emailsRes.data;
    emailsError = emailsRes.error;
    accounts = accountsRes.data;
  }

  if (emailsError) console.error('[Inbox] emails query failed:', emailsError.message);

  // Accounts flagged for reconnection drive the reconnect banner (ES-3 Part 1).
  const reauthAccounts = (accounts ?? []).filter(a => a.needs_reauth).map(a => ({ id: a.id, email: a.email }));

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

  // Labels come from Gmail sync (syncLabelsForAccount) — the old per-request
  // seeding loop + console logging is gone (Prompt 54A Part 7, XC-6).

  // Build accounts with their real labels
  const accountsWithLabels = (accounts ?? []).map(account => ({
    id: account.id,
    email: account.email,
    labels: labelsByAccount[account.id] ?? [],
  }));

  // Counts in two RPCs (global totals + per-account rows) — both indexed, both
  // exclude deleted; snoozed excludes expired (Prompt 54A Part 6, EU-7).
  type CountRow = { inbox: number; starred: number; snoozed: number; drafts: number; spam: number; trash: number };
  const [globalRes, perAccountRes] = await Promise.all([
    supabase.rpc('get_email_counts', { p_account_id: null }).single<CountRow>(),
    supabase.rpc('get_email_counts_by_account'),
  ]);
  if (globalRes.error) console.error('[Inbox] get_email_counts failed:', globalRes.error.message);
  if (perAccountRes.error) console.error('[Inbox] get_email_counts_by_account failed:', perAccountRes.error.message);

  const countsRow = globalRes.data;
  const globalCounts = {
    inbox: Number(countsRow?.inbox ?? 0),
    starred: Number(countsRow?.starred ?? 0),
    snoozed: Number(countsRow?.snoozed ?? 0),
    spam: Number(countsRow?.spam ?? 0),
    trash: Number(countsRow?.trash ?? 0),
    drafts: Number(countsRow?.drafts ?? 0),
  };

  // Real per-account folder counts (the visible-page hack + hardcoded zeros die).
  const counts: Record<string, CountRow> = {};
  for (const row of (perAccountRes.data ?? []) as Array<CountRow & { account_id: string }>) {
    counts[row.account_id] = {
      inbox: Number(row.inbox ?? 0),
      starred: Number(row.starred ?? 0),
      snoozed: Number(row.snoozed ?? 0),
      drafts: Number(row.drafts ?? 0),
      spam: Number(row.spam ?? 0),
      trash: Number(row.trash ?? 0),
    };
  }

  // Scheduled sends (Prompt 54B Part 0.1) live in `email_drafts`, NOT the `emails`
  // table the Drafts folder reads — so they were invisible and uncancellable once
  // the undo toast expired. Surface them with their send time + a Cancel action.
  let scheduledDrafts: Array<{ id: string; subject: string | null; to_emails: unknown; send_at: string | null }> = [];
  if (!search && folder === 'drafts') {
    let dq: any = supabase
      .from('email_drafts')
      .select('id, subject, to_emails, send_at, account_id')
      .eq('status', 'scheduled')
      .not('send_at', 'is', null)
      .order('send_at', { ascending: true });
    if (account_id) dq = dq.eq('account_id', account_id);
    const { data: sd } = await dq;
    scheduledDrafts = (sd ?? []) as any;
  }

  return {
    scheduledDrafts,
    emails: (emails ?? []).map(e => ({
      ...e,
      has_attachments: e.has_attachments ?? false,
      triage_category: e.triage_category ?? 'other',
      // Flatten label assignments to array of label objects
      labels: (e.email_label_assignments ?? []).map((a: any) => a.email_labels).filter(Boolean),
      // Non-inline attachments surface as chips; inline ones resolve cid: images.
      attachments: e.email_attachments ?? [],
    })),
    accounts: accountsWithLabels,
    reauthAccounts,
    counts,
    globalCounts,
    folder,
    accountId: account_id,
    labelId: label_id,
    search,
  };
}

const TRIAGE_TABS = [
  { id: 'all',          label: 'All',           Icon: InboxIcon },
  { id: 'important',   label: 'Important',     Icon: Star },
  { id: 'other',       label: 'Other',         Icon: Mail },
  { id: 'newsletter',  label: 'Newsletters',   Icon: Mail },
  { id: 'notification',label: 'Notifications', Icon: Bell },
] as const;

export default function Inbox() {
  const { emails, scheduledDrafts, accounts, reauthAccounts, counts, globalCounts, folder, accountId, labelId, search } = useLoaderData<typeof loader>();
  const cancelSendFetcher = useFetcher();
  const navigation = useNavigation();
  // Skeleton while navigating between folders/searches (Part 0.4).
  const listLoading = navigation.state === 'loading' && (navigation.location?.pathname ?? '') === '/dashboard/inbox';
  const [dismissedReauth, setDismissedReauth] = useState<Set<string>>(new Set());
  const visibleReauth = reauthAccounts.filter(a => !dismissedReauth.has(a.id));
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();
  // Dedicated fetchers per concern (Part 1) — a single shared fetcher lets a
  // concurrent submission (e.g. mark-read on open) cancel an in-flight archive.
  const actionFetcher = useFetcher();
  const readFetcher = useFetcher();
  const undoFetcher = useFetcher();
  const revalidator = useRevalidator();
  const { toasts, push: pushToast, dismiss: dismissToast } = useToasts();
  // Optimistic removal: ids hidden from the list the instant an action fires, kept
  // hidden until the revalidated loader confirms they're actually gone. On failure
  // they're un-hidden + an error toast is shown.
  const [pendingRemoved, setPendingRemoved] = useState<Set<string>>(new Set());
  const lastActionRef = useRef<{ action: string; ids: string[] } | null>(null);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
  const [activeEmail, setActiveEmail] = useState<PreviewEmail | null>(null);
  const [focusIndex, setFocusIndex] = useState(0);
  const [draggedEmailIds, setDraggedEmailIds] = useState<string[]>([]);
  const [showCompose, setShowCompose] = useState(false);
  const [showShortcutsHelp, setShowShortcutsHelp] = useState(false);
  const [triageFilter, setTriageFilter] = useState<string>('all');
  const [composeProps, setComposeProps] = useState<{
    replyTo?: any;
    replyAll?: boolean;
    forward?: boolean;
  } | null>(null);
  const [threadEmails, setThreadEmails] = useState<any[] | null>(null);
  const searchDebounce = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Triage filtering
  const filteredEmails = useMemo(() => {
    if (triageFilter === 'all') return emails;
    return emails.filter((e: any) => (e.triage_category ?? 'other') === triageFilter);
  }, [emails, triageFilter]);

  // What the list actually renders: triage-filtered minus the optimistically removed.
  const visibleEmails = useMemo(
    () => (filteredEmails as any[]).filter((e) => !pendingRemoved.has(e.id)),
    [filteredEmails, pendingRemoved],
  );

  // Prune the optimistic set once the loader has genuinely dropped an id (no flash:
  // the id stays hidden while still in `emails`, and leaves the set only once gone).
  useEffect(() => {
    const present = new Set((emails as any[]).map((e) => e.id));
    setPendingRemoved((prev) => {
      const next = new Set([...prev].filter((id) => present.has(id)));
      return next.size === prev.size ? prev : next;
    });
  }, [emails]);

  // Reconcile a completed action: on failure, un-hide the rows + error toast.
  useEffect(() => {
    if (actionFetcher.state !== 'idle' || !actionFetcher.data) return;
    const data = actionFetcher.data as { error?: string; failed?: unknown[] };
    const last = lastActionRef.current;
    if ((data.error || (data.failed && data.failed.length)) && last) {
      setPendingRemoved((prev) => {
        const next = new Set(prev);
        last.ids.forEach((id) => next.delete(id));
        return next;
      });
      pushToast({ message: `Couldn't ${last.action} — please retry`, variant: 'error' });
      lastActionRef.current = null;
    }
  }, [actionFetcher.state, actionFetcher.data, pushToast]);

  const triageCounts = useMemo(() => {
    const c: Record<string, number> = { all: emails.length };
    for (const e of emails as any[]) {
      const cat = e.triage_category ?? 'other';
      c[cat] = (c[cat] || 0) + 1;
    }
    return c;
  }, [emails]);

  // Reset focus when filter changes
  useEffect(() => {
    setFocusIndex(0);
  }, [triageFilter, folder]);

  // Reply opens from the original email's account so threading + From are correct.
  const composeReplyAccount = useMemo(() => {
    const accId = composeProps?.replyTo?.account_id;
    return accId ? accounts.find((a) => a.id === accId) ?? null : null;
  }, [composeProps, accounts]);

  // Handle URL params for compose (reply/forward/new links from the detail route)
  useEffect(() => {
    const replyId = searchParams.get('reply');
    const forwardId = searchParams.get('forward');
    const replyAll = searchParams.get('all') === 'true';
    const composeNew = searchParams.get('compose');

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
    } else if (composeNew) {
      setComposeProps(null);
      setShowCompose(true);
    }
  }, [searchParams, emails]);

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

  // Auto-sync on window focus — throttled to once per 2 minutes (Part 5, EU-14)
  // so tab-flipping doesn't hammer the sync endpoint.
  const lastFocusSync = useRef(0);
  useEffect(() => {
    const onFocus = async () => {
      const now = Date.now();
      if (now - lastFocusSync.current < 120_000) return;
      lastFocusSync.current = now;
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

  // Lightweight polling every 60s — only revalidates when new inbox emails actually exist
  const newestEmailAt = emails.length > 0
    ? (emails[0] as any).received_at as string | undefined
    : undefined;
  useEmailPolling({ enabled: true, interval: 60_000, newestEmailAt });

  const handleOpenEmail = async (email: PreviewEmail) => {
    setActiveEmail(email);
    if (!email.is_read) markAsRead(email.id); // skip already-read (Part 5, EU-14)

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

  // Replay the inverse of an action (write-back makes archive/trash/spam/snooze
  // reversible). Un-hides instantly; the revalidated loader brings the rows back.
  const handleUndo = useCallback((action: string, ids: string[]) => {
    setPendingRemoved((prev) => {
      const next = new Set(prev);
      ids.forEach((id) => next.delete(id));
      return next;
    });
    undoFetcher.submit(
      { action, email_ids: JSON.stringify(ids) },
      { method: 'post', action: '/dashboard/inbox/undo' },
    );
  }, [undoFetcher]);

  // `z` — undo the most recent undoable action (server resolves "last").
  const handleUndoLast = useCallback(() => {
    undoFetcher.submit({}, { method: 'post', action: '/dashboard/inbox/undo' });
  }, [undoFetcher]);

  const handleBulkAction = useCallback((action: string, overrideEmailId?: string) => {
    const ids = overrideEmailId
      ? [overrideEmailId]
      : selectedIds.size > 0
        ? Array.from(selectedIds)
        : visibleEmails[focusIndex] ? [visibleEmails[focusIndex].id] : [];
    if (ids.length === 0) return;

    const removesFromView = ['trash', 'archive', 'spam', 'delete'].includes(action);

    // Optimistic: hide the rows instantly (<100ms perceived). Reconciled by the
    // revalidated loader; reverted by the error effect if the write-back fails.
    if (removesFromView) {
      setPendingRemoved((prev) => new Set([...prev, ...ids]));
      lastActionRef.current = { action, ids };
    }

    actionFetcher.submit(
      { action, email_ids: JSON.stringify(ids) },
      { method: 'post', action: '/dashboard/inbox/bulk' }
    );
    setSelectedIds(new Set());

    // Undo toast for reversible folder moves (single + bulk).
    if (UNDO_LABELS[action]) {
      const label = UNDO_LABELS[action];
      pushToast({
        message: ids.length > 1 ? `${label} ${ids.length} emails` : label,
        actionLabel: 'Undo',
        onAction: () => handleUndo(action, ids),
      });
    }

    // If the active email is being removed from the current view, advance or close.
    if (removesFromView && activeEmail && ids.includes(activeEmail.id)) {
      const currentIndex = visibleEmails.findIndex((e: any) => e.id === activeEmail.id);
      const nextEmail =
        visibleEmails.find((e: any, i: number) => i > currentIndex && !ids.includes(e.id)) ??
        visibleEmails.find((e: any, i: number) => i < currentIndex && !ids.includes(e.id)) ??
        null;
      setActiveEmail(nextEmail as PreviewEmail | null);
      setThreadEmails(null);
    }
  }, [selectedIds, visibleEmails, focusIndex, actionFetcher, activeEmail, pushToast, handleUndo]);

  const markAsRead = (id: string) => {
    readFetcher.submit(
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
        actionFetcher.submit(
          { action, email_ids: JSON.stringify(draggedEmailIds) },
          { method: 'post', action: '/dashboard/inbox/bulk' }
        );
      }
    } else if (target.type === 'label') {
      actionFetcher.submit(
        { action: 'add_label', email_ids: JSON.stringify(draggedEmailIds), label_id: target.id },
        { method: 'post', action: '/dashboard/inbox/bulk' }
      );
    }
    setDraggedEmailIds([]);
  };

  const handleSearch = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const q = (formData.get('q') as string).trim();
    if (searchDebounce.current) clearTimeout(searchDebounce.current);
    setSearchParams(q ? { q } : { folder: 'inbox' });
  };

  // Debounced as-you-type search (EU-6).
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const q = e.currentTarget.value.trim();
    if (searchDebounce.current) clearTimeout(searchDebounce.current);
    searchDebounce.current = setTimeout(() => {
      setSearchParams(q ? { q } : { folder: 'inbox' });
    }, 350);
  };

  const closeCompose = () => {
    setShowCompose(false);
    setComposeProps(null);
    const params = new URLSearchParams(searchParams);
    params.delete('reply');
    params.delete('forward');
    params.delete('all');
    params.delete('compose');
    setSearchParams(params);
  };

  const handleClose = useCallback(() => {
    setActiveEmail(null);
    setThreadEmails(null);
    setSelectedIds(new Set());
  }, []);

  const handleReply = useCallback(() => {
    if (activeEmail) {
      setComposeProps({ replyTo: activeEmail });
      setShowCompose(true);
    }
  }, [activeEmail]);

  const handleReplyAll = useCallback(() => {
    if (activeEmail) {
      setComposeProps({ replyTo: activeEmail, replyAll: true });
      setShowCompose(true);
    }
  }, [activeEmail]);

  const handleForward = useCallback(() => {
    if (activeEmail) {
      setComposeProps({ replyTo: activeEmail, forward: true });
      setShowCompose(true);
    }
  }, [activeEmail]);

  // Wire up keyboard shortcuts
  useEmailKeyboardShortcuts({
    emails: visibleEmails as Array<{ id: string; is_starred?: boolean }>,
    focusIndex,
    setFocusIndex,
    activeEmail,
    onOpenFocused: () => {
      if (visibleEmails[focusIndex]) {
        handleOpenEmail(visibleEmails[focusIndex] as PreviewEmail);
      }
    },
    onClose: handleClose,
    onBulkAction: handleBulkAction,
    onToggleSelect: () => {
      if (visibleEmails[focusIndex]) toggleSelect(visibleEmails[focusIndex].id);
    },
    onCompose: () => { setShowCompose(true); setComposeProps(null); },
    onReply: handleReply,
    onReplyAll: handleReplyAll,
    onForward: handleForward,
    onSearch: () => document.getElementById('inbox-search')?.focus(),
    onShowHelp: () => setShowShortcutsHelp(true),
    onUndo: handleUndoLast,
    onMarkUnread: () => handleBulkAction('unread'),
    onGoInbox: () => handleFolderSelect('inbox'),
    // A modal owns the keyboard while open (consistent close stack, Part 5/7).
    enabled: !showCompose && !showShortcutsHelp,
  });

  return (
    <div className="flex flex-col h-full">
      {visibleReauth.map((acct) => (
        <div
          key={acct.id}
          className="flex items-center gap-3 px-4 py-2 bg-amber-950/40 border-b border-amber-800/50 text-sm text-amber-200"
        >
          <AlertTriangle size={16} className="shrink-0 text-amber-400" />
          <span className="flex-1">
            Gmail access for <strong>{acct.email}</strong> was revoked — sync is paused until you reconnect.
          </span>
          <Form method="post" action="/dashboard/inbox/connect-gmail">
            <button
              type="submit"
              className="px-3 py-1 rounded bg-amber-500 text-amber-950 font-medium hover:bg-amber-400 transition-colors"
            >
              Reconnect {acct.email}
            </button>
          </Form>
          <button
            type="button"
            onClick={() => setDismissedReauth((prev) => new Set(prev).add(acct.id))}
            title="Dismiss"
            className="text-amber-400 hover:text-amber-200"
          >
            <X size={16} />
          </button>
        </div>
      ))}
      <div className="flex flex-1 overflow-hidden">
      <InboxSidebar
        accounts={accounts}
        counts={counts}
        globalCounts={globalCounts}
        activeFolder={folder}
        activeAccountId={accountId}
        activeLabel={labelId}
        onSelectFolder={handleFolderSelect}
        onSelectLabel={handleLabelSelect}
        onCompose={() => { setComposeProps(null); setShowCompose(true); }}
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
                onChange={handleSearchChange}
                placeholder="Search emails… (try from:alice is:unread)"
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

          {/* Triage Tabs */}
          <div className="flex border-b border-zinc-800 overflow-x-auto scrollbar-none">
            {TRIAGE_TABS.map(({ id, label }) => {
              const count = triageCounts[id] ?? 0;
              const isActive = triageFilter === id;
              if (id !== 'all' && count === 0) return null;
              return (
                <button
                  key={id}
                  onClick={() => setTriageFilter(id)}
                  className={`flex items-center gap-1.5 px-3 py-2 text-xs whitespace-nowrap border-b-2 transition-colors ${
                    isActive
                      ? 'border-emerald-500 text-emerald-400'
                      : 'border-transparent text-zinc-500 hover:text-zinc-300'
                  }`}
                >
                  <span>{label}</span>
                  {count > 0 && id !== 'all' && (
                    <span className={`px-1.5 py-0.5 rounded-full text-xs ${isActive ? 'bg-emerald-500/20 text-emerald-400' : 'bg-zinc-800 text-zinc-500'}`}>
                      {count}
                    </span>
                  )}
                  {id === 'all' && (
                    <span className={`px-1.5 py-0.5 rounded-full text-xs ${isActive ? 'bg-emerald-500/20 text-emerald-400' : 'bg-zinc-800 text-zinc-500'}`}>
                      {count}
                    </span>
                  )}
                </button>
              );
            })}
          </div>

          {/* Scheduled sends (Part 0.1): visible + cancellable in Drafts. */}
          {folder === 'drafts' && scheduledDrafts && scheduledDrafts.length > 0 && (
            <div className="border-b border-zinc-800 bg-zinc-900/40" data-testid="scheduled-drafts">
              <div className="px-4 py-2 text-[11px] font-medium uppercase tracking-wide text-zinc-500">Scheduled</div>
              {scheduledDrafts.map((d) => {
                const to = Array.isArray(d.to_emails) ? d.to_emails.join(', ') : String(d.to_emails ?? '');
                const cancelling =
                  cancelSendFetcher.state !== 'idle' &&
                  cancelSendFetcher.formData?.get('draft_id') === d.id;
                return (
                  <div key={d.id} className="flex items-center gap-3 px-4 py-2 text-sm hover:bg-zinc-800/30" data-testid="scheduled-draft-row">
                    <Bell className="h-3.5 w-3.5 shrink-0 text-amber-400" />
                    <div className="min-w-0 flex-1">
                      <div className="truncate text-zinc-200">{d.subject || '(no subject)'}</div>
                      <div className="truncate text-xs text-zinc-500">
                        To {to || '—'}
                        {d.send_at && <> · sends {new Date(d.send_at).toLocaleString(undefined, { month: 'short', day: 'numeric', hour: 'numeric', minute: '2-digit' })}</>}
                      </div>
                    </div>
                    <cancelSendFetcher.Form method="post" action="/dashboard/inbox/cancel-send">
                      <input type="hidden" name="draft_id" value={d.id} />
                      <button
                        type="submit"
                        disabled={cancelling}
                        className="shrink-0 rounded border border-zinc-700 px-2 py-1 text-xs text-zinc-300 hover:bg-zinc-800 disabled:opacity-50"
                      >
                        {cancelling ? 'Cancelling…' : 'Cancel'}
                      </button>
                    </cancelSendFetcher.Form>
                  </div>
                );
              })}
            </div>
          )}

          {listLoading ? (
            <EmailListSkeleton />
          ) : search && visibleEmails.length === 0 ? (
            <div className="flex flex-col items-center justify-center gap-2 py-16 text-center" data-testid="search-no-results">
              <Mail className="h-6 w-6 text-zinc-600" />
              <p className="text-sm text-zinc-400">No results for “{search}”</p>
              <p className="text-xs text-zinc-600">Try a different search or check another folder.</p>
            </div>
          ) : (
            <EmailList
              emails={visibleEmails as Email[]}
              selectedIds={selectedIds}
              activeEmailId={activeEmail?.id ?? null}
              focusedIndex={focusIndex}
              onSelect={toggleSelect}
              onSelectAll={() => setSelectedIds(new Set(visibleEmails.map((e: any) => e.id)))}
              onClearSelection={() => setSelectedIds(new Set())}
              onOpen={(email) => handleOpenEmail(email as PreviewEmail)}
              onDragStart={handleDragStart}
              onAction={(action, emailId) => handleBulkAction(action, emailId)}
              onSelectRange={(ids) => setSelectedIds((prev) => new Set([...prev, ...ids]))}
            />
          )}
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
              onBulkAction={(action) => handleBulkAction(action, activeEmail?.id)}
            />
          )}
        </div>
      </div>
      </div>

      <ComposeModal
        isOpen={showCompose}
        onClose={closeCompose}
        replyTo={composeProps?.replyTo}
        replyAll={composeProps?.replyAll}
        forward={composeProps?.forward}
        accountId={composeReplyAccount?.id || accounts[0]?.id || ''}
        accountEmail={composeReplyAccount?.email || accounts[0]?.email || ''}
      />

      <KeyboardShortcutsHelp
        isOpen={showShortcutsHelp}
        onClose={() => setShowShortcutsHelp(false)}
      />

      <ToastContainer toasts={toasts} onDismiss={dismissToast} />
    </div>
  );
}
