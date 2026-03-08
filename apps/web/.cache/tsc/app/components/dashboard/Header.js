import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { Bell, Plus } from "lucide-react";
export function Header({ title }) {
    return (_jsxs("header", { className: "sticky top-0 z-10 flex items-center justify-between border-b border-surface-2/50 bg-surface-0/80 px-6 py-4 backdrop-blur-md", children: [_jsx("h1", { className: "text-lg font-semibold", children: title }), _jsxs("div", { className: "flex items-center gap-3", children: [_jsxs("button", { className: "relative text-zinc-500 transition-colors hover:text-zinc-300", children: [_jsx(Bell, { className: "h-5 w-5" }), _jsx("span", { className: "absolute -right-0.5 -top-0.5 h-2 w-2 rounded-full bg-brand" })] }), _jsxs("button", { className: "flex items-center gap-1.5 rounded-lg bg-brand px-3 py-1.5 text-sm font-medium text-white transition-colors hover:bg-brand-dark", children: [_jsx(Plus, { className: "h-4 w-4" }), "New"] })] })] }));
}
