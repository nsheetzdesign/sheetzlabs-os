import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useCallback, useRef, useState } from 'react';
import { X } from 'lucide-react';
let _seq = 0;
export function useToasts() {
    const [toasts, setToasts] = useState([]);
    const timers = useRef(new Map());
    const dismiss = useCallback((id) => {
        setToasts((prev) => prev.filter((t) => t.id !== id));
        const timer = timers.current.get(id);
        if (timer) {
            clearTimeout(timer);
            timers.current.delete(id);
        }
    }, []);
    const push = useCallback((t) => {
        const id = `toast-${++_seq}-${Date.now()}`;
        const duration = t.duration ?? 5000;
        setToasts((prev) => [...prev, { ...t, id }]);
        if (duration > 0) {
            timers.current.set(id, setTimeout(() => dismiss(id), duration));
        }
        return id;
    }, [dismiss]);
    return { toasts, push, dismiss };
}
export function ToastContainer({ toasts, onDismiss, }) {
    if (toasts.length === 0)
        return null;
    return (_jsx("div", { className: "fixed bottom-4 left-4 z-50 flex flex-col gap-2", role: "region", "aria-label": "Notifications", children: toasts.map((t) => (_jsxs("div", { role: "status", className: `flex items-center gap-3 rounded-lg border px-4 py-3 text-sm shadow-lg backdrop-blur-sm ${t.variant === 'error'
                ? 'border-red-500/30 bg-red-950/80 text-red-100'
                : 'border-zinc-700 bg-zinc-900/95 text-zinc-100'}`, children: [_jsx("span", { className: "whitespace-nowrap", children: t.message }), t.actionLabel && t.onAction && (_jsx("button", { type: "button", onClick: () => {
                        t.onAction?.();
                        onDismiss(t.id);
                    }, className: "font-semibold text-emerald-400 hover:text-emerald-300", children: t.actionLabel })), _jsx("button", { type: "button", onClick: () => onDismiss(t.id), "aria-label": "Dismiss notification", className: "ml-1 text-zinc-500 hover:text-zinc-300", children: _jsx(X, { size: 14 }) })] }, t.id))) }));
}
