import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { Form, redirect, useLoaderData, useNavigation, data } from "react-router";
import { requireAuth } from "~/lib/auth.server";
import { getSupabaseClient } from "~/lib/supabase.server";
import { Trash2, Copy, CheckCircle2, XCircle } from "lucide-react";
import { useState } from "react";
const API_BASE = "https://api.sheetzlabs.com";
export async function loader({ request, context }) {
    const { headers } = await requireAuth(request, context.cloudflare.env);
    const supabase = getSupabaseClient(context.cloudflare.env);
    const [{ data: connections }, { data: mappings }, { data: ventures }] = await Promise.all([
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
    return data({ connections: connections ?? [], mappings: mappings ?? [], ventures: ventures ?? [] }, { headers });
}
export async function action({ request, context }) {
    await requireAuth(request, context.cloudflare.env);
    const supabase = getSupabaseClient(context.cloudflare.env);
    const fd = await request.formData();
    const intent = fd.get("intent");
    if (intent === "add-mapping") {
        const connectionId = fd.get("stripe_connection_id");
        const productId = fd.get("stripe_product_id").trim();
        const ventureId = fd.get("venture_id");
        if (!productId || !connectionId || !ventureId) {
            return data({ error: "All fields are required." }, { status: 400 });
        }
        const { error } = await supabase.from("stripe_product_mappings").insert({
            stripe_connection_id: connectionId,
            stripe_product_id: productId,
            venture_id: ventureId,
        });
        if (error) {
            return data({ error: error.code === "23505" ? "That product ID is already mapped." : error.message }, { status: 400 });
        }
        return redirect("/dashboard/settings/stripe");
    }
    if (intent === "delete-mapping") {
        const id = fd.get("id");
        await supabase.from("stripe_product_mappings").delete().eq("id", id);
        return redirect("/dashboard/settings/stripe");
    }
    if (intent === "toggle-connection") {
        const id = fd.get("id");
        const current = fd.get("is_active") === "true";
        await supabase
            .from("stripe_connections")
            .update({ is_active: !current })
            .eq("id", id);
        return redirect("/dashboard/settings/stripe");
    }
    return redirect("/dashboard/settings/stripe");
}
function CopyButton({ text }) {
    const [copied, setCopied] = useState(false);
    return (_jsxs("button", { type: "button", onClick: () => {
            navigator.clipboard.writeText(text);
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
        }, className: "ml-2 text-zinc-600 transition-colors hover:text-zinc-300", title: "Copy", children: [_jsx(Copy, { className: "h-3.5 w-3.5" }), copied && _jsx("span", { className: "sr-only", children: "Copied!" })] }));
}
export default function StripeSettings() {
    const { connections, mappings, ventures } = useLoaderData();
    const navigation = useNavigation();
    const busy = navigation.state !== "idle";
    return (_jsxs("div", { className: "space-y-8 max-w-3xl", children: [_jsxs("section", { children: [_jsx("h2", { className: "mb-4 text-base font-semibold text-zinc-200", children: "Stripe Connections" }), _jsx("div", { className: "space-y-3", children: connections.map((conn) => {
                            const webhookUrl = `${API_BASE}/stripe/webhook/${conn.account_key}`;
                            return (_jsxs("div", { className: "rounded-xl border border-surface-2/50 bg-surface-1/40 p-4", children: [_jsxs("div", { className: "flex items-center justify-between", children: [_jsxs("div", { className: "flex items-center gap-2", children: [conn.is_active ? (_jsx(CheckCircle2, { className: "h-4 w-4 text-green-400" })) : (_jsx(XCircle, { className: "h-4 w-4 text-zinc-600" })), _jsx("span", { className: "font-medium text-zinc-200", children: conn.name }), _jsxs("span", { className: "font-mono text-xs text-zinc-600", children: ["(", conn.account_key, ")"] })] }), _jsxs(Form, { method: "post", children: [_jsx("input", { type: "hidden", name: "intent", value: "toggle-connection" }), _jsx("input", { type: "hidden", name: "id", value: conn.id }), _jsx("input", { type: "hidden", name: "is_active", value: String(conn.is_active) }), _jsx("button", { type: "submit", className: "text-xs text-zinc-500 hover:text-zinc-300", children: conn.is_active ? "Disable" : "Enable" })] })] }), _jsxs("div", { className: "mt-3", children: [_jsx("p", { className: "mb-1 text-xs font-medium text-zinc-500 uppercase tracking-wide", children: "Webhook URL" }), _jsxs("div", { className: "flex items-center rounded-lg bg-surface-0/60 px-3 py-2", children: [_jsx("code", { className: "flex-1 font-mono text-xs text-zinc-400 break-all", children: webhookUrl }), _jsx(CopyButton, { text: webhookUrl })] }), _jsxs("p", { className: "mt-1 text-xs text-zinc-600", children: ["Add this URL in the Stripe Dashboard \u2192 Developers \u2192 Webhooks. Enable the ", _jsx("code", { className: "text-zinc-500", children: "invoice.paid" }), " event."] })] })] }, conn.id));
                        }) })] }), _jsxs("section", { children: [_jsx("h2", { className: "mb-1 text-base font-semibold text-zinc-200", children: "Product \u2192 Venture Mappings" }), _jsx("p", { className: "mb-4 text-sm text-zinc-500", children: "Map Stripe Product IDs to ventures so incoming invoices are attributed correctly \u2014 especially useful when one Stripe account (e.g. CoLab) bills for multiple ventures." }), _jsxs(Form, { method: "post", className: "mb-6 rounded-xl border border-surface-2/50 bg-surface-1/40 p-4", children: [_jsx("input", { type: "hidden", name: "intent", value: "add-mapping" }), _jsx("p", { className: "mb-3 text-sm font-medium text-zinc-300", children: "Add Mapping" }), _jsxs("div", { className: "grid grid-cols-3 gap-3", children: [_jsxs("div", { children: [_jsx("label", { className: "mb-1 block text-xs text-zinc-500", children: "Account" }), _jsxs("select", { name: "stripe_connection_id", required: true, className: "w-full rounded-lg border border-surface-2/50 bg-surface-1 px-3 py-2 text-sm text-zinc-200 focus:outline-none focus:ring-1 focus:ring-brand", children: [_jsx("option", { value: "", children: "Select account\u2026" }), connections.map((c) => (_jsx("option", { value: c.id, children: c.name }, c.id)))] })] }), _jsxs("div", { children: [_jsx("label", { className: "mb-1 block text-xs text-zinc-500", children: "Stripe Product ID" }), _jsx("input", { type: "text", name: "stripe_product_id", required: true, placeholder: "prod_xxx", className: "w-full rounded-lg border border-surface-2/50 bg-surface-1 px-3 py-2 font-mono text-sm text-zinc-200 placeholder-zinc-600 focus:outline-none focus:ring-1 focus:ring-brand" })] }), _jsxs("div", { children: [_jsx("label", { className: "mb-1 block text-xs text-zinc-500", children: "Venture" }), _jsxs("select", { name: "venture_id", required: true, className: "w-full rounded-lg border border-surface-2/50 bg-surface-1 px-3 py-2 text-sm text-zinc-200 focus:outline-none focus:ring-1 focus:ring-brand", children: [_jsx("option", { value: "", children: "Select venture\u2026" }), ventures.map((v) => (_jsx("option", { value: v.id, children: v.name }, v.id)))] })] })] }), _jsx("div", { className: "mt-3 flex justify-end", children: _jsx("button", { type: "submit", disabled: busy, className: "rounded-lg bg-brand px-4 py-2 text-sm font-medium text-white disabled:opacity-50", children: "Add Mapping" }) })] }), mappings.length === 0 ? (_jsx("div", { className: "rounded-xl border border-surface-2/30 bg-surface-1/20 px-6 py-10 text-center text-sm text-zinc-600", children: "No product mappings yet. Add one above." })) : (_jsx("div", { className: "overflow-hidden rounded-xl border border-surface-2/50", children: _jsxs("table", { className: "w-full text-sm", children: [_jsx("thead", { children: _jsxs("tr", { className: "border-b border-surface-2/50 bg-surface-1/40", children: [_jsx("th", { className: "px-4 py-3 text-left text-xs font-medium text-zinc-500 uppercase tracking-wide", children: "Account" }), _jsx("th", { className: "px-4 py-3 text-left text-xs font-medium text-zinc-500 uppercase tracking-wide", children: "Stripe Product ID" }), _jsx("th", { className: "px-4 py-3 text-left text-xs font-medium text-zinc-500 uppercase tracking-wide", children: "Venture" }), _jsx("th", { className: "px-4 py-3" })] }) }), _jsx("tbody", { className: "divide-y divide-surface-2/30", children: mappings.map((m) => (_jsxs("tr", { className: "bg-surface-1/20 hover:bg-surface-1/40 transition-colors", children: [_jsx("td", { className: "px-4 py-3 text-zinc-400", children: m.stripe_connections?.name ?? "—" }), _jsx("td", { className: "px-4 py-3", children: _jsx("code", { className: "font-mono text-xs text-zinc-300", children: m.stripe_product_id }) }), _jsx("td", { className: "px-4 py-3 text-zinc-300", children: m.ventures?.name ?? "—" }), _jsx("td", { className: "px-4 py-3 text-right", children: _jsxs(Form, { method: "post", children: [_jsx("input", { type: "hidden", name: "intent", value: "delete-mapping" }), _jsx("input", { type: "hidden", name: "id", value: m.id }), _jsx("button", { type: "submit", className: "text-zinc-600 transition-colors hover:text-red-400", children: _jsx(Trash2, { className: "h-4 w-4" }) })] }) })] }, m.id))) })] }) }))] }), _jsxs("section", { className: "rounded-xl border border-surface-2/30 bg-surface-1/20 p-5", children: [_jsx("h3", { className: "mb-3 text-sm font-semibold text-zinc-300", children: "First-time Setup" }), _jsxs("ol", { className: "space-y-2 text-sm text-zinc-500", children: [_jsxs("li", { children: [_jsx("span", { className: "mr-2 text-zinc-600", children: "1." }), "Add your Stripe secret keys as Cloudflare secrets:", _jsx("pre", { className: "mt-1.5 rounded bg-surface-0/60 px-3 py-2 font-mono text-xs text-zinc-400 overflow-auto", children: `cd apps/api
npx wrangler secret put STRIPE_PERSONAL_KEY
npx wrangler secret put STRIPE_PERSONAL_WEBHOOK_SECRET
npx wrangler secret put STRIPE_COLAB_KEY
npx wrangler secret put STRIPE_COLAB_WEBHOOK_SECRET` })] }), _jsxs("li", { children: [_jsx("span", { className: "mr-2 text-zinc-600", children: "2." }), "In each Stripe Dashboard \u2192 Developers \u2192 Webhooks, add the webhook URL above and enable the ", _jsx("code", { className: "text-zinc-400", children: "invoice.paid" }), " event. Copy the signing secret and use it for the corresponding", " ", _jsx("code", { className: "text-zinc-400", children: "WEBHOOK_SECRET" }), " above."] }), _jsxs("li", { children: [_jsx("span", { className: "mr-2 text-zinc-600", children: "3." }), "For shared accounts (e.g. CoLab), add product \u2192 venture mappings above so payments are attributed to the correct venture."] })] })] })] }));
}
