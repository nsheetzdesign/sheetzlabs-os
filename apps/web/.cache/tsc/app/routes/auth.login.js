import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { Form, redirect, useActionData, data } from "react-router";
import { createSupabaseServerClient } from "~/lib/auth.server";
export async function loader({ request, context }) {
    const { supabase, headers } = createSupabaseServerClient(request, context.cloudflare.env);
    const { data: { user }, } = await supabase.auth.getUser();
    if (user)
        throw redirect("/dashboard", { headers });
    return {};
}
export async function action({ request, context }) {
    const { supabase, headers } = createSupabaseServerClient(request, context.cloudflare.env);
    const fd = await request.formData();
    const email = fd.get("email")?.trim();
    const password = fd.get("password");
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) {
        return data({ error: "Invalid email or password." }, { status: 400, headers });
    }
    return redirect("/dashboard", { headers });
}
export default function Login() {
    const actionData = useActionData();
    return (_jsx("div", { className: "flex min-h-screen items-center justify-center bg-surface-0 px-4", children: _jsxs("div", { className: "w-full max-w-sm space-y-6", children: [_jsxs("div", { className: "flex flex-col items-center gap-2 text-center", children: [_jsx("div", { className: "flex h-12 w-12 items-center justify-center rounded-xl bg-brand text-lg font-bold text-white", children: "SL" }), _jsx("h1", { className: "text-xl font-semibold text-zinc-100", children: "Sheetz Labs OS" }), _jsx("p", { className: "text-sm text-zinc-500", children: "Sign in to your workspace" })] }), actionData?.error && (_jsx("div", { className: "rounded-lg border border-red-500/20 bg-red-500/10 px-4 py-3 text-sm text-red-400", children: actionData.error })), _jsxs(Form, { method: "post", className: "space-y-4 rounded-xl border border-surface-2/50 bg-surface-1/40 p-6 backdrop-blur-sm", children: [_jsxs("div", { className: "space-y-1.5", children: [_jsx("label", { className: "block text-sm font-medium text-zinc-300", children: "Email" }), _jsx("input", { type: "email", name: "email", required: true, autoFocus: true, autoComplete: "email", className: "w-full rounded-lg border border-surface-2/50 bg-surface-1 px-3 py-2 text-sm text-zinc-200 placeholder-zinc-600 focus:outline-none focus:ring-1 focus:ring-brand", placeholder: "you@example.com" })] }), _jsxs("div", { className: "space-y-1.5", children: [_jsx("label", { className: "block text-sm font-medium text-zinc-300", children: "Password" }), _jsx("input", { type: "password", name: "password", required: true, autoComplete: "current-password", className: "w-full rounded-lg border border-surface-2/50 bg-surface-1 px-3 py-2 text-sm text-zinc-200 placeholder-zinc-600 focus:outline-none focus:ring-1 focus:ring-brand", placeholder: "\u2022\u2022\u2022\u2022\u2022\u2022\u2022\u2022" })] }), _jsx("button", { type: "submit", className: "w-full rounded-lg bg-brand px-4 py-2 text-sm font-medium text-white transition-opacity hover:opacity-90", children: "Sign In" })] })] }) }));
}
