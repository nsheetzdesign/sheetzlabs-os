import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
import { useState, useRef } from 'react';
import { useFetcher } from 'react-router';
import { Star, Archive, Trash2, Clock, MoreHorizontal, CheckSquare, Square, Paperclip, RefreshCw, } from 'lucide-react';
import { SnoozePicker } from './SnoozePicker';
export function EmailList({ emails, selectedIds, activeEmailId, focusedIndex, onSelect, onSelectAll, onClearSelection, onOpen, onDragStart, }) {
    const fetcher = useFetcher();
    const [hoveredId, setHoveredId] = useState(null);
    const [snoozeEmailId, setSnoozeEmailId] = useState(null);
    const [snoozePosition, setSnoozePosition] = useState(null);
    const listRef = useRef(null);
    const handleBulkAction = (action) => {
        if (selectedIds.size === 0)
            return;
        fetcher.submit({ action, email_ids: JSON.stringify(Array.from(selectedIds)) }, { method: 'post', action: '/dashboard/inbox/bulk' });
        onClearSelection();
    };
    const handleQuickAction = (e, emailId, action) => {
        e.stopPropagation();
        fetcher.submit({ action, email_ids: JSON.stringify([emailId]) }, { method: 'post', action: '/dashboard/inbox/bulk' });
    };
    const handleDragStart = (e, email) => {
        const ids = selectedIds.has(email.id)
            ? Array.from(selectedIds)
            : [email.id];
        e.dataTransfer.setData('text/plain', JSON.stringify(ids));
        e.dataTransfer.effectAllowed = 'move';
        onDragStart(e, ids);
    };
    const formatDate = (dateStr) => {
        if (!dateStr)
            return '';
        const date = new Date(dateStr);
        const now = new Date();
        const diff = now.getTime() - date.getTime();
        const days = Math.floor(diff / (1000 * 60 * 60 * 24));
        if (days === 0)
            return date.toLocaleTimeString([], { hour: 'numeric', minute: '2-digit' });
        if (days === 1)
            return 'Yesterday';
        if (days < 7)
            return date.toLocaleDateString([], { weekday: 'short' });
        return date.toLocaleDateString([], { month: 'short', day: 'numeric' });
    };
    return (_jsxs("div", { className: "flex flex-col h-full", children: [_jsxs("div", { className: "flex items-center gap-2 px-4 py-2 border-b border-zinc-800 bg-zinc-900/50", children: [_jsx("button", { onClick: () => selectedIds.size === emails.length ? onClearSelection() : onSelectAll(), className: "p-1.5 hover:bg-zinc-800 rounded", title: "Select all", children: selectedIds.size === emails.length && emails.length > 0 ? (_jsx(CheckSquare, { size: 18, className: "text-emerald-400" })) : (_jsx(Square, { size: 18 })) }), selectedIds.size > 0 && (_jsxs(_Fragment, { children: [_jsx("div", { className: "h-4 w-px bg-zinc-700" }), _jsxs("span", { className: "text-sm text-zinc-400", children: [selectedIds.size, " selected"] }), _jsx("div", { className: "h-4 w-px bg-zinc-700" }), _jsx("button", { onClick: () => handleBulkAction('archive'), className: "p-1.5 hover:bg-zinc-800 rounded", title: "Archive", children: _jsx(Archive, { size: 18 }) }), _jsx("button", { onClick: () => handleBulkAction('trash'), className: "p-1.5 hover:bg-zinc-800 rounded", title: "Delete", children: _jsx(Trash2, { size: 18 }) }), _jsx("button", { onClick: () => handleBulkAction('read'), className: "p-1.5 hover:bg-zinc-800 rounded", title: "Mark as read", children: _jsx(MoreHorizontal, { size: 18 }) })] })), _jsx("div", { className: "flex-1" }), _jsxs("button", { onClick: () => fetcher.submit({}, { method: 'post', action: '/dashboard/inbox/sync' }), disabled: fetcher.state !== 'idle', className: "flex items-center gap-1.5 text-xs text-zinc-500 hover:text-zinc-300 disabled:opacity-50", children: [_jsx(RefreshCw, { size: 13, className: fetcher.state !== 'idle' ? 'animate-spin' : '' }), fetcher.state !== 'idle' ? 'Syncing...' : 'Refresh'] })] }), _jsx("div", { ref: listRef, className: "flex-1 overflow-auto", children: emails.length === 0 ? (_jsx("div", { className: "flex items-center justify-center h-full text-zinc-500", children: "No emails" })) : (emails.map((email, index) => {
                    const isSelected = selectedIds.has(email.id);
                    const isActive = activeEmailId === email.id;
                    const isHovered = hoveredId === email.id;
                    const isFocused = focusedIndex === index;
                    return (_jsxs("div", { draggable: true, onDragStart: (e) => handleDragStart(e, email), onClick: () => onOpen(email), onMouseEnter: () => setHoveredId(email.id), onMouseLeave: () => setHoveredId(null), className: `flex items-center gap-3 px-4 py-2 border-b border-zinc-800/50 cursor-pointer transition-colors ${isActive
                            ? 'bg-zinc-800'
                            : isSelected
                                ? 'bg-zinc-800/50'
                                : email.is_read
                                    ? 'hover:bg-zinc-900'
                                    : 'bg-zinc-900/30 hover:bg-zinc-900'} ${isFocused && !isActive ? 'ring-1 ring-inset ring-emerald-500/40' : ''}`, children: [_jsx("button", { onClick: (e) => {
                                    e.stopPropagation();
                                    onSelect(email.id, e.shiftKey);
                                }, className: "p-0.5", children: isSelected ? (_jsx(CheckSquare, { size: 16, className: "text-emerald-400" })) : (_jsx(Square, { size: 16, className: "text-zinc-600" })) }), _jsx("button", { onClick: (e) => handleQuickAction(e, email.id, email.is_starred ? 'unstar' : 'star'), className: "p-0.5", children: _jsx(Star, { size: 16, className: email.is_starred ? 'text-amber-400 fill-amber-400' : 'text-zinc-600' }) }), _jsxs("div", { className: "flex-1 min-w-0", children: [_jsxs("div", { className: "flex items-center gap-2", children: [_jsx("span", { className: `text-sm truncate ${email.is_read ? 'text-zinc-400' : 'font-semibold text-white'}`, children: email.from_name || email.from_email }), email.has_attachments && (_jsx(Paperclip, { size: 14, className: "text-zinc-500 flex-shrink-0" }))] }), _jsxs("div", { className: "flex items-center gap-2", children: [_jsx("span", { className: `text-sm truncate ${email.is_read ? 'text-zinc-500' : 'text-zinc-300'}`, children: email.subject || '(no subject)' }), _jsxs("span", { className: "text-sm text-zinc-600 truncate", children: ["\u2014 ", email.snippet] })] })] }), isHovered && (_jsxs("div", { className: "flex items-center gap-1", children: [_jsx("button", { onClick: (e) => handleQuickAction(e, email.id, 'archive'), className: "p-1.5 hover:bg-zinc-700 rounded", title: "Archive", children: _jsx(Archive, { size: 16 }) }), _jsx("button", { onClick: (e) => handleQuickAction(e, email.id, 'trash'), className: "p-1.5 hover:bg-zinc-700 rounded", title: "Delete", children: _jsx(Trash2, { size: 16 }) }), _jsx("button", { onClick: (e) => {
                                            e.stopPropagation();
                                            const rect = e.currentTarget.getBoundingClientRect();
                                            setSnoozePosition({ x: rect.right, y: rect.bottom });
                                            setSnoozeEmailId(email.id);
                                        }, className: "p-1.5 hover:bg-zinc-700 rounded", title: "Snooze", children: _jsx(Clock, { size: 16 }) })] })), !isHovered && (_jsx("span", { className: `text-xs flex-shrink-0 ${email.is_read ? 'text-zinc-500' : 'text-zinc-400'}`, children: formatDate(email.received_at) }))] }, email.id));
                })) }), snoozeEmailId && (_jsx(SnoozePicker, { emailId: snoozeEmailId, isOpen: true, onClose: () => {
                    setSnoozeEmailId(null);
                    setSnoozePosition(null);
                }, position: snoozePosition || undefined }))] }));
}
