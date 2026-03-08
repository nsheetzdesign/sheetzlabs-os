import type { ActionFunctionArgs, LoaderFunctionArgs } from "react-router";
import { Form, Link, useLoaderData, data } from "react-router";
import { getSupabaseClient } from "~/lib/supabase.server";
import { Button } from "~/components/ui/Button";
import { Input } from "~/components/ui/Input";
import { Select } from "~/components/ui/Select";
import { FormField } from "~/components/ui/FormField";

const STATUS_ORDER = ["backlog", "todo", "in-progress", "review", "done", "blocked"] as const;
const PRIORITY_ORDER = ["urgent", "high", "medium", "low"] as const;

const STATUS_COLOR: Record<string, string> = {
  backlog: "text-zinc-500 border-zinc-600/30 bg-zinc-600/10",
  todo: "text-blue-400 border-blue-500/30 bg-blue-500/10",
  "in-progress": "text-amber-400 border-amber-500/30 bg-amber-500/10",
  review: "text-purple-400 border-purple-500/30 bg-purple-500/10",
  done: "text-green-400 border-green-500/30 bg-green-500/10",
  blocked: "text-red-400 border-red-500/30 bg-red-500/10",
};

const PRIORITY_DOT: Record<string, string> = {
  urgent: "bg-red-400",
  high: "bg-orange-400",
  medium: "bg-amber-400",
  low: "bg-zinc-600",
};

export async function loader({ request, params, context }: LoaderFunctionArgs) {
  const supabase = getSupabaseClient(context.cloudflare.env);
  const url = new URL(request.url);
  const filterStatus = url.searchParams.get("status") || "";

  const { data: v } = await supabase
    .from("ventures")
    .select("id")
    .eq("slug", params.slug!)
    .single();
  if (!v) throw new Response("Not found", { status: 404 });

  let q = supabase
    .from("tasks")
    .select("*, milestones(id, title)")
    .eq("venture_id", v.id)
    .order("priority")
    .order("created_at", { ascending: false });

  if (filterStatus) q = q.eq("status", filterStatus);
  else q = q.neq("status", "done"); // default: hide done tasks

  const { data: tasks } = await q;

  const { data: milestones } = await supabase
    .from("milestones")
    .select("id, title")
    .eq("venture_id", v.id)
    .order("sort_order");

  return {
    ventureId: v.id,
    tasks: tasks ?? [],
    milestones: milestones ?? [],
    filterStatus,
  };
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

  if (intent === "add") {
    const title = (fd.get("title") as string)?.trim();
    const priority = (fd.get("priority") as string) || "medium";
    const milestoneId = (fd.get("milestone_id") as string) || null;
    const dueDate = (fd.get("due_date") as string) || null;

    if (!title) return data({ error: "Title required" }, { status: 400 });

    const { error } = await supabase.from("tasks").insert({
      venture_id: v.id,
      title,
      priority: priority as never,
      status: "backlog",
      milestone_id: milestoneId,
      due_date: dueDate,
    });
    if (error) return data({ error: error.message }, { status: 500 });
    return { ok: true };
  }

  if (intent === "complete") {
    const id = fd.get("id") as string;
    await supabase
      .from("tasks")
      .update({ status: "done", completed_at: new Date().toISOString() })
      .eq("id", id);
    return { ok: true };
  }

  if (intent === "delete") {
    await supabase.from("tasks").delete().eq("id", fd.get("id") as string);
    return { ok: true };
  }

  return { ok: true };
}

