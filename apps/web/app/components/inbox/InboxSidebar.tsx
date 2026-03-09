import { useState } from 'react';
import { Link, useFetcher } from 'react-router';
import {
  Inbox, Star, Clock, Send, File, AlertTriangle, Trash2, Mail,
  ChevronDown, ChevronRight, Plus,
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
  activeFolder: string;
  activeAccountId: string | null;
  activeLabel: string | null;
  onSelectFolder: (folder: string, accountId?: string) => void;
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
};

export function InboxSidebar({
  accounts,
  counts,
  activeFolder,
  activeAccountId,
  activeLabel,
  onSelectFolder,
  onSelectLabel,
  onDragOver,
  onDrop,
}: Props) {
  const [expandedAccounts, setExpandedAccounts] = useState<Set<string>>(
    new Set(accounts.map(a => a.id))
  );
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

      {/* Accounts & Folders */}
      <div className="flex-1 overflow-auto px-2 pb-4">
        {accounts.map((account) => {
          const accountCounts = counts[account.id] || {} as Counts;
          const isExpanded = expandedAccounts.has(account.id);
          const systemLabels = account.labels.filter(l => l.type === 'system');
          const userLabels = account.labels.filter(l => l.type === 'user');
          const labelsExpanded = expandedLabels.has(account.id);

          return (
            <div key={account.id} className="mb-4">
              {/* Account Header */}
              <button
                onClick={() => toggleAccount(account.id)}
                className="flex items-center gap-2 w-full px-2 py-1.5 text-left hover:bg-zinc-800 rounded group"
              >
                {isExpanded ? <ChevronDown size={14} /> : <ChevronRight size={14} />}
                <span className="text-sm font-medium truncate flex-1">{account.email}</span>
              </button>

              {isExpanded && (
                <div className="mt-1 space-y-0.5">
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
                        className={`flex items-center gap-3 w-full px-3 py-1.5 rounded text-sm transition-colors ${
                          isActive
                            ? 'bg-zinc-800 text-white'
                            : isDragOver
                              ? 'bg-emerald-500/20 text-emerald-400'
                              : 'text-zinc-400 hover:bg-zinc-800/50 hover:text-white'
                        }`}
                      >
                        <Icon size={16} />
                        <span className="flex-1 text-left">{label.name}</span>
                        {count > 0 && (
                          <span className={`text-xs ${isActive ? 'text-zinc-300' : 'text-zinc-500'}`}>
                            {count}
                          </span>
                        )}
                      </button>
                    );
                  })}

                  {/* Labels Section */}
                  {userLabels.length > 0 && (
                    <div className="mt-2">
                      <button
                        onClick={() => toggleLabels(account.id)}
                        className="flex items-center gap-2 w-full px-3 py-1 text-xs text-zinc-500 hover:text-zinc-300"
                      >
                        {labelsExpanded ? <ChevronDown size={12} /> : <ChevronRight size={12} />}
                        Labels
                      </button>
                      {labelsExpanded && (
                        <div className="mt-1 space-y-0.5">
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
                                className={`flex items-center gap-3 w-full px-3 py-1.5 rounded text-sm transition-colors ${
                                  isActive
                                    ? 'bg-zinc-800 text-white'
                                    : isDragOver
                                      ? 'bg-emerald-500/20 text-emerald-400'
                                      : 'text-zinc-400 hover:bg-zinc-800/50 hover:text-white'
                                }`}
                              >
                                <span
                                  className="w-3 h-3 rounded-sm"
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
                            className="flex items-center gap-3 w-full px-3 py-1.5 text-sm text-zinc-500 hover:text-zinc-300"
                          >
                            <Plus size={14} />
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
