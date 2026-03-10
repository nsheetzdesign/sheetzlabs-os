import { useState } from 'react';
import { useFetcher } from 'react-router';
import { ChevronDown, ChevronUp, Reply, ReplyAll, Forward, Star, Archive, Trash2 } from 'lucide-react';

interface Email {
  id: string;
  subject: string;
  from_name: string;
  from_email: string;
  to_emails: string;
  cc_emails?: string;
  body_html?: string;
  body_text?: string;
  received_at: string;
  is_read: boolean;
  is_starred: boolean;
}

interface Props {
  emails: Email[];
  onReply: (email: Email) => void;
  onReplyAll: (email: Email) => void;
  onForward: (email: Email) => void;
  onClose: () => void;
}

export function ThreadView({ emails, onReply, onReplyAll, onForward, onClose }: Props) {
  const fetcher = useFetcher();
  const [expandedIds, setExpandedIds] = useState<Set<string>>(
    new Set([emails[emails.length - 1]?.id])
  );

  const toggleExpand = (id: string) => {
    setExpandedIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
      }
      return next;
    });
  };

  const expandAll = () => setExpandedIds(new Set(emails.map((e) => e.id)));
  const collapseAll = () => setExpandedIds(new Set([emails[emails.length - 1]?.id]));

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return date.toLocaleString([], {
      month: 'short',
      day: 'numeric',
      hour: 'numeric',
      minute: '2-digit',
    });
  };

  if (emails.length === 0) return null;

  const subject = emails[0]?.subject || '(no subject)';

  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="flex items-center justify-between px-6 py-4 border-b border-zinc-800">
        <div>
          <h1 className="text-xl font-semibold">{subject}</h1>
          <div className="flex items-center gap-2 mt-1 text-sm text-zinc-500">
            <span>{emails.length} messages</span>
            <span>·</span>
            <button onClick={expandAll} className="hover:text-zinc-300">
              Expand all
            </button>
            <span>·</span>
            <button onClick={collapseAll} className="hover:text-zinc-300">
              Collapse all
            </button>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => {
              fetcher.submit(
                { action: 'archive', email_ids: JSON.stringify(emails.map((e) => e.id)) },
                { method: 'post', action: '/dashboard/inbox/bulk' }
              );
              onClose();
            }}
            className="p-2 hover:bg-zinc-800 rounded"
            title="Archive all"
          >
            <Archive size={18} />
          </button>
          <button
            onClick={() => {
              fetcher.submit(
                { action: 'trash', email_ids: JSON.stringify(emails.map((e) => e.id)) },
                { method: 'post', action: '/dashboard/inbox/bulk' }
              );
              onClose();
            }}
            className="p-2 hover:bg-zinc-800 rounded"
            title="Delete all"
          >
            <Trash2 size={18} />
          </button>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-auto">
        {emails.map((email, index) => {
          const isExpanded = expandedIds.has(email.id);
          const isLatest = index === emails.length - 1;

          return (
            <div
              key={email.id}
              className={`border-b border-zinc-800/50 ${isExpanded ? 'bg-zinc-900/30' : ''}`}
            >
              {/* Collapsed Header */}
              <button
                onClick={() => toggleExpand(email.id)}
                className="flex items-center gap-3 w-full px-6 py-3 text-left hover:bg-zinc-800/30"
              >
                {isExpanded ? (
                  <ChevronUp size={16} className="text-zinc-500" />
                ) : (
                  <ChevronDown size={16} className="text-zinc-500" />
                )}

                <div className="w-8 h-8 rounded-full bg-zinc-700 flex items-center justify-center text-sm font-medium flex-shrink-0">
                  {(email.from_name || email.from_email)[0]?.toUpperCase()}
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <span className={`text-sm ${email.is_read ? 'text-zinc-400' : 'font-semibold'}`}>
                      {email.from_name || email.from_email}
                    </span>
                    {email.is_starred && <Star size={14} className="text-amber-400 fill-amber-400" />}
                  </div>
                  {!isExpanded && (
                    <p className="text-sm text-zinc-500 truncate">
                      {email.body_text?.slice(0, 100)}...
                    </p>
                  )}
                </div>

                <span className="text-xs text-zinc-500 flex-shrink-0">
                  {formatDate(email.received_at)}
                </span>
              </button>

              {/* Expanded Content */}
              {isExpanded && (
                <div className="px-6 pb-4">
                  <div className="flex items-start gap-3 mb-4 pl-7">
                    <div className="flex-1 text-sm">
                      <div className="text-zinc-400">
                        to {email.to_emails?.split(',')[0]}
                        {email.cc_emails && `, cc: ${email.cc_emails.split(',')[0]}`}
                      </div>
                    </div>
                  </div>

                  <div className="pl-7 prose prose-invert prose-sm max-w-none">
                    {email.body_html ? (
                      <div dangerouslySetInnerHTML={{ __html: email.body_html }} />
                    ) : (
                      <pre className="whitespace-pre-wrap font-sans">{email.body_text}</pre>
                    )}
                  </div>

                  <div className="flex items-center gap-2 mt-4 pl-7">
                    <button
                      onClick={() => onReply(email)}
                      className="flex items-center gap-2 px-3 py-1.5 bg-zinc-800 hover:bg-zinc-700 rounded text-sm"
                    >
                      <Reply size={14} />
                      Reply
                    </button>
                    <button
                      onClick={() => onReplyAll(email)}
                      className="flex items-center gap-2 px-3 py-1.5 bg-zinc-800 hover:bg-zinc-700 rounded text-sm"
                    >
                      <ReplyAll size={14} />
                      Reply All
                    </button>
                    <button
                      onClick={() => onForward(email)}
                      className="flex items-center gap-2 px-3 py-1.5 bg-zinc-800 hover:bg-zinc-700 rounded text-sm"
                    >
                      <Forward size={14} />
                      Forward
                    </button>
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Quick Reply */}
      <div className="border-t border-zinc-800 p-4">
        <button
          onClick={() => onReply(emails[emails.length - 1])}
          className="w-full px-4 py-3 border border-zinc-700 hover:border-zinc-600 rounded-lg text-left text-zinc-500 hover:text-zinc-300"
        >
          Click here to reply...
        </button>
      </div>
    </div>
  );
}
