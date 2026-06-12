import type { LoaderFunctionArgs, ActionFunctionArgs, MetaFunction } from "react-router";
import { useLoaderData, useFetcher } from "react-router";
import { useState, useEffect } from "react";
import { Clock, User, Mail, MessageSquare, Check, ChevronLeft, ChevronDown, CalendarPlus, Download } from "lucide-react";
import type { AvailabilityRules } from "@sheetzlabs/shared";
import { MonthGrid, dateKey } from "~/components/booking/MonthGrid";

export { BookingErrorBoundary as ErrorBoundary } from "~/components/booking/BookingErrorBoundary";

export const meta: MetaFunction<typeof loader> = ({ data }) => [
  { title: data ? `Book: ${data.link.title}` : "Book a Meeting" },
];

type PublicLink = {
  id: string;
  slug: string;
  title: string;
  description?: string;
  duration_minutes: number;
  availability_rules: AvailabilityRules;
  host_image_url?: string | null;
  host_name?: string;
};

export async function loader({ params, context }: LoaderFunctionArgs) {
  const env = context.cloudflare.env as Record<string, string>;
  const apiUrl = env.INTERNAL_API_URL ?? "https://api.sheetzlabs.com";

  const res = await fetch(`${apiUrl}/booking/public/${params.slug}`);
  if (!res.ok) throw new Response("Booking link not found", { status: 404 });

  const data = (await res.json()) as { link: PublicLink };
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
    const data = (await res.json().catch(() => ({}))) as Record<string, unknown>;
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
    const data = (await res.json().catch(() => ({}))) as Record<string, unknown>;
    return { ...data, status: res.status };
  }

  return null;
}

// ── tz helpers (guest-local, locale-aware) ────────────────────────────────────

function detectedTz(): string {
  try {
    return Intl.DateTimeFormat().resolvedOptions().timeZone || "America/Chicago";
  } catch {
    return "America/Chicago";
  }
}

function tzOptions(current: string): string[] {
  const fallback = [
    "America/New_York", "America/Chicago", "America/Denver", "America/Los_Angeles",
    "America/Phoenix", "Pacific/Honolulu", "Europe/London", "Europe/Paris",
    "Asia/Kolkata", "Asia/Tokyo", "Australia/Sydney", "UTC",
  ];
  let zones = fallback;
  try {
    const s = (Intl as unknown as { supportedValuesOf?: (k: string) => string[] }).supportedValuesOf?.("timeZone");
    if (s?.length) zones = s;
  } catch { /* keep fallback */ }
  return zones.includes(current) ? zones : [current, ...zones];
}

/** YYYY-MM-DD for `instant` in `tz` (en-CA → ISO date). */
function keyInTz(instant: Date, tz: string): string {
  return new Intl.DateTimeFormat("en-CA", { timeZone: tz, year: "numeric", month: "2-digit", day: "2-digit" }).format(instant);
}

function weekdayName(key: string): string {
  const [y, m, d] = key.split("-").map(Number);
  return new Date(y, m - 1, d).toLocaleDateString("en-US", { weekday: "long" }).toLowerCase();
}

function compactUtc(d: Date): string {
  return d.toISOString().replace(/[-:]/g, "").replace(/\.\d{3}/, "");
}

