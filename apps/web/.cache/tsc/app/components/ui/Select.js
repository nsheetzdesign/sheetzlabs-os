import { jsx as _jsx } from "react/jsx-runtime";
export function Select({ error, className = "", children, ...props }) {
    return (_jsx("select", { className: `w-full rounded-lg border px-3 py-2 text-sm text-zinc-200 focus:outline-none focus:ring-1 ${error
            ? "border-red-500/50 bg-surface-1 focus:border-red-500/70 focus:ring-red-500/20"
            : "border-surface-2 bg-surface-1 focus:border-brand/50 focus:ring-brand/20"} ${className}`, ...props, children: children }));
}
