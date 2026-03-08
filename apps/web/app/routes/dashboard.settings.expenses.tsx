import type { ActionFunctionArgs, LoaderFunctionArgs } from "react-router";
import { Form, useLoaderData, data } from "react-router";
import { getSupabaseClient } from "~/lib/supabase.server";
import { requireAuth } from "~/lib/auth.server";
import {
  Cloud,
  Database,
  Brain,
  Zap,
  RefreshCw,
  CheckCircle2,
  XCircle,
} from "lucide-react";

const PROVIDER_META: Record<
  string,
  { label: string; icon: React.ElementType; description: string; color: string }
> = {
  cloudflare: {
    label: "Cloudflare",
    icon: Cloud,
    description: "Workers, Pages, R2, and other Cloudflare usage costs.",
    color: "text-orange-400",
  },
  supabase: {
    label: "Supabase",
    icon: Database,
    description: "Database, Auth, Storage, and Edge Function usage.",
    color: "text-green-400",
  },
  anthropic: {
    label: "Anthropic",
    icon: Brain,
    description: "Claude API token usage and model costs.",
    color: "text-purple-400",
  },
  openai: {
    label: "OpenAI",
    icon: Zap,
    description: "GPT API calls, embeddings, and fine-tuning costs.",
    color: "text-blue-400",
  },
};

export async function loader({ request, context }: LoaderFunctionArgs) {
  const { headers } = await requireAuth(request, context.cloudflare.env);
  const supabase = getSupabaseClient(context.cloudflare.env);

  const [connectionsRes, venturesRes] = await Promise.all([
    supabase
      .from("expense_connections")
      .select("id, provider, is_active, last_sync_at, venture_id")
      .order("provider"),
    supabase.from("ventures").select("id, name").order("name"),
  ]);

  return data(
    {
      connections: connectionsRes.data ?? [],
      ventures: venturesRes.data ?? [],
    },
    { headers },
  );
}

export async function action({ request, context }: ActionFunctionArgs) {
  await requireAuth(request, context.cloudflare.env);
  const supabase = getSupabaseClient(context.cloudflare.env);
  const fd = await request.formData();
  const intent = fd.get("intent") as string;
  const connectionId = fd.get("connection_id") as string;

  if (intent === "toggle") {
    const currentActive = fd.get("is_active") === "true";
    await supabase
      .from("expense_connections")
      .update({ is_active: !currentActive })
      .eq("id", connectionId);
  }

  if (intent === "set-venture") {
    const ventureId = (fd.get("venture_id") as string) || null;
    await supabase
      .from("expense_connections")
      .update({ venture_id: ventureId })
      .eq("id", connectionId);
  }

  if (intent === "sync") {
    // Update last_sync_at — the actual sync API call is done client-side or via n8n
    await supabase
      .from("expense_connections")
      .update({ last_sync_at: new Date().toISOString() })
      .eq("id", connectionId);
  }

  return data({ ok: true });
}

