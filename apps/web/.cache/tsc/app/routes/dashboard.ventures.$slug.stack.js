import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { Form, useLoaderData, useRouteLoaderData, data } from "react-router";
import { getSupabaseClient } from "~/lib/supabase.server";
import { Button } from "~/components/ui/Button";
import { Input } from "~/components/ui/Input";
import { Select } from "~/components/ui/Select";
import { FormField } from "~/components/ui/FormField";
const CATEGORIES = [
    "database",
    "hosting",
    "payments",
    "auth",
    "analytics",
    "ai",
    "email",
    "monitoring",
    "other",
];
const CATEGORY_ICONS = {
    database: "🗄️",
    hosting: "☁️",
    payments: "💳",
    auth: "🔐",
    analytics: "📊",
    ai: "🤖",
    email: "✉️",
    monitoring: "📡",
    other: "🔧",
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
    const { data: stack } = await supabase
        .from("venture_stack")
        .select("*")
        .eq("venture_id", v.id)
        .order("category")
        .order("created_at");
    return { ventureId: v.id, stack: stack ?? [] };
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
        const id = fd.get("id");
        await supabase.from("venture_stack").delete().eq("id", id);
        return { ok: true };
    }
    // Add
    const toolName = fd.get("tool_name")?.trim();
    const category = fd.get("category");
    const docsUrl = fd.get("docs_url")?.trim() || null;
    const dashboardUrl = fd.get("dashboard_url")?.trim() || null;
    const setupCommands = fd.get("setup_commands")?.trim() || null;
    const secretsRaw = fd.get("secrets_required")?.trim() || "";
    const secretsRequired = secretsRaw
        ? secretsRaw.split(/[\n,]+/).map((s) => s.trim()).filter(Boolean)
        : null;
    if (!toolName)
        return data({ error: "Tool name required" }, { status: 400 });
    const { error } = await supabase.from("venture_stack").insert({
        venture_id: v.id,
        tool_name: toolName,
        category,
        docs_url: docsUrl,
        dashboard_url: dashboardUrl,
        setup_commands: setupCommands,
        secrets_required: secretsRequired,
    });
    if (error)
        return data({ error: error.message }, { status: 500 });
    return { ok: true };
}
export default function VentureStack() {
    const { stack } = useLoaderData();
    const hub = useRouteLoaderData("routes/dashboard.ventures.$slug");
    const venture = hub?.venture;
    const grouped = CATEGORIES.reduce((acc, cat) => {
        const items = stack.filter((s) => s.category === cat);
        if (items.length)
            acc[cat] = items;
        return acc;
    }, {});
    return (_jsxs("div", { className: "mx-auto max-w-3xl space-y-6", children: [_jsxs(Form, { method: "post", className: "rounded-xl border border-surface-2/50 bg-surface-1/40 p-5 backdrop-blur-sm", children: [_jsx("h2", { className: "mb-4 text-sm font-semibold text-zinc-300", children: "Add Tool" }), _jsxs("div", { className: "grid gap-4 sm:grid-cols-2", children: [_jsx(FormField, { label: "Tool Name", required: true, children: _jsx(Input, { name: "tool_name", placeholder: "Supabase" }) }), _jsx(FormField, { label: "Category", children: _jsx(Select, { name: "category", defaultValue: "other", children: CATEGORIES.map((c) => (_jsxs("option", { value: c, children: [CATEGORY_ICONS[c], " ", c] }, c))) }) })] }), _jsxs("div", { className: "mt-4 grid gap-4 sm:grid-cols-2", children: [_jsx(FormField, { label: "Docs URL", children: _jsx(Input, { name: "docs_url", placeholder: "https://docs.supabase.com" }) }), _jsx(FormField, { label: "Dashboard URL", children: _jsx(Input, { name: "dashboard_url", placeholder: "https://supabase.com/dashboard" }) })] }), _jsx(FormField, { label: "Secrets Required", hint: "One per line or comma-separated", className: "mt-4", children: _jsx("textarea", { name: "secrets_required", rows: 2, placeholder: "SUPABASE_URL\nSUPABASE_ANON_KEY", className: "w-full rounded-lg border border-surface-2/50 bg-surface-1 px-3 py-2 text-sm font-mono text-zinc-200 placeholder-zinc-600 focus:outline-none focus:ring-1 focus:ring-brand" }) }), _jsx(FormField, { label: "Setup Commands", hint: "Shell commands for initial setup", className: "mt-4", children: _jsx("textarea", { name: "setup_commands", rows: 2, placeholder: "npx supabase init\nnpx supabase link", className: "w-full rounded-lg border border-surface-2/50 bg-surface-1 px-3 py-2 text-sm font-mono text-zinc-200 placeholder-zinc-600 focus:outline-none focus:ring-1 focus:ring-brand" }) }), _jsx("div", { className: "mt-4 flex justify-end", children: _jsx(Button, { type: "submit", children: "Add Tool" }) })] }), stack.length === 0 ? (_jsx("p", { className: "py-8 text-center text-sm text-zinc-600", children: "No tools in your stack yet. Add your first one above." })) : (Object.entries(grouped).map(([cat, items]) => (_jsxs("div", { children: [_jsxs("h3", { className: "mb-2 text-xs font-semibold uppercase tracking-wide text-zinc-500", children: [CATEGORY_ICONS[cat] ?? "🔧", " ", cat] }), _jsx("div", { className: "space-y-2", children: items.map((tool) => (_jsxs("div", { className: "flex items-start justify-between rounded-xl border border-surface-2/50 bg-surface-1/40 p-4", children: [_jsxs("div", { className: "flex-1", children: [_jsx("div", { className: "flex items-center gap-2", children: _jsx("span", { className: "font-medium text-zinc-200", children: tool.tool_name }) }), tool.secrets_required && tool.secrets_required.length > 0 && (_jsx("div", { className: "mt-1 flex flex-wrap gap-1", children: tool.secrets_required.map((s) => (_jsx("code", { className: "rounded bg-surface-2/50 px-1.5 py-0.5 font-mono text-xs text-zinc-400", children: s }, s))) })), _jsxs("div", { className: "mt-2 flex flex-wrap gap-3 text-xs text-zinc-500", children: [tool.dashboard_url && (_jsx("a", { href: tool.dashboard_url, target: "_blank", rel: "noopener noreferrer", className: "hover:text-brand", children: "Dashboard \u2197" })), tool.docs_url && (_jsx("a", { href: tool.docs_url, target: "_blank", rel: "noopener noreferrer", className: "hover:text-brand", children: "Docs \u2197" })), tool.setup_commands && (_jsxs("span", { className: "font-mono text-zinc-600", children: [tool.setup_commands.split("\n")[0], tool.setup_commands.includes("\n") ? " …" : ""] }))] })] }), _jsxs(Form, { method: "post", children: [_jsx("input", { type: "hidden", name: "intent", value: "delete" }), _jsx("input", { type: "hidden", name: "id", value: tool.id }), _jsx("button", { type: "submit", className: "ml-3 text-zinc-600 hover:text-red-400 transition-colors", title: "Remove", children: "\u2715" })] })] }, tool.id))) })] }, cat))))] }));
}
