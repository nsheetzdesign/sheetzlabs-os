import type { ActionFunctionArgs, LoaderFunctionArgs } from "react-router";
import { useLoaderData, useActionData, Form, Link, redirect, data } from "react-router";
import { Header } from "~/components/dashboard/Header";
import { getSupabaseClient } from "~/lib/supabase.server";
import { FormField } from "~/components/ui/FormField";
import { Input } from "~/components/ui/Input";
import { Select } from "~/components/ui/Select";
import { Button } from "~/components/ui/Button";

export async function loader({ context }: LoaderFunctionArgs) {
  const supabase = getSupabaseClient(context.cloudflare.env);
  const { data: ventures } = await supabase
    .from("ventures")
    .select("id, name, slug")
    .order("name");
  return { ventures: ventures ?? [] };
}

export async function action({ request, context }: ActionFunctionArgs) {
  const supabase = getSupabaseClient(context.cloudflare.env);
  const fd = await request.formData();

  const title = (fd.get("title") as string)?.trim();
  const description = (fd.get("description") as string)?.trim() || null;
  const status = (fd.get("status") as string) || "todo";
  const priority = (fd.get("priority") as string) || null;
  const due_date = (fd.get("due_date") as string) || null;
  const venture_id = (fd.get("venture_id") as string) || null;

  const errors: Record<string, string> = {};
  if (!title) errors.title = "Required";
  if (Object.keys(errors).length) return data({ errors }, { status: 400 });

  const { error } = await supabase.from("tasks").insert({
    title,
    description,
    status: status as never,
    priority: priority as never,
    due_date,
    venture_id,
  });

  if (error) return data({ errors: { _form: error.message } }, { status: 500 });

  return redirect("/dashboard/tasks");
}

export default function NewTask() {
  const { ventures } = useLoaderData<typeof loader>();
  const actionData = useActionData<typeof action>();
  const errors = actionData?.errors ?? {};

  return (
    <div className="flex flex-1 flex-col">
      <Header title="New Task" />
      <main className="flex-1 p-6">
        <div className="mx-auto max-w-2xl">
          {errors._form && (
            <div className="mb-4 rounded-lg border border-red-500/20 bg-red-500/10 px-4 py-3 text-sm text-red-400">
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
                placeholder="Ship the landing page"
                error={!!errors.title}
                autoFocus
              />
            </FormField>

            <FormField label="Description">
              <textarea
                name="description"
                rows={3}
                placeholder="Optional details..."
                className="w-full rounded-lg border border-surface-2/50 bg-surface-1 px-3 py-2 text-sm text-zinc-200 placeholder-zinc-600 focus:outline-none focus:ring-1 focus:ring-brand"
              />
            </FormField>

            <div className="grid gap-5 sm:grid-cols-2">
              <FormField label="Status">
                <Select name="status" defaultValue="todo">
                  {["backlog", "todo", "in-progress", "review", "done", "blocked"].map((s) => (
                    <option key={s} value={s}>{s}</option>
                  ))}
                </Select>
              </FormField>
              <FormField label="Priority">
                <Select name="priority" defaultValue="">
                  <option value="">None</option>
                  {["urgent", "high", "medium", "low"].map((p) => (
                    <option key={p} value={p}>{p}</option>
                  ))}
                </Select>
              </FormField>
            </div>

            <div className="grid gap-5 sm:grid-cols-2">
              <FormField label="Due Date">
                <Input name="due_date" type="date" />
              </FormField>
              <FormField label="Venture">
                <Select name="venture_id" defaultValue="">
                  <option value="">None</option>
                  {ventures.map((v) => (
                    <option key={v.id} value={v.id}>{v.name}</option>
                  ))}
                </Select>
              </FormField>
            </div>

            <div className="flex items-center gap-3 pt-2">
              <Button type="submit">Create Task</Button>
              <Link to="/dashboard/tasks">
                <Button type="button" variant="secondary">Cancel</Button>
              </Link>
            </div>
          </Form>
        </div>
      </main>
    </div>
  );
}
