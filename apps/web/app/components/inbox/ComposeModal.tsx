import { useState, useEffect, useRef, useCallback } from 'react';
import { useFetcher } from 'react-router';
import { X, Minus, Maximize2, Minimize2, Paperclip, Trash2, Send, Clock, ChevronDown, Sparkles, Loader2, FileText } from 'lucide-react';

// Same-origin proxy (routes/api.$.tsx) — adds the founder's JWT server-side.
const API_URL = '/api';

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
    to_emails: string | string[];
    cc_emails?: string | string[];
    body_text?: string;
    account_id?: string;
  };
  replyAll?: boolean;
  forward?: boolean;
  accountId: string;
  accountEmail: string;
}

/** Normalize a string|string[] recipient field to a trimmed array. */
function toAddressArray(v: string | string[] | undefined): string[] {
  if (!v) return [];
  const arr = Array.isArray(v) ? v : v.split(',');
  return arr.map((s) => s.trim()).filter(Boolean);
}

/** Dedupe addresses case-insensitively, preserving first-seen casing. */
function dedupeAddresses(addrs: string[]): string[] {
  const seen = new Set<string>();
  const out: string[] = [];
  for (const a of addrs) {
    const k = a.toLowerCase();
    if (!seen.has(k)) {
      seen.add(k);
      out.push(a);
    }
  }
  return out;
}

