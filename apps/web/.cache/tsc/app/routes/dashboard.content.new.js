import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useNavigate, Link } from "react-router";
import { useState } from "react";
import { ArrowLeft, Sparkles, PenLine } from "lucide-react";
export const meta = () => [{ title: "New Content — Sheetz Labs OS" }];
const CONTENT_TYPES = ["idea", "blog", "linkedin", "newsletter", "twitter", "thread"];
const TONES = [
    { value: "professional but approachable", label: "Professional" },
    { value: "casual and conversational", label: "Casual" },
    { value: "bold and contrarian", label: "Bold" },
    { value: "educational and thorough", label: "Educational" },
];
const LENGTHS = [
    { value: "short", label: "Short" },
    { value: "medium", label: "Medium" },
    { value: "long", label: "Long" },
];
export default function NewContent() {
    const navigate = useNavigate();
    const [mode, setMode] = useState("manual");
    const [loading, setLoading] = useState(false);
    const [form, setForm] = useState({
        title: "",
        body: "",
        type: "idea",
        status: "idea",
        excerpt: "",
    });
    const [genForm, setGenForm] = useState({
        type: "linkedin",
        topic: "",
        angle: "",
        tone: "professional but approachable",
        length: "medium",
    });
    async function handleCreate() {
        if (!form.title.trim())
            return;
        setLoading(true);
        const res = await fetch("/api/content", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ ...form, status: form.type === "idea" ? "idea" : "draft" }),
        });
        const { item } = await res.json();
        setLoading(false);
        if (item)
            navigate(`/dashboard/content/${item.id}`);
    }
    async function handleGenerate() {
        if (!genForm.topic.trim())
            return;
        setLoading(true);
        const res = await fetch("/api/content/generate", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(genForm),
        });
        const { item } = await res.json();
        setLoading(false);
        if (item)
            navigate(`/dashboard/content/${item.id}`);
    }
    return (_jsxs("div", { className: "mx-auto max-w-2xl p-6", children: [_jsxs(Link, { to: "/dashboard/content", className: "mb-4 inline-flex items-center gap-1.5 text-sm text-zinc-500 hover:text-zinc-300", children: [_jsx(ArrowLeft, { className: "h-3.5 w-3.5" }), "Content"] }), _jsx("h1", { className: "mb-6 text-xl font-semibold", children: "New Content" }), _jsxs("div", { className: "mb-6 flex gap-2 rounded-lg border border-surface-2/50 bg-surface-1/40 p-1", children: [_jsxs("button", { onClick: () => setMode("manual"), className: `flex flex-1 items-center justify-center gap-2 rounded-md px-4 py-2 text-sm font-medium transition-colors ${mode === "manual"
                            ? "bg-surface-2 text-white"
                            : "text-zinc-500 hover:text-zinc-300"}`, children: [_jsx(PenLine, { className: "h-4 w-4" }), "Write Manually"] }), _jsxs("button", { onClick: () => setMode("generate"), className: `flex flex-1 items-center justify-center gap-2 rounded-md px-4 py-2 text-sm font-medium transition-colors ${mode === "generate"
                            ? "bg-surface-2 text-white"
                            : "text-zinc-500 hover:text-zinc-300"}`, children: [_jsx(Sparkles, { className: "h-4 w-4" }), "Generate with AI"] })] }), mode === "manual" ? (_jsxs("div", { className: "space-y-4", children: [_jsxs("div", { children: [_jsx("label", { className: "mb-1 block text-sm text-zinc-400", children: "Title *" }), _jsx("input", { type: "text", value: form.title, onChange: (e) => setForm({ ...form, title: e.target.value }), placeholder: "Your title\u2026", className: "w-full rounded-lg border border-surface-2 bg-surface-1 px-3 py-2 text-sm text-zinc-200 placeholder-zinc-600 focus:outline-none focus:ring-1 focus:ring-brand" })] }), _jsxs("div", { children: [_jsx("label", { className: "mb-1 block text-sm text-zinc-400", children: "Type" }), _jsx("select", { value: form.type, onChange: (e) => setForm({ ...form, type: e.target.value }), className: "w-full rounded-lg border border-surface-2 bg-surface-1 px-3 py-2 text-sm text-zinc-200 focus:outline-none focus:ring-1 focus:ring-brand", children: CONTENT_TYPES.map((t) => (_jsx("option", { value: t, className: "capitalize bg-zinc-900", children: t.charAt(0).toUpperCase() + t.slice(1) }, t))) })] }), _jsxs("div", { children: [_jsx("label", { className: "mb-1 block text-sm text-zinc-400", children: "Excerpt (optional)" }), _jsx("input", { type: "text", value: form.excerpt, onChange: (e) => setForm({ ...form, excerpt: e.target.value }), placeholder: "Short summary\u2026", className: "w-full rounded-lg border border-surface-2 bg-surface-1 px-3 py-2 text-sm text-zinc-200 placeholder-zinc-600 focus:outline-none focus:ring-1 focus:ring-brand" })] }), _jsxs("div", { children: [_jsx("label", { className: "mb-1 block text-sm text-zinc-400", children: "Content" }), _jsx("textarea", { value: form.body, onChange: (e) => setForm({ ...form, body: e.target.value }), rows: 16, placeholder: "Start writing\u2026", className: "w-full rounded-lg border border-surface-2 bg-surface-1 px-3 py-2 font-mono text-sm text-zinc-200 placeholder-zinc-600 focus:outline-none focus:ring-1 focus:ring-brand" })] }), _jsx("button", { onClick: handleCreate, disabled: loading || !form.title.trim(), className: "rounded-lg bg-brand px-4 py-2 text-sm font-medium text-white hover:bg-brand-dark disabled:opacity-50", children: loading ? "Creating…" : "Create" })] })) : (_jsxs("div", { className: "space-y-4", children: [_jsxs("div", { children: [_jsx("label", { className: "mb-1 block text-sm text-zinc-400", children: "Type" }), _jsx("select", { value: genForm.type, onChange: (e) => setGenForm({ ...genForm, type: e.target.value }), className: "w-full rounded-lg border border-surface-2 bg-surface-1 px-3 py-2 text-sm text-zinc-200 focus:outline-none focus:ring-1 focus:ring-brand", children: CONTENT_TYPES.filter((t) => t !== "idea").map((t) => (_jsxs("option", { value: t, className: "capitalize bg-zinc-900", children: [t.charAt(0).toUpperCase() + t.slice(1), t === "linkedin" ? " Post" : t === "twitter" ? " Tweet" : ""] }, t))) })] }), _jsxs("div", { children: [_jsx("label", { className: "mb-1 block text-sm text-zinc-400", children: "Topic *" }), _jsx("input", { type: "text", value: genForm.topic, onChange: (e) => setGenForm({ ...genForm, topic: e.target.value }), placeholder: "e.g., Building AI agents for small businesses", className: "w-full rounded-lg border border-surface-2 bg-surface-1 px-3 py-2 text-sm text-zinc-200 placeholder-zinc-600 focus:outline-none focus:ring-1 focus:ring-brand" })] }), _jsxs("div", { children: [_jsx("label", { className: "mb-1 block text-sm text-zinc-400", children: "Angle (optional)" }), _jsx("input", { type: "text", value: genForm.angle, onChange: (e) => setGenForm({ ...genForm, angle: e.target.value }), placeholder: "e.g., Practical tips from my experience", className: "w-full rounded-lg border border-surface-2 bg-surface-1 px-3 py-2 text-sm text-zinc-200 placeholder-zinc-600 focus:outline-none focus:ring-1 focus:ring-brand" })] }), _jsxs("div", { className: "grid grid-cols-2 gap-4", children: [_jsxs("div", { children: [_jsx("label", { className: "mb-1 block text-sm text-zinc-400", children: "Tone" }), _jsx("select", { value: genForm.tone, onChange: (e) => setGenForm({ ...genForm, tone: e.target.value }), className: "w-full rounded-lg border border-surface-2 bg-surface-1 px-3 py-2 text-sm text-zinc-200 focus:outline-none focus:ring-1 focus:ring-brand", children: TONES.map((t) => (_jsx("option", { value: t.value, className: "bg-zinc-900", children: t.label }, t.value))) })] }), _jsxs("div", { children: [_jsx("label", { className: "mb-1 block text-sm text-zinc-400", children: "Length" }), _jsx("select", { value: genForm.length, onChange: (e) => setGenForm({ ...genForm, length: e.target.value }), className: "w-full rounded-lg border border-surface-2 bg-surface-1 px-3 py-2 text-sm text-zinc-200 focus:outline-none focus:ring-1 focus:ring-brand", children: LENGTHS.map((l) => (_jsx("option", { value: l.value, className: "bg-zinc-900", children: l.label }, l.value))) })] })] }), _jsxs("button", { onClick: handleGenerate, disabled: loading || !genForm.topic.trim(), className: "flex items-center gap-2 rounded-lg bg-brand px-4 py-2 text-sm font-medium text-white hover:bg-brand-dark disabled:opacity-50", children: [_jsx(Sparkles, { className: "h-4 w-4" }), loading ? "Generating…" : "Generate"] })] }))] }));
}
