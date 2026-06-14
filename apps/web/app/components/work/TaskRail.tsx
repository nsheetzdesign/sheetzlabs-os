import { useMemo, useState } from "react";
import { Plus, GripVertical, Clock, Loader2, Check } from "lucide-react";
import { workApi, type WorkTask, minutesLabel } from "~/lib/work-client";

/**
 * The unscheduled-task rail (Plan view, Prompt 67). Tasks here have no time block
 * yet; drag one onto the day-strip to timebox it. Inline add + inline estimate
 * edit; filterable by venture.
 *
 * Drag is POINTER-based (Prompt 69 — native HTML5 DnD never fired on iOS touch).
 * Only the grip handle initiates a drag (`touch-action: none` there), so the rest
 * of the row stays free for the list's own touch-scroll. `onTaskPointerDown` is
 * wired up by the Plan view via useTimeboxDrag.
 */
export function TaskRail({
  tasks,
  onChanged,
  onToast,
  onTaskPointerDown,
}: {
  tasks: WorkTask[];
  onChanged: () => void;
  onToast: (message: string, variant?: "default" | "error") => void;
  onTaskPointerDown: (e: React.PointerEvent, task: WorkTask) => void;
}) {
  const [title, setTitle] = useState("");
  const [adding, setAdding] = useState(false);
  const [ventureFilter, setVentureFilter] = useState<string>("all");

  const ventures = useMemo(() => {
    const map = new Map<string, string>();
    for (const t of tasks) {
      if (t.ventures) map.set(t.ventures.id, t.ventures.name);
    }
    return Array.from(map, ([id, name]) => ({ id, name }));
  }, [tasks]);

  const visible = useMemo(() => {
    if (ventureFilter === "all") return tasks;
    if (ventureFilter === "none") return tasks.filter((t) => !t.venture_id);
    return tasks.filter((t) => t.venture_id === ventureFilter);
  }, [tasks, ventureFilter]);

  async function addTask() {
    const t = title.trim();
    if (!t || adding) return;
    setAdding(true);
    const res = await workApi("/tasks", {
      method: "POST",
      body: JSON.stringify({ title: t, status: "todo" }),
    });
    setAdding(false);
    if (res.ok) {
      setTitle("");
      onChanged();
    } else {
      onToast("Couldn't add that task.", "error");
    }
  }

  return (
    <div className="flex h-full min-h-0 flex-col" data-testid="task-rail">
      <div className="mb-3 flex items-center justify-between gap-2">
        <h2 className="text-sm font-semibold text-zinc-200">Unscheduled</h2>
        {ventures.length > 0 && (
          <select
            value={ventureFilter}
            onChange={(e) => setVentureFilter(e.target.value)}
            aria-label="Filter by venture"
            className="rounded-md border border-surface-2 bg-surface-0 px-2 py-1 text-xs text-zinc-300 focus:border-brand focus:outline-none"
          >
            <option value="all">All ventures</option>
            <option value="none">No venture</option>
            {ventures.map((v) => (
              <option key={v.id} value={v.id}>
                {v.name}
              </option>
            ))}
          </select>
        )}
      </div>

      {/* Inline add */}
      <div className="mb-3 flex gap-2">
        <input
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              e.preventDefault();
              addTask();
            }
          }}
          placeholder="Add a task…"
          aria-label="New task title"
          data-testid="rail-add-input"
          className="min-w-0 flex-1 rounded-lg border border-surface-2 bg-surface-0 px-3 py-2 text-sm text-zinc-200 placeholder:text-zinc-600 focus:border-brand focus:outline-none"
        />
        <button
          type="button"
          onClick={addTask}
          disabled={adding || !title.trim()}
          aria-label="Add task"
          className="flex shrink-0 items-center justify-center rounded-lg border border-surface-2 bg-surface-0 px-2.5 text-zinc-400 transition-colors hover:border-brand hover:text-brand disabled:opacity-40"
        >
          {adding ? <Loader2 className="h-4 w-4 animate-spin" /> : <Plus className="h-4 w-4" />}
        </button>
      </div>

      <ul className="min-h-0 flex-1 space-y-1.5 overflow-y-auto pr-1" data-testid="rail-list">
        {visible.length === 0 && (
          <li className="rounded-lg border border-dashed border-surface-2 px-3 py-6 text-center text-sm text-zinc-600">
            Nothing unscheduled. 🎉
          </li>
        )}
        {visible.map((task) => (
          <RailRow
            key={task.id}
            task={task}
            onChanged={onChanged}
            onToast={onToast}
            onTaskPointerDown={onTaskPointerDown}
          />
        ))}
      </ul>
    </div>
  );
}

