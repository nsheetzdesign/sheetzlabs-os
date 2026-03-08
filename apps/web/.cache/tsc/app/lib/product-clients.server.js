import { createClient } from "@supabase/supabase-js";
export function getProductClient(slug, env) {
    const configs = {
        bohp: { url: env.BOHP_SUPABASE_URL, key: env.BOHP_SUPABASE_KEY },
        telosi: { url: env.TELOSI_SUPABASE_URL, key: env.TELOSI_SUPABASE_KEY },
        holix: { url: env.HOLIX_SUPABASE_URL, key: env.HOLIX_SUPABASE_KEY },
    };
    const config = configs[slug];
    if (!config.url || !config.key)
        return null;
    return createClient(config.url, config.key);
}
export function getAllProductSlugs() {
    return ["bohp", "telosi", "holix"];
}
