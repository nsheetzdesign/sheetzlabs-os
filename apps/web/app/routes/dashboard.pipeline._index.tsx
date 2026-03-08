import type { LoaderFunctionArgs } from "react-router";
import { useLoaderData, Link } from "react-router";
import { Plus, Lightbulb, ChevronRight } from "lucide-react";
import { Header } from "~/components/dashboard/Header";
import { getSupabaseClient } from "~/lib/supabase.server";
import { EmptyState } from "~/components/ui/EmptyState";

const STAGE_ORDER = [
  "idea",
  "researching",
  "validating",
  "speccing",
  "building",
  "beta",
  "launched",
  "parked",
] as const;

type PipelineStage = (typeof STAGE_ORDER)[number];

const STAGE_LABELS: Record<PipelineStage, string> = {
  idea: "💡 Idea",
  researching: "🔍 Researching",
  validating: "🧪 Validating",
  speccing: "📐 Speccing",
  building: "🛠️ Building",
  beta: "🚀 Beta",
  launched: "✅ Launched",
  parked: "📦 Parked",
};

export async function loader({ context }: LoaderFunctionArgs) {
  const supabase = getSupabaseClient(context.cloudflare.env);
  const { data } = await supabase
    .from("pipeline")
    .select("*")
    .order("total_score", { ascending: false });
  return { items: data ?? [] };
}

function scoreBadge(score: number | null) {
  const s = score ?? 0;
  if (s >= 70) return "text-green-400 bg-green-500/10 border-green-500/30";
  if (s >= 50) return "text-amber-400 bg-amber-500/10 border-amber-500/30";
  return "text-red-400 bg-red-500/10 border-red-500/30";
}

export default function PipelineIndex() {
  const { items } = useLoaderData<typeof loader>();

  // Group by stage
  const byStage = new Map<PipelineStage, typeof items>();
  for (const stage of STAGE_ORDER) byStage.set(stage, []);
  for (const item of items) {
    const s = (item.stage ?? "idea") as PipelineStage;
    byStage.get(s)?.push(item);
  }

  const activeStages = STAGE_ORDER.filter((s) => (byStage.get(s)?.length ?? 0) > 0);

  return (
    <div className="flex flex-1 flex-col">
      <Header title="Pipeline" />
      <main className="flex-1 p-6">
        <div className="mb-4 flex items-center justify-between">
          <p className="text-sm text-zinc-500">
            {items.length} idea{items.length !== 1 ? "s" : ""}
          </p>
          <Link
            to="new"
            className="inline-flex items-center gap-2 rounded-lg bg-brand px-3 py-1.5 text-sm font-medium text-white transition-colors hover:bg-brand-dark"
          >
            <Plus className="h-4 w-4" />
            New Idea
          </Link>
        </div>

        {items.length === 0 ? (
          <div className="rounded-xl border border-surface-2/50 bg-surface-1/40 backdrop-blur-sm">
            <EmptyState
              icon={Lightbulb}
              title="No pipeline ideas"
              description="Start tracking ideas and score them to find your next venture."
              action={
                <Link
                  to="new"
                  className="inline-flex items-center gap-2 rounded-lg bg-brand px-4 py-2 text-sm font-medium text-white hover:bg-brand-dark"
                >
                  <Plus className="h-4 w-4" />
                  New Idea
                </Link>
              }
            />
          </div>
        ) : (
          <div className="space-y-6">
            {activeStages.map((stage) => {
              const stageItems = byStage.get(stage) ?? [];
              return (
                <div key={stage}>
                  <h3 className="mb-2 text-xs font-semibold uppercase tracking-widest text-zinc-600">
                    {STAGE_LABELS[stage]}
                    <span className="ml-2 font-mono text-zinc-700">({stageItems.length})</span>
                  </h3>
                  <div className="rounded-xl border border-surface-2/50 bg-surface-1/40 backdrop-blur-sm">
                    <div className="divide-y divide-surface-2/30 py-1">
                      {stageItems.map((item) => (
                        <Link
                          key={item.id}
                          to={item.id}
                          className="flex items-center gap-4 rounded-lg px-4 py-3 transition-colors hover:bg-surface-2/30"
                        >
                          <div className="min-w-0 flex-1">
                            <p className="text-sm font-medium text-zinc-200">{item.name}</p>
                            {item.target_market && (
                              <p className="mt-0.5 truncate text-xs text-zinc-600">
                                {item.target_market}
                              </p>
                            )}
                          </div>
                          <div className="flex shrink-0 items-center gap-3">
                            {item.venture_id && (
                              <span className="rounded border border-brand/30 bg-brand/10 px-1.5 py-0.5 text-xs font-medium text-brand">
                                venture
                              </span>
                            )}
                            <span
                              className={`rounded border px-2 py-0.5 font-mono text-sm font-semibold ${scoreBadge(item.total_score)}`}
                            >
                              {item.total_score ?? 0}
                            </span>
                            <ChevronRight className="h-4 w-4 text-zinc-700" />
                          </div>
                        </Link>
                      ))}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </main>
    </div>
  );
}
