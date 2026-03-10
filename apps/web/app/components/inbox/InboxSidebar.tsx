import { useState, useEffect } from 'react';
import { Link, useFetcher } from 'react-router';
import {
  Inbox, Star, Clock, Send, File, AlertTriangle, Trash2, Mail,
  ChevronDown, ChevronRight, ChevronUp, Plus, Tag, RefreshCw, Check, AlertCircle,
} from 'lucide-react';

interface Label {
  id: string;
  name: string;
  color: string;
  type: 'system' | 'user';
  icon?: string;
}

interface Account {
  id: string;
  email: string;
  labels: Label[];
}

interface Counts {
  inbox: number;
  starred: number;
  snoozed: number;
  drafts: number;
  spam: number;
  trash: number;
}

interface Props {
  accounts: Account[];
  counts: Record<string, Counts>;
  globalCounts: Counts;
  activeFolder: string;
  activeAccountId: string | null;
  activeLabel: string | null;
  onSelectFolder: (folder: string, accountId?: string | null) => void;
  onSelectLabel: (labelId: string, accountId: string) => void;
  onDragOver: (e: React.DragEvent, target: { type: 'folder' | 'label'; id: string; accountId: string }) => void;
  onDrop: (e: React.DragEvent, target: { type: 'folder' | 'label'; id: string; accountId: string }) => void;
}

const systemIcons: Record<string, React.ComponentType<{ size?: number }>> = {
  Inbox,
  Star,
  Clock,
  Send,
  File,
  AlertTriangle,
  Trash2,
  Mail,
  Tag,
};

