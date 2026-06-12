import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
import { useState, useEffect, useRef, useCallback } from 'react';
import { useFetcher } from 'react-router';
import { X, Minus, Maximize2, Minimize2, Paperclip, Trash2, Send, Clock, ChevronDown, Sparkles, Loader2, FileText } from 'lucide-react';
// Same-origin proxy (routes/api.$.tsx) — adds the founder's JWT server-side.
const API_URL = '/api';
/** Normalize a string|string[] recipient field to a trimmed array. */
function toAddressArray(v) {
    if (!v)
        return [];
    const arr = Array.isArray(v) ? v : v.split(',');
    return arr.map((s) => s.trim()).filter(Boolean);
}
/** Dedupe addresses case-insensitively, preserving first-seen casing. */
function dedupeAddresses(addrs) {
    const seen = new Set();
    const out = [];
    for (const a of addrs) {
        const k = a.toLowerCase();
        if (!seen.has(k)) {
            seen.add(k);
            out.push(a);
        }
    }
    return out;
}
// ── Snippet expansion hook ───────────────────────────────────────────────────
function useSnippetExpansion(textareaRef, snippets, onBodyChange) {
    const [showSuggestions, setShowSuggestions] = useState(false);
    const [filter, setFilter] = useState('');
    const [slashPos, setSlashPos] = useState(0);
    const handleKeyDown = useCallback((e) => {
        if (e.key === '/' && !showSuggestions) {
            setShowSuggestions(true);
            setFilter('');
            setSlashPos(e.target.selectionStart);
            return;
        }
        if (showSuggestions) {
            if (e.key === 'Escape') {
                e.preventDefault();
                setShowSuggestions(false);
                return;
            }
            if (e.key === 'Tab' || e.key === 'Enter') {
                const match = snippets.find((s) => s.trigger.startsWith(filter.toLowerCase()));
                if (match) {
                    e.preventDefault();
                    expandSnippet(match.content);
                }
                setShowSuggestions(false);
                return;
            }
        }
    }, [showSuggestions, filter, snippets]);
    const handleInput = useCallback((e) => {
        if (!showSuggestions)
            return;
        const pos = e.target.selectionStart;
        const value = e.target.value;
        const textAfterSlash = value.slice(slashPos + 1, pos);
        if (textAfterSlash.includes(' ')) {
            setShowSuggestions(false);
            return;
        }
        setFilter(textAfterSlash);
    }, [showSuggestions, slashPos]);
    const expandSnippet = useCallback((content) => {
        const textarea = textareaRef.current;
        if (!textarea)
            return;
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
    }, [textareaRef, slashPos, filter, onBodyChange]);
    const filteredSnippets = snippets.filter((s) => s.trigger.toLowerCase().startsWith(filter.toLowerCase()));
    const selectSnippet = (snippet) => {
        expandSnippet(snippet.content);
        setShowSuggestions(false);
    };
    return { handleKeyDown, handleInput, showSuggestions, filteredSnippets, selectSnippet, closeSuggestions: () => setShowSuggestions(false) };
}
// ── Snippet suggestions dropdown ─────────────────────────────────────────────
function SnippetSuggestions({ snippets, onSelect, }) {
    if (snippets.length === 0)
        return null;
    return (_jsxs("div", { className: "absolute bottom-full left-0 z-50 mb-1 w-64 overflow-hidden rounded-lg border border-zinc-700 bg-zinc-900 shadow-xl", children: [_jsx("div", { className: "border-b border-zinc-800 px-3 py-1.5 text-xs text-zinc-500", children: "Snippets \u2014 Tab to insert" }), _jsx("div", { className: "max-h-48 overflow-y-auto", children: snippets.map((snippet) => (_jsxs("button", { onMouseDown: (e) => {
                        e.preventDefault(); // don't blur textarea
                        onSelect(snippet);
                    }, className: "flex w-full items-center justify-between px-3 py-2 text-left hover:bg-zinc-800", children: [_jsx("span", { className: "text-sm text-zinc-200", children: snippet.title }), _jsxs("kbd", { className: "font-mono text-xs text-zinc-500", children: ["/", snippet.trigger] })] }, snippet.trigger))) })] }));
}
// ── Template selector ─────────────────────────────────────────────────────────
function TemplateSelector({ onSelect, }) {
    const [templates, setTemplates] = useState([]);
    const [isOpen, setIsOpen] = useState(false);
    useEffect(() => {
        fetch(`${API_URL}/email/templates`)
            .then((r) => r.json())
            .then((d) => setTemplates(d.templates ?? []))
            .catch(() => { });
    }, []);
    if (templates.length === 0)
        return null;
    return (_jsxs("div", { className: "relative", children: [_jsxs("button", { type: "button", onClick: () => setIsOpen(!isOpen), className: "flex items-center gap-1 text-xs text-zinc-500 hover:text-zinc-300", children: [_jsx(FileText, { size: 12 }), "Template", _jsx(ChevronDown, { size: 12 })] }), isOpen && (_jsxs("div", { className: "absolute bottom-full left-0 z-50 mb-1 w-52 overflow-hidden rounded-lg border border-zinc-700 bg-zinc-900 shadow-xl", children: [_jsx("div", { className: "border-b border-zinc-800 px-3 py-1.5 text-xs text-zinc-500", children: "Use template" }), templates.map((t) => (_jsx("button", { onMouseDown: (e) => {
                            e.preventDefault();
                            onSelect({ subject: t.subject ?? '', body: t.body });
                            setIsOpen(false);
                        }, className: "w-full px-3 py-2 text-left text-sm text-zinc-300 hover:bg-zinc-800", children: t.name }, t.id)))] }))] }));
}
// ── Save-as-template button ───────────────────────────────────────────────────
function SaveAsTemplateButton({ subject, body }) {
    const [showModal, setShowModal] = useState(false);
    const [name, setName] = useState('');
    const [saving, setSaving] = useState(false);
    const handleSave = async () => {
        if (!name.trim())
            return;
        setSaving(true);
        try {
            await fetch(`${API_URL}/email/templates`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ name, subject, body }),
            });
        }
        catch {
            // ignore
        }
        finally {
            setSaving(false);
            setShowModal(false);
            setName('');
        }
    };
    return (_jsxs(_Fragment, { children: [_jsx("button", { type: "button", onClick: () => setShowModal(true), className: "text-xs text-zinc-500 hover:text-zinc-300", title: "Save as template", children: "Save template" }), showModal && (_jsx("div", { className: "fixed inset-0 z-[60] flex items-center justify-center bg-black/60", children: _jsxs("div", { className: "w-72 rounded-xl border border-zinc-700 bg-zinc-900 p-4 shadow-2xl", children: [_jsx("h3", { className: "mb-3 text-sm font-medium text-zinc-200", children: "Save as Template" }), _jsx("input", { autoFocus: true, type: "text", value: name, onChange: (e) => setName(e.target.value), onKeyDown: (e) => e.key === 'Enter' && handleSave(), placeholder: "Template name", className: "mb-3 w-full rounded-lg border border-zinc-700 bg-zinc-800 px-3 py-2 text-sm text-zinc-200 focus:outline-none focus:ring-1 focus:ring-emerald-500" }), _jsxs("div", { className: "flex justify-end gap-2", children: [_jsx("button", { type: "button", onClick: () => setShowModal(false), className: "rounded px-3 py-1.5 text-sm text-zinc-400 hover:text-zinc-200", children: "Cancel" }), _jsx("button", { type: "button", onClick: handleSave, disabled: !name.trim() || saving, className: "rounded-lg bg-emerald-600 px-3 py-1.5 text-sm font-medium text-white hover:bg-emerald-500 disabled:opacity-50", children: saving ? 'Saving…' : 'Save' })] })] }) }))] }));
}
// ── AI Draft button ───────────────────────────────────────────────────────────
function AIDraftButton({ emailId, onDraft, }) {
    const [isGenerating, setIsGenerating] = useState(false);
    const [showPicker, setShowPicker] = useState(false);
    const styles = [
        { id: 'professional', label: 'Professional' },
        { id: 'friendly', label: 'Friendly' },
        { id: 'brief', label: 'Brief' },
        { id: 'detailed', label: 'Detailed' },
    ];
    const generate = async (style) => {
        setIsGenerating(true);
        setShowPicker(false);
        try {
            const res = await fetch(`${API_URL}/email/ai-draft-reply`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ emailId, style }),
            });
            const data = (await res.json());
            if (data.draft)
                onDraft(data.draft);
        }
        catch {
            // ignore
        }
        finally {
            setIsGenerating(false);
        }
    };
    return (_jsxs("div", { className: "relative", children: [_jsxs("button", { type: "button", onClick: () => !isGenerating && setShowPicker(!showPicker), disabled: isGenerating, className: "flex items-center gap-1.5 rounded-lg bg-violet-600 px-2.5 py-1.5 text-xs font-medium text-white hover:bg-violet-500 disabled:opacity-50", children: [isGenerating ? (_jsx(Loader2, { size: 12, className: "animate-spin" })) : (_jsx(Sparkles, { size: 12 })), isGenerating ? 'Drafting…' : 'AI Draft'] }), showPicker && (_jsxs("div", { className: "absolute bottom-full right-0 z-50 mb-1 w-36 overflow-hidden rounded-lg border border-zinc-700 bg-zinc-900 shadow-xl", children: [_jsx("div", { className: "border-b border-zinc-800 px-3 py-1.5 text-xs text-zinc-500", children: "Style" }), styles.map((s) => (_jsx("button", { onMouseDown: (e) => {
                            e.preventDefault();
                            generate(s.id);
                        }, className: "w-full px-3 py-2 text-left text-sm text-zinc-300 hover:bg-zinc-800", children: s.label }, s.id)))] }))] }));
}
// ── Main ComposeModal ─────────────────────────────────────────────────────────
export function ComposeModal({ isOpen, onClose, replyTo, replyAll, forward, accountId, accountEmail, }) {
    const fetcher = useFetcher();
    const draftFetcher = useFetcher();
    const sendingRef = useRef(false);
    const [draftId, setDraftId] = useState(null);
    const [sendError, setSendError] = useState(null);
    const [savedState, setSavedState] = useState('idle');
    const [isMinimized, setIsMinimized] = useState(false);
    const [isFullscreen, setIsFullscreen] = useState(false);
    const [showCc, setShowCc] = useState(false);
    const [showBcc, setShowBcc] = useState(false);
    const [showSchedule, setShowSchedule] = useState(false);
    const textareaRef = useRef(null);
    const [snippets, setSnippets] = useState([]);
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
            .then((d) => setSnippets(d.snippets ?? []))
            .catch(() => { });
    }, []);
    // Populate for reply/forward. Resets per-open draft/send state too.
    useEffect(() => {
        setDraftId(null);
        setSendError(null);
        setSavedState('idle');
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
            }
            else {
                // Reply-all recipient set = original From + original To (minus self) + original Cc (EC-8).
                const self = (accountEmail || '').toLowerCase();
                const notSelf = (e) => e.toLowerCase() !== self;
                const origTo = toAddressArray(replyTo.to_emails);
                const origCc = toAddressArray(replyTo.cc_emails);
                let toList;
                let ccList;
                if (replyAll) {
                    toList = dedupeAddresses([replyTo.from_email, ...origTo].filter(Boolean).filter(notSelf));
                    const inTo = new Set(toList.map((e) => e.toLowerCase()));
                    ccList = dedupeAddresses(origCc.filter(Boolean).filter(notSelf)).filter((e) => !inTo.has(e.toLowerCase()));
                }
                else {
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
                if (ccList.length)
                    setShowCc(true);
            }
        }
        else {
            setForm({ to: '', cc: '', bcc: '', subject: '', body: '', scheduled_for: '' });
            setShowCc(false);
            setShowBcc(false);
        }
    }, [replyTo, replyAll, forward, accountEmail]);
    // Auto-save draft every 30 seconds (EC-3) — real route, tracked draft id.
    useEffect(() => {
        if (!isOpen || isMinimized)
            return;
        const interval = setInterval(() => {
            if (form.to || form.subject || form.body) {
                draftFetcher.submit({
                    id: draftId ?? '',
                    account_id: accountId,
                    to_emails: form.to,
                    cc_emails: form.cc,
                    bcc_emails: form.bcc,
                    subject: form.subject,
                    body: form.body,
                    reply_to_id: replyTo?.id || '',
                }, { method: 'post', action: '/dashboard/inbox/drafts' });
            }
        }, 30000);
        return () => clearInterval(interval);
    }, [isOpen, isMinimized, form, accountId, replyTo, draftId]);
    // Track autosave result → "Saved"/"Save failed" indicator + draft id for upsert.
    useEffect(() => {
        if (draftFetcher.state === 'submitting' || draftFetcher.state === 'loading') {
            setSavedState('saving');
        }
        else if (draftFetcher.state === 'idle' && draftFetcher.data) {
            if (draftFetcher.data.draft?.id) {
                setDraftId(draftFetcher.data.draft.id);
                setSavedState('saved');
            }
            else if (draftFetcher.data.error) {
                setSavedState('failed');
            }
        }
    }, [draftFetcher.state, draftFetcher.data]);
    // Close only on a confirmed successful send; keep open with an inline error otherwise.
    useEffect(() => {
        if (fetcher.state === 'idle' && sendingRef.current && fetcher.data) {
            sendingRef.current = false;
            if (fetcher.data.success) {
                onClose();
            }
            else {
                setSendError(fetcher.data.error ?? 'Failed to send. Please try again.');
            }
        }
    }, [fetcher.state, fetcher.data, onClose]);
    const handleSend = () => {
        setSendError(null);
        sendingRef.current = true;
        fetcher.submit({
            account_id: accountId,
            to_emails: form.to,
            cc_emails: form.cc,
            bcc_emails: form.bcc,
            subject: form.subject,
            body: form.body,
            reply_to_id: replyTo?.id || '',
            scheduled_for: form.scheduled_for || '',
            action: form.scheduled_for ? 'schedule' : 'send',
        }, { method: 'post', action: '/dashboard/inbox/send' });
    };
    const handleDiscard = () => {
        if (form.to || form.subject || form.body) {
            if (!confirm('Discard this draft?'))
                return;
        }
        onClose();
    };
    const updateBody = useCallback((body) => {
        setForm((f) => ({ ...f, body }));
    }, []);
    const { handleKeyDown: snippetKeyDown, handleInput: snippetInput, showSuggestions, filteredSnippets, selectSnippet, } = useSnippetExpansion(textareaRef, snippets, updateBody);
    if (!isOpen)
        return null;
    if (isMinimized) {
        return (_jsx("div", { className: "fixed bottom-0 right-4 z-50", children: _jsx("div", { className: "cursor-pointer rounded-t-lg border border-zinc-700 bg-zinc-800 shadow-xl", onClick: () => setIsMinimized(false), children: _jsxs("div", { className: "flex min-w-[300px] items-center justify-between px-4 py-2", children: [_jsx("span", { className: "truncate text-sm font-medium", children: form.subject || 'New Message' }), _jsxs("div", { className: "flex items-center gap-1", children: [_jsx("button", { onClick: (e) => { e.stopPropagation(); setIsMinimized(false); }, className: "rounded p-1 hover:bg-zinc-700", children: _jsx(Maximize2, { size: 14 }) }), _jsx("button", { onClick: (e) => { e.stopPropagation(); handleDiscard(); }, className: "rounded p-1 hover:bg-zinc-700", children: _jsx(X, { size: 14 }) })] })] }) }) }));
    }
    const modalClasses = isFullscreen
        ? 'fixed inset-4 z-50'
        : 'fixed bottom-0 right-4 z-50 w-[560px] max-h-[80vh]';
    return (_jsx("div", { className: modalClasses, children: _jsxs("div", { className: "flex h-full flex-col rounded-t-lg border border-zinc-700 bg-zinc-900 shadow-2xl", children: [_jsxs("div", { className: "flex items-center justify-between rounded-t-lg bg-zinc-800 px-4 py-2", children: [_jsx("span", { className: "text-sm font-medium", children: replyTo ? (forward ? 'Forward' : 'Reply') : 'New Message' }), _jsxs("div", { className: "flex items-center gap-1", children: [_jsx("button", { onClick: () => setIsMinimized(true), className: "rounded p-1 hover:bg-zinc-700", title: "Minimize", children: _jsx(Minus, { size: 14 }) }), _jsx("button", { onClick: () => setIsFullscreen(!isFullscreen), className: "rounded p-1 hover:bg-zinc-700", title: isFullscreen ? 'Exit fullscreen' : 'Fullscreen', children: isFullscreen ? _jsx(Minimize2, { size: 14 }) : _jsx(Maximize2, { size: 14 }) }), _jsx("button", { onClick: handleDiscard, className: "rounded p-1 hover:bg-zinc-700", title: "Close", children: _jsx(X, { size: 14 }) })] })] }), _jsxs("div", { className: "flex flex-1 flex-col overflow-hidden", children: [_jsxs("div", { className: "flex items-center border-b border-zinc-800 px-4 py-2", children: [_jsx("span", { className: "w-12 text-sm text-zinc-500", children: "To" }), _jsx("input", { type: "text", value: form.to, onChange: (e) => setForm({ ...form, to: e.target.value }), className: "flex-1 bg-transparent text-sm outline-none", placeholder: "Recipients" }), _jsxs("div", { className: "flex gap-2 text-sm text-zinc-500", children: [!showCc && _jsx("button", { onClick: () => setShowCc(true), className: "hover:text-zinc-300", children: "Cc" }), !showBcc && _jsx("button", { onClick: () => setShowBcc(true), className: "hover:text-zinc-300", children: "Bcc" })] })] }), showCc && (_jsxs("div", { className: "flex items-center border-b border-zinc-800 px-4 py-2", children: [_jsx("span", { className: "w-12 text-sm text-zinc-500", children: "Cc" }), _jsx("input", { type: "text", value: form.cc, onChange: (e) => setForm({ ...form, cc: e.target.value }), className: "flex-1 bg-transparent text-sm outline-none" })] })), showBcc && (_jsxs("div", { className: "flex items-center border-b border-zinc-800 px-4 py-2", children: [_jsx("span", { className: "w-12 text-sm text-zinc-500", children: "Bcc" }), _jsx("input", { type: "text", value: form.bcc, onChange: (e) => setForm({ ...form, bcc: e.target.value }), className: "flex-1 bg-transparent text-sm outline-none" })] })), _jsxs("div", { className: "flex items-center border-b border-zinc-800 px-4 py-2", children: [_jsx("span", { className: "w-12 text-sm text-zinc-500", children: "Subject" }), _jsx("input", { type: "text", value: form.subject, onChange: (e) => setForm({ ...form, subject: e.target.value }), className: "flex-1 bg-transparent text-sm outline-none" })] }), _jsxs("div", { className: "relative flex-1 overflow-auto p-4", children: [_jsx("textarea", { ref: textareaRef, value: form.body, onChange: (e) => setForm({ ...form, body: e.target.value }), onKeyDown: snippetKeyDown, onInput: snippetInput, className: "h-full min-h-[200px] w-full resize-none bg-transparent text-sm outline-none", placeholder: "Compose your message\u2026 (type /trigger to expand snippets)" }), showSuggestions && (_jsx(SnippetSuggestions, { snippets: filteredSnippets, onSelect: selectSnippet }))] }), showSchedule && (_jsx("div", { className: "border-t border-zinc-800 bg-zinc-800/50 px-4 py-2", children: _jsxs("div", { className: "flex items-center gap-2", children: [_jsx("span", { className: "text-sm text-zinc-400", children: "Schedule for:" }), _jsx("input", { type: "datetime-local", value: form.scheduled_for, onChange: (e) => setForm({ ...form, scheduled_for: e.target.value }), className: "rounded border border-zinc-700 bg-zinc-900 px-2 py-1 text-sm" }), _jsx("button", { onClick: () => { setShowSchedule(false); setForm({ ...form, scheduled_for: '' }); }, className: "text-xs text-zinc-500 hover:text-zinc-300", children: "Cancel" })] }) })), sendError && (_jsx("div", { className: "border-t border-red-900/50 bg-red-950/40 px-4 py-2 text-sm text-red-300", children: sendError })), _jsxs("div", { className: "flex items-center justify-between border-t border-zinc-800 px-4 py-3", children: [_jsxs("div", { className: "flex items-center gap-2", children: [_jsxs("button", { onClick: handleSend, disabled: !form.to || fetcher.state !== 'idle', className: "flex items-center gap-2 rounded bg-emerald-600 px-4 py-1.5 text-sm font-medium hover:bg-emerald-500 disabled:opacity-50", children: [_jsx(Send, { size: 14 }), fetcher.state !== 'idle'
                                                    ? 'Sending…'
                                                    : form.scheduled_for
                                                        ? 'Schedule'
                                                        : 'Send'] }), savedState === 'saving' && _jsx("span", { className: "text-xs text-zinc-500", children: "Saving\u2026" }), savedState === 'saved' && _jsx("span", { className: "text-xs text-zinc-500", children: "Saved" }), savedState === 'failed' && _jsx("span", { className: "text-xs text-amber-400", children: "Save failed" }), _jsx("button", { onClick: () => setShowSchedule(!showSchedule), className: "rounded p-1.5 hover:bg-zinc-800", title: "Schedule send", children: _jsx(Clock, { size: 16 }) }), replyTo && (_jsx(AIDraftButton, { emailId: replyTo.id, onDraft: (draft) => setForm((f) => ({ ...f, body: draft })) }))] }), _jsxs("div", { className: "flex items-center gap-3", children: [_jsx(TemplateSelector, { onSelect: ({ subject, body }) => {
                                                setForm((f) => ({ ...f, subject: subject || f.subject, body }));
                                            } }), _jsx(SaveAsTemplateButton, { subject: form.subject, body: form.body }), _jsx("button", { className: "rounded p-1.5 hover:bg-zinc-800", title: "Attach files", children: _jsx(Paperclip, { size: 16 }) }), _jsx("button", { onClick: handleDiscard, className: "rounded p-1.5 text-zinc-500 hover:bg-zinc-800 hover:text-red-400", title: "Discard", children: _jsx(Trash2, { size: 16 }) })] })] })] })] }) }));
}
