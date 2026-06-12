import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
import { useLoaderData, useFetcher } from "react-router";
import { useState, useEffect } from "react";
import { Clock, User, Mail, MessageSquare, Check, ChevronLeft } from "lucide-react";
export { BookingErrorBoundary as ErrorBoundary } from "~/components/booking/BookingErrorBoundary";
export const meta = ({ data }) => [
    { title: data ? `Book: ${data.link.title}` : "Book a Meeting" },
];
export async function loader({ params, context }) {
    const env = context.cloudflare.env;
    const apiUrl = env.INTERNAL_API_URL ?? "https://api.sheetzlabs.com";
    const res = await fetch(`${apiUrl}/booking/public/${params.slug}`);
    if (!res.ok)
        throw new Response("Booking link not found", { status: 404 });
    const data = (await res.json());
    return { link: data.link, apiUrl: env.API_URL ?? "https://api.sheetzlabs.com" };
}
export async function action({ params, request, context }) {
    const env = context.cloudflare.env;
    const apiUrl = env.INTERNAL_API_URL ?? "https://api.sheetzlabs.com";
    const fd = await request.formData();
    const intent = fd.get("intent");
    if (intent === "get_slots") {
        const date = fd.get("date");
        const res = await fetch(`${apiUrl}/booking/public/${params.slug}/slots?date=${date}`);
        const data = (await res.json().catch(() => ({})));
        return { ...data, status: res.status };
    }
    if (intent === "book") {
        const res = await fetch(`${apiUrl}/booking/public/${params.slug}`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                guest_name: fd.get("guest_name"),
                guest_email: fd.get("guest_email"),
                guest_notes: fd.get("guest_notes") || undefined,
                scheduled_at: fd.get("scheduled_at"),
                timezone: fd.get("timezone"),
            }),
        });
        const data = (await res.json().catch(() => ({})));
        return { ...data, status: res.status };
    }
    return null;
}
export default function BookingPage() {
    const { link } = useLoaderData();
    const slotFetcher = useFetcher();
    const bookFetcher = useFetcher();
    const [step, setStep] = useState("date");
    const [selectedDate, setSelectedDate] = useState(null);
    const [selectedTime, setSelectedTime] = useState(null);
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [notes, setNotes] = useState("");
    const [bookError, setBookError] = useState(null);
    function refetchSlots(date) {
        const fd = new FormData();
        fd.set("intent", "get_slots");
        fd.set("date", date);
        slotFetcher.submit(fd, { method: "post" });
    }
    const rules = link.availability_rules;
    const dateRangeDays = rules.date_range_days ?? 14;
    // Generate available dates (skip days with no rules enabled)
    const availableDates = Array.from({ length: dateRangeDays }, (_, i) => {
        const d = new Date();
        d.setDate(d.getDate() + i);
        return d.toISOString().split("T")[0];
    }).filter((date) => {
        const dayName = new Date(date + "T12:00:00").toLocaleDateString("en-US", { weekday: "long" }).toLowerCase();
        return rules.days?.[dayName]?.enabled ?? true;
    });
    // Fetch slots when date is selected
    useEffect(() => {
        if (!selectedDate)
            return;
        const fd = new FormData();
        fd.set("intent", "get_slots");
        fd.set("date", selectedDate);
        slotFetcher.submit(fd, { method: "post" });
        setStep("time");
    }, [selectedDate]); // eslint-disable-line react-hooks/exhaustive-deps
    // Handle booking result — surface 409/422/503 instead of silently failing (BK-8)
    useEffect(() => {
        const d = bookFetcher.data;
        if (!d)
            return;
        if (d.success) {
            setBookError(null);
            setStep("confirmed");
            return;
        }
        if (d.status === 409) {
            setBookError("That time was just taken — please pick another slot.");
            setStep("time");
            if (selectedDate)
                refetchSlots(selectedDate);
        }
        else if (d.status === 422) {
            setBookError("Please double-check your name and email, then try again.");
        }
        else if (d.status === 503) {
            setBookError("Availability is temporarily unavailable. Please try again in a moment.");
        }
        else if (d.status && d.status >= 400) {
            setBookError("Something went wrong confirming your booking. Please try again.");
        }
    }, [bookFetcher.data]); // eslint-disable-line react-hooks/exhaustive-deps
    function handleBook() {
        if (!selectedTime || !name || !email)
            return;
        const fd = new FormData();
        fd.set("intent", "book");
        fd.set("guest_name", name);
        fd.set("guest_email", email);
        fd.set("guest_notes", notes);
        fd.set("scheduled_at", selectedTime);
        fd.set("timezone", Intl.DateTimeFormat().resolvedOptions().timeZone);
        bookFetcher.submit(fd, { method: "post" });
    }
    const slots = slotFetcher.data?.slots ?? [];
    const isLoadingSlots = slotFetcher.state === "submitting";
    const isBooking = bookFetcher.state === "submitting";
    if (step === "confirmed" && selectedTime) {
        return (_jsx("div", { className: "min-h-screen bg-zinc-950 flex items-center justify-center p-4", children: _jsxs("div", { className: "bg-zinc-900 border border-zinc-800 rounded-xl p-8 max-w-md w-full text-center", children: [_jsx("div", { className: "w-16 h-16 bg-emerald-500/20 rounded-full flex items-center justify-center mx-auto mb-4", children: _jsx(Check, { className: "w-8 h-8 text-emerald-500" }) }), _jsx("h1", { className: "text-2xl font-semibold text-zinc-100 mb-2", children: "Booking Confirmed!" }), _jsxs("p", { className: "text-zinc-400 mb-6", children: ["You're scheduled for ", link.title] }), _jsxs("div", { className: "bg-zinc-800 rounded-lg p-4 text-left space-y-1", children: [_jsx("p", { className: "text-zinc-200 font-medium", children: new Date(selectedTime).toLocaleDateString("en-US", {
                                    weekday: "long", month: "long", day: "numeric", year: "numeric",
                                }) }), _jsxs("p", { className: "text-zinc-400 text-sm", children: [new Date(selectedTime).toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit" }), " · ", link.duration_minutes, " minutes"] })] }), _jsxs("p", { className: "text-sm text-zinc-500 mt-4", children: ["A calendar invitation has been sent to ", email] })] }) }));
    }
    return (_jsx("div", { className: "min-h-screen bg-zinc-950 flex items-center justify-center p-4", children: _jsx("div", { className: "bg-zinc-900 border border-zinc-800 rounded-xl overflow-hidden max-w-3xl w-full", children: _jsxs("div", { className: "grid md:grid-cols-5", children: [_jsxs("div", { className: "md:col-span-2 p-8 border-b md:border-b-0 md:border-r border-zinc-800", children: [_jsx("div", { className: "w-10 h-10 rounded-full bg-emerald-500/20 flex items-center justify-center mb-4", children: _jsx(Clock, { className: "w-5 h-5 text-emerald-400" }) }), _jsx("h1", { className: "text-xl font-semibold text-zinc-100 mb-1", children: link.title }), _jsxs("div", { className: "flex items-center gap-1.5 text-zinc-400 text-sm mb-3", children: [_jsx(Clock, { className: "w-3.5 h-3.5" }), _jsxs("span", { children: [link.duration_minutes, " minutes"] })] }), link.description && (_jsx("p", { className: "text-zinc-400 text-sm leading-relaxed", children: link.description }))] }), _jsxs("div", { className: "md:col-span-3 p-8", children: [step === "date" && (_jsxs(_Fragment, { children: [_jsx("h2", { className: "text-base font-medium text-zinc-100 mb-4", children: "Select a Date" }), _jsx("div", { className: "grid grid-cols-3 gap-2 max-h-72 overflow-y-auto pr-1", children: availableDates.map((date) => {
                                            const d = new Date(date + "T12:00:00");
                                            return (_jsxs("button", { onClick: () => setSelectedDate(date), className: `p-3 rounded-lg text-sm transition-colors text-center ${selectedDate === date
                                                    ? "bg-emerald-600 text-white"
                                                    : "bg-zinc-800 text-zinc-300 hover:bg-zinc-700"}`, children: [_jsx("div", { className: "font-medium text-xs", children: d.toLocaleDateString("en-US", { weekday: "short" }) }), _jsx("div", { className: "text-sm", children: d.toLocaleDateString("en-US", { month: "short", day: "numeric" }) })] }, date));
                                        }) })] })), step === "time" && (_jsxs(_Fragment, { children: [_jsxs("div", { className: "flex items-center justify-between mb-4", children: [_jsx("h2", { className: "text-base font-medium text-zinc-100", children: "Select a Time" }), _jsxs("button", { onClick: () => { setStep("date"); setSelectedTime(null); }, className: "flex items-center gap-1 text-sm text-zinc-400 hover:text-zinc-200", children: [_jsx(ChevronLeft, { className: "w-3.5 h-3.5" }), " Change date"] })] }), selectedDate && (_jsx("p", { className: "text-sm text-zinc-500 mb-3", children: new Date(selectedDate + "T12:00:00").toLocaleDateString("en-US", {
                                            weekday: "long", month: "long", day: "numeric",
                                        }) })), bookError && (_jsx("p", { className: "text-sm text-amber-400 mb-3", children: bookError })), isLoadingSlots ? (_jsx("p", { className: "text-zinc-500 text-sm", children: "Loading available times\u2026" })) : slotFetcher.data?.status === 503 ? (_jsx("p", { className: "text-amber-400 text-sm", children: "Availability is temporarily unavailable. Please try again shortly." })) : slots.length === 0 ? (_jsx("p", { className: "text-zinc-500 text-sm", children: "No available times on this date." })) : (_jsx("div", { className: "grid grid-cols-2 gap-2 max-h-64 overflow-y-auto pr-1", children: slots.map((slot) => (_jsx("button", { onClick: () => { setSelectedTime(slot); setStep("details"); }, className: "p-3 bg-zinc-800 hover:bg-zinc-700 rounded-lg text-sm text-zinc-200 transition-colors", children: new Date(slot).toLocaleTimeString("en-US", {
                                                hour: "numeric", minute: "2-digit",
                                            }) }, slot))) }))] })), step === "details" && selectedTime && (_jsxs(_Fragment, { children: [_jsxs("div", { className: "flex items-center justify-between mb-4", children: [_jsx("h2", { className: "text-base font-medium text-zinc-100", children: "Your Details" }), _jsxs("button", { onClick: () => setStep("time"), className: "flex items-center gap-1 text-sm text-zinc-400 hover:text-zinc-200", children: [_jsx(ChevronLeft, { className: "w-3.5 h-3.5" }), " Change time"] })] }), _jsxs("div", { className: "bg-zinc-800 rounded-lg p-3 mb-5 text-sm", children: [_jsx("p", { className: "text-zinc-200 font-medium", children: new Date(selectedTime).toLocaleDateString("en-US", {
                                                    weekday: "long", month: "long", day: "numeric",
                                                }) }), _jsxs("p", { className: "text-zinc-400 text-xs mt-0.5", children: [new Date(selectedTime).toLocaleTimeString("en-US", {
                                                        hour: "numeric", minute: "2-digit",
                                                    }), " · ", link.duration_minutes, " min"] })] }), _jsxs("div", { className: "space-y-4", children: [_jsxs("div", { children: [_jsx("label", { className: "block text-xs text-zinc-400 mb-1.5", children: "Name *" }), _jsxs("div", { className: "relative", children: [_jsx(User, { className: "absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-zinc-500" }), _jsx("input", { type: "text", value: name, onChange: (e) => setName(e.target.value), placeholder: "Your name", className: "w-full pl-9 pr-3 py-2 bg-zinc-800 border border-zinc-700 rounded-lg text-zinc-200 text-sm placeholder-zinc-500 focus:outline-none focus:border-emerald-500" })] })] }), _jsxs("div", { children: [_jsx("label", { className: "block text-xs text-zinc-400 mb-1.5", children: "Email *" }), _jsxs("div", { className: "relative", children: [_jsx(Mail, { className: "absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-zinc-500" }), _jsx("input", { type: "email", value: email, onChange: (e) => setEmail(e.target.value), placeholder: "you@example.com", className: "w-full pl-9 pr-3 py-2 bg-zinc-800 border border-zinc-700 rounded-lg text-zinc-200 text-sm placeholder-zinc-500 focus:outline-none focus:border-emerald-500" })] })] }), _jsxs("div", { children: [_jsx("label", { className: "block text-xs text-zinc-400 mb-1.5", children: "Notes (optional)" }), _jsxs("div", { className: "relative", children: [_jsx(MessageSquare, { className: "absolute left-3 top-3 w-3.5 h-3.5 text-zinc-500" }), _jsx("textarea", { value: notes, onChange: (e) => setNotes(e.target.value), placeholder: "Anything to discuss?", rows: 3, className: "w-full pl-9 pr-3 py-2 bg-zinc-800 border border-zinc-700 rounded-lg text-zinc-200 text-sm placeholder-zinc-500 focus:outline-none focus:border-emerald-500 resize-none" })] })] }), bookError && (_jsx("p", { className: "text-sm text-amber-400", children: bookError })), _jsx("button", { onClick: handleBook, disabled: !name || !email || isBooking, className: "w-full py-3 bg-emerald-600 hover:bg-emerald-500 rounded-lg text-white font-medium text-sm disabled:opacity-50 transition-colors", children: isBooking ? "Confirming…" : "Confirm Booking" })] })] }))] })] }) }) }));
}
