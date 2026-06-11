import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useLoaderData, Link } from "react-router";
import { ChevronRight, CheckCircle, Circle, Clock, Sparkles } from "lucide-react";
import { apiFetch } from "~/lib/api";
export async function loader({ request, params, context }) {
    const response = await apiFetch(request, context.cloudflare.env, `/learning/paths/${params.slug}`);
    const data = await response.json();
    if (!data.path) {
        throw new Response("Not Found", { status: 404 });
    }
    let progress = [];
    try {
        const progressRes = await apiFetch(request, context.cloudflare.env, `/learning/progress/${data.path.id}`);
        const progressData = await progressRes.json();
        progress = progressData.progress || [];
    }
    catch (e) {
        // progress stays empty
    }
    return {
        path: data.path,
        progress,
    };
}
export default function LearningPathPage() {
    const { path, progress } = useLoaderData();
    const modules = path.learning_modules || [];
    const completedLessons = new Set(progress
        .filter((p) => p.status === "completed")
        .map((p) => p.learning_lesson_id));
    const totalLessons = modules.reduce((acc, mod) => acc + (mod.learning_lessons?.length || 0), 0);
    const completedCount = completedLessons.size;
    const progressPercent = totalLessons > 0 ? Math.round((completedCount / totalLessons) * 100) : 0;
    return (_jsxs("div", { className: "max-w-3xl py-6", children: [_jsxs("div", { className: "mb-8", children: [_jsx(Link, { to: "/dashboard/learning", className: "text-sm text-zinc-400 hover:text-zinc-200 mb-2 inline-block", children: "\u2190 All Paths" }), _jsx("h1", { className: "text-2xl font-semibold text-zinc-100", children: path.title }), _jsx("p", { className: "text-zinc-400 mt-2", children: path.description }), _jsxs("div", { className: "mt-4", children: [_jsxs("div", { className: "flex justify-between text-sm text-zinc-400 mb-1", children: [_jsxs("span", { children: [completedCount, " of ", totalLessons, " lessons"] }), _jsxs("span", { children: [progressPercent, "%"] })] }), _jsx("div", { className: "h-2 bg-zinc-800 rounded-full overflow-hidden", children: _jsx("div", { className: "h-full bg-emerald-500 transition-all", style: { width: `${progressPercent}%` } }) })] })] }), modules.length === 0 && (_jsxs("div", { className: "bg-zinc-900 border border-zinc-800 rounded-lg p-8 text-center", children: [_jsx("p", { className: "text-zinc-400 mb-2", children: "No modules found for this path." }), _jsx("p", { className: "text-sm text-zinc-500", children: "Check that migration 034 has been applied." })] })), _jsx("div", { className: "space-y-6", children: modules.map((module, moduleIndex) => (_jsxs("div", { className: "bg-zinc-900 border border-zinc-800 rounded-lg overflow-hidden", children: [_jsxs("div", { className: "p-4 border-b border-zinc-800", children: [_jsxs("h2", { className: "text-lg font-medium text-zinc-100", children: [moduleIndex + 1, ". ", module.title] }), module.description && (_jsx("p", { className: "text-sm text-zinc-400 mt-1", children: module.description }))] }), (!module.learning_lessons || module.learning_lessons.length === 0) ? (_jsx("div", { className: "p-4 text-center", children: _jsx("p", { className: "text-sm text-zinc-500", children: "No lessons in this module yet." }) })) : (_jsx("div", { className: "divide-y divide-zinc-800", children: module.learning_lessons.map((lesson, lessonIndex) => {
                                const isCompleted = completedLessons.has(lesson.id);
                                const hasContent = !!lesson.content;
                                return (_jsxs(Link, { to: `/dashboard/learning/lesson/${lesson.id}`, className: "flex items-center gap-3 p-4 hover:bg-zinc-800/50 transition-colors", children: [isCompleted ? (_jsx(CheckCircle, { className: "w-5 h-5 text-emerald-500 flex-shrink-0" })) : (_jsx(Circle, { className: "w-5 h-5 text-zinc-600 flex-shrink-0" })), _jsx("div", { className: "flex-1 min-w-0", children: _jsxs("p", { className: `text-sm ${isCompleted ? "text-zinc-400" : "text-zinc-200"}`, children: [moduleIndex + 1, ".", lessonIndex + 1, " ", lesson.title] }) }), _jsxs("div", { className: "flex items-center gap-3", children: [!hasContent && (_jsxs("span", { className: "flex items-center gap-1 text-xs text-amber-400", children: [_jsx(Sparkles, { className: "w-3.5 h-3.5" }), "Generate"] })), _jsxs("span", { className: "flex items-center gap-1 text-xs text-zinc-500", children: [_jsx(Clock, { className: "w-3.5 h-3.5" }), lesson.estimated_minutes, "m"] })] }), _jsx(ChevronRight, { className: "w-4 h-4 text-zinc-600" })] }, lesson.id));
                            }) }))] }, module.id))) })] }));
}
