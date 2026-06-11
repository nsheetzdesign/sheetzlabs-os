import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
import { useLoaderData, useFetcher } from "react-router";
import { useState, useEffect } from "react";
import { Calendar, Clock, Check, ArrowRight } from "lucide-react";
export const meta = () => [{ title: "Reschedule Meeting" }];
export async function loader({ params, context }) {
    const env = context.cloudflare.env;
    const apiUrl = env.INTERNAL_API_URL ?? "https://api.sheetzlabs.com";
    const res = await fetch(`${apiUrl}/booking/public/reschedule/${params.bookingId}`);
    if (!res.ok)
        throw new Response("Booking not found", { status: 404 });
    const data = (await res.json());
    return { booking: data.booking };
}
export async function action({ params, request, context }) {
    const env = context.cloudflare.env;
    const apiUrl = env.INTERNAL_API_URL ?? "https://api.sheetzlabs.com";
    const fd = await request.formData();
    const intent = fd.get("intent");
    if (intent === "get_slots") {
        const slug = fd.get("slug");
        const date = fd.get("date");
        const res = await fetch(`${apiUrl}/booking/public/${slug}/slots?date=${date}`);
        const data = (await res.json().catch(() => ({})));
        return { ...data, status: res.status };
    }
    if (intent === "reschedule") {
        const bookingId = params.bookingId;
        const scheduled_at = fd.get("scheduled_at");
        const timezone = fd.get("timezone");
        const res = await fetch(`${apiUrl}/booking/public/reschedule/${bookingId}`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ scheduled_at, timezone }),
        });
        const data = (await res.json().catch(() => ({})));
        return { ...data, status: res.status };
    }
    return null;
}
export default function ReschedulePage() {
    const { booking } = useLoaderData();
    const slotFetcher = useFetcher();
    const rescheduleFetcher = useFetcher();
    const [selectedDate, setSelectedDate] = useState(null);
    const [selectedTime, setSelectedTime] = useState(null);
    const [step, setStep] = useState("date");
    const [rescheduleError, setRescheduleError] = useState(null);
    // Surface 409/422/503 instead of silently reverting the button (BK-8)
    useEffect(() => {
        const d = rescheduleFetcher.data;
        if (!d || d.success)
            return;
        if (d.status === 409) {
            setRescheduleError("That time was just taken — please pick another slot.");
            if (selectedDate) {
                slotFetcher.submit({ intent: "get_slots", slug: booking.booking_links.slug, date: selectedDate }, { method: "post" });
            }
            setSelectedTime(null);
        }
        else if (d.status === 422) {
            setRescheduleError("That time is no longer valid. Please pick another slot.");
        }
        else if (d.status === 503) {
            setRescheduleError("Availability is temporarily unavailable. Please try again in a moment.");
        }
        else if (d.status && d.status >= 400) {
            setRescheduleError("Something went wrong rescheduling. Please try again.");
        }
    }, [rescheduleFetcher.data]); // eslint-disable-line react-hooks/exhaustive-deps
    const bookingLink = booking.booking_links;
    const currentDate = new Date(booking.scheduled_at);
    const dateRangeDays = bookingLink.availability_rules?.date_range_days ?? 14;
    const availableDates = Array.from({ length: dateRangeDays }, (_, i) => {
        const date = new Date();
        date.setDate(date.getDate() + i + 1); // start tomorrow
        return date.toISOString().split("T")[0];
    });
    function handleDateSelect(date) {
        setSelectedDate(date);
        setSelectedTime(null);
        setStep("time");
        slotFetcher.submit({ intent: "get_slots", slug: bookingLink.slug, date }, { method: "post" });
    }
    function handleReschedule() {
        if (!selectedTime)
            return;
        rescheduleFetcher.submit({
            intent: "reschedule",
            scheduled_at: selectedTime,
            timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
        }, { method: "post" });
    }
    const confirmed = rescheduleFetcher.data?.success === true;
    if (confirmed) {
        return (_jsx("div", { className: "min-h-screen bg-zinc-950 flex items-center justify-center p-4", children: _jsxs("div", { className: "bg-zinc-900 border border-zinc-800 rounded-xl p-8 max-w-md w-full text-center", children: [_jsx("div", { className: "w-16 h-16 bg-emerald-500/20 rounded-full flex items-center justify-center mx-auto mb-4", children: _jsx(Check, { className: "w-8 h-8 text-emerald-500" }) }), _jsx("h1", { className: "text-2xl font-semibold text-zinc-100 mb-2", children: "Rescheduled!" }), _jsx("p", { className: "text-zinc-400 mb-4", children: "Your meeting has been moved to a new time." }), _jsxs("div", { className: "bg-zinc-800 rounded-lg p-4 text-left", children: [_jsx("p", { className: "text-zinc-300", children: new Date(selectedTime).toLocaleDateString("en-US", {
                                    weekday: "long",
                                    month: "long",
                                    day: "numeric",
                                    year: "numeric",
                                }) }), _jsxs("p", { className: "text-zinc-400", children: [new Date(selectedTime).toLocaleTimeString("en-US", {
                                        hour: "numeric",
                                        minute: "2-digit",
                                    }), " · ", booking.duration_minutes, " minutes"] })] }), _jsx("p", { className: "text-sm text-zinc-500 mt-4", children: "Your calendar invitation has been updated." })] }) }));
    }
    return (_jsx("div", { className: "min-h-screen bg-zinc-950 flex items-center justify-center p-4", children: _jsx("div", { className: "bg-zinc-900 border border-zinc-800 rounded-xl overflow-hidden max-w-4xl w-full", children: _jsxs("div", { className: "grid md:grid-cols-2", children: [_jsxs("div", { className: "p-8 border-b md:border-b-0 md:border-r border-zinc-800", children: [_jsx("h1", { className: "text-2xl font-semibold text-zinc-100 mb-1", children: "Reschedule" }), _jsx("p", { className: "text-zinc-400 mb-6", children: bookingLink.title }), _jsxs("div", { className: "bg-zinc-800 rounded-lg p-4 mb-4", children: [_jsx("p", { className: "text-zinc-500 text-xs mb-2", children: "Current time:" }), _jsxs("div", { className: "flex items-center gap-2 text-zinc-300", children: [_jsx(Calendar, { className: "w-4 h-4" }), _jsx("span", { children: currentDate.toLocaleDateString("en-US", {
                                                    weekday: "short",
                                                    month: "short",
                                                    day: "numeric",
                                                }) })] }), _jsxs("div", { className: "flex items-center gap-2 text-zinc-300 mt-1", children: [_jsx(Clock, { className: "w-4 h-4" }), _jsx("span", { children: currentDate.toLocaleTimeString("en-US", {
                                                    hour: "numeric",
                                                    minute: "2-digit",
                                                }) })] })] }), _jsxs("div", { className: "flex items-center gap-2 text-zinc-500", children: [_jsx(ArrowRight, { className: "w-4 h-4" }), _jsx("span", { className: "text-sm", children: "Select a new time on the right" })] })] }), _jsxs("div", { className: "p-8", children: [step === "date" && (_jsxs(_Fragment, { children: [_jsx("h2", { className: "text-lg font-medium text-zinc-100 mb-4", children: "Select a New Date" }), _jsx("div", { className: "grid grid-cols-3 gap-2 max-h-64 overflow-y-auto pr-1", children: availableDates.map((date) => (_jsxs("button", { onClick: () => handleDateSelect(date), className: `p-3 rounded-lg text-sm transition-colors ${selectedDate === date
                                                ? "bg-emerald-600 text-white"
                                                : "bg-zinc-800 text-zinc-300 hover:bg-zinc-700"}`, children: [_jsx("div", { className: "font-medium", children: new Date(date + "T12:00:00").toLocaleDateString("en-US", { weekday: "short" }) }), _jsx("div", { children: new Date(date + "T12:00:00").toLocaleDateString("en-US", {
                                                        month: "short",
                                                        day: "numeric",
                                                    }) })] }, date))) })] })), step === "time" && (_jsxs(_Fragment, { children: [_jsxs("div", { className: "flex items-center justify-between mb-4", children: [_jsx("h2", { className: "text-lg font-medium text-zinc-100", children: "Select a New Time" }), _jsx("button", { onClick: () => { setStep("date"); setSelectedTime(null); }, className: "text-sm text-zinc-400 hover:text-zinc-200", children: "\u2190 Change date" })] }), rescheduleError && (_jsx("p", { className: "text-sm text-amber-400 mb-3", children: rescheduleError })), slotFetcher.state === "submitting" ? (_jsx("p", { className: "text-zinc-400 text-sm", children: "Loading available times\u2026" })) : slotFetcher.data?.status === 503 ? (_jsx("p", { className: "text-amber-400 text-sm", children: "Availability is temporarily unavailable. Please try again shortly." })) : !slotFetcher.data?.slots?.length ? (_jsx("p", { className: "text-zinc-400 text-sm", children: "No available times on this date." })) : (_jsxs(_Fragment, { children: [_jsx("div", { className: "grid grid-cols-2 gap-2 max-h-48 overflow-y-auto mb-4 pr-1", children: slotFetcher.data.slots.map((slot) => (_jsx("button", { onClick: () => setSelectedTime(slot), className: `p-3 rounded-lg text-sm transition-colors ${selectedTime === slot
                                                        ? "bg-emerald-600 text-white"
                                                        : "bg-zinc-800 text-zinc-300 hover:bg-zinc-700"}`, children: new Date(slot).toLocaleTimeString("en-US", {
                                                        hour: "numeric",
                                                        minute: "2-digit",
                                                    }) }, slot))) }), selectedTime && (_jsx("button", { onClick: handleReschedule, disabled: rescheduleFetcher.state !== "idle", className: "w-full py-3 bg-emerald-600 hover:bg-emerald-500 rounded-lg text-white font-medium disabled:opacity-50", children: rescheduleFetcher.state !== "idle" ? "Rescheduling…" : "Confirm New Time" }))] }))] }))] })] }) }) }));
}
