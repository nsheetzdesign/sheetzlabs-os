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

const TYPES = ["client", "partner", "investor", "advisor", "vendor", "prospect", "friend"];

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
  const email = (fd.get("email") as string)?.trim() || null;
  const company = (fd.get("company") as string)?.trim() || null;
  const role = (fd.get("role") as string)?.trim() || null;
  const type = (fd.get("type") as string) || "prospect";
  const strength = parseInt((fd.get("strength") as string) || "50", 10);
  const last_contact = (fd.get("last_contact") as string) || null;
  const notes = (fd.get("notes") as string)?.trim() || null;
  const venture_ids = (fd.getAll("venture_ids") as string[]).filter(Boolean);

  const errors: Record<string, string> = {};
  if (!name) errors.name = "Required";
  if (Object.keys(errors).length) return data({ errors }, { status: 400 });

  const { data: inserted, error } = await supabase
    .from("relationships")
    .insert({
      name,
      email,
      company,
      role,
      type: type as never,
      strength,
      last_contact: last_contact ? new Date(last_contact).toISOString() : null,
      notes,
      venture_ids: venture_ids.length > 0 ? venture_ids : null,
    })
    .select("id")
    .single();

  if (error) return data({ errors: { _form: error.message } }, { status: 500 });

  return redirect(`/dashboard/relationships/${inserted.id}`);
}

export default function NewRelationship() {
  const { ventures } = useLoaderData<typeof loader>();
  const actionData = useActionData<typeof action>();
  const errors = actionData?.errors ?? {};

  return (
    <div className="flex flex-1 flex-col">
      <Header title="New Contact" />
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
              <FormField label="Name" required error={errors.name}>
                <Input
                  name="name"
                  placeholder="Alex Johnson"
                  error={!!errors.name}
                  autoFocus
                />
              </FormField>
              <FormField label="Email">
                <Input name="email" type="email" placeholder="alex@example.com" />
              </FormField>
            </div>

            <div className="grid gap-5 sm:grid-cols-2">
              <FormField label="Company">
                <Input name="company" placeholder="Acme Corp" />
              </FormField>
              <FormField label="Role">
                <Input name="role" placeholder="CEO, Investor, Freelancer…" />
              </FormField>
            </div>

            <div className="grid gap-5 sm:grid-cols-2">
              <FormField label="Type">
                <Select name="type" defaultValue="prospect">
                  {TYPES.map((t) => (
                    <option key={t} value={t}>
                      {t}
                    </option>
                  ))}
                </Select>
              </FormField>
              <FormField label="Last Contact">
                <Input name="last_contact" type="date" />
              </FormField>
            </div>

            <FormField
              label="Relationship Strength"
              hint="0 = cold, 100 = very close"
            >
              <div className="flex items-center gap-3">
                <input
                  type="range"
                  name="strength"
                  min={0}
                  max={100}
                  defaultValue={50}
                  className="h-2 w-full cursor-pointer accent-brand"
                />
                <Input
                  name="_strength_display"
                  type="number"
                  min={0}
                  max={100}
                  defaultValue={50}
                  className="w-16"
                  readOnly
                />
              </div>
            </FormField>

            <FormField label="Notes">
              <textarea
                name="notes"
                rows={3}
                placeholder="How you met, context, follow-up ideas…"
                className="w-full rounded-lg border border-surface-2/50 bg-surface-1 px-3 py-2 text-sm text-zinc-200 placeholder-zinc-600 focus:outline-none focus:ring-1 focus:ring-brand"
              />
            </FormField>

            {ventures.length > 0 && (
              <FormField label="Associated Ventures" hint="Hold Cmd/Ctrl to select multiple">
                <select
                  name="venture_ids"
                  multiple
                  className="h-32 w-full rounded-lg border border-surface-2/50 bg-surface-1 px-3 py-2 text-sm text-zinc-200 focus:outline-none focus:ring-1 focus:ring-brand"
                >
                  {ventures.map((v) => (
                    <option key={v.id} value={v.id}>
                      {v.name}
                    </option>
                  ))}
                </select>
              </FormField>
            )}

            <div className="flex items-center gap-3 pt-2">
              <Button type="submit">Create Contact</Button>
              <Link to="/dashboard/relationships">
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
