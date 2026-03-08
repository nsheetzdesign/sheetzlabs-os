import type { ActionFunctionArgs, LoaderFunctionArgs } from "react-router";
import { Form, useLoaderData, useRouteLoaderData, data } from "react-router";
import { getSupabaseClient } from "~/lib/supabase.server";
import { Button } from "~/components/ui/Button";
import { Input } from "~/components/ui/Input";
import { Select } from "~/components/ui/Select";
import { FormField } from "~/components/ui/FormField";
import type { loader as hubLoader } from "./dashboard.ventures.$slug";

const CATEGORIES = [
  "database",
  "hosting",
  "payments",
  "auth",
  "analytics",
  "ai",
  "email",
  "monitoring",
  "other",
] as const;

const CATEGORY_ICONS: Record<string, string> = {
  database: "🗄️",
  hosting: "☁️",
  payments: "💳",
  auth: "🔐",
  analytics: "📊",
  ai: "🤖",
  email: "✉️",
  monitoring: "📡",
  other: "🔧",
};

export async function loader({ params, context }: LoaderFunctionArgs) {
  const supabase = getSupabaseClient(context.cloudflare.env);
  const { data: v } = await supabase
    .from("ventures")
    .select("id")
    .eq("slug", params.slug!)
    .single();
  if (!v) throw new Response("Not found", { status: 404 });

  const { data: stack } = await supabase
    .from("venture_stack")
    .select("*")
    .eq("venture_id", v.id)
    .order("category")
    .order("created_at");

  return { ventureId: v.id, stack: stack ?? [] };
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
    const id = fd.get("id") as string;
    await supabase.from("venture_stack").delete().eq("id", id);
    return { ok: true };
  }

  // Add
  const toolName = (fd.get("tool_name") as string)?.trim();
  const category = fd.get("category") as string;
  const docsUrl = (fd.get("docs_url") as string)?.trim() || null;
  const dashboardUrl = (fd.get("dashboard_url") as string)?.trim() || null;
  const setupCommands = (fd.get("setup_commands") as string)?.trim() || null;
  const secretsRaw = (fd.get("secrets_required") as string)?.trim() || "";
  const secretsRequired = secretsRaw
    ? secretsRaw.split(/[\n,]+/).map((s) => s.trim()).filter(Boolean)
    : null;

  if (!toolName) return data({ error: "Tool name required" }, { status: 400 });

  const { error } = await supabase.from("venture_stack").insert({
    venture_id: v.id,
    tool_name: toolName,
    category,
    docs_url: docsUrl,
    dashboard_url: dashboardUrl,
    setup_commands: setupCommands,
    secrets_required: secretsRequired,
  });

  if (error) return data({ error: error.message }, { status: 500 });
  return { ok: true };
}

export default function VentureStack() {
  const { stack } = useLoaderData<typeof loader>();
  const hub = useRouteLoaderData<typeof hubLoader>("routes/dashboard.ventures.$slug");
  const venture = hub?.venture;

  const grouped = CATEGORIES.reduce<Record<string, typeof stack>>((acc, cat) => {
    const items = stack.filter((s) => s.category === cat);
    if (items.length) acc[cat] = items;
    return acc;
  }, {});

  return (
    <div className="mx-auto max-w-3xl space-y-6">
      {/* Add form */}
      <Form
        method="post"
        className="rounded-xl border border-surface-2/50 bg-surface-1/40 p-5 backdrop-blur-sm"
      >
        <h2 className="mb-4 text-sm font-semibold text-zinc-300">Add Tool</h2>
        <div className="grid gap-4 sm:grid-cols-2">
          <FormField label="Tool Name" required>
            <Input name="tool_name" placeholder="Supabase" />
          </FormField>
          <FormField label="Category">
            <Select name="category" defaultValue="other">
              {CATEGORIES.map((c) => (
                <option key={c} value={c}>
                  {CATEGORY_ICONS[c]} {c}
                </option>
              ))}
            </Select>
          </FormField>
        </div>
        <div className="mt-4 grid gap-4 sm:grid-cols-2">
          <FormField label="Docs URL">
            <Input name="docs_url" placeholder="https://docs.supabase.com" />
          </FormField>
          <FormField label="Dashboard URL">
            <Input name="dashboard_url" placeholder="https://supabase.com/dashboard" />
          </FormField>
        </div>
        <FormField label="Secrets Required" hint="One per line or comma-separated" className="mt-4">
          <textarea
            name="secrets_required"
            rows={2}
            placeholder="SUPABASE_URL&#10;SUPABASE_ANON_KEY"
            className="w-full rounded-lg border border-surface-2/50 bg-surface-1 px-3 py-2 text-sm font-mono text-zinc-200 placeholder-zinc-600 focus:outline-none focus:ring-1 focus:ring-brand"
          />
        </FormField>
        <FormField label="Setup Commands" hint="Shell commands for initial setup" className="mt-4">
          <textarea
            name="setup_commands"
            rows={2}
            placeholder="npx supabase init&#10;npx supabase link"
            className="w-full rounded-lg border border-surface-2/50 bg-surface-1 px-3 py-2 text-sm font-mono text-zinc-200 placeholder-zinc-600 focus:outline-none focus:ring-1 focus:ring-brand"
          />
        </FormField>
        <div className="mt-4 flex justify-end">
          <Button type="submit">Add Tool</Button>
        </div>
      </Form>

      {/* Stack list grouped by category */}
      {stack.length === 0 ? (
        <p className="py-8 text-center text-sm text-zinc-600">
          No tools in your stack yet. Add your first one above.
        </p>
      ) : (
        Object.entries(grouped).map(([cat, items]) => (
          <div key={cat}>
            <h3 className="mb-2 text-xs font-semibold uppercase tracking-wide text-zinc-500">
              {CATEGORY_ICONS[cat] ?? "🔧"} {cat}
            </h3>
            <div className="space-y-2">
              {items.map((tool) => (
                <div
                  key={tool.id}
                  className="flex items-start justify-between rounded-xl border border-surface-2/50 bg-surface-1/40 p-4"
                >
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <span className="font-medium text-zinc-200">{tool.tool_name}</span>
                    </div>
                    {tool.secrets_required && tool.secrets_required.length > 0 && (
                      <div className="mt-1 flex flex-wrap gap-1">
                        {tool.secrets_required.map((s) => (
                          <code
                            key={s}
                            className="rounded bg-surface-2/50 px-1.5 py-0.5 font-mono text-xs text-zinc-400"
                          >
                            {s}
                          </code>
                        ))}
                      </div>
                    )}
                    <div className="mt-2 flex flex-wrap gap-3 text-xs text-zinc-500">
                      {tool.dashboard_url && (
                        <a
                          href={tool.dashboard_url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="hover:text-brand"
                        >
                          Dashboard ↗
                        </a>
                      )}
                      {tool.docs_url && (
                        <a
                          href={tool.docs_url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="hover:text-brand"
                        >
                          Docs ↗
                        </a>
                      )}
                      {tool.setup_commands && (
                        <span className="font-mono text-zinc-600">
                          {tool.setup_commands.split("\n")[0]}
                          {tool.setup_commands.includes("\n") ? " …" : ""}
                        </span>
                      )}
                    </div>
                  </div>
                  <Form method="post">
                    <input type="hidden" name="intent" value="delete" />
                    <input type="hidden" name="id" value={tool.id} />
                    <button
                      type="submit"
                      className="ml-3 text-zinc-600 hover:text-red-400 transition-colors"
                      title="Remove"
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
