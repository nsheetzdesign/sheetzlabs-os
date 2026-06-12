/**
 * Global setup: authenticate once via the real login form and persist the browser
 * storage state for reuse by every test. We drive the actual form (rather than
 * forging cookies) because the app uses @supabase/ssr cookie sessions — driving the
 * form is the only faithful way to obtain them, and it doubles as a login smoke test.
 */
import { chromium, type FullConfig } from "@playwright/test";
import { mkdirSync } from "node:fs";
import { dirname } from "node:path";
import { ENV, STORAGE_STATE } from "./lib/env";

export default async function globalSetup(_config: FullConfig) {
  // Touch the lazily-required secrets up front so a misconfig fails fast & clearly.
  const email = ENV.TEST_USER_EMAIL;
  const password = ENV.TEST_USER_PASSWORD;

  mkdirSync(dirname(STORAGE_STATE), { recursive: true });

  const browser = await chromium.launch();
  const page = await browser.newPage();
  try {
    await page.goto(`${ENV.BASE_URL}/auth/login`, { waitUntil: "networkidle" });
    await page.fill('input[name="email"]', email);
    await page.fill('input[name="password"]', password);
    await Promise.all([
      page.waitForURL((url) => url.pathname.startsWith("/dashboard"), { timeout: 30_000 }),
      page.click('button[type="submit"]'),
    ]);
    await page.context().storageState({ path: STORAGE_STATE });
    // eslint-disable-next-line no-console
    console.log(`[e2e] authenticated as ${email}; storage saved.`);
  } catch (err) {
    throw new Error(
      `[e2e] login failed for ${email} at ${ENV.BASE_URL}/auth/login. ` +
        `Check TEST_USER_EMAIL/TEST_USER_PASSWORD in .env.local. Original: ${
          err instanceof Error ? err.message : String(err)
        }`
    );
  } finally {
    await browser.close();
  }
}