export default function SettingsExpenses() {
  const { connections, ventures } = useLoaderData<typeof loader>();

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-base font-semibold text-zinc-200">Expense Connections</h2>
        <p className="mt-1 text-sm text-zinc-500">
          Configure automatic expense sync for cloud service providers. Future sync jobs will pull
          usage-based billing data and create expense records automatically.
        </p>
      </div>

      <div className="space-y-4">
        {connections.map((conn) => {
          const meta = PROVIDER_META[conn.provider] ?? {
            label: conn.provider,
            icon: Zap,
            description: "",
            color: "text-zinc-400",
          };
          const Icon = meta.icon;
          const linkedVenture = ventures.find((v) => v.id === conn.venture_id);
          const lastSync = conn.last_sync_at
            ? new Date(conn.last_sync_at).toLocaleString()
            : "Never";

          return (
            <div
              key={conn.id}
              className="rounded-xl border border-surface-2/50 bg-surface-1/40 p-5"
            >
              {/* Header row */}
              <div className="flex items-start justify-between gap-4">
                <div className="flex items-center gap-3">
                  <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-surface-0/60">
                    <Icon className={`h-5 w-5 ${meta.color}`} />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <p className="font-medium text-zinc-200">{meta.label}</p>
                      {conn.is_active ? (
                        <span className="flex items-center gap-1 rounded-full bg-green-500/10 px-2 py-0.5 text-xs text-green-400">
                          <CheckCircle2 className="h-3 w-3" />
                          Active
                        </span>
                      ) : (
                        <span className="flex items-center gap-1 rounded-full bg-zinc-700/30 px-2 py-0.5 text-xs text-zinc-500">
                          <XCircle className="h-3 w-3" />
                          Disabled
                        </span>
                      )}
                    </div>
                    <p className="mt-0.5 text-xs text-zinc-500">{meta.description}</p>
                  </div>
                </div>

                {/* Toggle button */}
                <Form method="post">
                  <input type="hidden" name="intent" value="toggle" />
                  <input type="hidden" name="connection_id" value={conn.id} />
                  <input type="hidden" name="is_active" value={String(conn.is_active)} />
                  <button
                    type="submit"
                    className={`rounded-lg border px-3 py-1.5 text-xs font-medium transition-colors ${
                      conn.is_active
                        ? "border-red-500/20 bg-red-500/10 text-red-400 hover:bg-red-500/20"
                        : "border-green-500/20 bg-green-500/10 text-green-400 hover:bg-green-500/20"
                    }`}
                  >
                    {conn.is_active ? "Disable" : "Enable"}
                  </button>
                </Form>
              </div>

              {/* Controls row */}
              <div className="mt-4 flex flex-wrap items-center gap-4">
                {/* Venture mapping */}
                <Form method="post" className="flex items-center gap-2">
                  <input type="hidden" name="intent" value="set-venture" />
                  <input type="hidden" name="connection_id" value={conn.id} />
                  <label className="text-xs text-zinc-500 whitespace-nowrap">Link venture:</label>
                  <select
                    name="venture_id"
                    defaultValue={conn.venture_id ?? ""}
                    onChange={(e) => (e.currentTarget.form as HTMLFormElement).requestSubmit()}
                    className="rounded-lg border border-surface-2/50 bg-surface-0/80 px-2.5 py-1.5 text-xs text-zinc-300 focus:outline-none focus:ring-1 focus:ring-brand"
                  >
                    <option value="">No specific venture</option>
                    {ventures.map((v) => (
                      <option key={v.id} value={v.id}>
                        {v.name}
                      </option>
                    ))}
                  </select>
                </Form>

                {/* Manual sync */}
                <Form method="post" className="flex items-center gap-2">
                  <input type="hidden" name="intent" value="sync" />
                  <input type="hidden" name="connection_id" value={conn.id} />
                  <button
                    type="submit"
                    disabled={!conn.is_active}
                    className="inline-flex items-center gap-1.5 rounded-lg border border-brand/20 bg-brand/10 px-3 py-1.5 text-xs text-brand transition-colors hover:bg-brand/20 disabled:cursor-not-allowed disabled:opacity-40"
                  >
                    <RefreshCw className="h-3.5 w-3.5" />
                    Trigger Sync
                  </button>
                </Form>

                {/* Last sync */}
                <p className="text-xs text-zinc-600">
                  Last sync: <span className="text-zinc-400">{lastSync}</span>
                </p>
              </div>

              {/* Linked venture indicator */}
              {linkedVenture && (
                <p className="mt-3 text-xs text-zinc-600">
                  Expenses synced to:{" "}
                  <span className="font-medium text-zinc-400">{linkedVenture.name}</span>
                </p>
              )}
            </div>
          );
        })}
      </div>

      {/* Coming soon notice */}
      <div className="rounded-xl border border-dashed border-surface-2/50 p-5 text-center">
        <p className="text-sm font-medium text-zinc-500">Auto-sync coming soon</p>
        <p className="mt-1 text-xs text-zinc-600">
          Automatic expense ingestion via provider APIs will be configured here. Until then, add
          expenses manually from the Expenses section.
        </p>
      </div>
    </div>
  );
}
