import { useState } from "react";
import type { ActionFunctionArgs, LoaderFunctionArgs, MetaFunction } from "react-router";
import { useLoaderData, useFetcher, Link } from "react-router";
import { Plus, Pencil, Trash2, ArrowLeft, X } from "lucide-react";
import { getSupabaseClient } from "~/lib/supabase.server";

export const meta: MetaFunction = () => [{ title: "Snippets — Inbox — Sheetz Labs OS" }];

export async function loader({ context }: LoaderFunctionArgs) {
  const env = context.cloudflare.env;
  const supabase = getSupabaseClient(env);
  const { data: snippets } = await supabase
    .from("email_snippets")
    .select("*")
    .order("trigger");
  return { snippets: snippets ?? [] };
}

export async function action({ request, context }: ActionFunctionArgs) {
  const env = context.cloudflare.env;
  const supabase = getSupabaseClient(env);
  const formData = await request.formData();
  const intent = formData.get("intent") as string;

  if (intent === "delete") {
    const trigger = formData.get("trigger") as string;
    await supabase.from("email_snippets").delete().eq("trigger", trigger);
    return Response.json({ success: true });
  }

  if (intent === "upsert") {
    const trigger = (formData.get("trigger") as string).toLowerCase().replace(/[^a-z0-9]/g, "");
    const title = formData.get("title") as string;
    const content = formData.get("content") as string;
    const originalTrigger = formData.get("original_trigger") as string | null;

    if (originalTrigger && originalTrigger !== trigger) {
      await supabase.from("email_snippets").delete().eq("trigger", originalTrigger);
    }

    const { error } = await supabase.from("email_snippets").upsert(
      { trigger, title, content, updated_at: new Date().toISOString() },
      { onConflict: "user_id,trigger" }
    );
    if (error) return Response.json({ error: error.message }, { status: 500 });
    return Response.json({ success: true });
  }

  if (intent === "seed") {
    const { data: defaults } = await supabase
      .from("email_snippet_defaults")
      .select("trigger, title, content");
    let seeded = 0;
    for (const s of defaults ?? []) {
      const { error } = await supabase
        .from("email_snippets")
        .insert({ trigger: s.trigger, title: s.title, content: s.content });
      if (!error) seeded++;
    }
    return Response.json({ seeded });
  }

  return Response.json({ error: "Unknown intent" }, { status: 400 });
}

interface Snippet {
  id: string;
  trigger: string;
  title: string;
  content: string;
}

interface EditModalProps {
  snippet: Snippet | null;
  onClose: () => void;
}

