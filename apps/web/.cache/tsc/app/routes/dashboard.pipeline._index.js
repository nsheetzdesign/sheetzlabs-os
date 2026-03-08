import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useLoaderData, Link } from "react-router";
import { Plus, Lightbulb, ChevronRight } from "lucide-react";
import { Header } from "~/components/dashboard/Header";
import { getSupabaseClient } from "~/lib/supabase.server";
import { EmptyState } from "~/components/ui/EmptyState";
const STAGE_ORDER = [
    "idea",
    "researching",
    "validating",
    "speccing",
    "building",
    "beta",
    "launched",
    "parked",
];
const STAGE_LABELS = {
    idea: "💡 Idea",
    researching: "🔍 Researching",
    validating: "🧪 Validating",
    speccing: "📐 Speccing",
    building: "🛠️ Building",
    beta: "🚀 Beta",
    launched: "✅ Launched",
    parked: "📦 Parked",
};
export async function loader({ context }) {
    const supabase = getSupabaseClient(context.cloudflare.env);
    const { data } = await supabase
        .from("pipeline")
        .select("*")
        .order("total_score", { ascending: false });
    return { items: data ?? [] };
}
function scoreBadge(score) {
    const s = score ?? 0;
    if (s >= 70)
        return "text-green-400 bg-green-500/10 border-green-500/30";
    if (s >= 50)
        return "text-amber-400 bg-amber-500/10 border-amber-500/30";
    return "text-red-400 bg-red-500/10 border-red-500/30";
}
export default function PipelineIndex() {
    const { items } = useLoaderData();
    // Group by stage
    const byStage = new Map();
    for (const stage of STAGE_ORDER)
        byStage.set(stage, []);
    for (const item of items) {
        const s = (item.stage ?? "idea");
        byStage.get(s)?.push(item);
    }
    const activeStages = STAGE_ORDER.filter((s) => (byStage.get(s)?.length ?? 0) > 0);
    return (_jsxs("div", { className: "flex flex-1 flex-col", children: [_jsx(Header, { title: "Pipeline" }), _jsxs("main", { className: "flex-1 p-6", children: [_jsxs("div", { className: "mb-4 flex items-center justify-between", children: [_jsxs("p", { className: "text-sm text-zinc-500", children: [items.length, " idea", items.length !== 1 ? "s" : ""] }), _jsxs(Link, { to: "new", className: "inline-flex items-center gap-2 rounded-lg bg-brand px-3 py-1.5 text-sm font-medium text-white transition-colors hover:bg-brand-dark", children: [_jsx(Plus, { className: "h-4 w-4" }), "New Idea"] })] }), items.length === 0 ? (_jsx("div", { className: "rounded-xl border border-surface-2/50 bg-surface-1/40 backdrop-blur-sm", children: _jsx(EmptyState, { icon: Lightbulb, title: "No pipeline ideas", description: "Start tracking ideas and score them to find your next venture.", action: _jsxs(Link, { to: "new", className: "inline-flex items-center gap-2 rounded-lg bg-brand px-4 py-2 text-sm font-medium text-white hover:bg-brand-dark", children: [_jsx(Plus, { className: "h-4 w-4" }), "New Idea"] }) }) })) : (_jsx("div", { className: "space-y-6", children: activeStages.map((stage) => {
                            const stageItems = byStage.get(stage) ?? [];
                            return (_jsxs("div", { children: [_jsxs("h3", { className: "mb-2 text-xs font-semibold uppercase tracking-widest text-zinc-600", children: [STAGE_LABELS[stage], _jsxs("span", { className: "ml-2 font-mono text-zinc-700", children: ["(", stageItems.length, ")"] })] }), _jsx("div", { className: "rounded-xl border border-surface-2/50 bg-surface-1/40 backdrop-blur-sm", children: _jsx("div", { className: "divide-y divide-surface-2/30 py-1", children: stageItems.map((item) => (_jsxs(Link, { to: item.id, className: "flex items-center gap-4 rounded-lg px-4 py-3 transition-colors hover:bg-surface-2/30", children: [_jsxs("div", { className: "min-w-0 flex-1", children: [_jsx("p", { className: "text-sm font-medium text-zinc-200", children: item.name }), item.target_market && (_jsx("p", { className: "mt-0.5 truncate text-xs text-zinc-600", children: item.target_market }))] }), _jsxs("div", { className: "flex shrink-0 items-center gap-3", children: [item.venture_id && (_jsx("span", { className: "rounded border border-brand/30 bg-brand/10 px-1.5 py-0.5 text-xs font-medium text-brand", children: "venture" })), _jsx("span", { className: `rounded border px-2 py-0.5 font-mono text-sm font-semibold ${scoreBadge(item.total_score)}`, children: item.total_score ?? 0 }), _jsx(ChevronRight, { className: "h-4 w-4 text-zinc-700" })] })] }, item.id))) }) })] }, stage));
                        }) }))] })] }));
}
