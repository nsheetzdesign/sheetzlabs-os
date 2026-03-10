import { useState, useEffect, useRef, useCallback } from 'react';
import { useFetcher } from 'react-router';
import { X, Minus, Maximize2, Minimize2, Paperclip, Trash2, Send, Clock, ChevronDown, Sparkles, Loader2, FileText } from 'lucide-react';

const API_URL = 'https://api.sheetzlabs.com';

interface Snippet {
  trigger: string;
  title: string;
  content: string;
}

interface Template {
  id: string;
  name: string;
  subject: string | null;
  body: string;
}

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

// ── Snippet expansion hook ───────────────────────────────────────────────────
function useSnippetExpansion(
  textareaRef: React.RefObject<HTMLTextAreaElement>,
  snippets: Snippet[],
  onBodyChange: (body: string) => void
) {
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [filter, setFilter] = useState('');
  const [slashPos, setSlashPos] = useState(0);

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
      if (e.key === '/' && !showSuggestions) {
        setShowSuggestions(true);
        setFilter('');
        setSlashPos((e.target as HTMLTextAreaElement).selectionStart);
        return;
      }
      if (showSuggestions) {
        if (e.key === 'Escape') {
          e.preventDefault();
          setShowSuggestions(false);
          return;
        }
        if (e.key === 'Tab' || e.key === 'Enter') {
          const match = snippets.find((s) =>
            s.trigger.startsWith(filter.toLowerCase())
          );
          if (match) {
            e.preventDefault();
            expandSnippet(match.content);
          }
          setShowSuggestions(false);
          return;
        }
      }
    },
    [showSuggestions, filter, snippets]
  );

  const handleInput = useCallback(
    (e: React.FormEvent<HTMLTextAreaElement>) => {
      if (!showSuggestions) return;
      const pos = (e.target as HTMLTextAreaElement).selectionStart;
      const value = (e.target as HTMLTextAreaElement).value;
      const textAfterSlash = value.slice(slashPos + 1, pos);
      if (textAfterSlash.includes(' ')) {
        setShowSuggestions(false);
        return;
      }
      setFilter(textAfterSlash);
    },
    [showSuggestions, slashPos]
  );

  const expandSnippet = useCallback(
    (content: string) => {
      const textarea = textareaRef.current;
      if (!textarea) return;
      const before = textarea.value.slice(0, slashPos);
      const after = textarea.value.slice(slashPos + filter.length + 1);
      const newVal = before + content + after;
      onBodyChange(newVal);
      // Restore cursor position after React re-render
      requestAnimationFrame(() => {
        const newPos = slashPos + content.length;
        textarea.setSelectionRange(newPos, newPos);
        textarea.focus();
      });
    },
    [textareaRef, slashPos, filter, onBodyChange]
  );

  const filteredSnippets = snippets.filter((s) =>
    s.trigger.toLowerCase().startsWith(filter.toLowerCase())
  );

  const selectSnippet = (snippet: Snippet) => {
    expandSnippet(snippet.content);
    setShowSuggestions(false);
  };

  return { handleKeyDown, handleInput, showSuggestions, filteredSnippets, selectSnippet, closeSuggestions: () => setShowSuggestions(false) };
}

// ── Snippet suggestions dropdown ─────────────────────────────────────────────
function SnippetSuggestions({
  snippets,
  onSelect,
}: {
  snippets: Snippet[];
  onSelect: (s: Snippet) => void;
}) {
  if (snippets.length === 0) return null;
  return (
    <div className="absolute bottom-full left-0 z-50 mb-1 w-64 overflow-hidden rounded-lg border border-zinc-700 bg-zinc-900 shadow-xl">
      <div className="border-b border-zinc-800 px-3 py-1.5 text-xs text-zinc-500">
        Snippets — Tab to insert
      </div>
      <div className="max-h-48 overflow-y-auto">
        {snippets.map((snippet) => (
          <button
            key={snippet.trigger}
            onMouseDown={(e) => {
              e.preventDefault(); // don't blur textarea
              onSelect(snippet);
            }}
            className="flex w-full items-center justify-between px-3 py-2 text-left hover:bg-zinc-800"
          >
            <span className="text-sm text-zinc-200">{snippet.title}</span>
            <kbd className="font-mono text-xs text-zinc-500">/{snippet.trigger}</kbd>
          </button>
        ))}
      </div>
    </div>
  );
}

