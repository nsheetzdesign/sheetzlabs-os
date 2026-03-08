import type { ActionFunctionArgs, LoaderFunctionArgs } from "react-router";
import {
  useLoaderData,
  useActionData,
  useRouteLoaderData,
  Form,
  Link,
  redirect,
  data,
} from "react-router";
import { getSupabaseClient } from "~/lib/supabase.server";
import { FormField } from "~/components/ui/FormField";
import { Input } from "~/components/ui/Input";
import { Select } from "~/components/ui/Select";
import { Button } from "~/components/ui/Button";
import type { loader as hubLoader } from "./dashboard.ventures.$slug";

export async function loader({ params, context }: LoaderFunctionArgs) {
  const supabase = getSupabaseClient(context.cloudflare.env);
  const [parentsRes, linksRes, stackRes] = await Promise.all([
    supabase
      .from("ventures")
      .select("id, name, slug")
      .is("parent_venture_id", null)
      .order("name"),
    supabase
      .from("venture_links")
      .select("*")
      .eq(
        "venture_id",
        supabase
          .from("ventures")
          .select("id")
          .eq("slug", params.slug!)
          .single() as never,
      ),
    // Just use a join-less approach: get venture first
    supabase.from("ventures").select("id").eq("slug", params.slug!).single(),
  ]);

  const ventureId = stackRes.data?.id;

  const [linksData, stackData] = await Promise.all([
    ventureId
      ? supabase.from("venture_links").select("*").eq("venture_id", ventureId).order("created_at")
      : Promise.resolve({ data: [] }),
    ventureId
      ? supabase.from("venture_stack").select("*").eq("venture_id", ventureId).order("created_at")
      : Promise.resolve({ data: [] }),
  ]);

  return {
    parentOptions: (parentsRes.data ?? []),
    quickLinks: linksData.data ?? [],
    stackCount: stackData.data?.length ?? 0,
  };
}

export async function action({ request, params, context }: ActionFunctionArgs) {
  const supabase = getSupabaseClient(context.cloudflare.env);
  const fd = await request.formData();
  const intent = fd.get("intent") as string;

  if (intent === "archive") {
    await supabase.from("ventures").update({ status: "sunset" as never }).eq("slug", params.slug!);
    return redirect("/dashboard/ventures");
  }

  const name = (fd.get("name") as string)?.trim();
  const newSlug = (fd.get("slug") as string)?.trim();
  const domain = (fd.get("domain") as string)?.trim() || null;
  const tagline = (fd.get("tagline") as string)?.trim() || null;
  const status = fd.get("status") as string;
  const stage = fd.get("stage") as string;
  const parentId = (fd.get("parent_venture_id") as string) || null;
  const mrrCents = Math.round(parseFloat((fd.get("mrr_dollars") as string) || "0") * 100);
  const customerCount = parseInt((fd.get("customer_count") as string) || "0", 10);

  const errors: Record<string, string> = {};
  if (!name) errors.name = "Required";
  if (!newSlug) errors.slug = "Required";
  if (Object.keys(errors).length) return data({ errors }, { status: 400 });

  const { error } = await supabase
    .from("ventures")
    .update({
      name,
      slug: newSlug,
      domain,
      tagline,
      status: status as never,
      stage: stage as never,
      parent_venture_id: parentId,
      mrr_cents: mrrCents,
      customer_count: customerCount,
    })
    .eq("slug", params.slug!);

  if (error) return data({ errors: { _form: error.message } }, { status: 500 });

  // Redirect to new slug if it changed
  return redirect(`/dashboard/ventures/${newSlug}`);
}

