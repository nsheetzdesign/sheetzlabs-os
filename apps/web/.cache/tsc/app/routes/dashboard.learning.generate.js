import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
import { useState } from "react";
import { useNavigate } from "react-router";
import { Sparkles, Loader2 } from "lucide-react";
export default function GenerateCurriculumPage() {
    const navigate = useNavigate();
    const [topic, setTopic] = useState("");
    const [depth, setDepth] = useState("comprehensive");
    const [includeExercises, setIncludeExercises] = useState(true);
    const [loading, setLoading] = useState(false);
    const [result, setResult] = useState(null);
    const [error, setError] = useState("");
    const handleGenerate = async () => {
        if (!topic.trim())
            return;
        setLoading(true);
        setError("");
        setResult(null);
        try {
            const response = await fetch("/api/learning/generate/curriculum", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    topic,
                    depth,
                    include_exercises: includeExercises,
                }),
            });
            const data = await response.json();
            if (data.error) {
                setError(data.error);
            }
            else {
                setResult(data.curriculum);
            }
        }
        catch {
            setError("Failed to generate curriculum. Please try again.");
        }
        setLoading(false);
    };
    return (_jsxs("div", { className: "max-w-2xl py-6", children: [_jsxs("div", { className: "mb-8", children: [_jsx("button", { onClick: () => navigate("/dashboard/learning"), className: "text-sm text-zinc-400 hover:text-zinc-200 mb-2 inline-block", children: "\u2190 All Paths" }), _jsx("h1", { className: "text-2xl font-semibold text-zinc-100", children: "Generate Learning Path" }), _jsx("p", { className: "text-zinc-400 mt-2", children: "AI will create a custom curriculum for any topic." })] }), _jsxs("div", { className: "space-y-4", children: [_jsxs("div", { children: [_jsx("label", { className: "block text-sm font-medium text-zinc-300 mb-2", children: "Topic" }), _jsx("input", { type: "text", value: topic, onChange: (e) => setTopic(e.target.value), placeholder: "e.g. GraphQL, Rust, System Design...", className: "w-full px-4 py-3 bg-zinc-800 border border-zinc-700 rounded-lg text-zinc-100 placeholder-zinc-500 focus:outline-none focus:border-emerald-500" })] }), _jsxs("div", { children: [_jsx("label", { className: "block text-sm font-medium text-zinc-300 mb-2", children: "Depth" }), _jsxs("select", { value: depth, onChange: (e) => setDepth(e.target.value), className: "w-full px-4 py-3 bg-zinc-800 border border-zinc-700 rounded-lg text-zinc-100 focus:outline-none focus:border-emerald-500", children: [_jsx("option", { value: "quick", children: "Quick Overview (3-5 modules)" }), _jsx("option", { value: "comprehensive", children: "Comprehensive (8-12 modules)" }), _jsx("option", { value: "deep", children: "Deep Dive (15+ modules)" })] })] }), _jsxs("label", { className: "flex items-center gap-3 cursor-pointer", children: [_jsx("input", { type: "checkbox", checked: includeExercises, onChange: (e) => setIncludeExercises(e.target.checked), className: "w-4 h-4 rounded border-zinc-600 bg-zinc-800 text-emerald-500" }), _jsx("span", { className: "text-sm text-zinc-300", children: "Include practical exercises" })] }), _jsx("button", { onClick: handleGenerate, disabled: !topic.trim() || loading, className: "flex items-center gap-2 px-6 py-3 bg-emerald-600 hover:bg-emerald-500 rounded-lg text-white font-medium disabled:opacity-50 w-full justify-center", children: loading ? (_jsxs(_Fragment, { children: [_jsx(Loader2, { className: "w-5 h-5 animate-spin" }), "Generating..."] })) : (_jsxs(_Fragment, { children: [_jsx(Sparkles, { className: "w-5 h-5" }), "Generate Curriculum"] })) })] }), error && (_jsx("div", { className: "mt-6 p-4 bg-red-900/20 border border-red-800 rounded-lg text-red-400 text-sm", children: error })), result && (_jsxs("div", { className: "mt-8 bg-zinc-900 border border-zinc-800 rounded-lg p-6", children: [_jsx("h2", { className: "text-xl font-semibold text-zinc-100 mb-2", children: result.title }), _jsx("p", { className: "text-zinc-400 text-sm mb-4", children: result.description }), _jsxs("div", { className: "flex gap-4 text-xs text-zinc-500 mb-6", children: [_jsxs("span", { children: [result.estimated_hours, "h estimated"] }), _jsx("span", { children: result.difficulty }), _jsxs("span", { children: [result.modules?.length, " modules"] })] }), _jsx("div", { className: "space-y-4", children: result.modules?.map((mod, i) => (_jsxs("div", { className: "border border-zinc-800 rounded-lg p-4", children: [_jsxs("h3", { className: "text-zinc-200 font-medium mb-1", children: [i + 1, ". ", mod.title] }), _jsx("p", { className: "text-zinc-500 text-sm mb-3", children: mod.description }), _jsx("ul", { className: "space-y-1", children: mod.lessons?.map((lesson, j) => (_jsxs("li", { className: "text-xs text-zinc-400 flex gap-2", children: [_jsxs("span", { className: "text-zinc-600", children: [i + 1, ".", j + 1] }), lesson.title, _jsxs("span", { className: "text-zinc-600 ml-auto", children: [lesson.estimated_minutes, "m"] })] }, j))) })] }, i))) })] }))] }));
}
