import { getProductClient, getAllProductSlugs, } from "./product-clients.server";
// Table name variations to try across products
const ORG_TABLES = ["organizations", "accounts", "users", "profiles"];
const SUB_TABLES = ["subscriptions", "plans", "billing"];
export async function getVentureMetrics(slug, env) {
    const client = getProductClient(slug, env);
    if (!client)
        return null;
    // Try to find customer count by probing common table names
    let customerCount = 0;
    for (const table of ORG_TABLES) {
        const result = await client
            .from(table)
            .select("id", { count: "exact", head: true })
            .catch(() => null);
        if (result && result.count !== null) {
            customerCount = result.count;
            break;
        }
    }
    // Try to find active MRR by probing common subscription tables
    let mrrCents = 0;
    for (const table of SUB_TABLES) {
        const result = await client
            .from(table)
            .select("mrr_cents")
            .eq("status", "active")
            .catch(() => null);
        if (result?.data && result.data.length > 0) {
            mrrCents = result.data.reduce((sum, s) => sum + (s.mrr_cents || 0), 0);
            break;
        }
    }
    return { customer_count: customerCount, mrr_cents: mrrCents };
}
/**
 * Fetches live metrics for all connected products.
 * Uses Promise.allSettled so a single unreachable product never
 * blocks the rest or causes the page to error.
 */
export async function getAllVentureMetrics(env) {
    const slugs = getAllProductSlugs();
    const results = await Promise.allSettled(slugs.map((slug) => getVentureMetrics(slug, env)));
    return Object.fromEntries(slugs.map((slug, i) => {
        const result = results[i];
        return [slug, result.status === "fulfilled" ? result.value : null];
    }));
}
