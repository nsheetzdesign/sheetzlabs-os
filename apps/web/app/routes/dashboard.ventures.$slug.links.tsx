import type { ActionFunctionArgs, LoaderFunctionArgs } from "react-router";
import { Form, useLoaderData, data } from "react-router";
import { getSupabaseClient } from "~/lib/supabase.server";
import { Button } from "~/components/ui/Button";
import { Input } from "~/components/ui/Input";
import { Select } from "~/components/ui/Select";
import { FormField } from "~/components/ui/FormField";

const LINK_TYPES = ["repo", "live", "docs", "figma", "dashboard", "other"] as const;

const TYPE_ICONS: Record<string, string> = {
  repo: "⑂",
  live: "↗",
  docs: "📄",
  figma: "◆",
  dashboard: "⊞",
  other: "🔗",
};

const TYPE_COLORS: Record<string, string> = {
  repo: "text-purple-400 border-purple-500/30 bg-purple-500/10",
  live: "text-green-400 border-green-500/30 bg-green-500/10",
  docs: "text-blue-400 border-blue-500/30 bg-blue-500/10",
  figma: "text-pink-400 border-pink-500/30 bg-pink-500/10",
  dashboard: "text-amber-400 border-amber-500/30 bg-amber-500/10",
  other: "text-zinc-400 border-zinc-500/30 bg-zinc-500/10",
};

export async function loader({ params, context }: LoaderFunctionArgs) {
  const supabase = getSupabaseClient(context.cloudflare.env);
  const { data: v } = await supabase
    .from("ventures")
    .select("id")
    .eq("slug", params.slug!)
    .single();
  if (!v) throw new Response("Not found", { status: 404 });

  const { data: links } = await supabase
    .from("venture_links")
    .select("*")
    .eq("venture_id", v.id)
    .order("type")
    .order("created_at");

  return { ventureId: v.id, links: links ?? [] };
}

export async function action({ request, params, context }: ActionFunctionArgs) {
  const supabase = getSupabaseClient(context.cloudflare.env);
  const fd = await request.formData();
  const intent = fd.get("intent") as string;

  const { data: v } = await supabase
    .from("ventures")
    .select("id")
    .eq("slug", params.slug!)
    .single();
  if (!v) throw new Response("Not found", { status: 404 });

  if (intent === "delete") {
    await supabase.from("venture_links").delete().eq("id", fd.get("id") as string);
    return { ok: true };
  }

  const label = (fd.get("label") as string)?.trim();
  const url = (fd.get("url") as string)?.trim();
  const type = (fd.get("type") as string) || "other";

  if (!label || !url) return data({ error: "Label and URL required" }, { status: 400 });

  const { error } = await supabase.from("venture_links").insert({
    venture_id: v.id,
    label,
    url,
    type,
  });

  if (error) return data({ error: error.message }, { status: 500 });
  return { ok: true };
}

export default function VentureLinks() {
  const { links } = useLoaderData<typeof loader>();

  const grouped = LINK_TYPES.reduce<Record<string, typeof links>>((acc, t) => {
    const items = links.filter((l) => l.type === t);
    if (items.length) acc[t] = items;
    return acc;
  }, {});

  return (
    <div className="mx-auto max-w-3xl space-y-6">
      {/* Add form */}
      <Form
        method="post"
        className="rounded-xl border border-surface-2/50 bg-surface-1/40 p-5 backdrop-blur-sm"
      >
        <h2 className="mb-4 text-sm font-semibold text-zinc-300">Add Link</h2>
        <div className="grid gap-4 sm:grid-cols-3">
          <FormField label="Label" required>
            <Input name="label" placeholder="GitHub Repo" />
          </FormField>
          <FormField label="Type">
            <Select name="type" defaultValue="other">
              {LINK_TYPES.map((t) => (
                <option key={t} value={t}>
                  {TYPE_ICONS[t]} {t}
                </option>
              ))}
            </Select>
          </FormField>
          <FormField label="URL" required>
            <Input name="url" placeholder="https://github.com/..." />
          </FormField>
        </div>
        <div className="mt-4 flex justify-end">
          <Button type="submit">Add Link</Button>
        </div>
      </Form>

      {/* Links list */}
      {links.length === 0 ? (
        <p className="py-8 text-center text-sm text-zinc-600">No links yet.</p>
      ) : (
        Object.entries(grouped).map(([type, items]) => (
          <div key={type}>
            <h3 className="mb-2 text-xs font-semibold uppercase tracking-wide text-zinc-500">
              {TYPE_ICONS[type]} {type}
            </h3>
            <div className="space-y-2">
              {items.map((link) => (
                <div
                  key={link.id}
                  className="flex items-center justify-between rounded-xl border border-surface-2/50 bg-surface-1/40 px-4 py-3"
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <span
                      className={`shrink-0 rounded border px-2 py-0.5 text-xs font-medium ${TYPE_COLORS[link.type ?? "other"] ?? TYPE_COLORS.other}`}
                    >
                      {TYPE_ICONS[link.type ?? "other"]} {link.type}
                    </span>
                    <a
                      href={link.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="truncate text-sm font-medium text-zinc-200 hover:text-brand"
                    >
                      {link.label}
                    </a>
                    <span className="hidden truncate text-xs text-zinc-600 sm:block">
                      {link.url}
                    </span>
                  </div>
                  <Form method="post">
                    <input type="hidden" name="intent" value="delete" />
                    <input type="hidden" name="id" value={link.id} />
                    <button
                      type="submit"
                      className="ml-3 text-zinc-600 hover:text-red-400 transition-colors"
                    >
                      ✕
                    </button>
                  </Form>
                </div>
              ))}
            </div>
          </div>
        ))
      )}
    </div>
  );
}
