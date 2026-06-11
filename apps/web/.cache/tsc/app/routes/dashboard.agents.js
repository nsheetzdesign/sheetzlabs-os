import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { Outlet } from "react-router";
import { PageTabs } from "~/components/ui/PageTabs";
const TABS = [
    { to: "/dashboard/agents", label: "Agents", end: true },
    { to: "/dashboard/agents/runs", label: "Runs" },
    { to: "/dashboard/agents/performance", label: "Performance" },
];
export default function AgentsLayout() {
    return (_jsxs("div", { className: "flex flex-1 flex-col", children: [_jsx("div", { className: "border-b border-surface-2/50 px-6", children: _jsx(PageTabs, { tabs: TABS }) }), _jsx(Outlet, {})] }));
}
