import { useState } from "react";
import { useNavigate } from "react-router";
import { Sparkles, Loader2 } from "lucide-react";

export default function GenerateCurriculumPage() {
  const navigate = useNavigate();
  const [topic, setTopic] = useState("");
  const [depth, setDepth] = useState("comprehensive");
  const [includeExercises, setIncludeExercises] = useState(true);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<any>(null);
  const [error, setError] = useState("");

  const handleGenerate = async () => {
    if (!topic.trim()) return;
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

      const data: any = await response.json();
      if (data.error) {
        setError(data.error);
      } else {
        setResult(data.curriculum);
      }
    } catch {
      setError("Failed to generate curriculum. Please try again.");
    }

    setLoading(false);
  };

  return (
    <div className="max-w-2xl py-6">
      <div className="mb-8">
        <button
          onClick={() => navigate("/dashboard/learning")}
          className="text-sm text-zinc-400 hover:text-zinc-200 mb-2 inline-block"
        >
          ← All Paths
        </button>
        <h1 className="text-2xl font-semibold text-zinc-100">
          Generate Learning Path
        </h1>
        <p className="text-zinc-400 mt-2">
          AI will create a custom curriculum for any topic.
        </p>
      </div>

      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-zinc-300 mb-2">
            Topic
          </label>
          <input
            type="text"
            value={topic}
            onChange={(e) => setTopic(e.target.value)}
            placeholder="e.g. GraphQL, Rust, System Design..."
            className="w-full px-4 py-3 bg-zinc-800 border border-zinc-700 rounded-lg text-zinc-100 placeholder-zinc-500 focus:outline-none focus:border-emerald-500"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-zinc-300 mb-2">
            Depth
          </label>
          <select
            value={depth}
            onChange={(e) => setDepth(e.target.value)}
            className="w-full px-4 py-3 bg-zinc-800 border border-zinc-700 rounded-lg text-zinc-100 focus:outline-none focus:border-emerald-500"
          >
            <option value="quick">Quick Overview (3-5 modules)</option>
            <option value="comprehensive">Comprehensive (8-12 modules)</option>
            <option value="deep">Deep Dive (15+ modules)</option>
          </select>
        </div>

        <label className="flex items-center gap-3 cursor-pointer">
          <input
            type="checkbox"
            checked={includeExercises}
            onChange={(e) => setIncludeExercises(e.target.checked)}
            className="w-4 h-4 rounded border-zinc-600 bg-zinc-800 text-emerald-500"
          />
          <span className="text-sm text-zinc-300">Include practical exercises</span>
        </label>

        <button
          onClick={handleGenerate}
          disabled={!topic.trim() || loading}
          className="flex items-center gap-2 px-6 py-3 bg-emerald-600 hover:bg-emerald-500 rounded-lg text-white font-medium disabled:opacity-50 w-full justify-center"
        >
          {loading ? (
            <>
              <Loader2 className="w-5 h-5 animate-spin" />
              Generating...
            </>
          ) : (
            <>
              <Sparkles className="w-5 h-5" />
              Generate Curriculum
            </>
          )}
        </button>
      </div>

      {error && (
        <div className="mt-6 p-4 bg-red-900/20 border border-red-800 rounded-lg text-red-400 text-sm">
          {error}
        </div>
      )}

      {result && (
        <div className="mt-8 bg-zinc-900 border border-zinc-800 rounded-lg p-6">
          <h2 className="text-xl font-semibold text-zinc-100 mb-2">
            {result.title}
          </h2>
          <p className="text-zinc-400 text-sm mb-4">{result.description}</p>
          <div className="flex gap-4 text-xs text-zinc-500 mb-6">
            <span>{result.estimated_hours}h estimated</span>
            <span>{result.difficulty}</span>
            <span>{result.modules?.length} modules</span>
          </div>

          <div className="space-y-4">
            {result.modules?.map((mod: any, i: number) => (
              <div key={i} className="border border-zinc-800 rounded-lg p-4">
                <h3 className="text-zinc-200 font-medium mb-1">
                  {i + 1}. {mod.title}
                </h3>
                <p className="text-zinc-500 text-sm mb-3">{mod.description}</p>
                <ul className="space-y-1">
                  {mod.lessons?.map((lesson: any, j: number) => (
                    <li key={j} className="text-xs text-zinc-400 flex gap-2">
                      <span className="text-zinc-600">
                        {i + 1}.{j + 1}
                      </span>
                      {lesson.title}
                      <span className="text-zinc-600 ml-auto">
                        {lesson.estimated_minutes}m
                      </span>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
