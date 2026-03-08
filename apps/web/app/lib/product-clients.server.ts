import { createClient } from "@supabase/supabase-js";

export type ProductSlug = "bohp" | "telosi" | "holix";

type ProductEnv = {
  BOHP_SUPABASE_URL?: string;
  BOHP_SUPABASE_KEY?: string;
  TELOSI_SUPABASE_URL?: string;
  TELOSI_SUPABASE_KEY?: string;
  HOLIX_SUPABASE_URL?: string;
  HOLIX_SUPABASE_KEY?: string;
};

export function getProductClient(slug: ProductSlug, env: ProductEnv) {
  const configs: Record<ProductSlug, { url?: string; key?: string }> = {
    bohp: { url: env.BOHP_SUPABASE_URL, key: env.BOHP_SUPABASE_KEY },
    telosi: { url: env.TELOSI_SUPABASE_URL, key: env.TELOSI_SUPABASE_KEY },
    holix: { url: env.HOLIX_SUPABASE_URL, key: env.HOLIX_SUPABASE_KEY },
  };

  const config = configs[slug];
  if (!config.url || !config.key) return null;

  return createClient(config.url, config.key);
}

export function getAllProductSlugs(): ProductSlug[] {
  return ["bohp", "telosi", "holix"];
}
