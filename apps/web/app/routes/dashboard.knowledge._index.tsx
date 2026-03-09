import type { LoaderFunctionArgs, MetaFunction } from "react-router";
import { useLoaderData, Link, useNavigate } from "react-router";
import { useState, useRef } from "react";
import {
  Plus, BookOpen, ChevronRight, Pin, Rss, Inbox,
  Search, Tag, X,
} from "lucide-react";
import { Header } from "~/components/dashboard/Header";
import { getSupabaseClient } from "~/lib/supabase.server";
import { EmptyState } from "~/components/ui/EmptyState";

export const meta: MetaFunction = () => [{ title: "Knowledge — Sheetz Labs OS" }];

const KNOWLEDGE_TYPES = [
  "all", "doc", "note", "clip", "playbook", "spec",
  "research", "draft", "learning", "template",
] as const;

const TYPE_META: Record<string, { icon: string; color: string }> = {
  all:          { icon: "📚", color: "text-zinc-400 bg-zinc-500/10 border-zinc-500/20" },
  doc:          { icon: "📄", color: "text-sky-400 bg-sky-500/10 border-sky-500/20" },
  note:         { icon: "📝", color: "text-zinc-400 bg-zinc-500/10 border-zinc-500/20" },
  clip:         { icon: "🔗", color: "text-amber-400 bg-amber-500/10 border-amber-500/20" },
  playbook:     { icon: "📋", color: "text-blue-400 bg-blue-500/10 border-blue-500/20" },
  spec:         { icon: "⚙️", color: "text-violet-400 bg-violet-500/10 border-violet-500/20" },
  research:     { icon: "🔬", color: "text-teal-400 bg-teal-500/10 border-teal-500/20" },
  draft:        { icon: "✏️", color: "text-orange-400 bg-orange-500/10 border-orange-500/20" },
  learning:     { icon: "🧠", color: "text-violet-400 bg-violet-500/10 border-violet-500/20" },
  template:     { icon: "📐", color: "text-amber-400 bg-amber-500/10 border-amber-500/20" },
  meeting_prep: { icon: "🗓", color: "text-pink-400 bg-pink-500/10 border-pink-500/20" },
  daily_plan:   { icon: "📅", color: "text-green-400 bg-green-500/10 border-green-500/20" },
  insight:      { icon: "💡", color: "text-yellow-400 bg-yellow-500/10 border-yellow-500/20" },
};

function getMeta(type: string) {
  return TYPE_META[type] ?? TYPE_META.note;
}

