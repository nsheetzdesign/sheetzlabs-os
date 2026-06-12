/**
 * IANA-timezone date math for the calendar (CS-5 / CS-6 / CS-12).
 *
 * The web worker runs in UTC, so any `new Date(...).getHours()` / `getDay()` on
 * the server computes UTC wall-clock — shifting every column a day for US users
 * and creating SSR/CSR hydration mismatches. These helpers do all wall-clock math
 * in an explicit IANA tz using `Intl` offset math, so server and client agree.
 */
export const DEFAULT_TZ = "America/Chicago";
const DAY_MS = 86_400_000;
/** Wall-clock parts of an instant in a given IANA tz. */
export function getZonedParts(date, tz) {
    const dtf = new Intl.DateTimeFormat("en-US", {
        timeZone: tz,
        year: "numeric",
        month: "2-digit",
        day: "2-digit",
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit",
        hour12: false,
    });
    const parts = {};
    for (const p of dtf.formatToParts(date)) {
        if (p.type !== "literal")
            parts[p.type] = p.value;
    }
    let hour = parseInt(parts.hour, 10);
    if (hour === 24)
        hour = 0; // some engines emit "24" for midnight
    return {
        year: +parts.year,
        month: +parts.month,
        day: +parts.day,
        hour,
        minute: +parts.minute,
        second: +parts.second,
    };
}
/** Day-of-week (0=Sun) for a calendar Y/M/D. */
export function dayOfWeek(year, month, day) {
    return new Date(Date.UTC(year, month - 1, day)).getUTCDay();
}
/** The UTC instant whose wall-clock time in `tz` is the given Y/M/D H:M. */
export function zonedWallTimeToUtc(year, month, day, hour, minute, tz) {
    const utcGuess = Date.UTC(year, month - 1, day, hour, minute, 0);
    const p = getZonedParts(new Date(utcGuess), tz);
    const asUtc = Date.UTC(p.year, p.month - 1, p.day, p.hour, p.minute, p.second);
    const offset = asUtc - utcGuess; // (tz local) − UTC, in ms
    return new Date(utcGuess - offset);
}
/** Minutes from local midnight for an instant, in `tz`. */
export function zonedMinutesOfDay(date, tz) {
    const p = getZonedParts(date, tz);
    return p.hour * 60 + p.minute;
}
/** UTC instant of local midnight for a calendar day in `tz`. */
export function dayStartUtc(d, tz) {
    return zonedWallTimeToUtc(d.year, d.month, d.day, 0, 0, tz);
}
/**
 * Week window in `tz`: the 7 day descriptors (Sun…Sat) plus the window's UTC
 * start/end instants (end exclusive). `weekOffset` shifts by whole weeks.
 */
export function getWeekBounds(now, tz, weekOffset = 0) {
    const base = new Date(now.getTime() + weekOffset * 7 * DAY_MS);
    const p = getZonedParts(base, tz);
    const dow = dayOfWeek(p.year, p.month, p.day);
    const sundayMidnightUtc = Date.UTC(p.year, p.month - 1, p.day) - dow * DAY_MS;
    const days = [];
    for (let i = 0; i < 7; i++) {
        const dt = new Date(sundayMidnightUtc + i * DAY_MS);
        days.push({
            year: dt.getUTCFullYear(),
            month: dt.getUTCMonth() + 1,
            day: dt.getUTCDate(),
            weekday: dt.getUTCDay(),
        });
    }
    const startUtc = dayStartUtc(days[0], tz);
    const lastStart = dayStartUtc(days[6], tz);
    const windowEnd = new Date(lastStart.getTime() + DAY_MS);
    return { days, startUtc, windowEnd };
}
/** Single-day window in `tz`. `dayOffset` shifts by whole days. */
export function getDayBounds(now, tz, dayOffset = 0) {
    const base = new Date(now.getTime() + dayOffset * DAY_MS);
    const p = getZonedParts(base, tz);
    const day = {
        year: p.year,
        month: p.month,
        day: p.day,
        weekday: dayOfWeek(p.year, p.month, p.day),
    };
    const startUtc = dayStartUtc(day, tz);
    const windowEnd = new Date(startUtc.getTime() + DAY_MS);
    return { days: [day], startUtc, windowEnd };
}
const WEEKDAY_LABELS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
export function weekdayLabel(weekday) {
    return WEEKDAY_LABELS[weekday] ?? "";
}
/** Format an instant's time in `tz` (e.g. "9:00 AM"). */
export function formatTimeInTz(iso, tz) {
    return new Date(iso).toLocaleTimeString("en-US", {
        timeZone: tz,
        hour: "numeric",
        minute: "2-digit",
    });
}
/** Format an instant's date+time in `tz`. */
export function formatDateTimeInTz(iso, tz) {
    return new Date(iso).toLocaleString("en-US", {
        timeZone: tz,
        weekday: "short",
        month: "short",
        day: "numeric",
        hour: "numeric",
        minute: "2-digit",
    });
}
/**
 * Convert a `<input type="datetime-local">` value (naive wall-clock in the user's
 * tz) to a UTC ISO string. Done client-side before submit so the UTC server never
 * parses a naive datetime as UTC (CS-6).
 */
export function localInputToUtcIso(value, tz) {
    // value: "YYYY-MM-DDTHH:mm"
    const m = value.match(/^(\d{4})-(\d{2})-(\d{2})T(\d{2}):(\d{2})/);
    if (!m)
        return new Date(value).toISOString();
    const [, y, mo, d, h, mi] = m;
    return zonedWallTimeToUtc(+y, +mo, +d, +h, +mi, tz).toISOString();
}
/** Convert an instant to a `datetime-local` value in `tz` (for edit forms). */
export function utcIsoToLocalInput(iso, tz) {
    const p = getZonedParts(new Date(iso), tz);
    const pad = (n) => String(n).padStart(2, "0");
    return `${p.year}-${pad(p.month)}-${pad(p.day)}T${pad(p.hour)}:${pad(p.minute)}`;
}
