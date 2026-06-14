/**
 * Meeting-proximity classifier for the Calendar nav dot (Prompt 68).
 *
 * Pure function: given "now" (epoch ms) and a list of calendar events, return the
 * proximity level + the relevant meeting's title/start for the tooltip. The dot
 * colour is driven entirely by `level`; the band thresholds are (unambiguously):
 *
 *   in-progress  → danger  (red)    — a meeting is happening now (start ≤ now < end)
 *   soon         → warning (orange) — next meeting starts in ≤ 5 minutes
 *   upcoming     → caution (yellow) — next meeting starts in ≤ 15 minutes
 *   clear        → success (green)  — next meeting is > 15 minutes away, or none
 *
 * The 15–30m band is GREEN: green means "you're clear for ~30m". There is no
 * separate colour between 15 and 30 minutes.
 *
 * Timezone note: `start_at`/`end_at` are absolute UTC ISO instants, so proximity is
 * a pure epoch-ms comparison — inherently tz-correct, no wall-clock math needed.
 * (The tooltip's *displayed* start time is formatted in the user's tz by the caller
 * via lib/tz.) All-day events and time blocks are excluded — they aren't time-bound
 * meetings.
 */

export type ProximityLevel = "in-progress" | "soon" | "upcoming" | "clear";

export interface ProximityEvent {
  title?: string | null;
  start_at: string;
  end_at: string;
  is_time_block?: boolean | null;
  all_day?: boolean | null;
}

export interface ProximityResult {
  level: ProximityLevel;
  /** Title of the in-progress meeting (in-progress) or the next one (soon/upcoming/clear). */
  title: string | null;
  /** ISO start of that meeting, or null when there's none. */
  startAt: string | null;
}

/** Minutes from `now` at/under which the next meeting flips to each band. */
export const SOON_MINUTES = 5;
export const UPCOMING_MINUTES = 15;

const CLEAR: ProximityResult = { level: "clear", title: null, startAt: null };

export function meetingProximity(nowMs: number, events: ProximityEvent[]): ProximityResult {
  // Real meetings only: drop time blocks, all-day events, and unparseable rows.
  const meetings = (events ?? [])
    .filter((e) => e && !e.is_time_block && !e.all_day && e.start_at && e.end_at)
    .map((e) => ({ ev: e, start: Date.parse(e.start_at), end: Date.parse(e.end_at) }))
    .filter((m) => Number.isFinite(m.start) && Number.isFinite(m.end))
    .sort((a, b) => a.start - b.start);

  // In progress wins outright (red).
  const current = meetings.find((m) => m.start <= nowMs && m.end > nowMs);
  if (current) {
    return { level: "in-progress", title: current.ev.title ?? null, startAt: current.ev.start_at };
  }

  // Otherwise classify by how soon the next meeting starts.
  const next = meetings.find((m) => m.start > nowMs);
  if (!next) return CLEAR;

  const minutesUntil = (next.start - nowMs) / 60_000;
  let level: ProximityLevel;
  if (minutesUntil <= SOON_MINUTES) level = "soon";
  else if (minutesUntil <= UPCOMING_MINUTES) level = "upcoming";
  else level = "clear";

  return { level, title: next.ev.title ?? null, startAt: next.ev.start_at };
}
