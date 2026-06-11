import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useLoaderData, useFetcher, Link } from "react-router";
import { useState } from "react";
import { Calendar, Clock, User, Video, X, ChevronDown } from "lucide-react";
import { apiFetch } from "~/lib/api";
export const meta = () => [{ title: "Bookings — Sheetz Labs OS" }];
export async function loader({ request, context }) {
    const env = context.cloudflare.env;
    const res = await apiFetch(request, env, `/booking/bookings`);
    const data = (await res.json());
    return { bookings: data.bookings ?? [] };
}
export async function action({ request, context }) {
    const env = context.cloudflare.env;
    const fd = await request.formData();
    const intent = fd.get("intent");
    const bookingId = fd.get("bookingId");
    if (intent === "cancel" && bookingId) {
        await apiFetch(request, env, `/booking/bookings/${bookingId}`, { method: "DELETE" });
    }
    return null;
}
function BookingCard({ booking, onCancel, showCancel, }) {
    const [expanded, setExpanded] = useState(false);
    const date = new Date(booking.scheduled_at);
    return (_jsxs("div", { className: "bg-zinc-900 border border-zinc-800 rounded-lg overflow-hidden", children: [_jsx("div", { className: "p-4 cursor-pointer hover:bg-zinc-800/50 transition-colors", onClick: () => setExpanded(!expanded), children: _jsxs("div", { className: "flex items-start justify-between", children: [_jsxs("div", { className: "flex-1 min-w-0", children: [_jsx("h3", { className: "text-zinc-100 font-medium truncate", children: booking.booking_links?.title || "Meeting" }), _jsxs("div", { className: "flex items-center gap-4 mt-2 text-sm text-zinc-400 flex-wrap", children: [_jsxs("span", { className: "flex items-center gap-1", children: [_jsx(User, { className: "w-3.5 h-3.5" }), booking.guest_name] }), _jsxs("span", { className: "flex items-center gap-1", children: [_jsx(Calendar, { className: "w-3.5 h-3.5" }), date.toLocaleDateString("en-US", { month: "short", day: "numeric" })] }), _jsxs("span", { className: "flex items-center gap-1", children: [_jsx(Clock, { className: "w-3.5 h-3.5" }), date.toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit" })] })] })] }), _jsxs("div", { className: "flex items-center gap-2 shrink-0", children: [booking.meet_link && (_jsx("a", { href: booking.meet_link, target: "_blank", rel: "noopener noreferrer", onClick: (e) => e.stopPropagation(), className: "p-2 text-emerald-400 hover:text-emerald-300 hover:bg-zinc-800 rounded", title: "Join Google Meet", children: _jsx(Video, { className: "w-4 h-4" }) })), _jsx(ChevronDown, { className: `w-4 h-4 text-zinc-500 transition-transform ${expanded ? "rotate-180" : ""}` })] })] }) }), expanded && (_jsxs("div", { className: "px-4 pb-4 border-t border-zinc-800 pt-4 space-y-4", children: [_jsxs("div", { className: "grid grid-cols-2 gap-4 text-sm", children: [_jsxs("div", { children: [_jsx("p", { className: "text-zinc-500 mb-1", children: "Guest" }), _jsx("p", { className: "text-zinc-200", children: booking.guest_name }), _jsx("a", { href: `mailto:${booking.guest_email}`, className: "text-emerald-400 hover:text-emerald-300 text-xs", children: booking.guest_email })] }), _jsxs("div", { children: [_jsx("p", { className: "text-zinc-500 mb-1", children: "Duration" }), _jsxs("p", { className: "text-zinc-200", children: [booking.duration_minutes, " minutes"] })] }), _jsxs("div", { children: [_jsx("p", { className: "text-zinc-500 mb-1", children: "Timezone" }), _jsx("p", { className: "text-zinc-200 text-xs", children: booking.timezone })] }), _jsxs("div", { children: [_jsx("p", { className: "text-zinc-500 mb-1", children: "Status" }), _jsx("p", { className: booking.status === "confirmed" ? "text-emerald-400" : "text-red-400", children: booking.status.charAt(0).toUpperCase() + booking.status.slice(1) })] })] }), booking.guest_notes && (_jsxs("div", { children: [_jsx("p", { className: "text-zinc-500 text-sm mb-1", children: "Notes" }), _jsx("p", { className: "text-zinc-300 text-sm bg-zinc-800 p-3 rounded", children: booking.guest_notes })] })), booking.meet_link && (_jsxs("a", { href: booking.meet_link, target: "_blank", rel: "noopener noreferrer", className: "flex items-center justify-center gap-2 w-full py-2 bg-emerald-600 hover:bg-emerald-500 rounded-lg text-sm text-white", children: [_jsx(Video, { className: "w-4 h-4" }), "Join Google Meet"] })), showCancel && (_jsxs("button", { onClick: (e) => {
                            e.stopPropagation();
                            onCancel();
                        }, className: "flex items-center justify-center gap-2 w-full py-2 border border-red-500/50 text-red-400 hover:bg-red-500/10 rounded-lg text-sm", children: [_jsx(X, { className: "w-4 h-4" }), "Cancel Booking"] }))] }))] }));
}
export default function BookingsPage() {
    const { bookings } = useLoaderData();
    const fetcher = useFetcher();
    const [filter, setFilter] = useState("upcoming");
    const now = new Date();
    const filteredBookings = bookings.filter((booking) => {
        const bookingDate = new Date(booking.scheduled_at);
        if (filter === "upcoming")
            return booking.status === "confirmed" && bookingDate > now;
        if (filter === "past")
            return booking.status === "confirmed" && bookingDate <= now;
        return booking.status === "cancelled";
    });
    function handleCancel(bookingId) {
        if (confirm("Are you sure you want to cancel this booking?")) {
            fetcher.submit({ intent: "cancel", bookingId }, { method: "post" });
        }
    }
    return (_jsxs("div", { className: "p-6 max-w-3xl", children: [_jsxs("div", { className: "flex items-center justify-between mb-6", children: [_jsxs("div", { children: [_jsx("h1", { className: "text-lg font-semibold text-zinc-100", children: "Bookings" }), _jsx("p", { className: "text-xs text-zinc-500 mt-0.5", children: "Manage your scheduled meetings" })] }), _jsx(Link, { to: "/dashboard/calendar/booking-links", className: "text-sm text-emerald-400 hover:text-emerald-300", children: "Booking links \u2192" })] }), _jsx("div", { className: "flex gap-1 mb-6 bg-zinc-900 p-1 rounded-lg w-fit", children: ["upcoming", "past", "cancelled"].map((tab) => (_jsx("button", { onClick: () => setFilter(tab), className: `px-4 py-1.5 text-sm rounded-md transition-colors ${filter === tab ? "bg-zinc-800 text-zinc-100" : "text-zinc-400 hover:text-zinc-200"}`, children: tab.charAt(0).toUpperCase() + tab.slice(1) }, tab))) }), filteredBookings.length === 0 ? (_jsx("div", { className: "text-center py-12 border border-zinc-800 rounded-xl", children: _jsxs("p", { className: "text-zinc-400", children: [filter === "upcoming" && "No upcoming bookings", filter === "past" && "No past bookings", filter === "cancelled" && "No cancelled bookings"] }) })) : (_jsx("div", { className: "space-y-3", children: filteredBookings.map((booking) => (_jsx(BookingCard, { booking: booking, onCancel: () => handleCancel(booking.id), showCancel: filter === "upcoming" }, booking.id))) }))] }));
}
