import { jsx as _jsx } from "react/jsx-runtime";
const VARIANTS = {
    primary: "bg-brand text-white hover:bg-brand-dark disabled:opacity-50",
    secondary: "border border-surface-2 text-zinc-400 hover:border-surface-3 hover:text-zinc-200 bg-surface-1/50",
    danger: "border border-red-500/20 bg-red-500/10 text-red-400 hover:bg-red-500/20",
};
export function Button({ variant = "primary", className = "", children, ...props }) {
    return (_jsx("button", { className: `inline-flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-medium transition-colors ${VARIANTS[variant]} ${className}`, ...props, children: children }));
}
