import type { ActionFunctionArgs, LoaderFunctionArgs } from "react-router";
import { Form, redirect, useLoaderData, useNavigation, data } from "react-router";
import { requireAuth } from "~/lib/auth.server";
import { getSupabaseClient } from "~/lib/supabase.server";
import { Trash2, Copy, CheckCircle2, XCircle } from "lucide-react";
import { useState } from "react";

const API_BASE = "https://sheetzlabs-api.nsheetz09.workers.dev";

export async function loader({ request, context }: LoaderFunctionArgs) {
  const { headers } = await requireAuth(request, context.cloudflare.env);
  const supabase = getSupabaseClient(context.cloudflare.env);

  const [{ data: connections }, { data: mappings }, { data: ventures }] =
    await Promise.all([
      supabase.from("stripe_connections").select("*").order("name"),
      supabase
        .from("stripe_product_mappings")
        .select("*, stripe_connections(name), ventures(name, slug)")
        .order("created_at", { ascending: false }),
      supabase
        .from("ventures")
        .select("id, name, slug")
        .order("name"),
    ]);

  return data(
    { connections: connections ?? [], mappings: mappings ?? [], ventures: ventures ?? [] },
    { headers },
  );
}

export async function action({ request, context }: ActionFunctionArgs) {
  await requireAuth(request, context.cloudflare.env);
  const supabase = getSupabaseClient(context.cloudflare.env);
  const fd = await request.formData();
  const intent = fd.get("intent") as string;

  if (intent === "add-mapping") {
    const connectionId = fd.get("stripe_connection_id") as string;
    const productId = (fd.get("stripe_product_id") as string).trim();
    const ventureId = fd.get("venture_id") as string;

    if (!productId || !connectionId || !ventureId) {
      return data({ error: "All fields are required." }, { status: 400 });
    }

    const { error } = await supabase.from("stripe_product_mappings").insert({
      stripe_connection_id: connectionId,
      stripe_product_id: productId,
      venture_id: ventureId,
    });

    if (error) {
      return data(
        { error: error.code === "23505" ? "That product ID is already mapped." : error.message },
        { status: 400 },
      );
    }

    return redirect("/dashboard/settings/stripe");
  }

  if (intent === "delete-mapping") {
    const id = fd.get("id") as string;
    await supabase.from("stripe_product_mappings").delete().eq("id", id);
    return redirect("/dashboard/settings/stripe");
  }

  if (intent === "toggle-connection") {
    const id = fd.get("id") as string;
    const current = fd.get("is_active") === "true";
    await supabase
      .from("stripe_connections")
      .update({ is_active: !current })
      .eq("id", id);
    return redirect("/dashboard/settings/stripe");
  }

  return redirect("/dashboard/settings/stripe");
}

function CopyButton({ text }: { text: string }) {
  const [copied, setCopied] = useState(false);
  return (
    <button
      type="button"
      onClick={() => {
        navigator.clipboard.writeText(text);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
      }}
      className="ml-2 text-zinc-600 transition-colors hover:text-zinc-300"
      title="Copy"
    >
      <Copy className="h-3.5 w-3.5" />
      {copied && <span className="sr-only">Copied!</span>}
    </button>
  );
}

