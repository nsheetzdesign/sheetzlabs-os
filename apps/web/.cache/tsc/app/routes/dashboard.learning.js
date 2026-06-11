import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { Outlet } from "react-router";
import { PageTabs } from "~/components/ui/PageTabs";
const TABS = [
    { to: "/dashboard/learning", label: "Paths", end: true },
    { to: "/dashboard/learning/progress", label: "Progress" },
    { to: "/dashboard/learning/tutor", label: "Tutor" },
];
export default function LearningLayout() {
    return (_jsxs("div", { className: "p-6 h-full flex flex-col", children: [_jsx("h1", { className: "text-2xl font-semibold text-zinc-100 mb-6", children: "Learning" }), _jsx(PageTabs, { tabs: TABS }), _jsx("div", { className: "flex-1 overflow-auto", children: _jsx(Outlet, {}) })] }));
}
