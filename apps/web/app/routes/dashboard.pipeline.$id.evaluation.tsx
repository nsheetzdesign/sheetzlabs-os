import type { ActionFunctionArgs, LoaderFunctionArgs } from "react-router";
import { useLoaderData, useFetcher, Link, redirect } from "react-router";
import { ArrowLeft, RefreshCw } from "lucide-react";
import { Header } from "~/components/dashboard/Header";
import { getSupabaseClient } from "~/lib/supabase.server";

const API_URL = "https://api.sheetzlabs.com";

export async function loader({ params, context }: LoaderFunctionArgs) {
  const supabase = getSupabaseClient(context.cloudflare.env);

  const [itemRes, evalRes] = await Promise.all([
    supabase.from("pipeline").select("id, name, stage").eq("id", params.id!).single(),
    supabase
      .from("pipeline_evaluations")
      .select("*")
      .eq("pipeline_id", params.id!)
      .order("created_at", { ascending: false })
      .limit(1)
      .maybeSingle(),
  ]);

  if (!itemRes.data) throw new Response("Not found", { status: 404 });

  return { item: itemRes.data, evaluation: evalRes.data };
}

export async function action({ request, params, context }: ActionFunctionArgs) {
  const fd = await request.formData();
  const intent = fd.get("intent") as string;

  if (intent === "evaluate") {
    // Call the API to trigger evaluation
    await fetch(`${API_URL}/pipeline/${params.id}/evaluate`, { method: "POST" });
    return redirect(`/dashboard/pipeline/${params.id}/evaluation`);
  }

  if (intent === "create_tasks") {
    const supabase = getSupabaseClient(context.cloudflare.env);
    const steps = JSON.parse(fd.get("steps") as string) as string[];
    const pipelineId = params.id!;

    await Promise.all(
      steps.map((step, i) =>
        supabase.from("tasks").insert({
          title: step,
          description: `Auto-created from pipeline evaluation — Step ${i + 1}`,
          priority: i === 0 ? "high" : "medium",
          status: "todo",
        })
      )
    );
    return redirect(`/dashboard/pipeline/${params.id}/evaluation`);
  }

  return null;
}

const SCORE_COLOR = (s: number) =>
  s >= 7 ? "bg-emerald-500" : s >= 5 ? "bg-amber-500" : "bg-red-500";

const SCORE_TEXT = (s: number) =>
  s >= 7 ? "text-emerald-400" : s >= 5 ? "text-amber-400" : "text-red-400";

const REC_STYLE: Record<string, string> = {
  strong_yes: "bg-emerald-500/20 text-emerald-300 border-emerald-500/30",
  yes: "bg-emerald-500/10 text-emerald-400 border-emerald-500/20",
  maybe: "bg-amber-500/20 text-amber-400 border-amber-500/30",
  no: "bg-red-500/10 text-red-400 border-red-500/20",
  strong_no: "bg-red-500/20 text-red-300 border-red-500/30",
};

