import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useLoaderData, Form, Link } from "react-router";
import { Plus, BookOpen, ChevronRight } from "lucide-react";
import { Header } from "~/components/dashboard/Header";
import { getSupabaseClient } from "~/lib/supabase.server";
import { Button } from "~/components/ui/Button";
import { EmptyState } from "~/components/ui/EmptyState";
const KNOWLEDGE_TYPES = ["playbook", "learning", "template", "note"];
const TYPE_META = {
    playbook: { icon: "📋", color: "text-blue-400 bg-blue-500/10 border-blue-500/20" },
    learning: { icon: "🧠", color: "text-violet-400 bg-violet-500/10 border-violet-500/20" },
    template: { icon: "📐", color: "text-amber-400 bg-amber-500/10 border-amber-500/20" },
    note: { icon: "📝", color: "text-zinc-400 bg-zinc-500/10 border-zinc-500/20" },
};
export async function loader({ request, context }) {
    const supabase = getSupabaseClient(context.cloudflare.env);
    const url = new URL(request.url);
    const typeFilter = url.searchParams.get("type") || "";
    const tagFilter = url.searchParams.get("tag") || "";
    let query = supabase
        .from("knowledge")
        .select("id, title, slug, type, tags, venture_id, created_at, ventures(id, name, slug)")
        .order("updated_at", { ascending: false });
    if (typeFilter)
        query = query.eq("type", typeFilter);
    if (tagFilter)
        query = query.contains("tags", [tagFilter]);
    const { data } = await query;
    // Collect all tags for the filter sidebar
    const allTags = [...new Set((data ?? []).flatMap((k) => k.tags ?? []))].sort();
    return {
        items: data ?? [],
        allTags,
        filters: { type: typeFilter, tag: tagFilter },
    };
}
export default function KnowledgeIndex() {
    const { items, allTags, filters } = useLoaderData();
    // Group by type for display
    const grouped = new Map();
    for (const type of KNOWLEDGE_TYPES)
        grouped.set(type, []);
    for (const item of items) {
        const t = item.type ?? "note";
        if (!grouped.has(t))
            grouped.set(t, []);
        grouped.get(t).push(item);
    }
    const activeGroups = (filters.type ? [filters.type] : [...KNOWLEDGE_TYPES]).filter((t) => (grouped.get(t)?.length ?? 0) > 0);
    return (_jsxs("div", { className: "flex flex-1 flex-col", children: [_jsx(Header, { title: "Knowledge" }), _jsxs("main", { className: "flex-1 p-6", children: [_jsxs(Form, { method: "get", className: "mb-4 flex flex-wrap items-center gap-2", children: [_jsxs("select", { name: "type", defaultValue: filters.type, className: "rounded-lg border border-surface-2/50 bg-surface-1 px-3 py-1.5 text-sm text-zinc-300 focus:outline-none focus:ring-1 focus:ring-brand", children: [_jsx("option", { value: "", children: "All types" }), KNOWLEDGE_TYPES.map((t) => (_jsxs("option", { value: t, children: [TYPE_META[t].icon, " ", t] }, t)))] }), allTags.length > 0 && (_jsxs("select", { name: "tag", defaultValue: filters.tag, className: "rounded-lg border border-surface-2/50 bg-surface-1 px-3 py-1.5 text-sm text-zinc-300 focus:outline-none focus:ring-1 focus:ring-brand", children: [_jsx("option", { value: "", children: "All tags" }), allTags.map((tag) => (_jsx("option", { value: tag, children: tag }, tag)))] })), _jsx(Button, { type: "submit", variant: "secondary", children: "Filter" }), (filters.type || filters.tag) && (_jsx(Link, { to: "/dashboard/knowledge", children: _jsx(Button, { type: "button", variant: "secondary", children: "Clear" }) })), _jsxs("div", { className: "ml-auto flex items-center gap-3", children: [_jsxs("p", { className: "text-xs text-zinc-600", children: [items.length, " article", items.length !== 1 ? "s" : ""] }), _jsxs(Link, { to: "new", className: "inline-flex items-center gap-2 rounded-lg bg-brand px-3 py-1.5 text-sm font-medium text-white transition-colors hover:bg-brand-dark", children: [_jsx(Plus, { className: "h-4 w-4" }), "New Article"] })] })] }), items.length === 0 ? (_jsx("div", { className: "rounded-xl border border-surface-2/50 bg-surface-1/40 backdrop-blur-sm", children: _jsx(EmptyState, { icon: BookOpen, title: "No knowledge articles", description: filters.type || filters.tag
                                ? "No articles match these filters."
                                : "Start building your knowledge base with playbooks, learnings, and notes.", action: _jsxs(Link, { to: "new", className: "inline-flex items-center gap-2 rounded-lg bg-brand px-4 py-2 text-sm font-medium text-white hover:bg-brand-dark", children: [_jsx(Plus, { className: "h-4 w-4" }), "New Article"] }) }) })) : (_jsx("div", { className: "space-y-6", children: activeGroups.map((type) => {
                            const groupItems = grouped.get(type) ?? [];
                            if (groupItems.length === 0)
                                return null;
                            const meta = TYPE_META[type] ?? TYPE_META.note;
                            return (_jsxs("div", { children: [_jsxs("h3", { className: "mb-2 text-xs font-semibold uppercase tracking-widest text-zinc-600", children: [meta.icon, " ", type, _jsxs("span", { className: "ml-2 font-mono text-zinc-700", children: ["(", groupItems.length, ")"] })] }), _jsx("div", { className: "rounded-xl border border-surface-2/50 bg-surface-1/40 backdrop-blur-sm", children: _jsx("div", { className: "divide-y divide-surface-2/30 py-1", children: groupItems.map((item) => (_jsxs(Link, { to: item.slug, className: "flex items-center gap-4 rounded-lg px-4 py-3 transition-colors hover:bg-surface-2/30", children: [_jsxs("div", { className: "min-w-0 flex-1", children: [_jsxs("div", { className: "flex items-center gap-2", children: [_jsx("span", { className: "text-sm font-medium text-zinc-200", children: item.title }), _jsx("span", { className: `rounded border px-1.5 py-0.5 text-xs font-medium ${meta.color}`, children: item.type })] }), (item.tags ?? []).length > 0 && (_jsx("div", { className: "mt-1 flex flex-wrap gap-1", children: (item.tags ?? []).map((tag) => (_jsxs("span", { className: "rounded bg-surface-2/40 px-1.5 py-0.5 text-xs text-zinc-600", children: ["#", tag] }, tag))) }))] }), _jsxs("div", { className: "flex shrink-0 items-center gap-2", children: [item.ventures?.name && (_jsx("span", { className: "hidden text-xs text-zinc-700 sm:block", children: item.ventures.name })), _jsx(ChevronRight, { className: "h-4 w-4 text-zinc-700" })] })] }, item.id))) }) })] }, type));
                        }) }))] })] }));
}
