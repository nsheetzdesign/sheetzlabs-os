import type { LoaderFunctionArgs } from "react-router";
import { useLoaderData, Form, Link } from "react-router";
import { Plus, BookOpen, ChevronRight } from "lucide-react";
import { Header } from "~/components/dashboard/Header";
import { getSupabaseClient } from "~/lib/supabase.server";
import { Button } from "~/components/ui/Button";
import { EmptyState } from "~/components/ui/EmptyState";

const KNOWLEDGE_TYPES = ["playbook", "learning", "template", "note"] as const;
type KnowledgeType = (typeof KNOWLEDGE_TYPES)[number];

const TYPE_META: Record<KnowledgeType, { icon: string; color: string }> = {
  playbook: { icon: "📋", color: "text-blue-400 bg-blue-500/10 border-blue-500/20" },
  learning: { icon: "🧠", color: "text-violet-400 bg-violet-500/10 border-violet-500/20" },
  template: { icon: "📐", color: "text-amber-400 bg-amber-500/10 border-amber-500/20" },
  note: { icon: "📝", color: "text-zinc-400 bg-zinc-500/10 border-zinc-500/20" },
};

export async function loader({ request, context }: LoaderFunctionArgs) {
  const supabase = getSupabaseClient(context.cloudflare.env);
  const url = new URL(request.url);
  const typeFilter = url.searchParams.get("type") || "";
  const tagFilter = url.searchParams.get("tag") || "";

  let query = supabase
    .from("knowledge")
    .select("id, title, slug, type, tags, venture_id, created_at, ventures(id, name, slug)")
    .order("updated_at", { ascending: false });

  if (typeFilter) query = query.eq("type", typeFilter);
  if (tagFilter) query = query.contains("tags", [tagFilter]);

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
  const { items, allTags, filters } = useLoaderData<typeof loader>();

  // Group by type for display
  const grouped = new Map<string, typeof items>();
  for (const type of KNOWLEDGE_TYPES) grouped.set(type, []);
  for (const item of items) {
    const t = item.type ?? "note";
    if (!grouped.has(t)) grouped.set(t, []);
    grouped.get(t)!.push(item);
  }

  const activeGroups = (filters.type ? [filters.type] : [...KNOWLEDGE_TYPES]).filter(
    (t) => (grouped.get(t)?.length ?? 0) > 0,
  );

  return (
    <div className="flex flex-1 flex-col">
      <Header title="Knowledge" />
      <main className="flex-1 p-6">
        {/* Filters */}
        <Form method="get" className="mb-4 flex flex-wrap items-center gap-2">
          <select
            name="type"
            defaultValue={filters.type}
            className="rounded-lg border border-surface-2/50 bg-surface-1 px-3 py-1.5 text-sm text-zinc-300 focus:outline-none focus:ring-1 focus:ring-brand"
          >
            <option value="">All types</option>
            {KNOWLEDGE_TYPES.map((t) => (
              <option key={t} value={t}>
                {TYPE_META[t].icon} {t}
              </option>
            ))}
          </select>

          {allTags.length > 0 && (
            <select
              name="tag"
              defaultValue={filters.tag}
              className="rounded-lg border border-surface-2/50 bg-surface-1 px-3 py-1.5 text-sm text-zinc-300 focus:outline-none focus:ring-1 focus:ring-brand"
            >
              <option value="">All tags</option>
              {allTags.map((tag) => (
                <option key={tag} value={tag}>
                  {tag}
                </option>
              ))}
            </select>
          )}

          <Button type="submit" variant="secondary">
            Filter
          </Button>
          {(filters.type || filters.tag) && (
            <Link to="/dashboard/knowledge">
              <Button type="button" variant="secondary">
                Clear
              </Button>
            </Link>
          )}

          <div className="ml-auto flex items-center gap-3">
            <p className="text-xs text-zinc-600">
              {items.length} article{items.length !== 1 ? "s" : ""}
            </p>
            <Link
              to="new"
              className="inline-flex items-center gap-2 rounded-lg bg-brand px-3 py-1.5 text-sm font-medium text-white transition-colors hover:bg-brand-dark"
            >
              <Plus className="h-4 w-4" />
              New Article
            </Link>
          </div>
        </Form>

        {items.length === 0 ? (
          <div className="rounded-xl border border-surface-2/50 bg-surface-1/40 backdrop-blur-sm">
            <EmptyState
              icon={BookOpen}
              title="No knowledge articles"
              description={
                filters.type || filters.tag
                  ? "No articles match these filters."
                  : "Start building your knowledge base with playbooks, learnings, and notes."
              }
              action={
                <Link
                  to="new"
                  className="inline-flex items-center gap-2 rounded-lg bg-brand px-4 py-2 text-sm font-medium text-white hover:bg-brand-dark"
                >
                  <Plus className="h-4 w-4" />
                  New Article
                </Link>
              }
            />
          </div>
        ) : (
          <div className="space-y-6">
            {activeGroups.map((type) => {
              const groupItems = grouped.get(type) ?? [];
              if (groupItems.length === 0) return null;
              const meta = TYPE_META[type as KnowledgeType] ?? TYPE_META.note;
              return (
                <div key={type}>
                  <h3 className="mb-2 text-xs font-semibold uppercase tracking-widest text-zinc-600">
                    {meta.icon} {type}
                    <span className="ml-2 font-mono text-zinc-700">({groupItems.length})</span>
                  </h3>
                  <div className="rounded-xl border border-surface-2/50 bg-surface-1/40 backdrop-blur-sm">
                    <div className="divide-y divide-surface-2/30 py-1">
                      {groupItems.map((item) => (
                        <Link
                          key={item.id}
                          to={item.slug}
                          className="flex items-center gap-4 rounded-lg px-4 py-3 transition-colors hover:bg-surface-2/30"
                        >
                          <div className="min-w-0 flex-1">
                            <div className="flex items-center gap-2">
                              <span className="text-sm font-medium text-zinc-200">
                                {item.title}
                              </span>
                              <span
                                className={`rounded border px-1.5 py-0.5 text-xs font-medium ${meta.color}`}
                              >
                                {item.type}
                              </span>
                            </div>
                            {(item.tags ?? []).length > 0 && (
                              <div className="mt-1 flex flex-wrap gap-1">
                                {(item.tags ?? []).map((tag) => (
                                  <span
                                    key={tag}
                                    className="rounded bg-surface-2/40 px-1.5 py-0.5 text-xs text-zinc-600"
                                  >
                                    #{tag}
                                  </span>
                                ))}
                              </div>
                            )}
                          </div>
                          <div className="flex shrink-0 items-center gap-2">
                            {(item.ventures as { name: string } | null)?.name && (
                              <span className="hidden text-xs text-zinc-700 sm:block">
                                {(item.ventures as { name: string }).name}
                              </span>
                            )}
                            <ChevronRight className="h-4 w-4 text-zinc-700" />
                          </div>
                        </Link>
                      ))}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </main>
    </div>
  );
}