export default function EvaluationDetail() {
  const { item, evaluation } = useLoaderData<typeof loader>();
  const fetcher = useFetcher();
  const isEvaluating = fetcher.state !== "idle";

  const scores = evaluation
    ? [
        { label: "Market Clarity", score: evaluation.market_clarity_score, weight: "25%" },
        { label: "Operational Fit", score: evaluation.operational_fit_score, weight: "20%" },
        { label: "AI Leverage", score: evaluation.ai_leverage_score, weight: "20%" },
        { label: "Revenue Speed", score: evaluation.revenue_speed_score, weight: "15%" },
        { label: "Competition", score: evaluation.competition_score, weight: "10%" },
        { label: "Personal Energy", score: evaluation.personal_energy_score, weight: "10%" },
      ]
    : [];

  const totalScore = evaluation?.total_score ? Number(evaluation.total_score) : null;
  const rec = evaluation?.recommendation ?? null;
  const recLabel = rec?.replace(/_/g, " ").toUpperCase();
  const competitors = evaluation?.competitors as Array<{
    name: string;
    pricing: string;
    strength: string;
    weakness: string;
  }> | null;

  return (
    <div className="flex flex-1 flex-col">
      <Header title="Evaluation Results" />
      <main className="flex-1 p-6">
        <div className="mx-auto max-w-3xl space-y-6">
          {/* Back link */}
          <Link
            to={`/dashboard/pipeline/${item.id}`}
            className="inline-flex items-center gap-1.5 text-sm text-zinc-500 hover:text-zinc-300"
          >
            <ArrowLeft className="h-4 w-4" />
            {item.name}
          </Link>

          {!evaluation ? (
            /* No evaluation yet */
            <div className="rounded-xl border border-surface-2/50 bg-surface-1/40 p-12 text-center backdrop-blur-sm">
              <p className="mb-4 text-zinc-400">No evaluation yet for this idea.</p>
              <fetcher.Form method="post">
                <input type="hidden" name="intent" value="evaluate" />
                <button
                  type="submit"
                  disabled={isEvaluating}
                  className="inline-flex items-center gap-2 rounded-lg bg-brand px-4 py-2 text-sm font-medium text-white hover:bg-brand-dark disabled:opacity-50"
                >
                  {isEvaluating ? (
                    <>
                      <RefreshCw className="h-4 w-4 animate-spin" />
                      Starting evaluation…
                    </>
                  ) : (
                    "Run AI Evaluation"
                  )}
                </button>
              </fetcher.Form>
            </div>
          ) : (
            <>
              {/* Header row */}
              <div className="flex items-start justify-between rounded-xl border border-surface-2/50 bg-surface-1/40 px-6 py-5 backdrop-blur-sm">
                <div>
                  <p className="text-xs font-medium uppercase tracking-wide text-zinc-500">
                    AI Evaluation
                  </p>
                  <p className="mt-1 text-sm text-zinc-400">
                    {new Date(evaluation.created_at!).toLocaleDateString("en-US", {
                      month: "long",
                      day: "numeric",
                      year: "numeric",
                    })}
                  </p>
                </div>
                <div className="text-right">
                  <div
                    className={`font-mono text-4xl font-bold ${totalScore !== null ? SCORE_TEXT(totalScore) : "text-zinc-500"}`}
                  >
                    {totalScore !== null ? totalScore.toFixed(1) : "—"}
                  </div>
                  {rec && (
                    <span
                      className={`mt-2 inline-block rounded border px-3 py-1 text-xs font-semibold ${REC_STYLE[rec] ?? "border-zinc-700 text-zinc-400"}`}
                    >
                      {recLabel}
                    </span>
                  )}
                </div>
              </div>

              {/* Score breakdown */}
              <div className="rounded-xl border border-surface-2/50 bg-surface-1/40 p-6 backdrop-blur-sm">
                <h2 className="mb-4 text-sm font-semibold uppercase tracking-wide text-zinc-400">
                  Score Breakdown
                </h2>
                <div className="space-y-3">
                  {scores.map(({ label, score, weight }) => (
                    <div key={label} className="flex items-center gap-3">
                      <div className="w-36 text-sm text-zinc-400">{label}</div>
                      <div className="flex-1 h-2 rounded-full bg-zinc-800">
                        <div
                          className={`h-2 rounded-full transition-all ${score !== null ? SCORE_COLOR(score) : "bg-zinc-700"}`}
                          style={{ width: `${(score ?? 0) * 10}%` }}
                        />
                      </div>
                      <div className="w-6 text-right font-mono text-sm font-semibold">
                        {score ?? "—"}
                      </div>
                      <div className="w-10 text-right font-mono text-xs text-zinc-600">
                        {weight}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Financial estimates */}
              <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
                {[
                  {
                    label: "Year 1 MRR",
                    value:
                      evaluation.estimated_mrr_low && evaluation.estimated_mrr_high
                        ? `$${evaluation.estimated_mrr_low.toLocaleString()}–$${evaluation.estimated_mrr_high.toLocaleString()}`
                        : "—",
                  },
                  {
                    label: "Startup Cost",
                    value: evaluation.estimated_startup_cost
                      ? `$${evaluation.estimated_startup_cost.toLocaleString()}`
                      : "—",
                  },
                  {
                    label: "Monthly Cost",
                    value: evaluation.estimated_monthly_cost
                      ? `$${evaluation.estimated_monthly_cost.toLocaleString()}`
                      : "—",
                  },
                  {
                    label: "Time to Revenue",
                    value: evaluation.estimated_time_to_revenue ?? "—",
                  },
                ].map(({ label, value }) => (
                  <div
                    key={label}
                    className="rounded-xl border border-surface-2/50 bg-surface-1/40 p-4 backdrop-blur-sm"
                  >
                    <p className="text-xs text-zinc-500">{label}</p>
                    <p className="mt-1 font-semibold">{value}</p>
                  </div>
                ))}
              </div>

              {/* Market analysis */}
              {(evaluation.market_analysis || evaluation.market_size_estimate) && (
                <div className="rounded-xl border border-surface-2/50 bg-surface-1/40 p-6 backdrop-blur-sm">
                  <h2 className="mb-3 text-sm font-semibold uppercase tracking-wide text-zinc-400">
                    Market Analysis
                  </h2>
                  {evaluation.market_analysis && (
                    <p className="text-sm text-zinc-300">{evaluation.market_analysis}</p>
                  )}
                  {evaluation.market_size_estimate && (
                    <p className="mt-3 text-xs text-zinc-500">
                      <strong className="text-zinc-400">Market size:</strong>{" "}
                      {evaluation.market_size_estimate}
                    </p>
                  )}
                </div>
              )}

              {/* Competitors */}
              {competitors && competitors.length > 0 && (
                <div className="rounded-xl border border-surface-2/50 bg-surface-1/40 p-6 backdrop-blur-sm">
                  <h2 className="mb-4 text-sm font-semibold uppercase tracking-wide text-zinc-400">
                    Competitors
                  </h2>
                  <div className="divide-y divide-surface-2/30">
                    {competitors.map((comp, i) => (
                      <div key={i} className="flex justify-between py-3 first:pt-0 last:pb-0">
                        <div>
                          <p className="text-sm font-medium">{comp.name}</p>
                          <p className="text-xs text-zinc-500">{comp.pricing}</p>
                        </div>
                        <div className="ml-4 text-right text-xs">
                          <p className="text-emerald-400">+ {comp.strength}</p>
                          <p className="text-red-400">− {comp.weakness}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Risk / success factors */}
              {((evaluation.risk_factors?.length ?? 0) > 0 ||
                (evaluation.success_factors?.length ?? 0) > 0) && (
                <div className="grid gap-4 md:grid-cols-2">
                  {evaluation.risk_factors && evaluation.risk_factors.length > 0 && (
                    <div className="rounded-xl border border-surface-2/50 bg-surface-1/40 p-5 backdrop-blur-sm">
                      <h2 className="mb-3 text-sm font-semibold uppercase tracking-wide text-red-400">
                        Risk Factors
                      </h2>
                      <ul className="space-y-2">
                        {evaluation.risk_factors.map((r: string, i: number) => (
                          <li key={i} className="flex gap-2 text-sm">
                            <span className="mt-0.5 text-red-400">⚠</span>
                            <span className="text-zinc-300">{r}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                  {evaluation.success_factors && evaluation.success_factors.length > 0 && (
                    <div className="rounded-xl border border-surface-2/50 bg-surface-1/40 p-5 backdrop-blur-sm">
                      <h2 className="mb-3 text-sm font-semibold uppercase tracking-wide text-emerald-400">
                        Success Factors
                      </h2>
                      <ul className="space-y-2">
                        {evaluation.success_factors.map((f: string, i: number) => (
                          <li key={i} className="flex gap-2 text-sm">
                            <span className="mt-0.5 text-emerald-400">✓</span>
                            <span className="text-zinc-300">{f}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              )}

              {/* Rationale */}
              {evaluation.recommendation_rationale && (
                <div className="rounded-xl border border-surface-2/50 bg-surface-1/40 p-6 backdrop-blur-sm">
                  <h2 className="mb-3 text-sm font-semibold uppercase tracking-wide text-zinc-400">
                    Recommendation Rationale
                  </h2>
                  <p className="text-sm text-zinc-300">{evaluation.recommendation_rationale}</p>
                </div>
              )}

              {/* MVP scope */}
              {evaluation.suggested_mvp_scope && (
                <div className="rounded-xl border border-surface-2/50 bg-surface-1/40 p-6 backdrop-blur-sm">
                  <h2 className="mb-3 text-sm font-semibold uppercase tracking-wide text-zinc-400">
                    Suggested MVP Scope
                  </h2>
                  <p className="text-sm text-zinc-300">{evaluation.suggested_mvp_scope}</p>
                </div>
              )}

              {/* Next steps */}
              {evaluation.suggested_next_steps && evaluation.suggested_next_steps.length > 0 && (
                <div className="rounded-xl border border-surface-2/50 bg-surface-1/40 p-6 backdrop-blur-sm">
                  <h2 className="mb-4 text-sm font-semibold uppercase tracking-wide text-zinc-400">
                    Next Steps
                  </h2>
                  <ol className="space-y-2">
                    {evaluation.suggested_next_steps.map((step: string, i: number) => (
                      <li key={i} className="flex gap-3 text-sm">
                        <span className="mt-0.5 font-mono text-zinc-600">{i + 1}.</span>
                        <span className="text-zinc-300">{step}</span>
                      </li>
                    ))}
                  </ol>
                  <fetcher.Form method="post" className="mt-4">
                    <input type="hidden" name="intent" value="create_tasks" />
                    <input
                      type="hidden"
                      name="steps"
                      value={JSON.stringify(evaluation.suggested_next_steps)}
                    />
                    <button
                      type="submit"
                      className="rounded-lg border border-zinc-700 px-4 py-2 text-sm hover:border-zinc-500"
                    >
                      Create Tasks from Steps
                    </button>
                  </fetcher.Form>
                </div>
              )}

              {/* Action row */}
              <div className="flex flex-wrap gap-3">
                <fetcher.Form method="post">
                  <input type="hidden" name="intent" value="evaluate" />
                  <button
                    type="submit"
                    disabled={isEvaluating}
                    className="inline-flex items-center gap-2 rounded-lg border border-zinc-700 px-4 py-2 text-sm hover:border-zinc-500 disabled:opacity-50"
                  >
                    {isEvaluating ? (
                      <>
                        <RefreshCw className="h-3 w-3 animate-spin" />
                        Evaluating…
                      </>
                    ) : (
                      "Re-evaluate"
                    )}
                  </button>
                </fetcher.Form>

                {rec && (rec === "yes" || rec === "strong_yes") && (
                  <Link
                    to={`/dashboard/pipeline/${item.id}`}
                    className="rounded-lg bg-emerald-600 px-4 py-2 text-sm font-medium text-white hover:bg-emerald-500"
                  >
                    Promote to Building →
                  </Link>
                )}
              </div>
            </>
          )}
        </div>
      </main>
    </div>
  );
}
