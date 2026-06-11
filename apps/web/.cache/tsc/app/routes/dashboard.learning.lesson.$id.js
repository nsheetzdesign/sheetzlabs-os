import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
import { useState } from "react";
import { useLoaderData, Link, useFetcher } from "react-router";
import { ChevronLeft, CheckCircle, Clock, Sparkles, RefreshCw } from "lucide-react";
import { apiFetch } from "~/lib/api";
export async function loader({ request, params, context }) {
    const response = await apiFetch(request, context.cloudflare.env, `/learning/lessons/${params.id}`);
    const data = await response.json();
    if (!data.lesson) {
        throw new Response("Not Found", { status: 404 });
    }
    return { lesson: data.lesson };
}
export async function action({ request, params, context }) {
    const formData = await request.formData();
    const intent = formData.get("intent");
    if (intent === "complete") {
        await apiFetch(request, context.cloudflare.env, `/learning/lessons/${params.id}/complete`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                time_spent_seconds: parseInt(formData.get("time_spent")) || 0,
            }),
        });
    }
    if (intent === "generate") {
        const response = await apiFetch(request, context.cloudflare.env, `/learning/lessons/${params.id}/generate`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
        });
        if (!response.ok) {
            return { error: "Failed to generate content" };
        }
        return { success: true };
    }
    return { success: true };
}
function MarkdownContent({ content }) {
    // Simple markdown renderer without external dependency
    const lines = content.split("\n");
    const elements = [];
    let i = 0;
    while (i < lines.length) {
        const line = lines[i];
        if (line.startsWith("### ")) {
            elements.push(_jsx("h3", { className: "text-lg font-semibold text-zinc-100 mt-6 mb-2", children: line.slice(4) }, i));
        }
        else if (line.startsWith("## ")) {
            elements.push(_jsx("h2", { className: "text-xl font-semibold text-zinc-100 mt-8 mb-3", children: line.slice(3) }, i));
        }
        else if (line.startsWith("# ")) {
            elements.push(_jsx("h1", { className: "text-2xl font-bold text-zinc-100 mt-8 mb-4", children: line.slice(2) }, i));
        }
        else if (line.startsWith("```")) {
            const codeLines = [];
            i++;
            while (i < lines.length && !lines[i].startsWith("```")) {
                codeLines.push(lines[i]);
                i++;
            }
            elements.push(_jsx("pre", { className: "bg-zinc-800 rounded-lg p-4 overflow-x-auto my-4 text-sm text-zinc-200 font-mono", children: _jsx("code", { children: codeLines.join("\n") }) }, i));
        }
        else if (line.startsWith("- ") || line.startsWith("* ")) {
            const items = [];
            while (i < lines.length &&
                (lines[i].startsWith("- ") || lines[i].startsWith("* "))) {
                items.push(lines[i].slice(2));
                i++;
            }
            elements.push(_jsx("ul", { className: "list-disc list-inside space-y-1 my-3 text-zinc-300", children: items.map((item, j) => (_jsx("li", { children: item }, j))) }, i));
            continue;
        }
        else if (line.trim() === "") {
            // skip blank lines
        }
        else {
            elements.push(_jsx("p", { className: "text-zinc-300 my-3 leading-relaxed", children: line }, i));
        }
        i++;
    }
    return _jsx("div", { children: elements });
}
export default function LessonPage() {
    const { lesson } = useLoaderData();
    const fetcher = useFetcher();
    const [startTime] = useState(Date.now());
    const pathSlug = lesson.learning_modules.learning_paths.slug;
    const pathTitle = lesson.learning_modules.learning_paths.title;
    const isGenerating = fetcher.state !== "idle" &&
        fetcher.formData?.get("intent") === "generate";
    const handleComplete = () => {
        const timeSpent = Math.round((Date.now() - startTime) / 1000);
        fetcher.submit({ intent: "complete", time_spent: timeSpent.toString() }, { method: "post" });
    };
    return (_jsxs("div", { className: "max-w-3xl py-6", children: [_jsx("div", { className: "mb-6", children: _jsxs(Link, { to: `/dashboard/learning/path/${pathSlug}`, className: "text-sm text-zinc-400 hover:text-zinc-200 flex items-center gap-1", children: [_jsx(ChevronLeft, { className: "w-4 h-4" }), pathTitle] }) }), _jsxs("div", { className: "mb-8", children: [_jsx("p", { className: "text-sm text-emerald-400 mb-2", children: lesson.learning_modules.title }), _jsx("h1", { className: "text-2xl font-semibold text-zinc-100", children: lesson.title }), _jsxs("div", { className: "flex items-center gap-2 mt-2 text-sm text-zinc-500", children: [_jsx(Clock, { className: "w-4 h-4" }), lesson.estimated_minutes, " min"] })] }), _jsx("div", { className: "mb-8", children: lesson.content ? (_jsxs(_Fragment, { children: [_jsx(MarkdownContent, { content: lesson.content }), _jsx("div", { className: "mt-8 pt-4 border-t border-zinc-800", children: _jsxs(fetcher.Form, { method: "post", children: [_jsx("input", { type: "hidden", name: "intent", value: "generate" }), _jsxs("button", { type: "submit", disabled: isGenerating, className: "flex items-center gap-2 text-sm text-zinc-400 hover:text-zinc-200 disabled:opacity-50", children: [_jsx(RefreshCw, { className: `w-4 h-4 ${isGenerating ? "animate-spin" : ""}` }), isGenerating ? "Regenerating..." : "Regenerate with AI"] })] }) })] })) : (_jsxs("div", { className: "bg-zinc-800 rounded-lg p-8 text-center", children: [_jsx(Sparkles, { className: "w-12 h-12 text-emerald-400 mx-auto mb-4" }), _jsx("p", { className: "text-zinc-300 mb-4", children: "This lesson hasn't been written yet." }), _jsxs(fetcher.Form, { method: "post", children: [_jsx("input", { type: "hidden", name: "intent", value: "generate" }), _jsx("button", { type: "submit", disabled: isGenerating, className: "px-6 py-3 bg-emerald-600 hover:bg-emerald-500 rounded-lg text-white font-medium disabled:opacity-50 flex items-center gap-2 mx-auto", children: isGenerating ? (_jsxs(_Fragment, { children: [_jsx(RefreshCw, { className: "w-5 h-5 animate-spin" }), "Generating..."] })) : (_jsxs(_Fragment, { children: [_jsx(Sparkles, { className: "w-5 h-5" }), "Generate with AI"] })) })] })] })) }), _jsx("div", { className: "flex justify-between items-center pt-6 border-t border-zinc-800", children: _jsxs("button", { onClick: handleComplete, disabled: fetcher.state !== "idle", className: "flex items-center gap-2 px-6 py-3 bg-emerald-600 hover:bg-emerald-500 rounded-lg text-white font-medium disabled:opacity-50", children: [_jsx(CheckCircle, { className: "w-5 h-5" }), fetcher.state !== "idle" &&
                            fetcher.formData?.get("intent") === "complete"
                            ? "Saving..."
                            : "Mark Complete"] }) })] }));
}
