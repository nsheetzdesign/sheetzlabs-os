import type { LoaderFunctionArgs } from "react-router";
import { useLoaderData, Link } from "react-router";
import { BookOpen, Clock, BarChart } from "lucide-react";
import * as Icons from "lucide-react";

export async function loader({ context }: LoaderFunctionArgs) {
  const response = await fetch(
    `${context.cloudflare.env.API_URL}/learning/paths`
  );
  const data: any = await response.json();
  return { paths: data.paths || [] };
}

export default function LearningPathsPage() {
  const { paths } = useLoaderData<typeof loader>();

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 pt-6">
      {paths.map((path: any) => {
        const IconComponent = (Icons as any)[path.icon] || BookOpen;

        return (
          <Link
            key={path.id}
            to={`/dashboard/learning/path/${path.slug}`}
            className="bg-zinc-900 border border-zinc-800 rounded-lg p-6 hover:border-zinc-700 transition-colors"
          >
            <div className="flex items-start gap-4">
              <div
                className="p-3 rounded-lg"
                style={{ backgroundColor: `${path.color}20` }}
              >
                <IconComponent
                  className="w-6 h-6"
                  style={{ color: path.color }}
                />
              </div>
              <div className="flex-1">
                <h3 className="text-lg font-medium text-zinc-100">
                  {path.title}
                </h3>
                <p className="text-sm text-zinc-400 mt-1 line-clamp-2">
                  {path.description}
                </p>
                <div className="flex items-center gap-4 mt-4 text-xs text-zinc-500">
                  <span className="flex items-center gap-1">
                    <Clock className="w-3.5 h-3.5" />
                    {path.estimated_hours}h
                  </span>
                  <span className="flex items-center gap-1">
                    <BarChart className="w-3.5 h-3.5" />
                    {path.difficulty}
                  </span>
                </div>
              </div>
            </div>
          </Link>
        );
      })}

      {/* Generate new path card */}
      <Link
        to="/dashboard/learning/generate"
        className="bg-zinc-900 border border-dashed border-zinc-700 rounded-lg p-6 hover:border-emerald-500/50 transition-colors flex items-center justify-center"
      >
        <div className="text-center">
          <div className="w-12 h-12 rounded-full bg-emerald-500/20 flex items-center justify-center mx-auto mb-3">
            <Icons.Sparkles className="w-6 h-6 text-emerald-400" />
          </div>
          <p className="text-zinc-300 font-medium">Generate Custom Path</p>
          <p className="text-xs text-zinc-500 mt-1">AI-powered curriculum</p>
        </div>
      </Link>
    </div>
  );
}
