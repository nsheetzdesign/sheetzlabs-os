import { useEffect, useRef, useState } from "react";
import { X, Lock } from "lucide-react";
import { workApi, type WorkEvent } from "~/lib/work-client";
import { formatTimeInTz } from "~/lib/tz";

/**
 * The Plan view's day-strip (Prompt 67). A SEPARATE, lighter timeline — NOT the
 * calendar's week-grid pipeline. tz-correct: an event's vertical position is its
 * offset from the day's local-midnight UTC instant (`dayStartUtcMs`), so it lines
 * up regardless of the viewer's tz.
 *
 *  • Meetings (is_time_block = false) are FIXED read-only anchors — you plan around
 *    them; they can't be dragged.
 *  • Time blocks (is_time_block = true) are local-only `calendar_events` (no Google
 *    counterpart), so drag-move / resize PATCH the DB directly via /calendar/events
 *    (the API routes `timeblock-` writes straight to the DB — no Google round-trip).
 *  • Dropping a rail task creates a block (POST /calendar/time-blocks) seeded from
 *    its estimate, and stamps the task's planned_date — optimistic, revert on fail.
 */

export const HOUR_HEIGHT = 48; // px per hour
export const SNAP_MIN = 15;
const MIN_BLOCK_MIN = 15;
export const DAY_MIN = 24 * 60;

/**
 * Map a viewport Y to a snapped minute-of-day within a timeline scroll container.
 * Shared by the in-timeline drag (move/resize) and the rail→timeline drop
 * (useTimeboxDrag) so both land on the same 15-min grid.
 */
export function yToMinutesIn(el: HTMLElement, clientY: number): number {
  const rect = el.getBoundingClientRect();
  const y = clientY - rect.top + el.scrollTop;
  const mins = (y / HOUR_HEIGHT) * 60;
  return Math.max(0, Math.min(DAY_MIN - SNAP_MIN, Math.round(mins / SNAP_MIN) * SNAP_MIN));
}

type Override = { startMin: number; endMin: number };

function offsetMinutes(iso: string, dayStartUtcMs: number): number {
  return (Date.parse(iso) - dayStartUtcMs) / 60000;
}

function clampTop(min: number): number {
  return Math.max(0, Math.min(DAY_MIN, min));
}

