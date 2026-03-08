import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router";
import { Search, LayoutDashboard, Box, Rocket, DollarSign, Users, CheckSquare, BookOpen, Brain, X, } from "lucide-react";
const actions = [
    { label: "Command Center", icon: LayoutDashboard, to: "/dashboard" },
    { label: "Ventures", icon: Box, to: "/dashboard/ventures" },
    { label: "Pipeline", icon: Rocket, to: "/dashboard/pipeline" },
    { label: "Revenue", icon: DollarSign, to: "/dashboard/revenue" },
    { label: "Relationships", icon: Users, to: "/dashboard/relationships" },
    { label: "Tasks", icon: CheckSquare, to: "/dashboard/tasks" },
    { label: "Knowledge", icon: BookOpen, to: "/dashboard/knowledge" },
    { label: "AI Agents", icon: Brain, to: "/dashboard/agents" },
];
export function CommandPalette({ open, onClose, }) {
    const [query, setQuery] = useState("");
    const inputRef = useRef(null);
    const navigate = useNavigate();
    useEffect(() => {
        if (open) {
            setTimeout(() => inputRef.current?.focus(), 10);
            setQuery("");
        }
    }, [open]);
    const filtered = query
        ? actions.filter((a) => a.label.toLowerCase().includes(query.toLowerCase()))
        : actions;
    function select(to) {
        navigate(to);
        onClose();
    }
    if (!open)
        return null;
    return (_jsx("div", { className: "fixed inset-0 z-50 flex items-start justify-center bg-black/60 pt-24 backdrop-blur-sm", onClick: onClose, children: _jsxs("div", { className: "w-full max-w-lg rounded-xl border border-surface-2 bg-surface-1 shadow-2xl", onClick: (e) => e.stopPropagation(), children: [_jsxs("div", { className: "flex items-center gap-3 border-b border-surface-2 px-4 py-3", children: [_jsx(Search, { className: "h-4 w-4 shrink-0 text-zinc-500" }), _jsx("input", { ref: inputRef, value: query, onChange: (e) => setQuery(e.target.value), placeholder: "Search or navigate...", className: "flex-1 bg-transparent text-sm text-white placeholder-zinc-500 outline-none", onKeyDown: (e) => {
                                if (e.key === "Escape")
                                    onClose();
                                if (e.key === "Enter" && filtered[0])
                                    select(filtered[0].to);
                            } }), _jsx("button", { onClick: onClose, className: "text-zinc-500 transition-colors hover:text-zinc-300", children: _jsx(X, { className: "h-4 w-4" }) })] }), _jsx("div", { className: "p-2", children: filtered.length === 0 ? (_jsx("p", { className: "px-3 py-4 text-center text-sm text-zinc-500", children: "No results" })) : (filtered.map(({ label, icon: Icon, to }) => (_jsxs("button", { onClick: () => select(to), className: "flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm text-zinc-300 transition-colors hover:bg-surface-2 hover:text-white", children: [_jsx(Icon, { className: "h-4 w-4 text-zinc-500" }), label] }, to)))) }), _jsxs("div", { className: "border-t border-surface-2 px-4 py-2 font-mono text-xs text-zinc-600", children: [_jsx("kbd", { children: "\u21B5" }), " to select \u00B7 ", _jsx("kbd", { children: "esc" }), " to close"] })] }) }));
}
