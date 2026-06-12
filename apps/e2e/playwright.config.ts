import { defineConfig, devices } from "@playwright/test";
import { ENV, STORAGE_STATE } from "./lib/env";

/**
 * Smoke suite runs against a LIVE deployment (prod by default) and hits real Google
 * APIs, so: single worker (no parallel mutation races on shared founder data),
 * retries=1 (tolerate sync-timing flake), trace on first retry, HTML report.
 */
export default defineConfig({
  testDir: "./tests",
  globalSetup: "./global-setup.ts",
  globalTeardown: "./global-teardown.ts",
  fullyParallel: false,
  workers: 1,
  retries: 1,
  timeout: 90_000,
  expect: { timeout: 15_000 },
  forbidOnly: !!process.env.CI,
  reporter: [
    ["list"],
    ["html", { outputFolder: "report", open: "never" }],
  ],
  use: {
    baseURL: ENV.BASE_URL,
    storageState: STORAGE_STATE,
    // Calendar correctness depends on the browser tz — pin it (calendar.spec asserts).
    timezoneId: "America/Chicago",
    locale: "en-US",
    trace: "on-first-retry",
    screenshot: "only-on-failure",
    actionTimeout: 15_000,
    navigationTimeout: 30_000,
  },
  projects: [
    {
      name: "chromium",
      use: { ...devices["Desktop Chrome"] },
    },
  ],
});
