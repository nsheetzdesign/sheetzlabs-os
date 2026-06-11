import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useLoaderData } from "react-router";
import { useState } from "react";
import { AlertTriangle, Check } from "lucide-react";
export async function loader({ params, context }) {
    const env = context.cloudflare.env;
    const apiUrl = env.INTERNAL_API_URL ?? "https://api.sheetzlabs.com";
    const response = await fetch(`${apiUrl}/booking/public/booking/${params.bookingId}`);
    if (!response.ok) {
        throw new Response("Booking not found", { status: 404 });
    }
    const data = (await response.json());
    return { booking: data.booking, apiUrl: env.API_URL ?? "https://api.sheetzlabs.com" };
}
export default function CancelBookingPage() {
    const { booking, apiUrl } = useLoaderData();
    const [cancelled, setCancelled] = useState(false);
    const [cancelling, setCancelling] = useState(false);
    const [error, setError] = useState(null);
    const handleCancel = async () => {
        setCancelling(true);
        setError(null);
        try {
            const response = await fetch(`${apiUrl}/booking/public/cancel/${booking.id}`, {
                method: "POST",
            });
            if (response.ok) {
                setCancelled(true);
            }
            else {
                const data = (await response.json().catch(() => ({})));
                setError(data.error || "Failed to cancel booking");
            }
        }
        catch {
            setError("Network error — please try again.");
        }
        finally {
            setCancelling(false);
        }
    };
    if (booking.status === "cancelled") {
        return (_jsx("div", { className: "min-h-screen bg-zinc-950 flex items-center justify-center p-4", children: _jsx("div", { className: "bg-zinc-900 border border-zinc-800 rounded-xl p-8 max-w-md w-full text-center", children: _jsx("p", { className: "text-zinc-400", children: "This booking has already been cancelled." }) }) }));
    }
    if (cancelled) {
        return (_jsx("div", { className: "min-h-screen bg-zinc-950 flex items-center justify-center p-4", children: _jsxs("div", { className: "bg-zinc-900 border border-zinc-800 rounded-xl p-8 max-w-md w-full text-center", children: [_jsx("div", { className: "w-16 h-16 bg-emerald-500/20 rounded-full flex items-center justify-center mx-auto mb-4", children: _jsx(Check, { className: "w-8 h-8 text-emerald-500" }) }), _jsx("h1", { className: "text-2xl font-semibold text-zinc-100 mb-2", children: "Booking Cancelled" }), _jsx("p", { className: "text-zinc-400", children: "Your booking has been cancelled. A confirmation email has been sent." })] }) }));
    }
    return (_jsx("div", { className: "min-h-screen bg-zinc-950 flex items-center justify-center p-4", children: _jsxs("div", { className: "bg-zinc-900 border border-zinc-800 rounded-xl p-8 max-w-md w-full", children: [_jsxs("div", { className: "text-center mb-6", children: [_jsx("div", { className: "w-16 h-16 bg-amber-500/20 rounded-full flex items-center justify-center mx-auto mb-4", children: _jsx(AlertTriangle, { className: "w-8 h-8 text-amber-500" }) }), _jsx("h1", { className: "text-2xl font-semibold text-zinc-100 mb-2", children: "Cancel Booking?" }), _jsx("p", { className: "text-zinc-400", children: "This action cannot be undone." })] }), _jsxs("div", { className: "bg-zinc-800 rounded-lg p-4 mb-6", children: [_jsx("h2", { className: "text-zinc-100 font-medium mb-2", children: booking.booking_links?.title }), _jsx("p", { className: "text-sm text-zinc-400", children: new Date(booking.scheduled_at).toLocaleDateString("en-US", {
                                weekday: "long",
                                month: "long",
                                day: "numeric",
                                year: "numeric",
                            }) }), _jsxs("p", { className: "text-sm text-zinc-400", children: [new Date(booking.scheduled_at).toLocaleTimeString("en-US", {
                                    hour: "numeric",
                                    minute: "2-digit",
                                }), " · ", booking.duration_minutes, " minutes"] })] }), error && _jsx("p", { className: "text-red-400 text-sm text-center mb-4", children: error }), _jsxs("div", { className: "flex gap-3", children: [_jsx("a", { href: "/", className: "flex-1 py-3 text-center text-zinc-400 hover:text-zinc-200 rounded-lg border border-zinc-700", children: "Keep Booking" }), _jsx("button", { onClick: handleCancel, disabled: cancelling, className: "flex-1 py-3 bg-red-600 hover:bg-red-500 rounded-lg text-white font-medium disabled:opacity-50", children: cancelling ? "Cancelling..." : "Yes, Cancel" })] })] }) }));
}
