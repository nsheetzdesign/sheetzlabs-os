// Shared API response wrapper
export type ApiResponse<T> =
  | { data: T; error: null }
  | { data: null; error: string };

// Add domain types here as the project grows

export * from "./database.types";
