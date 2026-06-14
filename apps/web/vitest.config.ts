import { defineConfig } from "vitest/config";

// Standalone test config — deliberately does NOT load the app's vite.config
// (Cloudflare + React Router plugins). Unit tests here are pure-TS only.
export default defineConfig({
  test: {
    include: ["app/**/*.test.ts"],
    environment: "node",
  },
});
