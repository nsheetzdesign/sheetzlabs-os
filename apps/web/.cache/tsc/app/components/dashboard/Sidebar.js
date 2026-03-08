import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { NavLink, Form } from "react-router";
import { LayoutDashboard, Box, Rocket, DollarSign, Receipt, Users, CheckSquare, BookOpen, Brain, Settings2, LogOut, Search, Ticket, } from "lucide-react";
const navItems = [
    { icon: LayoutDashboard, label: "Command Center", to: "/dashboard" },
    { icon: Box, label: "Ventures", to: "/dashboard/ventures" },
    { icon: Rocket, label: "Pipeline", to: "/dashboard/pipeline" },
    { icon: DollarSign, label: "Revenue", to: "/dashboard/revenue" },
    { icon: Receipt, label: "Expenses", to: "/dashboard/expenses" },
    { icon: Ticket, label: "Tickets", to: "/dashboard/tickets" },
    { icon: Users, label: "Relationships", to: "/dashboard/relationships" },
    { icon: CheckSquare, label: "Tasks", to: "/dashboard/tasks" },
    { icon: BookOpen, label: "Knowledge", to: "/dashboard/knowledge" },
    { icon: Brain, label: "AI Agents", to: "/dashboard/agents" },
    { icon: Settings2, label: "Settings", to: "/dashboard/settings/stripe" },
];
function getInitials(email) {
    if (!email)
        return "SL";
    const local = email.split("@")[0];
    const parts = local.split(/[._-]/);
    if (parts.length >= 2) {
        return (parts[0][0] + parts[1][0]).toUpperCase();
    }
    return local.slice(0, 2).toUpperCase();
}
export function Sidebar({ user, onOpenPalette }) {
    const initials = getInitials(user?.email);
    const displayEmail = user?.email ?? "";
    return (_jsxs("aside", { className: "fixed left-0 top-0 flex h-screen w-64 flex-col border-r border-surface-2/50 bg-surface-0", children: [_jsxs("div", { className: "flex items-center gap-3 border-b border-surface-2/50 px-4 py-5", children: [_jsx("div", { className: "flex h-8 w-8 items-center justify-center rounded-lg bg-brand text-sm font-bold text-white", children: "SL" }), _jsxs("div", { children: [_jsx("div", { className: "text-sm font-semibold", children: "Sheetz Labs" }), _jsx("div", { className: "font-mono text-xs text-zinc-500", children: "OS v0.1.0" })] })] }), _jsx("div", { className: "px-3 py-3", children: _jsxs("button", { onClick: onOpenPalette, className: "flex w-full items-center gap-2 rounded-lg border border-surface-2 bg-surface-1/50 px-3 py-2 text-sm text-zinc-500 transition-colors hover:border-surface-3 hover:text-zinc-300", children: [_jsx(Search, { className: "h-4 w-4" }), _jsx("span", { className: "flex-1 text-left", children: "Search..." }), _jsx("kbd", { className: "font-mono text-xs text-zinc-600", children: "\u2318K" })] }) }), _jsx("nav", { className: "flex-1 space-y-0.5 overflow-y-auto px-3 py-2", children: navItems.map(({ icon: Icon, label, to }) => (_jsxs(NavLink, { to: to, end: to === "/dashboard", className: ({ isActive }) => `flex items-center gap-3 rounded-lg px-3 py-2 text-sm transition-colors ${isActive
                        ? "border border-brand/30 bg-brand/10 text-brand"
                        : "text-zinc-500 hover:bg-surface-1/50 hover:text-zinc-300"}`, children: [_jsx(Icon, { className: "h-4 w-4 shrink-0" }), label] }, to))) }), _jsx("div", { className: "border-t border-surface-2/50 p-3", children: _jsxs("div", { className: "flex items-center gap-3 rounded-lg px-2 py-2", children: [_jsx("div", { className: "flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-surface-2 text-sm font-semibold text-zinc-300", children: initials }), _jsxs("div", { className: "min-w-0 flex-1", children: [_jsx("div", { className: "truncate text-xs text-zinc-400", children: displayEmail }), _jsx("div", { className: "text-xs text-zinc-600", children: "Founder" })] }), _jsx(Form, { method: "post", action: "/auth/logout", children: _jsx("button", { type: "submit", title: "Sign out", className: "text-zinc-600 transition-colors hover:text-zinc-300", children: _jsx(LogOut, { className: "h-4 w-4" }) }) })] }) })] }));
}
