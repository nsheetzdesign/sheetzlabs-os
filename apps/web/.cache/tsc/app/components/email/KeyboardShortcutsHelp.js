import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { X } from 'lucide-react';
const shortcuts = [
    {
        category: 'Navigation',
        items: [
            { key: 'j', description: 'Next email' },
            { key: 'k', description: 'Previous email' },
            { key: 'o / Enter', description: 'Open email' },
            { key: 'u', description: 'Close preview' },
            { key: 'Escape', description: 'Close / go back' },
        ],
    },
    {
        category: 'Actions',
        items: [
            { key: 'e', description: 'Archive' },
            { key: '#', description: 'Delete' },
            { key: 's', description: 'Star / unstar' },
            { key: 'x', description: 'Select email' },
        ],
    },
    {
        category: 'Compose & Reply',
        items: [
            { key: 'c', description: 'Compose new email' },
            { key: 'r', description: 'Reply' },
            { key: 'a', description: 'Reply all' },
            { key: 'f', description: 'Forward' },
        ],
    },
    {
        category: 'Other',
        items: [
            { key: '/', description: 'Focus search' },
            { key: '?', description: 'Show this help' },
        ],
    },
];
export function KeyboardShortcutsHelp({ isOpen, onClose }) {
    if (!isOpen)
        return null;
    return (_jsxs("div", { className: "fixed inset-0 z-50 flex items-center justify-center", children: [_jsx("div", { className: "absolute inset-0 bg-black/60 backdrop-blur-sm", onClick: onClose }), _jsxs("div", { className: "relative bg-zinc-900 border border-zinc-700 rounded-lg shadow-xl w-full max-w-lg p-6", children: [_jsxs("div", { className: "flex items-center justify-between mb-5", children: [_jsx("h2", { className: "text-lg font-semibold text-zinc-100", children: "Keyboard Shortcuts" }), _jsx("button", { onClick: onClose, className: "p-1 text-zinc-400 hover:text-zinc-200 rounded transition-colors", children: _jsx(X, { className: "w-5 h-5" }) })] }), _jsx("div", { className: "grid grid-cols-2 gap-6", children: shortcuts.map(({ category, items }) => (_jsxs("div", { children: [_jsx("h3", { className: "text-xs font-medium text-zinc-500 uppercase tracking-wider mb-2", children: category }), _jsx("div", { className: "space-y-1.5", children: items.map(({ key, description }) => (_jsxs("div", { className: "flex items-center justify-between", children: [_jsx("span", { className: "text-sm text-zinc-300", children: description }), _jsx("kbd", { className: "px-2 py-0.5 text-xs font-mono bg-zinc-800 border border-zinc-700 rounded text-zinc-300", children: key })] }, key))) })] }, category))) }), _jsxs("p", { className: "mt-6 text-xs text-zinc-500 text-center", children: ["Press", ' ', _jsx("kbd", { className: "px-1 py-0.5 bg-zinc-800 border border-zinc-700 rounded font-mono", children: "?" }), ' ', "anytime to show this help"] })] })] }));
}
