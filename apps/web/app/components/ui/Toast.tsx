import { useCallback, useRef, useState } from 'react';
import { X } from 'lucide-react';

/**
 * Lightweight toast system (Prompt 54A Part 1) — no external dependency.
 * Bottom-left, auto-dismiss after `duration` (default 5s), optional action button
 * (used for "Archived — Undo"). `useToasts` owns the queue; `ToastContainer`
 * renders it. Kept dependency-free and self-contained so any inbox surface can
 * mount its own instance.
 */

export interface ToastItem {
  id: string;
  message: string;
  actionLabel?: string;
  onAction?: () => void;
  /** ms before auto-dismiss; 0 = sticky. */
  duration?: number;
  variant?: 'default' | 'error';
}

export interface PushToast {
  message: string;
  actionLabel?: string;
  onAction?: () => void;
  duration?: number;
  variant?: 'default' | 'error';
}

let _seq = 0;

export function useToasts() {
  const [toasts, setToasts] = useState<ToastItem[]>([]);
  const timers = useRef<Map<string, ReturnType<typeof setTimeout>>>(new Map());

  const dismiss = useCallback((id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
    const timer = timers.current.get(id);
    if (timer) {
      clearTimeout(timer);
      timers.current.delete(id);
    }
  }, []);

  const push = useCallback(
    (t: PushToast): string => {
      const id = `toast-${++_seq}-${Date.now()}`;
      const duration = t.duration ?? 5000;
      setToasts((prev) => [...prev, { ...t, id }]);
      if (duration > 0) {
        timers.current.set(
          id,
          setTimeout(() => dismiss(id), duration),
        );
      }
      return id;
    },
    [dismiss],
  );

  return { toasts, push, dismiss };
}

export function ToastContainer({
  toasts,
  onDismiss,
}: {
  toasts: ToastItem[];
  onDismiss: (id: string) => void;
}) {
  if (toasts.length === 0) return null;
  return (
    <div className="fixed bottom-4 left-4 z-50 flex flex-col gap-2" role="region" aria-label="Notifications">
      {toasts.map((t) => (
        <div
          key={t.id}
          role="status"
          className={`flex items-center gap-3 rounded-lg border px-4 py-3 text-sm shadow-lg backdrop-blur-sm ${
            t.variant === 'error'
              ? 'border-red-500/30 bg-red-950/80 text-red-100'
              : 'border-zinc-700 bg-zinc-900/95 text-zinc-100'
          }`}
        >
          <span className="whitespace-nowrap">{t.message}</span>
          {t.actionLabel && t.onAction && (
            <button
              type="button"
              onClick={() => {
                t.onAction?.();
                onDismiss(t.id);
              }}
              className="font-semibold text-emerald-400 hover:text-emerald-300"
            >
              {t.actionLabel}
            </button>
          )}
          <button
            type="button"
            onClick={() => onDismiss(t.id)}
            aria-label="Dismiss notification"
            className="ml-1 text-zinc-500 hover:text-zinc-300"
          >
            <X size={14} />
          </button>
        </div>
      ))}
    </div>
  );
}
