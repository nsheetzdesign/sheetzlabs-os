import { getApiBase, getAccessToken } from "~/lib/api";
/**
 * Same-origin proxy to the API worker for browser-side fetches.
 *
 * Client code calls `/api/<path>` (same origin → no CORS, no token in client JS);
 * this resource route attaches the founder's Supabase JWT server-side and forwards
 * to the API worker. Doubles as the fix for EU-2 (ThreadView fetched
 * `/api/email/thread/:id`, which previously 404'd because no such route existed).
 */
async function proxy(request, 
// eslint-disable-next-line @typescript-eslint/no-explicit-any
context, splat) {
    const env = context.cloudflare.env;
    const token = await getAccessToken(request, env);
    if (!token) {
        return new Response(JSON.stringify({ error: "Unauthorized" }), {
            status: 401,
            headers: { "Content-Type": "application/json" },
        });
    }
    const url = new URL(request.url);
    const target = `${getApiBase(env)}/${splat}${url.search}`;
    const headers = new Headers();
    headers.set("Authorization", `Bearer ${token}`);
    const contentType = request.headers.get("Content-Type");
    if (contentType)
        headers.set("Content-Type", contentType);
    const init = { method: request.method, headers };
    if (request.method !== "GET" && request.method !== "HEAD") {
        init.body = await request.text();
    }
    const res = await fetch(target, init);
    const respHeaders = new Headers();
    const respCt = res.headers.get("Content-Type");
    if (respCt)
        respHeaders.set("Content-Type", respCt);
    return new Response(res.body, { status: res.status, headers: respHeaders });
}
export async function loader({ request, context, params }) {
    return proxy(request, context, params["*"] ?? "");
}
export async function action({ request, context, params }) {
    return proxy(request, context, params["*"] ?? "");
}
