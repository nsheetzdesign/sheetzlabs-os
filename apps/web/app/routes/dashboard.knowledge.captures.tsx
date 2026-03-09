import type { ActionFunctionArgs, LoaderFunctionArgs, MetaFunction } from "react-router";
import { useLoaderData, useFetcher, Form, data } from "react-router";
import { useState } from "react";
import { Inbox, Send, Trash2, ExternalLink, ArrowRight } from "lucide-react";
import { Header } from "~/components/dashboard/Header";
import { getSupabaseClient } from "~/lib/supabase.server";
import { EmptyState } from "~/components/ui/EmptyState";
import { Button } from "~/components/ui/Button";

export const meta: MetaFunction = () => [{ title: "Captures — Sheetz Labs OS" }];

export async function loader({ context }: LoaderFunctionArgs) {
  const supabase = getSupabaseClient(context.cloudflare.env);
  const { data: captures } = await supabase
    .from("captures")
    .select("*")
    .eq("processed", false)
    .order("created_at", { ascending: false });

  return { captures: captures ?? [] };
}

export async function action({ request, context }: ActionFunctionArgs) {
  const supabase = getSupabaseClient(context.cloudflare.env);
  const fd = await request.formData();
  const intent = fd.get("intent") as string;

  if (intent === "create") {
    const content = (fd.get("content") as string)?.trim();
    const source_url = (fd.get("source_url") as string)?.trim() || null;
    if (!content) return data({ error: "Content required" }, { status: 400 });

    let capture_type = "text";
    if (source_url) capture_type = "url";

    await supabase.from("captures").insert({ content, source_url, capture_type });
    return { ok: true };
  }

  if (intent === "process") {
    const id = fd.get("id") as string;
    const title = (fd.get("title") as string)?.trim();
    const type = (fd.get("type") as string) || "note";

    const { data: capture } = await supabase.from("captures").select("*").eq("id", id).single();
    if (!capture) return data({ error: "Not found" }, { status: 404 });

    const slug = (title || "untitled")
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-|-$/g, "");

    const wordCount = capture.content ? capture.content.trim().split(/\s+/).length : 0;
    const { data: item } = await supabase
      .from("knowledge")
      .insert({
        title: title || capture.source_title || "Untitled Capture",
        slug: `${slug}-${Date.now()}`,
        content: capture.content,
        type,
        source_url: capture.source_url,
        source_type: "clip",
        word_count: wordCount || null,
        reading_time: wordCount > 0 ? Math.ceil(wordCount / 200) : null,
      })
      .select("slug")
      .single();

    await supabase
      .from("captures")
      .update({ processed: true, knowledge_id: item?.id })
      .eq("id", id);

    return { ok: true, slug: item?.slug };
  }

  if (intent === "delete") {
    const id = fd.get("id") as string;
    await supabase.from("captures").delete().eq("id", id);
    return { ok: true };
  }

  return { ok: false };
}

const KNOWLEDGE_TYPES = ["note", "doc", "clip", "research", "insight"];

export default function Captures() {
  const { captures } = useLoaderData<typeof loader>();
  const fetcher = useFetcher();
  const [newContent, setNewContent] = useState("");
  const [newUrl, setNewUrl] = useState("");

  function submitCapture() {
    if (!newContent.trim()) return;
    fetcher.submit(
      { intent: "create", content: newContent, source_url: newUrl },
      { method: "post" }
    );
    setNewContent("");
    setNewUrl("");
  }

  return (
    <div className="flex flex-1 flex-col">
      <Header title="Quick Captures" />
      <main className="flex-1 p-6">
        <div className="mx-auto max-w-2xl space-y-6">
          {/* Quick add */}
          <div className="space-y-2 rounded-xl border border-surface-2/50 bg-surface-1/40 p-4 backdrop-blur-sm">
            <textarea
              placeholder="Capture a quick thought, URL, or text snippet…"
              value={newContent}
              onChange={(e) => setNewContent(e.target.value)}
              rows={3}
              onKeyDown={(e) => {
                if (e.key === "Enter" && (e.metaKey || e.ctrlKey)) submitCapture();
              }}
              className="w-full rounded-lg border border-surface-2/50 bg-surface-1 px-3 py-2 text-sm text-zinc-200 placeholder-zinc-600 focus:outline-none focus:ring-1 focus:ring-brand"
            />
            <input
              type="url"
              placeholder="Source URL (optional)"
              value={newUrl}
              onChange={(e) => setNewUrl(e.target.value)}
              className="w-full rounded-lg border border-surface-2/50 bg-surface-1 px-3 py-2 text-sm text-zinc-200 placeholder-zinc-600 focus:outline-none focus:ring-1 focus:ring-brand"
            />
            <div className="flex items-center justify-between">
              <span className="text-xs text-zinc-600">⌘+Enter to save</span>
              <Button
                type="button"
                onClick={submitCapture}
                disabled={!newContent.trim() || fetcher.state !== "idle"}
              >
                <Send className="mr-1.5 h-3.5 w-3.5" />
                Capture
              </Button>
            </div>
          </div>

          {/* List */}
          {captures.length === 0 ? (
            <div className="rounded-xl border border-surface-2/50 bg-surface-1/40 backdrop-blur-sm">
              <EmptyState
                icon={Inbox}
                title="No captures"
                description="Use the form above to capture quick thoughts, URLs, or text snippets."
              />
            </div>
          ) : (
            <div className="space-y-3">
              {captures.map((capture: any) => (
                <CaptureCard key={capture.id} capture={capture} />
              ))}
            </div>
          )}
        </div>
      </main>
    </div>
  );
}