export default function VentureOverview() {
  const { parentOptions, quickLinks, stackCount } = useLoaderData<typeof loader>();
  const hub = useRouteLoaderData<typeof hubLoader>("routes/dashboard.ventures.$slug");
  const actionData = useActionData<typeof action>();
  const errors = actionData?.errors ?? {};
  const venture = hub?.venture;

  if (!venture) return null;

  return (
    <div className="mx-auto max-w-3xl space-y-5">
      {errors._form && (
        <div className="rounded-lg border border-red-500/20 bg-red-500/10 px-4 py-3 text-sm text-red-400">
          {errors._form}
        </div>
      )}

      {/* Quick stats cards */}
      <div className="grid gap-3 sm:grid-cols-3">
        <StatCard label="Stack Tools" value={stackCount} unit="tools" />
        <StatCard label="Quick Links" value={quickLinks.length} unit="links" />
        <StatCard
          label="Domain"
          value={venture.domain ? `✓ ${venture.domain}` : "—"}
          unit=""
        />
      </div>

      {/* Quick links */}
      {quickLinks.length > 0 && (
        <div className="rounded-xl border border-surface-2/50 bg-surface-1/40 p-5">
          <h2 className="mb-3 text-xs font-semibold uppercase tracking-wide text-zinc-500">
            Quick Links
          </h2>
          <div className="flex flex-wrap gap-2">
            {quickLinks.map((l) => (
              <a
                key={l.id}
                href={l.url}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 rounded-lg border border-surface-2/50 bg-surface-1 px-3 py-1.5 text-sm text-zinc-300 transition-colors hover:border-brand/40 hover:text-brand"
              >
                <LinkTypeIcon type={l.type ?? "other"} />
                {l.label}
              </a>
            ))}
          </div>
        </div>
      )}

      {/* Edit form */}
      <Form
        method="post"
        className="space-y-5 rounded-xl border border-surface-2/50 bg-surface-1/40 p-6 backdrop-blur-sm"
      >
        <h2 className="text-sm font-semibold text-zinc-300">Details</h2>
        <div className="grid gap-5 sm:grid-cols-2">
          <FormField label="Name" required error={errors.name}>
            <Input name="name" defaultValue={venture.name} error={!!errors.name} />
          </FormField>
          <FormField label="Slug" required error={errors.slug}>
            <Input name="slug" defaultValue={venture.slug} error={!!errors.slug} />
          </FormField>
        </div>

        <FormField label="Domain" hint="Without https://">
          <Input name="domain" defaultValue={venture.domain ?? ""} />
        </FormField>

        <FormField label="Tagline">
          <Input name="tagline" defaultValue={venture.tagline ?? ""} />
        </FormField>

        <div className="grid gap-5 sm:grid-cols-2">
          <FormField label="Status">
            <Select name="status" defaultValue={venture.status ?? "idea"}>
              {["idea", "validating", "building", "active", "maintenance", "sunset", "sold"].map(
                (s) => <option key={s} value={s}>{s}</option>,
              )}
            </Select>
          </FormField>
          <FormField label="Stage">
            <Select name="stage" defaultValue={venture.stage ?? "pre-revenue"}>
              {["pre-revenue", "early-revenue", "growing", "profitable", "scaled"].map((s) => (
                <option key={s} value={s}>{s}</option>
              ))}
            </Select>
          </FormField>
        </div>

        <div className="grid gap-5 sm:grid-cols-2">
          <FormField label="MRR (dollars)" hint="Monthly recurring revenue">
            <Input
              name="mrr_dollars"
              type="number"
              step="0.01"
              min="0"
              defaultValue={((venture.mrr_cents ?? 0) / 100).toFixed(2)}
            />
          </FormField>
          <FormField label="Customer Count">
            <Input
              name="customer_count"
              type="number"
              min="0"
              defaultValue={venture.customer_count ?? 0}
            />
          </FormField>
        </div>

        {parentOptions.length > 0 && (
          <FormField label="Parent Venture">
            <Select name="parent_venture_id" defaultValue={venture.parent_venture_id ?? ""}>
              <option value="">None (top-level)</option>
              {parentOptions
                .filter((p) => p.id !== venture.id)
                .map((v) => (
                  <option key={v.id} value={v.id}>{v.name}</option>
                ))}
            </Select>
          </FormField>
        )}

        <div className="flex items-center gap-3 pt-2">
          <Button type="submit">Save Changes</Button>
          <Link to="/dashboard/ventures">
            <Button type="button" variant="secondary">Back</Button>
          </Link>
        </div>
      </Form>

      {/* Archive */}
      <Form
        method="post"
        className="rounded-xl border border-red-500/10 bg-red-500/5 p-4"
        onSubmit={(e) => {
          if (!confirm(`Archive "${venture.name}"? This sets status to sunset.`))
            e.preventDefault();
        }}
      >
        <input type="hidden" name="intent" value="archive" />
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-red-400">Archive Venture</p>
            <p className="text-xs text-zinc-600">Sets status to sunset. Reversible.</p>
          </div>
          <Button type="submit" variant="danger">Archive</Button>
        </div>
      </Form>
    </div>
  );
}

function StatCard({
  label,
  value,
  unit,
}: {
  label: string;
  value: string | number;
  unit: string;
}) {
  return (
    <div className="rounded-xl border border-surface-2/50 bg-surface-1/40 p-4">
      <div className="text-xs text-zinc-600 uppercase tracking-wide">{label}</div>
      <div className="mt-1 text-xl font-bold text-zinc-200">
        {value}
        {unit && <span className="ml-1 text-sm font-normal text-zinc-500">{unit}</span>}
      </div>
    </div>
  );
}

function LinkTypeIcon({ type }: { type: string }) {
  const icons: Record<string, string> = {
    repo: "⑂",
    live: "↗",
    docs: "📄",
    figma: "◆",
    dashboard: "⊞",
    other: "🔗",
  };
  return <span className="text-xs text-zinc-500">{icons[type] ?? "🔗"}</span>;
}