function SnippetEditModal({ snippet, onClose }: EditModalProps) {
  const fetcher = useFetcher();
  const [trigger, setTrigger] = useState(snippet?.trigger ?? "");
  const [title, setTitle] = useState(snippet?.title ?? "");
  const [content, setContent] = useState(snippet?.content ?? "");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    fetcher.submit(
      {
        intent: "upsert",
        trigger,
        title: title || trigger,
        content,
        original_trigger: snippet?.trigger ?? "",
      },
      { method: "post" }
    );
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60">
      <div className="w-[480px] rounded-xl border border-zinc-700 bg-zinc-900 shadow-2xl">
        <div className="flex items-center justify-between border-b border-zinc-800 px-4 py-3">
          <h2 className="text-sm font-medium text-zinc-200">
            {snippet ? "Edit Snippet" : "New Snippet"}
          </h2>
          <button onClick={onClose} className="text-zinc-500 hover:text-zinc-300">
            <X className="h-4 w-4" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-4 space-y-3">
          <div>
            <label className="mb-1 block text-xs text-zinc-500">Trigger (type /trigger in compose)</label>
            <div className="flex items-center gap-1">
              <span className="text-zinc-500">/</span>
              <input
                type="text"
                value={trigger}
                onChange={(e) => setTrigger(e.target.value.toLowerCase().replace(/[^a-z0-9]/g, ""))}
                placeholder="sig"
                required
                className="flex-1 rounded-lg border border-zinc-700 bg-zinc-800 px-3 py-2 text-sm text-zinc-200 focus:outline-none focus:ring-1 focus:ring-emerald-500"
              />
            </div>
          </div>

          <div>
            <label className="mb-1 block text-xs text-zinc-500">Name</label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Signature"
              className="w-full rounded-lg border border-zinc-700 bg-zinc-800 px-3 py-2 text-sm text-zinc-200 focus:outline-none focus:ring-1 focus:ring-emerald-500"
            />
          </div>

          <div>
            <label className="mb-1 block text-xs text-zinc-500">Content</label>
            <textarea
              value={content}
              onChange={(e) => setContent(e.target.value)}
              rows={6}
              required
              placeholder="Expanded text..."
              className="w-full rounded-lg border border-zinc-700 bg-zinc-800 px-3 py-2 text-sm text-zinc-200 focus:outline-none focus:ring-1 focus:ring-emerald-500 resize-none font-mono"
            />
          </div>

          <div className="flex justify-end gap-2 pt-1">
            <button
              type="button"
              onClick={onClose}
              className="rounded-lg px-3 py-1.5 text-sm text-zinc-400 hover:text-zinc-200"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={!trigger || !content}
              className="rounded-lg bg-emerald-600 px-4 py-1.5 text-sm font-medium text-white hover:bg-emerald-500 disabled:opacity-50"
            >
              Save
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default function SnippetsPage() {
  const { snippets } = useLoaderData<typeof loader>();
  const fetcher = useFetcher();
  const [editing, setEditing] = useState<string | null>(null); // 'new' | snippet.id

  const handleDelete = (trigger: string) => {
    if (!confirm("Delete this snippet?")) return;
    fetcher.submit({ intent: "delete", trigger }, { method: "post" });
  };

  const editingSnippet =
    editing === "new" ? null : (snippets.find((s) => s.id === editing) as Snippet | undefined) ?? null;

  return (
    <div className="flex flex-1 flex-col">
      <div className="flex items-center gap-3 border-b border-surface-2/50 px-6 py-3">
        <Link
          to="/dashboard/inbox"
          className="flex items-center gap-1.5 text-sm text-zinc-500 transition-colors hover:text-zinc-300"
        >
          <ArrowLeft className="h-4 w-4" />
          Inbox
        </Link>
        <h1 className="text-sm font-semibold text-zinc-200">Email Snippets</h1>
        <div className="ml-auto flex items-center gap-2">
          {snippets.length === 0 && (
            <fetcher.Form method="post">
              <input type="hidden" name="intent" value="seed" />
              <button
                type="submit"
                className="rounded-lg border border-zinc-700 px-3 py-1.5 text-sm text-zinc-400 hover:border-zinc-500 hover:text-zinc-200"
              >
                Load defaults
              </button>
            </fetcher.Form>
          )}
          <button
            onClick={() => setEditing("new")}
            className="flex items-center gap-1.5 rounded-lg bg-emerald-600 px-3 py-1.5 text-sm font-medium text-white hover:bg-emerald-500"
          >
            <Plus className="h-4 w-4" />
            New Snippet
          </button>
        </div>
      </div>

      <div className="mx-auto w-full max-w-2xl p-6">
        <p className="mb-6 text-sm text-zinc-400">
          Type{" "}
          <kbd className="rounded bg-zinc-800 px-1.5 py-0.5 font-mono text-xs text-emerald-400">
            /trigger
          </kbd>{" "}
          in compose to expand snippets. Press Tab to insert.
        </p>

        {snippets.length === 0 ? (
          <div className="rounded-xl border border-dashed border-zinc-700 p-12 text-center">
            <p className="mb-3 text-sm text-zinc-500">No snippets yet.</p>
            <fetcher.Form method="post">
              <input type="hidden" name="intent" value="seed" />
              <button
                type="submit"
                className="text-sm text-emerald-500 hover:text-emerald-400"
              >
                Load default snippets →
              </button>
            </fetcher.Form>
          </div>
        ) : (
          <div className="space-y-2">
            {(snippets as Snippet[]).map((snippet) => (
              <div
                key={snippet.id}
                className="rounded-xl border border-zinc-800 bg-zinc-900 p-4"
              >
                <div className="mb-2 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <kbd className="rounded bg-zinc-800 px-2 py-1 font-mono text-sm text-emerald-400">
                      /{snippet.trigger}
                    </kbd>
                    <span className="text-sm text-zinc-200">{snippet.title}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <button
                      onClick={() => setEditing(snippet.id)}
                      className="rounded p-1.5 text-zinc-500 hover:text-zinc-200"
                    >
                      <Pencil className="h-4 w-4" />
                    </button>
                    <button
                      onClick={() => handleDelete(snippet.trigger)}
                      className="rounded p-1.5 text-zinc-500 hover:text-red-400"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </div>
                <pre className="whitespace-pre-wrap font-sans text-sm text-zinc-500">
                  {snippet.content}
                </pre>
              </div>
            ))}
          </div>
        )}
      </div>

      {editing !== null && (
        <SnippetEditModal
          snippet={editingSnippet}
          onClose={() => setEditing(null)}
        />
      )}
    </div>
  );
}
