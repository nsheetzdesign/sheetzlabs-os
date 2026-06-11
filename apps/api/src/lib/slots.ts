/**
 * Timezone-correct availability slot engine (BK-2).
 *
 * All day-of-week and window math runs in the host's IANA availability timezone,
 * not the worker's UTC. Workers ship full `Intl`, so we derive the UTC offset for
 * a given wall-clock instant via `Intl.DateTimeFormat` and invert it — no external
 * dependency. This is the single source of truth for slot generation, used by both
 * the public slot-display endpoint and the confirmation-time validation.
 */

export interface DayWindow {
  start: string; // "HH:MM"
  end: string; // "HH:MM"
}

export interface DayRule {
  enabled: boolean;
  slots: DayWindow[];
}

export interface AvailabilityRules {
  timezone: string;
  days?: Record<string, DayRule | undefined>;
  buffer_after_minutes?: number;
  minimum_notice_hours?: number;
}

export interface BusyInterval {
  start: Date;
  end: Date;
}

const WEEKDAYS = [
  "sunday",
  "monday",
  "tuesday",
  "wednesday",
  "thursday",
  "friday",
  "saturday",
];

/** Offset (ms) such that `utcInstant + offset` reads as the wall clock in `tz`. */
function tzOffsetMs(instant: Date, tz: string): number {
  const dtf = new Intl.DateTimeFormat("en-US", {
    timeZone: tz,
    hour12: false,
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
  });
  const parts = dtf.formatToParts(instant);
  const map: Record<string, number> = {};
  for (const p of parts) {
    if (p.type !== "literal") map[p.type] = Number(p.value);
  }
  // Intl renders hour "24" at midnight in some engines — normalize to 0.
  const hour = map.hour === 24 ? 0 : map.hour;
  const asUTC = Date.UTC(map.year, map.month - 1, map.day, hour, map.minute, map.second);
  return asUTC - instant.getTime();
}

/**
 * Convert a wall-clock date+time in `tz` to the corresponding UTC instant.
 * e.g. zonedTimeToUtc("2026-06-11", "09:00", "America/Chicago") → 14:00Z.
 */
export function zonedTimeToUtc(dateStr: string, timeStr: string, tz: string): Date {
  const [y, mo, d] = dateStr.split("-").map(Number);
  const [h, mi] = timeStr.split(":").map(Number);
  const naiveUtc = Date.UTC(y, mo - 1, d, h, mi, 0);
  // First-pass offset, then refine once to settle DST transition boundaries.
  let offset = tzOffsetMs(new Date(naiveUtc), tz);
  const refined = tzOffsetMs(new Date(naiveUtc - offset), tz);
  if (refined !== offset) offset = refined;
  return new Date(naiveUtc - offset);
}

/** The calendar date (YYYY-MM-DD) that `instant` falls on, in `tz`. */
export function utcToZonedDateStr(instant: Date, tz: string): string {
  // en-CA formats as YYYY-MM-DD.
  return new Intl.DateTimeFormat("en-CA", {
    timeZone: tz,
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).format(instant);
}

/** Lowercase weekday name (e.g. "monday") for `dateStr` in `tz`. */
export function zonedWeekday(dateStr: string, tz: string): string {
  const noon = zonedTimeToUtc(dateStr, "12:00", tz);
  const idx = new Date(noon.getTime() + tzOffsetMs(noon, tz)).getUTCDay();
  return WEEKDAYS[idx];
}

/**
 * Compute the available start instants (ISO UTC strings) for a single date.
 * Enforces day windows, minimum notice, buffer-after stride, and busy conflicts.
 * `now` is injectable for testing; defaults to the current instant.
 */
export function computeSlotsForDate(params: {
  rules: AvailabilityRules;
  date: string; // YYYY-MM-DD (host-timezone calendar date)
  durationMinutes: number;
  busy: BusyInterval[];
  now?: Date;
}): string[] {
  const { rules, date, durationMinutes, busy } = params;
  const tz = rules.timezone || "America/Chicago";
  const now = params.now ?? new Date();

  const dayName = zonedWeekday(date, tz);
  const dayRule = rules.days?.[dayName];
  if (!dayRule?.enabled) return [];

  const bufferAfter = rules.buffer_after_minutes ?? 15;
  const minNoticeMs = (rules.minimum_notice_hours ?? 24) * 60 * 60 * 1000;
  const durationMs = durationMinutes * 60000;
  const strideMs = (durationMinutes + bufferAfter) * 60000;

  const slots: string[] = [];
  for (const window of dayRule.slots ?? []) {
    const windowStart = zonedTimeToUtc(date, window.start, tz);
    const windowEnd = zonedTimeToUtc(date, window.end, tz);

    let current = windowStart.getTime();
    while (current + durationMs <= windowEnd.getTime()) {
      const slotStart = new Date(current);
      const slotEnd = new Date(current + durationMs);

      const hasConflict = busy.some((b) => slotStart < b.end && slotEnd > b.start);
      const hasNotice = current - now.getTime() >= minNoticeMs;

      if (!hasConflict && hasNotice) {
        slots.push(slotStart.toISOString());
      }
      current += strideMs;
    }
  }

  return slots;
}
