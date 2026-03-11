import type { LoaderFunctionArgs } from "react-router";
import { useLoaderData, Link } from "react-router";
import { BookOpen } from "lucide-react";

export async function loader({ context }: LoaderFunctionArgs) {
  const pathsRes = await fetch(
    `${context.cloudflare.env.API_URL}/learning/paths`
  );
  const pathsData: any = await pathsRes.json();

  return { paths: pathsData.paths || [] };
}

export default function ProgressPage() {
  const { paths } = useLoaderData<typeof loader>();

  // Mock stats for now
  const stats = {
    totalTime: "0h 0m",
    lessonsCompleted: 0,
    streak: 0,
  };

  return (
    <div className="pt-6">
      {/* Stats */}
      <div className="grid grid-cols-3 gap-4 mb-8">
        <div className="bg-zinc-900 border border-zinc-800 rounded-lg p-4">
          <p className="text-sm text-zinc-400">Time Spent</p>
          <p className="text-2xl font-semibold text-zinc-100 mt-1">
            {stats.totalTime}
          </p>
        </div>
        <div className="bg-zinc-900 border border-zinc-800 rounded-lg p-4">
          <p className="text-sm text-zinc-400">Lessons Completed</p>
          <p className="text-2xl font-semibold text-zinc-100 mt-1">
            {stats.lessonsCompleted}
          </p>
        </div>
        <div className="bg-zinc-900 border border-zinc-800 rounded-lg p-4">
          <p className="text-sm text-zinc-400">Day Streak</p>
          <p className="text-2xl font-semibold text-zinc-100 mt-1">
            {stats.streak} 🔥
          </p>
        </div>
      </div>

      {/* Path progress */}
      <h2 className="text-lg font-medium text-zinc-100 mb-4">Your Paths</h2>
      <div className="space-y-3">
        {paths.map((path: any) => (
          <Link
            key={path.id}
            to={`/dashboard/learning/path/${path.slug}`}
            className="flex items-center gap-4 bg-zinc-900 border border-zinc-800 rounded-lg p-4 hover:border-zinc-700 transition-colors"
          >
            <BookOpen className="w-5 h-5 text-zinc-400" />
            <div className="flex-1">
              <p className="text-zinc-100">{path.title}</p>
              <div className="flex items-center gap-4 mt-1 text-xs text-zinc-500">
                <span>0% complete</span>
                <span>0 lessons</span>
              </div>
            </div>
            <div className="w-24 h-2 bg-zinc-800 rounded-full overflow-hidden">
              <div className="h-full bg-emerald-500" style={{ width: "0%" }} />
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
