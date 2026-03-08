import type { ActionFunctionArgs, LoaderFunctionArgs } from "react-router";
import { Form, Link, useLoaderData } from "react-router";
import { Header } from "~/components/dashboard/Header";
import { getSupabaseClient } from "~/lib/supabase.server";
import { Button } from "~/components/ui/Button";

const STATUS_COLOR: Record<string, string> = {
  open: "text-blue-400 border-blue-500/30 bg-blue-500/10",
  "in-progress": "text-amber-400 border-amber-500/30 bg-amber-500/10",
  resolved: "text-green-400 border-green-500/30 bg-green-500/10",
  closed: "text-zinc-500 border-zinc-600/30 bg-zinc-600/10",
};

const TYPE_ICON: Record<string, string> = {
  bug: "🐛",
  feature: "✨",
  support: "💬",
};

const PRIORITY_COLOR: Record<string, string> = {
  urgent: "text-red-400",
  high: "text-orange-400",
  medium: "text-amber-400",
  low: "text-zinc-500",
};

export async function loader({ request, context }: LoaderFunctionArgs) {
  const supabase = getSupabaseClient(context.cloudflare.env);
  const url = new URL(request.url);
  const filterVenture = url.searchParams.get("venture") || "";
  const filterStatus = url.searchParams.get("status") || "";
  const filterType = url.searchParams.get("type") || "";

  let q = supabase
    .from("tickets")
    .select("*, ventures(id, name, slug)")
    .order("created_at", { ascending: false });

  if (filterVenture) q = q.eq("venture_id", filterVenture);
  if (filterStatus) q = q.eq("status", filterStatus);
  if (filterType) q = q.eq("type", filterType);

  const [{ data: tickets }, { data: ventures }] = await Promise.all([
    q,
    supabase.from("ventures").select("id, name, slug").order("name"),
  ]);

  const summary = {
    open: tickets?.filter((t) => t.status === "open").length ?? 0,
    inProgress: tickets?.filter((t) => t.status === "in-progress").length ?? 0,
    resolved: tickets?.filter((t) => t.status === "resolved").length ?? 0,
    total: tickets?.length ?? 0,
  };

  return {
    tickets: tickets ?? [],
    ventures: ventures ?? [],
    summary,
    filterVenture,
    filterStatus,
    filterType,
  };
}

export async function action({ request, context }: ActionFunctionArgs) {
  const supabase = getSupabaseClient(context.cloudflare.env);
  const fd = await request.formData();
  const intent = fd.get("intent") as string;

  if (intent === "bulk-close") {
    const ids = fd.getAll("selected") as string[];
    if (ids.length) {
      await supabase.from("tickets").update({ status: "closed" }).in("id", ids);
    }
    return { ok: true };
  }

  if (intent === "bulk-convert-tasks") {
    const ids = fd.getAll("selected") as string[];
    for (const id of ids) {
      const { data: ticket } = await supabase
        .from("tickets")
        .select("*")
        .eq("id", id)
        .single();
      if (!ticket || ticket.converted_task_id) continue;

      const { data: newTask } = await supabase
        .from("tasks")
        .insert({
          venture_id: ticket.venture_id,
          title: `[${ticket.type?.toUpperCase()}] ${ticket.title}`,
          description: ticket.description,
          priority: (ticket.priority as never) ?? "medium",
          status: "backlog" as const,
        })
        .select("id")
        .single();

      if (newTask) {
        await supabase
          .from("tickets")
          .update({ converted_task_id: newTask.id, status: "in-progress" })
          .eq("id", id);
      }
    }
    return { ok: true };
  }

  return { ok: true };
}

