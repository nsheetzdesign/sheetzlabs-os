import { jsx as _jsx } from "react/jsx-runtime";
import { NavLink } from "react-router";
export function PageTabs({ tabs }) {
    return (_jsx("nav", { className: "flex gap-1", children: tabs.map((tab) => (_jsx(NavLink, { to: tab.to, end: tab.end ?? false, className: ({ isActive }) => `px-4 py-2.5 text-sm font-medium border-b-2 -mb-px transition-colors ${isActive
                ? "border-brand text-brand"
                : "border-transparent text-zinc-400 hover:text-zinc-200"}`, children: tab.label }, tab.to))) }));
}
