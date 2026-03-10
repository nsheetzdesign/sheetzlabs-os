/**
 * Forces email HTML to use light text colors for dark mode display.
 * Wraps in a container with CSS overrides that win against inline styles.
 */
export function forceEmailDarkMode(html: string): string {
  if (!html) return '';

  return `
    <div class="email-content-wrapper">
      <style>
        .email-content-wrapper,
        .email-content-wrapper * {
          color: #e4e4e7 !important;
          background-color: transparent !important;
        }
        .email-content-wrapper a {
          color: #34d399 !important;
          text-decoration: underline !important;
        }
        .email-content-wrapper a:hover {
          color: #6ee7b7 !important;
        }
        .email-content-wrapper blockquote {
          border-left: 2px solid #3f3f46 !important;
          padding-left: 1rem !important;
          margin-left: 0 !important;
          color: #a1a1aa !important;
        }
        .email-content-wrapper img {
          max-width: 100% !important;
          height: auto !important;
        }
        .email-content-wrapper table {
          border-color: #3f3f46 !important;
        }
        .email-content-wrapper td,
        .email-content-wrapper th {
          border-color: #3f3f46 !important;
        }
        .email-content-wrapper hr {
          border-color: #3f3f46 !important;
        }
      </style>
      ${html}
    </div>
  `;
}
