import { useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

/**
 * Month-grid date picker for the public booking page (BK-18). Replaces the flat
 * date strip. All keys are plain YYYY-MM-DD built from local calendar parts (NOT
 * toISOString) so an evening US guest never sees the day shifted by the UTC
 * off-by-one. Availability/within-window is decided by the caller.
 */

const DOW = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

export function dateKey(y: number, m: number, d: number): string {
  return `${y}-${String(m + 1).padStart(2, "0")}-${String(d).padStart(2, "0")}`;
}

function parseKey(key: string): { y: number; m: number; d: number } {
  const [y, m, d] = key.split("-").map(Number);
  return { y, m: m - 1, d };
}

export function MonthGrid({
  selected,
  onSelect,
  isAvailable,
  todayKey,
  maxKey,
}: {
  selected: string | null;
  onSelect: (key: string) => void;
  /** Weekday-enabled + within the rolling window (caller decides). */
  isAvailable: (key: string) => boolean;
  todayKey: string;
  maxKey: string;
}) {
  const today = parseKey(todayKey);
  const max = parseKey(maxKey);
  const [cursor, setCursor] = useState({ y: today.y, m: today.m });

  const firstOfMonth = new Date(cursor.y, cursor.m, 1);
  const startWeekday = firstOfMonth.getDay();
  const daysInMonth = new Date(cursor.y, cursor.m + 1, 0).getDate();

  // Bound month navigation to [current month, month containing maxKey].
  const atMinMonth = cursor.y === today.y && cursor.m === today.m;
  const atMaxMonth = cursor.y === max.y && cursor.m === max.m;

  const cells: (number | null)[] = [];
  for (let i = 0; i < startWeekday; i++) cells.push(null);
  for (let d = 1; d <= daysInMonth; d++) cells.push(d);

  const monthLabel = firstOfMonth.toLocaleDateString(undefined, { month: "long", year: "numeric" });

  return (
    <div>
      <div className="flex items-center justify-between mb-3">
        <button
          type="button"
          onClick={() => setCursor((c) => (c.m === 0 ? { y: c.y - 1, m: 11 } : { y: c.y, m: c.m - 1 }))}
          disabled={atMinMonth}
          aria-label="Previous month"
          className="p-1 text-zinc-400 hover:text-zinc-100 disabled:opacity-30 disabled:cursor-not-allowed"
        >
          <ChevronLeft className="w-4 h-4" />
        </button>
        <span className="text-sm font-medium text-zinc-200">{monthLabel}</span>
        <button
          type="button"
          onClick={() => setCursor((c) => (c.m === 11 ? { y: c.y + 1, m: 0 } : { y: c.y, m: c.m + 1 }))}
          disabled={atMaxMonth}
          aria-label="Next month"
          className="p-1 text-zinc-400 hover:text-zinc-100 disabled:opacity-30 disabled:cursor-not-allowed"
        >
          <ChevronRight className="w-4 h-4" />
        </button>
      </div>

      <div className="grid grid-cols-7 gap-1 mb-1">
        {DOW.map((d) => (
          <div key={d} className="text-center text-[10px] text-zinc-600 py-1">{d}</div>
        ))}
      </div>

      <div className="grid grid-cols-7 gap-1">
        {cells.map((d, i) => {
          if (d === null) return <div key={`e${i}`} />;
          const key = dateKey(cursor.y, cursor.m, d);
          const available = isAvailable(key);
          const isSelected = key === selected;
          const isToday = key === todayKey;
          return (
            <button
              key={key}
              type="button"
              data-date={key}
              disabled={!available}
              onClick={() => onSelect(key)}
              aria-label={`${monthLabel} ${d}${available ? "" : " (unavailable)"}`}
              aria-pressed={isSelected}
              className={[
                "aspect-square rounded-lg text-sm flex items-center justify-center transition-colors",
                isSelected
                  ? "bg-emerald-600 text-white font-medium"
                  : available
                    ? "bg-zinc-800 text-zinc-200 hover:bg-zinc-700"
                    : "text-zinc-700 cursor-not-allowed",
                isToday && !isSelected ? "ring-1 ring-emerald-500/40" : "",
              ].join(" ")}
            >
              {d}
            </button>
          );
        })}
      </div>
    </div>
  );
}