export default function StripeSettings() {
  const { connections, mappings, ventures } = useLoaderData<typeof loader>();
  const navigation = useNavigation();
  const busy = navigation.state !== "idle";

  return (
    <div className="space-y-8 max-w-3xl">
      {/* Connections */}
      <section>
        <h2 className="mb-4 text-base font-semibold text-zinc-200">
          Stripe Connections
        </h2>
        <div className="space-y-3">
          {connections.map((conn) => {
            const webhookUrl = `${API_BASE}/stripe/webhook/${conn.account_key}`;
            return (
              <div
                key={conn.id}
                className="rounded-xl border border-surface-2/50 bg-surface-1/40 p-4"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    {conn.is_active ? (
                      <CheckCircle2 className="h-4 w-4 text-green-400" />
                    ) : (
                      <XCircle className="h-4 w-4 text-zinc-600" />
                    )}
                    <span className="font-medium text-zinc-200">{conn.name}</span>
                    <span className="font-mono text-xs text-zinc-600">
                      ({conn.account_key})
                    </span>
                  </div>
                  <Form method="post">
                    <input type="hidden" name="intent" value="toggle-connection" />
                    <input type="hidden" name="id" value={conn.id} />
                    <input
                      type="hidden"
                      name="is_active"
                      value={String(conn.is_active)}
                    />
                    <button
                      type="submit"
                      className="text-xs text-zinc-500 hover:text-zinc-300"
                    >
                      {conn.is_active ? "Disable" : "Enable"}
                    </button>
                  </Form>
                </div>

                {/* Webhook URL */}
                <div className="mt-3">
                  <p className="mb-1 text-xs font-medium text-zinc-500 uppercase tracking-wide">
                    Webhook URL
                  </p>
                  <div className="flex items-center rounded-lg bg-surface-0/60 px-3 py-2">
                    <code className="flex-1 font-mono text-xs text-zinc-400 break-all">
                      {webhookUrl}
                    </code>
                    <CopyButton text={webhookUrl} />
                  </div>
                  <p className="mt-1 text-xs text-zinc-600">
                    Add this URL in the Stripe Dashboard → Developers → Webhooks.
                    Enable the <code className="text-zinc-500">invoice.paid</code> event.
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* Product → Venture Mappings */}
      <section>
        <h2 className="mb-1 text-base font-semibold text-zinc-200">
          Product → Venture Mappings
        </h2>
        <p className="mb-4 text-sm text-zinc-500">
          Map Stripe Product IDs to ventures so incoming invoices are attributed
          correctly — especially useful when one Stripe account (e.g. CoLab) bills
          for multiple ventures.
        </p>

        {/* Add mapping form */}
        <Form method="post" className="mb-6 rounded-xl border border-surface-2/50 bg-surface-1/40 p-4">
          <input type="hidden" name="intent" value="add-mapping" />
          <p className="mb-3 text-sm font-medium text-zinc-300">Add Mapping</p>
          <div className="grid grid-cols-3 gap-3">
            <div>
              <label className="mb-1 block text-xs text-zinc-500">Account</label>
              <select
                name="stripe_connection_id"
                required
                className="w-full rounded-lg border border-surface-2/50 bg-surface-1 px-3 py-2 text-sm text-zinc-200 focus:outline-none focus:ring-1 focus:ring-brand"
              >
                <option value="">Select account…</option>
                {connections.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.name}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="mb-1 block text-xs text-zinc-500">
                Stripe Product ID
              </label>
              <input
                type="text"
                name="stripe_product_id"
                required
                placeholder="prod_xxx"
                className="w-full rounded-lg border border-surface-2/50 bg-surface-1 px-3 py-2 font-mono text-sm text-zinc-200 placeholder-zinc-600 focus:outline-none focus:ring-1 focus:ring-brand"
              />
            </div>
            <div>
              <label className="mb-1 block text-xs text-zinc-500">Venture</label>
              <select
                name="venture_id"
                required
                className="w-full rounded-lg border border-surface-2/50 bg-surface-1 px-3 py-2 text-sm text-zinc-200 focus:outline-none focus:ring-1 focus:ring-brand"
              >
                <option value="">Select venture…</option>
                {ventures.map((v) => (
                  <option key={v.id} value={v.id}>
                    {v.name}
                  </option>
                ))}
              </select>
            </div>
          </div>
          <div className="mt-3 flex justify-end">
            <button
              type="submit"
              disabled={busy}
              className="rounded-lg bg-brand px-4 py-2 text-sm font-medium text-white disabled:opacity-50"
            >
              Add Mapping
            </button>
          </div>
        </Form>

        {/* Existing mappings */}
        {mappings.length === 0 ? (
          <div className="rounded-xl border border-surface-2/30 bg-surface-1/20 px-6 py-10 text-center text-sm text-zinc-600">
            No product mappings yet. Add one above.
          </div>
        ) : (
          <div className="overflow-hidden rounded-xl border border-surface-2/50">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-surface-2/50 bg-surface-1/40">
                  <th className="px-4 py-3 text-left text-xs font-medium text-zinc-500 uppercase tracking-wide">
                    Account
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-zinc-500 uppercase tracking-wide">
                    Stripe Product ID
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-zinc-500 uppercase tracking-wide">
                    Venture
                  </th>
                  <th className="px-4 py-3" />
                </tr>
              </thead>
              <tbody className="divide-y divide-surface-2/30">
                {mappings.map((m) => (
                  <tr key={m.id} className="bg-surface-1/20 hover:bg-surface-1/40 transition-colors">
                    <td className="px-4 py-3 text-zinc-400">
                      {(m.stripe_connections as { name: string } | null)?.name ?? "—"}
                    </td>
                    <td className="px-4 py-3">
                      <code className="font-mono text-xs text-zinc-300">
                        {m.stripe_product_id}
                      </code>
                    </td>
                    <td className="px-4 py-3 text-zinc-300">
                      {(m.ventures as { name: string } | null)?.name ?? "—"}
                    </td>
                    <td className="px-4 py-3 text-right">
                      <Form method="post">
                        <input type="hidden" name="intent" value="delete-mapping" />
                        <input type="hidden" name="id" value={m.id} />
                        <button
                          type="submit"
                          className="text-zinc-600 transition-colors hover:text-red-400"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </Form>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>

      {/* Setup instructions */}
      <section className="rounded-xl border border-surface-2/30 bg-surface-1/20 p-5">
        <h3 className="mb-3 text-sm font-semibold text-zinc-300">
          First-time Setup
        </h3>
        <ol className="space-y-2 text-sm text-zinc-500">
          <li>
            <span className="mr-2 text-zinc-600">1.</span>
            Add your Stripe secret keys as Cloudflare secrets:
            <pre className="mt-1.5 rounded bg-surface-0/60 px-3 py-2 font-mono text-xs text-zinc-400 overflow-auto">
{`cd apps/api
npx wrangler secret put STRIPE_PERSONAL_KEY
npx wrangler secret put STRIPE_PERSONAL_WEBHOOK_SECRET
npx wrangler secret put STRIPE_COLAB_KEY
npx wrangler secret put STRIPE_COLAB_WEBHOOK_SECRET`}
            </pre>
          </li>
          <li>
            <span className="mr-2 text-zinc-600">2.</span>
            In each Stripe Dashboard → Developers → Webhooks, add the webhook URL
            above and enable the <code className="text-zinc-400">invoice.paid</code> event.
            Copy the signing secret and use it for the corresponding{" "}
            <code className="text-zinc-400">WEBHOOK_SECRET</code> above.
          </li>
          <li>
            <span className="mr-2 text-zinc-600">3.</span>
            For shared accounts (e.g. CoLab), add product → venture mappings above
            so payments are attributed to the correct venture.
          </li>
        </ol>
      </section>
    </div>
  );
}
