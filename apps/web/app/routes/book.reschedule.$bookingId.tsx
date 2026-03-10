import type { LoaderFunctionArgs, ActionFunctionArgs, MetaFunction } from "react-router";
import { useLoaderData, useFetcher } from "react-router";
import { useState } from "react";
import { Calendar, Clock, Check, ArrowRight } from "lucide-react";

export const meta: MetaFunction = () => [{ title: "Reschedule Meeting" }];

type AvailabilityRules = {
  date_range_days?: number;
};

type BookingLink = {
  slug: string;
  title: string;
  duration_minutes: number;
  availability_rules: AvailabilityRules;
};

type Booking = {
  id: string;
  guest_name: string;
  scheduled_at: string;
  duration_minutes: number;
  timezone: string;
  status: string;
  booking_links: BookingLink;
};

export async function loader({ params, context }: LoaderFunctionArgs) {
  const env = context.cloudflare.env as Record<string, string>;
  const apiUrl = env.INTERNAL_API_URL ?? "https://api.sheetzlabs.com";

  const res = await fetch(`${apiUrl}/booking/public/reschedule/${params.bookingId}`);
  if (!res.ok) throw new Response("Booking not found", { status: 404 });

  const data = (await res.json()) as { booking: Booking };
  return { booking: data.booking };
}

