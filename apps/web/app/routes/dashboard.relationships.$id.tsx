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
const INTERACTION_TYPES = ["email", "call", "meeting", "slack", "other"];
const DIRECTIONS = ["outbound", "inbound"];

const REL_TYPE_COLORS: Record<string, string> = {
  client: "text-green-400 bg-green-500/10 border-green-500/20",
  partner: "text-blue-400 bg-blue-500/10 border-blue-500/20",
  investor: "text-violet-400 bg-violet-500/10 border-violet-500/20",
  advisor: "text-amber-400 bg-amber-500/10 border-amber-500/20",
  vendor: "text-zinc-400 bg-zinc-500/10 border-zinc-500/20",
  prospect: "text-cyan-400 bg-cyan-500/10 border-cyan-500/20",
  friend: "text-pink-400 bg-pink-500/10 border-pink-500/20",
};

const ITYPE_ICON: Record<string, string> = {
  email: "✉️",
  call: "📞",
  meeting: "🤝",
  slack: "💬",
  other: "📝",
};

export async function loader({ params, context }: LoaderFunctionArgs) {
  const supabase = getSupabaseClient(context.cloudflare.env);

  const [relRes, venturesRes, interactionsRes] = await Promise.all([
    supabase.from("relationships").select("*").eq("id", params.id!).single(),
    supabase.from("ventures").select("id, name, slug").order("name"),
    supabase
      .from("interactions")
      .select("*")
      .eq("relationship_id", params.id!)
      .order("occurred_at", { ascending: false }),
  ]);

  if (!relRes.data) throw new Response("Not found", { status: 404 });

  return {
    rel: relRes.data,
    ventures: venturesRes.data ?? [],
    interactions: interactionsRes.data ?? [],
  };
}

