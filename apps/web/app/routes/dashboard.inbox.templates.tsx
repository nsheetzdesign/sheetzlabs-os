import { useState } from "react";
import type { ActionFunctionArgs, LoaderFunctionArgs, MetaFunction } from "react-router";
import { useLoaderData, useFetcher, Link } from "react-router";
import { Plus, Pencil, Trash2, ArrowLeft, X } from "lucide-react";
import { getSupabaseClient } from "~/lib/supabase.server";

export const meta: MetaFunction = () => [{ title: "Templates — Inbox — Sheetz Labs OS" }];

export async function loader({ context }: LoaderFunctionArgs) {
  const env = context.cloudflare.env;
  const supabase = getSupabaseClient(env);
  const { data: templates } = await supabase
    .from("email_templates")
    .select("*")
    .order("name");
  return { templates: templates ?? [] };
}

export async function action({ request, context }: ActionFunctionArgs) {
  const env = context.cloudflare.env;
  const supabase = getSupabaseClient(env);
  const formData = await request.formData();
  const intent = formData.get("intent") as string;

  if (intent === "create") {
    const name = formData.get("name") as string;
    const subject = formData.get("subject") as string;
    const body = formData.get("body") as string;
    const { error } = await supabase
      .from("email_templates")
      .insert({ name, subject: subject || null, body });
    if (error) return Response.json({ error: error.message }, { status: 500 });
    return Response.json({ success: true });
  }

  if (intent === "update") {
    const id = formData.get("id") as string;
    const name = formData.get("name") as string;
    const subject = formData.get("subject") as string;
    const body = formData.get("body") as string;
    const { error } = await supabase
      .from("email_templates")
      .update({ name, subject: subject || null, body, updated_at: new Date().toISOString() })
      .eq("id", id);
    if (error) return Response.json({ error: error.message }, { status: 500 });
    return Response.json({ success: true });
  }

  if (intent === "delete") {
    const id = formData.get("id") as string;
    await supabase.from("email_templates").delete().eq("id", id);
    return Response.json({ success: true });
  }

  return Response.json({ error: "Unknown intent" }, { status: 400 });
}

interface Template {
  id: string;
  name: string;
  subject: string | null;
  body: string;
}

interface EditModalProps {
  template: Template | null;
  onClose: () => void;
}

function TemplateEditModal({ template, onClose }: EditModalProps) {
  const fetcher = useFetcher();
  const [name, setName] = useState(template?.name ?? "");
  const [subject, setSubject] = useState(template?.subject ?? "");
  const [body, setBody] = useState(template?.body ?? "");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    fetcher.submit(
      {
        intent: template ? "update" : "create",
        id: template?.id ?? "",
        name,
        subject,
        body,
      },
      { method: "post" }
    );
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60">
      <div className="w-[560px] rounded-xl border border-zinc-700 bg-zinc-900 shadow-2xl">
        <div className="flex items-center justify-between border-b border-zinc-800 px-4 py-3">
          <h2 className="text-sm font-medium text-zinc-200">
            {template ? "Edit Template" : "New Template"}
          </h2>
          <button onClick={onClose} className="text-zinc-500 hover:text-zinc-300">
            <X className="h-4 w-4" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-4 space-y-3">
          <div>
            <label className="mb-1 block text-xs text-zinc-500">Template Name</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Cold outreach"
              required
              className="w-full rounded-lg border border-zinc-700 bg-zinc-800 px-3 py-2 text-sm text-zinc-200 focus:outline-none focus:ring-1 focus:ring-emerald-500"
            />
          </div>

          <div>
            <label className="mb-1 block text-xs text-zinc-500">Subject (optional)</label>
            <input
              type="text"
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
              placeholder="Leave blank to not pre-fill subject"
              className="w-full rounded-lg border border-zinc-700 bg-zinc-800 px-3 py-2 text-sm text-zinc-200 focus:outline-none focus:ring-1 focus:ring-emerald-500"
            />
          </div>

          <div>
            <label className="mb-1 block text-xs text-zinc-500">Body</label>
            <textarea
              value={body}
              onChange={(e) => setBody(e.target.value)}
              rows={10}
              required
              placeholder="Email body..."
              className="w-full rounded-lg border border-zinc-700 bg-zinc-800 px-3 py-2 text-sm text-zinc-200 focus:outline-none focus:ring-1 focus:ring-emerald-500 resize-none"
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
              disabled={!name || !body}
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

export default function TemplatesPage() {
  const { templates } = useLoaderData<typeof loader>();
  const fetcher = useFetcher();
  const [editing, setEditing] = useState<string | null>(null);

  const handleDelete = (id: string) => {
    if (!confirm("Delete this template?")) return;
    fetcher.submit({ intent: "delete", id }, { method: "post" });
  };

  const editingTemplate =
    editing === "new"
      ? null
      : ((templates as Template[]).find((t) => t.id === editing) ?? null);

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
        <h1 className="text-sm font-semibold text-zinc-200">Email Templates</h1>
        <div className="ml-auto">
          <button
            onClick={() => setEditing("new")}
            className="flex items-center gap-1.5 rounded-lg bg-emerald-600 px-3 py-1.5 text-sm font-medium text-white hover:bg-emerald-500"
          >
            <Plus className="h-4 w-4" />
            New Template
          </button>
        </div>
      </div>

      <div className="mx-auto w-full max-w-2xl p-6">
        <p className="mb-6 text-sm text-zinc-400">
          Use the "Use template" option in compose to populate a new email with a template.
        </p>

        {templates.length === 0 ? (
          <div className="rounded-xl border border-dashed border-zinc-700 p-12 text-center">
            <p className="mb-3 text-sm text-zinc-500">No templates yet.</p>
            <button
              onClick={() => setEditing("new")}
              className="text-sm text-emerald-500 hover:text-emerald-400"
            >
              Create your first template →
            </button>
          </div>
        ) : (
          <div className="space-y-3">
            {(templates as Template[]).map((template) => (
              <div
                key={template.id}
                className="rounded-xl border border-zinc-800 bg-zinc-900 p-4"
              >
                <div className="mb-2 flex items-center justify-between">
                  <div>
                    <div className="text-sm font-medium text-zinc-200">{template.name}</div>
                    {template.subject && (
                      <div className="mt-0.5 text-xs text-zinc-500">
                        Subject: {template.subject}
                      </div>
                    )}
                  </div>
                  <div className="flex items-center gap-1">
                    <button
                      onClick={() => setEditing(template.id)}
                      className="rounded p-1.5 text-zinc-500 hover:text-zinc-200"
                    >
                      <Pencil className="h-4 w-4" />
                    </button>
                    <button
                      onClick={() => handleDelete(template.id)}
                      className="rounded p-1.5 text-zinc-500 hover:text-red-400"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </div>
                <pre className="line-clamp-3 whitespace-pre-wrap font-sans text-sm text-zinc-500">
                  {template.body}
                </pre>
              </div>
            ))}
          </div>
        )}
      </div>

      {editing !== null && (
        <TemplateEditModal
          template={editingTemplate}
          onClose={() => setEditing(null)}
        />
      )}
    </div>
  );
}
