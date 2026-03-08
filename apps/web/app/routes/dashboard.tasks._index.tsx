import type { ActionFunctionArgs, LoaderFunctionArgs } from "react-router";
import { useLoaderData, useFetcher, Form, Link } from "react-router";
import { Plus, CheckSquare } from "lucide-react";
import { Header } from "~/components/dashboard/Header";
import { getSupabaseClient } from "~/lib/supabase.server";
import { Badge } from "~/components/ui/Badge";
import { Button } from "~/components/ui/Button";
import { EmptyState } from "~/components/ui/EmptyState";

const STATUS_CYCLE: Record<string, string> = {
  backlog: "todo",
  todo: "in-progress",
  "in-progress": "review",
  review: "done",
  done: "todo",
  blocked: "todo",
};

export async function loader({ request, context }: LoaderFunctionArgs) {
  const supabase = getSupabaseClient(context.cloudflare.env);
  const url = new URL(request.url);
  const ventureId = url.searchParams.get("venture_id") || "";
  const status = url.searchParams.get("status") || "";
  const priority = url.searchParams.get("priority") || "";

  let query = supabase
    .from("tasks")
    .select("*, ventures(id, name, slug)")
    .order("due_date", { ascending: true, nullsFirst: false })
    .order("created_at", { ascending: false });

  if (ventureId) query = query.eq("venture_id", ventureId);
  if (status) query = query.eq("status", status as never);
  if (priority) query = query.eq("priority", priority as never);

  const [tasksRes, venturesRes] = await Promise.all([
    query,
    supabase.from("ventures").select("id, name, slug").order("name"),
  ]);

  return {
    tasks: tasksRes.data ?? [],
    ventures: venturesRes.data ?? [],
    filters: { ventureId, status, priority },
  };
}

export async function action({ request, context }: ActionFunctionArgs) {
  const supabase = getSupabaseClient(context.cloudflare.env);
  const fd = await request.formData();
  const intent = fd.get("intent") as string;

  if (intent === "toggle") {
    const id = fd.get("id") as string;
    const currentStatus = fd.get("current_status") as string;
    const nextStatus = STATUS_CYCLE[currentStatus] ?? "todo";
    const update: Record<string, string | null> = { status: nextStatus };
    if (nextStatus === "done") update.completed_at = new Date().toISOString();
    else update.completed_at = null;
    await supabase.from("tasks").update(update as never).eq("id", id);
    return { ok: true };
  }

  return { ok: false };
}

function formatDue(dateStr: string | null) {
  if (!dateStr) return null;
  const d = new Date(dateStr);
  const now = new Date();
  const isOverdue = d < now;
  const label = d.toLocaleDateString(undefined, { month: "short", day: "numeric" });
  return { label, isOverdue };
}

function TaskRow({ task }: { task: ReturnType<typeof useLoaderData<typeof loader>>["tasks"][number] }) {
  const fetcher = useFetcher();
  const optimisticStatus =
    fetcher.state !== "idle" && fetcher.formData
      ? (STATUS_CYCLE[fetcher.formData.get("current_status") as string] ?? task.status)
      : task.status;
  const due = formatDue(task.due_date);

  return (
    <div className="flex items-center gap-3 px-4 py-3 transition-colors hover:bg-surface-2/20">
      {/* Inline status toggle */}
      <fetcher.Form method="post" className="shrink-0">
        <input type="hidden" name="intent" value="toggle" />
        <input type="hidden" name="id" value={task.id} />
        <input type="hidden" name="current_status" value={optimisticStatus ?? "todo"} />
        <button
          type="submit"
          className="flex items-center"
          title={`Status: ${optimisticStatus} → click to advance`}
        >
          <Badge value={optimisticStatus ?? "todo"} variant="task-status" />
        </button>
      </fetcher.Form>

      <div className="min-w-0 flex-1">
        <Link
          to={task.id}
          className={`text-sm font-medium transition-colors hover:text-brand ${optimisticStatus === "done" ? "text-zinc-600 line-through" : "text-zinc-200"}`}
        >
          {task.title}
        </Link>
        {(task.ventures as { name: string } | null)?.name && (
          <p className="mt-0.5 text-xs text-zinc-600">
            {(task.ventures as { name: string }).name}
          </p>
        )}
      </div>

      <div className="flex shrink-0 items-center gap-3">
        {task.priority && (
          <Badge value={task.priority} variant="task-priority" />
        )}
        {due && (
          <span className={`hidden font-mono text-xs sm:block ${due.isOverdue && optimisticStatus !== "done" ? "text-red-400" : "text-zinc-600"}`}>
            {due.label}
          </span>
        )}
        <Link to={task.id} className="text-zinc-700 hover:text-zinc-400 transition-colors">
          <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
          </svg>
        </Link>
      </div>
    </div>
  );
}

