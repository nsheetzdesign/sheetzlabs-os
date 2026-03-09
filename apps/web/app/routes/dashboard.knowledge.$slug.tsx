import type { ActionFunctionArgs, LoaderFunctionArgs, MetaFunction } from "react-router";
import {
  useLoaderData,
  useActionData,
  Form,
  Link,
  redirect,
  data,
  useFetcher,
} from "react-router";
import { useState } from "react";
import { Pin, ExternalLink, Sparkles, Clock, ArrowLeft } from "lucide-react";
import { Header } from "~/components/dashboard/Header";
import { getSupabaseClient } from "~/lib/supabase.server";
import { FormField } from "~/components/ui/FormField";
import { Input } from "~/components/ui/Input";
import { Select } from "~/components/ui/Select";
import { Button } from "~/components/ui/Button";

export const meta: MetaFunction<typeof loader> = ({ data }) => [
  { title: `${data?.article?.title ?? "Article"} — Sheetz Labs OS` },
];

const KNOWLEDGE_TYPES = [
  "note", "doc", "clip", "playbook", "spec",
  "research", "draft", "learning", "template",
  "meeting_prep", "daily_plan", "insight",
];

const TYPE_META: Record<string, { icon: string; color: string }> = {
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

export async function loader({ params, context }: LoaderFunctionArgs) {
  const supabase = getSupabaseClient(context.cloudflare.env);

  const [articleRes, venturesRes] = await Promise.all([
    supabase
      .from("knowledge")
      .select("*, ventures(id, name, slug), knowledge_tags(tag_id, tags(id, name, color))")
      .eq("slug", params.slug!)
      .single(),
    supabase.from("ventures").select("id, name, slug").order("name"),
  ]);

  if (!articleRes.data) throw new Response("Not found", { status: 404 });

  return {
    article: articleRes.data,
    ventures: venturesRes.data ?? [],
  };
}

export async function action({ request, params, context }: ActionFunctionArgs) {
  const supabase = getSupabaseClient(context.cloudflare.env);
  const fd = await request.formData();
  const intent = fd.get("intent") as string;

  if (intent === "delete") {
    await supabase.from("knowledge").delete().eq("slug", params.slug!);
    return redirect("/dashboard/knowledge");
  }

  if (intent === "pin") {
    const { data: current } = await supabase
      .from("knowledge")
      .select("is_pinned")
      .eq("slug", params.slug!)
      .single();
    await supabase
      .from("knowledge")
      .update({ is_pinned: !current?.is_pinned })
      .eq("slug", params.slug!);
    return null;
  }

  if (intent === "summarize") {
    const { data: item } = await supabase
      .from("knowledge")
      .select("id")
      .eq("slug", params.slug!)
      .single();
    if (item) {
      const apiUrl =
        (context.cloudflare.env as Record<string, string>).INTERNAL_API_URL ??
        "https://api.sheetzlabs.com";
      const res = await fetch(`${apiUrl}/knowledge/${item.id}/summarize`, { method: "POST" });
      if (res.ok) {
        const { summary } = (await res.json()) as { summary: string };
        return { summary };
      }
    }
    return null;
  }

  const title = (fd.get("title") as string)?.trim();
  const newSlug = (fd.get("slug") as string)?.trim();
  const type = (fd.get("type") as string) || "note";
  const tagsRaw = (fd.get("tags") as string)?.trim();
  const tags = tagsRaw
    ? tagsRaw.split(",").map((t) => t.trim()).filter(Boolean)
    : null;
  const venture_id = (fd.get("venture_id") as string) || null;
  const content = (fd.get("content") as string)?.trim() || null;
  const source_url = (fd.get("source_url") as string)?.trim() || null;

  const errors: Record<string, string> = {};
  if (!title) errors.title = "Required";
  if (!newSlug) errors.slug = "Required";
  if (Object.keys(errors).length) return data({ errors }, { status: 400 });

  const wordCount = content ? content.trim().split(/\s+/).length : 0;
  const readingTime = wordCount > 0 ? Math.ceil(wordCount / 200) : null;

  const { error } = await supabase
    .from("knowledge")
    .update({
      title,
      slug: newSlug,
      type,
      tags,
      venture_id,
      content,
      source_url,
      word_count: wordCount || null,
      reading_time: readingTime,
    })
    .eq("slug", params.slug!);

  if (error) return data({ errors: { _form: error.message } }, { status: 500 });

  return redirect(`/dashboard/knowledge/${newSlug}`);
}

/** Minimal markdown → HTML */
function renderMarkdown(md: string): string {
  return md
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/^#### (.+)$/gm, '<h4 class="text-sm font-semibold text-zinc-300 mt-4 mb-1">$1</h4>')
    .replace(/^### (.+)$/gm, '<h3 class="text-base font-semibold text-zinc-200 mt-5 mb-2">$1</h3>')
    .replace(/^## (.+)$/gm, '<h2 class="text-lg font-semibold text-zinc-100 mt-6 mb-2">$1</h2>')
    .replace(/^# (.+)$/gm, '<h1 class="text-xl font-bold text-zinc-100 mt-6 mb-3">$1</h1>')
    .replace(/`([^`]+)`/g, '<code class="rounded bg-surface-2/60 px-1 py-0.5 font-mono text-xs text-brand">$1</code>')
    .replace(/\*\*(.+?)\*\*/g, '<strong class="font-semibold text-zinc-100">$1</strong>')
    .replace(/\*(.+?)\*/g, '<em class="italic text-zinc-300">$1</em>')
    .replace(/^- (.+)$/gm, '<li class="ml-4 list-disc text-zinc-400 text-sm">$1</li>')
    .replace(/^(\d+)\. (.+)$/gm, '<li class="ml-4 list-decimal text-zinc-400 text-sm">$2</li>')
    .replace(/\n\n/g, '</p><p class="text-zinc-400 text-sm mt-3">')
    .replace(/^(?!<[h|l|p])(.+)$/gm, (_, line) =>
      line.trim() ? `<p class="text-zinc-400 text-sm">${line}</p>` : ""
    );
}

export default function EditKnowledge() {
  const { article, ventures } = useLoaderData<typeof loader>();
  const actionData = useActionData<typeof action>();
  const errors = (actionData as any)?.errors ?? {};
  const fetcher = useFetcher();
  const [mode, setMode] = useState<"edit" | "preview">("edit");

  const meta = getMeta(article.type);
  const tagsString = (article.tags ?? []).join(", ");
  const knowledgeTags = (article.knowledge_tags as any[]) ?? [];

  const isSummarizing = fetcher.state !== "idle" && (fetcher.formData?.get("intent") === "summarize");
  const currentSummary =
    fetcher.data?.summary ?? article.summary;

  return (
    <div className="flex flex-1 flex-col">
      <Header title={article.title} />
      <main className="flex-1 p-6">
        <div className="mx-auto max-w-3xl space-y-4">
          {/* Meta bar */}
          <div className="flex flex-wrap items-center gap-3 rounded-xl border border-surface-2/50 bg-surface-1/40 px-5 py-3 backdrop-blur-sm">
            <Link to="/dashboard/knowledge" className="text-xs text-zinc-600 hover:text-zinc-400">
              <ArrowLeft className="inline h-3 w-3 mr-1" />
              All items
            </Link>
            <span className={`rounded border px-2 py-0.5 text-xs font-medium ${meta.color}`}>
              {meta.icon} {article.type}
            </span>
            {knowledgeTags.length > 0 && (
              <div className="flex flex-wrap gap-1">
                {knowledgeTags.map((kt: any) => (
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
            <div className="ml-auto flex items-center gap-2">
              {article.reading_time && (
                <span className="flex items-center gap-1 text-xs text-zinc-600">
                  <Clock className="h-3 w-3" />
                  {article.reading_time}m
                </span>
              )}
              {article.is_pinned && <Pin className="h-3.5 w-3.5 text-amber-400" />}
              {article.source_url && (
                <a
                  href={article.source_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-zinc-600 hover:text-brand"
                >
                  <ExternalLink className="h-3.5 w-3.5" />
                </a>
              )}
            </div>
          </div>

          {/* Summary */}
          {currentSummary && (
            <div className="rounded-xl border border-surface-2/50 bg-surface-1/40 px-5 py-4 backdrop-blur-sm">
              <div className="mb-1 flex items-center gap-1.5 text-xs font-semibold uppercase tracking-widest text-zinc-600">
                <Sparkles className="h-3 w-3" />
                AI Summary
              </div>
              <p className="text-sm text-zinc-400">{currentSummary}</p>
            </div>
          )}

          {errors._form && (
            <div className="rounded-lg border border-red-500/20 bg-red-500/10 px-4 py-3 text-sm text-red-400">
              {errors._form}
            </div>
          )}

          {/* Edit / Preview toggle */}
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => setMode("edit")}
              className={`rounded-lg px-3 py-1.5 text-sm font-medium transition-colors ${
                mode === "edit" ? "bg-brand text-white" : "text-zinc-400 hover:text-zinc-200"
              }`}
            >
              Edit
            </button>
            <button
              type="button"
              onClick={() => setMode("preview")}
              className={`rounded-lg px-3 py-1.5 text-sm font-medium transition-colors ${
                mode === "preview" ? "bg-brand text-white" : "text-zinc-400 hover:text-zinc-200"
              }`}
            >
              Preview
            </button>
            <div className="ml-auto flex items-center gap-2">
              {/* Pin toggle */}
              <fetcher.Form method="post">
                <input type="hidden" name="intent" value="pin" />
                <button
                  type="submit"
                  title={article.is_pinned ? "Unpin" : "Pin"}
                  className="rounded-lg p-1.5 text-zinc-500 transition-colors hover:bg-surface-2/40 hover:text-amber-400"
                >
                  <Pin className={`h-4 w-4 ${article.is_pinned ? "text-amber-400" : ""}`} />
                </button>
              </fetcher.Form>
              {/* AI Summarize */}
              {article.content && (
                <fetcher.Form method="post" action={`/dashboard/knowledge/${article.slug}`}>
                  <input type="hidden" name="intent" value="summarize" />
                  <button
                    type="submit"
                    disabled={isSummarizing}
                    title="Generate AI summary"
                    className="flex items-center gap-1.5 rounded-lg px-2.5 py-1.5 text-xs text-zinc-500 transition-colors hover:bg-surface-2/40 hover:text-brand disabled:opacity-50"
                  >
                    <Sparkles className="h-3.5 w-3.5" />
                    {isSummarizing ? "Summarizing…" : "Summarize"}
                  </button>
                </fetcher.Form>
              )}
            </div>
          </div>

          {mode === "preview" ? (
            <div className="rounded-xl border border-surface-2/50 bg-surface-1/40 p-6 backdrop-blur-sm">
              <h1 className="mb-4 text-xl font-bold text-zinc-100">{article.title}</h1>
              {article.content ? (
                <div
                  className="prose-sm space-y-1"
                  dangerouslySetInnerHTML={{ __html: renderMarkdown(article.content) }}
                />
              ) : (
                <p className="text-sm italic text-zinc-600">No content yet.</p>
              )}
            </div>
          ) : (
            <Form
              method="post"
              className="space-y-5 rounded-xl border border-surface-2/50 bg-surface-1/40 p-6 backdrop-blur-sm"
            >
              <div className="grid gap-5 sm:grid-cols-2">
                <FormField label="Title" required error={errors.title}>
                  <Input name="title" defaultValue={article.title} error={!!errors.title} />
                </FormField>
                <FormField label="Slug" required error={errors.slug}>
                  <Input name="slug" defaultValue={article.slug} error={!!errors.slug} />
                </FormField>
              </div>

              <div className="grid gap-5 sm:grid-cols-2">
                <FormField label="Type">
                  <Select name="type" defaultValue={article.type ?? "note"}>
                    {KNOWLEDGE_TYPES.map((t) => (
                      <option key={t} value={t}>
                        {t}
                      </option>
                    ))}
                  </Select>
                </FormField>
                <FormField label="Venture">
                  <Select name="venture_id" defaultValue={article.venture_id ?? ""}>
                    <option value="">None (general)</option>
                    {ventures.map((v) => (
                      <option key={v.id} value={v.id}>
                        {v.name}
                      </option>
                    ))}
                  </Select>
                </FormField>
              </div>

              <FormField label="Tags" hint="Comma-separated">
                <Input name="tags" defaultValue={tagsString} />
              </FormField>

              <FormField label="Source URL" hint="Original URL if clipped from web">
                <Input
                  name="source_url"
                  defaultValue={article.source_url ?? ""}
                  type="url"
                  placeholder="https://example.com/article"
                />
              </FormField>

              <FormField label="Content" hint="Markdown supported">
                <textarea
                  name="content"
                  rows={20}
                  defaultValue={article.content ?? ""}
                  className="w-full rounded-lg border border-surface-2/50 bg-surface-1 px-3 py-2 font-mono text-sm text-zinc-200 placeholder-zinc-600 focus:outline-none focus:ring-1 focus:ring-brand"
                />
              </FormField>

              <div className="flex items-center gap-3 pt-2">
                <Button type="submit">Save Changes</Button>
                <Link to="/dashboard/knowledge">
                  <Button type="button" variant="secondary">
                    Cancel
                  </Button>
                </Link>
              </div>
            </Form>
          )}

          {/* Delete zone */}
          <Form
            method="post"
            className="rounded-xl border border-red-500/10 bg-red-500/5 p-4"
            onSubmit={(e) => {
              if (!confirm(`Delete "${article.title}"? This cannot be undone.`)) e.preventDefault();
            }}
          >
            <input type="hidden" name="intent" value="delete" />
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-red-400">Delete Article</p>
                <p className="text-xs text-zinc-600">Permanently removes this article.</p>
              </div>
              <Button type="submit" variant="danger">
                Delete
              </Button>
            </div>
          </Form>
        </div>
      </main>
    </div>
  );
}