export async function loader({ request, context }: LoaderFunctionArgs) {
  const supabase = getSupabaseClient(context.cloudflare.env);
  const url = new URL(request.url);
  const typeFilter = url.searchParams.get("type") || "all";
  const tagFilter = url.searchParams.get("tag") || "";
  const search = url.searchParams.get("search") || "";
  const pinnedOnly = url.searchParams.get("pinned") === "true";

  let query = supabase
    .from("knowledge")
    .select(
      "id, title, slug, type, tags, venture_id, is_pinned, summary, reading_time, source_type, created_at, updated_at, knowledge_tags(tag_id, tags(id, name, color)), ventures(id, name, slug)"
    )
    .order("is_pinned", { ascending: false })
    .order("updated_at", { ascending: false })
    .limit(100);

  if (typeFilter !== "all") query = query.eq("type", typeFilter);
  if (pinnedOnly) query = query.eq("is_pinned", true);

  const { data: items } = await query;

  let filtered = items ?? [];
  if (tagFilter) {
    filtered = filtered.filter((k) =>
      (k.knowledge_tags as any[])?.some((kt: any) => kt.tags?.name === tagFilter)
    );
  }
  if (search) {
    const q = search.toLowerCase();
    filtered = filtered.filter(
      (k) =>
        k.title.toLowerCase().includes(q) ||
        (k.summary ?? "").toLowerCase().includes(q)
    );
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
  const { items, allTags, filters, captureCount } = useLoaderData<typeof loader>();
  const navigate = useNavigate();
  const [searchVal, setSearchVal] = useState(filters.search);
  const searchRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  function buildUrl(overrides: Record<string, string | null | boolean>) {
    const p = new URLSearchParams();
    const merged = {
      type: filters.type,
      tag: filters.tag,
      search: filters.search,
      pinned: filters.pinned ? "true" : null,
      ...Object.fromEntries(
        Object.entries(overrides).map(([k, v]) => [k, v === true ? "true" : v === false ? null : v])
      ),
    };
    if (merged.type && merged.type !== "all") p.set("type", merged.type);
    if (merged.tag) p.set("tag", merged.tag);
    if (merged.search) p.set("search", merged.search);
    if (merged.pinned) p.set("pinned", "true");
    const qs = p.toString();
    return `/dashboard/knowledge${qs ? `?${qs}` : ""}`;
  }

  function handleSearch(val: string) {
    setSearchVal(val);
    if (searchRef.current) clearTimeout(searchRef.current);
    searchRef.current = setTimeout(() => {
      navigate(buildUrl({ search: val || null }), { replace: true });
    }, 300);
  }

  return (
    <div className="flex h-full">
      {/* Sidebar */}
      <aside className="flex w-52 shrink-0 flex-col gap-5 overflow-auto border-r border-surface-2/50 p-4">
        <div className="space-y-2">
          <Link
            to="new"
            className="flex w-full items-center justify-center gap-2 rounded-lg bg-brand px-3 py-2 text-sm font-medium text-white hover:bg-brand-dark"
          >
            <Plus className="h-4 w-4" />
            New
          </Link>
          <div className="relative">
            <Search className="absolute left-2.5 top-2.5 h-3.5 w-3.5 text-zinc-600" />
            <input
              type="text"
              placeholder="Search…"
              value={searchVal}
              onChange={(e) => handleSearch(e.target.value)}
              className="w-full rounded-lg border border-surface-2/50 bg-surface-1 py-2 pl-8 pr-3 text-sm text-zinc-300 placeholder-zinc-600 focus:outline-none focus:ring-1 focus:ring-brand"
            />
            {searchVal && (
              <button
                onClick={() => handleSearch("")}
                className="absolute right-2 top-2.5 text-zinc-600 hover:text-zinc-400"
              >
                <X className="h-3.5 w-3.5" />
              </button>
            )}
          </div>
        </div>

        <nav className="space-y-0.5">
          {KNOWLEDGE_TYPES.map((t) => {
            const meta = getMeta(t);
            const active = filters.type === t && !filters.pinned;
            return (
              <Link
                key={t}
                to={buildUrl({ type: t, pinned: null })}
                className={`flex items-center gap-2 rounded-lg px-3 py-2 text-sm transition-colors ${
                  active
                    ? "bg-surface-2/60 text-white"
                    : "text-zinc-500 hover:bg-surface-2/30 hover:text-zinc-200"
                }`}
              >
                <span className="w-4 text-center text-xs">{meta.icon}</span>
                <span className="capitalize">{t === "all" ? "All items" : t}</span>
              </Link>
            );
          })}
          <Link
            to={buildUrl({ pinned: true, type: "all", tag: null })}
            className={`flex items-center gap-2 rounded-lg px-3 py-2 text-sm transition-colors ${
              filters.pinned
                ? "bg-surface-2/60 text-white"
                : "text-zinc-500 hover:bg-surface-2/30 hover:text-zinc-200"
            }`}
          >
            <Pin className="h-3.5 w-3.5 w-4 shrink-0" />
            <span>Pinned</span>
          </Link>
        </nav>

        {allTags.length > 0 && (
          <div>
            <div className="mb-1.5 flex items-center gap-1.5 text-xs font-semibold uppercase tracking-widest text-zinc-600">
              <Tag className="h-3 w-3" />
              Tags
            </div>
            <div className="flex flex-wrap gap-1">
              {allTags.map((tag: any) => (
                <Link
                  key={tag.id}
                  to={buildUrl({ tag: filters.tag === tag.name ? null : tag.name })}
                  className={`rounded px-2 py-0.5 text-xs transition-colors ${
                    filters.tag === tag.name
                      ? "bg-brand/20 text-brand"
                      : "bg-surface-2/40 text-zinc-500 hover:text-zinc-200"
                  }`}
                  style={{ borderLeft: `2px solid ${tag.color}` }}
                >
                  {tag.name}
                </Link>
              ))}
            </div>
          </div>
        )}

        <div className="mt-auto space-y-0.5 border-t border-surface-2/50 pt-3">
          <Link
            to="/dashboard/knowledge/captures"
            className="flex items-center gap-2 rounded-lg px-3 py-2 text-sm text-zinc-500 transition-colors hover:bg-surface-2/30 hover:text-zinc-200"
          >
            <Inbox className="h-3.5 w-3.5 shrink-0" />
            <span>Captures</span>
            {captureCount > 0 && (
              <span className="ml-auto rounded bg-brand/20 px-1.5 py-0.5 text-xs font-medium text-brand">
                {captureCount}
              </span>
            )}
          </Link>
          <Link
            to="/dashboard/knowledge/feeds"
            className="flex items-center gap-2 rounded-lg px-3 py-2 text-sm text-zinc-500 transition-colors hover:bg-surface-2/30 hover:text-zinc-200"
          >
            <Rss className="h-3.5 w-3.5 shrink-0" />
            <span>RSS Feeds</span>
          </Link>
        </div>
      </aside>

      {/* Main */}
      <div className="flex flex-1 flex-col overflow-auto">
        <Header
          title={
            filters.tag
              ? `#${filters.tag}`
              : filters.pinned
              ? "Pinned"
              : filters.type !== "all"
              ? filters.type.charAt(0).toUpperCase() + filters.type.slice(1)
              : "Knowledge"
          }
        />
        <main className="flex-1 p-6">
          {(filters.tag || filters.search) && (
            <div className="mb-4 flex flex-wrap items-center gap-2">
              {filters.search && (
                <span className="flex items-center gap-1 rounded-full border border-surface-2/50 bg-surface-1 px-3 py-1 text-xs text-zinc-400">
                  "{filters.search}"
                  <Link to={buildUrl({ search: null })} className="ml-1 hover:text-zinc-200">
                    <X className="h-3 w-3" />
                  </Link>
                </span>
              )}
              {filters.tag && (
                <span className="flex items-center gap-1 rounded-full border border-surface-2/50 bg-surface-1 px-3 py-1 text-xs text-zinc-400">
                  #{filters.tag}
                  <Link to={buildUrl({ tag: null })} className="ml-1 hover:text-zinc-200">
                    <X className="h-3 w-3" />
                  </Link>
                </span>
              )}
              <span className="ml-auto text-xs text-zinc-600">
                {items.length} item{items.length !== 1 ? "s" : ""}
              </span>
            </div>
          )}

          {items.length === 0 ? (
            <div className="rounded-xl border border-surface-2/50 bg-surface-1/40 backdrop-blur-sm">
              <EmptyState
                icon={BookOpen}
                title="No items found"
                description={
                  filters.search || filters.tag
                    ? "Try adjusting your filters."
                    : "Start building your knowledge base."
                }
                action={
                  <Link
                    to="new"
                    className="inline-flex items-center gap-2 rounded-lg bg-brand px-4 py-2 text-sm font-medium text-white hover:bg-brand-dark"
                  >
                    <Plus className="h-4 w-4" />
                    New Item
                  </Link>
                }
              />
            </div>
          ) : (
            <div className="rounded-xl border border-surface-2/50 bg-surface-1/40 backdrop-blur-sm">
              <div className="divide-y divide-surface-2/30 py-1">
                {items.map((item) => {
                  const meta = getMeta(item.type ?? "note");
                  const knowledgeTags = (item.knowledge_tags as any[]) ?? [];
                  return (
                    <Link
                      key={item.id}
                      to={item.slug}
                      className="flex items-center gap-4 rounded-lg px-4 py-3 transition-colors hover:bg-surface-2/30"
                    >
                      <div className="min-w-0 flex-1">
                        <div className="flex items-center gap-2">
                          {item.is_pinned && (
                            <Pin className="h-3 w-3 shrink-0 text-amber-400" />
                          )}
                          <span className="truncate text-sm font-medium text-zinc-200">
                            {item.title}
                          </span>
                          <span
                            className={`shrink-0 rounded border px-1.5 py-0.5 text-xs font-medium ${meta.color}`}
                          >
                            {meta.icon} {item.type}
                          </span>
                          {item.source_type === "rss" && (
                            <Rss className="h-3 w-3 shrink-0 text-zinc-600" />
                          )}
                        </div>
                        {item.summary && (
                          <p className="mt-0.5 truncate text-xs text-zinc-500">{item.summary}</p>
                        )}
                        {knowledgeTags.length > 0 && (
                          <div className="mt-1 flex flex-wrap gap-1">
                            {knowledgeTags.slice(0, 5).map((kt: any) => (
                              <span
                                key={kt.tag_id}
                                className="rounded bg-surface-2/40 px-1.5 py-0.5 text-xs text-zinc-600"
                                style={{ borderLeft: `2px solid ${kt.tags?.color ?? "#2FE8B6"}` }}
                              >
                                {kt.tags?.name}
                              </span>
                            ))}
                          </div>
                        )}
                      </div>
                      <div className="flex shrink-0 items-center gap-2">
                        {item.reading_time && (
                          <span className="hidden text-xs text-zinc-700 sm:block">
                            {item.reading_time}m
                          </span>
                        )}
                        {(item.ventures as { name: string } | null)?.name && (
                          <span className="hidden text-xs text-zinc-700 sm:block">
                            {(item.ventures as { name: string }).name}
                          </span>
                        )}
                        <ChevronRight className="h-4 w-4 text-zinc-700" />
                      </div>
                    </Link>
                  );
                })}
              </div>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}