export function DayTimeline({
  tz,
  dayStartUtcMs,
  isToday,
  meetings,
  blocks,
  onChanged,
  onToast,
  scrollRef: externalScrollRef,
  dropPreviewMin = null,
}: {
  tz: string;
  dayStartUtcMs: number;
  planDate: string;
  isToday: boolean;
  meetings: WorkEvent[];
  blocks: WorkEvent[];
  onChanged: () => void;
  onToast: (message: string, variant?: "default" | "error") => void;
  /** Owned by the Plan view so useTimeboxDrag can hit-test the timeline. */
  scrollRef?: React.RefObject<HTMLDivElement | null>;
  /** Snapped drop minute while a rail task hovers the timeline (else null). */
  dropPreviewMin?: number | null;
}) {
  const internalRef = useRef<HTMLDivElement>(null);
  const scrollRef = externalScrollRef ?? internalRef;
  const [overrides, setOverrides] = useState<Record<string, Override>>({});
  const [mounted, setMounted] = useState(false);
  const [nowMin, setNowMin] = useState(0);

  // Now-line + initial scroll — client-only to avoid hydration drift.
  useEffect(() => {
    setMounted(true);
    const tick = () => setNowMin((Date.now() - dayStartUtcMs) / 60000);
    tick();
    const iv = setInterval(tick, 60_000);
    // Scroll to ~1h before now (or 8am) so the day opens somewhere useful.
    const target = isToday ? Math.max(0, (Date.now() - dayStartUtcMs) / 60000 - 60) : 8 * 60;
    if (scrollRef.current) scrollRef.current.scrollTop = (target / 60) * HOUR_HEIGHT;
    return () => clearInterval(iv);
  }, [dayStartUtcMs, isToday]);

  // ── Block move / resize (pointer drag) ─────────────────────────────────────
  // The move/up handlers are defined per-drag (stable closures) so add/remove use
  // the SAME reference — setOverrides re-renders mid-drag, so component-level
  // handlers would leak (the removed reference wouldn't match the added one).
  function beginDrag(e: React.PointerEvent, ev: WorkEvent, mode: "move" | "resize") {
    e.preventDefault();
    e.stopPropagation();
    const origStart = clampTop(offsetMinutes(ev.start_at, dayStartUtcMs));
    const origEnd = clampTop(offsetMinutes(ev.end_at, dayStartUtcMs));
    const startY = e.clientY;

    const onMove = (me: PointerEvent) => {
      const deltaMin = Math.round(((me.clientY - startY) / HOUR_HEIGHT) * 60 / SNAP_MIN) * SNAP_MIN;
      if (mode === "move") {
        const len = origEnd - origStart;
        const s = Math.min(clampTop(origStart + deltaMin), DAY_MIN - len);
        setOverrides((o) => ({ ...o, [ev.id]: { startMin: s, endMin: s + len } }));
      } else {
        const end = Math.max(origStart + MIN_BLOCK_MIN, Math.min(DAY_MIN, origEnd + deltaMin));
        setOverrides((o) => ({ ...o, [ev.id]: { startMin: origStart, endMin: end } }));
      }
    };
    const onUp = () => {
      window.removeEventListener("pointermove", onMove);
      window.removeEventListener("pointerup", onUp);
      setOverrides((o) => {
        const ov = o[ev.id];
        if (!ov || (ov.startMin === origStart && ov.endMin === origEnd)) return o;
        void commit(ev.id, ov);
        return o;
      });
    };

    window.addEventListener("pointermove", onMove);
    window.addEventListener("pointerup", onUp);
  }

  async function commit(id: string, ov: Override) {
    const start_at = new Date(dayStartUtcMs + ov.startMin * 60000).toISOString();
    const end_at = new Date(dayStartUtcMs + ov.endMin * 60000).toISOString();
    const res = await workApi(`/calendar/events/${id}`, {
      method: "PATCH",
      body: JSON.stringify({ start_at, end_at }),
    });
    if (res.ok) {
      onChanged();
      // Clear override after the parent revalidates with the new server value.
      setTimeout(() => setOverrides((o) => stripKey(o, id)), 400);
    } else {
      setOverrides((o) => stripKey(o, id)); // revert to server position
      onToast("Couldn't move that block.", "error");
    }
  }

  async function deleteBlock(id: string) {
    const res = await workApi(`/calendar/time-blocks/${id}`, { method: "DELETE" });
    if (res.ok) onChanged();
    else onToast("Couldn't remove that block.", "error");
  }

  const hours = Array.from({ length: 24 }, (_, i) => i);

  return (
    <div className="flex h-full min-h-0 flex-col" data-testid="day-timeline">
      <div
        ref={scrollRef}
        className={`relative min-h-0 flex-1 overflow-y-auto rounded-xl border bg-surface-1/30 ${
          dropPreviewMin != null ? "border-brand" : "border-surface-2/50"
        }`}
      >
        <div className="relative" style={{ height: 24 * HOUR_HEIGHT }}>
          {/* Hour gridlines + labels */}
          {hours.map((h) => (
            <div
              key={h}
              className="absolute left-0 right-0 border-t border-surface-2/40"
              style={{ top: h * HOUR_HEIGHT }}
            >
              <span className="absolute -top-2 left-1 font-mono text-[10px] text-zinc-600">
                {h === 0 ? "" : `${h}:00`}
              </span>
            </div>
          ))}

          {/* Now-line */}
          {mounted && isToday && nowMin >= 0 && nowMin <= DAY_MIN && (
            <div
              className="absolute left-0 right-0 z-20 border-t border-red-500"
              style={{ top: (nowMin / 60) * HOUR_HEIGHT }}
              data-testid="now-line"
            >
              <span className="absolute -left-0.5 -top-1 h-2 w-2 rounded-full bg-red-500" />
            </div>
          )}

          {/* Drop preview — where a dragged rail task would land. */}
          {dropPreviewMin != null && (
            <div
              className="pointer-events-none absolute left-12 right-2 z-30 rounded-md border border-dashed border-brand bg-brand/10"
              style={{ top: (dropPreviewMin / 60) * HOUR_HEIGHT, height: (30 / 60) * HOUR_HEIGHT }}
              data-testid="drop-preview"
            />
          )}

          {/* Meetings — read-only anchors */}
          {meetings.map((m) => {
            const top = clampTop(offsetMinutes(m.start_at, dayStartUtcMs));
            const bottom = clampTop(offsetMinutes(m.end_at, dayStartUtcMs));
            const height = Math.max(18, ((bottom - top) / 60) * HOUR_HEIGHT);
            return (
              <div
                key={m.id}
                data-testid="meeting-anchor"
                className="absolute left-12 right-2 z-10 overflow-hidden rounded-md border border-zinc-600/50 bg-zinc-700/40 px-2 py-0.5 text-[11px] text-zinc-300"
                style={{ top: (top / 60) * HOUR_HEIGHT, height }}
                title={`${m.title} (meeting — not movable)`}
              >
                <div className="flex items-center gap-1">
                  <Lock className="h-3 w-3 shrink-0 text-zinc-500" />
                  <span className="truncate font-medium">{m.title}</span>
                </div>
                <div className="text-[10px] text-zinc-500">{formatTimeInTz(m.start_at, tz)}</div>
              </div>
            );
          })}

          {/* Time blocks — draggable + resizable */}
          {blocks.map((b) => {
            const ov = overrides[b.id];
            const startMin = ov ? ov.startMin : clampTop(offsetMinutes(b.start_at, dayStartUtcMs));
            const endMin = ov ? ov.endMin : clampTop(offsetMinutes(b.end_at, dayStartUtcMs));
            const height = Math.max(18, ((endMin - startMin) / 60) * HOUR_HEIGHT);
            const startIso = new Date(dayStartUtcMs + startMin * 60000).toISOString();
            return (
              <div
                key={b.id}
                data-testid="time-block"
                data-task-id={b.task_id ?? ""}
                onPointerDown={(e) => beginDrag(e, b, "move")}
                className="group absolute left-12 right-2 z-10 cursor-grab touch-none select-none overflow-hidden rounded-md border border-brand/40 bg-brand/15 px-2 py-0.5 text-[11px] text-brand active:cursor-grabbing"
                style={{ top: (startMin / 60) * HOUR_HEIGHT, height }}
              >
                <div className="flex items-start justify-between gap-1">
                  <span className="truncate font-medium">{b.title}</span>
                  <button
                    type="button"
                    onPointerDown={(e) => e.stopPropagation()}
                    onClick={() => deleteBlock(b.id)}
                    aria-label="Remove time block"
                    // opacity-60 (not 0) so it's tappable on touch — iPad has no hover.
                    className="-m-1 shrink-0 p-1 text-brand/60 opacity-60 transition-opacity hover:text-brand group-hover:opacity-100"
                  >
                    <X className="h-3.5 w-3.5" />
                  </button>
                </div>
                <div className="text-[10px] text-brand/70">{formatTimeInTz(startIso, tz)}</div>
                {/* Resize handle */}
                <div
                  onPointerDown={(e) => beginDrag(e, b, "resize")}
                  className="absolute bottom-0 left-0 right-0 h-3 cursor-ns-resize touch-none"
                  aria-label="Resize block"
                />
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

function stripKey(o: Record<string, Override>, id: string): Record<string, Override> {
  if (!(id in o)) return o;
  const next = { ...o };
  delete next[id];
  return next;
}
