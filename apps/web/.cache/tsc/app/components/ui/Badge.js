import { jsx as _jsx } from "react/jsx-runtime";
const TASK_STATUS = {
    backlog: "bg-zinc-800 text-zinc-500",
    todo: "bg-zinc-700 text-zinc-300",
    "in-progress": "bg-blue-500/15 text-blue-400",
    review: "bg-yellow-500/15 text-yellow-400",
    done: "bg-brand/10 text-brand",
    blocked: "bg-red-500/15 text-red-400",
};
const TASK_PRIORITY = {
    urgent: "bg-red-500/15 text-red-400",
    high: "bg-orange-500/15 text-orange-400",
    medium: "bg-yellow-500/15 text-yellow-400",
    low: "bg-zinc-800 text-zinc-500",
};
const VENTURE_STATUS = {
    active: "bg-brand/10 text-brand",
    building: "bg-zinc-800 text-zinc-400",
    validating: "bg-yellow-500/15 text-yellow-400",
    idea: "bg-zinc-900 text-zinc-600",
    maintenance: "bg-orange-500/15 text-orange-400",
    sunset: "bg-zinc-900 text-zinc-600",
    sold: "bg-purple-500/15 text-purple-400",
};
const COLOR_MAPS = {
    "task-status": TASK_STATUS,
    "task-priority": TASK_PRIORITY,
    "venture-status": VENTURE_STATUS,
};
export function Badge({ value, variant, className = "", }) {
    const colorClass = COLOR_MAPS[variant][value] ?? "bg-zinc-800 text-zinc-400";
    return (_jsx("span", { className: `inline-flex items-center rounded-full px-2 py-0.5 font-mono text-xs ${colorClass} ${className}`, children: value }));
}
