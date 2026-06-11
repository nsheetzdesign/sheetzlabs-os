import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState } from 'react';
import { useFetcher } from 'react-router';
import { ChevronDown, ChevronUp, Reply, ReplyAll, Forward, Star, Archive, Trash2 } from 'lucide-react';
import { EmailHtmlFrame } from './EmailHtmlFrame';
export function ThreadView({ emails, onReply, onReplyAll, onForward, onClose }) {
    const fetcher = useFetcher();
    const [expandedIds, setExpandedIds] = useState(new Set([emails[emails.length - 1]?.id]));
    const toggleExpand = (id) => {
        setExpandedIds((prev) => {
            const next = new Set(prev);
            if (next.has(id)) {
                next.delete(id);
            }
            else {
                next.add(id);
            }
            return next;
        });
    };
    const expandAll = () => setExpandedIds(new Set(emails.map((e) => e.id)));
    const collapseAll = () => setExpandedIds(new Set([emails[emails.length - 1]?.id]));
    const formatDate = (dateStr) => {
        const date = new Date(dateStr);
        return date.toLocaleString([], {
            month: 'short',
            day: 'numeric',
            hour: 'numeric',
            minute: '2-digit',
        });
    };
    if (emails.length === 0)
        return null;
    const subject = emails[0]?.subject || '(no subject)';
    return (_jsxs("div", { className: "flex flex-col h-full", children: [_jsxs("div", { className: "flex items-center justify-between px-6 py-4 border-b border-zinc-800", children: [_jsxs("div", { children: [_jsx("h1", { className: "text-xl font-semibold", children: subject }), _jsxs("div", { className: "flex items-center gap-2 mt-1 text-sm text-zinc-500", children: [_jsxs("span", { children: [emails.length, " messages"] }), _jsx("span", { children: "\u00B7" }), _jsx("button", { onClick: expandAll, className: "hover:text-zinc-300", children: "Expand all" }), _jsx("span", { children: "\u00B7" }), _jsx("button", { onClick: collapseAll, className: "hover:text-zinc-300", children: "Collapse all" })] })] }), _jsxs("div", { className: "flex items-center gap-2", children: [_jsx("button", { onClick: () => {
                                    fetcher.submit({ action: 'archive', email_ids: JSON.stringify(emails.map((e) => e.id)) }, { method: 'post', action: '/dashboard/inbox/bulk' });
                                    onClose();
                                }, className: "p-2 hover:bg-zinc-800 rounded", title: "Archive all", children: _jsx(Archive, { size: 18 }) }), _jsx("button", { onClick: () => {
                                    fetcher.submit({ action: 'trash', email_ids: JSON.stringify(emails.map((e) => e.id)) }, { method: 'post', action: '/dashboard/inbox/bulk' });
                                    onClose();
                                }, className: "p-2 hover:bg-zinc-800 rounded", title: "Delete all", children: _jsx(Trash2, { size: 18 }) })] })] }), _jsx("div", { className: "flex-1 overflow-auto", children: emails.map((email, index) => {
                    const isExpanded = expandedIds.has(email.id);
                    const isLatest = index === emails.length - 1;
                    return (_jsxs("div", { className: `border-b border-zinc-800/50 ${isExpanded ? 'bg-zinc-900/30' : ''}`, children: [_jsxs("button", { onClick: () => toggleExpand(email.id), className: "flex items-center gap-3 w-full px-6 py-3 text-left hover:bg-zinc-800/30", children: [isExpanded ? (_jsx(ChevronUp, { size: 16, className: "text-zinc-500" })) : (_jsx(ChevronDown, { size: 16, className: "text-zinc-500" })), _jsx("div", { className: "w-8 h-8 rounded-full bg-zinc-700 flex items-center justify-center text-sm font-medium flex-shrink-0", children: (email.from_name || email.from_email)[0]?.toUpperCase() }), _jsxs("div", { className: "flex-1 min-w-0", children: [_jsxs("div", { className: "flex items-center gap-2", children: [_jsx("span", { className: `text-sm ${email.is_read ? 'text-zinc-400' : 'font-semibold'}`, children: email.from_name || email.from_email }), email.is_starred && _jsx(Star, { size: 14, className: "text-amber-400 fill-amber-400" })] }), !isExpanded && (_jsxs("p", { className: "text-sm text-zinc-500 truncate", children: [email.body_text?.slice(0, 100), "..."] }))] }), _jsx("span", { className: "text-xs text-zinc-500 flex-shrink-0", children: formatDate(email.received_at) })] }), isExpanded && (_jsxs("div", { className: "px-6 pb-4", children: [_jsx("div", { className: "flex items-start gap-3 mb-4 pl-7", children: _jsx("div", { className: "flex-1 text-sm", children: _jsxs("div", { className: "text-zinc-400", children: ["to ", email.to_emails?.split(',')[0], email.cc_emails && `, cc: ${email.cc_emails.split(',')[0]}`] }) }) }), _jsx("div", { className: "pl-7 prose prose-invert prose-sm max-w-none", children: email.body_html ? (_jsx(EmailHtmlFrame, { html: email.body_html })) : (_jsx("pre", { className: "whitespace-pre-wrap font-sans", children: email.body_text })) }), _jsxs("div", { className: "flex items-center gap-2 mt-4 pl-7", children: [_jsxs("button", { onClick: () => onReply(email), className: "flex items-center gap-2 px-3 py-1.5 bg-zinc-800 hover:bg-zinc-700 rounded text-sm", children: [_jsx(Reply, { size: 14 }), "Reply"] }), _jsxs("button", { onClick: () => onReplyAll(email), className: "flex items-center gap-2 px-3 py-1.5 bg-zinc-800 hover:bg-zinc-700 rounded text-sm", children: [_jsx(ReplyAll, { size: 14 }), "Reply All"] }), _jsxs("button", { onClick: () => onForward(email), className: "flex items-center gap-2 px-3 py-1.5 bg-zinc-800 hover:bg-zinc-700 rounded text-sm", children: [_jsx(Forward, { size: 14 }), "Forward"] })] })] }))] }, email.id));
                }) }), _jsx("div", { className: "border-t border-zinc-800 p-4", children: _jsx("button", { onClick: () => onReply(emails[emails.length - 1]), className: "w-full px-4 py-3 border border-zinc-700 hover:border-zinc-600 rounded-lg text-left text-zinc-500 hover:text-zinc-300", children: "Click here to reply..." }) })] }));
}
