/**
 * Escape a string for safe interpolation into HTML email templates (and the
 * Google Calendar event description/summary, which Google renders as HTML).
 * Guest-supplied values MUST pass through this before landing in any template
 * literal — otherwise a guest can inject arbitrary HTML/links into mail sent
 * from our domain (BK-4).
 */
export function escapeHtml(value: unknown): string {
  if (value === null || value === undefined) return "";
  return String(value)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}
