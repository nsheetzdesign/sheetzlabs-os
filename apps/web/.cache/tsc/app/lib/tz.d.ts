/**
 * IANA-timezone date math for the calendar (CS-5 / CS-6 / CS-12).
 *
 * The web worker runs in UTC, so any `new Date(...).getHours()` / `getDay()` on
 * the server computes UTC wall-clock — shifting every column a day for US users
 * and creating SSR/CSR hydration mismatches. These helpers do all wall-clock math
 * in an explicit IANA tz using `Intl` offset math, so server and client agree.
 */
export declare const DEFAULT_TZ = "America/Chicago";
export type ZonedParts = {
    year: number;
    month: number;
    day: number;
    hour: number;
    minute: number;
    second: number;
};
export type DayDescriptor = {
    year: number;
    month: number;
    day: number;
    weekday: number;
};
/** Wall-clock parts of an instant in a given IANA tz. */
export declare function getZonedParts(date: Date, tz: string): ZonedParts;
/** Day-of-week (0=Sun) for a calendar Y/M/D. */
export declare function dayOfWeek(year: number, month: number, day: number): number;
/** The UTC instant whose wall-clock time in `tz` is the given Y/M/D H:M. */
export declare function zonedWallTimeToUtc(year: number, month: number, day: number, hour: number, minute: number, tz: string): Date;
/** Minutes from local midnight for an instant, in `tz`. */
export declare function zonedMinutesOfDay(date: Date, tz: string): number;
/** UTC instant of local midnight for a calendar day in `tz`. */
export declare function dayStartUtc(d: DayDescriptor, tz: string): Date;
/**
 * Week window in `tz`: the 7 day descriptors (Sun…Sat) plus the window's UTC
 * start/end instants (end exclusive). `weekOffset` shifts by whole weeks.
 */
export declare function getWeekBounds(now: Date, tz: string, weekOffset?: number): {
    days: DayDescriptor[];
    startUtc: Date;
    windowEnd: Date;
};
/** Single-day window in `tz`. `dayOffset` shifts by whole days. */
export declare function getDayBounds(now: Date, tz: string, dayOffset?: number): {
    days: DayDescriptor[];
    startUtc: Date;
    windowEnd: Date;
};
export declare function weekdayLabel(weekday: number): string;
/** Format an instant's time in `tz` (e.g. "9:00 AM"). */
export declare function formatTimeInTz(iso: string, tz: string): string;
/** Format an instant's date+time in `tz`. */
export declare function formatDateTimeInTz(iso: string, tz: string): string;
/**
 * Convert a `<input type="datetime-local">` value (naive wall-clock in the user's
 * tz) to a UTC ISO string. Done client-side before submit so the UTC server never
 * parses a naive datetime as UTC (CS-6).
 */
export declare function localInputToUtcIso(value: string, tz: string): string;
/** Convert an instant to a `datetime-local` value in `tz` (for edit forms). */
export declare function utcIsoToLocalInput(iso: string, tz: string): string;
