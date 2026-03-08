import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useLoaderData, Form, Link, redirect } from "react-router";
import { Plus, DollarSign } from "lucide-react";
import { Header } from "~/components/dashboard/Header";
import { getSupabaseClient } from "~/lib/supabase.server";
import { Badge } from "~/components/ui/Badge";
import { Button } from "~/components/ui/Button";
import { EmptyState } from "~/components/ui/EmptyState";
export async function loader({ request, context }) {
    const supabase = getSupabaseClient(context.cloudflare.env);
    const url = new URL(request.url);
    const ventureId = url.searchParams.get("venture_id") || "";
    let query = supabase
        .from("revenue")
        .select("*, ventures(id, name, slug)")
        .order("recorded_at", { ascending: false });
    if (ventureId)
        query = query.eq("venture_id", ventureId);
    const [revenueRes, venturesRes] = await Promise.all([
        query,
        supabase.from("ventures").select("id, name, slug").order("name"),
    ]);
    const entries = revenueRes.data ?? [];
    // MRR = sum of recurring entries (assume most recent per venture)
    const recurringEntries = entries.filter((e) => e.type === "recurring");
    const totalMrrCents = recurringEntries.reduce((sum, e) => sum + (e.amount_cents ?? 0), 0);
    // Total revenue logged
    const totalRevenueCents = entries.reduce((sum, e) => sum + (e.amount_cents ?? 0), 0);
    return {
        entries,
        ventures: venturesRes.data ?? [],
        filters: { ventureId },
        stats: { totalMrrCents, totalRevenueCents, count: entries.length },
    };
}
export async function action({ request, context }) {
    const supabase = getSupabaseClient(context.cloudflare.env);
    const fd = await request.formData();
    const intent = fd.get("intent");
    if (intent === "delete") {
        const id = fd.get("id");
        await supabase.from("revenue").delete().eq("id", id);
        return redirect("/dashboard/revenue");
    }
    return null;
}
function formatDollars(cents) {
    return `$${(cents / 100).toLocaleString(undefined, { minimumFractionDigits: 0, maximumFractionDigits: 0 })}`;
}
function formatDate(str) {
    if (!str)
        return "—";
    return new Date(str).toLocaleDateString(undefined, { month: "short", day: "numeric", year: "numeric" });
}
const TYPE_COLORS = {
    recurring: "text-green-400 bg-green-500/10 border-green-500/20",
    "one-time": "text-blue-400 bg-blue-500/10 border-blue-500/20",
    retainer: "text-violet-400 bg-violet-500/10 border-violet-500/20",
    project: "text-amber-400 bg-amber-500/10 border-amber-500/20",
};
export default function RevenueIndex() {
    const { entries, ventures, filters, stats } = useLoaderData();
    return (_jsxs("div", { className: "flex flex-1 flex-col", children: [_jsx(Header, { title: "Revenue" }), _jsxs("main", { className: "flex-1 p-6", children: [_jsx("div", { className: "mb-6 grid gap-4 sm:grid-cols-3", children: [
                            { label: "MRR", value: formatDollars(stats.totalMrrCents), hint: "recurring entries" },
                            { label: "Total Logged", value: formatDollars(stats.totalRevenueCents), hint: `${stats.count} entries` },
                        ].map((s) => (_jsxs("div", { className: "rounded-xl border border-surface-2/50 bg-surface-1/40 p-4 backdrop-blur-sm", children: [_jsx("p", { className: "text-xs font-medium uppercase tracking-wide text-zinc-600", children: s.label }), _jsx("p", { className: "mt-1 font-mono text-2xl font-semibold text-zinc-200", children: s.value }), _jsx("p", { className: "mt-0.5 text-xs text-zinc-700", children: s.hint })] }, s.label))) }), _jsxs(Form, { method: "get", className: "mb-4 flex flex-wrap items-center gap-2", children: [_jsxs("select", { name: "venture_id", defaultValue: filters.ventureId, className: "rounded-lg border border-surface-2/50 bg-surface-1 px-3 py-1.5 text-sm text-zinc-300 focus:outline-none focus:ring-1 focus:ring-brand", children: [_jsx("option", { value: "", children: "All ventures" }), ventures.map((v) => (_jsx("option", { value: v.id, children: v.name }, v.id)))] }), _jsx(Button, { type: "submit", variant: "secondary", children: "Filter" }), filters.ventureId && (_jsx(Link, { to: "/dashboard/revenue", children: _jsx(Button, { type: "button", variant: "secondary", children: "Clear" }) })), _jsx("div", { className: "ml-auto", children: _jsxs(Link, { to: "new", className: "inline-flex items-center gap-2 rounded-lg bg-brand px-3 py-1.5 text-sm font-medium text-white transition-colors hover:bg-brand-dark", children: [_jsx(Plus, { className: "h-4 w-4" }), "Log Revenue"] }) })] }), _jsxs("div", { className: "rounded-xl border border-surface-2/50 bg-surface-1/40 backdrop-blur-sm", children: [_jsxs("div", { className: "grid border-b border-surface-2/50 px-4 py-2 text-xs font-medium uppercase tracking-wide text-zinc-600", style: { gridTemplateColumns: "1fr auto" }, children: [_jsx("span", { children: "Entry" }), _jsxs("div", { className: "flex items-center gap-6", children: [_jsx("span", { className: "hidden sm:block", children: "Date" }), _jsx("span", { className: "w-20 text-right", children: "Amount" }), _jsx("span", { className: "w-6" })] })] }), entries.length === 0 ? (_jsx(EmptyState, { icon: DollarSign, title: "No revenue entries", description: filters.ventureId ? "No entries match this filter." : "Log your first revenue entry to start tracking.", action: _jsxs(Link, { to: "new", className: "inline-flex items-center gap-2 rounded-lg bg-brand px-4 py-2 text-sm font-medium text-white hover:bg-brand-dark", children: [_jsx(Plus, { className: "h-4 w-4" }), "Log Revenue"] }) })) : (_jsx("div", { className: "divide-y divide-surface-2/30 py-1", children: entries.map((entry) => (_jsxs("div", { className: "flex items-center gap-4 px-4 py-3 transition-colors hover:bg-surface-2/20", children: [_jsxs("div", { className: "min-w-0 flex-1", children: [_jsxs("div", { className: "flex items-center gap-2", children: [_jsx("span", { className: `rounded border px-1.5 py-0.5 text-xs font-medium ${TYPE_COLORS[entry.type] ?? "text-zinc-400 bg-zinc-500/10 border-zinc-500/20"}`, children: entry.type }), _jsx("span", { className: "text-sm font-medium text-zinc-200", children: entry.description || entry.client_name || "—" })] }), entry.ventures?.name && (_jsx("p", { className: "mt-0.5 text-xs text-zinc-600", children: entry.ventures.name }))] }), _jsxs("div", { className: "flex shrink-0 items-center gap-6", children: [_jsx("span", { className: "hidden font-mono text-xs text-zinc-600 sm:block", children: formatDate(entry.recorded_at) }), _jsx("span", { className: "w-20 text-right font-mono text-sm font-medium text-zinc-200", children: formatDollars(entry.amount_cents) }), _jsxs(Form, { method: "post", onSubmit: (e) => {
                                                        if (!confirm("Delete this revenue entry?"))
                                                            e.preventDefault();
                                                    }, children: [_jsx("input", { type: "hidden", name: "intent", value: "delete" }), _jsx("input", { type: "hidden", name: "id", value: entry.id }), _jsx("button", { type: "submit", className: "text-zinc-700 transition-colors hover:text-red-400", title: "Delete entry", children: _jsx("svg", { className: "h-4 w-4", fill: "none", viewBox: "0 0 24 24", strokeWidth: 2, stroke: "currentColor", children: _jsx("path", { strokeLinecap: "round", strokeLinejoin: "round", d: "M6 18L18 6M6 6l12 12" }) }) })] })] })] }, entry.id))) }))] })] })] }));
}
