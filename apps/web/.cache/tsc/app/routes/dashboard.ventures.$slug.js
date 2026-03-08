import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { NavLink, Outlet, useLoaderData } from "react-router";
import { Header } from "~/components/dashboard/Header";
import { getSupabaseClient } from "~/lib/supabase.server";
const TABS = [
    { label: "Overview", to: "" },
    { label: "Stack", to: "stack" },
    { label: "Links", to: "links" },
    { label: "Roadmap", to: "roadmap" },
    { label: "Tickets", to: "tickets" },
    { label: "Tasks", to: "tasks" },
    { label: "Docs", to: "docs" },
];
const STATUS_COLOR = {
    idea: "text-zinc-400 bg-zinc-500/10 border-zinc-500/30",
    validating: "text-amber-400 bg-amber-500/10 border-amber-500/30",
    building: "text-blue-400 bg-blue-500/10 border-blue-500/30",
    active: "text-green-400 bg-green-500/10 border-green-500/30",
    maintenance: "text-purple-400 bg-purple-500/10 border-purple-500/30",
    sunset: "text-red-400 bg-red-500/10 border-red-500/30",
    sold: "text-brand bg-brand/10 border-brand/30",
};
export async function loader({ params, context }) {
    const supabase = getSupabaseClient(context.cloudflare.env);
    const { data: venture, error } = await supabase
        .from("ventures")
        .select("*")
        .eq("slug", params.slug)
        .single();
    if (error || !venture)
        throw new Response("Not found", { status: 404 });
    return { venture };
}
export default function VentureHub() {
    const { venture } = useLoaderData();
    const base = `/dashboard/ventures/${venture.slug}`;
    return (_jsxs("div", { className: "flex flex-1 flex-col", children: [_jsx(Header, { title: venture.name }), _jsxs("div", { className: "border-b border-surface-2/50 bg-surface-0 px-6 py-4", children: [_jsxs("div", { className: "flex flex-wrap items-center gap-4", children: [_jsxs("div", { className: "flex-1", children: [_jsxs("div", { className: "flex items-center gap-2", children: [_jsx("h1", { className: "text-lg font-semibold text-zinc-100", children: venture.name }), _jsx("span", { className: `rounded border px-2 py-0.5 text-xs font-medium capitalize ${STATUS_COLOR[venture.status ?? "idea"] ?? STATUS_COLOR.idea}`, children: venture.status }), _jsx("span", { className: "rounded border border-surface-2/50 px-2 py-0.5 text-xs text-zinc-500 capitalize", children: venture.stage })] }), venture.tagline && (_jsx("p", { className: "mt-0.5 text-sm text-zinc-500", children: venture.tagline }))] }), _jsxs("div", { className: "flex items-center gap-6", children: [_jsx(Metric, { label: "MRR", value: `$${((venture.mrr_cents ?? 0) / 100).toLocaleString()}` }), _jsx(Metric, { label: "Customers", value: String(venture.customer_count ?? 0) }), _jsx(Metric, { label: "Health", value: `${venture.health_score ?? 50}/100` })] })] }), _jsx("div", { className: "mt-4 flex gap-0.5 border-b border-surface-2/50 -mb-px", children: TABS.map(({ label, to }) => {
                            const href = to ? `${base}/${to}` : base;
                            return (_jsx(NavLink, { to: href, end: to === "", className: ({ isActive }) => `px-4 py-2 text-sm font-medium transition-colors border-b-2 -mb-px ${isActive
                                    ? "border-brand text-brand"
                                    : "border-transparent text-zinc-500 hover:text-zinc-300"}`, children: label }, label));
                        }) })] }), _jsx("main", { className: "flex-1 overflow-y-auto p-6", children: _jsx(Outlet, {}) })] }));
}
function Metric({ label, value }) {
    return (_jsxs("div", { className: "text-right", children: [_jsx("div", { className: "text-xs text-zinc-600 uppercase tracking-wide", children: label }), _jsx("div", { className: "text-sm font-semibold text-zinc-200", children: value })] }));
}
