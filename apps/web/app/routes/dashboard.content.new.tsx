import type { MetaFunction } from "react-router";
import { useNavigate, Link } from "react-router";
import { useState } from "react";
import { ArrowLeft, Sparkles, PenLine } from "lucide-react";

export const meta: MetaFunction = () => [{ title: "New Content — Sheetz Labs OS" }];

const CONTENT_TYPES = ["idea", "blog", "linkedin", "newsletter", "twitter", "thread"] as const;
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
  const [mode, setMode] = useState<"manual" | "generate">("manual");
  const [loading, setLoading] = useState(false);

  const [form, setForm] = useState({
    title: "",
    body: "",
    type: "idea" as string,
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
    if (!form.title.trim()) return;
    setLoading(true);
    const res = await fetch("/api/content", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ...form, status: form.type === "idea" ? "idea" : "draft" }),
    });
    const { item } = await res.json();
    setLoading(false);
    if (item) navigate(`/dashboard/knowledge/content/${item.id}`);
  }

  async function handleGenerate() {
    if (!genForm.topic.trim()) return;
    setLoading(true);
    const res = await fetch("/api/content/generate", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(genForm),
    });
    const { item } = await res.json();
    setLoading(false);
    if (item) navigate(`/dashboard/knowledge/content/${item.id}`);
  }

  return (
    <div className="mx-auto max-w-2xl p-6">
      <Link
        to="/dashboard/knowledge/content"
        className="mb-4 inline-flex items-center gap-1.5 text-sm text-zinc-500 hover:text-zinc-300"
      >
        <ArrowLeft className="h-3.5 w-3.5" />
        Content
      </Link>

      <h1 className="mb-6 text-xl font-semibold">New Content</h1>

      {/* Mode toggle */}
      <div className="mb-6 flex gap-2 rounded-lg border border-surface-2/50 bg-surface-1/40 p-1">
        <button
          onClick={() => setMode("manual")}
          className={`flex flex-1 items-center justify-center gap-2 rounded-md px-4 py-2 text-sm font-medium transition-colors ${
            mode === "manual"
              ? "bg-surface-2 text-white"
              : "text-zinc-500 hover:text-zinc-300"
          }`}
        >
          <PenLine className="h-4 w-4" />
          Write Manually
        </button>
        <button
          onClick={() => setMode("generate")}
          className={`flex flex-1 items-center justify-center gap-2 rounded-md px-4 py-2 text-sm font-medium transition-colors ${
            mode === "generate"
              ? "bg-surface-2 text-white"
              : "text-zinc-500 hover:text-zinc-300"
          }`}
        >
          <Sparkles className="h-4 w-4" />
          Generate with AI
        </button>
      </div>

      {mode === "manual" ? (
        <div className="space-y-4">
          <div>
            <label className="mb-1 block text-sm text-zinc-400">Title *</label>
            <input
              type="text"
              value={form.title}
              onChange={(e) => setForm({ ...form, title: e.target.value })}
              placeholder="Your title…"
              className="w-full rounded-lg border border-surface-2 bg-surface-1 px-3 py-2 text-sm text-zinc-200 placeholder-zinc-600 focus:outline-none focus:ring-1 focus:ring-brand"
            />
          </div>

          <div>
            <label className="mb-1 block text-sm text-zinc-400">Type</label>
            <select
              value={form.type}
              onChange={(e) => setForm({ ...form, type: e.target.value })}
              className="w-full rounded-lg border border-surface-2 bg-surface-1 px-3 py-2 text-sm text-zinc-200 focus:outline-none focus:ring-1 focus:ring-brand"
            >
              {CONTENT_TYPES.map((t) => (
                <option key={t} value={t} className="capitalize bg-zinc-900">
                  {t.charAt(0).toUpperCase() + t.slice(1)}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="mb-1 block text-sm text-zinc-400">Excerpt (optional)</label>
            <input
              type="text"
              value={form.excerpt}
              onChange={(e) => setForm({ ...form, excerpt: e.target.value })}
              placeholder="Short summary…"
              className="w-full rounded-lg border border-surface-2 bg-surface-1 px-3 py-2 text-sm text-zinc-200 placeholder-zinc-600 focus:outline-none focus:ring-1 focus:ring-brand"
            />
          </div>

          <div>
            <label className="mb-1 block text-sm text-zinc-400">Content</label>
            <textarea
              value={form.body}
              onChange={(e) => setForm({ ...form, body: e.target.value })}
              rows={16}
              placeholder="Start writing…"
              className="w-full rounded-lg border border-surface-2 bg-surface-1 px-3 py-2 font-mono text-sm text-zinc-200 placeholder-zinc-600 focus:outline-none focus:ring-1 focus:ring-brand"
            />
          </div>

          <button
            onClick={handleCreate}
            disabled={loading || !form.title.trim()}
            className="rounded-lg bg-brand px-4 py-2 text-sm font-medium text-white hover:bg-brand-dark disabled:opacity-50"
          >
            {loading ? "Creating…" : "Create"}
          </button>
        </div>
      ) : (
        <div className="space-y-4">
          <div>
            <label className="mb-1 block text-sm text-zinc-400">Type</label>
            <select
              value={genForm.type}
              onChange={(e) => setGenForm({ ...genForm, type: e.target.value })}
              className="w-full rounded-lg border border-surface-2 bg-surface-1 px-3 py-2 text-sm text-zinc-200 focus:outline-none focus:ring-1 focus:ring-brand"
            >
              {CONTENT_TYPES.filter((t) => t !== "idea").map((t) => (
                <option key={t} value={t} className="capitalize bg-zinc-900">
                  {t.charAt(0).toUpperCase() + t.slice(1)}
                  {t === "linkedin" ? " Post" : t === "twitter" ? " Tweet" : ""}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="mb-1 block text-sm text-zinc-400">Topic *</label>
            <input
              type="text"
              value={genForm.topic}
              onChange={(e) => setGenForm({ ...genForm, topic: e.target.value })}
              placeholder="e.g., Building AI agents for small businesses"
              className="w-full rounded-lg border border-surface-2 bg-surface-1 px-3 py-2 text-sm text-zinc-200 placeholder-zinc-600 focus:outline-none focus:ring-1 focus:ring-brand"
            />
          </div>

          <div>
            <label className="mb-1 block text-sm text-zinc-400">Angle (optional)</label>
            <input
              type="text"
              value={genForm.angle}
              onChange={(e) => setGenForm({ ...genForm, angle: e.target.value })}
              placeholder="e.g., Practical tips from my experience"
              className="w-full rounded-lg border border-surface-2 bg-surface-1 px-3 py-2 text-sm text-zinc-200 placeholder-zinc-600 focus:outline-none focus:ring-1 focus:ring-brand"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="mb-1 block text-sm text-zinc-400">Tone</label>
              <select
                value={genForm.tone}
                onChange={(e) => setGenForm({ ...genForm, tone: e.target.value })}
                className="w-full rounded-lg border border-surface-2 bg-surface-1 px-3 py-2 text-sm text-zinc-200 focus:outline-none focus:ring-1 focus:ring-brand"
              >
                {TONES.map((t) => (
                  <option key={t.value} value={t.value} className="bg-zinc-900">
                    {t.label}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="mb-1 block text-sm text-zinc-400">Length</label>
              <select
                value={genForm.length}
                onChange={(e) => setGenForm({ ...genForm, length: e.target.value })}
                className="w-full rounded-lg border border-surface-2 bg-surface-1 px-3 py-2 text-sm text-zinc-200 focus:outline-none focus:ring-1 focus:ring-brand"
              >
                {LENGTHS.map((l) => (
                  <option key={l.value} value={l.value} className="bg-zinc-900">
                    {l.label}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <button
            onClick={handleGenerate}
            disabled={loading || !genForm.topic.trim()}
            className="flex items-center gap-2 rounded-lg bg-brand px-4 py-2 text-sm font-medium text-white hover:bg-brand-dark disabled:opacity-50"
          >
            <Sparkles className="h-4 w-4" />
            {loading ? "Generating…" : "Generate"}
          </button>
        </div>
      )}
    </div>
  );
}
