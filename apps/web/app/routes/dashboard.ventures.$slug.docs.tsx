import type { ActionFunctionArgs, LoaderFunctionArgs } from "react-router";
import { Form, useLoaderData, data } from "react-router";
import { useState } from "react";
import { getSupabaseClient } from "~/lib/supabase.server";
import { Button } from "~/components/ui/Button";
import { Input } from "~/components/ui/Input";
import { Select } from "~/components/ui/Select";
import { FormField } from "~/components/ui/FormField";

const DOC_TYPES = [
  { value: "claude_md", label: "CLAUDE.md", icon: "🤖", path: "CLAUDE.md" },
  { value: "skill", label: "Skill", icon: "⚡", path: ".claude/skills/" },
  { value: "hook", label: "Hook", icon: "🪝", path: ".claude/hooks/" },
  { value: "adr", label: "ADR", icon: "📝", path: "docs/decisions/" },
  { value: "runbook", label: "Runbook", icon: "📖", path: "docs/runbooks/" },
  { value: "architecture", label: "Architecture", icon: "🏗️", path: "docs/" },
] as const;

export async function loader({ params, context }: LoaderFunctionArgs) {
  const supabase = getSupabaseClient(context.cloudflare.env);
  const { data: v } = await supabase
    .from("ventures")
    .select("id, name, tagline, slug")
    .eq("slug", params.slug!)
    .single();
  if (!v) throw new Response("Not found", { status: 404 });

  const { data: docs } = await supabase
    .from("venture_docs")
    .select("*")
    .eq("venture_id", v.id)
    .order("type")
    .order("path");

  // Also load the SaaS template for scaffold
  const { data: template } = await supabase
    .from("stack_templates")
    .select("*")
    .eq("venture_type", "saas")
    .single();

  return {
    venture: v,
    docs: docs ?? [],
    template,
  };
}

export async function action({ request, params, context }: ActionFunctionArgs) {
  const supabase = getSupabaseClient(context.cloudflare.env);
  const fd = await request.formData();
  const intent = fd.get("intent") as string;

  const { data: v } = await supabase
    .from("ventures")
    .select("id, name, tagline")
    .eq("slug", params.slug!)
    .single();
  if (!v) throw new Response("Not found", { status: 404 });

  if (intent === "delete") {
    await supabase.from("venture_docs").delete().eq("id", fd.get("id") as string);
    return { ok: true };
  }

  if (intent === "save") {
    const docId = fd.get("doc_id") as string | null;
    const path = (fd.get("path") as string)?.trim();
    const content = (fd.get("content") as string) ?? "";
    const type = fd.get("type") as string;

    if (!path) return data({ error: "Path required" }, { status: 400 });

    const { error } = await supabase.from("venture_docs").upsert(
      {
        id: docId || undefined,
        venture_id: v.id,
        path,
        content,
        type,
        updated_at: new Date().toISOString(),
      },
      { onConflict: "venture_id,path" },
    );
    if (error) return data({ error: error.message }, { status: 500 });
    return { ok: true };
  }

  if (intent === "scaffold-from-template") {
    const { data: template } = await supabase
      .from("stack_templates")
      .select("*")
      .eq("venture_type", "saas")
      .single();

    if (!template?.claude_md_template) return { ok: false };

    const content = template.claude_md_template
      .replace(/\{\{VENTURE_NAME\}\}/g, v.name)
      .replace(/\{\{TAGLINE\}\}/g, v.tagline ?? "");

    const { error } = await supabase.from("venture_docs").upsert(
      {
        venture_id: v.id,
        path: "CLAUDE.md",
        content,
        type: "claude_md",
        updated_at: new Date().toISOString(),
      },
      { onConflict: "venture_id,path" },
    );
    if (error) return data({ error: error.message }, { status: 500 });
    return { ok: true };
  }

  return { ok: true };
}

