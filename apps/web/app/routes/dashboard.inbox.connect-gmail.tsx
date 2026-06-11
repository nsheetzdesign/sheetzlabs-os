import { redirect } from "react-router";
import type { ActionFunctionArgs } from "react-router";
import { apiFetch } from "~/lib/api";

/**
 * Authenticated Gmail OAuth initiation (Prompt 51B). The "Connect Gmail" button
 * posts here; we call the API's authenticated start endpoint (which binds a
 * user-scoped `state` nonce) and redirect the browser to the returned Google URL.
 */
export async function action({ request, context }: ActionFunctionArgs) {
  const env = context.cloudflare.env;
  const res = await apiFetch(request, env, "/email/auth/gmail/start", { method: "POST" });

  if (!res.ok) {
    return redirect(
      `/dashboard/inbox?connected=false&error=${encodeURIComponent(
        "Could not start Gmail connection"
      )}`
    );
  }

  const { url } = (await res.json()) as { url: string };
  return redirect(url);
}