export async function action({ request, params, context }: ActionFunctionArgs) {
  const supabase = getSupabaseClient(context.cloudflare.env);
  const fd = await request.formData();
  const intent = fd.get("intent") as string;

  if (intent === "add-interaction") {
    const type = fd.get("type") as string;
    const direction = (fd.get("direction") as string) || "outbound";
    const subject = (fd.get("subject") as string)?.trim() || null;
    const summary = (fd.get("summary") as string)?.trim() || null;
    const occurred_at = (fd.get("occurred_at") as string)
      ? new Date(fd.get("occurred_at") as string).toISOString()
      : new Date().toISOString();

    const errors: Record<string, string> = {};
    if (!type) errors.type = "Required";
    if (Object.keys(errors).length) return data({ errors }, { status: 400 });

    await supabase.from("interactions").insert({
      relationship_id: params.id!,
      type,
      direction,
      subject,
      summary,
      occurred_at,
    });

    // Update last_contact on the relationship
    await supabase
      .from("relationships")
      .update({ last_contact: occurred_at })
      .eq("id", params.id!);

    return redirect(`/dashboard/relationships/${params.id}`);
  }

  if (intent === "delete-interaction") {
    const interactionId = fd.get("interaction_id") as string;
    await supabase.from("interactions").delete().eq("id", interactionId);
    return redirect(`/dashboard/relationships/${params.id}`);
  }

  // Default: update relationship
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

  const { error } = await supabase
    .from("relationships")
    .update({
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
    .eq("id", params.id!);

  if (error) return data({ errors: { _form: error.message } }, { status: 500 });

  return redirect(`/dashboard/relationships/${params.id}`);
}

function decayIndicator(lastContact: string | null) {
  if (!lastContact) return null;
  const days = Math.floor((Date.now() - new Date(lastContact).getTime()) / 86400000);
  if (days > 60)
    return (
      <span className="rounded border border-red-500/30 bg-red-500/10 px-2 py-0.5 text-xs font-medium text-red-400">
        ⚠️ {days} days since last contact
      </span>
    );
  if (days > 30)
    return (
      <span className="rounded border border-amber-500/30 bg-amber-500/10 px-2 py-0.5 text-xs font-medium text-amber-400">
        🟡 {days} days since last contact
      </span>
    );
  return (
    <span className="text-xs text-zinc-600">{days} days since last contact</span>
  );
}

function formatDateTime(str: string | null) {
  if (!str) return "—";
  return new Date(str).toLocaleDateString(undefined, {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

export default function EditRelationship() {
  const { rel, ventures, interactions } = useLoaderData<typeof loader>();
  const actionData = useActionData<typeof action>();
  const errors = actionData?.errors ?? {};

  const today = new Date().toISOString().slice(0, 10);
  const lastContactDate = rel.last_contact
    ? new Date(rel.last_contact).toISOString().slice(0, 10)
    : "";

  return (
    <div className="flex flex-1 flex-col">
      <Header title={rel.name} />
      <main className="flex-1 p-6">
        <div className="mx-auto max-w-2xl space-y-4">
          {/* Contact meta + decay */}
          <div className="flex items-center justify-between rounded-xl border border-surface-2/50 bg-surface-1/40 px-5 py-4 backdrop-blur-sm">
            <div className="flex items-center gap-3">
              {rel.type && (
                <span
                  className={`rounded border px-2 py-0.5 text-xs font-medium ${REL_TYPE_COLORS[rel.type] ?? ""}`}
                >
                  {rel.type}
                </span>
              )}
              <div>
                <p className="text-sm font-medium text-zinc-200">{rel.name}</p>
                {(rel.company || rel.role) && (
                  <p className="text-xs text-zinc-600">
                    {[rel.role, rel.company].filter(Boolean).join(" · ")}
                  </p>
                )}
              </div>
            </div>
            <div className="text-right">
              {decayIndicator(rel.last_contact)}
            </div>
          </div>

          {errors._form && (
            <div className="rounded-lg border border-red-500/20 bg-red-500/10 px-4 py-3 text-sm text-red-400">
              {errors._form}
            </div>
          )}

          {/* Edit form */}
          <Form
            method="post"
            className="space-y-5 rounded-xl border border-surface-2/50 bg-surface-1/40 p-6 backdrop-blur-sm"
          >
            <div className="grid gap-5 sm:grid-cols-2">
              <FormField label="Name" required error={errors.name}>
                <Input name="name" defaultValue={rel.name} error={!!errors.name} />
              </FormField>
              <FormField label="Email">
                <Input name="email" type="email" defaultValue={rel.email ?? ""} />
              </FormField>
            </div>

            <div className="grid gap-5 sm:grid-cols-2">
              <FormField label="Company">
                <Input name="company" defaultValue={rel.company ?? ""} />
              </FormField>
              <FormField label="Role">
                <Input name="role" defaultValue={rel.role ?? ""} />
              </FormField>
            </div>

            <div className="grid gap-5 sm:grid-cols-2">
              <FormField label="Type">
                <Select name="type" defaultValue={rel.type ?? "prospect"}>
                  {TYPES.map((t) => (
                    <option key={t} value={t}>
                      {t}
                    </option>
                  ))}
                </Select>
              </FormField>
              <FormField label="Last Contact">
                <Input name="last_contact" type="date" defaultValue={lastContactDate} />
              </FormField>
            </div>

            <FormField
              label="Relationship Strength"
              hint={`Current: ${rel.strength ?? 50} / 100`}
            >
              <input
                type="number"
                name="strength"
                min={0}
                max={100}
                defaultValue={rel.strength ?? 50}
                className="w-full rounded-lg border border-surface-2/50 bg-surface-1 px-3 py-2 text-sm text-zinc-200 focus:outline-none focus:ring-1 focus:ring-brand"
              />
            </FormField>

            <FormField label="Notes">
              <textarea
                name="notes"
                rows={3}
                defaultValue={rel.notes ?? ""}
                className="w-full rounded-lg border border-surface-2/50 bg-surface-1 px-3 py-2 text-sm text-zinc-200 placeholder-zinc-600 focus:outline-none focus:ring-1 focus:ring-brand"
              />
            </FormField>

            {ventures.length > 0 && (
              <FormField label="Associated Ventures" hint="Hold Cmd/Ctrl to select multiple">
                <select
                  name="venture_ids"
                  multiple
                  defaultValue={rel.venture_ids ?? []}
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
              <Button type="submit">Save Changes</Button>
              <Link to="/dashboard/relationships">
                <Button type="button" variant="secondary">
                  Back
                </Button>
              </Link>
            </div>
          </Form>

          {/* Interaction log */}
          <div className="rounded-xl border border-surface-2/50 bg-surface-1/40 backdrop-blur-sm">
            <div className="border-b border-surface-2/50 px-5 py-3">
              <h2 className="text-sm font-semibold text-zinc-300">Interaction Log</h2>
              <p className="text-xs text-zinc-600">{interactions.length} interaction{interactions.length !== 1 ? "s" : ""}</p>
            </div>

            {/* Add interaction form */}
            <div className="border-b border-surface-2/30 p-4">
              <p className="mb-3 text-xs font-medium uppercase tracking-wide text-zinc-600">
                Log Interaction
              </p>
              <Form method="post" className="space-y-3">
                <input type="hidden" name="intent" value="add-interaction" />
                <div className="grid gap-3 sm:grid-cols-3">
                  <div>
                    <label className="mb-1 block text-xs text-zinc-500">Type</label>
                    <Select name="type" defaultValue="email">
                      {INTERACTION_TYPES.map((t) => (
                        <option key={t} value={t}>
                          {ITYPE_ICON[t]} {t}
                        </option>
                      ))}
                    </Select>
                  </div>
                  <div>
                    <label className="mb-1 block text-xs text-zinc-500">Direction</label>
                    <Select name="direction" defaultValue="outbound">
                      {DIRECTIONS.map((d) => (
                        <option key={d} value={d}>
                          {d}
                        </option>
                      ))}
                    </Select>
                  </div>
                  <div>
                    <label className="mb-1 block text-xs text-zinc-500">Date</label>
                    <Input name="occurred_at" type="date" defaultValue={today} />
                  </div>
                </div>
                <Input name="subject" placeholder="Subject / topic" />
                <textarea
                  name="summary"
                  rows={2}
                  placeholder="Brief summary of the interaction…"
                  className="w-full rounded-lg border border-surface-2/50 bg-surface-1 px-3 py-2 text-sm text-zinc-200 placeholder-zinc-600 focus:outline-none focus:ring-1 focus:ring-brand"
                />
                <Button type="submit" variant="secondary">
                  Log Interaction
                </Button>
              </Form>
            </div>

            {/* Interaction entries */}
            {interactions.length === 0 ? (
              <div className="px-5 py-8 text-center text-sm text-zinc-600">
                No interactions logged yet.
              </div>
            ) : (
              <div className="divide-y divide-surface-2/30">
                {interactions.map((interaction) => (
                  <div key={interaction.id} className="flex items-start gap-3 px-5 py-4">
                    <span className="mt-0.5 shrink-0 text-base">
                      {ITYPE_ICON[interaction.type] ?? "📝"}
                    </span>
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-medium text-zinc-300">
                          {interaction.subject || interaction.type}
                        </span>
                        <span className="rounded border border-surface-2/50 px-1.5 py-0.5 text-xs text-zinc-600">
                          {interaction.direction}
                        </span>
                      </div>
                      {interaction.summary && (
                        <p className="mt-1 text-xs text-zinc-500">{interaction.summary}</p>
                      )}
                      <p className="mt-1 text-xs text-zinc-700">
                        {formatDateTime(interaction.occurred_at)}
                      </p>
                    </div>
                    <Form
                      method="post"
                      onSubmit={(e) => {
                        if (!confirm("Delete this interaction?")) e.preventDefault();
                      }}
                    >
                      <input type="hidden" name="intent" value="delete-interaction" />
                      <input type="hidden" name="interaction_id" value={interaction.id} />
                      <button
                        type="submit"
                        className="mt-0.5 shrink-0 text-zinc-700 transition-colors hover:text-red-400"
                        title="Delete"
                      >
                        <svg
                          className="h-4 w-4"
                          fill="none"
                          viewBox="0 0 24 24"
                          strokeWidth={2}
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="M6 18L18 6M6 6l12 12"
                          />
                        </svg>
                      </button>
                    </Form>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
