import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
export function EmptyState({ icon: Icon, title, description, action, }) {
    return (_jsxs("div", { className: "flex flex-col items-center justify-center py-16 text-center", children: [Icon && _jsx(Icon, { className: "mb-4 h-10 w-10 text-zinc-700" }), _jsx("h3", { className: "text-sm font-semibold text-zinc-400", children: title }), description && (_jsx("p", { className: "mt-1 max-w-sm text-xs text-zinc-600", children: description })), action && _jsx("div", { className: "mt-4", children: action })] }));
}