function CaptureCard({ capture }: { capture: any }) {
  const fetcher = useFetcher();
  const [title, setTitle] = useState(
    capture.source_title || capture.content.slice(0, 50)
  );
  const [type, setType] = useState("note");
  const [expanded, setExpanded] = useState(false);

  const isProcessing = fetcher.state !== "idle" && fetcher.formData?.get("intent") === "process";
  const isDeleting = fetcher.state !== "idle" && fetcher.formData?.get("intent") === "delete";

  if (isDeleting) return null;

  return (
    <div className="rounded-xl border border-surface-2/50 bg-surface-1/40 p-4 backdrop-blur-sm">
      <p
        className={`mb-2 whitespace-pre-wrap text-sm text-zinc-300 ${!expanded && "line-clamp-3"}`}
      >
        {capture.content}
      </p>
      {capture.content.length > 200 && (
        <button
          onClick={() => setExpanded(!expanded)}
          className="mb-2 text-xs text-zinc-600 hover:text-zinc-400"
        >
          {expanded ? "Show less" : "Show more"}
        </button>
      )}
      {capture.source_url && (
        <a
          href={capture.source_url}
          target="_blank"
          rel="noopener noreferrer"
          className="mb-3 flex items-center gap-1 truncate text-xs text-brand hover:text-brand-dark"
        >
          <ExternalLink className="h-3 w-3 shrink-0" />
          {capture.source_url}
        </a>
      )}

      {/* Process form */}
      <div className="flex flex-wrap items-center gap-2 border-t border-surface-2/30 pt-3">
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Title"
          className="min-w-0 flex-1 rounded border border-surface-2/50 bg-surface-1 px-2 py-1 text-xs text-zinc-200 placeholder-zinc-600 focus:outline-none focus:ring-1 focus:ring-brand"
        />
        <select
          value={type}
          onChange={(e) => setType(e.target.value)}
          className="rounded border border-surface-2/50 bg-surface-1 px-2 py-1 text-xs text-zinc-300 focus:outline-none focus:ring-1 focus:ring-brand"
        >
          {KNOWLEDGE_TYPES.map((t) => (
            <option key={t} value={t}>
              {t}
            </option>
          ))}
        </select>
        <button
          onClick={() =>
            fetcher.submit(
              { intent: "process", id: capture.id, title, type },
              { method: "post" }
            )
          }
          disabled={isProcessing}
          className="flex items-center gap-1 rounded-lg bg-brand px-2.5 py-1 text-xs font-medium text-white transition-colors hover:bg-brand-dark disabled:opacity-50"
        >
          <ArrowRight className="h-3 w-3" />
          {isProcessing ? "Processing…" : "Save to KB"}
        </button>
        <button
          onClick={() =>
            fetcher.submit({ intent: "delete", id: capture.id }, { method: "post" })
          }
          className="rounded-lg p-1 text-zinc-600 transition-colors hover:bg-red-500/10 hover:text-red-400"
          title="Delete capture"
        >
          <Trash2 className="h-3.5 w-3.5" />
        </button>
      </div>
    </div>
  );
}