export default function TasksIndex() {
  const { tasks, ventures, filters } = useLoaderData<typeof loader>();

  const STATUSES = ["backlog", "todo", "in-progress", "review", "done", "blocked"];
  const PRIORITIES = ["urgent", "high", "medium", "low"];

  return (
    <div className="flex flex-1 flex-col">
      <Header title="Tasks" />
      <main className="flex-1 p-6">
        {/* Filters */}
        <Form method="get" className="mb-4 flex flex-wrap items-center gap-2">
          <select
            name="venture_id"
            defaultValue={filters.ventureId}
            className="rounded-lg border border-surface-2/50 bg-surface-1 px-3 py-1.5 text-sm text-zinc-300 focus:outline-none focus:ring-1 focus:ring-brand"
          >
            <option value="">All ventures</option>
            {ventures.map((v) => (
              <option key={v.id} value={v.id}>{v.name}</option>
            ))}
          </select>

          <select
            name="status"
            defaultValue={filters.status}
            className="rounded-lg border border-surface-2/50 bg-surface-1 px-3 py-1.5 text-sm text-zinc-300 focus:outline-none focus:ring-1 focus:ring-brand"
          >
            <option value="">All statuses</option>
            {STATUSES.map((s) => (
              <option key={s} value={s}>{s}</option>
            ))}
          </select>

          <select
            name="priority"
            defaultValue={filters.priority}
            className="rounded-lg border border-surface-2/50 bg-surface-1 px-3 py-1.5 text-sm text-zinc-300 focus:outline-none focus:ring-1 focus:ring-brand"
          >
            <option value="">All priorities</option>
            {PRIORITIES.map((p) => (
              <option key={p} value={p}>{p}</option>
            ))}
          </select>

          <Button type="submit" variant="secondary">Filter</Button>
          {(filters.ventureId || filters.status || filters.priority) && (
            <Link to="/dashboard/tasks">
              <Button type="button" variant="secondary">Clear</Button>
            </Link>
          )}

          <div className="ml-auto">
            <Link
              to="new"
              className="inline-flex items-center gap-2 rounded-lg bg-brand px-3 py-1.5 text-sm font-medium text-white transition-colors hover:bg-brand-dark"
            >
              <Plus className="h-4 w-4" />
              New Task
            </Link>
          </div>
        </Form>

        {/* Task list */}
        <div className="rounded-xl border border-surface-2/50 bg-surface-1/40 backdrop-blur-sm">
          <div className="grid border-b border-surface-2/50 px-4 py-2 text-xs font-medium uppercase tracking-wide text-zinc-600"
            style={{ gridTemplateColumns: "1fr auto" }}>
            <span>Task</span>
            <div className="flex items-center gap-3">
              <span>Priority</span>
              <span className="hidden sm:block">Due</span>
              <span className="w-4" />
            </div>
          </div>

          {tasks.length === 0 ? (
            <EmptyState
              icon={CheckSquare}
              title="No tasks"
              description={filters.status || filters.priority || filters.ventureId ? "No tasks match these filters." : "Create your first task to stay on top of your work."}
              action={
                <Link
                  to="new"
                  className="inline-flex items-center gap-2 rounded-lg bg-brand px-4 py-2 text-sm font-medium text-white hover:bg-brand-dark"
                >
                  <Plus className="h-4 w-4" />
                  New Task
                </Link>
              }
            />
          ) : (
            <div className="divide-y divide-surface-2/30 py-1">
              {tasks.map((t) => (
                <TaskRow key={t.id} task={t} />
              ))}
            </div>
          )}
        </div>
        <p className="mt-2 text-xs text-zinc-700">
          {tasks.length} task{tasks.length !== 1 ? "s" : ""} — click status badge to advance
        </p>
      </main>
    </div>
  );
}
