import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { BarChart3 } from "lucide-react";
import { Header } from "~/components/dashboard/Header";
export default function AgentsPerformance() {
    return (_jsxs("div", { className: "flex flex-1 flex-col", children: [_jsx(Header, { title: "Agent Performance" }), _jsx("main", { className: "flex-1 p-6", children: _jsxs("div", { className: "flex flex-col items-center gap-3 rounded-xl border border-surface-2/50 bg-surface-1/40 py-24", children: [_jsx(BarChart3, { className: "h-10 w-10 text-zinc-700" }), _jsx("p", { className: "text-sm text-zinc-500", children: "Performance metrics coming soon" }), _jsx("p", { className: "text-xs text-zinc-700", children: "Track agent success rates, latency, and token usage over time." })] }) })] }));
}
