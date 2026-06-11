import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useLoaderData, Link } from "react-router";
import { BookOpen, Clock, BarChart, Sparkles } from "lucide-react";
import * as Icons from "lucide-react";
import { apiFetch } from "~/lib/api";
export async function loader({ request, context }) {
    const response = await apiFetch(request, context.cloudflare.env, `/learning/paths`);
    if (!response.ok) {
        return { paths: [], error: "Failed to load paths" };
    }
    const data = await response.json();
    return { paths: data.paths || [] };
}
export default function LearningPathsPage() {
    const { paths, error } = useLoaderData();
    if (error) {
        return (_jsx("div", { className: "text-center py-12", children: _jsx("p", { className: "text-red-400", children: error }) }));
    }
    if (paths.length === 0) {
        return (_jsxs("div", { className: "text-center py-12", children: [_jsx("p", { className: "text-zinc-400", children: "No learning paths found." }), _jsx("p", { className: "text-sm text-zinc-500 mt-2", children: "Check that migrations 031 ran successfully." })] }));
    }
    return (_jsxs("div", { className: "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 pt-6", children: [paths.map((path) => {
                const IconComponent = Icons[path.icon] || BookOpen;
                return (_jsx(Link, { to: `/dashboard/learning/path/${path.slug}`, className: "bg-zinc-900 border border-zinc-800 rounded-lg p-6 hover:border-zinc-700 transition-colors group", children: _jsxs("div", { className: "flex items-start gap-4", children: [_jsx("div", { className: "p-3 rounded-lg", style: { backgroundColor: `${path.color}20` }, children: _jsx(IconComponent, { className: "w-6 h-6", style: { color: path.color } }) }), _jsxs("div", { className: "flex-1 min-w-0", children: [_jsx("h3", { className: "text-lg font-medium text-zinc-100 group-hover:text-white", children: path.title }), _jsx("p", { className: "text-sm text-zinc-400 mt-1 line-clamp-2", children: path.description }), _jsxs("div", { className: "flex items-center gap-4 mt-4 text-xs text-zinc-500", children: [_jsxs("span", { className: "flex items-center gap-1", children: [_jsx(Clock, { className: "w-3.5 h-3.5" }), path.estimated_hours, "h"] }), _jsxs("span", { className: "flex items-center gap-1 capitalize", children: [_jsx(BarChart, { className: "w-3.5 h-3.5" }), path.difficulty] })] })] })] }) }, path.id));
            }), _jsx(Link, { to: "/dashboard/learning/generate", className: "bg-zinc-900 border border-dashed border-zinc-700 rounded-lg p-6 hover:border-emerald-500/50 transition-colors flex items-center justify-center min-h-[160px]", children: _jsxs("div", { className: "text-center", children: [_jsx("div", { className: "w-12 h-12 rounded-full bg-emerald-500/20 flex items-center justify-center mx-auto mb-3", children: _jsx(Sparkles, { className: "w-6 h-6 text-emerald-400" }) }), _jsx("p", { className: "text-zinc-300 font-medium", children: "Generate Custom Path" }), _jsx("p", { className: "text-xs text-zinc-500 mt-1", children: "AI-powered curriculum" })] }) })] }));
}
