import { useState } from "react";
import { Inbox, Plus, ArrowRight, Loader2 } from "lucide-react";
import { workApi, type Capture } from "~/lib/work-client";

/**
 * Persistent scratchpad shared by Plan + Work (Prompt 67). Jot a line → it's saved
 * to `captures`; one click converts a capture into a task (→ rail) without leaving
 * the view. All writes go through the `/api/*` proxy; the parent revalidates.
 */
export function QuickCapture({
  captures,
  onChanged,
  onToast,
}: {
  captures: Capture[];
  onChanged: () => void;
  onToast: (message: string, variant?: "default" | "error") => void;
}) {
  const [text, setText] = useState("");
  const [busy, setBusy] = useState(false);
  const [convertingId, setConvertingId] = useState<string | null>(null);

  async function add() {
    const content = text.trim();
    if (!content || busy) return;
    setBusy(true);
    const res = await workApi("/knowledge/captures", {
      method: "POST",
      body: JSON.stringify({ content, capture_type: "text" }),
    });
    setBusy(false);
    if (res.ok) {
      setText("");
      onChanged();
    } else {
      onToast("Couldn't save that capture.", "error");
    }
  }

  async function convert(id: string) {
    if (convertingId) return;
    setConvertingId(id);
    const res = await workApi(`/knowledge/captures/${id}/convert`, { method: "POST" });
    setConvertingId(null);
    if (res.ok) {
      onToast("Capture converted to a task.");
      onChanged();
    } else {
      onToast("Couldn't convert that capture.", "error");
    }
  }

  const pending = captures.filter((cap) => !cap.converted_task_id);

  return (
    <div className="rounded-xl border border-surface-2/50 bg-surface-1/40 p-3" data-testid="quick-capture">
      <div className="mb-2 flex items-center gap-2 text-xs font-medium text-zinc-400">
        <Inbox className="h-3.5 w-3.5" />
        Quick capture
      </div>
      <div className="flex gap-2">
        <input
          value={text}
          onChange={(e) => setText(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              e.preventDefault();
              add();
            }
          }}
          placeholder="Jot something down…"
          aria-label="Quick capture"
          data-testid="quick-capture-input"
          className="min-w-0 flex-1 rounded-lg border border-surface-2 bg-surface-0 px-3 py-2 text-sm text-zinc-200 placeholder:text-zinc-600 focus:border-brand focus:outline-none"
        />
        <button
          type="button"
          onClick={add}
          disabled={busy || !text.trim()}
          aria-label="Save capture"
          className="flex shrink-0 items-center justify-center rounded-lg border border-surface-2 bg-surface-0 px-2.5 text-zinc-400 transition-colors hover:border-brand hover:text-brand disabled:opacity-40"
        >
          {busy ? <Loader2 className="h-4 w-4 animate-spin" /> : <Plus className="h-4 w-4" />}
        </button>
      </div>

      {pending.length > 0 && (
        <ul className="mt-2 space-y-1">
          {pending.slice(0, 6).map((cap) => (
            <li
              key={cap.id}
              className="flex items-center gap-2 rounded-lg px-2 py-1.5 text-sm text-zinc-300 hover:bg-surface-1/60"
            >
              <span className="min-w-0 flex-1 truncate">{cap.content}</span>
              <button
                type="button"
                onClick={() => convert(cap.id)}
                disabled={convertingId === cap.id}
                title="Convert to task"
                aria-label="Convert capture to task"
                className="flex shrink-0 items-center gap-1 rounded-md border border-surface-2 px-1.5 py-0.5 text-xs text-zinc-400 transition-colors hover:border-brand hover:text-brand disabled:opacity-40"
              >
                {convertingId === cap.id ? (
                  <Loader2 className="h-3 w-3 animate-spin" />
                ) : (
                  <ArrowRight className="h-3 w-3" />
                )}
                task
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
