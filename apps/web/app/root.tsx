import { useEffect } from "react";
import {
  Links,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
  isRouteErrorResponse,
  useRouteError,
} from "react-router";
import type { LinksFunction } from "react-router";
import appCss from "./app.css?url";

export const links: LinksFunction = () => [
  { rel: "stylesheet", href: appCss },
  // PWA: manifest + iOS home-screen icon (iOS ignores manifest icons for A2HS).
  { rel: "manifest", href: "/manifest.webmanifest" },
  { rel: "apple-touch-icon", href: "/icons/apple-touch-icon.png" },
  { rel: "icon", href: "/favicon.svg", type: "image/svg+xml" },
];

export function Layout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <meta charSet="utf-8" />
        {/* viewport-fit=cover → the app uses the full screen under the notch /
            home indicator on iPad; safe-area insets (app.css) keep chrome clear. */}
        <meta
          name="viewport"
          content="width=device-width, initial-scale=1, viewport-fit=cover"
        />
        {/* Matches the app surface (zinc-950) so the iOS status bar / PWA splash
            chrome blends seamlessly rather than flashing a light bar. */}
        <meta name="theme-color" content="#09090b" />
        {/* iOS Safari ignores most of the manifest — these give the native-feel
            install: full-screen (no Safari chrome), translucent status bar drawn
            over our dark surface (we pad with env(safe-area-inset-top)), and the
            home-screen title. */}
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />
        <meta name="apple-mobile-web-app-title" content="SL OS" />
        <Meta />
        <Links />
      </head>
      <body className="bg-surface-0 text-white antialiased">
        {children}
        <ScrollRestoration />
        <Scripts />
      </body>
    </html>
  );
}

export default function App() {
  // Register the shell service worker (client-only). The SW caches static assets
  // and an offline fallback but never API/auth/data — see public/sw.js. We reload
  // only when an UPDATE activates (a controller already existed), so deploys pick
  // up fresh app code without a jarring first-visit reload.
  useEffect(() => {
    if (typeof navigator === "undefined" || !("serviceWorker" in navigator)) return;
    const onControllerChange = () => {
      if (sessionStorage.getItem("sw-reloaded")) return;
      sessionStorage.setItem("sw-reloaded", "1");
      window.location.reload();
    };
    navigator.serviceWorker
      .register("/sw.js")
      .then((reg) => {
        reg.addEventListener("updatefound", () => {
          const installing = reg.installing;
          if (!installing) return;
          installing.addEventListener("statechange", () => {
            // New SW installed AND a controller was already in place → an update.
            if (installing.state === "installed" && navigator.serviceWorker.controller) {
              navigator.serviceWorker.addEventListener("controllerchange", onControllerChange);
            }
          });
        });
      })
      .catch(() => {
        /* SW is a progressive enhancement — ignore registration failures. */
      });
  }, []);

  return <Outlet />;
}

/**
 * Top-level styled error boundary (BK-16). Without this, any thrown Response /
 * render error — including an invalid /book/:slug for an external guest — falls
 * through to React Router's unstyled default screen. Public /book* routes export
 * their own guest-appropriate boundaries that take precedence.
 */
export function ErrorBoundary() {
  const error = useRouteError();
  const isResponse = isRouteErrorResponse(error);
  const status = isResponse ? error.status : 500;
  const title = isResponse && status === 404 ? "Page not found" : "Something went wrong";
  const message =
    isResponse && status === 404
      ? "The page you’re looking for doesn’t exist or has moved."
      : "An unexpected error occurred. Please try again.";

  return (
    <div className="min-h-screen flex items-center justify-center bg-surface-0 p-4">
      <div className="w-full max-w-md rounded-xl border border-zinc-800 bg-zinc-900 p-8 text-center">
        <div className="text-3xl font-semibold text-zinc-100 mb-2">{status}</div>
        <h1 className="text-lg font-medium text-zinc-200 mb-2">{title}</h1>
        <p className="text-sm text-zinc-400 mb-6">{message}</p>
        <a
          href="/"
          className="inline-block rounded-lg bg-emerald-600 px-4 py-2 text-sm font-medium text-white hover:bg-emerald-500 transition-colors"
        >
          Go home
        </a>
      </div>
    </div>
  );
}
