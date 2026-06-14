import type { Config } from "tailwindcss";

export default {
  content: ["./app/**/{**,.client,.server}/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      colors: {
        brand: {
          DEFAULT: "#10B981",
          light: "#34D399",
          dark: "#059669",
        },
        surface: {
          0: "#09090b",
          1: "#18181b",
          2: "#27272a",
          3: "#3f3f46",
        },
        // Semantic status tokens (dark-theme tuned). Used by the calendar
        // meeting-proximity dot (Prompt 68): success=clear, caution=≤15m,
        // warning=≤5m, danger=in-progress.
        success: "#22C55E",
        caution: "#EAB308",
        warning: "#F97316",
        danger: "#EF4444",
      },
      fontFamily: {
        sans: ["IBM Plex Sans", "system-ui", "sans-serif"],
        mono: ["IBM Plex Mono", "monospace"],
      },
    },
  },
  plugins: [],
} satisfies Config;
