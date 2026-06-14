import { useCallback, useRef, useState } from "react";
import { workApi, type WorkEvent, type WorkTask } from "~/lib/work-client";
import { HOUR_HEIGHT, yToMinutesIn } from "~/components/work/DayTimeline";

/**
 * Rail → timeline drag-to-timebox, on POINTER EVENTS (Prompt 69).
 *
 * The original (Prompt 67) rail drag used the HTML5 drag-and-drop API
 * (`draggable` + `dataTransfer`), which iOS Safari does not fire on touch — so
 * timeboxing was dead on the iPad, the app's primary install surface. Pointer
 * events fire for mouse AND touch, so this is one code path that works on both.
 *
 * Lives in the Plan view (the rail + timeline are siblings there). The rail's
 * grip handle calls `onTaskPointerDown`; the timeline scroll element is passed in
 * by ref so we can hit-test the pointer and snap the drop to the 15-min grid. A
 * floating `ghost` follows the finger; `dropPreviewMin` drives the timeline's
 * drop indicator. The grip handle carries `touch-action: none` so dragging it
 * doesn't scroll the rail list.
 */

const ACTIVATE_PX = 6; // movement before a press becomes a drag (taps stay taps)

export type DragGhost = { title: string; x: number; y: number };

export function useTimeboxDrag(opts: {
  timelineRef: React.RefObject<HTMLElement | null>;
  dayStartUtcMs: number;
  planDate: string;
  onChanged: () => void;
  onToast: (message: string, variant?: "default" | "error") => void;
}) {
  const { timelineRef, dayStartUtcMs, planDate, onChanged, onToast } = opts;
  const [ghost, setGhost] = useState<DragGhost | null>(null);
  const [dropPreviewMin, setDropPreviewMin] = useState<number | null>(null);
  const drag = useRef<{ task: WorkTask; pointerId: number; active: boolean; startX: number; startY: number } | null>(
    null,
  );

  // Hit-test: is (x,y) inside the timeline scroll rect? → snapped minute, else null.
  const minuteAt = useCallback(
    (x: number, y: number): number | null => {
      const el = timelineRef.current;
      if (!el) return null;
      const r = el.getBoundingClientRect();
      if (x < r.left || x > r.right || y < r.top || y > r.bottom) return null;
      return yToMinutesIn(el, y);
    },
    [timelineRef],
  );

  const onTaskPointerDown = useCallback(
    (e: React.PointerEvent, task: WorkTask) => {
      // Primary button / touch only; ignore right-click etc.
      if (e.button !== 0 && e.pointerType === "mouse") return;
      drag.current = { task, pointerId: e.pointerId, active: false, startX: e.clientX, startY: e.clientY };

      const onMove = (me: PointerEvent) => {
        const d = drag.current;
        if (!d || me.pointerId !== d.pointerId) return;
        if (!d.active) {
          if (Math.abs(me.clientX - d.startX) + Math.abs(me.clientY - d.startY) < ACTIVATE_PX) return;
          d.active = true;
        }
        me.preventDefault();
        setGhost({ title: d.task.title, x: me.clientX, y: me.clientY });
        setDropPreviewMin(minuteAt(me.clientX, me.clientY));
      };

      const cleanup = () => {
        window.removeEventListener("pointermove", onMove);
        window.removeEventListener("pointerup", onUp);
        window.removeEventListener("pointercancel", onCancel);
        drag.current = null;
        setGhost(null);
        setDropPreviewMin(null);
      };

      const onUp = (ue: PointerEvent) => {
        const d = drag.current;
        if (!d || ue.pointerId !== d.pointerId) return;
        const min = d.active ? minuteAt(ue.clientX, ue.clientY) : null;
        const task = d.task;
        cleanup();
        if (min != null) void createBlock(task, min);
      };
      const onCancel = (ce: PointerEvent) => {
        if (!drag.current || ce.pointerId !== drag.current.pointerId) return;
        cleanup();
      };

      window.addEventListener("pointermove", onMove, { passive: false });
      window.addEventListener("pointerup", onUp);
      window.addEventListener("pointercancel", onCancel);
    },
    [minuteAt],
  );

  async function createBlock(task: WorkTask, startMin: number) {
    const startIso = new Date(dayStartUtcMs + startMin * 60000).toISOString();
    const res = await workApi<{ event: WorkEvent }>("/calendar/time-blocks", {
      method: "POST",
      body: JSON.stringify({ task_id: task.id, start_at: startIso, planned_date: planDate }),
    });
    if (res.ok) {
      onToast("Task timeboxed.");
      onChanged();
    } else {
      onToast("Couldn't create that time block.", "error");
    }
  }

  return { ghost, dropPreviewMin, onTaskPointerDown, HOUR_HEIGHT };
}
