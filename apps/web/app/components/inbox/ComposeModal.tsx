import { useState, useEffect, useRef } from 'react';
import { useFetcher } from 'react-router';
import { X, Minus, Maximize2, Minimize2, Paperclip, Trash2, Send, Clock } from 'lucide-react';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  replyTo?: {
    id: string;
    subject: string;
    from_email: string;
    from_name: string;
    to_emails: string;
    cc_emails?: string;
    body_text?: string;
  };
  replyAll?: boolean;
  forward?: boolean;
  accountId: string;
  accountEmail: string;
}

export function ComposeModal({
  isOpen,
  onClose,
  replyTo,
  replyAll,
  forward,
  accountId,
  accountEmail,
}: Props) {
  const fetcher = useFetcher();
  const [isMinimized, setIsMinimized] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [showCc, setShowCc] = useState(false);
  const [showBcc, setShowBcc] = useState(false);
  const [showSchedule, setShowSchedule] = useState(false);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const [form, setForm] = useState({
    to: '',
    cc: '',
    bcc: '',
    subject: '',
    body: '',
    scheduled_for: '',
  });

  // Populate for reply/forward
  useEffect(() => {
    if (replyTo) {
      if (forward) {
        setForm({
          to: '',
          cc: '',
          bcc: '',
          subject: `Fwd: ${replyTo.subject}`,
          body: `\n\n---------- Forwarded message ---------\nFrom: ${replyTo.from_name} <${replyTo.from_email}>\nSubject: ${replyTo.subject}\n\n${replyTo.body_text || ''}`,
          scheduled_for: '',
        });
      } else {
        const replyToEmail = replyTo.from_email;
        const ccList = replyAll && replyTo.cc_emails ? replyTo.cc_emails : '';

        setForm({
          to: replyToEmail,
          cc: ccList,
          bcc: '',
          subject: replyTo.subject.startsWith('Re:') ? replyTo.subject : `Re: ${replyTo.subject}`,
          body: `\n\nOn ${new Date().toLocaleDateString()}, ${replyTo.from_name} wrote:\n> ${(replyTo.body_text || '').split('\n').join('\n> ')}`,
          scheduled_for: '',
        });

        if (ccList) setShowCc(true);
      }
    } else {
      setForm({ to: '', cc: '', bcc: '', subject: '', body: '', scheduled_for: '' });
      setShowCc(false);
      setShowBcc(false);
    }
  }, [replyTo, replyAll, forward]);

  // Auto-save draft every 30 seconds
  useEffect(() => {
    if (!isOpen || isMinimized) return;

    const interval = setInterval(() => {
      if (form.to || form.subject || form.body) {
        fetcher.submit(
          {
            account_id: accountId,
            to_emails: form.to,
            cc_emails: form.cc,
            bcc_emails: form.bcc,
            subject: form.subject,
            body: form.body,
            reply_to_id: replyTo?.id || '',
            status: 'draft',
          },
          { method: 'post', action: '/dashboard/inbox/drafts' }
        );
      }
    }, 30000);

    return () => clearInterval(interval);
  }, [isOpen, isMinimized, form, accountId, replyTo]);

  const handleSend = () => {
    fetcher.submit(
      {
        account_id: accountId,
        to_emails: form.to,
        cc_emails: form.cc,
        bcc_emails: form.bcc,
        subject: form.subject,
        body: form.body,
        reply_to_id: replyTo?.id || '',
        scheduled_for: form.scheduled_for || '',
        action: form.scheduled_for ? 'schedule' : 'send',
      },
      { method: 'post', action: '/dashboard/inbox/send' }
    );
    onClose();
  };

  const handleDiscard = () => {
    if (form.to || form.subject || form.body) {
      if (!confirm('Discard this draft?')) return;
    }
    onClose();
  };

  if (!isOpen) return null;

  // Minimized bar at bottom
  if (isMinimized) {
    return (
      <div className="fixed bottom-0 right-4 z-50">
        <div
          className="bg-zinc-800 border border-zinc-700 rounded-t-lg shadow-xl cursor-pointer"
          onClick={() => setIsMinimized(false)}
        >
          <div className="flex items-center justify-between px-4 py-2 min-w-[300px]">
            <span className="text-sm font-medium truncate">
              {form.subject || 'New Message'}
            </span>
            <div className="flex items-center gap-1">
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setIsMinimized(false);
                }}
                className="p-1 hover:bg-zinc-700 rounded"
              >
                <Maximize2 size={14} />
              </button>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  handleDiscard();
                }}
                className="p-1 hover:bg-zinc-700 rounded"
              >
                <X size={14} />
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  const modalClasses = isFullscreen
    ? 'fixed inset-4 z-50'
    : 'fixed bottom-0 right-4 z-50 w-[560px] max-h-[80vh]';

  return (
    <div className={modalClasses}>
      <div className="bg-zinc-900 border border-zinc-700 rounded-t-lg shadow-2xl flex flex-col h-full">
        {/* Header */}
        <div className="flex items-center justify-between px-4 py-2 bg-zinc-800 rounded-t-lg">
          <span className="text-sm font-medium">
            {replyTo ? (forward ? 'Forward' : 'Reply') : 'New Message'}
          </span>
          <div className="flex items-center gap-1">
            <button
              onClick={() => setIsMinimized(true)}
              className="p-1 hover:bg-zinc-700 rounded"
              title="Minimize"
            >
              <Minus size={14} />
            </button>
            <button
              onClick={() => setIsFullscreen(!isFullscreen)}
              className="p-1 hover:bg-zinc-700 rounded"
              title={isFullscreen ? 'Exit fullscreen' : 'Fullscreen'}
            >
              {isFullscreen ? <Minimize2 size={14} /> : <Maximize2 size={14} />}
            </button>
            <button
              onClick={handleDiscard}
              className="p-1 hover:bg-zinc-700 rounded"
              title="Close"
            >
              <X size={14} />
            </button>
          </div>
        </div>

        {/* Form */}
        <div className="flex-1 flex flex-col overflow-hidden">
          {/* To */}
          <div className="flex items-center border-b border-zinc-800 px-4 py-2">
            <span className="text-sm text-zinc-500 w-12">To</span>
            <input
              type="text"
              value={form.to}
              onChange={(e) => setForm({ ...form, to: e.target.value })}
              className="flex-1 bg-transparent text-sm outline-none"
              placeholder="Recipients"
            />
            <div className="flex gap-2 text-sm text-zinc-500">
              {!showCc && (
                <button onClick={() => setShowCc(true)} className="hover:text-zinc-300">
                  Cc
                </button>
              )}
              {!showBcc && (
                <button onClick={() => setShowBcc(true)} className="hover:text-zinc-300">
                  Bcc
                </button>
              )}
            </div>
          </div>

          {/* Cc */}
          {showCc && (
            <div className="flex items-center border-b border-zinc-800 px-4 py-2">
              <span className="text-sm text-zinc-500 w-12">Cc</span>
              <input
                type="text"
                value={form.cc}
                onChange={(e) => setForm({ ...form, cc: e.target.value })}
                className="flex-1 bg-transparent text-sm outline-none"
              />
            </div>
          )}

          {/* Bcc */}
          {showBcc && (
            <div className="flex items-center border-b border-zinc-800 px-4 py-2">
              <span className="text-sm text-zinc-500 w-12">Bcc</span>
              <input
                type="text"
                value={form.bcc}
                onChange={(e) => setForm({ ...form, bcc: e.target.value })}
                className="flex-1 bg-transparent text-sm outline-none"
              />
            </div>
          )}

          {/* Subject */}
          <div className="flex items-center border-b border-zinc-800 px-4 py-2">
            <span className="text-sm text-zinc-500 w-12">Subject</span>
            <input
              type="text"
              value={form.subject}
              onChange={(e) => setForm({ ...form, subject: e.target.value })}
              className="flex-1 bg-transparent text-sm outline-none"
            />
          </div>

          {/* Body */}
          <div className="flex-1 overflow-auto p-4">
            <textarea
              ref={textareaRef}
              value={form.body}
              onChange={(e) => setForm({ ...form, body: e.target.value })}
              className="w-full h-full bg-transparent text-sm outline-none resize-none min-h-[200px]"
              placeholder="Compose your message..."
            />
          </div>

          {/* Schedule picker */}
          {showSchedule && (
            <div className="px-4 py-2 border-t border-zinc-800 bg-zinc-800/50">
              <div className="flex items-center gap-2">
                <span className="text-sm text-zinc-400">Schedule for:</span>
                <input
                  type="datetime-local"
                  value={form.scheduled_for}
                  onChange={(e) => setForm({ ...form, scheduled_for: e.target.value })}
                  className="bg-zinc-900 border border-zinc-700 rounded px-2 py-1 text-sm"
                />
                <button
                  onClick={() => {
                    setShowSchedule(false);
                    setForm({ ...form, scheduled_for: '' });
                  }}
                  className="text-xs text-zinc-500 hover:text-zinc-300"
                >
                  Cancel
                </button>
              </div>
            </div>
          )}

          {/* Footer */}
          <div className="flex items-center justify-between px-4 py-3 border-t border-zinc-800">
            <div className="flex items-center gap-2">
              <button
                onClick={handleSend}
                disabled={!form.to || fetcher.state !== 'idle'}
                className="flex items-center gap-2 px-4 py-1.5 bg-emerald-600 hover:bg-emerald-500 rounded text-sm font-medium disabled:opacity-50"
              >
                <Send size={14} />
                {form.scheduled_for ? 'Schedule' : 'Send'}
              </button>

              <button
                onClick={() => setShowSchedule(!showSchedule)}
                className="p-1.5 hover:bg-zinc-800 rounded"
                title="Schedule send"
              >
                <Clock size={16} />
              </button>
            </div>
            <div className="flex items-center gap-2">
              <button className="p-1.5 hover:bg-zinc-800 rounded" title="Attach files">
                <Paperclip size={16} />
              </button>
              <button
                onClick={handleDiscard}
                className="p-1.5 hover:bg-zinc-800 rounded text-zinc-500 hover:text-red-400"
                title="Discard"
              >
                <Trash2 size={16} />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
