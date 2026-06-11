import type { ActionFunctionArgs } from "react-router";
import { apiFetch } from "~/lib/api";

// Routes through the API so the star reaches Gmail (ES-1), not just Supabase.
export async function action({ params, request, context }: ActionFunctionArgs) {
  const { id } = params;
  const env = context.cloudflare.env;
  const formData = await request.formData();
  const is_starred = formData.get("is_starred") === "true";

  const res = await apiFetch(request, env, `/email/messages/${id}/star`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ is_starred }),
  });

  const data = await res.json().catch(() => ({ error: "Star failed" }));
  return Response.json(data, { status: res.ok ? 200 : res.status });
}
