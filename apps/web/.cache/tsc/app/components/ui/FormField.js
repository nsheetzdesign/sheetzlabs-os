import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
export function FormField({ label, error, hint, required, children, }) {
    return (_jsxs("div", { className: "space-y-1.5", children: [_jsxs("label", { className: "flex items-center gap-1 text-sm font-medium text-zinc-300", children: [label, required && _jsx("span", { className: "text-red-400", children: "*" })] }), children, hint && !error && _jsx("p", { className: "text-xs text-zinc-600", children: hint }), error && _jsx("p", { className: "text-xs text-red-400", children: error })] }));
}