// ── Template selector ─────────────────────────────────────────────────────────
function TemplateSelector({
  onSelect,
}: {
  onSelect: (t: { subject: string; body: string }) => void;
}) {
  const [templates, setTemplates] = useState<Template[]>([]);
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    fetch(`${API_URL}/email/templates`)
      .then((r) => r.json())
      .then((d: { templates?: Template[] }) => setTemplates(d.templates ?? []))
      .catch(() => {});
  }, []);

  if (templates.length === 0) return null;

  return (
    <div className="relative">
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-1 text-xs text-zinc-500 hover:text-zinc-300"
      >
        <FileText size={12} />
        Template
        <ChevronDown size={12} />
      </button>
      {isOpen && (
        <div className="absolute bottom-full left-0 z-50 mb-1 w-52 overflow-hidden rounded-lg border border-zinc-700 bg-zinc-900 shadow-xl">
          <div className="border-b border-zinc-800 px-3 py-1.5 text-xs text-zinc-500">
            Use template
          </div>
          {templates.map((t) => (
            <button
              key={t.id}
              onMouseDown={(e) => {
                e.preventDefault();
                onSelect({ subject: t.subject ?? '', body: t.body });
                setIsOpen(false);
              }}
              className="w-full px-3 py-2 text-left text-sm text-zinc-300 hover:bg-zinc-800"
            >
              {t.name}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

// ── Save-as-template button ───────────────────────────────────────────────────
function SaveAsTemplateButton({ subject, body }: { subject: string; body: string }) {
  const [showModal, setShowModal] = useState(false);
  const [name, setName] = useState('');
  const [saving, setSaving] = useState(false);

  const handleSave = async () => {
    if (!name.trim()) return;
    setSaving(true);
    try {
      await fetch(`${API_URL}/email/templates`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, subject, body }),
      });
    } catch {
      // ignore
    } finally {
      setSaving(false);
      setShowModal(false);
      setName('');
    }
  };

  return (
    <>
      <button
        type="button"
        onClick={() => setShowModal(true)}
        className="text-xs text-zinc-500 hover:text-zinc-300"
        title="Save as template"
      >
        Save template
      </button>
      {showModal && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/60">
          <div className="w-72 rounded-xl border border-zinc-700 bg-zinc-900 p-4 shadow-2xl">
            <h3 className="mb-3 text-sm font-medium text-zinc-200">Save as Template</h3>
            <input
              autoFocus
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSave()}
              placeholder="Template name"
              className="mb-3 w-full rounded-lg border border-zinc-700 bg-zinc-800 px-3 py-2 text-sm text-zinc-200 focus:outline-none focus:ring-1 focus:ring-emerald-500"
            />
            <div className="flex justify-end gap-2">
              <button
                type="button"
                onClick={() => setShowModal(false)}
                className="rounded px-3 py-1.5 text-sm text-zinc-400 hover:text-zinc-200"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleSave}
                disabled={!name.trim() || saving}
                className="rounded-lg bg-emerald-600 px-3 py-1.5 text-sm font-medium text-white hover:bg-emerald-500 disabled:opacity-50"
              >
                {saving ? 'Saving…' : 'Save'}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

// ── AI Draft button ───────────────────────────────────────────────────────────
function AIDraftButton({
  emailId,
  onDraft,
}: {
  emailId: string;
  onDraft: (draft: string) => void;
}) {
  const [isGenerating, setIsGenerating] = useState(false);
  const [showPicker, setShowPicker] = useState(false);

  const styles = [
    { id: 'professional', label: 'Professional' },
    { id: 'friendly', label: 'Friendly' },
    { id: 'brief', label: 'Brief' },
    { id: 'detailed', label: 'Detailed' },
  ];

  const generate = async (style: string) => {
    setIsGenerating(true);
    setShowPicker(false);
    try {
      const res = await fetch(`${API_URL}/email/ai-draft-reply`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ emailId, style }),
      });
      const data = (await res.json()) as { draft?: string };
      if (data.draft) onDraft(data.draft);
    } catch {
      // ignore
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="relative">
      <button
        type="button"
        onClick={() => !isGenerating && setShowPicker(!showPicker)}
        disabled={isGenerating}
        className="flex items-center gap-1.5 rounded-lg bg-violet-600 px-2.5 py-1.5 text-xs font-medium text-white hover:bg-violet-500 disabled:opacity-50"
      >
        {isGenerating ? (
          <Loader2 size={12} className="animate-spin" />
        ) : (
          <Sparkles size={12} />
        )}
        {isGenerating ? 'Drafting…' : 'AI Draft'}
      </button>
      {showPicker && (
        <div className="absolute bottom-full right-0 z-50 mb-1 w-36 overflow-hidden rounded-lg border border-zinc-700 bg-zinc-900 shadow-xl">
          <div className="border-b border-zinc-800 px-3 py-1.5 text-xs text-zinc-500">
            Style
          </div>
          {styles.map((s) => (
            <button
              key={s.id}
              onMouseDown={(e) => {
                e.preventDefault();
                generate(s.id);
              }}
              className="w-full px-3 py-2 text-left text-sm text-zinc-300 hover:bg-zinc-800"
            >
              {s.label}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

// ── Main ComposeModal ─────────────────────────────────────────────────────────
export function ComposeModal({
  isOpen,
  onClose,
  replyTo,
  replyAll,
  forward,
  accountId,
  accountEmail: _accountEmail,
}: Props) {
  const fetcher = useFetcher();
  const [isMinimized, setIsMinimized] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [showCc, setShowCc] = useState(false);
  const [showBcc, setShowBcc] = useState(false);
  const [showSchedule, setShowSchedule] = useState(false);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const [snippets, setSnippets] = useState<Snippet[]>([]);
  const [form, setForm] = useState({
    to: '',
    cc: '',
    bcc: '',
    subject: '',
    body: '',
    scheduled_for: '',
  });

  // Load snippets once
  useEffect(() => {
    fetch(`${API_URL}/email/snippets`)
      .then((r) => r.json())
      .then((d: { snippets?: Snippet[] }) => setSnippets(d.snippets ?? []))
      .catch(() => {});
  }, []);

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
        const ccList = replyAll && replyTo.cc_emails ? replyTo.cc_emails : '';
        setForm({
          to: replyTo.from_email,
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

  const updateBody = useCallback((body: string) => {
    setForm((f) => ({ ...f, body }));
  }, []);

  const {
    handleKeyDown: snippetKeyDown,
    handleInput: snippetInput,
    showSuggestions,
    filteredSnippets,
    selectSnippet,
  } = useSnippetExpansion(textareaRef, snippets, updateBody);

  if (!isOpen) return null;

  if (isMinimized) {
    return (
      <div className="fixed bottom-0 right-4 z-50">
        <div
          className="cursor-pointer rounded-t-lg border border-zinc-700 bg-zinc-800 shadow-xl"
          onClick={() => setIsMinimized(false)}
        >
          <div className="flex min-w-[300px] items-center justify-between px-4 py-2">
            <span className="truncate text-sm font-medium">
              {form.subject || 'New Message'}
            </span>
            <div className="flex items-center gap-1">
              <button
                onClick={(e) => { e.stopPropagation(); setIsMinimized(false); }}
                className="rounded p-1 hover:bg-zinc-700"
              >
                <Maximize2 size={14} />
              </button>
              <button
                onClick={(e) => { e.stopPropagation(); handleDiscard(); }}
                className="rounded p-1 hover:bg-zinc-700"
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
      <div className="flex h-full flex-col rounded-t-lg border border-zinc-700 bg-zinc-900 shadow-2xl">
        {/* Header */}
        <div className="flex items-center justify-between rounded-t-lg bg-zinc-800 px-4 py-2">
          <span className="text-sm font-medium">
            {replyTo ? (forward ? 'Forward' : 'Reply') : 'New Message'}
          </span>
          <div className="flex items-center gap-1">
            <button onClick={() => setIsMinimized(true)} className="rounded p-1 hover:bg-zinc-700" title="Minimize">
              <Minus size={14} />
            </button>
            <button onClick={() => setIsFullscreen(!isFullscreen)} className="rounded p-1 hover:bg-zinc-700" title={isFullscreen ? 'Exit fullscreen' : 'Fullscreen'}>
              {isFullscreen ? <Minimize2 size={14} /> : <Maximize2 size={14} />}
            </button>
            <button onClick={handleDiscard} className="rounded p-1 hover:bg-zinc-700" title="Close">
              <X size={14} />
            </button>
          </div>
        </div>

        {/* Form */}
        <div className="flex flex-1 flex-col overflow-hidden">
          {/* To */}
          <div className="flex items-center border-b border-zinc-800 px-4 py-2">
            <span className="w-12 text-sm text-zinc-500">To</span>
            <input
              type="text"
              value={form.to}
              onChange={(e) => setForm({ ...form, to: e.target.value })}
              className="flex-1 bg-transparent text-sm outline-none"
              placeholder="Recipients"
            />
            <div className="flex gap-2 text-sm text-zinc-500">
              {!showCc && <button onClick={() => setShowCc(true)} className="hover:text-zinc-300">Cc</button>}
              {!showBcc && <button onClick={() => setShowBcc(true)} className="hover:text-zinc-300">Bcc</button>}
            </div>
          </div>

          {showCc && (
            <div className="flex items-center border-b border-zinc-800 px-4 py-2">
              <span className="w-12 text-sm text-zinc-500">Cc</span>
              <input type="text" value={form.cc} onChange={(e) => setForm({ ...form, cc: e.target.value })} className="flex-1 bg-transparent text-sm outline-none" />
            </div>
          )}

          {showBcc && (
            <div className="flex items-center border-b border-zinc-800 px-4 py-2">
              <span className="w-12 text-sm text-zinc-500">Bcc</span>
              <input type="text" value={form.bcc} onChange={(e) => setForm({ ...form, bcc: e.target.value })} className="flex-1 bg-transparent text-sm outline-none" />
            </div>
          )}

          {/* Subject */}
          <div className="flex items-center border-b border-zinc-800 px-4 py-2">
            <span className="w-12 text-sm text-zinc-500">Subject</span>
            <input
              type="text"
              value={form.subject}
              onChange={(e) => setForm({ ...form, subject: e.target.value })}
              className="flex-1 bg-transparent text-sm outline-none"
            />
          </div>

          {/* Body */}
          <div className="relative flex-1 overflow-auto p-4">
            <textarea
              ref={textareaRef}
              value={form.body}
              onChange={(e) => setForm({ ...form, body: e.target.value })}
              onKeyDown={snippetKeyDown}
              onInput={snippetInput}
              className="h-full min-h-[200px] w-full resize-none bg-transparent text-sm outline-none"
              placeholder="Compose your message… (type /trigger to expand snippets)"
            />
            {showSuggestions && (
              <SnippetSuggestions snippets={filteredSnippets} onSelect={selectSnippet} />
            )}
          </div>

          {/* Schedule picker */}
          {showSchedule && (
            <div className="border-t border-zinc-800 bg-zinc-800/50 px-4 py-2">
              <div className="flex items-center gap-2">
                <span className="text-sm text-zinc-400">Schedule for:</span>
                <input
                  type="datetime-local"
                  value={form.scheduled_for}
                  onChange={(e) => setForm({ ...form, scheduled_for: e.target.value })}
                  className="rounded border border-zinc-700 bg-zinc-900 px-2 py-1 text-sm"
                />
                <button
                  onClick={() => { setShowSchedule(false); setForm({ ...form, scheduled_for: '' }); }}
                  className="text-xs text-zinc-500 hover:text-zinc-300"
                >
                  Cancel
                </button>
              </div>
            </div>
          )}

          {/* Footer */}
          <div className="flex items-center justify-between border-t border-zinc-800 px-4 py-3">
            <div className="flex items-center gap-2">
              <button
                onClick={handleSend}
                disabled={!form.to || fetcher.state !== 'idle'}
                className="flex items-center gap-2 rounded bg-emerald-600 px-4 py-1.5 text-sm font-medium hover:bg-emerald-500 disabled:opacity-50"
              >
                <Send size={14} />
                {form.scheduled_for ? 'Schedule' : 'Send'}
              </button>
              <button
                onClick={() => setShowSchedule(!showSchedule)}
                className="rounded p-1.5 hover:bg-zinc-800"
                title="Schedule send"
              >
                <Clock size={16} />
              </button>
              {replyTo && (
                <AIDraftButton
                  emailId={replyTo.id}
                  onDraft={(draft) => setForm((f) => ({ ...f, body: draft }))}
                />
              )}
            </div>
            <div className="flex items-center gap-3">
              <TemplateSelector
                onSelect={({ subject, body }) => {
                  setForm((f) => ({ ...f, subject: subject || f.subject, body }));
                }}
              />
              <SaveAsTemplateButton subject={form.subject} body={form.body} />
              <button className="rounded p-1.5 hover:bg-zinc-800" title="Attach files">
                <Paperclip size={16} />
              </button>
              <button
                onClick={handleDiscard}
                className="rounded p-1.5 text-zinc-500 hover:bg-zinc-800 hover:text-red-400"
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
