export type ProductSlug = "bohp" | "telosi" | "holix";
type ProductEnv = {
    BOHP_SUPABASE_URL?: string;
    BOHP_SUPABASE_KEY?: string;
    TELOSI_SUPABASE_URL?: string;
    TELOSI_SUPABASE_KEY?: string;
    HOLIX_SUPABASE_URL?: string;
    HOLIX_SUPABASE_KEY?: string;
};
export declare function getProductClient(slug: ProductSlug, env: ProductEnv): import("@supabase/supabase-js").SupabaseClient<any, "public", "public", any, any> | null;
export declare function getAllProductSlugs(): ProductSlug[];
export {};
