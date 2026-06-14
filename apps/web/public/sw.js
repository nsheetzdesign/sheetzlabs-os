/*
 * Sheetz Labs OS — service worker (Prompt 69, Tier 1: shell caching only).
 *
 * DESIGN — conservative on purpose. Stale mail/calendar/task data is worse than
 * a spinner, so this SW NEVER caches data:
 *
 *   • API / auth / actions → not intercepted at all (pass straight to network).
 *     The web app's data calls go to api.sheetzlabs.com (cross-origin, never
 *     touched here) or the same-origin `/api/*` proxy (explicitly skipped).
 *   • Navigations (SSR HTML) → network-FIRST, response NOT cached. The document
 *     is always fresh, so a deploy's new asset hashes are always referenced — the
 *     #1 PWA footgun (stale app code) can't happen. On network failure we fall
 *     back to a static offline shell, not stale data.
 *   • Hashed build assets (`/assets/*`, immutable) + icons/manifest/favicon →
 *     stale-while-revalidate. Safe because filenames are content-hashed.
 *
 * Update flow: skipWaiting + clientsClaim so a new SW takes over promptly; the
 * client (root.tsx) reloads only on an UPDATE (a controller already existed), so
 * there's no jarring first-visit reload. Old caches are purged on activate.
 *
 * Bump CACHE_VERSION on any change to this file or the precache list.
 */
const CACHE_VERSION = "v1";
const SHELL_CACHE = `slos-shell-${CACHE_VERSION}`;
const ASSET_CACHE = `slos-assets-${CACHE_VERSION}`;
const OFFLINE_URL = "/offline.html";

// Minimal precache: the offline shell + install-surface icons. Hashed JS/CSS is
// cached lazily on first use (its names aren't known at SW-author time).
const PRECACHE = [
  OFFLINE_URL,
  "/manifest.webmanifest",
  "/favicon.png",
  "/icons/apple-touch-icon.png",
  "/icons/icon-192.png",
  "/icons/icon-512.png",
];

self.addEventListener("install", (event) => {
  event.waitUntil(
    caches
      .open(SHELL_CACHE)
      .then((cache) => cache.addAll(PRECACHE))
      .then(() => self.skipWaiting())
      .catch(() => self.skipWaiting()),
  );
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches
      .keys()
      .then((keys) =>
        Promise.all(
          keys
            .filter((k) => k !== SHELL_CACHE && k !== ASSET_CACHE)
            .map((k) => caches.delete(k)),
        ),
      )
      .then(() => self.clients.claim()),
  );
});

// Same-origin paths that must NEVER be served from cache — data + auth.
function isNeverCache(url) {
  return (
    url.pathname.startsWith("/api/") ||
    url.pathname.startsWith("/auth/") ||
    url.pathname === "/sw.js"
  );
}

// Immutable, content-hashed or static assets safe to cache.
function isCacheableAsset(url) {
  return (
    url.pathname.startsWith("/assets/") ||
    url.pathname.startsWith("/icons/") ||
    url.pathname === "/manifest.webmanifest" ||
    url.pathname === "/favicon.svg" ||
    /\.(?:js|css|woff2?|ttf|otf|png|jpg|jpeg|gif|svg|webp|ico)$/.test(url.pathname)
  );
}

self.addEventListener("fetch", (event) => {
  const { request } = event;

  // Only ever touch same-origin GETs. Cross-origin (api.sheetzlabs.com, Google
  // Fonts) and non-GET (POST actions) fall through to the network untouched.
  if (request.method !== "GET") return;
  const url = new URL(request.url);
  if (url.origin !== self.location.origin) return;
  if (isNeverCache(url)) return;

  // Navigations: network-first, never cached; offline shell on failure.
  if (request.mode === "navigate") {
    event.respondWith(
      fetch(request).catch(() =>
        caches.match(OFFLINE_URL, { cacheName: SHELL_CACHE }).then(
          (r) => r ?? new Response("Offline", { status: 503, statusText: "Offline" }),
        ),
      ),
    );
    return;
  }

  // Static assets: stale-while-revalidate.
  if (isCacheableAsset(url)) {
    event.respondWith(
      caches.open(ASSET_CACHE).then((cache) =>
        cache.match(request).then((cached) => {
          const network = fetch(request)
            .then((res) => {
              if (res && res.ok) cache.put(request, res.clone());
              return res;
            })
            .catch(() => cached);
          return cached || network;
        }),
      ),
    );
    return;
  }

  // Anything else same-origin: network-only (don't risk serving stale).
});
