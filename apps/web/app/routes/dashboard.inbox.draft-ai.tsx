import type { ActionFunctionArgs } from "react-router";

export async function action({ request, context }: ActionFunctionArgs) {
  const env = context.cloudflare.env;
  const formData = await request.formData();

  const body: Record<string, string> = {};
  for (const [key, val] of formData.entries()) {
    body[key] = val.toString();
  }

  const apiUrl = (env as Record<string, string>).API_URL ?? "https://api.sheetzlabs.com";
  const res = await fetch(`${apiUrl}/email/draft-with-ai`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });

  const data = await res.json();
  return data;
}
