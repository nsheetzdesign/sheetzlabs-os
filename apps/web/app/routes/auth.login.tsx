import type { ActionFunctionArgs, LoaderFunctionArgs } from "react-router";
import { Form, redirect, useActionData, data } from "react-router";
import { createSupabaseServerClient } from "~/lib/auth.server";

export async function loader({ request, context }: LoaderFunctionArgs) {
  const { supabase, headers } = createSupabaseServerClient(
    request,
    context.cloudflare.env,
  );
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (user) throw redirect("/dashboard", { headers });
  return {};
}

export async function action({ request, context }: ActionFunctionArgs) {
  const { supabase, headers } = createSupabaseServerClient(
    request,
    context.cloudflare.env,
  );
  const fd = await request.formData();
  const email = (fd.get("email") as string)?.trim();
  const password = fd.get("password") as string;

  const { error } = await supabase.auth.signInWithPassword({ email, password });

  if (error) {
    return data({ error: "Invalid email or password." }, { status: 400, headers });
  }

  return redirect("/dashboard", { headers });
}

export default function Login() {
  const actionData = useActionData<typeof action>();

  return (
    <div className="flex min-h-screen items-center justify-center bg-surface-0 px-4">
      <div className="w-full max-w-sm space-y-6">
        {/* Logo */}
        <div className="flex flex-col items-center gap-2 text-center">
          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-brand text-lg font-bold text-white">
            SL
          </div>
          <h1 className="text-xl font-semibold text-zinc-100">Sheetz Labs OS</h1>
          <p className="text-sm text-zinc-500">Sign in to your workspace</p>
        </div>

        {/* Error */}
        {actionData?.error && (
          <div className="rounded-lg border border-red-500/20 bg-red-500/10 px-4 py-3 text-sm text-red-400">
            {actionData.error}
          </div>
        )}

        {/* Form */}
        <Form
          method="post"
          className="space-y-4 rounded-xl border border-surface-2/50 bg-surface-1/40 p-6 backdrop-blur-sm"
        >
          <div className="space-y-1.5">
            <label className="block text-sm font-medium text-zinc-300">
              Email
            </label>
            <input
              type="email"
              name="email"
              required
              autoFocus
              autoComplete="email"
              className="w-full rounded-lg border border-surface-2/50 bg-surface-1 px-3 py-2 text-sm text-zinc-200 placeholder-zinc-600 focus:outline-none focus:ring-1 focus:ring-brand"
              placeholder="you@example.com"
            />
          </div>
          <div className="space-y-1.5">
            <label className="block text-sm font-medium text-zinc-300">
              Password
            </label>
            <input
              type="password"
              name="password"
              required
              autoComplete="current-password"
              className="w-full rounded-lg border border-surface-2/50 bg-surface-1 px-3 py-2 text-sm text-zinc-200 placeholder-zinc-600 focus:outline-none focus:ring-1 focus:ring-brand"
              placeholder="••••••••"
            />
          </div>
          <button
            type="submit"
            className="w-full rounded-lg bg-brand px-4 py-2 text-sm font-medium text-white transition-opacity hover:opacity-90"
          >
            Sign In
          </button>
        </Form>
      </div>
    </div>
  );
}
