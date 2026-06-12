/**
 * Central env loader for the e2e suite. Reads the repo-root `.env.local`
 * (gitignored) so credentials never live in this package. See README.md for the
 * required keys.
 */
import { config } from "dotenv";
import { fileURLToPath } from "node:url";
import { dirname, resolve } from "node:path";

const __dirname = dirname(fileURLToPath(import.meta.url));
// apps/e2e/lib -> repo root is three levels up.
const repoRoot = resolve(__dirname, "../../..");

config({ path: resolve(repoRoot, ".env.local") });
// A local override file inside the package is also honoured (handy in CI).
config({ path: resolve(__dirname, "../.env"), override: false });

function required(name: string): string {
  const v = process.env[name];
  if (!v) {
    throw new Error(
      `Missing required env var ${name}. Add it to .env.local (see apps/e2e/README.md).`
    );
  }
  return v;
}

export const ENV = {
  BASE_URL: (process.env.BASE_URL ?? "https://app.sheetzlabs.com").replace(/\/$/, ""),
  API_URL: (process.env.API_URL ?? "https://api.sheetzlabs.com").replace(/\/$/, ""),
  get TEST_USER_EMAIL() {
    return required("TEST_USER_EMAIL");
  },
  get TEST_USER_PASSWORD() {
    return required("TEST_USER_PASSWORD");
  },
  get SUPABASE_URL() {
    return required("SUPABASE_URL");
  },
  get SUPABASE_ANON_KEY() {
    return required("SUPABASE_ANON_KEY");
  },
  get SUPABASE_SERVICE_ROLE_KEY() {
    return required("SUPABASE_SERVICE_ROLE_KEY");
  },
  // Domain used to build the synthetic guest address for booking tests.
  GUEST_DOMAIN: process.env.E2E_GUEST_DOMAIN ?? "sheetzlabs.com",
};

/** Where global-setup stows the authenticated browser storage state. */
export const STORAGE_STATE = resolve(__dirname, "../.auth/state.json");
