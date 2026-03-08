import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useLoaderData, Link } from "react-router";
import { Plus, Box, ChevronRight } from "lucide-react";
import { Header } from "~/components/dashboard/Header";
import { getSupabaseClient } from "~/lib/supabase.server";
import { Badge } from "~/components/ui/Badge";
import { EmptyState } from "~/components/ui/EmptyState";
export async function loader({ context }) {
    const supabase = getSupabaseClient(context.cloudflare.env);
    const { data } = await supabase
        .from("ventures")
        .select("*")
        .order("created_at");
    return { ventures: data ?? [] };
}
function formatMrr(cents) {
    if (!cents)
        return "—";
    return `$${(cents / 100).toLocaleString()}`;
}
function VentureRow({ venture, indent = false, }) {
    return (_jsxs(Link, { to: venture.slug, className: `flex items-center gap-4 rounded-lg px-4 py-3 transition-colors hover:bg-surface-2/30 ${indent ? "ml-8 border-l border-surface-2/50 pl-6" : ""}`, children: [_jsxs("div", { className: "min-w-0 flex-1", children: [_jsxs("div", { className: "flex items-center gap-2", children: [_jsx("span", { className: "text-sm font-medium text-zinc-200", children: venture.name }), venture.domain && (_jsx("span", { className: "font-mono text-xs text-zinc-600", children: venture.domain }))] }), venture.tagline && (_jsx("p", { className: "mt-0.5 text-xs text-zinc-500", children: venture.tagline }))] }), _jsxs("div", { className: "flex items-center gap-3", children: [_jsx(Badge, { value: venture.status ?? "idea", variant: "venture-status" }), _jsx("span", { className: "hidden font-mono text-xs text-zinc-600 sm:block", children: venture.stage ?? "pre-revenue" }), _jsx("span", { className: "w-16 text-right font-mono text-sm text-zinc-400", children: formatMrr(venture.mrr_cents) }), _jsx(ChevronRight, { className: "h-4 w-4 shrink-0 text-zinc-700" })] })] }));
}
export default function VenturesIndex() {
    const { ventures } = useLoaderData();
    const roots = ventures.filter((v) => !v.parent_venture_id);
    const byParent = {};
    ventures
        .filter((v) => v.parent_venture_id)
        .forEach((v) => {
        const pid = v.parent_venture_id;
        (byParent[pid] ??= []).push(v);
    });
    return (_jsxs("div", { className: "flex flex-1 flex-col", children: [_jsx(Header, { title: "Ventures" }), _jsxs("main", { className: "flex-1 p-6", children: [_jsxs("div", { className: "mb-4 flex items-center justify-between", children: [_jsxs("p", { className: "text-sm text-zinc-500", children: [ventures.length, " venture", ventures.length !== 1 ? "s" : ""] }), _jsxs(Link, { to: "new", className: "inline-flex items-center gap-2 rounded-lg bg-brand px-3 py-1.5 text-sm font-medium text-white transition-colors hover:bg-brand-dark", children: [_jsx(Plus, { className: "h-4 w-4" }), "New Venture"] })] }), _jsxs("div", { className: "rounded-xl border border-surface-2/50 bg-surface-1/40 backdrop-blur-sm", children: [_jsxs("div", { className: "grid border-b border-surface-2/50 px-4 py-2 text-xs font-medium uppercase tracking-wide text-zinc-600", style: { gridTemplateColumns: "1fr auto" }, children: [_jsx("span", { children: "Venture" }), _jsxs("div", { className: "flex items-center gap-3", children: [_jsx("span", { children: "Status" }), _jsx("span", { className: "hidden sm:block", children: "Stage" }), _jsx("span", { className: "w-16 text-right", children: "MRR" }), _jsx("span", { className: "w-4" })] })] }), ventures.length === 0 ? (_jsx(EmptyState, { icon: Box, title: "No ventures yet", description: "Add your first venture to start tracking.", action: _jsxs(Link, { to: "new", className: "inline-flex items-center gap-2 rounded-lg bg-brand px-4 py-2 text-sm font-medium text-white hover:bg-brand-dark", children: [_jsx(Plus, { className: "h-4 w-4" }), "New Venture"] }) })) : (_jsx("div", { className: "divide-y divide-surface-2/30 py-1", children: roots.map((v) => (_jsxs("div", { children: [_jsx(VentureRow, { venture: v }), (byParent[v.id] ?? []).map((child) => (_jsx(VentureRow, { venture: child, indent: true }, child.id)))] }, v.id))) }))] })] })] }));
}
