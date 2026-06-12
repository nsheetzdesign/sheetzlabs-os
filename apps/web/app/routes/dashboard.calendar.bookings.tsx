import type { LoaderFunctionArgs, ActionFunctionArgs, MetaFunction } from "react-router";
import { useLoaderData, useFetcher, Link } from "react-router";
import { useState } from "react";
import { Calendar, Clock, User, Video, X, ChevronDown, AlertTriangle, CalendarClock } from "lucide-react";
import { apiFetch } from "~/lib/api";
import type { Booking } from "@sheetzlabs/shared";

export const meta: MetaFunction = () => [{ title: "Bookings — Sheetz Labs OS" }];

// Shared Booking row + the joined link title/slug and the local sync flag.
type BookingRow = Booking & {
  calendar_sync_failed?: boolean | null;
  booking_links?: { title: string; slug: string } | null;
};

export async function loader({ request, context }: LoaderFunctionArgs) {
  const env = context.cloudflare.env as Record<string, string>;
  const res = await apiFetch(request, env, `/booking/bookings`);
  const data = (await res.json()) as { bookings: BookingRow[] };
  return { bookings: data.bookings ?? [] };
}

export async function action({ request, context }: ActionFunctionArgs) {
  const env = context.cloudflare.env as Record<string, string>;
  const fd = await request.formData();
  const intent = fd.get("intent") as string;
  const bookingId = fd.get("bookingId") as string;

  if (intent === "cancel" && bookingId) {
    await apiFetch(request, env, `/booking/bookings/${bookingId}`, { method: "DELETE" });
  }

  if (intent === "reschedule" && bookingId) {
    await apiFetch(request, env, `/booking/bookings/${bookingId}/reschedule`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        scheduled_at: fd.get("scheduled_at"),
        timezone: fd.get("timezone"),
      }),
    });
  }

  return null;
}

const PAGE_SIZE = 10;

