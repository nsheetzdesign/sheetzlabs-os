import { useState } from 'react';
import { useFetcher } from 'react-router';
import {
  Star, Archive, Trash2, Clock, Reply, ReplyAll, Forward,
  ChevronDown, ChevronUp, MoreHorizontal, X,
} from 'lucide-react';

export interface PreviewEmail {
  id: string;
  subject: string | null;
  from_name: string | null;
  from_email: string | null;
  to_emails?: string[] | string | null;
  cc_emails?: string[] | string | null;
  body_html?: string | null;
  body_text?: string | null;
  received_at: string | null;
  is_read: boolean;
  is_starred: boolean;
  thread_id?: string | null;
  ai_summary?: string | null;
  labels?: { id: string; name: string; color: string }[];
}

interface Props {
  email: PreviewEmail | null;
  onClose: () => void;
  onReply: () => void;
  onReplyAll: () => void;
  onForward: () => void;
}

export function EmailPreview({ email, onClose, onReply, onReplyAll, onForward }: Props) {
  const fetcher = useFetcher();
  const [showDetails, setShowDetails] = useState(false);

  if (!email) {
    return (
      <div className="flex items-center justify-center h-full text-zinc-500">
        <div className="text-center">
          <div className="text-4xl mb-2">📬</div>
          <p>Select an email to read</p>
        </div>
      </div>
    );
  }

  const handleAction = (action: string) => {
    fetcher.submit(
      { action, email_ids: JSON.stringify([email.id]) },
      { method: 'post', action: '/dashboard/inbox/bulk' }
    );
  };

  const formatDate = (dateStr: string | null) => {
    if (!dateStr) return '';
    return new Date(dateStr).toLocaleString([], {
      weekday: 'short',
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: 'numeric',
      minute: '2-digit',
    });
  };

  const toList = Array.isArray(email.to_emails)
    ? email.to_emails
    : (email.to_emails ?? '').split(',').map(s => s.trim()).filter(Boolean);
  const ccList = Array.isArray(email.cc_emails)
    ? email.cc_emails
    : (email.cc_emails ?? '').split(',').map(s => s.trim()).filter(Boolean);
  const firstTo = toList[0] ?? '';
  const senderInitial = (email.from_name || email.from_email || '?')[0].toUpperCase();

  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="flex items-center gap-2 px-4 py-3 border-b border-zinc-800">
        <button onClick={onClose} className="p-1.5 hover:bg-zinc-800 rounded md:hidden">
          <X size={18} />
        </button>
        <div className="flex-1" />
        <button
          onClick={() => handleAction('archive')}
          className="p-1.5 hover:bg-zinc-800 rounded"
          title="Archive"
        >
          <Archive size={18} />
        </button>
        <button
          onClick={() => handleAction('trash')}
          className="p-1.5 hover:bg-zinc-800 rounded"
          title="Delete"
        >
          <Trash2 size={18} />
        </button>
        <button
          onClick={() => handleAction(email.is_starred ? 'unstar' : 'star')}
          className="p-1.5 hover:bg-zinc-800 rounded"
          title={email.is_starred ? 'Unstar' : 'Star'}
        >
          <Star size={18} className={email.is_starred ? 'text-amber-400 fill-amber-400' : ''} />
        </button>
        <button className="p-1.5 hover:bg-zinc-800 rounded" title="Snooze">
          <Clock size={18} />
        </button>
        <button className="p-1.5 hover:bg-zinc-800 rounded" title="More">
          <MoreHorizontal size={18} />
        </button>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-auto">
        <div className="p-6">
          {/* Subject */}
          <h1 className="text-xl font-semibold mb-4">{email.subject || '(no subject)'}</h1>

          {/* Labels */}
          {email.labels && email.labels.length > 0 && (
            <div className="flex gap-2 mb-4">
              {email.labels.map((label) => (
                <span
                  key={label.id}
                  className="px-2 py-0.5 rounded text-xs"
                  style={{ backgroundColor: `${label.color}20`, color: label.color }}
                >
                  {label.name}
                </span>
              ))}
            </div>
          )}

          {/* Sender Info */}
          <div className="flex items-start gap-3 mb-4">
            <div className="w-10 h-10 rounded-full bg-zinc-700 flex items-center justify-center text-lg font-semibold">
              {senderInitial}
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2">
                <span className="font-medium">{email.from_name || email.from_email}</span>
                <span className="text-sm text-zinc-500">&lt;{email.from_email}&gt;</span>
              </div>
              <button
                onClick={() => setShowDetails(!showDetails)}
                className="flex items-center gap-1 text-sm text-zinc-500 hover:text-zinc-300"
              >
                to {firstTo}
                {showDetails ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
              </button>
              {showDetails && (
                <div className="mt-2 text-sm text-zinc-400 space-y-1">
                  <div>To: {toList.join(', ')}</div>
                  {ccList.length > 0 && <div>Cc: {ccList.join(', ')}</div>}
                  <div>Date: {formatDate(email.received_at)}</div>
                </div>
              )}
            </div>
            <span className="text-sm text-zinc-500 flex-shrink-0">
              {formatDate(email.received_at)}
            </span>
          </div>

          {/* AI Summary */}
          {email.ai_summary && (
            <div className="mb-6 p-4 bg-zinc-800/50 border border-zinc-700 rounded-lg">
              <div className="text-xs text-zinc-500 uppercase mb-1">AI Summary</div>
              <p className="text-sm">{email.ai_summary}</p>
            </div>
          )}

          {/* Body */}
          <div className="prose prose-invert prose-sm max-w-none">
            {email.body_html ? (
              <div dangerouslySetInnerHTML={{ __html: email.body_html }} />
            ) : email.body_text ? (
              <pre className="whitespace-pre-wrap font-sans text-sm text-zinc-300">{email.body_text}</pre>
            ) : email.snippet ? (
              <p className="text-zinc-300">{email.snippet}</p>
            ) : (
              <p className="text-zinc-500 italic">No content</p>
            )}
          </div>
        </div>
      </div>

      {/* Reply Actions */}
      <div className="flex items-center gap-2 p-4 border-t border-zinc-800">
        <button
          onClick={onReply}
          className="flex items-center gap-2 px-4 py-2 bg-zinc-800 hover:bg-zinc-700 rounded text-sm"
        >
          <Reply size={16} />
          Reply
        </button>
        <button
          onClick={onReplyAll}
          className="flex items-center gap-2 px-4 py-2 bg-zinc-800 hover:bg-zinc-700 rounded text-sm"
        >
          <ReplyAll size={16} />
          Reply All
        </button>
        <button
          onClick={onForward}
          className="flex items-center gap-2 px-4 py-2 bg-zinc-800 hover:bg-zinc-700 rounded text-sm"
        >
          <Forward size={16} />
          Forward
        </button>
      </div>
    </div>
  );
}
