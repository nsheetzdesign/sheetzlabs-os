import type { LoaderFunctionArgs, ActionFunctionArgs, MetaFunction } from "react-router";
import { useLoaderData, useFetcher, Link } from "react-router";
import { useState } from "react";
import { Calendar, Clock, User, Video, X, ChevronDown } from "lucide-react";

export const meta: MetaFunction = () => [{ title: "Bookings — Sheetz Labs OS" }];

type Booking = {
  id: string;
  guest_name: string;
  guest_email: string;
  guest_notes?: string;
  scheduled_at: string;
  duration_minutes: number;
  timezone: string;
  status: string;
  meet_link?: string;
  booking_links?: { title: string; slug: string };
};

export async function loader({ context }: LoaderFunctionArgs) {
  const env = context.cloudflare.env as Record<string, string>;
  const apiUrl = env.INTERNAL_API_URL ?? "https://api.sheetzlabs.com";
  const res = await fetch(`${apiUrl}/booking/bookings`);
  const data = (await res.json()) as { bookings: Booking[] };
  return { bookings: data.bookings ?? [] };
}

export async function action({ request, context }: ActionFunctionArgs) {
  const env = context.cloudflare.env as Record<string, string>;
  const apiUrl = env.INTERNAL_API_URL ?? "https://api.sheetzlabs.com";
  const fd = await request.formData();
  const intent = fd.get("intent") as string;
  const bookingId = fd.get("bookingId") as string;

  if (intent === "cancel" && bookingId) {
    await fetch(`${apiUrl}/booking/bookings/${bookingId}`, { method: "DELETE" });
  }

  return null;
}

function BookingCard({
  booking,
  onCancel,
  showCancel,
}: {
  booking: Booking;
  onCancel: () => void;
  showCancel: boolean;
}) {
  const [expanded, setExpanded] = useState(false);
  const date = new Date(booking.scheduled_at);

  return (
    <div className="bg-zinc-900 border border-zinc-800 rounded-lg overflow-hidden">
      <div
        className="p-4 cursor-pointer hover:bg-zinc-800/50 transition-colors"
        onClick={() => setExpanded(!expanded)}
      >
        <div className="flex items-start justify-between">
          <div className="flex-1 min-w-0">
            <h3 className="text-zinc-100 font-medium truncate">
              {booking.booking_links?.title || "Meeting"}
            </h3>
            <div className="flex items-center gap-4 mt-2 text-sm text-zinc-400 flex-wrap">
              <span className="flex items-center gap-1">
                <User className="w-3.5 h-3.5" />
                {booking.guest_name}
              </span>
              <span className="flex items-center gap-1">
                <Calendar className="w-3.5 h-3.5" />
                {date.toLocaleDateString("en-US", { month: "short", day: "numeric" })}
              </span>
              <span className="flex items-center gap-1">
                <Clock className="w-3.5 h-3.5" />
                {date.toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit" })}
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
              <p className={booking.status === "confirmed" ? "text-emerald-400" : "text-red-400"}>
                {booking.status.charAt(0).toUpperCase() + booking.status.slice(1)}
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

  const now = new Date();

  const filteredBookings = bookings.filter((booking) => {
    const bookingDate = new Date(booking.scheduled_at);
    if (filter === "upcoming") return booking.status === "confirmed" && bookingDate > now;
    if (filter === "past") return booking.status === "confirmed" && bookingDate <= now;
    return booking.status === "cancelled";
  });

  function handleCancel(bookingId: string) {
    if (confirm("Are you sure you want to cancel this booking?")) {
      fetcher.submit({ intent: "cancel", bookingId }, { method: "post" });
    }
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
            onClick={() => setFilter(tab)}
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
          {filteredBookings.map((booking) => (
            <BookingCard
              key={booking.id}
              booking={booking}
              onCancel={() => handleCancel(booking.id)}
              showCancel={filter === "upcoming"}
            />
          ))}
        </div>
      )}
    </div>
  );
}
