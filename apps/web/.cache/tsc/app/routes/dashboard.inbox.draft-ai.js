import { apiFetch } from "~/lib/api";
export async function action({ request, context }) {
    const env = context.cloudflare.env;
    const formData = await request.formData();
    const body = {};
    for (const [key, val] of formData.entries()) {
        body[key] = val.toString();
    }
    const res = await apiFetch(request, env, `/email/draft-with-ai`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
    });
    const data = await res.json();
    return data;
}
