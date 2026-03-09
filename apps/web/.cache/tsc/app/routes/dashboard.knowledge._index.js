import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useLoaderData, Link, useNavigate } from "react-router";
import { useState, useRef } from "react";
import { Plus, BookOpen, ChevronRight, Pin, Rss, Inbox, Search, Tag, X, } from "lucide-react";
import { Header } from "~/components/dashboard/Header";
import { getSupabaseClient } from "~/lib/supabase.server";
import { EmptyState } from "~/components/ui/EmptyState";
export const meta = () => [{ title: "Knowledge — Sheetz Labs OS" }];
const KNOWLEDGE_TYPES = [
    "all", "doc", "note", "clip", "playbook", "spec",
    "research", "draft", "learning", "template",
];
const TYPE_META = {
    all: { icon: "📚", color: "text-zinc-400 bg-zinc-500/10 border-zinc-500/20" },
    doc: { icon: "📄", color: "text-sky-400 bg-sky-500/10 border-sky-500/20" },
    note: { icon: "📝", color: "text-zinc-400 bg-zinc-500/10 border-zinc-500/20" },
    clip: { icon: "🔗", color: "text-amber-400 bg-amber-500/10 border-amber-500/20" },
    playbook: { icon: "📋", color: "text-blue-400 bg-blue-500/10 border-blue-500/20" },
    spec: { icon: "⚙️", color: "text-violet-400 bg-violet-500/10 border-violet-500/20" },
    research: { icon: "🔬", color: "text-teal-400 bg-teal-500/10 border-teal-500/20" },
    draft: { icon: "✏️", color: "text-orange-400 bg-orange-500/10 border-orange-500/20" },
    learning: { icon: "🧠", color: "text-violet-400 bg-violet-500/10 border-violet-500/20" },
    template: { icon: "📐", color: "text-amber-400 bg-amber-500/10 border-amber-500/20" },
    meeting_prep: { icon: "🗓", color: "text-pink-400 bg-pink-500/10 border-pink-500/20" },
    daily_plan: { icon: "📅", color: "text-green-400 bg-green-500/10 border-green-500/20" },
    insight: { icon: "💡", color: "text-yellow-400 bg-yellow-500/10 border-yellow-500/20" },
};
function getMeta(type) {
    return TYPE_META[type] ?? TYPE_META.note;
}
export async function loader({ request, context }) {
    const supabase = getSupabaseClient(context.cloudflare.env);
    const url = new URL(request.url);
    const typeFilter = url.searchParams.get("type") || "all";
    const tagFilter = url.searchParams.get("tag") || "";
    const search = url.searchParams.get("search") || "";
    const pinnedOnly = url.searchParams.get("pinned") === "true";
    let query = supabase
        .from("knowledge")
        .select("id, title, slug, type, tags, venture_id, is_pinned, summary, reading_time, source_type, created_at, updated_at, knowledge_tags(tag_id, tags(id, name, color)), ventures(id, name, slug)")
        .order("is_pinned", { ascending: false })
        .order("updated_at", { ascending: false })
        .limit(100);
    if (typeFilter !== "all")
        query = query.eq("type", typeFilter);
    if (pinnedOnly)
        query = query.eq("is_pinned", true);
    const { data: items } = await query;
    let filtered = items ?? [];
    if (tagFilter) {
        filtered = filtered.filter((k) => k.knowledge_tags?.some((kt) => kt.tags?.name === tagFilter));
    }
    if (search) {
        const q = search.toLowerCase();
        filtered = filtered.filter((k) => k.title.toLowerCase().includes(q) ||
            (k.summary ?? "").toLowerCase().includes(q));
    }
    const [tagsRes, captureRes] = await Promise.all([
        supabase.from("tags").select("id, name, color").order("name"),
        supabase.from("captures").select("id", { count: "exact", head: true }).eq("processed", false),
    ]);
    return {
        items: filtered,
        allTags: tagsRes.data ?? [],
        filters: { type: typeFilter, tag: tagFilter, search, pinned: pinnedOnly },
        captureCount: captureRes.count ?? 0,
    };
}
export default function KnowledgeIndex() {
    const { items, allTags, filters, captureCount } = useLoaderData();
    const navigate = useNavigate();
    const [searchVal, setSearchVal] = useState(filters.search);
    const searchRef = useRef(null);
    function buildUrl(overrides) {
        const p = new URLSearchParams();
        const merged = {
            type: filters.type,
            tag: filters.tag,
            search: filters.search,
            pinned: filters.pinned ? "true" : null,
            ...Object.fromEntries(Object.entries(overrides).map(([k, v]) => [k, v === true ? "true" : v === false ? null : v])),
        };
        if (merged.type && merged.type !== "all")
            p.set("type", merged.type);
        if (merged.tag)
            p.set("tag", merged.tag);
        if (merged.search)
            p.set("search", merged.search);
        if (merged.pinned)
            p.set("pinned", "true");
        const qs = p.toString();
        return `/dashboard/knowledge${qs ? `?${qs}` : ""}`;
    }
    function handleSearch(val) {
        setSearchVal(val);
        if (searchRef.current)
            clearTimeout(searchRef.current);
        searchRef.current = setTimeout(() => {
            navigate(buildUrl({ search: val || null }), { replace: true });
        }, 300);
    }
    return (_jsxs("div", { className: "flex h-full", children: [_jsxs("aside", { className: "flex w-52 shrink-0 flex-col gap-5 overflow-auto border-r border-surface-2/50 p-4", children: [_jsxs("div", { className: "space-y-2", children: [_jsxs(Link, { to: "new", className: "flex w-full items-center justify-center gap-2 rounded-lg bg-brand px-3 py-2 text-sm font-medium text-white hover:bg-brand-dark", children: [_jsx(Plus, { className: "h-4 w-4" }), "New"] }), _jsxs("div", { className: "relative", children: [_jsx(Search, { className: "absolute left-2.5 top-2.5 h-3.5 w-3.5 text-zinc-600" }), _jsx("input", { type: "text", placeholder: "Search\u2026", value: searchVal, onChange: (e) => handleSearch(e.target.value), className: "w-full rounded-lg border border-surface-2/50 bg-surface-1 py-2 pl-8 pr-3 text-sm text-zinc-300 placeholder-zinc-600 focus:outline-none focus:ring-1 focus:ring-brand" }), searchVal && (_jsx("button", { onClick: () => handleSearch(""), className: "absolute right-2 top-2.5 text-zinc-600 hover:text-zinc-400", children: _jsx(X, { className: "h-3.5 w-3.5" }) }))] })] }), _jsxs("nav", { className: "space-y-0.5", children: [KNOWLEDGE_TYPES.map((t) => {
                                const meta = getMeta(t);
                                const active = filters.type === t && !filters.pinned;
                                return (_jsxs(Link, { to: buildUrl({ type: t, pinned: null }), className: `flex items-center gap-2 rounded-lg px-3 py-2 text-sm transition-colors ${active
                                        ? "bg-surface-2/60 text-white"
                                        : "text-zinc-500 hover:bg-surface-2/30 hover:text-zinc-200"}`, children: [_jsx("span", { className: "w-4 text-center text-xs", children: meta.icon }), _jsx("span", { className: "capitalize", children: t === "all" ? "All items" : t })] }, t));
                            }), _jsxs(Link, { to: buildUrl({ pinned: true, type: "all", tag: null }), className: `flex items-center gap-2 rounded-lg px-3 py-2 text-sm transition-colors ${filters.pinned
                                    ? "bg-surface-2/60 text-white"
                                    : "text-zinc-500 hover:bg-surface-2/30 hover:text-zinc-200"}`, children: [_jsx(Pin, { className: "h-3.5 w-3.5 w-4 shrink-0" }), _jsx("span", { children: "Pinned" })] })] }), allTags.length > 0 && (_jsxs("div", { children: [_jsxs("div", { className: "mb-1.5 flex items-center gap-1.5 text-xs font-semibold uppercase tracking-widest text-zinc-600", children: [_jsx(Tag, { className: "h-3 w-3" }), "Tags"] }), _jsx("div", { className: "flex flex-wrap gap-1", children: allTags.map((tag) => (_jsx(Link, { to: buildUrl({ tag: filters.tag === tag.name ? null : tag.name }), className: `rounded px-2 py-0.5 text-xs transition-colors ${filters.tag === tag.name
                                        ? "bg-brand/20 text-brand"
                                        : "bg-surface-2/40 text-zinc-500 hover:text-zinc-200"}`, style: { borderLeft: `2px solid ${tag.color}` }, children: tag.name }, tag.id))) })] })), _jsxs("div", { className: "mt-auto space-y-0.5 border-t border-surface-2/50 pt-3", children: [_jsxs(Link, { to: "/dashboard/knowledge/captures", className: "flex items-center gap-2 rounded-lg px-3 py-2 text-sm text-zinc-500 transition-colors hover:bg-surface-2/30 hover:text-zinc-200", children: [_jsx(Inbox, { className: "h-3.5 w-3.5 shrink-0" }), _jsx("span", { children: "Captures" }), captureCount > 0 && (_jsx("span", { className: "ml-auto rounded bg-brand/20 px-1.5 py-0.5 text-xs font-medium text-brand", children: captureCount }))] }), _jsxs(Link, { to: "/dashboard/knowledge/feeds", className: "flex items-center gap-2 rounded-lg px-3 py-2 text-sm text-zinc-500 transition-colors hover:bg-surface-2/30 hover:text-zinc-200", children: [_jsx(Rss, { className: "h-3.5 w-3.5 shrink-0" }), _jsx("span", { children: "RSS Feeds" })] })] })] }), _jsxs("div", { className: "flex flex-1 flex-col overflow-auto", children: [_jsx(Header, { title: filters.tag
                            ? `#${filters.tag}`
                            : filters.pinned
                                ? "Pinned"
                                : filters.type !== "all"
                                    ? filters.type.charAt(0).toUpperCase() + filters.type.slice(1)
                                    : "Knowledge" }), _jsxs("main", { className: "flex-1 p-6", children: [(filters.tag || filters.search) && (_jsxs("div", { className: "mb-4 flex flex-wrap items-center gap-2", children: [filters.search && (_jsxs("span", { className: "flex items-center gap-1 rounded-full border border-surface-2/50 bg-surface-1 px-3 py-1 text-xs text-zinc-400", children: ["\"", filters.search, "\"", _jsx(Link, { to: buildUrl({ search: null }), className: "ml-1 hover:text-zinc-200", children: _jsx(X, { className: "h-3 w-3" }) })] })), filters.tag && (_jsxs("span", { className: "flex items-center gap-1 rounded-full border border-surface-2/50 bg-surface-1 px-3 py-1 text-xs text-zinc-400", children: ["#", filters.tag, _jsx(Link, { to: buildUrl({ tag: null }), className: "ml-1 hover:text-zinc-200", children: _jsx(X, { className: "h-3 w-3" }) })] })), _jsxs("span", { className: "ml-auto text-xs text-zinc-600", children: [items.length, " item", items.length !== 1 ? "s" : ""] })] })), items.length === 0 ? (_jsx("div", { className: "rounded-xl border border-surface-2/50 bg-surface-1/40 backdrop-blur-sm", children: _jsx(EmptyState, { icon: BookOpen, title: "No items found", description: filters.search || filters.tag
                                        ? "Try adjusting your filters."
                                        : "Start building your knowledge base.", action: _jsxs(Link, { to: "new", className: "inline-flex items-center gap-2 rounded-lg bg-brand px-4 py-2 text-sm font-medium text-white hover:bg-brand-dark", children: [_jsx(Plus, { className: "h-4 w-4" }), "New Item"] }) }) })) : (_jsx("div", { className: "rounded-xl border border-surface-2/50 bg-surface-1/40 backdrop-blur-sm", children: _jsx("div", { className: "divide-y divide-surface-2/30 py-1", children: items.map((item) => {
                                        const meta = getMeta(item.type ?? "note");
                                        const knowledgeTags = item.knowledge_tags ?? [];
                                        return (_jsxs(Link, { to: item.slug, className: "flex items-center gap-4 rounded-lg px-4 py-3 transition-colors hover:bg-surface-2/30", children: [_jsxs("div", { className: "min-w-0 flex-1", children: [_jsxs("div", { className: "flex items-center gap-2", children: [item.is_pinned && (_jsx(Pin, { className: "h-3 w-3 shrink-0 text-amber-400" })), _jsx("span", { className: "truncate text-sm font-medium text-zinc-200", children: item.title }), _jsxs("span", { className: `shrink-0 rounded border px-1.5 py-0.5 text-xs font-medium ${meta.color}`, children: [meta.icon, " ", item.type] }), item.source_type === "rss" && (_jsx(Rss, { className: "h-3 w-3 shrink-0 text-zinc-600" }))] }), item.summary && (_jsx("p", { className: "mt-0.5 truncate text-xs text-zinc-500", children: item.summary })), knowledgeTags.length > 0 && (_jsx("div", { className: "mt-1 flex flex-wrap gap-1", children: knowledgeTags.slice(0, 5).map((kt) => (_jsx("span", { className: "rounded bg-surface-2/40 px-1.5 py-0.5 text-xs text-zinc-600", style: { borderLeft: `2px solid ${kt.tags?.color ?? "#2FE8B6"}` }, children: kt.tags?.name }, kt.tag_id))) }))] }), _jsxs("div", { className: "flex shrink-0 items-center gap-2", children: [item.reading_time && (_jsxs("span", { className: "hidden text-xs text-zinc-700 sm:block", children: [item.reading_time, "m"] })), item.ventures?.name && (_jsx("span", { className: "hidden text-xs text-zinc-700 sm:block", children: item.ventures.name })), _jsx(ChevronRight, { className: "h-4 w-4 text-zinc-700" })] })] }, item.id));
                                    }) }) }))] })] })] }));
}
