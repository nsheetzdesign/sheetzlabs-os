import type { LoaderFunctionArgs, ActionFunctionArgs, MetaFunction } from "react-router";
import { useLoaderData, Link, useFetcher, useNavigation } from "react-router";
import { ArrowLeft, Clock, MapPin, Video, Users, ExternalLink, Zap, CheckSquare } from "lucide-react";
import { Header } from "~/components/dashboard/Header";
import { getSupabaseClient } from "~/lib/supabase.server";

export const meta: MetaFunction<typeof loader> = ({ data }) => [
  { title: `${data?.event?.title ?? "Event"} — Calendar — Sheetz Labs OS` },
];

export async function loader({ params, context }: LoaderFunctionArgs) {
  const supabase = getSupabaseClient(context.cloudflare.env);

  const { data: event } = await supabase
    .from("calendar_events")
    .select(`
      *,
      calendar_accounts(email, color),
      tasks(id, title, status),
      knowledge:ai_prep_doc_id(id, title)
    `)
    .eq("id", params.id!)
    .single();

  if (!event) throw new Response("Not found", { status: 404 });

  return { event };
}

export async function action({ params, request, context }: ActionFunctionArgs) {
  const apiUrl =
    (context.cloudflare.env as Record<string, string>).INTERNAL_API_URL ??
    "https://api.sheetzlabs.com";

  const fd = await request.formData();
  const intent = fd.get("intent") as string;

  if (intent === "prep") {
    await fetch(`${apiUrl}/calendar/events/${params.id}/prep`, { method: "POST" });
  }

  if (intent === "delete_time_block") {
    await fetch(`${apiUrl}/calendar/time-blocks/${params.id}`, { method: "DELETE" });
    return new Response(null, {
      status: 302,
      headers: { Location: "/dashboard/calendar" },
    });
  }

  return null;
}

function formatDateTime(iso: string) {
  return new Date(iso).toLocaleString(undefined, {
    weekday: "short",
    month: "short",
    day: "numeric",
    hour: "numeric",
    minute: "2-digit",
  });
}

function formatTime(iso: string) {
  return new Date(iso).toLocaleTimeString(undefined, {
    hour: "numeric",
    minute: "2-digit",
  });
}

const STATUS_COLORS: Record<string, string> = {
  accepted: "bg-emerald-500",
  declined: "bg-red-500",
  tentative: "bg-amber-500",
  needsAction: "bg-zinc-500",
};

