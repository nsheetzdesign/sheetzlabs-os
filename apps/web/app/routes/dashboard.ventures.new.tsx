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
    .is("parent_venture_id", null)
    .order("name");
  return { parentOptions: ventures ?? [] };
}

export async function action({ request, context }: ActionFunctionArgs) {
  const supabase = getSupabaseClient(context.cloudflare.env);
  const fd = await request.formData();

  const name = (fd.get("name") as string)?.trim();
  const rawSlug = (fd.get("slug") as string)?.trim();
  const slug = rawSlug || name.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
  const domain = (fd.get("domain") as string)?.trim() || null;
  const tagline = (fd.get("tagline") as string)?.trim() || null;
  const status = (fd.get("status") as string) || "idea";
  const stage = (fd.get("stage") as string) || "pre-revenue";
  const parentId = (fd.get("parent_venture_id") as string) || null;

  const errors: Record<string, string> = {};
  if (!name) errors.name = "Required";
  if (!slug) errors.slug = "Required";
  if (Object.keys(errors).length) return data({ errors }, { status: 400 });

  const { error } = await supabase.from("ventures").insert({
    name,
    slug,
    domain,
    tagline,
    status: status as never,
    stage: stage as never,
    parent_venture_id: parentId,
  });

  if (error) return data({ errors: { _form: error.message } }, { status: 500 });

  return redirect("/dashboard/ventures");
}

export default function NewVenture() {
  const { parentOptions } = useLoaderData<typeof loader>();
  const actionData = useActionData<typeof action>();
  const errors = actionData?.errors ?? {};

  return (
    <div className="flex flex-1 flex-col">
      <Header title="New Venture" />
      <main className="flex-1 p-6">
        <div className="mx-auto max-w-2xl">
          {errors._form && (
            <div className="mb-4 rounded-lg border border-red-500/20 bg-red-500/10 px-4 py-3 text-sm text-red-400">
              {errors._form}
            </div>
          )}
          <Form method="post" className="space-y-5 rounded-xl border border-surface-2/50 bg-surface-1/40 p-6 backdrop-blur-sm">
            <div className="grid gap-5 sm:grid-cols-2">
              <FormField label="Name" required error={errors.name}>
                <Input name="name" placeholder="Back of House Pro" error={!!errors.name} autoFocus />
              </FormField>
              <FormField label="Slug" hint="Auto-derived from name if blank" error={errors.slug}>
                <Input name="slug" placeholder="bohp" error={!!errors.slug} />
              </FormField>
            </div>

            <FormField label="Domain" hint="Without https://">
              <Input name="domain" placeholder="backofhousepro.com" />
            </FormField>

            <FormField label="Tagline">
              <Input name="tagline" placeholder="One-line description" />
            </FormField>

            <div className="grid gap-5 sm:grid-cols-2">
              <FormField label="Status">
                <Select name="status" defaultValue="idea">
                  {["idea","validating","building","active","maintenance","sunset","sold"].map((s) => (
                    <option key={s} value={s}>{s}</option>
                  ))}
                </Select>
              </FormField>
              <FormField label="Stage">
                <Select name="stage" defaultValue="pre-revenue">
                  {["pre-revenue","early-revenue","growing","profitable","scaled"].map((s) => (
                    <option key={s} value={s}>{s}</option>
                  ))}
                </Select>
              </FormField>
            </div>

            {parentOptions.length > 0 && (
              <FormField label="Parent Venture" hint="Optional — for sub-ventures">
                <Select name="parent_venture_id" defaultValue="">
                  <option value="">None (top-level)</option>
                  {parentOptions.map((v) => (
                    <option key={v.id} value={v.id}>{v.name}</option>
                  ))}
                </Select>
              </FormField>
            )}

            <div className="flex items-center gap-3 pt-2">
              <Button type="submit">Create Venture</Button>
              <Link to="/dashboard/ventures">
                <Button type="button" variant="secondary">Cancel</Button>
              </Link>
            </div>
          </Form>
        </div>
      </main>
    </div>
  );
}
