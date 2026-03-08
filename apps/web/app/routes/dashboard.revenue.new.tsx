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

  const amountStr = (fd.get("amount_dollars") as string)?.trim();
  const amount_cents = Math.round(parseFloat(amountStr || "0") * 100);
  const type = (fd.get("type") as string) || "one-time";
  const description = (fd.get("description") as string)?.trim() || null;
  const client_name = (fd.get("client_name") as string)?.trim() || null;
  const venture_id = (fd.get("venture_id") as string) || null;
  const recorded_at = (fd.get("recorded_at") as string) || new Date().toISOString().slice(0, 10);
  const period_start = (fd.get("period_start") as string) || null;
  const period_end = (fd.get("period_end") as string) || null;

  const errors: Record<string, string> = {};
  if (!amountStr || isNaN(amount_cents) || amount_cents <= 0) errors.amount_dollars = "Enter a valid amount greater than $0";
  if (Object.keys(errors).length) return data({ errors }, { status: 400 });

  const { error } = await supabase.from("revenue").insert({
    amount_cents,
    type: type as never,
    description,
    client_name,
    venture_id,
    recorded_at,
    period_start,
    period_end,
  });

  if (error) return data({ errors: { _form: error.message } }, { status: 500 });

  return redirect("/dashboard/revenue");
}

export default function NewRevenue() {
  const { ventures } = useLoaderData<typeof loader>();
  const actionData = useActionData<typeof action>();
  const errors = actionData?.errors ?? {};

  const today = new Date().toISOString().slice(0, 10);

  return (
    <div className="flex flex-1 flex-col">
      <Header title="Log Revenue" />
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
              <FormField label="Amount ($)" required error={errors.amount_dollars}>
                <Input
                  name="amount_dollars"
                  type="number"
                  step="0.01"
                  min="0.01"
                  placeholder="500.00"
                  error={!!errors.amount_dollars}
                  autoFocus
                />
              </FormField>
              <FormField label="Type">
                <Select name="type" defaultValue="one-time">
                  {["recurring", "one-time", "retainer", "project"].map((t) => (
                    <option key={t} value={t}>{t}</option>
                  ))}
                </Select>
              </FormField>
            </div>

            <div className="grid gap-5 sm:grid-cols-2">
              <FormField label="Description">
                <Input name="description" placeholder="Monthly subscription, Project milestone…" />
              </FormField>
              <FormField label="Client Name">
                <Input name="client_name" placeholder="Acme Corp" />
              </FormField>
            </div>

            <div className="grid gap-5 sm:grid-cols-2">
              <FormField label="Venture">
                <Select name="venture_id" defaultValue="">
                  <option value="">None</option>
                  {ventures.map((v) => (
                    <option key={v.id} value={v.id}>{v.name}</option>
                  ))}
                </Select>
              </FormField>
              <FormField label="Recorded Date">
                <Input name="recorded_at" type="date" defaultValue={today} />
              </FormField>
            </div>

            <div className="grid gap-5 sm:grid-cols-2">
              <FormField label="Period Start" hint="For recurring / retainers">
                <Input name="period_start" type="date" />
              </FormField>
              <FormField label="Period End">
                <Input name="period_end" type="date" />
              </FormField>
            </div>

            <div className="flex items-center gap-3 pt-2">
              <Button type="submit">Log Revenue</Button>
              <Link to="/dashboard/revenue">
                <Button type="button" variant="secondary">Cancel</Button>
              </Link>
            </div>
          </Form>
        </div>
      </main>
    </div>
  );
}
