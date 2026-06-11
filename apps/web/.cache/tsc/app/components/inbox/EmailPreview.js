import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState } from 'react';
import { useFetcher } from 'react-router';
import { EmailHtmlFrame } from './EmailHtmlFrame';
import { Star, Archive, Trash2, Clock, Reply, ReplyAll, Forward, ChevronDown, ChevronUp, MoreHorizontal, X, } from 'lucide-react';
export function EmailPreview({ email, onClose, onReply, onReplyAll, onForward, onBulkAction }) {
    const fetcher = useFetcher();
    const [showDetails, setShowDetails] = useState(false);
    if (!email) {
        return (_jsx("div", { className: "flex items-center justify-center h-full text-zinc-500", children: _jsxs("div", { className: "text-center", children: [_jsx("div", { className: "text-4xl mb-2", children: "\uD83D\uDCEC" }), _jsx("p", { children: "Select an email to read" })] }) }));
    }
    const handleAction = (action) => {
        // Route view-removing actions through parent so it can advance to next email
        if (onBulkAction && ['trash', 'archive', 'spam'].includes(action)) {
            onBulkAction(action);
            return;
        }
        fetcher.submit({ action, email_ids: JSON.stringify([email.id]) }, { method: 'post', action: '/dashboard/inbox/bulk' });
    };
    const formatDate = (dateStr) => {
        if (!dateStr)
            return '';
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
    return (_jsxs("div", { className: "flex flex-col h-full", children: [_jsxs("div", { className: "flex items-center gap-2 px-4 py-3 border-b border-zinc-800", children: [_jsx("button", { onClick: onClose, className: "p-1.5 hover:bg-zinc-800 rounded md:hidden", children: _jsx(X, { size: 18 }) }), _jsx("div", { className: "flex-1" }), _jsx("button", { onClick: () => handleAction('archive'), className: "p-1.5 hover:bg-zinc-800 rounded", title: "Archive", children: _jsx(Archive, { size: 18 }) }), _jsx("button", { onClick: () => handleAction('trash'), className: "p-1.5 hover:bg-zinc-800 rounded", title: "Delete", children: _jsx(Trash2, { size: 18 }) }), _jsx("button", { onClick: () => handleAction(email.is_starred ? 'unstar' : 'star'), className: "p-1.5 hover:bg-zinc-800 rounded", title: email.is_starred ? 'Unstar' : 'Star', children: _jsx(Star, { size: 18, className: email.is_starred ? 'text-amber-400 fill-amber-400' : '' }) }), _jsx("button", { className: "p-1.5 hover:bg-zinc-800 rounded", title: "Snooze", children: _jsx(Clock, { size: 18 }) }), _jsx("button", { className: "p-1.5 hover:bg-zinc-800 rounded", title: "More", children: _jsx(MoreHorizontal, { size: 18 }) })] }), _jsx("div", { className: "flex-1 overflow-auto", children: _jsxs("div", { className: "p-6", children: [_jsx("h1", { className: "text-xl font-semibold mb-4", children: email.subject || '(no subject)' }), email.labels && email.labels.length > 0 && (_jsx("div", { className: "flex gap-2 mb-4", children: email.labels.map((label) => (_jsx("span", { className: "px-2 py-0.5 rounded text-xs", style: { backgroundColor: `${label.color}20`, color: label.color }, children: label.name }, label.id))) })), _jsxs("div", { className: "flex items-start gap-3 mb-4", children: [_jsx("div", { className: "w-10 h-10 rounded-full bg-zinc-700 flex items-center justify-center text-lg font-semibold", children: senderInitial }), _jsxs("div", { className: "flex-1 min-w-0", children: [_jsxs("div", { className: "flex items-center gap-2", children: [_jsx("span", { className: "font-medium", children: email.from_name || email.from_email }), _jsxs("span", { className: "text-sm text-zinc-500", children: ["<", email.from_email, ">"] })] }), _jsxs("button", { onClick: () => setShowDetails(!showDetails), className: "flex items-center gap-1 text-sm text-zinc-500 hover:text-zinc-300", children: ["to ", firstTo, showDetails ? _jsx(ChevronUp, { size: 14 }) : _jsx(ChevronDown, { size: 14 })] }), showDetails && (_jsxs("div", { className: "mt-2 text-sm text-zinc-400 space-y-1", children: [_jsxs("div", { children: ["To: ", toList.join(', ')] }), ccList.length > 0 && _jsxs("div", { children: ["Cc: ", ccList.join(', ')] }), _jsxs("div", { children: ["Date: ", formatDate(email.received_at)] })] }))] }), _jsx("span", { className: "text-sm text-zinc-500 flex-shrink-0", children: formatDate(email.received_at) })] }), email.ai_summary && (_jsxs("div", { className: "mb-6 p-4 bg-zinc-800/50 border border-zinc-700 rounded-lg", children: [_jsx("div", { className: "text-xs text-zinc-500 uppercase mb-1", children: "AI Summary" }), _jsx("p", { className: "text-sm", children: email.ai_summary })] })), _jsx("div", { className: "prose prose-invert prose-sm max-w-none", children: email.body_html ? (_jsx(EmailHtmlFrame, { html: email.body_html })) : email.body_text ? (_jsx("pre", { className: "whitespace-pre-wrap font-sans text-sm text-zinc-300", children: email.body_text })) : email.snippet ? (_jsx("p", { className: "text-zinc-300", children: email.snippet })) : (_jsx("p", { className: "text-zinc-500 italic", children: "No content" })) })] }) }), _jsxs("div", { className: "flex items-center gap-2 p-4 border-t border-zinc-800", children: [_jsxs("button", { onClick: onReply, className: "flex items-center gap-2 px-4 py-2 bg-zinc-800 hover:bg-zinc-700 rounded text-sm", children: [_jsx(Reply, { size: 16 }), "Reply"] }), _jsxs("button", { onClick: onReplyAll, className: "flex items-center gap-2 px-4 py-2 bg-zinc-800 hover:bg-zinc-700 rounded text-sm", children: [_jsx(ReplyAll, { size: 16 }), "Reply All"] }), _jsxs("button", { onClick: onForward, className: "flex items-center gap-2 px-4 py-2 bg-zinc-800 hover:bg-zinc-700 rounded text-sm", children: [_jsx(Forward, { size: 16 }), "Forward"] })] })] }));
}