export async function action({ params, request, context }: ActionFunctionArgs) {
  const env = context.cloudflare.env as Record<string, string>;
  const apiUrl = env.INTERNAL_API_URL ?? "https://api.sheetzlabs.com";
  const fd = await request.formData();
  const intent = fd.get("intent") as string;

  if (intent === "get_slots") {
    const slug = fd.get("slug") as string;
    const date = fd.get("date") as string;
    const res = await fetch(`${apiUrl}/booking/public/${slug}/slots?date=${date}`);
    return res.json();
  }

  if (intent === "reschedule") {
    const bookingId = params.bookingId as string;
    const scheduled_at = fd.get("scheduled_at") as string;
    const timezone = fd.get("timezone") as string;
    const res = await fetch(`${apiUrl}/booking/public/reschedule/${bookingId}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ scheduled_at, timezone }),
    });
    return res.json();
  }

  return null;
}

export default function ReschedulePage() {
  const { booking } = useLoaderData<typeof loader>();
  const slotFetcher = useFetcher<{ slots: string[] }>();
  const rescheduleFetcher = useFetcher<{ success?: boolean }>();

  const [selectedDate, setSelectedDate] = useState<string | null>(null);
  const [selectedTime, setSelectedTime] = useState<string | null>(null);
  const [step, setStep] = useState<"date" | "time">("date");

  const bookingLink = booking.booking_links;
  const currentDate = new Date(booking.scheduled_at);
  const dateRangeDays = bookingLink.availability_rules?.date_range_days ?? 14;

  const availableDates = Array.from({ length: dateRangeDays }, (_, i) => {
    const date = new Date();
    date.setDate(date.getDate() + i + 1); // start tomorrow
    return date.toISOString().split("T")[0];
  });

  function handleDateSelect(date: string) {
    setSelectedDate(date);
    setSelectedTime(null);
    setStep("time");
    slotFetcher.submit(
      { intent: "get_slots", slug: bookingLink.slug, date },
      { method: "post" }
    );
  }

  function handleReschedule() {
    if (!selectedTime) return;
    rescheduleFetcher.submit(
      {
        intent: "reschedule",
        scheduled_at: selectedTime,
        timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
      },
      { method: "post" }
    );
  }

  const confirmed = rescheduleFetcher.data?.success === true;

  if (confirmed) {
    return (
      <div className="min-h-screen bg-zinc-950 flex items-center justify-center p-4">
        <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-8 max-w-md w-full text-center">
          <div className="w-16 h-16 bg-emerald-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
            <Check className="w-8 h-8 text-emerald-500" />
          </div>
          <h1 className="text-2xl font-semibold text-zinc-100 mb-2">Rescheduled!</h1>
          <p className="text-zinc-400 mb-4">Your meeting has been moved to a new time.</p>
          <div className="bg-zinc-800 rounded-lg p-4 text-left">
            <p className="text-zinc-300">
              {new Date(selectedTime!).toLocaleDateString("en-US", {
                weekday: "long",
                month: "long",
                day: "numeric",
                year: "numeric",
              })}
            </p>
            <p className="text-zinc-400">
              {new Date(selectedTime!).toLocaleTimeString("en-US", {
                hour: "numeric",
                minute: "2-digit",
              })}
              {" · "}
              {booking.duration_minutes} minutes
            </p>
          </div>
          <p className="text-sm text-zinc-500 mt-4">
            Your calendar invitation has been updated.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-zinc-950 flex items-center justify-center p-4">
      <div className="bg-zinc-900 border border-zinc-800 rounded-xl overflow-hidden max-w-4xl w-full">
        <div className="grid md:grid-cols-2">
          {/* Left: Current booking info */}
          <div className="p-8 border-b md:border-b-0 md:border-r border-zinc-800">
            <h1 className="text-2xl font-semibold text-zinc-100 mb-1">Reschedule</h1>
            <p className="text-zinc-400 mb-6">{bookingLink.title}</p>

            <div className="bg-zinc-800 rounded-lg p-4 mb-4">
              <p className="text-zinc-500 text-xs mb-2">Current time:</p>
              <div className="flex items-center gap-2 text-zinc-300">
                <Calendar className="w-4 h-4" />
                <span>
                  {currentDate.toLocaleDateString("en-US", {
                    weekday: "short",
                    month: "short",
                    day: "numeric",
                  })}
                </span>
              </div>
              <div className="flex items-center gap-2 text-zinc-300 mt-1">
                <Clock className="w-4 h-4" />
                <span>
                  {currentDate.toLocaleTimeString("en-US", {
                    hour: "numeric",
                    minute: "2-digit",
                  })}
                </span>
              </div>
            </div>

            <div className="flex items-center gap-2 text-zinc-500">
              <ArrowRight className="w-4 h-4" />
              <span className="text-sm">Select a new time on the right</span>
            </div>
          </div>

          {/* Right: Date/Time picker */}
          <div className="p-8">
            {step === "date" && (
              <>
                <h2 className="text-lg font-medium text-zinc-100 mb-4">Select a New Date</h2>
                <div className="grid grid-cols-3 gap-2 max-h-64 overflow-y-auto pr-1">
                  {availableDates.map((date) => (
                    <button
                      key={date}
                      onClick={() => handleDateSelect(date)}
                      className={`p-3 rounded-lg text-sm transition-colors ${
                        selectedDate === date
                          ? "bg-emerald-600 text-white"
                          : "bg-zinc-800 text-zinc-300 hover:bg-zinc-700"
                      }`}
                    >
                      <div className="font-medium">
                        {new Date(date + "T12:00:00").toLocaleDateString("en-US", { weekday: "short" })}
                      </div>
                      <div>
                        {new Date(date + "T12:00:00").toLocaleDateString("en-US", {
                          month: "short",
                          day: "numeric",
                        })}
                      </div>
                    </button>
                  ))}
                </div>
              </>
            )}

            {step === "time" && (
              <>
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-lg font-medium text-zinc-100">Select a New Time</h2>
                  <button
                    onClick={() => { setStep("date"); setSelectedTime(null); }}
                    className="text-sm text-zinc-400 hover:text-zinc-200"
                  >
                    ← Change date
                  </button>
                </div>

                {slotFetcher.state === "submitting" ? (
                  <p className="text-zinc-400 text-sm">Loading available times…</p>
                ) : !slotFetcher.data?.slots?.length ? (
                  <p className="text-zinc-400 text-sm">No available times on this date.</p>
                ) : (
                  <>
                    <div className="grid grid-cols-2 gap-2 max-h-48 overflow-y-auto mb-4 pr-1">
                      {slotFetcher.data.slots.map((slot) => (
                        <button
                          key={slot}
                          onClick={() => setSelectedTime(slot)}
                          className={`p-3 rounded-lg text-sm transition-colors ${
                            selectedTime === slot
                              ? "bg-emerald-600 text-white"
                              : "bg-zinc-800 text-zinc-300 hover:bg-zinc-700"
                          }`}
                        >
                          {new Date(slot).toLocaleTimeString("en-US", {
                            hour: "numeric",
                            minute: "2-digit",
                          })}
                        </button>
                      ))}
                    </div>

                    {selectedTime && (
                      <button
                        onClick={handleReschedule}
                        disabled={rescheduleFetcher.state !== "idle"}
                        className="w-full py-3 bg-emerald-600 hover:bg-emerald-500 rounded-lg text-white font-medium disabled:opacity-50"
                      >
                        {rescheduleFetcher.state !== "idle" ? "Rescheduling…" : "Confirm New Time"}
                      </button>
                    )}
                  </>
                )}
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
