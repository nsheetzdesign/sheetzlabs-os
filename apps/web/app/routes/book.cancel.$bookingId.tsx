import type { LoaderFunctionArgs } from "react-router";
import { useLoaderData } from "react-router";
import { useState } from "react";
import { AlertTriangle, Check } from "lucide-react";

type Booking = {
  id: string;
  guest_name: string;
  guest_email: string;
  scheduled_at: string;
  duration_minutes: number;
  timezone: string;
  status: string;
  booking_links: { title: string };
};

export async function loader({ params, context }: LoaderFunctionArgs) {
  const env = context.cloudflare.env as Record<string, string>;
  const apiUrl = env.INTERNAL_API_URL ?? "https://api.sheetzlabs.com";

  const response = await fetch(`${apiUrl}/booking/public/booking/${params.bookingId}`);

  if (!response.ok) {
    throw new Response("Booking not found", { status: 404 });
  }

  const data = (await response.json()) as { booking: Booking };
  return { booking: data.booking, apiUrl: env.API_URL ?? "https://api.sheetzlabs.com" };
}

export default function CancelBookingPage() {
  const { booking } = useLoaderData<typeof loader>();
  const [cancelled, setCancelled] = useState(false);
  const [cancelling, setCancelling] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleCancel = async () => {
    setCancelling(true);
    setError(null);

    const response = await fetch(`https://api.sheetzlabs.com/booking/public/cancel/${booking.id}`, {
      method: "POST",
    });

    if (response.ok) {
      setCancelled(true);
    } else {
      const data = (await response.json()) as { error?: string };
      setError(data.error || "Failed to cancel booking");
    }

    setCancelling(false);
  };

  if (booking.status === "cancelled") {
    return (
      <div className="min-h-screen bg-zinc-950 flex items-center justify-center p-4">
        <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-8 max-w-md w-full text-center">
          <p className="text-zinc-400">This booking has already been cancelled.</p>
        </div>
      </div>
    );
  }

  if (cancelled) {
    return (
      <div className="min-h-screen bg-zinc-950 flex items-center justify-center p-4">
        <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-8 max-w-md w-full text-center">
          <div className="w-16 h-16 bg-emerald-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
            <Check className="w-8 h-8 text-emerald-500" />
          </div>
          <h1 className="text-2xl font-semibold text-zinc-100 mb-2">Booking Cancelled</h1>
          <p className="text-zinc-400">
            Your booking has been cancelled. A confirmation email has been sent.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-zinc-950 flex items-center justify-center p-4">
      <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-8 max-w-md w-full">
        <div className="text-center mb-6">
          <div className="w-16 h-16 bg-amber-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
            <AlertTriangle className="w-8 h-8 text-amber-500" />
          </div>
          <h1 className="text-2xl font-semibold text-zinc-100 mb-2">Cancel Booking?</h1>
          <p className="text-zinc-400">This action cannot be undone.</p>
        </div>

        <div className="bg-zinc-800 rounded-lg p-4 mb-6">
          <h2 className="text-zinc-100 font-medium mb-2">{booking.booking_links?.title}</h2>
          <p className="text-sm text-zinc-400">
            {new Date(booking.scheduled_at).toLocaleDateString("en-US", {
              weekday: "long",
              month: "long",
              day: "numeric",
              year: "numeric",
            })}
          </p>
          <p className="text-sm text-zinc-400">
            {new Date(booking.scheduled_at).toLocaleTimeString("en-US", {
              hour: "numeric",
              minute: "2-digit",
            })}
            {" · "}
            {booking.duration_minutes} minutes
          </p>
        </div>

        {error && <p className="text-red-400 text-sm text-center mb-4">{error}</p>}

        <div className="flex gap-3">
          <a
            href="/"
            className="flex-1 py-3 text-center text-zinc-400 hover:text-zinc-200 rounded-lg border border-zinc-700"
          >
            Keep Booking
          </a>
          <button
            onClick={handleCancel}
            disabled={cancelling}
            className="flex-1 py-3 bg-red-600 hover:bg-red-500 rounded-lg text-white font-medium disabled:opacity-50"
          >
            {cancelling ? "Cancelling..." : "Yes, Cancel"}
          </button>
        </div>
      </div>
    </div>
  );
}
