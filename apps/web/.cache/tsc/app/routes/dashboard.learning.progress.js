import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useLoaderData, Link } from "react-router";
import { BookOpen } from "lucide-react";
import { apiFetch } from "~/lib/api";
export async function loader({ request, context }) {
    const pathsRes = await apiFetch(request, context.cloudflare.env, `/learning/paths`);
    const pathsData = await pathsRes.json();
    return { paths: pathsData.paths || [] };
}
export default function ProgressPage() {
    const { paths } = useLoaderData();
    // Mock stats for now
    const stats = {
        totalTime: "0h 0m",
        lessonsCompleted: 0,
        streak: 0,
    };
    return (_jsxs("div", { className: "pt-6", children: [_jsxs("div", { className: "grid grid-cols-3 gap-4 mb-8", children: [_jsxs("div", { className: "bg-zinc-900 border border-zinc-800 rounded-lg p-4", children: [_jsx("p", { className: "text-sm text-zinc-400", children: "Time Spent" }), _jsx("p", { className: "text-2xl font-semibold text-zinc-100 mt-1", children: stats.totalTime })] }), _jsxs("div", { className: "bg-zinc-900 border border-zinc-800 rounded-lg p-4", children: [_jsx("p", { className: "text-sm text-zinc-400", children: "Lessons Completed" }), _jsx("p", { className: "text-2xl font-semibold text-zinc-100 mt-1", children: stats.lessonsCompleted })] }), _jsxs("div", { className: "bg-zinc-900 border border-zinc-800 rounded-lg p-4", children: [_jsx("p", { className: "text-sm text-zinc-400", children: "Day Streak" }), _jsxs("p", { className: "text-2xl font-semibold text-zinc-100 mt-1", children: [stats.streak, " \uD83D\uDD25"] })] })] }), _jsx("h2", { className: "text-lg font-medium text-zinc-100 mb-4", children: "Your Paths" }), _jsx("div", { className: "space-y-3", children: paths.map((path) => (_jsxs(Link, { to: `/dashboard/learning/path/${path.slug}`, className: "flex items-center gap-4 bg-zinc-900 border border-zinc-800 rounded-lg p-4 hover:border-zinc-700 transition-colors", children: [_jsx(BookOpen, { className: "w-5 h-5 text-zinc-400" }), _jsxs("div", { className: "flex-1", children: [_jsx("p", { className: "text-zinc-100", children: path.title }), _jsxs("div", { className: "flex items-center gap-4 mt-1 text-xs text-zinc-500", children: [_jsx("span", { children: "0% complete" }), _jsx("span", { children: "0 lessons" })] })] }), _jsx("div", { className: "w-24 h-2 bg-zinc-800 rounded-full overflow-hidden", children: _jsx("div", { className: "h-full bg-emerald-500", style: { width: "0%" } }) })] }, path.id))) })] }));
}