export function InboxSidebar({
  accounts,
  counts,
  globalCounts,
  activeFolder,
  activeAccountId,
  activeLabel,
  onSelectFolder,
  onSelectLabel,
  onDragOver,
  onDrop,
}: Props) {
  // All accounts start collapsed
  const [expandedAccounts, setExpandedAccounts] = useState<Set<string>>(new Set());
  const [expandedLabels, setExpandedLabels] = useState<Set<string>>(new Set());
  const [dragOverTarget, setDragOverTarget] = useState<string | null>(null);
  const fetcher = useFetcher();

  const toggleAccount = (accountId: string) => {
    const next = new Set(expandedAccounts);
    if (next.has(accountId)) next.delete(accountId);
    else next.add(accountId);
    setExpandedAccounts(next);
  };

  const toggleLabels = (accountId: string) => {
    const next = new Set(expandedLabels);
    if (next.has(accountId)) next.delete(accountId);
    else next.add(accountId);
    setExpandedLabels(next);
  };

  const handleDragOver = (e: React.DragEvent, targetId: string, type: 'folder' | 'label', accountId: string) => {
    e.preventDefault();
    setDragOverTarget(targetId);
    onDragOver(e, { type, id: targetId, accountId });
  };

  const handleDragLeave = () => setDragOverTarget(null);

  const handleDrop = (e: React.DragEvent, targetId: string, type: 'folder' | 'label', accountId: string) => {
    e.preventDefault();
    setDragOverTarget(null);
    onDrop(e, { type, id: targetId, accountId });
  };

  const isAllInboxesActive = activeFolder === 'inbox' && activeAccountId === null;

  return (
    <div className="w-56 border-r border-zinc-800 flex flex-col h-full overflow-hidden">
      {/* Compose Button */}
      <div className="p-3">
        <Link
          to="/dashboard/inbox/compose"
          className="flex items-center justify-center gap-2 w-full px-4 py-2.5 bg-emerald-600 hover:bg-emerald-500 rounded-lg text-sm font-medium transition-colors"
        >
          <Plus size={18} />
          Compose
        </Link>
      </div>

      {/* All Inboxes */}
      <div className="px-2 mb-1">
        <button
          onClick={() => onSelectFolder('inbox', null)}
          className={`flex items-center gap-3 w-full px-3 py-2 rounded text-sm transition-colors ${
            isAllInboxesActive
              ? 'bg-emerald-500/20 text-emerald-400 font-medium'
              : 'text-zinc-300 hover:bg-zinc-800'
          }`}
        >
          <Inbox size={16} />
          <span className="flex-1 text-left">All Inboxes</span>
          {globalCounts.inbox > 0 && (
            <span className={`text-xs px-1.5 py-0.5 rounded ${isAllInboxesActive ? 'bg-emerald-500/20 text-emerald-400' : 'text-zinc-500'}`}>
              {globalCounts.inbox}
            </span>
          )}
        </button>
      </div>

      <div className="border-t border-zinc-800 mx-2 mb-1" />

      {/* Accounts & Folders — all collapsed by default */}
      <div className="flex-1 overflow-auto px-2 pb-4">
        {accounts.map((account) => {
          const accountCounts = counts[account.id] || {} as Counts;
          const isExpanded = expandedAccounts.has(account.id);
          const systemLabels = account.labels.filter(l => l.type === 'system');
          const userLabels = account.labels.filter(l => l.type === 'user');
          const labelsExpanded = expandedLabels.has(account.id);

          return (
            <div key={account.id} className="mb-1">
              {/* Account Header */}
              <button
                onClick={() => toggleAccount(account.id)}
                className={`flex items-center gap-2 w-full px-2 py-1.5 text-left rounded group ${
                  isExpanded ? 'bg-zinc-800/50' : 'hover:bg-zinc-800/30'
                }`}
              >
                {isExpanded
                  ? <ChevronDown size={14} className="text-zinc-500 flex-shrink-0" />
                  : <ChevronRight size={14} className="text-zinc-500 flex-shrink-0" />
                }
                <span className="text-sm truncate flex-1 text-zinc-400">
                  {account.email.split('@')[0]}
                </span>
                {!isExpanded && (accountCounts.inbox ?? 0) > 0 && (
                  <span className="text-xs text-zinc-500">{accountCounts.inbox}</span>
                )}
              </button>

              {isExpanded && (
                <div className="mt-1 ml-2 space-y-0.5 border-l border-zinc-800 pl-2">
                  {/* System Folders */}
                  {systemLabels.map((label) => {
                    const Icon = systemIcons[label.icon || 'Mail'] || Mail;
                    const count = getFolderCount(label.name, accountCounts);
                    const isActive = activeFolder === label.name.toLowerCase() && activeAccountId === account.id;
                    const isDragOver = dragOverTarget === `${account.id}-${label.name}`;

                    return (
                      <button
                        key={label.id}
                        onClick={() => onSelectFolder(label.name.toLowerCase(), account.id)}
                        onDragOver={(e) => handleDragOver(e, label.name, 'folder', account.id)}
                        onDragLeave={handleDragLeave}
                        onDrop={(e) => handleDrop(e, label.name, 'folder', account.id)}
                        className={`flex items-center gap-2 w-full px-2 py-1 rounded text-xs transition-colors ${
                          isActive
                            ? 'bg-zinc-800 text-white'
                            : isDragOver
                              ? 'bg-emerald-500/20 text-emerald-400'
                              : 'text-zinc-400 hover:bg-zinc-800/50 hover:text-white'
                        }`}
                      >
                        <Icon size={14} />
                        <span className="flex-1 text-left">{label.name}</span>
                        {count > 0 && (
                          <span className={`text-xs ${isActive ? 'text-zinc-300' : 'text-zinc-500'}`}>
                            {count}
                          </span>
                        )}
                      </button>
                    );
                  })}

                  {/* User Labels */}
                  {userLabels.length > 0 && (
                    <div className="mt-1">
                      <button
                        onClick={() => toggleLabels(account.id)}
                        className="flex items-center gap-1 w-full px-2 py-1 text-xs text-zinc-500 hover:text-zinc-300"
                      >
                        {labelsExpanded ? <ChevronDown size={10} /> : <ChevronRight size={10} />}
                        Labels ({userLabels.length})
                      </button>
                      {labelsExpanded && (
                        <div className="mt-0.5 space-y-0.5">
                          {userLabels.map((label) => {
                            const isActive = activeLabel === label.id;
                            const isDragOver = dragOverTarget === `${account.id}-label-${label.id}`;

                            return (
                              <button
                                key={label.id}
                                onClick={() => onSelectLabel(label.id, account.id)}
                                onDragOver={(e) => handleDragOver(e, label.id, 'label', account.id)}
                                onDragLeave={handleDragLeave}
                                onDrop={(e) => handleDrop(e, label.id, 'label', account.id)}
                                className={`flex items-center gap-2 w-full px-2 py-1 rounded text-xs transition-colors ${
                                  isActive
                                    ? 'bg-zinc-800 text-white'
                                    : isDragOver
                                      ? 'bg-emerald-500/20 text-emerald-400'
                                      : 'text-zinc-400 hover:bg-zinc-800/50 hover:text-white'
                                }`}
                              >
                                <span
                                  className="w-2 h-2 rounded-sm flex-shrink-0"
                                  style={{ backgroundColor: label.color }}
                                />
                                <span className="flex-1 text-left truncate">{label.name}</span>
                              </button>
                            );
                          })}
                          <button
                            onClick={() => {
                              const name = prompt('Label name:');
                              if (name) {
                                fetcher.submit(
                                  { account_id: account.id, name },
                                  { method: 'post', action: '/dashboard/inbox/labels' }
                                );
                              }
                            }}
                            className="flex items-center gap-2 w-full px-2 py-1 text-xs text-zinc-500 hover:text-zinc-300"
                          >
                            <Plus size={12} />
                            Create label
                          </button>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              )}
            </div>
          );
        })}

        {accounts.length === 0 && (
          <a
            href="https://api.sheetzlabs.com/email/auth/gmail"
            className="flex items-center gap-2 px-3 py-2 text-sm text-emerald-400 hover:text-emerald-300"
          >
            <Plus size={16} />
            Connect Gmail
          </a>
        )}
      </div>

      {/* Sync button + debug panel */}
      <SyncButton />
    </div>
  );
}

interface SyncAccount {
  email: string;
  success: boolean;
  error: string | null;
  labels: { total: number; system: number; user: number; userLabelNames: string[] };
  emails: { synced: number };
}

interface SyncResult {
  success: boolean;
  accounts: SyncAccount[];
}

function SyncButton() {
  const syncFetcher = useFetcher();
  const [showDetails, setShowDetails] = useState(false);
  const [lastResult, setLastResult] = useState<SyncResult | null>(null);
  const [lastSyncTime, setLastSyncTime] = useState<Date | null>(null);
  const [, setTick] = useState(0);

  const isLoading = syncFetcher.state === 'submitting' || syncFetcher.state === 'loading';

  useEffect(() => {
    if (syncFetcher.data && syncFetcher.state === 'idle') {
      setLastResult(syncFetcher.data as SyncResult);
      setLastSyncTime(new Date());
      // No auto-expand
    }
  }, [syncFetcher.data, syncFetcher.state]);

  // Update relative time every minute
  useEffect(() => {
    const interval = setInterval(() => setTick(t => t + 1), 60000);
    return () => clearInterval(interval);
  }, []);

  const hasError = lastResult?.accounts?.some(a => !a.success);

  const formatRelativeTime = (date: Date) => {
    const seconds = Math.floor((Date.now() - date.getTime()) / 1000);
    if (seconds < 60) return 'just now';
    const minutes = Math.floor(seconds / 60);
    if (minutes < 60) return `${minutes}m ago`;
    const hours = Math.floor(minutes / 60);
    if (hours < 24) return `${hours}h ago`;
    return date.toLocaleDateString();
  };

  return (
    <div className="border-t border-zinc-800">
      {/* Sync Button */}
      <div className="p-3">
        <syncFetcher.Form method="post" action="/dashboard/inbox/sync">
          <button
            type="submit"
            disabled={isLoading}
            className="flex items-center justify-center gap-2 w-full px-3 py-2 text-sm text-zinc-400 hover:text-zinc-200 hover:bg-zinc-800 rounded-md transition-colors disabled:opacity-50"
          >
            {isLoading ? (
              <>
                <RefreshCw className="w-4 h-4 animate-spin" />
                <span>Syncing...</span>
              </>
            ) : hasError ? (
              <>
                <AlertCircle className="w-4 h-4 text-amber-500" />
                <span className="text-amber-500">Sync completed with errors</span>
              </>
            ) : (
              <>
                <RefreshCw className="w-4 h-4" />
                <span>Sync All Inboxes</span>
              </>
            )}
          </button>
        </syncFetcher.Form>
        {lastSyncTime && (
          <p className="mt-1 text-xs text-zinc-600 text-center">
            Last synced: {formatRelativeTime(lastSyncTime)}
          </p>
        )}
      </div>

      {/* Debug Panel */}
      {lastResult && (
        <div className="border-t border-zinc-800">
          <button
            onClick={() => setShowDetails(!showDetails)}
            className="flex items-center justify-between w-full px-3 py-2 text-xs text-zinc-500 hover:text-zinc-400"
          >
            <span>Sync Details</span>
            {showDetails ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />}
          </button>

          {showDetails && (
            <div className="px-3 pb-3 space-y-2 text-xs">
              {lastResult.accounts?.map((account, i) => (
                <div
                  key={i}
                  className={`p-2 rounded ${account.success ? 'bg-zinc-900' : 'bg-red-950/30'}`}
                >
                  <div className="flex items-center justify-between">
                    <span className="text-zinc-300 font-medium truncate max-w-[150px]">
                      {account.email}
                    </span>
                    {account.success ? (
                      <Check className="w-3 h-3 text-emerald-500 flex-shrink-0" />
                    ) : (
                      <AlertCircle className="w-3 h-3 text-red-500 flex-shrink-0" />
                    )}
                  </div>

                  {account.success ? (
                    <div className="mt-1 text-zinc-500 space-y-0.5">
                      <div>Labels: {account.labels?.total || 0} total, {account.labels?.user || 0} custom</div>
                      {(account.labels?.userLabelNames?.length ?? 0) > 0 && (
                        <div className="text-emerald-600">
                          → {account.labels.userLabelNames.slice(0, 5).join(', ')}
                          {account.labels.userLabelNames.length > 5 && '...'}
                        </div>
                      )}
                      <div>Emails: {account.emails?.synced || 0} synced</div>
                    </div>
                  ) : (
                    <div className="mt-1 text-red-400">{account.error || 'Unknown error'}</div>
                  )}
                </div>
              ))}

              <button
                onClick={() => { setLastResult(null); setShowDetails(false); }}
                className="text-zinc-600 hover:text-zinc-400 text-xs"
              >
                Clear
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

function getFolderCount(folder: string, counts: Counts): number {
  const map: Record<string, keyof Counts> = {
    Inbox: 'inbox',
    Starred: 'starred',
    Snoozed: 'snoozed',
    Drafts: 'drafts',
    Spam: 'spam',
    Trash: 'trash',
  };
  return counts[map[folder]] || 0;
}
