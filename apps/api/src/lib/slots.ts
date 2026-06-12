/**
 * Timezone-correct availability slot engine (BK-2).
 *
 * All day-of-week and window math runs in the host's IANA availability timezone,
 * not the worker's UTC. Workers ship full `Intl`, so we derive the UTC offset for
 * a given wall-clock instant via `Intl.DateTimeFormat` and invert it — no external
 * dependency. This is the single source of truth for slot generation, used by both
 * the public slot-display endpoint and the confirmation-time validation.
 */

// AvailabilityRules / DayRule / DayWindow now live in @sheetzlabs/shared so the
// web editor, API, and slot engine share one definition (Prompt 54B, XC-4).
// Re-exported here for back-compat with existing API importers.
import type {
  AvailabilityRules,
  DayRule,
  DayWindow,
} from "@sheetzlabs/shared";
export type { AvailabilityRules, DayRule, DayWindow };

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

/** True when `date` (YYYY-MM-DD, host tz) is within [today, today + window] in `tz`. */
export function isWithinRollingWindow(
  rules: AvailabilityRules,
  date: string,
  tz: string,
  now: Date,
): boolean {
  const windowDays = rules.date_range_days;
  const todayStr = utcToZonedDateStr(now, tz);
  if (date < todayStr) return false; // past
  if (windowDays == null) return true;
  const maxInstant = new Date(now.getTime() + windowDays * 24 * 60 * 60 * 1000);
  const maxStr = utcToZonedDateStr(maxInstant, tz);
  // ISO date strings compare lexicographically === chronologically.
  return date <= maxStr;
}

/**
 * Compute the available start instants (ISO UTC strings) for a single date.
 * Enforces day windows, minimum notice, the rolling booking window, the daily
 * cap, a fixed slot increment (stride decoupled from duration), both buffers
 * (before + after, applied to the candidate's busy footprint), and busy
 * conflicts. `now` is injectable for testing; defaults to the current instant.
 */
export function computeSlotsForDate(params: {
  rules: AvailabilityRules;
  date: string; // YYYY-MM-DD (host-timezone calendar date)
  durationMinutes: number;
  busy: BusyInterval[];
  now?: Date;
  /** Non-cancelled bookings already taken on this date (for the daily cap). */
  bookedToday?: number;
}): string[] {
  const { rules, date, durationMinutes, busy } = params;
  const tz = rules.timezone || "America/Chicago";
  const now = params.now ?? new Date();

  // Rolling window: a date outside [today, today + N] offers nothing.
  if (!isWithinRollingWindow(rules, date, tz, now)) return [];

  // Daily cap: a date already at capacity offers nothing.
  const cap = rules.max_bookings_per_day;
  if (cap != null && (params.bookedToday ?? 0) >= cap) return [];

  const dayName = zonedWeekday(date, tz);
  const dayRule = rules.days?.[dayName];
  if (!dayRule?.enabled) return [];

  const bufferBeforeMs = (rules.buffer_before_minutes ?? 0) * 60000;
  const bufferAfterMs = (rules.buffer_after_minutes ?? 15) * 60000;
  const minNoticeMs = (rules.minimum_notice_hours ?? 24) * 60 * 60 * 1000;
  const durationMs = durationMinutes * 60000;
  // Stride is the slot increment (defaults to the duration), NOT duration+buffer.
  const incrementMin = rules.slot_increment_minutes ?? durationMinutes;
  const strideMs = Math.max(1, incrementMin) * 60000;

  // Dedup by emitted instant: overlapping/adjacent windows (e.g. 09:00–11:00 +
  // 10:00–12:00) would otherwise emit 10:00/10:30 twice → duplicate buttons on the
  // public grid (NS-SLOT-1). Collect into a Set, then return sorted-ascending.
  const seen = new Set<number>();
  for (const window of dayRule.slots ?? []) {
    const windowStart = zonedTimeToUtc(date, window.start, tz);
    const windowEnd = zonedTimeToUtc(date, window.end, tz);

    let current = windowStart.getTime();
    while (current + durationMs <= windowEnd.getTime()) {
      if (!seen.has(current)) {
        const slotEnd = current + durationMs;
        // The candidate's footprint (incl. buffers) must not touch any busy block.
        const bufStart = current - bufferBeforeMs;
        const bufEnd = slotEnd + bufferAfterMs;
        const hasConflict = busy.some((b) => bufStart < b.end.getTime() && bufEnd > b.start.getTime());
        const hasNotice = current - now.getTime() >= minNoticeMs;
        if (!hasConflict && hasNotice) seen.add(current);
      }
      current += strideMs;
    }
  }

  return Array.from(seen)
    .sort((a, b) => a - b)
    .map((ms) => new Date(ms).toISOString());
}

export type ValidationResult =
  | { ok: true }
  | { ok: false; code: 409 | 422; error: string };

/**
 * Server-side gate run at confirmation time (create + reschedule). Rejects any
 * request the public slot grid would never have offered — the year-2099 POST,
 * an off-increment time, a slot past the rolling window, a day over its cap, or
 * a freshly-taken slot. Returns 422 for malformed/out-of-policy requests and
 * 409 for capacity/conflict races. This is the authority; the UI is advisory.
 */
export function validateBookingRequest(params: {
  rules: AvailabilityRules;
  durationMinutes: number;
  startUtc: Date;
  busy: BusyInterval[];
  bookedToday: number;
  now?: Date;
}): ValidationResult {
  const { rules, durationMinutes, startUtc, busy, bookedToday } = params;
  const tz = rules.timezone || "America/Chicago";
  const now = params.now ?? new Date();

  if (isNaN(startUtc.getTime())) {
    return { ok: false, code: 422, error: "Invalid start time." };
  }

  const date = utcToZonedDateStr(startUtc, tz);

  // Rolling window + past — kills the year-2099 POST and any stale slot.
  if (!isWithinRollingWindow(rules, date, tz, now)) {
    return { ok: false, code: 422, error: "That time is outside the booking window." };
  }

  // Daily cap (capacity → 409 so the guest is told to pick another day).
  const cap = rules.max_bookings_per_day;
  if (cap != null && bookedToday >= cap) {
    return { ok: false, code: 409, error: "That day is fully booked." };
  }

  // On-grid check: recompute the grid for this date IGNORING busy, and require
  // the requested instant to be one of the offered starts (enforces day-enabled,
  // within-window, on-increment, and minimum-notice). Off-grid → 422.
  const grid = computeSlotsForDate({
    rules,
    date,
    durationMinutes,
    busy: [],
    now,
    bookedToday: 0,
  });
  if (!grid.includes(startUtc.toISOString())) {
    return { ok: false, code: 422, error: "That time isn't an available slot." };
  }

  // Finally, the conflict race against current busy (409).
  const durationMs = durationMinutes * 60000;
  const bufBefore = (rules.buffer_before_minutes ?? 0) * 60000;
  const bufAfter = (rules.buffer_after_minutes ?? 15) * 60000;
  const bufStart = startUtc.getTime() - bufBefore;
  const bufEnd = startUtc.getTime() + durationMs + bufAfter;
  const conflict = busy.some((b) => bufStart < b.end.getTime() && bufEnd > b.start.getTime());
  if (conflict) {
    return { ok: false, code: 409, error: "That time was just taken." };
  }

  return { ok: true };
}
