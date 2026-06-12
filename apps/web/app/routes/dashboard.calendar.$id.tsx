import type { LoaderFunctionArgs, ActionFunctionArgs, MetaFunction } from "react-router";
import { useLoaderData, Link, useFetcher, useRevalidator } from "react-router";
import { useState, useEffect, useRef } from "react";
import {
  ArrowLeft,
  Clock,
  MapPin,
  Video,
  Users,
  ExternalLink,
  Zap,
  CheckSquare,
  Edit2,
  X,
} from "lucide-react";
import { Header } from "~/components/dashboard/Header";
import { getSupabaseClient } from "~/lib/supabase.server";
import { apiFetch } from "~/lib/api";
import { DEFAULT_TZ, formatDateTimeInTz, formatTimeInTz, utcIsoToLocalInput, localInputToUtcIso } from "~/lib/tz";

export const meta: MetaFunction<typeof loader> = ({ data }) => [
  { title: `${data?.event?.title ?? "Event"} — Calendar — Sheetz Labs OS` },
];

function readTzCookie(request: Request): string {
  const cookie = request.headers.get("cookie") ?? "";
  const m = cookie.match(/(?:^|;\s*)tz=([^;]+)/);
  if (!m) return DEFAULT_TZ;
  try {
    return decodeURIComponent(m[1]);
  } catch {
    return m[1];
  }
}

export async function loader({ params, request, context }: LoaderFunctionArgs) {
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

  return { event, tz: readTzCookie(request) };
}

