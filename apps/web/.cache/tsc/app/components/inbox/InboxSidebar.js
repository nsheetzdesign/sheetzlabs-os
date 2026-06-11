import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
import { useState, useEffect, useRef } from 'react';
import { Link, Form, useFetcher } from 'react-router';
import { Inbox, Star, Clock, Send, File, AlertTriangle, Trash2, Mail, ChevronDown, ChevronRight, ChevronUp, Plus, Tag, RefreshCw, Check, AlertCircle, } from 'lucide-react';
const systemIcons = {
    Inbox,
    Star,
    Clock,
    Send,
    File,
    AlertTriangle,
    Trash2,
    Mail,
    Tag,
};
export function InboxSidebar({ accounts, counts, globalCounts, activeFolder, activeAccountId, activeLabel, onSelectFolder, onSelectLabel, onDragOver, onDrop, }) {
    // All accounts start collapsed, but auto-expand active account
    const [expandedAccounts, setExpandedAccounts] = useState(new Set());
    const prevActiveAccountId = useRef(null);
    useEffect(() => {
        if (activeAccountId && activeAccountId !== prevActiveAccountId.current) {
            prevActiveAccountId.current = activeAccountId;
            setExpandedAccounts(prev => {
                if (prev.has(activeAccountId))
                    return prev;
                return new Set([...prev, activeAccountId]);
            });
        }
    }, [activeAccountId]);
    const [expandedLabels, setExpandedLabels] = useState(new Set());
    const [dragOverTarget, setDragOverTarget] = useState(null);
    const fetcher = useFetcher();
    const toggleAccount = (accountId) => {
        const next = new Set(expandedAccounts);
        if (next.has(accountId))
            next.delete(accountId);
        else
            next.add(accountId);
        setExpandedAccounts(next);
    };
    const toggleLabels = (accountId) => {
        const next = new Set(expandedLabels);
        if (next.has(accountId))
            next.delete(accountId);
        else
            next.add(accountId);
        setExpandedLabels(next);
    };
    const handleDragOver = (e, targetId, type, accountId) => {
        e.preventDefault();
        setDragOverTarget(type === 'folder' ? `${accountId}-${targetId}` : `${accountId}-label-${targetId}`);
        onDragOver(e, { type, id: targetId, accountId });
    };
    const handleDragLeave = () => setDragOverTarget(null);
    const handleDrop = (e, targetId, type, accountId) => {
        e.preventDefault();
        setDragOverTarget(null);
        onDrop(e, { type, id: targetId, accountId });
    };
    const isAllInboxesActive = activeFolder === 'inbox' && activeAccountId === null;
    return (_jsxs("div", { className: "w-56 border-r border-zinc-800 flex flex-col h-full overflow-hidden", children: [_jsx("div", { className: "p-3", children: _jsxs(Link, { to: "/dashboard/inbox/compose", className: "flex items-center justify-center gap-2 w-full px-4 py-2.5 bg-emerald-600 hover:bg-emerald-500 rounded-lg text-sm font-medium transition-colors", children: [_jsx(Plus, { size: 18 }), "Compose"] }) }), _jsx("div", { className: "px-2 mb-1", children: _jsxs("button", { onClick: () => onSelectFolder('inbox', null), className: `flex items-center gap-3 w-full px-3 py-2 rounded text-sm transition-colors ${isAllInboxesActive
                        ? 'bg-emerald-500/20 text-emerald-400 font-medium'
                        : 'text-zinc-300 hover:bg-zinc-800'}`, children: [_jsx(Inbox, { size: 16 }), _jsx("span", { className: "flex-1 text-left", children: "All Inboxes" }), globalCounts.inbox > 0 && (_jsx("span", { className: `text-xs px-1.5 py-0.5 rounded ${isAllInboxesActive ? 'bg-emerald-500/20 text-emerald-400' : 'text-zinc-500'}`, children: globalCounts.inbox }))] }) }), _jsx("div", { className: "border-t border-zinc-800 mx-2 mb-1" }), _jsxs("div", { className: "flex-1 overflow-auto px-2 pb-4", children: [accounts.map((account) => {
                        const accountCounts = counts[account.id] || {};
                        const isExpanded = expandedAccounts.has(account.id);
                        const systemLabels = account.labels.filter(l => l.type === 'system');
                        const userLabels = account.labels.filter(l => l.type === 'user');
                        const labelsExpanded = expandedLabels.has(account.id);
                        return (_jsxs("div", { className: "mb-1", children: [_jsxs("button", { onClick: () => toggleAccount(account.id), className: `flex items-center gap-2 w-full px-2 py-1.5 text-left rounded group ${isExpanded ? 'bg-zinc-800/50' : 'hover:bg-zinc-800/30'}`, children: [isExpanded
                                            ? _jsx(ChevronDown, { size: 14, className: "text-zinc-500 flex-shrink-0" })
                                            : _jsx(ChevronRight, { size: 14, className: "text-zinc-500 flex-shrink-0" }), _jsx("span", { className: "text-sm truncate flex-1 text-zinc-400", children: account.email.split('@')[0] }), !isExpanded && (accountCounts.inbox ?? 0) > 0 && (_jsx("span", { className: "text-xs text-zinc-500", children: accountCounts.inbox }))] }), isExpanded && (_jsxs("div", { className: "mt-1 ml-2 space-y-0.5 border-l border-zinc-800 pl-2", children: [systemLabels.map((label) => {
                                            const Icon = systemIcons[label.icon || 'Mail'] || Mail;
                                            const count = getFolderCount(label.name, accountCounts);
                                            const isActive = activeFolder === label.name.toLowerCase() && activeAccountId === account.id;
                                            const isDragOver = dragOverTarget === `${account.id}-${label.name}`;
                                            return (_jsxs("button", { onClick: () => onSelectFolder(label.name.toLowerCase(), account.id), onDragOver: (e) => handleDragOver(e, label.name, 'folder', account.id), onDragLeave: handleDragLeave, onDrop: (e) => handleDrop(e, label.name, 'folder', account.id), className: `flex items-center gap-2 w-full px-2 py-1 rounded text-xs transition-colors ${isActive
                                                    ? 'bg-zinc-800 text-white'
                                                    : isDragOver
                                                        ? 'bg-emerald-500/20 text-emerald-400'
                                                        : 'text-zinc-400 hover:bg-zinc-800/50 hover:text-white'}`, children: [_jsx(Icon, { size: 14 }), _jsx("span", { className: "flex-1 text-left", children: label.name }), count > 0 && (_jsx("span", { className: `text-xs ${isActive ? 'text-zinc-300' : 'text-zinc-500'}`, children: count }))] }, label.id));
                                        }), userLabels.length > 0 && (_jsxs("div", { className: "mt-1", children: [_jsxs("button", { onClick: () => toggleLabels(account.id), className: "flex items-center gap-1 w-full px-2 py-1 text-xs text-zinc-500 hover:text-zinc-300", children: [labelsExpanded ? _jsx(ChevronDown, { size: 10 }) : _jsx(ChevronRight, { size: 10 }), "Labels (", userLabels.length, ")"] }), labelsExpanded && (_jsxs("div", { className: "mt-0.5 space-y-0.5", children: [userLabels.map((label) => {
                                                            const isActive = activeLabel === label.id;
                                                            const isDragOver = dragOverTarget === `${account.id}-label-${label.id}`;
                                                            return (_jsxs("button", { onClick: () => onSelectLabel(label.id, account.id), onDragOver: (e) => handleDragOver(e, label.id, 'label', account.id), onDragLeave: handleDragLeave, onDrop: (e) => handleDrop(e, label.id, 'label', account.id), className: `flex items-center gap-2 w-full px-2 py-1 rounded text-xs transition-colors ${isActive
                                                                    ? 'bg-zinc-800 text-white'
                                                                    : isDragOver
                                                                        ? 'bg-emerald-500/20 text-emerald-400'
                                                                        : 'text-zinc-400 hover:bg-zinc-800/50 hover:text-white'}`, children: [_jsx("span", { className: "w-2 h-2 rounded-sm flex-shrink-0", style: { backgroundColor: label.color } }), _jsx("span", { className: "flex-1 text-left truncate", children: label.name })] }, label.id));
                                                        }), _jsxs("button", { onClick: () => {
                                                                const name = prompt('Label name:');
                                                                if (name) {
                                                                    fetcher.submit({ account_id: account.id, name }, { method: 'post', action: '/dashboard/inbox/labels' });
                                                                }
                                                            }, className: "flex items-center gap-2 w-full px-2 py-1 text-xs text-zinc-500 hover:text-zinc-300", children: [_jsx(Plus, { size: 12 }), "Create label"] })] }))] }))] }))] }, account.id));
                    }), accounts.length === 0 && (_jsx(Form, { method: "post", action: "/dashboard/inbox/connect-gmail", children: _jsxs("button", { type: "submit", className: "flex items-center gap-2 px-3 py-2 text-sm text-emerald-400 hover:text-emerald-300", children: [_jsx(Plus, { size: 16 }), "Connect Gmail"] }) }))] }), _jsx(SyncButton, {})] }));
}
function SyncButton() {
    const syncFetcher = useFetcher();
    const fullSyncFetcher = useFetcher();
    const [showDetails, setShowDetails] = useState(false);
    const [lastResult, setLastResult] = useState(null);
    const [lastSyncTime, setLastSyncTime] = useState(null);
    const [, setTick] = useState(0);
    const isLoading = syncFetcher.state === 'submitting' || syncFetcher.state === 'loading';
    const isFullSyncing = fullSyncFetcher.state === 'submitting' || fullSyncFetcher.state === 'loading';
    useEffect(() => {
        if (syncFetcher.data && syncFetcher.state === 'idle') {
            setLastResult(syncFetcher.data);
            setLastSyncTime(new Date());
            // No auto-expand
        }
    }, [syncFetcher.data, syncFetcher.state]);
    const handleFullSync = (accountId) => {
        if (window.confirm('This will download ALL emails from this account. This may take several minutes. Continue?')) {
            fullSyncFetcher.submit({ intent: 'full-sync', accountId }, { method: 'post', action: '/dashboard/inbox/sync' });
        }
    };
    // Update relative time every minute
    useEffect(() => {
        const interval = setInterval(() => setTick(t => t + 1), 60000);
        return () => clearInterval(interval);
    }, []);
    const hasError = lastResult?.accounts?.some(a => !a.success);
    const formatRelativeTime = (date) => {
        const seconds = Math.floor((Date.now() - date.getTime()) / 1000);
        if (seconds < 60)
            return 'just now';
        const minutes = Math.floor(seconds / 60);
        if (minutes < 60)
            return `${minutes}m ago`;
        const hours = Math.floor(minutes / 60);
        if (hours < 24)
            return `${hours}h ago`;
        return date.toLocaleDateString();
    };
    return (_jsxs("div", { className: "border-t border-zinc-800", children: [_jsxs("div", { className: "p-3", children: [_jsx(syncFetcher.Form, { method: "post", action: "/dashboard/inbox/sync", children: _jsx("button", { type: "submit", disabled: isLoading, className: "flex items-center justify-center gap-2 w-full px-3 py-2 text-sm text-zinc-400 hover:text-zinc-200 hover:bg-zinc-800 rounded-md transition-colors disabled:opacity-50", children: isLoading ? (_jsxs(_Fragment, { children: [_jsx(RefreshCw, { className: "w-4 h-4 animate-spin" }), _jsx("span", { children: "Syncing..." })] })) : hasError ? (_jsxs(_Fragment, { children: [_jsx(AlertCircle, { className: "w-4 h-4 text-amber-500" }), _jsx("span", { className: "text-amber-500", children: "Sync completed with errors" })] })) : (_jsxs(_Fragment, { children: [_jsx(RefreshCw, { className: "w-4 h-4" }), _jsx("span", { children: "Sync All Inboxes" })] })) }) }), lastSyncTime && (_jsxs("p", { className: "mt-1 text-xs text-zinc-600 text-center", children: ["Last synced: ", formatRelativeTime(lastSyncTime)] }))] }), lastResult && (_jsxs("div", { className: "border-t border-zinc-800", children: [_jsxs("button", { onClick: () => setShowDetails(!showDetails), className: "flex items-center justify-between w-full px-3 py-2 text-xs text-zinc-500 hover:text-zinc-400", children: [_jsx("span", { children: "Sync Details" }), showDetails ? _jsx(ChevronUp, { className: "w-3 h-3" }) : _jsx(ChevronDown, { className: "w-3 h-3" })] }), showDetails && (_jsxs("div", { className: "px-3 pb-3 space-y-2 text-xs", children: [lastResult.accounts?.map((account, i) => (_jsxs("div", { className: `p-2 rounded ${account.success ? 'bg-zinc-900' : 'bg-red-950/30'}`, children: [_jsxs("div", { className: "flex items-center justify-between", children: [_jsx("span", { className: "text-zinc-300 font-medium truncate max-w-[140px]", children: account.email }), account.success ? (_jsx(Check, { className: "w-3 h-3 text-emerald-500 flex-shrink-0" })) : (_jsx(AlertCircle, { className: "w-3 h-3 text-red-500 flex-shrink-0" }))] }), account.success ? (_jsxs("div", { className: "mt-1 text-zinc-500 space-y-0.5", children: [_jsxs("div", { children: ["Labels: ", account.labels?.total || 0, " total, ", account.labels?.user || 0, " custom"] }), (account.labels?.userLabelNames?.length ?? 0) > 0 && (_jsxs("div", { className: "text-emerald-600", children: ["\u2192 ", account.labels.userLabelNames.slice(0, 5).join(', '), account.labels.userLabelNames.length > 5 && '...'] })), _jsxs("div", { children: ["Emails: ", account.emails?.synced || 0, " synced"] })] })) : (_jsx("div", { className: "mt-1 text-red-400", children: account.error || 'Unknown error' })), account.accountId && (_jsx("button", { onClick: () => handleFullSync(account.accountId), disabled: isFullSyncing, className: "mt-2 w-full px-2 py-1 text-xs text-zinc-400 hover:text-zinc-200 bg-zinc-800 hover:bg-zinc-700 rounded transition-colors disabled:opacity-50 disabled:cursor-not-allowed", children: isFullSyncing ? (_jsxs("span", { className: "flex items-center justify-center gap-1", children: [_jsx(RefreshCw, { className: "w-3 h-3 animate-spin" }), "Downloading all..."] })) : ('Download All Emails') }))] }, i))), fullSyncFetcher.data && (_jsx("div", { className: `p-2 rounded text-xs ${fullSyncFetcher.data.success ? 'bg-emerald-900/20 text-emerald-400' : 'bg-red-900/20 text-red-400'}`, children: fullSyncFetcher.data.success
                                    ? `Downloaded ${fullSyncFetcher.data.totalSynced ?? 0} emails (${fullSyncFetcher.data.pages ?? 0} pages)`
                                    : `Error: ${fullSyncFetcher.data.error}` })), _jsx("button", { onClick: () => { setLastResult(null); setShowDetails(false); }, className: "text-zinc-600 hover:text-zinc-400 text-xs", children: "Clear" })] }))] }))] }));
}
function getFolderCount(folder, counts) {
    const map = {
        Inbox: 'inbox',
        Starred: 'starred',
        Snoozed: 'snoozed',
        Drafts: 'drafts',
        Spam: 'spam',
        Trash: 'trash',
    };
    return counts[map[folder]] || 0;
}