// ── Schedule-send presets (Part 2) ───────────────────────────────────────────
/** Format a Date as a `datetime-local` value (local wall time, no timezone). */
function toLocalInput(d: Date): string {
  const pad = (n: number) => String(n).padStart(2, '0');
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T${pad(d.getHours())}:${pad(d.getMinutes())}`;
}
function presetTomorrow8am(): string {
  const d = new Date();
  d.setDate(d.getDate() + 1);
  d.setHours(8, 0, 0, 0);
  return toLocalInput(d);
}
function presetMonday8am(): string {
  const d = new Date();
  const add = ((8 - d.getDay()) % 7) || 7; // next Monday (never today)
  d.setDate(d.getDate() + add);
  d.setHours(8, 0, 0, 0);
  return toLocalInput(d);
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
  accountEmail,
}: Props) {
  const fetcher = useFetcher<{
    success?: boolean;
    error?: string;
    scheduled?: boolean;
    undoable?: boolean;
    draftId?: string;
    undoMs?: number;
  }>();
  const draftFetcher = useFetcher<{ draft?: { id: string }; error?: string }>();
  const cancelFetcher = useFetcher<{ cancelled?: boolean }>();
  const sendingRef = useRef(false);
  // The in-flight undo-send window (Part 2): the modal stays mounted (content
  // preserved) showing "Sending — Undo" until the 10s timer closes it.
  const [pendingSend, setPendingSend] = useState<{ draftId: string } | null>(null);
  const undoTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const [draftId, setDraftId] = useState<string | null>(null);
  const [sendError, setSendError] = useState<string | null>(null);
  const [savedState, setSavedState] = useState<'idle' | 'saving' | 'saved' | 'failed'>('idle');
  const [isMinimized, setIsMinimized] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [showCc, setShowCc] = useState(false);
  const [showBcc, setShowBcc] = useState(false);
  const [showSchedule, setShowSchedule] = useState(false);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const [snippets, setSnippets] = useState<Snippet[]>([]);
  // Attachments (Part 3): read client-side as base64, 25 MB total cap (Gmail's).
  const attachFetcher = useFetcher<{ success?: boolean; error?: string }>();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [attachments, setAttachments] = useState<
    { name: string; type: string; size: number; dataB64: string }[]
  >([]);
  const [attachError, setAttachError] = useState<string | null>(null);
  const MAX_ATTACH_BYTES = 25 * 1024 * 1024;
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

  // Populate for reply/forward. Resets per-open draft/send state too.
  useEffect(() => {
    setDraftId(null);
    setSendError(null);
    setSavedState('idle');
    setPendingSend(null);
    setAttachments([]);
    setAttachError(null);
    if (replyTo) {
      if (forward) {
        setForm({
          to: '',
          cc: '',
          bcc: '',
          subject: replyTo.subject.startsWith('Fwd:') ? replyTo.subject : `Fwd: ${replyTo.subject}`,
          body: `\n\n---------- Forwarded message ---------\nFrom: ${replyTo.from_name} <${replyTo.from_email}>\nSubject: ${replyTo.subject}\n\n${replyTo.body_text || ''}`,
          scheduled_for: '',
        });
      } else {
        // Reply-all recipient set = original From + original To (minus self) + original Cc (EC-8).
        const self = (accountEmail || '').toLowerCase();
        const notSelf = (e: string) => e.toLowerCase() !== self;
        const origTo = toAddressArray(replyTo.to_emails);
        const origCc = toAddressArray(replyTo.cc_emails);
        let toList: string[];
        let ccList: string[];
        if (replyAll) {
          toList = dedupeAddresses([replyTo.from_email, ...origTo].filter(Boolean).filter(notSelf));
          const inTo = new Set(toList.map((e) => e.toLowerCase()));
          ccList = dedupeAddresses(origCc.filter(Boolean).filter(notSelf)).filter(
            (e) => !inTo.has(e.toLowerCase())
          );
        } else {
          toList = [replyTo.from_email].filter(Boolean);
          ccList = [];
        }
        setForm({
          to: toList.join(', '),
          cc: ccList.join(', '),
          bcc: '',
          subject: /^re:\s/i.test(replyTo.subject) ? replyTo.subject : `Re: ${replyTo.subject}`,
          body: `\n\nOn ${new Date().toLocaleDateString()}, ${replyTo.from_name} wrote:\n> ${(replyTo.body_text || '').split('\n').join('\n> ')}`,
          scheduled_for: '',
        });
        if (ccList.length) setShowCc(true);
      }
    } else {
      setForm({ to: '', cc: '', bcc: '', subject: '', body: '', scheduled_for: '' });
      setShowCc(false);
      setShowBcc(false);
    }
  }, [replyTo, replyAll, forward, accountEmail]);

  // Auto-save draft every 30 seconds (EC-3) — real route, tracked draft id.
  useEffect(() => {
    if (!isOpen || isMinimized) return;
    const interval = setInterval(() => {
      if (form.to || form.subject || form.body) {
        draftFetcher.submit(
          {
            id: draftId ?? '',
            account_id: accountId,
            to_emails: form.to,
            cc_emails: form.cc,
            bcc_emails: form.bcc,
            subject: form.subject,
            body: form.body,
            reply_to_id: replyTo?.id || '',
          },
          { method: 'post', action: '/dashboard/inbox/drafts' }
        );
      }
    }, 30000);
    return () => clearInterval(interval);
  }, [isOpen, isMinimized, form, accountId, replyTo, draftId]);

  // Track autosave result → "Saved"/"Save failed" indicator + draft id for upsert.
  useEffect(() => {
    if (draftFetcher.state === 'submitting' || draftFetcher.state === 'loading') {
      setSavedState('saving');
    } else if (draftFetcher.state === 'idle' && draftFetcher.data) {
      if (draftFetcher.data.draft?.id) {
        setDraftId(draftFetcher.data.draft.id);
        setSavedState('saved');
      } else if (draftFetcher.data.error) {
        setSavedState('failed');
      }
    }
  }, [draftFetcher.state, draftFetcher.data]);

  // Reconcile a send (Part 2). A scheduled send closes immediately; a normal send
  // enters the 10s undo window (modal stays mounted); a failure keeps it open.
  useEffect(() => {
    if (fetcher.state !== 'idle' || !sendingRef.current || !fetcher.data) return;
    sendingRef.current = false;
    const data = fetcher.data;
    if (data.error || !data.success) {
      setSendError(data.error ?? 'Failed to send. Please try again.');
      return;
    }
    if (data.scheduled) {
      onClose();
      return;
    }
    if (data.undoable && data.draftId) {
      setPendingSend({ draftId: data.draftId });
      if (undoTimer.current) clearTimeout(undoTimer.current);
      // Hand off to the cron after the window — the modal closes, the draft sends.
      undoTimer.current = setTimeout(() => {
        setPendingSend(null);
        onClose();
      }, data.undoMs ?? 10_000);
    } else {
      onClose();
    }
  }, [fetcher.state, fetcher.data, onClose]);

  // Undo the in-flight send: flip the scheduled draft back to editable and stay open.
  const handleUndoSend = useCallback(() => {
    if (undoTimer.current) clearTimeout(undoTimer.current);
    if (pendingSend) {
      cancelFetcher.submit(
        { draft_id: pendingSend.draftId },
        { method: 'post', action: '/dashboard/inbox/cancel-send' },
      );
    }
    setPendingSend(null);
  }, [pendingSend, cancelFetcher]);

  // Clear the timer on unmount.
  useEffect(() => () => { if (undoTimer.current) clearTimeout(undoTimer.current); }, []);

  // Escape closes the compose modal (Part 7 a11y). The global inbox shortcuts are
  // disabled while it's open, so this is the topmost handler.
  useEffect(() => {
    if (!isOpen || isMinimized) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && !pendingSend) {
        const tag = (e.target as HTMLElement)?.tagName;
        // Let a focused field blur first; a second Escape closes.
        if (tag === 'INPUT' || tag === 'TEXTAREA') return;
        e.preventDefault();
        onClose();
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [isOpen, isMinimized, pendingSend, onClose]);

  // Read picked files to base64; enforce the 25 MB total cap.
  const handleFiles = async (files: FileList | null) => {
    if (!files?.length) return;
    setAttachError(null);
    const read = await Promise.all(
      Array.from(files).map(
        (f) =>
          new Promise<{ name: string; type: string; size: number; dataB64: string }>((resolve, reject) => {
            const reader = new FileReader();
            reader.onload = () => {
              const res = String(reader.result);
              resolve({ name: f.name, type: f.type || 'application/octet-stream', size: f.size, dataB64: res.slice(res.indexOf(',') + 1) });
            };
            reader.onerror = reject;
            reader.readAsDataURL(f);
          }),
      ),
    );
    setAttachments((prev) => {
      const next = [...prev, ...read];
      if (next.reduce((s, a) => s + a.size, 0) > MAX_ATTACH_BYTES) {
        setAttachError('Attachments exceed 25 MB');
        return prev;
      }
      return next;
    });
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const removeAttachment = (i: number) =>
    setAttachments((prev) => prev.filter((_, idx) => idx !== i));

  // Reconcile a with-attachments (immediate) send.
  useEffect(() => {
    if (attachFetcher.state !== 'idle' || !attachFetcher.data) return;
    if (attachFetcher.data.success) onClose();
    else if (attachFetcher.data.error) setSendError(attachFetcher.data.error);
  }, [attachFetcher.state, attachFetcher.data, onClose]);

  const splitAddrs = (v: string) => v.split(',').map((s) => s.trim()).filter(Boolean);

  const handleSend = () => {
    setSendError(null);

    // Attachments → immediate multipart/mixed send (no undo window).
    if (attachments.length) {
      attachFetcher.submit(
        {
          account_id: accountId,
          to_emails: splitAddrs(form.to),
          cc_emails: splitAddrs(form.cc),
          subject: form.subject,
          body_text: form.body,
          reply_to_email_id: replyTo?.id ?? null,
          attachments: attachments.map((a) => ({ filename: a.name, mimeType: a.type, dataB64: a.dataB64 })),
        },
        { method: 'post', action: '/dashboard/inbox/send-attachments', encType: 'application/json' },
      );
      return;
    }

    sendingRef.current = true;
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

  // Below md the compose surface is full-screen (single-pane stack, Prompt 60);
  // at md+ it's the familiar bottom-right floating card (or inset-4 fullscreen).
  const modalClasses = isFullscreen
    ? 'fixed inset-4 z-50'
    : 'fixed inset-0 z-50 w-full max-h-full md:inset-auto md:bottom-0 md:right-4 md:w-[560px] md:max-h-[80vh]';

  return (
    <div className={modalClasses} role="dialog" aria-modal="true" aria-label={replyTo ? (forward ? 'Forward email' : 'Reply to email') : 'New message'}>
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

          {/* Attachment chips (Part 3) */}
          {(attachments.length > 0 || attachError) && (
            <div className="border-t border-zinc-800 px-4 py-2">
              {attachError && <p className="mb-1 text-xs text-red-400">{attachError}</p>}
              <div className="flex flex-wrap gap-2">
                {attachments.map((a, i) => (
                  <span
                    key={`${a.name}-${i}`}
                    className="flex items-center gap-2 rounded-lg border border-zinc-700 bg-zinc-800/60 px-2 py-1 text-xs text-zinc-200"
                  >
                    <Paperclip size={12} className="text-zinc-400" />
                    <span className="max-w-[160px] truncate">{a.name}</span>
                    <span className="text-zinc-500">{Math.max(1, Math.round(a.size / 1024))} KB</span>
                    <button
                      onClick={() => removeAttachment(i)}
                      aria-label={`Remove ${a.name}`}
                      className="text-zinc-500 hover:text-red-400"
                    >
                      <X size={12} />
                    </button>
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Schedule picker (Part 2) — quick presets + custom */}
          {showSchedule && (
            <div className="border-t border-zinc-800 bg-zinc-800/50 px-4 py-2">
              <div className="flex flex-wrap items-center gap-2">
                <span className="text-sm text-zinc-400">Schedule:</span>
                <button
                  onClick={() => setForm((f) => ({ ...f, scheduled_for: presetTomorrow8am() }))}
                  className="rounded border border-zinc-700 bg-zinc-900 px-2 py-1 text-xs hover:border-emerald-600"
                >
                  Tomorrow 8 AM
                </button>
                <button
                  onClick={() => setForm((f) => ({ ...f, scheduled_for: presetMonday8am() }))}
                  className="rounded border border-zinc-700 bg-zinc-900 px-2 py-1 text-xs hover:border-emerald-600"
                >
                  Monday 8 AM
                </button>
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
              {form.scheduled_for && (
                <p className="mt-1 text-xs text-emerald-400">
                  Will send {new Date(form.scheduled_for).toLocaleString()}
                </p>
              )}
            </div>
          )}

          {/* Sending — Undo (Part 2): 10s window before the cron sends it. */}
          {pendingSend && (
            <div className="flex items-center justify-between border-t border-emerald-900/50 bg-emerald-950/40 px-4 py-2 text-sm text-emerald-200">
              <span>Sending…</span>
              <button
                onClick={handleUndoSend}
                className="font-semibold text-emerald-300 hover:text-emerald-100"
              >
                Undo
              </button>
            </div>
          )}

          {/* Send error (keeps modal open, content preserved) */}
          {sendError && (
            <div className="border-t border-red-900/50 bg-red-950/40 px-4 py-2 text-sm text-red-300">
              {sendError}
            </div>
          )}

          {/* Footer */}
          <div className="flex items-center justify-between border-t border-zinc-800 px-4 py-3">
            <div className="flex items-center gap-2">
              <button
                onClick={handleSend}
                disabled={!form.to || fetcher.state !== 'idle' || attachFetcher.state !== 'idle' || !!pendingSend}
                className="flex items-center gap-2 rounded bg-emerald-600 px-4 py-1.5 text-sm font-medium hover:bg-emerald-500 disabled:opacity-50"
              >
                <Send size={14} />
                {pendingSend || fetcher.state !== 'idle' || attachFetcher.state !== 'idle'
                  ? 'Sending…'
                  : form.scheduled_for
                    ? 'Schedule'
                    : 'Send'}
              </button>
              {savedState === 'saving' && <span className="text-xs text-zinc-500">Saving…</span>}
              {savedState === 'saved' && <span className="text-xs text-zinc-500">Saved</span>}
              {savedState === 'failed' && <span className="text-xs text-amber-400">Save failed</span>}
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
              <input
                ref={fileInputRef}
                type="file"
                multiple
                className="hidden"
                onChange={(e) => handleFiles(e.target.files)}
              />
              <button
                onClick={() => fileInputRef.current?.click()}
                className="rounded p-1.5 hover:bg-zinc-800"
                title="Attach files"
                aria-label="Attach files"
              >
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
