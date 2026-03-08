import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useLoaderData, useActionData, useRouteLoaderData, Form, Link, redirect, data, } from "react-router";
import { getSupabaseClient } from "~/lib/supabase.server";
import { FormField } from "~/components/ui/FormField";
import { Input } from "~/components/ui/Input";
import { Select } from "~/components/ui/Select";
import { Button } from "~/components/ui/Button";
export async function loader({ params, context }) {
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
            .eq("venture_id", supabase
            .from("ventures")
            .select("id")
            .eq("slug", params.slug)
            .single()),
        // Just use a join-less approach: get venture first
        supabase.from("ventures").select("id").eq("slug", params.slug).single(),
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
export async function action({ request, params, context }) {
    const supabase = getSupabaseClient(context.cloudflare.env);
    const fd = await request.formData();
    const intent = fd.get("intent");
    if (intent === "archive") {
        await supabase.from("ventures").update({ status: "sunset" }).eq("slug", params.slug);
        return redirect("/dashboard/ventures");
    }
    const name = fd.get("name")?.trim();
    const newSlug = fd.get("slug")?.trim();
    const domain = fd.get("domain")?.trim() || null;
    const tagline = fd.get("tagline")?.trim() || null;
    const status = fd.get("status");
    const stage = fd.get("stage");
    const parentId = fd.get("parent_venture_id") || null;
    const mrrCents = Math.round(parseFloat(fd.get("mrr_dollars") || "0") * 100);
    const customerCount = parseInt(fd.get("customer_count") || "0", 10);
    const errors = {};
    if (!name)
        errors.name = "Required";
    if (!newSlug)
        errors.slug = "Required";
    if (Object.keys(errors).length)
        return data({ errors }, { status: 400 });
    const { error } = await supabase
        .from("ventures")
        .update({
        name,
        slug: newSlug,
        domain,
        tagline,
        status: status,
        stage: stage,
        parent_venture_id: parentId,
        mrr_cents: mrrCents,
        customer_count: customerCount,
    })
        .eq("slug", params.slug);
    if (error)
        return data({ errors: { _form: error.message } }, { status: 500 });
    // Redirect to new slug if it changed
    return redirect(`/dashboard/ventures/${newSlug}`);
}
export default function VentureOverview() {
    const { parentOptions, quickLinks, stackCount } = useLoaderData();
    const hub = useRouteLoaderData("routes/dashboard.ventures.$slug");
    const actionData = useActionData();
    const errors = actionData?.errors ?? {};
    const venture = hub?.venture;
    if (!venture)
        return null;
    return (_jsxs("div", { className: "mx-auto max-w-3xl space-y-5", children: [errors._form && (_jsx("div", { className: "rounded-lg border border-red-500/20 bg-red-500/10 px-4 py-3 text-sm text-red-400", children: errors._form })), _jsxs("div", { className: "grid gap-3 sm:grid-cols-3", children: [_jsx(StatCard, { label: "Stack Tools", value: stackCount, unit: "tools" }), _jsx(StatCard, { label: "Quick Links", value: quickLinks.length, unit: "links" }), _jsx(StatCard, { label: "Domain", value: venture.domain ? `✓ ${venture.domain}` : "—", unit: "" })] }), quickLinks.length > 0 && (_jsxs("div", { className: "rounded-xl border border-surface-2/50 bg-surface-1/40 p-5", children: [_jsx("h2", { className: "mb-3 text-xs font-semibold uppercase tracking-wide text-zinc-500", children: "Quick Links" }), _jsx("div", { className: "flex flex-wrap gap-2", children: quickLinks.map((l) => (_jsxs("a", { href: l.url, target: "_blank", rel: "noopener noreferrer", className: "inline-flex items-center gap-1.5 rounded-lg border border-surface-2/50 bg-surface-1 px-3 py-1.5 text-sm text-zinc-300 transition-colors hover:border-brand/40 hover:text-brand", children: [_jsx(LinkTypeIcon, { type: l.type ?? "other" }), l.label] }, l.id))) })] })), _jsxs(Form, { method: "post", className: "space-y-5 rounded-xl border border-surface-2/50 bg-surface-1/40 p-6 backdrop-blur-sm", children: [_jsx("h2", { className: "text-sm font-semibold text-zinc-300", children: "Details" }), _jsxs("div", { className: "grid gap-5 sm:grid-cols-2", children: [_jsx(FormField, { label: "Name", required: true, error: errors.name, children: _jsx(Input, { name: "name", defaultValue: venture.name, error: !!errors.name }) }), _jsx(FormField, { label: "Slug", required: true, error: errors.slug, children: _jsx(Input, { name: "slug", defaultValue: venture.slug, error: !!errors.slug }) })] }), _jsx(FormField, { label: "Domain", hint: "Without https://", children: _jsx(Input, { name: "domain", defaultValue: venture.domain ?? "" }) }), _jsx(FormField, { label: "Tagline", children: _jsx(Input, { name: "tagline", defaultValue: venture.tagline ?? "" }) }), _jsxs("div", { className: "grid gap-5 sm:grid-cols-2", children: [_jsx(FormField, { label: "Status", children: _jsx(Select, { name: "status", defaultValue: venture.status ?? "idea", children: ["idea", "validating", "building", "active", "maintenance", "sunset", "sold"].map((s) => _jsx("option", { value: s, children: s }, s)) }) }), _jsx(FormField, { label: "Stage", children: _jsx(Select, { name: "stage", defaultValue: venture.stage ?? "pre-revenue", children: ["pre-revenue", "early-revenue", "growing", "profitable", "scaled"].map((s) => (_jsx("option", { value: s, children: s }, s))) }) })] }), _jsxs("div", { className: "grid gap-5 sm:grid-cols-2", children: [_jsx(FormField, { label: "MRR (dollars)", hint: "Monthly recurring revenue", children: _jsx(Input, { name: "mrr_dollars", type: "number", step: "0.01", min: "0", defaultValue: ((venture.mrr_cents ?? 0) / 100).toFixed(2) }) }), _jsx(FormField, { label: "Customer Count", children: _jsx(Input, { name: "customer_count", type: "number", min: "0", defaultValue: venture.customer_count ?? 0 }) })] }), parentOptions.length > 0 && (_jsx(FormField, { label: "Parent Venture", children: _jsxs(Select, { name: "parent_venture_id", defaultValue: venture.parent_venture_id ?? "", children: [_jsx("option", { value: "", children: "None (top-level)" }), parentOptions
                                    .filter((p) => p.id !== venture.id)
                                    .map((v) => (_jsx("option", { value: v.id, children: v.name }, v.id)))] }) })), _jsxs("div", { className: "flex items-center gap-3 pt-2", children: [_jsx(Button, { type: "submit", children: "Save Changes" }), _jsx(Link, { to: "/dashboard/ventures", children: _jsx(Button, { type: "button", variant: "secondary", children: "Back" }) })] })] }), _jsxs(Form, { method: "post", className: "rounded-xl border border-red-500/10 bg-red-500/5 p-4", onSubmit: (e) => {
                    if (!confirm(`Archive "${venture.name}"? This sets status to sunset.`))
                        e.preventDefault();
                }, children: [_jsx("input", { type: "hidden", name: "intent", value: "archive" }), _jsxs("div", { className: "flex items-center justify-between", children: [_jsxs("div", { children: [_jsx("p", { className: "text-sm font-medium text-red-400", children: "Archive Venture" }), _jsx("p", { className: "text-xs text-zinc-600", children: "Sets status to sunset. Reversible." })] }), _jsx(Button, { type: "submit", variant: "danger", children: "Archive" })] })] })] }));
}
function StatCard({ label, value, unit, }) {
    return (_jsxs("div", { className: "rounded-xl border border-surface-2/50 bg-surface-1/40 p-4", children: [_jsx("div", { className: "text-xs text-zinc-600 uppercase tracking-wide", children: label }), _jsxs("div", { className: "mt-1 text-xl font-bold text-zinc-200", children: [value, unit && _jsx("span", { className: "ml-1 text-sm font-normal text-zinc-500", children: unit })] })] }));
}
function LinkTypeIcon({ type }) {
    const icons = {
        repo: "⑂",
        live: "↗",
        docs: "📄",
        figma: "◆",
        dashboard: "⊞",
        other: "🔗",
    };
    return _jsx("span", { className: "text-xs text-zinc-500", children: icons[type] ?? "🔗" });
}
