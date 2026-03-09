import { useState, useRef } from 'react';
import { useFetcher } from 'react-router';
import {
  Star, Archive, Trash2, Clock, MoreHorizontal,
  CheckSquare, Square, Paperclip,
} from 'lucide-react';

export interface Email {
  id: string;
  subject: string | null;
  from_name: string | null;
  from_email: string | null;
  snippet: string | null;
  received_at: string | null;
  is_read: boolean;
  is_starred: boolean;
  has_attachments: boolean;
  thread_id: string | null;
  labels?: { id: string; name: string; color: string }[];
}

interface Props {
  emails: Email[];
  selectedIds: Set<string>;
  activeEmailId: string | null;
  onSelect: (id: string, multi?: boolean) => void;
  onSelectAll: () => void;
  onClearSelection: () => void;
  onOpen: (email: Email) => void;
  onDragStart: (e: React.DragEvent, emailIds: string[]) => void;
}

export function EmailList({
  emails,
  selectedIds,
  activeEmailId,
  onSelect,
  onSelectAll,
  onClearSelection,
  onOpen,
  onDragStart,
}: Props) {
  const fetcher = useFetcher();
  const [hoveredId, setHoveredId] = useState<string | null>(null);
  const listRef = useRef<HTMLDivElement>(null);

  const handleBulkAction = (action: string) => {
    if (selectedIds.size === 0) return;
    fetcher.submit(
      { action, email_ids: JSON.stringify(Array.from(selectedIds)) },
      { method: 'post', action: '/dashboard/inbox/bulk' }
    );
    onClearSelection();
  };

  const handleQuickAction = (e: React.MouseEvent, emailId: string, action: string) => {
    e.stopPropagation();
    fetcher.submit(
      { action, email_ids: JSON.stringify([emailId]) },
      { method: 'post', action: '/dashboard/inbox/bulk' }
    );
  };

  const handleDragStart = (e: React.DragEvent, email: Email) => {
    const ids = selectedIds.has(email.id)
      ? Array.from(selectedIds)
      : [email.id];
    e.dataTransfer.setData('text/plain', JSON.stringify(ids));
    e.dataTransfer.effectAllowed = 'move';
    onDragStart(e, ids);
  };

  const formatDate = (dateStr: string | null) => {
    if (!dateStr) return '';
    const date = new Date(dateStr);
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    if (days === 0) return date.toLocaleTimeString([], { hour: 'numeric', minute: '2-digit' });
    if (days === 1) return 'Yesterday';
    if (days < 7) return date.toLocaleDateString([], { weekday: 'short' });
    return date.toLocaleDateString([], { month: 'short', day: 'numeric' });
  };

  return (
    <div className="flex flex-col h-full">
      {/* Toolbar */}
      <div className="flex items-center gap-2 px-4 py-2 border-b border-zinc-800 bg-zinc-900/50">
        <button
          onClick={() => selectedIds.size === emails.length ? onClearSelection() : onSelectAll()}
          className="p-1.5 hover:bg-zinc-800 rounded"
          title="Select all"
        >
          {selectedIds.size === emails.length && emails.length > 0 ? (
            <CheckSquare size={18} className="text-emerald-400" />
          ) : (
            <Square size={18} />
          )}
        </button>

        {selectedIds.size > 0 && (
          <>
            <div className="h-4 w-px bg-zinc-700" />
            <span className="text-sm text-zinc-400">{selectedIds.size} selected</span>
            <div className="h-4 w-px bg-zinc-700" />
            <button
              onClick={() => handleBulkAction('archive')}
              className="p-1.5 hover:bg-zinc-800 rounded"
              title="Archive"
            >
              <Archive size={18} />
            </button>
            <button
              onClick={() => handleBulkAction('trash')}
              className="p-1.5 hover:bg-zinc-800 rounded"
              title="Delete"
            >
              <Trash2 size={18} />
            </button>
            <button
              onClick={() => handleBulkAction('read')}
              className="p-1.5 hover:bg-zinc-800 rounded"
              title="Mark as read"
            >
              <MoreHorizontal size={18} />
            </button>
          </>
        )}

        <div className="flex-1" />
        <button
          onClick={() => fetcher.submit({}, { method: 'post', action: '/dashboard/inbox/sync' })}
          className="text-xs text-zinc-500 hover:text-zinc-300"
        >
          {fetcher.state !== 'idle' ? 'Syncing...' : 'Refresh'}
        </button>
      </div>

      {/* Email List */}
      <div ref={listRef} className="flex-1 overflow-auto">
        {emails.length === 0 ? (
          <div className="flex items-center justify-center h-full text-zinc-500">
            No emails
          </div>
        ) : (
          emails.map((email) => {
            const isSelected = selectedIds.has(email.id);
            const isActive = activeEmailId === email.id;
            const isHovered = hoveredId === email.id;

            return (
              <div
                key={email.id}
                draggable
                onDragStart={(e) => handleDragStart(e, email)}
                onClick={() => onOpen(email)}
                onMouseEnter={() => setHoveredId(email.id)}
                onMouseLeave={() => setHoveredId(null)}
                className={`flex items-center gap-3 px-4 py-2 border-b border-zinc-800/50 cursor-pointer transition-colors ${
                  isActive
                    ? 'bg-zinc-800'
                    : isSelected
                      ? 'bg-zinc-800/50'
                      : email.is_read
                        ? 'hover:bg-zinc-900'
                        : 'bg-zinc-900/30 hover:bg-zinc-900'
                }`}
              >
                {/* Checkbox */}
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    onSelect(email.id, e.shiftKey);
                  }}
                  className="p-0.5"
                >
                  {isSelected ? (
                    <CheckSquare size={16} className="text-emerald-400" />
                  ) : (
                    <Square size={16} className="text-zinc-600" />
                  )}
                </button>

                {/* Star */}
                <button
                  onClick={(e) => handleQuickAction(e, email.id, email.is_starred ? 'unstar' : 'star')}
                  className="p-0.5"
                >
                  <Star
                    size={16}
                    className={email.is_starred ? 'text-amber-400 fill-amber-400' : 'text-zinc-600'}
                  />
                </button>

                {/* Content */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <span className={`text-sm truncate ${email.is_read ? 'text-zinc-400' : 'font-semibold text-white'}`}>
                      {email.from_name || email.from_email}
                    </span>
                    {email.has_attachments && (
                      <Paperclip size={14} className="text-zinc-500 flex-shrink-0" />
                    )}
                  </div>
                  <div className="flex items-center gap-2">
                    <span className={`text-sm truncate ${email.is_read ? 'text-zinc-500' : 'text-zinc-300'}`}>
                      {email.subject || '(no subject)'}
                    </span>
                    <span className="text-sm text-zinc-600 truncate">
                      — {email.snippet}
                    </span>
                  </div>
                </div>

                {/* Quick Actions (on hover) */}
                {isHovered && (
                  <div className="flex items-center gap-1">
                    <button
                      onClick={(e) => handleQuickAction(e, email.id, 'archive')}
                      className="p-1.5 hover:bg-zinc-700 rounded"
                      title="Archive"
                    >
                      <Archive size={16} />
                    </button>
                    <button
                      onClick={(e) => handleQuickAction(e, email.id, 'trash')}
                      className="p-1.5 hover:bg-zinc-700 rounded"
                      title="Delete"
                    >
                      <Trash2 size={16} />
                    </button>
                    <button
                      onClick={(e) => { e.stopPropagation(); }}
                      className="p-1.5 hover:bg-zinc-700 rounded"
                      title="Snooze"
                    >
                      <Clock size={16} />
                    </button>
                  </div>
                )}

                {/* Date */}
                {!isHovered && (
                  <span className={`text-xs flex-shrink-0 ${email.is_read ? 'text-zinc-500' : 'text-zinc-400'}`}>
                    {formatDate(email.received_at)}
                  </span>
                )}
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}
