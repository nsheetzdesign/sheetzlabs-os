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
