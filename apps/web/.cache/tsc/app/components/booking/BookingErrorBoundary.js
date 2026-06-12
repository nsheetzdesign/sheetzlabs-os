import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { isRouteErrorResponse, useRouteError } from "react-router";
/**
 * Guest-facing error boundary for the public /book* routes (BK-16). An invalid
 * slug/UUID throws a Response(404) that must never show an external guest the
 * unstyled React Router default. Copy is intentionally guest-appropriate.
 */
export function BookingErrorBoundary() {
    const error = useRouteError();
    const status = isRouteErrorResponse(error) ? error.status : 500;
    const notFound = status === 404;
    return (_jsx("div", { className: "min-h-screen bg-zinc-950 flex items-center justify-center p-4", children: _jsxs("div", { className: "bg-zinc-900 border border-zinc-800 rounded-xl p-8 max-w-md w-full text-center", children: [_jsx("h1", { className: "text-2xl font-semibold text-zinc-100 mb-2", children: notFound ? "This booking link isn’t available" : "Something went wrong" }), _jsx("p", { className: "text-zinc-400", children: notFound
                        ? "The link may be incorrect or no longer active. Please check with whoever shared it."
                        : "We couldn’t load this page. Please try again in a moment." })] }) }));
}
