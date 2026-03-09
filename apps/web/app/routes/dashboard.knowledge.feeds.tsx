import type { ActionFunctionArgs, LoaderFunctionArgs, MetaFunction } from "react-router";
import { useLoaderData, useFetcher, data } from "react-router";
import { useState } from "react";
import { Rss, Plus, Trash2, RefreshCw, BookmarkPlus, Check, ExternalLink } from "lucide-react";
import { Header } from "~/components/dashboard/Header";
import { getSupabaseClient } from "~/lib/supabase.server";
import { EmptyState } from "~/components/ui/EmptyState";
import { Button } from "~/components/ui/Button";

export const meta: MetaFunction = () => [{ title: "RSS Feeds — Sheetz Labs OS" }];

export async function loader({ context }: LoaderFunctionArgs) {
  const supabase = getSupabaseClient(context.cloudflare.env);
  const [feedsRes, unreadRes] = await Promise.all([
    supabase.from("feed_sources").select("*").order("name"),
    supabase
      .from("feed_items")
      .select("*, feed_sources(name, category)")
      .eq("is_read", false)
      .order("published_at", { ascending: false })
      .limit(100),
  ]);

  return {
    feeds: feedsRes.data ?? [],
    unreadItems: unreadRes.data ?? [],
  };
}

export async function action({ request, context }: ActionFunctionArgs) {
  const supabase = getSupabaseClient(context.cloudflare.env);
  const fd = await request.formData();
  const intent = fd.get("intent") as string;
  const apiUrl =
    (context.cloudflare.env as Record<string, string>).INTERNAL_API_URL ??
    "https://api.sheetzlabs.com";

  if (intent === "add_feed") {
    const url = (fd.get("url") as string)?.trim();
    const name = (fd.get("name") as string)?.trim() || new URL(url).hostname;
    const category = (fd.get("category") as string)?.trim() || null;
    if (!url) return data({ error: "URL required" }, { status: 400 });

    const res = await fetch(`${apiUrl}/knowledge/feeds`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ url, name, category }),
    });
    const result = (await res.json()) as any;
    return { feed: result.feed };
  }

  if (intent === "delete_feed") {
    const id = fd.get("id") as string;
    await fetch(`${apiUrl}/knowledge/feeds/${id}`, { method: "DELETE" });
    return { ok: true };
  }

  if (intent === "fetch_feed") {
    const id = fd.get("id") as string;
    const res = await fetch(`${apiUrl}/knowledge/feeds/${id}/fetch`, { method: "POST" });
    const result = (await res.json()) as any;
    return { added: result.added };
  }

  if (intent === "mark_read") {
    const id = fd.get("id") as string;
    await supabase.from("feed_items").update({ is_read: true }).eq("id", id);
    return { ok: true };
  }

  if (intent === "save_item") {
    const id = fd.get("id") as string;
    const res = await fetch(`${apiUrl}/knowledge/feeds/items/${id}/save`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ type: "clip" }),
    });
    const result = (await res.json()) as any;
    return { item: result.item };
  }

  return { ok: false };
}

const CATEGORIES = ["ai", "saas", "indie", "church_tech", "news", "tech", "design", "other"];

