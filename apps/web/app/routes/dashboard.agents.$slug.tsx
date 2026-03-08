import type { LoaderFunctionArgs, ActionFunctionArgs } from "react-router";
import { useLoaderData, Link, Form, useNavigation } from "react-router";
import { useState } from "react";
import { ArrowLeft, Play, Clock, CheckCircle, XCircle, Loader2 } from "lucide-react";
import { Header } from "~/components/dashboard/Header";
import { getSupabaseClient } from "~/lib/supabase.server";
import { Button } from "~/components/ui/Button";

const STATUS_META: Record<string, { color: string; label: string; Icon: React.ComponentType<{ className?: string }> }> = {
  completed: { color: "text-green-400 bg-green-500/10 border-green-500/30", label: "Completed", Icon: CheckCircle },
  running: { color: "text-amber-400 bg-amber-500/10 border-amber-500/30", label: "Running", Icon: Loader2 },
  failed: { color: "text-red-400 bg-red-500/10 border-red-500/30", label: "Failed", Icon: XCircle },
};

function formatDuration(ms: number | null) {
  if (!ms) return "—";
  if (ms < 1000) return `${ms}ms`;
  return `${(ms / 1000).toFixed(1)}s`;
}

function formatTime(str: string | null) {
  if (!str) return "—";
  return new Date(str).toLocaleString(undefined, {
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

function formatCost(cents: number | null) {
  if (!cents) return "—";
  return `$${(cents / 100).toFixed(4)}`;
}

function JsonBlock({ label, data }: { label: string; data: unknown }) {
  const [open, setOpen] = useState(false);
  const isEmpty = data === null || data === undefined;
  return (
    <div className="rounded-lg border border-surface-2/50 bg-surface-1/30">
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        className="flex w-full items-center justify-between px-4 py-3 text-left"
      >
        <span className="text-sm font-medium text-zinc-300">{label}</span>
        <span className="text-xs text-zinc-600">{open ? "▲" : "▼"} {isEmpty ? "empty" : ""}</span>
      </button>
      {open && (
        <div className="border-t border-surface-2/50 px-4 py-3">
          {isEmpty ? (
            <p className="text-xs italic text-zinc-600">No data</p>
          ) : (
            <pre className="overflow-x-auto font-mono text-xs text-zinc-400">
              {JSON.stringify(data, null, 2)}
            </pre>
          )}
        </div>
      )}
    </div>
  );
}

export async function loader({ params, context }: LoaderFunctionArgs) {
  const supabase = getSupabaseClient(context.cloudflare.env);

  const { data: agent } = await supabase
    .from("agents")
    .select("*")
    .eq("slug", params.slug!)
    .single();

  if (!agent) throw new Response("Not found", { status: 404 });

  const { data: runs } = await supabase
    .from("agent_runs")
    .select("*")
    .eq("agent_id", agent.id)
    .order("created_at", { ascending: false })
    .limit(20);

  return { agent, runs: runs ?? [] };
}

export async function action({ params, request, context }: ActionFunctionArgs) {
  const supabase = getSupabaseClient(context.cloudflare.env);
  const formData = await request.formData();
  const intent = formData.get("intent");

  if (intent === "toggle") {
    const { data: agent } = await supabase
      .from("agents")
      .select("enabled")
      .eq("slug", params.slug!)
      .single();

    if (agent) {
      await supabase
        .from("agents")
        .update({ enabled: !agent.enabled })
        .eq("slug", params.slug!);
    }
  }

  if (intent === "run") {
    // Fire via API — web can't hold long-running execution
    const apiUrl = context.cloudflare.env.INTERNAL_API_URL ?? "https://api.sheetzlabs.com";
    await fetch(`${apiUrl}/agents/${params.slug}/run`, { method: "POST" });
  }

  return null;
}

export default function AgentDetail() {
  const { agent, runs } = useLoaderData<typeof loader>();
  const navigation = useNavigation();
  const isSubmitting = navigation.state === "submitting";

  return (
    <div className="flex flex-1 flex-col">
      <Header title={agent.name} />
      <main className="flex-1 p-6">
        <div className="mx-auto max-w-4xl space-y-6">
          {/* Back */}
          <Link
            to="/dashboard/agents"
            className="inline-flex items-center gap-1.5 text-xs text-zinc-600 hover:text-zinc-300 transition-colors"
          >
            <ArrowLeft className="h-3.5 w-3.5" />
            All departments
          </Link>

          {/* Agent header card */}
          <div className="rounded-xl border border-surface-2/50 bg-surface-1/40 px-6 py-5 backdrop-blur-sm">
            <div className="flex flex-wrap items-start justify-between gap-4">
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <span className="rounded border border-surface-2/50 px-2 py-0.5 text-xs font-medium uppercase tracking-wide text-zinc-500">
                    {agent.department}
                  </span>
                  <span
                    className={`rounded border px-2 py-0.5 text-xs font-medium ${
                      agent.enabled
                        ? "border-green-500/30 bg-green-500/10 text-green-400"
                        : "border-zinc-500/30 bg-zinc-500/10 text-zinc-500"
                    }`}
                  >
                    {agent.enabled ? "Enabled" : "Disabled"}
                  </span>
                </div>
                <h2 className="text-lg font-semibold text-zinc-100">{agent.name}</h2>
                {agent.description && (
                  <p className="mt-1 text-sm text-zinc-500">{agent.description}</p>
                )}
              </div>

              <div className="flex gap-2">
                <Form method="post">
                  <input type="hidden" name="intent" value="toggle" />
                  <Button type="submit" variant="secondary" disabled={isSubmitting}>
                    {agent.enabled ? "Disable" : "Enable"}
                  </Button>
                </Form>
                <Form method="post">
                  <input type="hidden" name="intent" value="run" />
                  <Button type="submit" disabled={!agent.enabled || isSubmitting}>
                    <Play className="h-3.5 w-3.5 mr-1.5" />
                    Run Now
                  </Button>
                </Form>
              </div>
            </div>

            {/* Meta */}
            <div className="mt-4 grid grid-cols-2 gap-3 border-t border-surface-2/30 pt-4 sm:grid-cols-4">
              {[
                { label: "Model", value: agent.model },
                { label: "Max Tokens", value: agent.max_tokens?.toLocaleString() },
                { label: "Schedule", value: agent.schedule ?? "On demand" },
                { label: "Slug", value: agent.slug },
              ].map((item) => (
                <div key={item.label}>
                  <p className="text-xs font-medium uppercase tracking-wide text-zinc-600">
                    {item.label}
                  </p>
                  <p className="mt-0.5 font-mono text-xs text-zinc-400 break-all">
                    {item.value ?? "—"}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* Prompts */}
          <div className="space-y-3">
            <JsonBlock label="System Prompt" data={agent.system_prompt} />
            <JsonBlock label="User Prompt Template" data={agent.user_prompt_template} />
            <JsonBlock label="Input Sources" data={agent.input_sources} />
            <JsonBlock label="Output Actions" data={agent.output_actions} />
          </div>

          {/* Recent Runs */}
          <div>
            <h3 className="mb-3 text-sm font-semibold text-zinc-300">Recent Runs</h3>
            <div className="rounded-xl border border-surface-2/50 bg-surface-1/40 backdrop-blur-sm">
              {runs.length === 0 ? (
                <div className="flex flex-col items-center gap-2 py-10">
                  <Clock className="h-7 w-7 text-zinc-700" />
                  <p className="text-sm text-zinc-600">No runs yet</p>
                </div>
              ) : (
                <div className="divide-y divide-surface-2/30">
                  {runs.map((run) => {
                    const sm = STATUS_META[run.status ?? "running"] ?? STATUS_META.running;
                    const StatusIcon = sm.Icon;
                    return (
                      <div
                        key={run.id}
                        className="flex items-center gap-4 px-4 py-3"
                      >
                        <StatusIcon
                          className={`h-4 w-4 shrink-0 ${sm.color.split(" ")[0]} ${
                            run.status === "running" ? "animate-spin" : ""
                          }`}
                        />
                        <div className="min-w-0 flex-1">
                          <div className="flex items-center gap-2">
                            <span className={`rounded border px-1.5 py-0.5 text-xs font-medium ${sm.color}`}>
                              {sm.label}
                            </span>
                            {run.trigger_type && (
                              <span className="text-xs text-zinc-600">
                                via {run.trigger_type}
                              </span>
                            )}
                          </div>
                          <p className="mt-0.5 text-xs text-zinc-600">
                            {formatTime(run.created_at ?? run.started_at)}
                          </p>
                        </div>
                        <div className="flex shrink-0 items-center gap-4 text-xs font-mono text-zinc-600">
                          <span>{formatDuration(run.duration_ms)}</span>
                          {run.tokens_input && (
                            <span className="hidden sm:block">
                              {(run.tokens_input + (run.tokens_output ?? 0)).toLocaleString()} tok
                            </span>
                          )}
                          <span>{formatCost(run.cost_cents)}</span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
