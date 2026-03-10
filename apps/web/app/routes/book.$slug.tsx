import type { LoaderFunctionArgs, ActionFunctionArgs, MetaFunction } from "react-router";
import { useLoaderData, useFetcher } from "react-router";
import { useState, useEffect } from "react";
import { Clock, User, Mail, MessageSquare, Check, ChevronLeft } from "lucide-react";

export const meta: MetaFunction<typeof loader> = ({ data }) => [
  { title: data ? `Book: ${data.link.title}` : "Book a Meeting" },
];

type AvailabilityRules = {
  timezone?: string;
  days?: Record<string, { enabled: boolean; slots: Array<{ start: string; end: string }> }>;
  buffer_after_minutes?: number;
  minimum_notice_hours?: number;
  date_range_days?: number;
};

type BookingLink = {
  id: string;
  slug: string;
  title: string;
  description?: string;
  duration_minutes: number;
  availability_rules: AvailabilityRules;
};

export async function loader({ params, context }: LoaderFunctionArgs) {
  const env = context.cloudflare.env as Record<string, string>;
  const apiUrl = env.INTERNAL_API_URL ?? "https://api.sheetzlabs.com";

  const res = await fetch(`${apiUrl}/booking/public/${params.slug}`);
  if (!res.ok) throw new Response("Booking link not found", { status: 404 });

  const data = (await res.json()) as { link: BookingLink };
  return { link: data.link, apiUrl: env.API_URL ?? "https://api.sheetzlabs.com" };
}

export async function action({ params, request, context }: ActionFunctionArgs) {
  const env = context.cloudflare.env as Record<string, string>;
  const apiUrl = env.INTERNAL_API_URL ?? "https://api.sheetzlabs.com";
  const fd = await request.formData();
  const intent = fd.get("intent") as string;

  if (intent === "get_slots") {
    const date = fd.get("date") as string;
    const res = await fetch(`${apiUrl}/booking/public/${params.slug}/slots?date=${date}`);
    const data = await res.json();
    return data;
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
    const data = await res.json();
    return data;
  }

  return null;
}

