import type { ActionFunctionArgs } from "react-router";
import { requireAuth } from "~/lib/auth.server";
import { apiFetch } from "~/lib/api";

/**
 * POST /dashboard/repos/reconcile — manual "reconcile now".
 *
 * RR v7 actions do NOT inherit ancestor-loader auth, so requireAuth is the first
 * line (Prompt 63). Triggers one poll-with-ETag tick against the authed API.
 */
export async function action({ request, context }: ActionFunctionArgs) {
  await requireAuth(request, context.cloudflare.env);
  const env = context.cloudflare.env;

  try {
    const res = await apiFetch(request, env, "/github/reconcile", { method: "POST" });
    const body = await res.json().catch(() => ({}));
    return Response.json(body, { status: res.ok ? 200 : res.status });
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    return Response.json({ ok: false, error: message }, { status: 500 });
  }
}
