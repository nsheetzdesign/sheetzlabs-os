import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { Form, useLoaderData, data } from "react-router";
import { getSupabaseClient } from "~/lib/supabase.server";
import { Button } from "~/components/ui/Button";
import { Input } from "~/components/ui/Input";
import { Select } from "~/components/ui/Select";
import { FormField } from "~/components/ui/FormField";
const LINK_TYPES = ["repo", "live", "docs", "figma", "dashboard", "other"];
const TYPE_ICONS = {
    repo: "⑂",
    live: "↗",
    docs: "📄",
    figma: "◆",
    dashboard: "⊞",
    other: "🔗",
};
const TYPE_COLORS = {
    repo: "text-purple-400 border-purple-500/30 bg-purple-500/10",
    live: "text-green-400 border-green-500/30 bg-green-500/10",
    docs: "text-blue-400 border-blue-500/30 bg-blue-500/10",
    figma: "text-pink-400 border-pink-500/30 bg-pink-500/10",
    dashboard: "text-amber-400 border-amber-500/30 bg-amber-500/10",
    other: "text-zinc-400 border-zinc-500/30 bg-zinc-500/10",
};
export async function loader({ params, context }) {
    const supabase = getSupabaseClient(context.cloudflare.env);
    const { data: v } = await supabase
        .from("ventures")
        .select("id")
        .eq("slug", params.slug)
        .single();
    if (!v)
        throw new Response("Not found", { status: 404 });
    const { data: links } = await supabase
        .from("venture_links")
        .select("*")
        .eq("venture_id", v.id)
        .order("type")
        .order("created_at");
    return { ventureId: v.id, links: links ?? [] };
}
export async function action({ request, params, context }) {
    const supabase = getSupabaseClient(context.cloudflare.env);
    const fd = await request.formData();
    const intent = fd.get("intent");
    const { data: v } = await supabase
        .from("ventures")
        .select("id")
        .eq("slug", params.slug)
        .single();
    if (!v)
        throw new Response("Not found", { status: 404 });
    if (intent === "delete") {
        await supabase.from("venture_links").delete().eq("id", fd.get("id"));
        return { ok: true };
    }
    const label = fd.get("label")?.trim();
    const url = fd.get("url")?.trim();
    const type = fd.get("type") || "other";
    if (!label || !url)
        return data({ error: "Label and URL required" }, { status: 400 });
    const { error } = await supabase.from("venture_links").insert({
        venture_id: v.id,
        label,
        url,
        type,
    });
    if (error)
        return data({ error: error.message }, { status: 500 });
    return { ok: true };
}
export default function VentureLinks() {
    const { links } = useLoaderData();
    const grouped = LINK_TYPES.reduce((acc, t) => {
        const items = links.filter((l) => l.type === t);
        if (items.length)
            acc[t] = items;
        return acc;
    }, {});
    return (_jsxs("div", { className: "mx-auto max-w-3xl space-y-6", children: [_jsxs(Form, { method: "post", className: "rounded-xl border border-surface-2/50 bg-surface-1/40 p-5 backdrop-blur-sm", children: [_jsx("h2", { className: "mb-4 text-sm font-semibold text-zinc-300", children: "Add Link" }), _jsxs("div", { className: "grid gap-4 sm:grid-cols-3", children: [_jsx(FormField, { label: "Label", required: true, children: _jsx(Input, { name: "label", placeholder: "GitHub Repo" }) }), _jsx(FormField, { label: "Type", children: _jsx(Select, { name: "type", defaultValue: "other", children: LINK_TYPES.map((t) => (_jsxs("option", { value: t, children: [TYPE_ICONS[t], " ", t] }, t))) }) }), _jsx(FormField, { label: "URL", required: true, children: _jsx(Input, { name: "url", placeholder: "https://github.com/..." }) })] }), _jsx("div", { className: "mt-4 flex justify-end", children: _jsx(Button, { type: "submit", children: "Add Link" }) })] }), links.length === 0 ? (_jsx("p", { className: "py-8 text-center text-sm text-zinc-600", children: "No links yet." })) : (Object.entries(grouped).map(([type, items]) => (_jsxs("div", { children: [_jsxs("h3", { className: "mb-2 text-xs font-semibold uppercase tracking-wide text-zinc-500", children: [TYPE_ICONS[type], " ", type] }), _jsx("div", { className: "space-y-2", children: items.map((link) => (_jsxs("div", { className: "flex items-center justify-between rounded-xl border border-surface-2/50 bg-surface-1/40 px-4 py-3", children: [_jsxs("div", { className: "flex items-center gap-3 min-w-0", children: [_jsxs("span", { className: `shrink-0 rounded border px-2 py-0.5 text-xs font-medium ${TYPE_COLORS[link.type ?? "other"] ?? TYPE_COLORS.other}`, children: [TYPE_ICONS[link.type ?? "other"], " ", link.type] }), _jsx("a", { href: link.url, target: "_blank", rel: "noopener noreferrer", className: "truncate text-sm font-medium text-zinc-200 hover:text-brand", children: link.label }), _jsx("span", { className: "hidden truncate text-xs text-zinc-600 sm:block", children: link.url })] }), _jsxs(Form, { method: "post", children: [_jsx("input", { type: "hidden", name: "intent", value: "delete" }), _jsx("input", { type: "hidden", name: "id", value: link.id }), _jsx("button", { type: "submit", className: "ml-3 text-zinc-600 hover:text-red-400 transition-colors", children: "\u2715" })] })] }, link.id))) })] }, type))))] }));
}
