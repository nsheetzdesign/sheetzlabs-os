import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { NavLink, Outlet } from "react-router";
const settingsTabs = [
    { label: "Stripe", to: "/dashboard/settings/stripe" },
    { label: "Expenses", to: "/dashboard/settings/expenses" },
];
export default function SettingsLayout() {
    return (_jsxs("div", { className: "min-h-screen p-8", children: [_jsxs("div", { className: "mb-6", children: [_jsx("h1", { className: "text-2xl font-semibold text-zinc-100", children: "Settings" }), _jsx("p", { className: "mt-1 text-sm text-zinc-500", children: "Manage integrations and workspace configuration." })] }), _jsx("div", { className: "mb-6 flex gap-1 border-b border-surface-2/50", children: settingsTabs.map(({ label, to }) => (_jsx(NavLink, { to: to, className: ({ isActive }) => `px-4 py-2 text-sm font-medium transition-colors border-b-2 -mb-px ${isActive
                        ? "border-brand text-brand"
                        : "border-transparent text-zinc-500 hover:text-zinc-300"}`, children: label }, to))) }), _jsx(Outlet, {})] }));
}
