import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { Links, Meta, Outlet, Scripts, ScrollRestoration, isRouteErrorResponse, useRouteError, } from "react-router";
import appCss from "./app.css?url";
export const links = () => [
    { rel: "stylesheet", href: appCss },
];
export function Layout({ children }) {
    return (_jsxs("html", { lang: "en", children: [_jsxs("head", { children: [_jsx("meta", { charSet: "utf-8" }), _jsx("meta", { name: "viewport", content: "width=device-width, initial-scale=1" }), _jsx(Meta, {}), _jsx(Links, {})] }), _jsxs("body", { className: "bg-surface-0 text-white antialiased", children: [children, _jsx(ScrollRestoration, {}), _jsx(Scripts, {})] })] }));
}
export default function App() {
    return _jsx(Outlet, {});
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
    const message = isResponse && status === 404
        ? "The page you’re looking for doesn’t exist or has moved."
        : "An unexpected error occurred. Please try again.";
    return (_jsx("div", { className: "min-h-screen flex items-center justify-center bg-surface-0 p-4", children: _jsxs("div", { className: "w-full max-w-md rounded-xl border border-zinc-800 bg-zinc-900 p-8 text-center", children: [_jsx("div", { className: "text-3xl font-semibold text-zinc-100 mb-2", children: status }), _jsx("h1", { className: "text-lg font-medium text-zinc-200 mb-2", children: title }), _jsx("p", { className: "text-sm text-zinc-400 mb-6", children: message }), _jsx("a", { href: "/", className: "inline-block rounded-lg bg-emerald-600 px-4 py-2 text-sm font-medium text-white hover:bg-emerald-500 transition-colors", children: "Go home" })] }) }));
}
