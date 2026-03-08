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
