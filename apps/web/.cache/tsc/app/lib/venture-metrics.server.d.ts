export interface VentureMetrics {
    customer_count: number;
    mrr_cents: number;
}
export declare function getVentureMetrics(slug: string, env: Env): Promise<VentureMetrics | null>;
/**
 * Fetches live metrics for all connected products.
 * Uses Promise.allSettled so a single unreachable product never
 * blocks the rest or causes the page to error.
 */
export declare function getAllVentureMetrics(env: Env): Promise<Record<string, VentureMetrics | null>>;