function RailRow({
  task,
  onChanged,
  onToast,
  onTaskPointerDown,
}: {
  task: WorkTask;
  onChanged: () => void;
  onToast: (message: string, variant?: "default" | "error") => void;
  onTaskPointerDown: (e: React.PointerEvent, task: WorkTask) => void;
}) {
  const [editing, setEditing] = useState(false);
  const [estimate, setEstimate] = useState(String(task.estimated_minutes ?? ""));
  const [saving, setSaving] = useState(false);

  async function saveEstimate() {
    const mins = parseInt(estimate, 10);
    setSaving(true);
    const res = await workApi(`/tasks/${task.id}`, {
      method: "PATCH",
      body: JSON.stringify({ estimated_minutes: Number.isFinite(mins) && mins > 0 ? mins : null }),
    });
    setSaving(false);
    setEditing(false);
    if (res.ok) onChanged();
    else onToast("Couldn't update the estimate.", "error");
  }

  return (
    <li
      data-testid="rail-task"
      data-task-id={task.id}
      className="group flex items-start gap-1 rounded-lg border border-surface-2/60 bg-surface-0 py-1 pr-2.5 hover:border-surface-3"
    >
      {/* Drag handle — the ONLY drag-initiating surface (touch-none) so the rail
          list still scrolls under a finger. ≥44px touch target for the iPad. */}
      <button
        type="button"
        onPointerDown={(e) => onTaskPointerDown(e, task)}
        data-testid="rail-task-handle"
        aria-label={`Drag ${task.title} onto the timeline`}
        className="flex h-11 w-7 shrink-0 cursor-grab touch-none items-center justify-center self-stretch text-zinc-600 active:cursor-grabbing group-hover:text-zinc-400"
      >
        <GripVertical className="h-4 w-4" />
      </button>
      <div className="min-w-0 flex-1 py-1">
        <div className="truncate text-sm text-zinc-200">{task.title}</div>
        <div className="mt-1 flex flex-wrap items-center gap-1.5">
          {task.ventures && (
            <span className="rounded bg-surface-2/70 px-1.5 py-0.5 text-[11px] text-zinc-400">
              {task.ventures.name}
            </span>
          )}
          {task.ticket_id && (
            <span className="rounded bg-brand/10 px-1.5 py-0.5 text-[11px] text-brand">ticket</span>
          )}
          {editing ? (
            <span className="inline-flex items-center gap-1">
              <input
                autoFocus
                type="number"
                min={0}
                step={5}
                value={estimate}
                onChange={(e) => setEstimate(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") saveEstimate();
                  if (e.key === "Escape") setEditing(false);
                }}
                aria-label="Estimated minutes"
                className="w-16 rounded border border-surface-2 bg-surface-1 px-1.5 py-0.5 text-[11px] text-zinc-200 focus:border-brand focus:outline-none"
              />
              <button
                type="button"
                onClick={saveEstimate}
                disabled={saving}
                aria-label="Save estimate"
                className="text-zinc-400 hover:text-brand"
              >
                {saving ? <Loader2 className="h-3 w-3 animate-spin" /> : <Check className="h-3 w-3" />}
              </button>
            </span>
          ) : (
            <button
              type="button"
              onClick={() => {
                setEstimate(String(task.estimated_minutes ?? ""));
                setEditing(true);
              }}
              data-testid="rail-estimate"
              className="inline-flex items-center gap-1 rounded px-1 py-0.5 text-[11px] text-zinc-500 hover:bg-surface-2/50 hover:text-zinc-300"
            >
              <Clock className="h-3 w-3" />
              {task.estimated_minutes ? minutesLabel(task.estimated_minutes) : "estimate"}
            </button>
          )}
        </div>
      </div>
    </li>
  );
}