export async function action({ params, request, context }: ActionFunctionArgs) {
  const env = context.cloudflare.env;

  const fd = await request.formData();
  const intent = fd.get("intent") as string;

  if (intent === "prep") {
    await apiFetch(request, env, `/calendar/events/${params.id}/prep`, { method: "POST" });
  }

  if (intent === "edit") {
    // start_at/end_at already arrive as UTC ISO (converted client-side, CS-6).
    const res = await apiFetch(request, env, `/calendar/events/${params.id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        title: fd.get("title") || undefined,
        description: fd.get("description") || undefined,
        location: fd.get("location") || undefined,
        start_at: (fd.get("start_at") as string) || undefined,
        end_at: (fd.get("end_at") as string) || undefined,
        meeting_link: fd.get("meeting_link") || undefined,
        add_google_meet: fd.get("add_google_meet") === "true",
      }),
    });
    if (!res.ok) {
      const data = (await res.json().catch(() => ({}))) as { error?: string };
      return Response.json({ ok: false, error: data.error ?? "Failed to save changes" }, { status: res.status });
    }
    return Response.json({ ok: true });
  }

  if (intent === "delete_time_block") {
    await apiFetch(request, env, `/calendar/time-blocks/${params.id}`, { method: "DELETE" });
    return new Response(null, {
      status: 302,
      headers: { Location: "/dashboard/calendar" },
    });
  }

  if (intent === "delete") {
    // Deletes the event locally and removes it from Google (Prompt 55).
    await apiFetch(request, env, `/calendar/events/${params.id}`, { method: "DELETE" });
    return new Response(null, {
      status: 302,
      headers: { Location: "/dashboard/calendar" },
    });
  }

  return null;
}

const STATUS_COLORS: Record<string, string> = {
  accepted: "bg-emerald-500",
  declined: "bg-red-500",
  tentative: "bg-amber-500",
  needsAction: "bg-zinc-500",
};

export default function CalendarEventDetail() {
  const { event, tz } = useLoaderData<typeof loader>();
  const fetcher = useFetcher<{ ok?: boolean; error?: string }>();
  const revalidator = useRevalidator();
  const [isEditing, setIsEditing] = useState(false);
  const [videoType, setVideoType] = useState<"none" | "meet" | "teams">("none");
  const [editError, setEditError] = useState<string | null>(null);
  const editingRef = useRef(false);

  const isGenerating = fetcher.state !== "idle";
  const hasAttendees = Array.isArray(event.attendees) && event.attendees.length > 0;
  const prepPending = fetcher.formData?.get("intent") === "prep";
  const isEditSubmitting = fetcher.state !== "idle" && fetcher.formData?.get("intent") === "edit";

  // Close edit form on confirmed success only (CS-13: was a render-phase setState
  // that fired on ANY fetcher completion). Inline error otherwise.
  useEffect(() => {
    if (editingRef.current && fetcher.state === "idle" && fetcher.data) {
      editingRef.current = false;
      if (fetcher.data.ok) {
        setIsEditing(false);
        setEditError(null);
        revalidator.revalidate();
      } else {
        setEditError(fetcher.data.error ?? "Failed to save changes");
      }
    }
  }, [fetcher.state, fetcher.data, revalidator]);

  const handleEditSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setEditError(null);
    const fd = new FormData(e.currentTarget);
    const startLocal = fd.get("start_at") as string;
    const endLocal = fd.get("end_at") as string;
    if (startLocal && endLocal && new Date(endLocal) <= new Date(startLocal)) {
      setEditError("End time must be after start time");
      return;
    }
    if (startLocal) fd.set("start_at", localInputToUtcIso(startLocal, tz));
    if (endLocal) fd.set("end_at", localInputToUtcIso(endLocal, tz));
    editingRef.current = true;
    fetcher.submit(fd, { method: "post" });
  };

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
                    {formatDateTimeInTz(event.start_at, tz)} — {formatTimeInTz(event.end_at, tz)}
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
                {!isEditing && (
                  <button
                    onClick={() => setIsEditing(true)}
                    className="flex items-center gap-1 text-xs text-zinc-500 hover:text-zinc-200 transition-colors mt-1"
                  >
                    <Edit2 className="h-3 w-3" />
                    Edit
                  </button>
                )}
              </div>
            </div>
          </div>

          {/* Edit form */}
          {isEditing && (
            <div className="rounded-xl border border-zinc-700 bg-zinc-900 px-6 py-5">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-sm font-semibold text-zinc-200">Edit Event</h2>
                <button
                  onClick={() => setIsEditing(false)}
                  className="text-zinc-500 hover:text-zinc-200 transition-colors"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>

              <fetcher.Form method="post" onSubmit={handleEditSubmit} className="space-y-4">
                <input type="hidden" name="intent" value="edit" />
                {videoType === "meet" && (
                  <input type="hidden" name="add_google_meet" value="true" />
                )}

                <div>
                  <label className="block text-xs text-zinc-500 mb-1">Title</label>
                  <input
                    name="title"
                    defaultValue={event.title}
                    className="w-full bg-zinc-800 border border-zinc-700 rounded-lg px-3 py-2 text-sm text-zinc-200 focus:outline-none focus:border-emerald-500"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs text-zinc-500 mb-1">Start</label>
                    <input
                      name="start_at"
                      type="datetime-local"
                      defaultValue={utcIsoToLocalInput(event.start_at, tz)}
                      className="w-full bg-zinc-800 border border-zinc-700 rounded-lg px-3 py-2 text-sm text-zinc-200 focus:outline-none focus:border-emerald-500"
                    />
                  </div>
                  <div>
                    <label className="block text-xs text-zinc-500 mb-1">End</label>
                    <input
                      name="end_at"
                      type="datetime-local"
                      defaultValue={utcIsoToLocalInput(event.end_at, tz)}
                      className="w-full bg-zinc-800 border border-zinc-700 rounded-lg px-3 py-2 text-sm text-zinc-200 focus:outline-none focus:border-emerald-500"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs text-zinc-500 mb-1">Location</label>
                  <input
                    name="location"
                    defaultValue={event.location ?? ""}
                    placeholder="Office, address, etc."
                    className="w-full bg-zinc-800 border border-zinc-700 rounded-lg px-3 py-2 text-sm text-zinc-200 placeholder-zinc-600 focus:outline-none focus:border-emerald-500"
                  />
                </div>

                <div>
                  <label className="block text-xs text-zinc-500 mb-1.5">
                    <Video className="inline h-3 w-3 mr-1" />
                    Video Conferencing
                  </label>
                  {event.meeting_link && videoType === "none" && (
                    <div className="mb-2 text-xs text-zinc-400 flex items-center gap-1.5">
                      <Video className="h-3 w-3 text-zinc-500" />
                      <a
                        href={event.meeting_link}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-emerald-400 hover:text-emerald-300 truncate"
                      >
                        {event.meeting_link}
                      </a>
                    </div>
                  )}
                  <div className="flex gap-2 mb-2">
                    {(["none", "meet", "teams"] as const).map((type) => (
                      <button
                        key={type}
                        type="button"
                        onClick={() => setVideoType(type)}
                        className={`px-2.5 py-1 text-xs rounded border transition-colors ${
                          videoType === type
                            ? "bg-emerald-600 border-emerald-500 text-white"
                            : "bg-zinc-800 border-zinc-700 text-zinc-400 hover:border-zinc-500"
                        }`}
                      >
                        {type === "none"
                          ? "Keep existing"
                          : type === "meet"
                          ? "Add Meet"
                          : "Teams / Zoom"}
                      </button>
                    ))}
                  </div>
                  {videoType === "teams" && (
                    <input
                      name="meeting_link"
                      defaultValue={event.meeting_link ?? ""}
                      placeholder="Paste Teams or Zoom meeting URL"
                      className="w-full bg-zinc-800 border border-zinc-700 rounded-lg px-3 py-2 text-sm text-zinc-200 placeholder-zinc-600 focus:outline-none focus:border-emerald-500"
                    />
                  )}
                  {videoType === "meet" && (
                    <p className="text-xs text-zinc-500">A new Google Meet link will be generated.</p>
                  )}
                </div>

                <div>
                  <label className="block text-xs text-zinc-500 mb-1">Description</label>
                  <textarea
                    name="description"
                    defaultValue={event.description ?? ""}
                    rows={3}
                    className="w-full bg-zinc-800 border border-zinc-700 rounded-lg px-3 py-2 text-sm text-zinc-200 placeholder-zinc-600 focus:outline-none focus:border-emerald-500 resize-none"
                  />
                </div>

                {editError && <p className="text-xs text-red-400">{editError}</p>}
                <div className="flex gap-3 pt-1">
                  <button
                    type="button"
                    onClick={() => { setIsEditing(false); setEditError(null); }}
                    className="flex-1 py-2 text-sm text-zinc-400 hover:text-zinc-200 border border-zinc-700 rounded-lg transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={isEditSubmitting}
                    className="flex-1 py-2 text-sm font-medium bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg disabled:opacity-50 transition-colors"
                  >
                    {isEditSubmitting ? "Saving..." : "Save Changes"}
                  </button>
                </div>
              </fetcher.Form>
            </div>
          )}

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

          {/* Delete event (non-time-block) — removes locally and from Google */}
          {!event.is_time_block && (
            <fetcher.Form
              method="post"
              onSubmit={(e) => {
                if (!window.confirm("Delete this event? It will also be removed from Google Calendar.")) {
                  e.preventDefault();
                }
              }}
            >
              <input type="hidden" name="intent" value="delete" />
              <button
                type="submit"
                aria-label="Delete event"
                className="text-xs text-red-500 hover:text-red-400 transition-colors"
              >
                Delete event
              </button>
            </fetcher.Form>
          )}
        </div>
      </main>
    </div>
  );
}
