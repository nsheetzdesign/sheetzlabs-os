/**
 * Installable PWA (Prompt 69, Tier 1).
 *
 * What CAN be automated: the manifest is served + valid, the required iOS meta
 * tags + apple-touch-icon are in the document head, the service worker registers,
 * and the shell static files (sw.js, offline.html, icons) are reachable. The real
 * iOS Add-to-Home-Screen flow can't be automated — that's a manual founder check
 * (see the Prompt 69 summary / manual checklist).
 *
 * Runs against the live deployment with the founder session (most assets are
 * public, but loading /dashboard exercises the in-app head + SW registration).
 */
import { test, expect } from "@playwright/test";
import { ENV } from "../lib/env";

test.describe("PWA — manifest + icons", () => {
  test("manifest is served as JSON and is valid", async ({ request }) => {
    const res = await request.get(`${ENV.BASE_URL}/manifest.webmanifest`);
    expect(res.ok()).toBe(true);
    expect(res.headers()["content-type"] ?? "").toContain("json");

    const m = JSON.parse(await res.text());
    expect(m.name).toBeTruthy();
    expect(m.short_name).toBeTruthy();
    expect(m.display).toBe("standalone");
    expect(m.start_url).toBe("/dashboard/work");
    expect(m.scope).toBe("/");
    // Must ship at least 192 + 512, and a maskable variant.
    const sizes = (m.icons ?? []).map((i: { sizes: string }) => i.sizes);
    expect(sizes).toContain("192x192");
    expect(sizes).toContain("512x512");
    expect(
      (m.icons ?? []).some((i: { purpose?: string }) => (i.purpose ?? "").includes("maskable")),
    ).toBe(true);
  });

  test("shell static files are reachable", async ({ request }) => {
    for (const path of [
      "/sw.js",
      "/offline.html",
      "/icons/apple-touch-icon.png",
      "/icons/icon-192.png",
      "/icons/icon-512.png",
    ]) {
      const res = await request.get(`${ENV.BASE_URL}${path}`);
      expect(res.ok(), `${path} should be served`).toBe(true);
    }
  });

  test("apple-touch-icon is a real PNG", async ({ request }) => {
    const res = await request.get(`${ENV.BASE_URL}/icons/apple-touch-icon.png`);
    expect(res.ok()).toBe(true);
    expect(res.headers()["content-type"] ?? "").toContain("image/png");
  });
});

test.describe("PWA — document head + service worker", () => {
  test("required iOS meta tags + manifest/apple-touch-icon links are present", async ({ page }) => {
    await page.goto("/dashboard/work", { waitUntil: "domcontentloaded" });

    await expect(page.locator('link[rel="manifest"]')).toHaveAttribute(
      "href",
      "/manifest.webmanifest",
    );
    await expect(page.locator('link[rel="apple-touch-icon"]')).toHaveAttribute(
      "href",
      "/icons/apple-touch-icon.png",
    );
    await expect(page.locator('meta[name="apple-mobile-web-app-capable"]')).toHaveAttribute(
      "content",
      "yes",
    );
    await expect(
      page.locator('meta[name="apple-mobile-web-app-status-bar-style"]'),
    ).toHaveCount(1);
    await expect(page.locator('meta[name="apple-mobile-web-app-title"]')).toHaveCount(1);
    await expect(page.locator('meta[name="theme-color"]')).toHaveAttribute("content", "#09090b");
    // viewport-fit=cover so the app extends under the notch / home indicator.
    await expect(page.locator('meta[name="viewport"]')).toHaveAttribute(
      "content",
      /viewport-fit=cover/,
    );
  });

  test("service worker registers and controls the page", async ({ page }) => {
    await page.goto("/dashboard/work", { waitUntil: "domcontentloaded" });
    const scope = await page.evaluate(
      () =>
        new Promise<string | null>((resolve) => {
          if (!("serviceWorker" in navigator)) return resolve(null);
          navigator.serviceWorker.ready.then((r) => resolve(r.scope)).catch(() => resolve(null));
          setTimeout(() => resolve("timeout"), 15000);
        }),
    );
    expect(scope, "service worker should become ready").not.toBe("timeout");
    expect(scope).toContain(new URL(ENV.BASE_URL).origin);
  });
});
