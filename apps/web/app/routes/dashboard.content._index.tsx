import type { LoaderFunctionArgs, MetaFunction } from "react-router";
import { useLoaderData, Link, useSearchParams, useNavigate } from "react-router";
import { Plus, FileText, Linkedin, Mail, Twitter, Lightbulb, BookOpen, Calendar, Newspaper } from "lucide-react";
import { Header } from "~/components/dashboard/Header";
import { getSupabaseClient } from "~/lib/supabase.server";
import { EmptyState } from "~/components/ui/EmptyState";

export const meta: MetaFunction = () => [{ title: "Content — Sheetz Labs OS" }];

const TYPES = ["all", "idea", "blog", "linkedin", "newsletter", "twitter", "thread"] as const;
const STATUSES = ["all", "idea", "draft", "review", "scheduled", "published"] as const;

const TYPE_ICON: Record<string, React.ElementType> = {
  idea: Lightbulb,
  blog: BookOpen,
  linkedin: Linkedin,
  newsletter: Mail,
  twitter: Twitter,
  thread: Twitter,
};

const STATUS_COLORS: Record<string, string> = {
  idea: "bg-purple-500/20 text-purple-400 border-purple-500/30",
  draft: "bg-zinc-500/20 text-zinc-400 border-zinc-500/30",
  review: "bg-amber-500/20 text-amber-400 border-amber-500/30",
  scheduled: "bg-blue-500/20 text-blue-400 border-blue-500/30",
  published: "bg-emerald-500/20 text-emerald-400 border-emerald-500/30",
  archived: "bg-zinc-700/20 text-zinc-600 border-zinc-700/30",
};

export async function loader({ request, context }: LoaderFunctionArgs) {
  const supabase = getSupabaseClient(context.cloudflare.env);
  const url = new URL(request.url);
  const type = url.searchParams.get("type") || "all";
  const status = url.searchParams.get("status") || "all";

  let query = supabase
    .from("content")
    .select("id, title, type, status, excerpt, scheduled_for, word_count, parent_id, created_at, parent:parent_id(id, title)")
    .order("created_at", { ascending: false })
    .limit(100);

  if (type !== "all") query = query.eq("type", type);
  if (status !== "all") query = query.eq("status", status);

  const { data: items } = await query;

  return { items: items ?? [], filters: { type, status } };
}