export default function AllTickets() {
  const { tickets, ventures, summary, filterVenture, filterStatus, filterType } =
    useLoaderData<typeof loader>();

  const buildFilter = (key: string, value: string) => {
    const params = new URLSearchParams();
    if (filterVenture && key !== "venture") params.set("venture", filterVenture);
    if (filterStatus && key !== "status") params.set("status", filterStatus);
    if (filterType && key !== "type") params.set("type", filterType);
    if (value) params.set(key, value);
    return `?${params.toString()}`;
  };

  return (
    <div className="flex flex-1 flex-col">
      <Header title="Tickets" />
      <main className="flex-1 p-6">
        <div className="mx-auto max-w-4xl space-y-6">
          {/* Summary */}
          <div className="grid gap-3 sm:grid-cols-4">
            {[
              { label: "Total", value: summary.total, color: "text-zinc-200" },
              { label: "Open", value: summary.open, color: "text-blue-400" },
              { label: "In Progress", value: summary.inProgress, color: "text-amber-400" },
              { label: "Resolved", value: summary.resolved, color: "text-green-400" },
            ].map((s) => (
              <div
                key={s.label}
                className="rounded-xl border border-surface-2/50 bg-surface-1/40 p-4"
              >
                <div className="text-xs uppercase tracking-wide text-zinc-600">{s.label}</div>
                <div className={`mt-1 text-2xl font-bold ${s.color}`}>{s.value}</div>
              </div>
            ))}
          </div>

          {/* Filters */}
          <div className="flex flex-wrap gap-3">
            {/* Venture filter */}
            <select
              className="rounded-lg border border-surface-2/50 bg-surface-1 px-3 py-1.5 text-sm text-zinc-300"
              value={filterVenture}
              onChange={(e) => (window.location.href = buildFilter("venture", e.target.value))}
            >
              <option value="">All ventures</option>
              {ventures.map((v) => (
                <option key={v.id} value={v.id}>{v.name}</option>
              ))}
            </select>

            {/* Status filter */}
            <div className="flex gap-1">
              {["", "open", "in-progress", "resolved", "closed"].map((s) => (
                <a
                  key={s}
                  href={buildFilter("status", s)}
                  className={`rounded-full border px-3 py-1 text-xs font-medium transition-colors ${
                    filterStatus === s
                      ? "border-brand bg-brand/10 text-brand"
                      : "border-surface-2/50 text-zinc-500 hover:text-zinc-300"
                  }`}
                >
                  {s || "All"}
                </a>
              ))}
            </div>

            {/* Type filter */}
            <div className="flex gap-1">
              {["", "bug", "feature", "support"].map((t) => (
                <a
                  key={t}
                  href={buildFilter("type", t)}
                  className={`rounded-full border px-3 py-1 text-xs font-medium transition-colors ${
                    filterType === t
                      ? "border-brand bg-brand/10 text-brand"
                      : "border-surface-2/50 text-zinc-500 hover:text-zinc-300"
                  }`}
                >
                  {t ? `${TYPE_ICON[t]} ${t}` : "All types"}
                </a>
              ))}
            </div>
          </div>

          {/* Bulk actions */}
          <Form method="post" id="tickets-form">
            <div className="mb-3 flex items-center justify-between">
              <p className="text-sm text-zinc-500">{tickets.length} tickets</p>
              <div className="flex gap-2">
                <Button type="submit" name="intent" value="bulk-convert-tasks" variant="secondary" className="text-xs">
                  Convert selected → Tasks
                </Button>
                <Button type="submit" name="intent" value="bulk-close" variant="danger" className="text-xs">
                  Close selected
                </Button>
              </div>
            </div>

            {tickets.length === 0 ? (
              <p className="py-12 text-center text-sm text-zinc-600">No tickets found.</p>
            ) : (
              <div className="space-y-2">
                {tickets.map((t) => {
                  const venture = t.ventures as { name: string; slug: string } | null;
                  const isConverted = !!(t.converted_task_id || t.converted_milestone_id);
                  return (
                    <div
                      key={t.id}
                      className={`flex items-center gap-3 rounded-xl border bg-surface-1/40 px-4 py-3 ${isConverted ? "border-green-500/20 opacity-60" : "border-surface-2/50"}`}
                    >
                      <input
                        type="checkbox"
                        name="selected"
                        value={t.id}
                        form="tickets-form"
                        className="rounded border-surface-2 bg-surface-1 accent-brand"
                      />
                      <div className="flex-1 min-w-0">
                        <div className="flex flex-wrap items-center gap-2">
                          <span className="text-xs text-zinc-600">
                            {TYPE_ICON[t.type] ?? "📋"} {t.type}
                          </span>
                          <span className="text-sm font-medium text-zinc-200">{t.title}</span>
                          <span
                            className={`text-xs font-medium ${PRIORITY_COLOR[t.priority ?? "medium"]}`}
                          >
                            {t.priority}
                          </span>
                          <span
                            className={`rounded border px-1.5 py-0.5 text-xs font-medium ${STATUS_COLOR[t.status ?? "open"]}`}
                          >
                            {t.status}
                          </span>
                          {isConverted && (
                            <span className="rounded border border-green-500/30 bg-green-500/10 px-1.5 py-0.5 text-xs text-green-400">
                              ✓ Converted
                            </span>
                          )}
                        </div>
                        {venture && (
                          <Link
                            to={`/dashboard/ventures/${venture.slug}/tickets`}
                            className="mt-0.5 block text-xs text-zinc-600 hover:text-zinc-400 transition-colors"
                          >
                            {venture.name}
                          </Link>
                        )}
                      </div>
                      {t.source !== "manual" && (
                        <span className="shrink-0 text-xs text-zinc-700">{t.source}</span>
                      )}
                    </div>
                  );
                })}
              </div>
            )}
          </Form>
        </div>
      </main>
    </div>
  );
}
