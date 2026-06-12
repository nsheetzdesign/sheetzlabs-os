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
];

export function Layout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
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
