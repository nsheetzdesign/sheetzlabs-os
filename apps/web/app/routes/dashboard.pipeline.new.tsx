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

  const name = (fd.get("name") as string)?.trim();
  const problem_statement = (fd.get("problem_statement") as string)?.trim() || null;
  const target_market = (fd.get("target_market") as string)?.trim() || null;
  const stage = (fd.get("stage") as string) || "idea";
  const notes = (fd.get("notes") as string)?.trim() || null;

  const errors: Record<string, string> = {};
  if (!name) errors.name = "Required";
  if (Object.keys(errors).length) return data({ errors }, { status: 400 });

  const { data: inserted, error } = await supabase
    .from("pipeline")
    .insert({ name, problem_statement, target_market, stage: stage as never, notes })
    .select("id")
    .single();

  if (error) return data({ errors: { _form: error.message } }, { status: 500 });

  return redirect(`/dashboard/ventures/pipeline/${inserted.id}`);
}

export default function NewPipeline() {
  const { ventures } = useLoaderData<typeof loader>();
  const actionData = useActionData<typeof action>();
  const errors = actionData?.errors ?? {};

  const STAGES = [
    "idea",
    "researching",
    "validating",
    "speccing",
    "building",
    "beta",
    "launched",
    "parked",
  ];

  return (
    <div className="flex flex-1 flex-col">
      <Header title="New Idea" />
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
            <div className="grid gap-5 sm:grid-cols-2">
              <FormField label="Idea Name" required error={errors.name}>
                <Input
                  name="name"
                  placeholder="Operator OS for Restaurants"
                  error={!!errors.name}
                  autoFocus
                />
              </FormField>
              <FormField label="Stage">
                <Select name="stage" defaultValue="idea">
                  {STAGES.map((s) => (
                    <option key={s} value={s}>
                      {s}
                    </option>
                  ))}
                </Select>
              </FormField>
            </div>

            <FormField label="Problem Statement" hint="What problem does this solve?">
              <textarea
                name="problem_statement"
                rows={3}
                placeholder="Restaurant operators spend 20% of their week on scheduling and comms..."
                className="w-full rounded-lg border border-surface-2/50 bg-surface-1 px-3 py-2 text-sm text-zinc-200 placeholder-zinc-600 focus:outline-none focus:ring-1 focus:ring-brand"
              />
            </FormField>

            <FormField label="Target Market" hint="Who is the customer?">
              <Input
                name="target_market"
                placeholder="Independent restaurant owners, 1-5 locations"
              />
            </FormField>

            <FormField label="Notes">
              <textarea
                name="notes"
                rows={3}
                placeholder="Initial thoughts, market research links..."
                className="w-full rounded-lg border border-surface-2/50 bg-surface-1 px-3 py-2 text-sm text-zinc-200 placeholder-zinc-600 focus:outline-none focus:ring-1 focus:ring-brand"
              />
            </FormField>

            <div className="flex items-center gap-3 pt-2">
              <Button type="submit">Create Idea</Button>
              <Link to="/dashboard/ventures/pipeline">
                <Button type="button" variant="secondary">
                  Cancel
                </Button>
              </Link>
            </div>
          </Form>
        </div>
      </main>
    </div>
  );
}
