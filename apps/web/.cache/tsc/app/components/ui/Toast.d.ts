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
export declare function useToasts(): {
    toasts: ToastItem[];
    push: (t: PushToast) => string;
    dismiss: (id: string) => void;
};
export declare function ToastContainer({ toasts, onDismiss, }: {
    toasts: ToastItem[];
    onDismiss: (id: string) => void;
}): import("react/jsx-runtime").JSX.Element | null;