export default function VentureTasks() {
  const { tasks, milestones, filterStatus } = useLoaderData<typeof loader>();

  return (
    <div className="mx-auto max-w-3xl space-y-6">
      {/* Filter pills */}
      <div className="flex flex-wrap items-center gap-2">
        <a
          href="?"
          className={`rounded-full border px-3 py-1 text-xs font-medium transition-colors ${!filterStatus ? "border-brand bg-brand/10 text-brand" : "border-surface-2/50 text-zinc-500 hover:text-zinc-300"}`}
        >
          Active
        </a>
        {STATUS_ORDER.map((s) => (
          <a
            key={s}
            href={`?status=${s}`}
            className={`rounded-full border px-3 py-1 text-xs font-medium transition-colors ${filterStatus === s ? "border-brand bg-brand/10 text-brand" : "border-surface-2/50 text-zinc-500 hover:text-zinc-300"}`}
          >
            {s}
          </a>
        ))}
      </div>

      {/* Add task */}
      <Form
        method="post"
        className="rounded-xl border border-surface-2/50 bg-surface-1/40 p-5 backdrop-blur-sm"
      >
        <input type="hidden" name="intent" value="add" />
        <h2 className="mb-4 text-sm font-semibold text-zinc-300">Add Task</h2>
        <div className="grid gap-4 sm:grid-cols-3">
          <div className="sm:col-span-2">
            <FormField label="Title" required>
              <Input name="title" placeholder="What needs to be done?" />
            </FormField>
          </div>
          <FormField label="Priority">
            <Select name="priority" defaultValue="medium">
              {PRIORITY_ORDER.map((p) => (
                <option key={p} value={p}>{p}</option>
              ))}
            </Select>
          </FormField>
        </div>
        {milestones.length > 0 && (
          <div className="mt-4 grid gap-4 sm:grid-cols-2">
            <FormField label="Milestone">
              <Select name="milestone_id" defaultValue="">
                <option value="">No milestone</option>
                {milestones.map((m) => (
                  <option key={m.id} value={m.id}>{m.title}</option>
                ))}
              </Select>
            </FormField>
            <FormField label="Due Date">
              <Input name="due_date" type="date" />
            </FormField>
          </div>
        )}
        <div className="mt-4 flex justify-end">
          <Button type="submit">Add Task</Button>
        </div>
      </Form>

      {/* Tasks list */}
      {tasks.length === 0 ? (
        <p className="py-8 text-center text-sm text-zinc-600">
          {filterStatus ? `No ${filterStatus} tasks.` : "No active tasks."}
        </p>
      ) : (
        <div className="space-y-2">
          {tasks.map((task) => (
            <div
              key={task.id}
              className="flex items-center gap-3 rounded-xl border border-surface-2/50 bg-surface-1/40 px-4 py-3"
            >
              <span
                className={`h-2 w-2 shrink-0 rounded-full ${PRIORITY_DOT[task.priority ?? "medium"]}`}
                title={task.priority ?? "medium"}
              />
              <div className="flex-1 min-w-0">
                <Link
                  to={`/dashboard/tasks/${task.id}`}
                  className="text-sm font-medium text-zinc-200 hover:text-brand transition-colors"
                >
                  {task.title}
                </Link>
                {task.milestones && (
                  <p className="text-xs text-zinc-600">
                    Milestone: {task.milestones.title}
                  </p>
                )}
                {task.due_date && (
                  <p className="text-xs text-zinc-600">
                    Due: {new Date(task.due_date).toLocaleDateString()}
                  </p>
                )}
              </div>
              <span
                className={`shrink-0 rounded border px-2 py-0.5 text-xs font-medium ${STATUS_COLOR[task.status ?? "backlog"]}`}
              >
                {task.status}
              </span>

              {task.status !== "done" && (
                <Form method="post">
                  <input type="hidden" name="intent" value="complete" />
                  <input type="hidden" name="id" value={task.id} />
                  <button
                    type="submit"
                    className="text-zinc-600 hover:text-green-400 transition-colors text-xs"
                    title="Mark done"
                  >
                    ✓
                  </button>
                </Form>
              )}
              <Form method="post">
                <input type="hidden" name="intent" value="delete" />
                <input type="hidden" name="id" value={task.id} />
                <button
                  type="submit"
                  className="text-zinc-600 hover:text-red-400 transition-colors text-xs"
                >
                  ✕
                </button>
              </Form>
            </div>
          ))}
        </div>
      )}

      <p className="text-center text-xs text-zinc-700">
        <Link to="/dashboard/tasks" className="hover:text-zinc-400 transition-colors">
          View all tasks →
        </Link>
      </p>
    </div>
  );
}