export default function BookingPage() {
  const { link, apiUrl } = useLoaderData<typeof loader>();
  const slotFetcher = useFetcher<{ slots?: string[]; date?: string; status?: number; error?: string }>();
  const bookFetcher = useFetcher<{ success?: boolean; booking?: { id: string; scheduled_at: string; duration_minutes: number; management_token?: string }; status?: number; error?: string }>();

  const [step, setStep] = useState<"date" | "time" | "details" | "confirmed">("date");
  const [selectedDate, setSelectedDate] = useState<string | null>(null);
  const [selectedTime, setSelectedTime] = useState<string | null>(null);
  const [guestTz, setGuestTz] = useState<string>(detectedTz);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [notes, setNotes] = useState("");
  const [bookError, setBookError] = useState<string | null>(null);

  const locale = typeof navigator !== "undefined" ? navigator.language : undefined;
  const rules = link.availability_rules ?? ({} as AvailabilityRules);
  const dateRangeDays = rules.date_range_days ?? 14;

  // Window bounds + per-day availability, all keyed in the GUEST tz (kills the
  // UTC off-by-one). "Available" = weekday enabled AND within rolling window.
  const now = new Date();
  const todayKey = keyInTz(now, guestTz);
  const maxKey = keyInTz(new Date(now.getTime() + dateRangeDays * 86400000), guestTz);
  function isAvailable(key: string): boolean {
    if (key < todayKey || key > maxKey) return false;
    return rules.days?.[weekdayName(key)]?.enabled ?? true;
  }

  function refetchSlots(date: string) {
    const fd = new FormData();
    fd.set("intent", "get_slots");
    fd.set("date", date);
    slotFetcher.submit(fd, { method: "post" });
  }

  useEffect(() => {
    if (!selectedDate) return;
    refetchSlots(selectedDate);
    setStep("time");
  }, [selectedDate]); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    const d = bookFetcher.data;
    if (!d) return;
    if (d.success) {
      setBookError(null);
      setStep("confirmed");
      return;
    }
    if (d.status === 409) {
      setBookError("That time was just taken — please pick another slot.");
      setStep("time");
      if (selectedDate) refetchSlots(selectedDate);
    } else if (d.status === 422) {
      setBookError("That time isn't available. Please pick another slot.");
      setStep("time");
    } else if (d.status === 503) {
      setBookError("Availability is temporarily unavailable. Please try again in a moment.");
    } else if (d.status && d.status >= 400) {
      setBookError("Something went wrong confirming your booking. Please try again.");
    }
  }, [bookFetcher.data]); // eslint-disable-line react-hooks/exhaustive-deps

  function handleBook() {
    if (!selectedTime || !name || !email) return;
    const fd = new FormData();
    fd.set("intent", "book");
    fd.set("guest_name", name);
    fd.set("guest_email", email);
    fd.set("guest_notes", notes);
    fd.set("scheduled_at", selectedTime);
    fd.set("timezone", guestTz);
    bookFetcher.submit(fd, { method: "post" });
  }

  const slots = slotFetcher.data?.slots ?? [];
  const isLoadingSlots = slotFetcher.state === "submitting";
  const isBooking = bookFetcher.state === "submitting";
  const bookingId = bookFetcher.data?.booking?.id;
  // Per-booking management token (NS-BK-2) — every manage link carries it or the
  // public endpoints 404.
  const manageToken = bookFetcher.data?.booking?.management_token;
  const tokenQs = manageToken ? `?token=${encodeURIComponent(manageToken)}` : "";

  const fmtTime = (iso: string) =>
    new Date(iso).toLocaleTimeString(locale, { hour: "numeric", minute: "2-digit", timeZone: guestTz });
  const fmtDate = (iso: string) =>
    new Date(iso).toLocaleDateString(locale, { weekday: "long", month: "long", day: "numeric", year: "numeric", timeZone: guestTz });

  // ── Confirmation ────────────────────────────────────────────────────────────
  if (step === "confirmed" && selectedTime) {
    const start = new Date(selectedTime);
    const end = new Date(start.getTime() + link.duration_minutes * 60000);
    const summary = encodeURIComponent(`${link.title}${link.host_name ? ` with ${link.host_name}` : ""}`);
    const gcalUrl = `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${summary}&dates=${compactUtc(start)}/${compactUtc(end)}`;
    const outlookUrl = `https://outlook.office.com/calendar/0/deeplink/compose?path=/calendar/action/compose&rru=addevent&subject=${summary}&startdt=${start.toISOString()}&enddt=${end.toISOString()}`;
    const icsUrl = bookingId ? `${apiUrl}/booking/public/${bookingId}/ics${tokenQs}` : null;

    return (
      <div className="min-h-screen bg-zinc-950 flex items-center justify-center p-4">
        <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-8 max-w-md w-full text-center">
          <div className="w-16 h-16 bg-emerald-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
            <Check className="w-8 h-8 text-emerald-500" />
          </div>
          <h1 className="text-2xl font-semibold text-zinc-100 mb-2">Booking Confirmed!</h1>
          <p className="text-zinc-400 mb-6">You&apos;re scheduled for {link.title}</p>
          <div className="bg-zinc-800 rounded-lg p-4 text-left space-y-1">
            <p className="text-zinc-200 font-medium">{fmtDate(selectedTime)}</p>
            <p className="text-zinc-400 text-sm">
              {fmtTime(selectedTime)}{" · "}{link.duration_minutes} minutes
            </p>
            <p className="text-zinc-600 text-xs pt-1">Times shown in {guestTz}</p>
          </div>
          <p className="text-sm text-zinc-500 mt-4">A calendar invitation has been sent to {email}</p>

          <div className="mt-5 grid grid-cols-3 gap-2 text-xs">
            <a href={gcalUrl} target="_blank" rel="noopener noreferrer" className="flex flex-col items-center gap-1 p-2 bg-zinc-800 hover:bg-zinc-700 rounded-lg text-zinc-300">
              <CalendarPlus className="w-4 h-4" /> Google
            </a>
            <a href={outlookUrl} target="_blank" rel="noopener noreferrer" className="flex flex-col items-center gap-1 p-2 bg-zinc-800 hover:bg-zinc-700 rounded-lg text-zinc-300">
              <CalendarPlus className="w-4 h-4" /> Outlook
            </a>
            {icsUrl && (
              <a href={icsUrl} className="flex flex-col items-center gap-1 p-2 bg-zinc-800 hover:bg-zinc-700 rounded-lg text-zinc-300">
                <Download className="w-4 h-4" /> .ics
              </a>
            )}
          </div>

          {bookingId && (
            <div className="mt-6 flex items-center justify-center gap-4 text-sm">
              <a href={`/book/reschedule/${bookingId}${tokenQs}`} className="text-zinc-300 hover:text-emerald-400 transition-colors">Reschedule</a>
              <span className="text-zinc-700">·</span>
              <a href={`/book/cancel/${bookingId}${tokenQs}`} className="text-zinc-300 hover:text-red-400 transition-colors">Cancel</a>
            </div>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-zinc-950 flex items-center justify-center p-4">
      <div className="bg-zinc-900 border border-zinc-800 rounded-xl overflow-hidden max-w-3xl w-full">
        <div className="grid md:grid-cols-5">
          {/* Left panel: host + meeting info */}
          <div className="md:col-span-2 p-8 border-b md:border-b-0 md:border-r border-zinc-800">
            {link.host_image_url ? (
              <img src={link.host_image_url} alt={link.host_name ?? "Host"} className="w-12 h-12 rounded-full object-cover mb-4" />
            ) : (
              <div className="w-10 h-10 rounded-full bg-emerald-500/20 flex items-center justify-center mb-4">
                <Clock className="w-5 h-5 text-emerald-400" />
              </div>
            )}
            {link.host_name && <p className="text-sm text-zinc-400 mb-1">{link.host_name}</p>}
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
                <MonthGrid
                  selected={selectedDate}
                  onSelect={setSelectedDate}
                  isAvailable={isAvailable}
                  todayKey={todayKey}
                  maxKey={maxKey}
                />
                <TzSelector value={guestTz} onChange={setGuestTz} />
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
                  <p className="text-sm text-zinc-500 mb-1">
                    {new Date(selectedDate + "T12:00:00").toLocaleDateString(locale, { weekday: "long", month: "long", day: "numeric" })}
                  </p>
                )}
                <TzSelector value={guestTz} onChange={setGuestTz} compact />
                {bookError && <p className="text-sm text-amber-400 mb-3">{bookError}</p>}
                {isLoadingSlots ? (
                  <div className="grid grid-cols-2 gap-2">
                    {Array.from({ length: 6 }).map((_, i) => (
                      <div key={i} className="h-11 bg-zinc-800/60 rounded-lg animate-pulse" />
                    ))}
                  </div>
                ) : slotFetcher.data?.status === 503 ? (
                  <p className="text-amber-400 text-sm">Availability is temporarily unavailable. Please try again shortly.</p>
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
                        {fmtTime(slot)}
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
                  <p className="text-zinc-200 font-medium">{fmtDate(selectedTime)}</p>
                  <p className="text-zinc-400 text-xs mt-0.5">
                    {fmtTime(selectedTime)}{" · "}{link.duration_minutes} min · {guestTz}
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
                  {bookError && <p className="text-sm text-amber-400">{bookError}</p>}
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

function TzSelector({ value, onChange, compact }: { value: string; onChange: (tz: string) => void; compact?: boolean }) {
  return (
    <div className={compact ? "mb-3" : "mt-4"}>
      <label className="flex items-center gap-1.5 text-xs text-zinc-500" data-testid="timezone-label">
        <span>Times shown in</span>
        <span className="relative inline-flex items-center">
          <select
            value={value}
            onChange={(e) => onChange(e.target.value)}
            aria-label="Timezone"
            className="appearance-none bg-transparent text-zinc-300 pr-4 focus:outline-none cursor-pointer hover:text-zinc-100"
          >
            {tzOptions(value).map((tz) => (
              <option key={tz} value={tz} className="bg-zinc-800">{tz}</option>
            ))}
          </select>
          <ChevronDown className="w-3 h-3 absolute right-0 pointer-events-none text-zinc-500" />
        </span>
      </label>
    </div>
  );
}