export default function Feeds() {
  const { feeds, unreadItems } = useLoaderData<typeof loader>();
  const addFetcher = useFetcher();
  const [newUrl, setNewUrl] = useState("");
  const [newName, setNewName] = useState("");
  const [newCategory, setNewCategory] = useState("");
  const [showAddForm, setShowAddForm] = useState(false);

  function handleAddFeed() {
    if (!newUrl.trim()) return;
    addFetcher.submit(
      { intent: "add_feed", url: newUrl, name: newName, category: newCategory },
      { method: "post" }
    );
    setNewUrl("");
    setNewName("");
    setNewCategory("");
    setShowAddForm(false);
  }

  return (
    <div className="flex flex-1 flex-col">
      <Header title="RSS Feeds" />
      <main className="flex-1 p-6">
        <div className="mx-auto max-w-3xl space-y-6">
          {/* Feed management */}
          <div className="rounded-xl border border-surface-2/50 bg-surface-1/40 p-4 backdrop-blur-sm">
            <div className="mb-3 flex items-center justify-between">
              <h2 className="text-sm font-semibold text-zinc-300">
                Subscribed Feeds ({feeds.length})
              </h2>
              <Button
                type="button"
                variant="secondary"
                onClick={() => setShowAddForm(!showAddForm)}
              >
                <Plus className="mr-1.5 h-3.5 w-3.5" />
                Add Feed
              </Button>
            </div>

            {showAddForm && (
              <div className="mb-4 space-y-2 rounded-lg border border-surface-2/30 bg-surface-1/60 p-3">
                <input
                  type="url"
                  placeholder="https://example.com/feed.xml"
                  value={newUrl}
                  onChange={(e) => setNewUrl(e.target.value)}
                  className="w-full rounded border border-surface-2/50 bg-surface-1 px-3 py-2 text-sm text-zinc-200 placeholder-zinc-600 focus:outline-none focus:ring-1 focus:ring-brand"
                />
                <div className="flex gap-2">
                  <input
                    type="text"
                    placeholder="Name (optional)"
                    value={newName}
                    onChange={(e) => setNewName(e.target.value)}
                    className="flex-1 rounded border border-surface-2/50 bg-surface-1 px-3 py-2 text-sm text-zinc-200 placeholder-zinc-600 focus:outline-none focus:ring-1 focus:ring-brand"
                  />
                  <select
                    value={newCategory}
                    onChange={(e) => setNewCategory(e.target.value)}
                    className="rounded border border-surface-2/50 bg-surface-1 px-3 py-2 text-sm text-zinc-300 focus:outline-none focus:ring-1 focus:ring-brand"
                  >
                    <option value="">Category</option>
                    {CATEGORIES.map((c) => (
                      <option key={c} value={c}>
                        {c}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="flex justify-end gap-2">
                  <Button
                    type="button"
                    variant="secondary"
                    onClick={() => setShowAddForm(false)}
                  >
                    Cancel
                  </Button>
                  <Button
                    type="button"
                    onClick={handleAddFeed}
                    disabled={!newUrl.trim() || addFetcher.state !== "idle"}
                  >
                    Subscribe
                  </Button>
                </div>
              </div>
            )}

            {feeds.length === 0 ? (
              <p className="py-4 text-center text-sm text-zinc-600">No feeds yet. Add one above.</p>
            ) : (
              <div className="divide-y divide-surface-2/30">
                {feeds.map((feed: any) => (
                  <FeedRow key={feed.id} feed={feed} />
                ))}
              </div>
            )}
          </div>

          {/* Unread items */}
          <div>
            <h2 className="mb-3 text-sm font-semibold text-zinc-300">
              Unread ({unreadItems.length})
            </h2>
            {unreadItems.length === 0 ? (
              <div className="rounded-xl border border-surface-2/50 bg-surface-1/40 backdrop-blur-sm">
                <EmptyState
                  icon={Rss}
                  title="All caught up"
                  description="No unread feed items. Fetch your feeds to get new content."
                />
              </div>
            ) : (
              <div className="space-y-2">
                {unreadItems.map((item: any) => (
                  <FeedItemRow key={item.id} item={item} />
                ))}
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}

function FeedRow({ feed }: { feed: any }) {
  const fetcher = useFetcher();
  const isFetching =
    fetcher.state !== "idle" && fetcher.formData?.get("intent") === "fetch_feed";
  const isDeleting =
    fetcher.state !== "idle" && fetcher.formData?.get("intent") === "delete_feed";
  const added = (fetcher.data as any)?.added;

  if (isDeleting) return null;

  return (
    <div className="flex items-center gap-3 py-3">
      <div className="min-w-0 flex-1">
        <p className="truncate text-sm font-medium text-zinc-200">{feed.name}</p>
        <p className="truncate text-xs text-zinc-600">{feed.url}</p>
        <div className="mt-0.5 flex items-center gap-2">
          {feed.category && (
            <span className="rounded bg-surface-2/40 px-1.5 py-0.5 text-xs text-zinc-600">
              {feed.category}
            </span>
          )}
          {feed.last_fetched_at && (
            <span className="text-xs text-zinc-700">
              Last: {new Date(feed.last_fetched_at).toLocaleDateString()}
            </span>
          )}
          {added !== undefined && (
            <span className="text-xs text-brand">+{added} new</span>
          )}
        </div>
      </div>
      <div className="flex shrink-0 items-center gap-1">
        <button
          onClick={() =>
            fetcher.submit({ intent: "fetch_feed", id: feed.id }, { method: "post" })
          }
          disabled={isFetching}
          title="Fetch new items"
          className="rounded-lg p-1.5 text-zinc-600 transition-colors hover:bg-surface-2/40 hover:text-zinc-300 disabled:opacity-50"
        >
          <RefreshCw className={`h-3.5 w-3.5 ${isFetching ? "animate-spin" : ""}`} />
        </button>
        <button
          onClick={() =>
            fetcher.submit({ intent: "delete_feed", id: feed.id }, { method: "post" })
          }
          title="Remove feed"
          className="rounded-lg p-1.5 text-zinc-600 transition-colors hover:bg-red-500/10 hover:text-red-400"
        >
          <Trash2 className="h-3.5 w-3.5" />
        </button>
      </div>
    </div>
  );
}

function FeedItemRow({ item }: { item: any }) {
  const fetcher = useFetcher();
  const isSaving =
    fetcher.state !== "idle" && fetcher.formData?.get("intent") === "save_item";
  const isMarkingRead =
    fetcher.state !== "idle" && fetcher.formData?.get("intent") === "mark_read";
  const saved = (fetcher.data as any)?.item;

  if (isMarkingRead && fetcher.state === "loading") return null;

  return (
    <div className="flex items-start gap-3 rounded-xl border border-surface-2/50 bg-surface-1/40 p-3 backdrop-blur-sm">
      <div className="min-w-0 flex-1">
        <div className="flex items-center gap-1.5">
          {item.url ? (
            <a
              href={item.url}
              target="_blank"
              rel="noopener noreferrer"
              className="line-clamp-1 text-sm font-medium text-zinc-200 hover:text-brand"
            >
              {item.title}
            </a>
          ) : (
            <span className="line-clamp-1 text-sm font-medium text-zinc-200">{item.title}</span>
          )}
          {item.url && <ExternalLink className="h-3 w-3 shrink-0 text-zinc-700" />}
        </div>
        <div className="mt-0.5 flex items-center gap-2 text-xs text-zinc-600">
          {item.feed_sources?.name && <span>{item.feed_sources.name}</span>}
          {item.feed_sources?.category && (
            <span className="rounded bg-surface-2/40 px-1 py-0.5">{item.feed_sources.category}</span>
          )}
          {item.published_at && (
            <span>{new Date(item.published_at).toLocaleDateString()}</span>
          )}
        </div>
      </div>
      <div className="flex shrink-0 items-center gap-1">
        {saved ? (
          <span className="flex items-center gap-1 text-xs text-brand">
            <Check className="h-3 w-3" /> Saved
          </span>
        ) : (
          <button
            onClick={() =>
              fetcher.submit({ intent: "save_item", id: item.id }, { method: "post" })
            }
            disabled={isSaving}
            title="Save to knowledge base"
            className="flex items-center gap-1 rounded-lg px-2 py-1 text-xs text-zinc-500 transition-colors hover:bg-surface-2/40 hover:text-brand disabled:opacity-50"
          >
            <BookmarkPlus className="h-3.5 w-3.5" />
            {isSaving ? "Saving…" : "Save"}
          </button>
        )}
        <button
          onClick={() =>
            fetcher.submit({ intent: "mark_read", id: item.id }, { method: "post" })
          }
          title="Mark as read"
          className="rounded-lg p-1 text-zinc-600 transition-colors hover:bg-surface-2/40 hover:text-zinc-300"
        >
          <Check className="h-3.5 w-3.5" />
        </button>
      </div>
    </div>
  );
}