export default function BookingPage() {
  const { link } = useLoaderData<typeof loader>();
  const slotFetcher = useFetcher<{ slots: string[]; date: string }>();
  const bookFetcher = useFetcher<{ success?: boolean; booking?: { id: string; scheduled_at: string; duration_minutes: number } }>();

  const [step, setStep] = useState<"date" | "time" | "details" | "confirmed">("date");
  const [selectedDate, setSelectedDate] = useState<string | null>(null);
  const [selectedTime, setSelectedTime] = useState<string | null>(null);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [notes, setNotes] = useState("");

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
    if (!selectedDate) return;
    const fd = new FormData();
    fd.set("intent", "get_slots");
    fd.set("date", selectedDate);
    slotFetcher.submit(fd, { method: "post" });
    setStep("time");
  }, [selectedDate]); // eslint-disable-line react-hooks/exhaustive-deps

  // Move to confirmed when booking succeeds
  useEffect(() => {
    if (bookFetcher.data?.success) setStep("confirmed");
  }, [bookFetcher.data]);

  function handleBook() {
    if (!selectedTime || !name || !email) return;
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
    return (
      <div className="min-h-screen bg-zinc-950 flex items-center justify-center p-4">
        <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-8 max-w-md w-full text-center">
          <div className="w-16 h-16 bg-emerald-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
            <Check className="w-8 h-8 text-emerald-500" />
          </div>
          <h1 className="text-2xl font-semibold text-zinc-100 mb-2">Booking Confirmed!</h1>
          <p className="text-zinc-400 mb-6">You&apos;re scheduled for {link.title}</p>
          <div className="bg-zinc-800 rounded-lg p-4 text-left space-y-1">
            <p className="text-zinc-200 font-medium">
              {new Date(selectedTime).toLocaleDateString("en-US", {
                weekday: "long", month: "long", day: "numeric", year: "numeric",
              })}
            </p>
            <p className="text-zinc-400 text-sm">
              {new Date(selectedTime).toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit" })}
              {" · "}{link.duration_minutes} minutes
            </p>
          </div>
          <p className="text-sm text-zinc-500 mt-4">
            A calendar invitation has been sent to {email}
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-zinc-950 flex items-center justify-center p-4">
      <div className="bg-zinc-900 border border-zinc-800 rounded-xl overflow-hidden max-w-3xl w-full">
        <div className="grid md:grid-cols-5">
          {/* Left panel: meeting info */}
          <div className="md:col-span-2 p-8 border-b md:border-b-0 md:border-r border-zinc-800">
            <div className="w-10 h-10 rounded-full bg-emerald-500/20 flex items-center justify-center mb-4">
              <Clock className="w-5 h-5 text-emerald-400" />
            </div>
            <h1 className="text-xl font-semibold text-zinc-100 mb-1">{link.title}</h1>
            <div className="flex items-center gap-1.5 text-zinc-400 text-sm mb-3">
              <Clock className="w-3.5 h-3.5" />
              <span>{link.duration_minutes} minutes</span>
            </div>
            {link.description && (
              <p className="text-zinc-400 text-sm leading-relaxed">{link.description}</p>
            )}
          </div>

          {/* Right panel: booking flow */}
          <div className="md:col-span-3 p-8">
            {step === "date" && (
              <>
                <h2 className="text-base font-medium text-zinc-100 mb-4">Select a Date</h2>
                <div className="grid grid-cols-3 gap-2 max-h-72 overflow-y-auto pr-1">
                  {availableDates.map((date) => {
                    const d = new Date(date + "T12:00:00");
                    return (
                      <button
                        key={date}
                        onClick={() => setSelectedDate(date)}
                        className={`p-3 rounded-lg text-sm transition-colors text-center ${
                          selectedDate === date
                            ? "bg-emerald-600 text-white"
                            : "bg-zinc-800 text-zinc-300 hover:bg-zinc-700"
                        }`}
                      >
                        <div className="font-medium text-xs">
                          {d.toLocaleDateString("en-US", { weekday: "short" })}
                        </div>
                        <div className="text-sm">
                          {d.toLocaleDateString("en-US", { month: "short", day: "numeric" })}
                        </div>
                      </button>
                    );
                  })}
                </div>
              </>
            )}

            {step === "time" && (
              <>
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-base font-medium text-zinc-100">Select a Time</h2>
                  <button
                    onClick={() => { setStep("date"); setSelectedTime(null); }}
                    className="flex items-center gap-1 text-sm text-zinc-400 hover:text-zinc-200"
                  >
                    <ChevronLeft className="w-3.5 h-3.5" /> Change date
                  </button>
                </div>
                {selectedDate && (
                  <p className="text-sm text-zinc-500 mb-3">
                    {new Date(selectedDate + "T12:00:00").toLocaleDateString("en-US", {
                      weekday: "long", month: "long", day: "numeric",
                    })}
                  </p>
                )}
                {isLoadingSlots ? (
                  <p className="text-zinc-500 text-sm">Loading available times…</p>
                ) : slots.length === 0 ? (
                  <p className="text-zinc-500 text-sm">No available times on this date.</p>
                ) : (
                  <div className="grid grid-cols-2 gap-2 max-h-64 overflow-y-auto pr-1">
                    {slots.map((slot) => (
                      <button
                        key={slot}
                        onClick={() => { setSelectedTime(slot); setStep("details"); }}
                        className="p-3 bg-zinc-800 hover:bg-zinc-700 rounded-lg text-sm text-zinc-200 transition-colors"
                      >
                        {new Date(slot).toLocaleTimeString("en-US", {
                          hour: "numeric", minute: "2-digit",
                        })}
                      </button>
                    ))}
                  </div>
                )}
              </>
            )}

            {step === "details" && selectedTime && (
              <>
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-base font-medium text-zinc-100">Your Details</h2>
                  <button
                    onClick={() => setStep("time")}
                    className="flex items-center gap-1 text-sm text-zinc-400 hover:text-zinc-200"
                  >
                    <ChevronLeft className="w-3.5 h-3.5" /> Change time
                  </button>
                </div>

                <div className="bg-zinc-800 rounded-lg p-3 mb-5 text-sm">
                  <p className="text-zinc-200 font-medium">
                    {new Date(selectedTime).toLocaleDateString("en-US", {
                      weekday: "long", month: "long", day: "numeric",
                    })}
                  </p>
                  <p className="text-zinc-400 text-xs mt-0.5">
                    {new Date(selectedTime).toLocaleTimeString("en-US", {
                      hour: "numeric", minute: "2-digit",
                    })}
                    {" · "}{link.duration_minutes} min
                  </p>
                </div>

                <div className="space-y-4">
                  <div>
                    <label className="block text-xs text-zinc-400 mb-1.5">Name *</label>
                    <div className="relative">
                      <User className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-zinc-500" />
                      <input
                        type="text"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        placeholder="Your name"
                        className="w-full pl-9 pr-3 py-2 bg-zinc-800 border border-zinc-700 rounded-lg text-zinc-200 text-sm placeholder-zinc-500 focus:outline-none focus:border-emerald-500"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-xs text-zinc-400 mb-1.5">Email *</label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-zinc-500" />
                      <input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="you@example.com"
                        className="w-full pl-9 pr-3 py-2 bg-zinc-800 border border-zinc-700 rounded-lg text-zinc-200 text-sm placeholder-zinc-500 focus:outline-none focus:border-emerald-500"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-xs text-zinc-400 mb-1.5">Notes (optional)</label>
                    <div className="relative">
                      <MessageSquare className="absolute left-3 top-3 w-3.5 h-3.5 text-zinc-500" />
                      <textarea
                        value={notes}
                        onChange={(e) => setNotes(e.target.value)}
                        placeholder="Anything to discuss?"
                        rows={3}
                        className="w-full pl-9 pr-3 py-2 bg-zinc-800 border border-zinc-700 rounded-lg text-zinc-200 text-sm placeholder-zinc-500 focus:outline-none focus:border-emerald-500 resize-none"
                      />
                    </div>
                  </div>
                  <button
                    onClick={handleBook}
                    disabled={!name || !email || isBooking}
                    className="w-full py-3 bg-emerald-600 hover:bg-emerald-500 rounded-lg text-white font-medium text-sm disabled:opacity-50 transition-colors"
                  >
                    {isBooking ? "Confirming…" : "Confirm Booking"}
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
