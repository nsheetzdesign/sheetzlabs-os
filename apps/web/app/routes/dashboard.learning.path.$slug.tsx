import type { LoaderFunctionArgs } from "react-router";
import { useLoaderData, Link } from "react-router";
import { ChevronRight, CheckCircle, Circle, Clock, Sparkles } from "lucide-react";

export async function loader({ params, context }: LoaderFunctionArgs) {
  const response = await fetch(
    `${context.cloudflare.env.API_URL}/learning/paths/${params.slug}`
  );
  const data: any = await response.json();

  if (!data.path) {
    throw new Response("Not Found", { status: 404 });
  }

  let progress: any[] = [];
  try {
    const progressRes = await fetch(
      `${context.cloudflare.env.API_URL}/learning/progress/${data.path.id}`
    );
    const progressData: any = await progressRes.json();
    progress = progressData.progress || [];
  } catch (e) {
    // progress stays empty
  }

  return {
    path: data.path,
    progress,
  };
}

export default function LearningPathPage() {
  const { path, progress } = useLoaderData<typeof loader>();

  const modules = path.learning_modules || [];

  const completedLessons = new Set(
    progress
      .filter((p: any) => p.status === "completed")
      .map((p: any) => p.learning_lesson_id)
  );

  const totalLessons = modules.reduce(
    (acc: number, mod: any) => acc + (mod.learning_lessons?.length || 0),
    0
  );

  const completedCount = completedLessons.size;
  const progressPercent =
    totalLessons > 0 ? Math.round((completedCount / totalLessons) * 100) : 0;

  return (
    <div className="max-w-3xl py-6">
      {/* Header */}
      <div className="mb-8">
        <Link
          to="/dashboard/learning"
          className="text-sm text-zinc-400 hover:text-zinc-200 mb-2 inline-block"
        >
          ← All Paths
        </Link>
        <h1 className="text-2xl font-semibold text-zinc-100">{path.title}</h1>
        <p className="text-zinc-400 mt-2">{path.description}</p>

        {/* Progress bar */}
        <div className="mt-4">
          <div className="flex justify-between text-sm text-zinc-400 mb-1">
            <span>
              {completedCount} of {totalLessons} lessons
            </span>
            <span>{progressPercent}%</span>
          </div>
          <div className="h-2 bg-zinc-800 rounded-full overflow-hidden">
            <div
              className="h-full bg-emerald-500 transition-all"
              style={{ width: `${progressPercent}%` }}
            />
          </div>
        </div>
      </div>

      {/* No modules message */}
      {modules.length === 0 && (
        <div className="bg-zinc-900 border border-zinc-800 rounded-lg p-8 text-center">
          <p className="text-zinc-400 mb-2">No modules found for this path.</p>
          <p className="text-sm text-zinc-500">
            Check that migration 034 has been applied.
          </p>
        </div>
      )}

      {/* Modules */}
      <div className="space-y-6">
        {modules.map((module: any, moduleIndex: number) => (
          <div
            key={module.id}
            className="bg-zinc-900 border border-zinc-800 rounded-lg overflow-hidden"
          >
            <div className="p-4 border-b border-zinc-800">
              <h2 className="text-lg font-medium text-zinc-100">
                {moduleIndex + 1}. {module.title}
              </h2>
              {module.description && (
                <p className="text-sm text-zinc-400 mt-1">
                  {module.description}
                </p>
              )}
            </div>

            {(!module.learning_lessons || module.learning_lessons.length === 0) ? (
              <div className="p-4 text-center">
                <p className="text-sm text-zinc-500">No lessons in this module yet.</p>
              </div>
            ) : (
              <div className="divide-y divide-zinc-800">
                {module.learning_lessons.map(
                  (lesson: any, lessonIndex: number) => {
                    const isCompleted = completedLessons.has(lesson.id);
                    const hasContent = !!lesson.content;

                    return (
                      <Link
                        key={lesson.id}
                        to={`/dashboard/learning/lesson/${lesson.id}`}
                        className="flex items-center gap-3 p-4 hover:bg-zinc-800/50 transition-colors"
                      >
                        {isCompleted ? (
                          <CheckCircle className="w-5 h-5 text-emerald-500 flex-shrink-0" />
                        ) : (
                          <Circle className="w-5 h-5 text-zinc-600 flex-shrink-0" />
                        )}
                        <div className="flex-1 min-w-0">
                          <p
                            className={`text-sm ${isCompleted ? "text-zinc-400" : "text-zinc-200"}`}
                          >
                            {moduleIndex + 1}.{lessonIndex + 1} {lesson.title}
                          </p>
                        </div>
                        <div className="flex items-center gap-3">
                          {!hasContent && (
                            <span className="flex items-center gap-1 text-xs text-amber-400">
                              <Sparkles className="w-3.5 h-3.5" />
                              Generate
                            </span>
                          )}
                          <span className="flex items-center gap-1 text-xs text-zinc-500">
                            <Clock className="w-3.5 h-3.5" />
                            {lesson.estimated_minutes}m
                          </span>
                        </div>
                        <ChevronRight className="w-4 h-4 text-zinc-600" />
                      </Link>
                    );
                  }
                )}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
