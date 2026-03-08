import { jsxs as _jsxs, jsx as _jsx } from "react/jsx-runtime";
import { useLoaderData, useActionData, Form, Link, redirect, data, } from "react-router";
import { Header } from "~/components/dashboard/Header";
import { getSupabaseClient } from "~/lib/supabase.server";
import { FormField } from "~/components/ui/FormField";
import { Input } from "~/components/ui/Input";
import { Select } from "~/components/ui/Select";
import { Button } from "~/components/ui/Button";
const TYPES = ["client", "partner", "investor", "advisor", "vendor", "prospect", "friend"];
const INTERACTION_TYPES = ["email", "call", "meeting", "slack", "other"];
const DIRECTIONS = ["outbound", "inbound"];
const REL_TYPE_COLORS = {
    client: "text-green-400 bg-green-500/10 border-green-500/20",
    partner: "text-blue-400 bg-blue-500/10 border-blue-500/20",
    investor: "text-violet-400 bg-violet-500/10 border-violet-500/20",
    advisor: "text-amber-400 bg-amber-500/10 border-amber-500/20",
    vendor: "text-zinc-400 bg-zinc-500/10 border-zinc-500/20",
    prospect: "text-cyan-400 bg-cyan-500/10 border-cyan-500/20",
    friend: "text-pink-400 bg-pink-500/10 border-pink-500/20",
};
const ITYPE_ICON = {
    email: "✉️",
    call: "📞",
    meeting: "🤝",
    slack: "💬",
    other: "📝",
};
export async function loader({ params, context }) {
    const supabase = getSupabaseClient(context.cloudflare.env);
    const [relRes, venturesRes, interactionsRes] = await Promise.all([
        supabase.from("relationships").select("*").eq("id", params.id).single(),
        supabase.from("ventures").select("id, name, slug").order("name"),
        supabase
            .from("interactions")
            .select("*")
            .eq("relationship_id", params.id)
            .order("occurred_at", { ascending: false }),
    ]);
    if (!relRes.data)
        throw new Response("Not found", { status: 404 });
    return {
        rel: relRes.data,
        ventures: venturesRes.data ?? [],
        interactions: interactionsRes.data ?? [],
    };
}
export async function action({ request, params, context }) {
    const supabase = getSupabaseClient(context.cloudflare.env);
    const fd = await request.formData();
    const intent = fd.get("intent");
    if (intent === "add-interaction") {
        const type = fd.get("type");
        const direction = fd.get("direction") || "outbound";
        const subject = fd.get("subject")?.trim() || null;
        const summary = fd.get("summary")?.trim() || null;
        const occurred_at = fd.get("occurred_at")
            ? new Date(fd.get("occurred_at")).toISOString()
            : new Date().toISOString();
        const errors = {};
        if (!type)
            errors.type = "Required";
        if (Object.keys(errors).length)
            return data({ errors }, { status: 400 });
        await supabase.from("interactions").insert({
            relationship_id: params.id,
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
            .eq("id", params.id);
        return redirect(`/dashboard/relationships/${params.id}`);
    }
    if (intent === "delete-interaction") {
        const interactionId = fd.get("interaction_id");
        await supabase.from("interactions").delete().eq("id", interactionId);
        return redirect(`/dashboard/relationships/${params.id}`);
    }
    // Default: update relationship
    const name = fd.get("name")?.trim();
    const email = fd.get("email")?.trim() || null;
    const company = fd.get("company")?.trim() || null;
    const role = fd.get("role")?.trim() || null;
    const type = fd.get("type") || "prospect";
    const strength = parseInt(fd.get("strength") || "50", 10);
    const last_contact = fd.get("last_contact") || null;
    const notes = fd.get("notes")?.trim() || null;
    const venture_ids = fd.getAll("venture_ids").filter(Boolean);
    const errors = {};
    if (!name)
        errors.name = "Required";
    if (Object.keys(errors).length)
        return data({ errors }, { status: 400 });
    const { error } = await supabase
        .from("relationships")
        .update({
        name,
        email,
        company,
        role,
        type: type,
        strength,
        last_contact: last_contact ? new Date(last_contact).toISOString() : null,
        notes,
        venture_ids: venture_ids.length > 0 ? venture_ids : null,
    })
        .eq("id", params.id);
    if (error)
        return data({ errors: { _form: error.message } }, { status: 500 });
    return redirect(`/dashboard/relationships/${params.id}`);
}
function decayIndicator(lastContact) {
    if (!lastContact)
        return null;
    const days = Math.floor((Date.now() - new Date(lastContact).getTime()) / 86400000);
    if (days > 60)
        return (_jsxs("span", { className: "rounded border border-red-500/30 bg-red-500/10 px-2 py-0.5 text-xs font-medium text-red-400", children: ["\u26A0\uFE0F ", days, " days since last contact"] }));
    if (days > 30)
        return (_jsxs("span", { className: "rounded border border-amber-500/30 bg-amber-500/10 px-2 py-0.5 text-xs font-medium text-amber-400", children: ["\uD83D\uDFE1 ", days, " days since last contact"] }));
    return (_jsxs("span", { className: "text-xs text-zinc-600", children: [days, " days since last contact"] }));
}
function formatDateTime(str) {
    if (!str)
        return "—";
    return new Date(str).toLocaleDateString(undefined, {
        month: "short",
        day: "numeric",
        year: "numeric",
    });
}
export default function EditRelationship() {
    const { rel, ventures, interactions } = useLoaderData();
    const actionData = useActionData();
    const errors = actionData?.errors ?? {};
    const today = new Date().toISOString().slice(0, 10);
    const lastContactDate = rel.last_contact
        ? new Date(rel.last_contact).toISOString().slice(0, 10)
        : "";
    return (_jsxs("div", { className: "flex flex-1 flex-col", children: [_jsx(Header, { title: rel.name }), _jsx("main", { className: "flex-1 p-6", children: _jsxs("div", { className: "mx-auto max-w-2xl space-y-4", children: [_jsxs("div", { className: "flex items-center justify-between rounded-xl border border-surface-2/50 bg-surface-1/40 px-5 py-4 backdrop-blur-sm", children: [_jsxs("div", { className: "flex items-center gap-3", children: [rel.type && (_jsx("span", { className: `rounded border px-2 py-0.5 text-xs font-medium ${REL_TYPE_COLORS[rel.type] ?? ""}`, children: rel.type })), _jsxs("div", { children: [_jsx("p", { className: "text-sm font-medium text-zinc-200", children: rel.name }), (rel.company || rel.role) && (_jsx("p", { className: "text-xs text-zinc-600", children: [rel.role, rel.company].filter(Boolean).join(" · ") }))] })] }), _jsx("div", { className: "text-right", children: decayIndicator(rel.last_contact) })] }), errors._form && (_jsx("div", { className: "rounded-lg border border-red-500/20 bg-red-500/10 px-4 py-3 text-sm text-red-400", children: errors._form })), _jsxs(Form, { method: "post", className: "space-y-5 rounded-xl border border-surface-2/50 bg-surface-1/40 p-6 backdrop-blur-sm", children: [_jsxs("div", { className: "grid gap-5 sm:grid-cols-2", children: [_jsx(FormField, { label: "Name", required: true, error: errors.name, children: _jsx(Input, { name: "name", defaultValue: rel.name, error: !!errors.name }) }), _jsx(FormField, { label: "Email", children: _jsx(Input, { name: "email", type: "email", defaultValue: rel.email ?? "" }) })] }), _jsxs("div", { className: "grid gap-5 sm:grid-cols-2", children: [_jsx(FormField, { label: "Company", children: _jsx(Input, { name: "company", defaultValue: rel.company ?? "" }) }), _jsx(FormField, { label: "Role", children: _jsx(Input, { name: "role", defaultValue: rel.role ?? "" }) })] }), _jsxs("div", { className: "grid gap-5 sm:grid-cols-2", children: [_jsx(FormField, { label: "Type", children: _jsx(Select, { name: "type", defaultValue: rel.type ?? "prospect", children: TYPES.map((t) => (_jsx("option", { value: t, children: t }, t))) }) }), _jsx(FormField, { label: "Last Contact", children: _jsx(Input, { name: "last_contact", type: "date", defaultValue: lastContactDate }) })] }), _jsx(FormField, { label: "Relationship Strength", hint: `Current: ${rel.strength ?? 50} / 100`, children: _jsx("input", { type: "number", name: "strength", min: 0, max: 100, defaultValue: rel.strength ?? 50, className: "w-full rounded-lg border border-surface-2/50 bg-surface-1 px-3 py-2 text-sm text-zinc-200 focus:outline-none focus:ring-1 focus:ring-brand" }) }), _jsx(FormField, { label: "Notes", children: _jsx("textarea", { name: "notes", rows: 3, defaultValue: rel.notes ?? "", className: "w-full rounded-lg border border-surface-2/50 bg-surface-1 px-3 py-2 text-sm text-zinc-200 placeholder-zinc-600 focus:outline-none focus:ring-1 focus:ring-brand" }) }), ventures.length > 0 && (_jsx(FormField, { label: "Associated Ventures", hint: "Hold Cmd/Ctrl to select multiple", children: _jsx("select", { name: "venture_ids", multiple: true, defaultValue: rel.venture_ids ?? [], className: "h-32 w-full rounded-lg border border-surface-2/50 bg-surface-1 px-3 py-2 text-sm text-zinc-200 focus:outline-none focus:ring-1 focus:ring-brand", children: ventures.map((v) => (_jsx("option", { value: v.id, children: v.name }, v.id))) }) })), _jsxs("div", { className: "flex items-center gap-3 pt-2", children: [_jsx(Button, { type: "submit", children: "Save Changes" }), _jsx(Link, { to: "/dashboard/relationships", children: _jsx(Button, { type: "button", variant: "secondary", children: "Back" }) })] })] }), _jsxs("div", { className: "rounded-xl border border-surface-2/50 bg-surface-1/40 backdrop-blur-sm", children: [_jsxs("div", { className: "border-b border-surface-2/50 px-5 py-3", children: [_jsx("h2", { className: "text-sm font-semibold text-zinc-300", children: "Interaction Log" }), _jsxs("p", { className: "text-xs text-zinc-600", children: [interactions.length, " interaction", interactions.length !== 1 ? "s" : ""] })] }), _jsxs("div", { className: "border-b border-surface-2/30 p-4", children: [_jsx("p", { className: "mb-3 text-xs font-medium uppercase tracking-wide text-zinc-600", children: "Log Interaction" }), _jsxs(Form, { method: "post", className: "space-y-3", children: [_jsx("input", { type: "hidden", name: "intent", value: "add-interaction" }), _jsxs("div", { className: "grid gap-3 sm:grid-cols-3", children: [_jsxs("div", { children: [_jsx("label", { className: "mb-1 block text-xs text-zinc-500", children: "Type" }), _jsx(Select, { name: "type", defaultValue: "email", children: INTERACTION_TYPES.map((t) => (_jsxs("option", { value: t, children: [ITYPE_ICON[t], " ", t] }, t))) })] }), _jsxs("div", { children: [_jsx("label", { className: "mb-1 block text-xs text-zinc-500", children: "Direction" }), _jsx(Select, { name: "direction", defaultValue: "outbound", children: DIRECTIONS.map((d) => (_jsx("option", { value: d, children: d }, d))) })] }), _jsxs("div", { children: [_jsx("label", { className: "mb-1 block text-xs text-zinc-500", children: "Date" }), _jsx(Input, { name: "occurred_at", type: "date", defaultValue: today })] })] }), _jsx(Input, { name: "subject", placeholder: "Subject / topic" }), _jsx("textarea", { name: "summary", rows: 2, placeholder: "Brief summary of the interaction\u2026", className: "w-full rounded-lg border border-surface-2/50 bg-surface-1 px-3 py-2 text-sm text-zinc-200 placeholder-zinc-600 focus:outline-none focus:ring-1 focus:ring-brand" }), _jsx(Button, { type: "submit", variant: "secondary", children: "Log Interaction" })] })] }), interactions.length === 0 ? (_jsx("div", { className: "px-5 py-8 text-center text-sm text-zinc-600", children: "No interactions logged yet." })) : (_jsx("div", { className: "divide-y divide-surface-2/30", children: interactions.map((interaction) => (_jsxs("div", { className: "flex items-start gap-3 px-5 py-4", children: [_jsx("span", { className: "mt-0.5 shrink-0 text-base", children: ITYPE_ICON[interaction.type] ?? "📝" }), _jsxs("div", { className: "min-w-0 flex-1", children: [_jsxs("div", { className: "flex items-center gap-2", children: [_jsx("span", { className: "text-sm font-medium text-zinc-300", children: interaction.subject || interaction.type }), _jsx("span", { className: "rounded border border-surface-2/50 px-1.5 py-0.5 text-xs text-zinc-600", children: interaction.direction })] }), interaction.summary && (_jsx("p", { className: "mt-1 text-xs text-zinc-500", children: interaction.summary })), _jsx("p", { className: "mt-1 text-xs text-zinc-700", children: formatDateTime(interaction.occurred_at) })] }), _jsxs(Form, { method: "post", onSubmit: (e) => {
                                                    if (!confirm("Delete this interaction?"))
                                                        e.preventDefault();
                                                }, children: [_jsx("input", { type: "hidden", name: "intent", value: "delete-interaction" }), _jsx("input", { type: "hidden", name: "interaction_id", value: interaction.id }), _jsx("button", { type: "submit", className: "mt-0.5 shrink-0 text-zinc-700 transition-colors hover:text-red-400", title: "Delete", children: _jsx("svg", { className: "h-4 w-4", fill: "none", viewBox: "0 0 24 24", strokeWidth: 2, stroke: "currentColor", children: _jsx("path", { strokeLinecap: "round", strokeLinejoin: "round", d: "M6 18L18 6M6 6l12 12" }) }) })] })] }, interaction.id))) }))] })] }) })] }));
}
