// Shared API response wrapper
export type ApiResponse<T> =
  | { data: T; error: null }
  | { data: null; error: string };

// Add domain types here as the project grows

export * from "./database.types";

// Convenience row types
export type { Database } from "./database.types";
import type { Database } from "./database.types";
export type Venture = Database["public"]["Tables"]["ventures"]["Row"];
export type PipelineItem = Database["public"]["Tables"]["pipeline"]["Row"];
export type Task = Database["public"]["Tables"]["tasks"]["Row"];
export type Relationship = Database["public"]["Tables"]["relationships"]["Row"];
export type Revenue = Database["public"]["Tables"]["revenue"]["Row"];
export type VentureConnection =
  Database["public"]["Tables"]["venture_connections"]["Row"];

// Canonical email types (Prompt 54A Part 7, XC-4) — the single source of truth the
// web + API derive from, replacing the previously-divergent ad-hoc interfaces.
export type Email = Database["public"]["Tables"]["emails"]["Row"];
export type EmailAccount = Database["public"]["Tables"]["email_accounts"]["Row"];
export type EmailLabel = Database["public"]["Tables"]["email_labels"]["Row"];
export type EmailDraft = Database["public"]["Tables"]["email_drafts"]["Row"];
/** A label as joined onto an email row for display (id/name/color). */
export type EmailLabelView = Pick<EmailLabel, "id" | "name" | "color">;

// Canonical calendar + booking types (Prompt 54B, XC-4) — single source of truth,
// replacing the triplicated Booking / BookingLink and the divergent local
// CalendarEvent / CalendarAccount interfaces across web, api, and e2e.
export type Booking = Database["public"]["Tables"]["bookings"]["Row"];
export type BookingLink = Database["public"]["Tables"]["booking_links"]["Row"];
export type CalendarEvent = Database["public"]["Tables"]["calendar_events"]["Row"];
export type CalendarAccount =
  Database["public"]["Tables"]["calendar_accounts"]["Row"];

/**
 * Availability config stored in `booking_links.availability_rules` (JSONB).
 * Hand-authored because it's a JSON shape, not a table. This is the single
 * definition the slot engine, the API, and the web editor all share.
 *
 * `days` is keyed by full lowercase weekday name ("monday" … "sunday") to match
 * the data already persisted by the booking-link create flow and the slot engine.
 */
export interface DayWindow {
  start: string; // "HH:MM" wall-clock in `timezone`
  end: string; // "HH:MM"
}
export interface DayRule {
  enabled: boolean;
  slots: DayWindow[];
}
export interface AvailabilityRules {
  /** IANA timezone the windows + date keys are interpreted in. */
  timezone: string;
  /** Per-weekday windows, keyed by full lowercase weekday name. */
  days?: Record<string, DayRule | undefined>;
  /** Gap (minutes) held free before each booking. */
  buffer_before_minutes?: number;
  /** Gap (minutes) held free after each booking. */
  buffer_after_minutes?: number;
  /** How far in advance a guest must book (hours). */
  minimum_notice_hours?: number;
  /** Rolling window: bookings only allowed within today + N days. */
  date_range_days?: number;
  /** Max non-cancelled bookings accepted for this link on a single day. */
  max_bookings_per_day?: number;
  /** Slot stride in minutes (decoupled from duration). Defaults to duration. */
  slot_increment_minutes?: number;
}