export default function CalendarEventDetail() {
  const { event } = useLoaderData<typeof loader>();
  const fetcher = useFetcher();
  const navigation = useNavigation();
  const isGenerating = fetcher.state !== "idle";

  const hasAttendees = Array.isArray(event.attendees) && event.attendees.length > 0;
  const prepPending = fetcher.formData?.get("intent") === "prep";

  return (
    <div className="flex flex-1 flex-col">
      <Header title="Event Detail" />
      <main className="flex-1 overflow-auto p-6">
        <div className="mx-auto max-w-2xl space-y-6">
          {/* Back */}
          <Link
            to="/dashboard/calendar"
            className="inline-flex items-center gap-1.5 text-xs text-zinc-600 hover:text-zinc-300 transition-colors"
          >
            <ArrowLeft className="h-3.5 w-3.5" />
            Calendar
          </Link>

          {/* Event header */}
          <div className="rounded-xl border border-surface-2/50 bg-surface-1/40 px-6 py-5">
            <div className="flex items-start justify-between gap-4">
              <div className="min-w-0">
                <h1 className="text-xl font-semibold text-zinc-100 break-words">{event.title}</h1>
                <div className="flex items-center gap-2 mt-2 text-sm text-zinc-400">
                  <Clock className="h-3.5 w-3.5 shrink-0" />
                  <span>
                    {formatDateTime(event.start_at)} — {formatTime(event.end_at)}
                  </span>
                </div>
              </div>
              <div className="flex flex-col items-end gap-2 shrink-0">
                {event.is_time_block && (
                  <span className="px-2 py-1 bg-emerald-500/15 border border-emerald-500/30 text-emerald-400 text-xs rounded-md">
                    Time Block
                  </span>
                )}
                {event.calendar_accounts && (
                  <span
                    className="w-3 h-3 rounded-full"
                    style={{ backgroundColor: event.calendar_accounts.color ?? "#2FE8B6" }}
                    title={event.calendar_accounts.email}
                  />
                )}
              </div>
            </div>
          </div>

          {/* Details */}
          <div className="rounded-xl border border-surface-2/50 bg-surface-1/40 divide-y divide-zinc-800">
            {event.location && (
              <div className="flex items-start gap-3 px-5 py-4">
                <MapPin className="h-4 w-4 text-zinc-500 shrink-0 mt-0.5" />
                <span className="text-sm text-zinc-300">{event.location}</span>
              </div>
            )}

            {event.meeting_link && (
              <div className="flex items-start gap-3 px-5 py-4">
                <Video className="h-4 w-4 text-zinc-500 shrink-0 mt-0.5" />
                <a
                  href={event.meeting_link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm text-emerald-400 hover:text-emerald-300 flex items-center gap-1"
                >
                  Join Meeting
                  <ExternalLink className="h-3 w-3" />
                </a>
              </div>
            )}

            {event.description && (
              <div className="px-5 py-4">
                <div className="text-xs text-zinc-500 uppercase tracking-wide mb-2">Description</div>
                <div className="text-sm text-zinc-300 whitespace-pre-wrap leading-relaxed">
                  {event.description}
                </div>
              </div>
            )}
          </div>

          {/* Attendees */}
          {hasAttendees && (
            <div className="rounded-xl border border-surface-2/50 bg-surface-1/40 px-5 py-4">
              <div className="flex items-center gap-2 mb-3">
                <Users className="h-4 w-4 text-zinc-500" />
                <span className="text-xs text-zinc-500 uppercase tracking-wide">
                  Attendees ({(event.attendees as unknown[]).length})
                </span>
              </div>
              <div className="space-y-2">
                {(event.attendees as Array<{ email: string; name?: string; status?: string }>).map(
                  (attendee, i) => (
                    <div key={i} className="flex items-center gap-2.5">
                      <span
                        className={`w-2 h-2 rounded-full shrink-0 ${STATUS_COLORS[attendee.status ?? "needsAction"] ?? "bg-zinc-500"}`}
                      />
                      <span className="text-sm text-zinc-300">{attendee.name || attendee.email}</span>
                      {attendee.name && (
                        <span className="text-xs text-zinc-600">{attendee.email}</span>
                      )}
                    </div>
                  )
                )}
              </div>
            </div>
          )}

          {/* Meeting Prep */}
          {hasAttendees && (
            <div className="rounded-xl border border-surface-2/50 bg-surface-1/40 px-5 py-4">
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-sm font-medium text-zinc-200 flex items-center gap-2">
                    <Zap className="h-4 w-4 text-emerald-400" />
                    AI Meeting Prep
                  </div>
                  <div className="text-xs text-zinc-500 mt-0.5">
                    Research attendees and generate a briefing doc
                  </div>
                </div>
                {event.knowledge ? (
                  <Link
                    to={`/dashboard/knowledge/${event.knowledge.id}`}
                    className="text-sm text-emerald-400 hover:text-emerald-300 flex items-center gap-1"
                  >
                    View Briefing
                    <ExternalLink className="h-3 w-3" />
                  </Link>
                ) : (
                  <fetcher.Form method="post">
                    <input type="hidden" name="intent" value="prep" />
                    <button
                      type="submit"
                      disabled={isGenerating || event.ai_prep_generated}
                      className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white text-xs rounded-md disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                    >
                      {prepPending || event.ai_prep_generated
                        ? "Generating..."
                        : "Generate Brief"}
                    </button>
                  </fetcher.Form>
                )}
              </div>
            </div>
          )}

          {/* Linked Task */}
          {event.tasks && (
            <div className="rounded-xl border border-surface-2/50 bg-surface-1/40 px-5 py-4">
              <div className="text-xs text-zinc-500 uppercase tracking-wide mb-2">Linked Task</div>
              <Link
                to={`/dashboard/tasks/${event.tasks.id}`}
                className="flex items-center gap-2 text-sm text-zinc-300 hover:text-emerald-400 transition-colors"
              >
                <CheckSquare className="h-3.5 w-3.5 text-zinc-500" />
                {event.tasks.title}
              </Link>
            </div>
          )}

          {/* Delete time block */}
          {event.is_time_block && (
            <fetcher.Form method="post">
              <input type="hidden" name="intent" value="delete_time_block" />
              <button
                type="submit"
                className="text-xs text-red-500 hover:text-red-400 transition-colors"
              >
                Remove time block
              </button>
            </fetcher.Form>
          )}
        </div>
      </main>
    </div>
  );
}