function BookingCard({
  booking,
  onCancel,
  onReschedule,
  showCancel,
}: {
  booking: BookingRow;
  onCancel: () => void;
  onReschedule: (scheduledAtUtc: string) => void;
  showCancel: boolean;
}) {
  const [expanded, setExpanded] = useState(false);
  const [rescheduleAt, setRescheduleAt] = useState("");
  const date = new Date(booking.scheduled_at);
  // Render in the booking's own timezone, with the year + a friendly tz label.
  const tz = booking.timezone || undefined;
  const dateLabel = date.toLocaleDateString(undefined, { month: "short", day: "numeric", year: "numeric", timeZone: tz });
  const timeLabel = date.toLocaleTimeString(undefined, { hour: "numeric", minute: "2-digit", timeZoneName: "short", timeZone: tz });

  return (
    <div className="bg-zinc-900 border border-zinc-800 rounded-lg overflow-hidden">
      <div
        className="p-4 cursor-pointer hover:bg-zinc-800/50 transition-colors"
        onClick={() => setExpanded(!expanded)}
      >
        <div className="flex items-start justify-between">
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2">
              <h3 className="text-zinc-100 font-medium truncate">
                {booking.booking_links?.title || "Meeting"}
              </h3>
              {booking.calendar_sync_failed && (
                <span
                  className="inline-flex items-center gap-1 shrink-0 rounded bg-amber-500/15 px-1.5 py-0.5 text-[10px] font-medium text-amber-400"
                  title="The Google Calendar event for this booking failed to sync. The booking is valid; the calendar may be out of date."
                >
                  <AlertTriangle className="w-3 h-3" />
                  Calendar sync failed
                </span>
              )}
            </div>
            <div className="flex items-center gap-4 mt-2 text-sm text-zinc-400 flex-wrap">
              <span className="flex items-center gap-1">
                <User className="w-3.5 h-3.5" />
                {booking.guest_name}
              </span>
              <span className="flex items-center gap-1">
                <Calendar className="w-3.5 h-3.5" />
                {dateLabel}
              </span>
              <span className="flex items-center gap-1">
                <Clock className="w-3.5 h-3.5" />
                {timeLabel}
              </span>
            </div>
          </div>
          <div className="flex items-center gap-2 shrink-0">
            {booking.meet_link && (
              <a
                href={booking.meet_link}
                target="_blank"
                rel="noopener noreferrer"
                onClick={(e) => e.stopPropagation()}
                className="p-2 text-emerald-400 hover:text-emerald-300 hover:bg-zinc-800 rounded"
                title="Join Google Meet"
              >
                <Video className="w-4 h-4" />
              </a>
            )}
            <ChevronDown
              className={`w-4 h-4 text-zinc-500 transition-transform ${expanded ? "rotate-180" : ""}`}
            />
          </div>
        </div>
      </div>

      {expanded && (
        <div className="px-4 pb-4 border-t border-zinc-800 pt-4 space-y-4">
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <p className="text-zinc-500 mb-1">Guest</p>
              <p className="text-zinc-200">{booking.guest_name}</p>
              <a
                href={`mailto:${booking.guest_email}`}
                className="text-emerald-400 hover:text-emerald-300 text-xs"
              >
                {booking.guest_email}
              </a>
            </div>
            <div>
              <p className="text-zinc-500 mb-1">Duration</p>
              <p className="text-zinc-200">{booking.duration_minutes} minutes</p>
            </div>
            <div>
              <p className="text-zinc-500 mb-1">Timezone</p>
              <p className="text-zinc-200 text-xs">{booking.timezone}</p>
            </div>
            <div>
              <p className="text-zinc-500 mb-1">Status</p>
              <p className={
                booking.status === "confirmed" ? "text-emerald-400"
                : booking.status === "completed" ? "text-zinc-400"
                : "text-red-400"
              }>
                {(booking.status ?? "").charAt(0).toUpperCase() + (booking.status ?? "").slice(1)}
              </p>
            </div>
          </div>

          {booking.guest_notes && (
            <div>
              <p className="text-zinc-500 text-sm mb-1">Notes</p>
              <p className="text-zinc-300 text-sm bg-zinc-800 p-3 rounded">{booking.guest_notes}</p>
            </div>
          )}

          {booking.meet_link && (
            <a
              href={booking.meet_link}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center gap-2 w-full py-2 bg-emerald-600 hover:bg-emerald-500 rounded-lg text-sm text-white"
            >
              <Video className="w-4 h-4" />
              Join Google Meet
            </a>
          )}

          {showCancel && (
            <div className="space-y-2">
              <div>
                <p className="text-zinc-500 text-sm mb-1 flex items-center gap-1.5">
                  <CalendarClock className="w-3.5 h-3.5" /> Reschedule
                </p>
                <div className="flex gap-2">
                  <input
                    type="datetime-local"
                    value={rescheduleAt}
                    onClick={(e) => e.stopPropagation()}
                    onChange={(e) => setRescheduleAt(e.target.value)}
                    className="flex-1 bg-zinc-800 border border-zinc-700 rounded-lg px-3 py-2 text-sm text-zinc-200 focus:outline-none focus:border-emerald-500"
                    aria-label="New date and time"
                  />
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      if (!rescheduleAt) return;
                      // datetime-local is in the host's browser tz → convert to UTC ISO.
                      onReschedule(new Date(rescheduleAt).toISOString());
                    }}
                    disabled={!rescheduleAt}
                    className="px-3 py-2 bg-emerald-600 hover:bg-emerald-500 disabled:opacity-50 rounded-lg text-sm text-white"
                  >
                    Move
                  </button>
                </div>
              </div>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onCancel();
                }}
                className="flex items-center justify-center gap-2 w-full py-2 border border-red-500/50 text-red-400 hover:bg-red-500/10 rounded-lg text-sm"
              >
                <X className="w-4 h-4" />
                Cancel Booking
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default function BookingsPage() {
  const { bookings } = useLoaderData<typeof loader>();
  const fetcher = useFetcher();
  const [filter, setFilter] = useState<"upcoming" | "past" | "cancelled">("upcoming");
  const [visible, setVisible] = useState(PAGE_SIZE);

  const now = new Date();

  const filteredBookings = bookings.filter((booking) => {
    const bookingDate = new Date(booking.scheduled_at);
    if (filter === "upcoming") return booking.status === "confirmed" && bookingDate > now;
    // Past = anything completed, or a still-confirmed booking whose time has passed.
    if (filter === "past")
      return booking.status === "completed" || (booking.status === "confirmed" && bookingDate <= now);
    return booking.status === "cancelled";
  });

  // Loader pagination: page through the filtered set in PAGE_SIZE chunks.
  const paged = filteredBookings.slice(0, visible);

  function handleCancel(bookingId: string) {
    if (confirm("Are you sure you want to cancel this booking?")) {
      fetcher.submit({ intent: "cancel", bookingId }, { method: "post" });
    }
  }

  function handleReschedule(bookingId: string, scheduledAtUtc: string) {
    let tz = "America/Chicago";
    try { tz = Intl.DateTimeFormat().resolvedOptions().timeZone; } catch { /* default */ }
    fetcher.submit(
      { intent: "reschedule", bookingId, scheduled_at: scheduledAtUtc, timezone: tz },
      { method: "post" }
    );
  }

  return (
    <div className="p-6 max-w-3xl">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-lg font-semibold text-zinc-100">Bookings</h1>
          <p className="text-xs text-zinc-500 mt-0.5">Manage your scheduled meetings</p>
        </div>
        <Link
          to="/dashboard/calendar/booking-links"
          className="text-sm text-emerald-400 hover:text-emerald-300"
        >
          Booking links →
        </Link>
      </div>

      <div className="flex gap-1 mb-6 bg-zinc-900 p-1 rounded-lg w-fit">
        {(["upcoming", "past", "cancelled"] as const).map((tab) => (
          <button
            key={tab}
            onClick={() => { setFilter(tab); setVisible(PAGE_SIZE); }}
            className={`px-4 py-1.5 text-sm rounded-md transition-colors ${
              filter === tab ? "bg-zinc-800 text-zinc-100" : "text-zinc-400 hover:text-zinc-200"
            }`}
          >
            {tab.charAt(0).toUpperCase() + tab.slice(1)}
          </button>
        ))}
      </div>

      {filteredBookings.length === 0 ? (
        <div className="text-center py-12 border border-zinc-800 rounded-xl">
          <p className="text-zinc-400">
            {filter === "upcoming" && "No upcoming bookings"}
            {filter === "past" && "No past bookings"}
            {filter === "cancelled" && "No cancelled bookings"}
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          {paged.map((booking) => (
            <BookingCard
              key={booking.id}
              booking={booking}
              onCancel={() => handleCancel(booking.id)}
              onReschedule={(scheduledAtUtc) => handleReschedule(booking.id, scheduledAtUtc)}
              showCancel={filter === "upcoming"}
            />
          ))}
          {filteredBookings.length > visible && (
            <button
              onClick={() => setVisible((v) => v + PAGE_SIZE)}
              className="w-full py-2 text-sm text-zinc-400 hover:text-zinc-200 border border-zinc-800 rounded-lg"
            >
              Show more ({filteredBookings.length - visible} more)
            </button>
          )}
        </div>
      )}
    </div>
  );
}
