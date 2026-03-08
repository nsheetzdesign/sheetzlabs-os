import { jsxs as _jsxs, jsx as _jsx } from "react/jsx-runtime";
import { useLoaderData, Form, Link } from "react-router";
import { Plus, Users, ChevronRight } from "lucide-react";
import { Header } from "~/components/dashboard/Header";
import { getSupabaseClient } from "~/lib/supabase.server";
import { Button } from "~/components/ui/Button";
import { EmptyState } from "~/components/ui/EmptyState";
const REL_TYPE_COLORS = {
    client: "text-green-400 bg-green-500/10 border-green-500/20",
    partner: "text-blue-400 bg-blue-500/10 border-blue-500/20",
    investor: "text-violet-400 bg-violet-500/10 border-violet-500/20",
    advisor: "text-amber-400 bg-amber-500/10 border-amber-500/20",
    vendor: "text-zinc-400 bg-zinc-500/10 border-zinc-500/20",
    prospect: "text-cyan-400 bg-cyan-500/10 border-cyan-500/20",
    friend: "text-pink-400 bg-pink-500/10 border-pink-500/20",
};
const TYPES = ["client", "partner", "investor", "advisor", "vendor", "prospect", "friend"];
function decayClass(lastContact) {
    if (!lastContact)
        return "";
    const days = (Date.now() - new Date(lastContact).getTime()) / 86400000;
    if (days > 60)
        return "border-red-500/30 bg-red-500/5";
    if (days > 30)
        return "border-amber-500/30 bg-amber-500/5";
    return "";
}
function decayBadge(lastContact) {
    if (!lastContact)
        return null;
    const days = Math.floor((Date.now() - new Date(lastContact).getTime()) / 86400000);
    if (days > 60)
        return (_jsxs("span", { className: "rounded border border-red-500/30 bg-red-500/10 px-1.5 py-0.5 text-xs text-red-400", children: [days, "d ago"] }));
    if (days > 30)
        return (_jsxs("span", { className: "rounded border border-amber-500/30 bg-amber-500/10 px-1.5 py-0.5 text-xs text-amber-400", children: [days, "d ago"] }));
    return (_jsxs("span", { className: "text-xs text-zinc-600", children: [days, "d ago"] }));
}
function StrengthBar({ value }) {
    const v = value ?? 0;
    const color = v >= 70 ? "bg-green-500" : v >= 40 ? "bg-amber-500" : "bg-red-500";
    return (_jsx("div", { className: "h-1.5 w-16 rounded-full bg-surface-2/50", children: _jsx("div", { className: `h-1.5 rounded-full transition-all ${color}`, style: { width: `${v}%` } }) }));
}
export async function loader({ request, context }) {
    const supabase = getSupabaseClient(context.cloudflare.env);
    const url = new URL(request.url);
    const typeFilter = url.searchParams.get("type") || "";
    let query = supabase
        .from("relationships")
        .select("*")
        .order("last_contact", { ascending: true, nullsFirst: true });
    if (typeFilter)
        query = query.eq("type", typeFilter);
    const { data } = await query;
    return { relationships: data ?? [], filters: { type: typeFilter } };
}
export default function RelationshipsIndex() {
    const { relationships, filters } = useLoaderData();
    return (_jsxs("div", { className: "flex flex-1 flex-col", children: [_jsx(Header, { title: "Relationships" }), _jsxs("main", { className: "flex-1 p-6", children: [_jsxs(Form, { method: "get", className: "mb-4 flex flex-wrap items-center gap-2", children: [_jsxs("select", { name: "type", defaultValue: filters.type, className: "rounded-lg border border-surface-2/50 bg-surface-1 px-3 py-1.5 text-sm text-zinc-300 focus:outline-none focus:ring-1 focus:ring-brand", children: [_jsx("option", { value: "", children: "All types" }), TYPES.map((t) => (_jsx("option", { value: t, children: t }, t)))] }), _jsx(Button, { type: "submit", variant: "secondary", children: "Filter" }), filters.type && (_jsx(Link, { to: "/dashboard/relationships", children: _jsx(Button, { type: "button", variant: "secondary", children: "Clear" }) })), _jsxs("div", { className: "ml-auto flex items-center gap-3", children: [_jsxs("p", { className: "text-xs text-zinc-600", children: [relationships.length, " contact", relationships.length !== 1 ? "s" : ""] }), _jsxs(Link, { to: "new", className: "inline-flex items-center gap-2 rounded-lg bg-brand px-3 py-1.5 text-sm font-medium text-white transition-colors hover:bg-brand-dark", children: [_jsx(Plus, { className: "h-4 w-4" }), "New Contact"] })] })] }), _jsxs("div", { className: "rounded-xl border border-surface-2/50 bg-surface-1/40 backdrop-blur-sm", children: [_jsxs("div", { className: "grid border-b border-surface-2/50 px-4 py-2 text-xs font-medium uppercase tracking-wide text-zinc-600", style: { gridTemplateColumns: "1fr auto" }, children: [_jsx("span", { children: "Contact" }), _jsxs("div", { className: "flex items-center gap-4", children: [_jsx("span", { children: "Strength" }), _jsx("span", { className: "hidden sm:block", children: "Last Contact" }), _jsx("span", { className: "w-4" })] })] }), relationships.length === 0 ? (_jsx(EmptyState, { icon: Users, title: "No contacts", description: filters.type
                                    ? `No ${filters.type} contacts found.`
                                    : "Add your first contact to start tracking relationships.", action: _jsxs(Link, { to: "new", className: "inline-flex items-center gap-2 rounded-lg bg-brand px-4 py-2 text-sm font-medium text-white hover:bg-brand-dark", children: [_jsx(Plus, { className: "h-4 w-4" }), "New Contact"] }) })) : (_jsx("div", { className: "divide-y divide-surface-2/30 py-1", children: relationships.map((rel) => (_jsxs(Link, { to: rel.id, className: `flex items-center gap-4 rounded-lg border border-transparent px-4 py-3 transition-colors hover:bg-surface-2/30 ${decayClass(rel.last_contact)}`, children: [_jsxs("div", { className: "min-w-0 flex-1", children: [_jsxs("div", { className: "flex items-center gap-2", children: [_jsx("span", { className: "text-sm font-medium text-zinc-200", children: rel.name }), rel.type && (_jsx("span", { className: `rounded border px-1.5 py-0.5 text-xs font-medium ${REL_TYPE_COLORS[rel.type] ?? "text-zinc-400 bg-zinc-500/10 border-zinc-500/20"}`, children: rel.type }))] }), (rel.company || rel.role) && (_jsx("p", { className: "mt-0.5 text-xs text-zinc-600", children: [rel.role, rel.company].filter(Boolean).join(" · ") }))] }), _jsxs("div", { className: "flex shrink-0 items-center gap-4", children: [_jsx(StrengthBar, { value: rel.strength }), _jsx("span", { className: "hidden sm:block", children: decayBadge(rel.last_contact) }), _jsx(ChevronRight, { className: "h-4 w-4 text-zinc-700" })] })] }, rel.id))) }))] }), _jsxs("div", { className: "mt-2 flex items-center gap-4 text-xs text-zinc-700", children: [_jsxs("span", { className: "flex items-center gap-1", children: [_jsx("span", { className: "inline-block h-2 w-2 rounded-full bg-amber-500/60" }), ">30 days since contact"] }), _jsxs("span", { className: "flex items-center gap-1", children: [_jsx("span", { className: "inline-block h-2 w-2 rounded-full bg-red-500/60" }), ">60 days since contact"] })] })] })] }));
}
