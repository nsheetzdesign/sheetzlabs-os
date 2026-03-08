import type { ActionFunctionArgs, LoaderFunctionArgs } from "react-router";
import {
  useLoaderData,
  useActionData,
  Form,
  Link,
  redirect,
  data,
} from "react-router";
import { Header } from "~/components/dashboard/Header";
import { getSupabaseClient } from "~/lib/supabase.server";
import { FormField } from "~/components/ui/FormField";
import { Input } from "~/components/ui/Input";
import { Select } from "~/components/ui/Select";
import { Button } from "~/components/ui/Button";

export async function loader({ params, context }: LoaderFunctionArgs) {
  const supabase = getSupabaseClient(context.cloudflare.env);

  const [taskRes, venturesRes] = await Promise.all([
    supabase.from("tasks").select("*").eq("id", params.id!).single(),
    supabase.from("ventures").select("id, name, slug").order("name"),
  ]);

  if (!taskRes.data) throw new Response("Not found", { status: 404 });

  return {
    task: taskRes.data,
    ventures: venturesRes.data ?? [],
  };
}

export async function action({ request, params, context }: ActionFunctionArgs) {
  const supabase = getSupabaseClient(context.cloudflare.env);
  const fd = await request.formData();
  const intent = fd.get("intent") as string;

  if (intent === "delete") {
    await supabase.from("tasks").delete().eq("id", params.id!);
    return redirect("/dashboard/tasks");
  }

  // Update
  const title = (fd.get("title") as string)?.trim();
  const description = (fd.get("description") as string)?.trim() || null;
  const status = fd.get("status") as string;
  const priority = (fd.get("priority") as string) || null;
  const due_date = (fd.get("due_date") as string) || null;
  const venture_id = (fd.get("venture_id") as string) || null;

  const errors: Record<string, string> = {};
  if (!title) errors.title = "Required";
  if (Object.keys(errors).length) return data({ errors }, { status: 400 });

  const completed_at =
    status === "done" ? new Date().toISOString() : null;

  const { error } = await supabase
    .from("tasks")
    .update({
      title,
      description,
      status: status as never,
      priority: priority as never,
      due_date,
      venture_id,
      completed_at,
    })
    .eq("id", params.id!);

  if (error) return data({ errors: { _form: error.message } }, { status: 500 });

  return redirect("/dashboard/tasks");
}

export default function EditTask() {
  const { task, ventures } = useLoaderData<typeof loader>();
  const actionData = useActionData<typeof action>();
  const errors = actionData?.errors ?? {};

  return (
    <div className="flex flex-1 flex-col">
      <Header title={task.title} />
      <main className="flex-1 p-6">
        <div className="mx-auto max-w-2xl space-y-4">
          {errors._form && (
            <div className="rounded-lg border border-red-500/20 bg-red-500/10 px-4 py-3 text-sm text-red-400">
              {errors._form}
            </div>
          )}

          <Form
            method="post"
            className="space-y-5 rounded-xl border border-surface-2/50 bg-surface-1/40 p-6 backdrop-blur-sm"
          >
            <FormField label="Title" required error={errors.title}>
              <Input
                name="title"
                defaultValue={task.title}
                error={!!errors.title}
              />
            </FormField>

            <FormField label="Description">
              <textarea
                name="description"
                rows={3}
                defaultValue={task.description ?? ""}
                className="w-full rounded-lg border border-surface-2/50 bg-surface-1 px-3 py-2 text-sm text-zinc-200 placeholder-zinc-600 focus:outline-none focus:ring-1 focus:ring-brand"
              />
            </FormField>

            <div className="grid gap-5 sm:grid-cols-2">
              <FormField label="Status">
                <Select name="status" defaultValue={task.status ?? "todo"}>
                  {["backlog", "todo", "in-progress", "review", "done", "blocked"].map((s) => (
                    <option key={s} value={s}>{s}</option>
                  ))}
                </Select>
              </FormField>
              <FormField label="Priority">
                <Select name="priority" defaultValue={task.priority ?? ""}>
                  <option value="">None</option>
                  {["urgent", "high", "medium", "low"].map((p) => (
                    <option key={p} value={p}>{p}</option>
                  ))}
                </Select>
              </FormField>
            </div>

            <div className="grid gap-5 sm:grid-cols-2">
              <FormField label="Due Date">
                <Input
                  name="due_date"
                  type="date"
                  defaultValue={task.due_date?.slice(0, 10) ?? ""}
                />
              </FormField>
              <FormField label="Venture">
                <Select name="venture_id" defaultValue={task.venture_id ?? ""}>
                  <option value="">None</option>
                  {ventures.map((v) => (
                    <option key={v.id} value={v.id}>{v.name}</option>
                  ))}
                </Select>
              </FormField>
            </div>

            <div className="flex items-center gap-3 pt-2">
              <Button type="submit">Save Changes</Button>
              <Link to="/dashboard/tasks">
                <Button type="button" variant="secondary">Cancel</Button>
              </Link>
            </div>
          </Form>

          {/* Delete zone */}
          <Form
            method="post"
            className="rounded-xl border border-red-500/10 bg-red-500/5 p-4"
            onSubmit={(e) => {
              if (!confirm(`Delete "${task.title}"? This cannot be undone.`))
                e.preventDefault();
            }}
          >
            <input type="hidden" name="intent" value="delete" />
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-red-400">Delete Task</p>
                <p className="text-xs text-zinc-600">Permanently removes this task.</p>
              </div>
              <Button type="submit" variant="danger">Delete</Button>
            </div>
          </Form>
        </div>
      </main>
    </div>
  );
}