export default function VentureDocs() {
  const { venture, docs, template } = useLoaderData<typeof loader>();
  const [editingId, setEditingId] = useState<string | "new" | null>(null);
  const [newType, setNewType] = useState<string>("skill");

  const claudeDoc = docs.find((d) => d.type === "claude_md");
  const otherDocs = docs.filter((d) => d.type !== "claude_md");

  const typeGroups = DOC_TYPES.slice(1).reduce<Record<string, typeof docs>>((acc, dt) => {
    const items = otherDocs.filter((d) => d.type === dt.value);
    if (items.length) acc[dt.value] = items;
    return acc;
  }, {});

  const defaultPath =
    DOC_TYPES.find((dt) => dt.value === newType)?.path ?? "";

  return (
    <div className="mx-auto max-w-3xl space-y-6">
      {/* CLAUDE.md section */}
      <div className="rounded-xl border border-surface-2/50 bg-surface-1/40 p-5">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-sm font-semibold text-zinc-300">🤖 CLAUDE.md</h2>
          <div className="flex gap-2">
            {!claudeDoc && template && (
              <Form method="post">
                <input type="hidden" name="intent" value="scaffold-from-template" />
                <Button type="submit" variant="secondary" className="text-xs">
                  Generate from SaaS template
                </Button>
              </Form>
            )}
            <Button
              type="button"
              variant="secondary"
              className="text-xs"
              onClick={() => setEditingId(claudeDoc ? claudeDoc.id : "new-claude-md")}
            >
              {claudeDoc ? "Edit" : "Create"}
            </Button>
          </div>
        </div>

        {editingId === (claudeDoc?.id ?? "new-claude-md") ? (
          <Form method="post" onSubmit={() => setEditingId(null)}>
            <input type="hidden" name="intent" value="save" />
            <input type="hidden" name="doc_id" value={claudeDoc?.id ?? ""} />
            <input type="hidden" name="path" value="CLAUDE.md" />
            <input type="hidden" name="type" value="claude_md" />
            <textarea
              name="content"
              rows={20}
              defaultValue={claudeDoc?.content ?? ""}
              className="w-full rounded-lg border border-surface-2/50 bg-surface-0 px-4 py-3 font-mono text-sm text-zinc-200 placeholder-zinc-600 focus:outline-none focus:ring-1 focus:ring-brand"
              placeholder={`# ${venture.name}\n\n## Purpose\n${venture.tagline ?? ""}\n\n## Stack\n...`}
            />
            <div className="mt-3 flex gap-2">
              <Button type="submit">Save CLAUDE.md</Button>
              <Button type="button" variant="secondary" onClick={() => setEditingId(null)}>
                Cancel
              </Button>
            </div>
          </Form>
        ) : claudeDoc ? (
          <pre className="max-h-64 overflow-y-auto rounded-lg bg-surface-0 p-4 font-mono text-xs text-zinc-400">
            {claudeDoc.content}
          </pre>
        ) : (
          <p className="text-sm text-zinc-600">
            No CLAUDE.md yet. Create one or generate from the SaaS template.
          </p>
        )}
      </div>

      {/* Add new doc */}
      {editingId === "new" ? (
        <Form
          method="post"
          className="rounded-xl border border-surface-2/50 bg-surface-1/40 p-5"
          onSubmit={() => setEditingId(null)}
        >
          <input type="hidden" name="intent" value="save" />
          <h2 className="mb-4 text-sm font-semibold text-zinc-300">New Document</h2>
          <div className="grid gap-4 sm:grid-cols-2">
            <FormField label="Type">
              <Select
                name="type"
                value={newType}
                onChange={(e) => setNewType(e.target.value)}
              >
                {DOC_TYPES.slice(1).map((dt) => (
                  <option key={dt.value} value={dt.value}>
                    {dt.icon} {dt.label}
                  </option>
                ))}
              </Select>
            </FormField>
            <FormField label="Path">
              <Input
                name="path"
                defaultValue={defaultPath}
                placeholder=".claude/skills/deploy.md"
              />
            </FormField>
          </div>
          <FormField label="Content" className="mt-4">
            <textarea
              name="content"
              rows={12}
              className="w-full rounded-lg border border-surface-2/50 bg-surface-0 px-4 py-3 font-mono text-sm text-zinc-200 placeholder-zinc-600 focus:outline-none focus:ring-1 focus:ring-brand"
              placeholder="# Document title&#10;&#10;Content here..."
            />
          </FormField>
          <div className="mt-3 flex gap-2">
            <Button type="submit">Save</Button>
            <Button type="button" variant="secondary" onClick={() => setEditingId(null)}>
              Cancel
            </Button>
          </div>
        </Form>
      ) : (
        <div className="flex justify-end">
          <Button
            type="button"
            variant="secondary"
            onClick={() => setEditingId("new")}
          >
            + Add Document
          </Button>
        </div>
      )}

      {/* Other docs grouped by type */}
      {Object.entries(typeGroups).map(([type, items]) => {
        const dtMeta = DOC_TYPES.find((dt) => dt.value === type);
        return (
          <div key={type}>
            <h3 className="mb-2 text-xs font-semibold uppercase tracking-wide text-zinc-500">
              {dtMeta?.icon} {dtMeta?.label ?? type}
            </h3>
            <div className="space-y-2">
              {items.map((doc) => (
                <div
                  key={doc.id}
                  className="rounded-xl border border-surface-2/50 bg-surface-1/40"
                >
                  <div className="flex items-center justify-between px-4 py-3">
                    <code className="text-sm text-zinc-400">{doc.path}</code>
                    <div className="flex gap-2">
                      <button
                        type="button"
                        onClick={() => setEditingId(editingId === doc.id ? null : doc.id)}
                        className="text-xs text-zinc-500 hover:text-zinc-300 transition-colors"
                      >
                        {editingId === doc.id ? "Close" : "Edit"}
                      </button>
                      <Form method="post">
                        <input type="hidden" name="intent" value="delete" />
                        <input type="hidden" name="id" value={doc.id} />
                        <button
                          type="submit"
                          className="text-xs text-zinc-600 hover:text-red-400 transition-colors"
                        >
                          ✕
                        </button>
                      </Form>
                    </div>
                  </div>
                  {editingId === doc.id && (
                    <Form
                      method="post"
                      className="border-t border-surface-2/50 p-4"
                      onSubmit={() => setEditingId(null)}
                    >
                      <input type="hidden" name="intent" value="save" />
                      <input type="hidden" name="doc_id" value={doc.id} />
                      <input type="hidden" name="path" value={doc.path} />
                      <input type="hidden" name="type" value={doc.type} />
                      <textarea
                        name="content"
                        rows={12}
                        defaultValue={doc.content ?? ""}
                        className="w-full rounded-lg border border-surface-2/50 bg-surface-0 px-4 py-3 font-mono text-sm text-zinc-200 focus:outline-none focus:ring-1 focus:ring-brand"
                      />
                      <div className="mt-3 flex gap-2">
                        <Button type="submit">Save</Button>
                        <Button
                          type="button"
                          variant="secondary"
                          onClick={() => setEditingId(null)}
                        >
                          Cancel
                        </Button>
                      </div>
                    </Form>
                  )}
                </div>
              ))}
            </div>
          </div>
        );
      })}
    </div>
  );
}