export default function ContentIndex() {
  const { items, filters } = useLoaderData<typeof loader>();
  const [, setSearchParams] = useSearchParams();
  const navigate = useNavigate();

  function setFilter(key: string, value: string) {
    setSearchParams((prev) => {
      const next = new URLSearchParams(prev);
      next.set(key, value);
      return next;
    });
  }

  return (
    <div className="flex h-full">
      {/* Sidebar */}
      <aside className="flex w-52 shrink-0 flex-col gap-5 overflow-auto border-r border-surface-2/50 p-4">
        <div>
          <Link
            to="new"
            className="flex w-full items-center justify-center gap-2 rounded-lg bg-brand px-3 py-2 text-sm font-medium text-white hover:bg-brand-dark"
          >
            <Plus className="h-4 w-4" />
            New
          </Link>
        </div>

        <nav className="space-y-0.5">
          <div className="mb-1 text-xs font-semibold uppercase tracking-widest text-zinc-600">
            Type
          </div>
          {TYPES.map((t) => {
            const Icon = TYPE_ICON[t] || FileText;
            const active = filters.type === t;
            return (
              <button
                key={t}
                onClick={() => setFilter("type", t)}
                className={`flex w-full items-center gap-2 rounded-lg px-3 py-2 text-sm transition-colors ${
                  active
                    ? "bg-surface-2/60 text-white"
                    : "text-zinc-500 hover:bg-surface-2/30 hover:text-zinc-200"
                }`}
              >
                <Icon className="h-3.5 w-3.5 shrink-0" />
                <span className="capitalize">{t === "all" ? "All" : t}</span>
              </button>
            );
          })}
        </nav>

        <nav className="space-y-0.5">
          <div className="mb-1 text-xs font-semibold uppercase tracking-widest text-zinc-600">
            Status
          </div>
          {STATUSES.map((s) => {
            const active = filters.status === s;
            return (
              <button
                key={s}
                onClick={() => setFilter("status", s)}
                className={`flex w-full items-center gap-2 rounded-lg px-3 py-2 text-sm transition-colors ${
                  active
                    ? "bg-surface-2/60 text-white"
                    : "text-zinc-500 hover:bg-surface-2/30 hover:text-zinc-200"
                }`}
              >
                <span className="capitalize">{s === "all" ? "All statuses" : s}</span>
              </button>
            );
          })}
        </nav>

        <div className="mt-auto space-y-0.5 border-t border-surface-2/50 pt-3">
          <Link
            to="/dashboard/knowledge/content/calendar"
            className="flex items-center gap-2 rounded-lg px-3 py-2 text-sm text-zinc-500 transition-colors hover:bg-surface-2/30 hover:text-zinc-200"
          >
            <Calendar className="h-3.5 w-3.5 shrink-0" />
            Calendar
          </Link>
          <Link
            to="/dashboard/knowledge/content/newsletter"
            className="flex items-center gap-2 rounded-lg px-3 py-2 text-sm text-zinc-500 transition-colors hover:bg-surface-2/30 hover:text-zinc-200"
          >
            <Newspaper className="h-3.5 w-3.5 shrink-0" />
            Newsletter
          </Link>
          <Link
            to="/dashboard/knowledge/content/templates"
            className="flex items-center gap-2 rounded-lg px-3 py-2 text-sm text-zinc-500 transition-colors hover:bg-surface-2/30 hover:text-zinc-200"
          >
            <FileText className="h-3.5 w-3.5 shrink-0" />
            Templates
          </Link>
        </div>
      </aside>

      {/* Main */}
      <div className="flex flex-1 flex-col overflow-auto">
        <Header title="Content" />
        <main className="flex-1 p-6">
          {items.length === 0 ? (
            <div className="rounded-xl border border-surface-2/50 bg-surface-1/40 backdrop-blur-sm">
              <EmptyState
                icon={FileText}
                title="No content yet"
                description="Create your first piece of content or generate one with AI."
                action={
                  <Link
                    to="new"
                    className="inline-flex items-center gap-2 rounded-lg bg-brand px-4 py-2 text-sm font-medium text-white hover:bg-brand-dark"
                  >
                    <Plus className="h-4 w-4" />
                    New Content
                  </Link>
                }
              />
            </div>
          ) : (
            <div className="rounded-xl border border-surface-2/50 bg-surface-1/40 backdrop-blur-sm">
              <div className="divide-y divide-surface-2/30 py-1">
                {items.map((item: any) => {
                  const Icon = TYPE_ICON[item.type] || FileText;
                  return (
                    <Link
                      key={item.id}
                      to={item.id}
                      className="flex items-center gap-4 rounded-lg px-4 py-3 transition-colors hover:bg-surface-2/30"
                    >
                      <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-surface-2/60">
                        <Icon className="h-4 w-4 text-zinc-400" />
                      </div>
                      <div className="min-w-0 flex-1">
                        <div className="flex items-center gap-2">
                          <span className="truncate text-sm font-medium text-zinc-200">
                            {item.title}
                          </span>
                          <span
                            className={`shrink-0 rounded border px-1.5 py-0.5 text-xs font-medium ${
                              STATUS_COLORS[item.status] ?? STATUS_COLORS.draft
                            }`}
                          >
                            {item.status}
                          </span>
                        </div>
                        {item.excerpt && (
                          <p className="mt-0.5 truncate text-xs text-zinc-500">{item.excerpt}</p>
                        )}
                        <div className="mt-0.5 flex items-center gap-3 text-xs text-zinc-600">
                          <span className="capitalize">{item.type}</span>
                          {item.scheduled_for && (
                            <span>
                              📅 {new Date(item.scheduled_for).toLocaleDateString()}
                            </span>
                          )}
                          {(item.parent as any)?.title && (
                            <span>↳ from {(item.parent as any).title}</span>
                          )}
                          {item.word_count && <span>{item.word_count}w</span>}
                        </div>
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
