import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
import { useLoaderData, useFetcher, Link, redirect } from "react-router";
import { ArrowLeft, RefreshCw } from "lucide-react";
import { Header } from "~/components/dashboard/Header";
import { getSupabaseClient } from "~/lib/supabase.server";
const API_URL = "https://api.sheetzlabs.com";
export async function loader({ params, context }) {
    const supabase = getSupabaseClient(context.cloudflare.env);
    const [itemRes, evalRes] = await Promise.all([
        supabase.from("pipeline").select("id, name, stage").eq("id", params.id).single(),
        supabase
            .from("pipeline_evaluations")
            .select("*")
            .eq("pipeline_id", params.id)
            .order("created_at", { ascending: false })
            .limit(1)
            .maybeSingle(),
    ]);
    if (!itemRes.data)
        throw new Response("Not found", { status: 404 });
    return { item: itemRes.data, evaluation: evalRes.data };
}
export async function action({ request, params, context }) {
    const fd = await request.formData();
    const intent = fd.get("intent");
    if (intent === "evaluate") {
        // Call the API to trigger evaluation
        await fetch(`${API_URL}/pipeline/${params.id}/evaluate`, { method: "POST" });
        return redirect(`/dashboard/pipeline/${params.id}/evaluation`);
    }
    if (intent === "create_tasks") {
        const supabase = getSupabaseClient(context.cloudflare.env);
        const steps = JSON.parse(fd.get("steps"));
        const pipelineId = params.id;
        await Promise.all(steps.map((step, i) => supabase.from("tasks").insert({
            title: step,
            description: `Auto-created from pipeline evaluation — Step ${i + 1}`,
            priority: i === 0 ? "high" : "medium",
            status: "todo",
        })));
        return redirect(`/dashboard/pipeline/${params.id}/evaluation`);
    }
    return null;
}
const SCORE_COLOR = (s) => s >= 7 ? "bg-emerald-500" : s >= 5 ? "bg-amber-500" : "bg-red-500";
const SCORE_TEXT = (s) => s >= 7 ? "text-emerald-400" : s >= 5 ? "text-amber-400" : "text-red-400";
const REC_STYLE = {
    strong_yes: "bg-emerald-500/20 text-emerald-300 border-emerald-500/30",
    yes: "bg-emerald-500/10 text-emerald-400 border-emerald-500/20",
    maybe: "bg-amber-500/20 text-amber-400 border-amber-500/30",
    no: "bg-red-500/10 text-red-400 border-red-500/20",
    strong_no: "bg-red-500/20 text-red-300 border-red-500/30",
};
export default function EvaluationDetail() {
    const { item, evaluation } = useLoaderData();
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
    const competitors = evaluation?.competitors;
    return (_jsxs("div", { className: "flex flex-1 flex-col", children: [_jsx(Header, { title: "Evaluation Results" }), _jsx("main", { className: "flex-1 p-6", children: _jsxs("div", { className: "mx-auto max-w-3xl space-y-6", children: [_jsxs(Link, { to: `/dashboard/pipeline/${item.id}`, className: "inline-flex items-center gap-1.5 text-sm text-zinc-500 hover:text-zinc-300", children: [_jsx(ArrowLeft, { className: "h-4 w-4" }), item.name] }), !evaluation ? (
                        /* No evaluation yet */
                        _jsxs("div", { className: "rounded-xl border border-surface-2/50 bg-surface-1/40 p-12 text-center backdrop-blur-sm", children: [_jsx("p", { className: "mb-4 text-zinc-400", children: "No evaluation yet for this idea." }), _jsxs(fetcher.Form, { method: "post", children: [_jsx("input", { type: "hidden", name: "intent", value: "evaluate" }), _jsx("button", { type: "submit", disabled: isEvaluating, className: "inline-flex items-center gap-2 rounded-lg bg-brand px-4 py-2 text-sm font-medium text-white hover:bg-brand-dark disabled:opacity-50", children: isEvaluating ? (_jsxs(_Fragment, { children: [_jsx(RefreshCw, { className: "h-4 w-4 animate-spin" }), "Starting evaluation\u2026"] })) : ("Run AI Evaluation") })] })] })) : (_jsxs(_Fragment, { children: [_jsxs("div", { className: "flex items-start justify-between rounded-xl border border-surface-2/50 bg-surface-1/40 px-6 py-5 backdrop-blur-sm", children: [_jsxs("div", { children: [_jsx("p", { className: "text-xs font-medium uppercase tracking-wide text-zinc-500", children: "AI Evaluation" }), _jsx("p", { className: "mt-1 text-sm text-zinc-400", children: new Date(evaluation.created_at).toLocaleDateString("en-US", {
                                                        month: "long",
                                                        day: "numeric",
                                                        year: "numeric",
                                                    }) })] }), _jsxs("div", { className: "text-right", children: [_jsx("div", { className: `font-mono text-4xl font-bold ${totalScore !== null ? SCORE_TEXT(totalScore) : "text-zinc-500"}`, children: totalScore !== null ? totalScore.toFixed(1) : "—" }), rec && (_jsx("span", { className: `mt-2 inline-block rounded border px-3 py-1 text-xs font-semibold ${REC_STYLE[rec] ?? "border-zinc-700 text-zinc-400"}`, children: recLabel }))] })] }), _jsxs("div", { className: "rounded-xl border border-surface-2/50 bg-surface-1/40 p-6 backdrop-blur-sm", children: [_jsx("h2", { className: "mb-4 text-sm font-semibold uppercase tracking-wide text-zinc-400", children: "Score Breakdown" }), _jsx("div", { className: "space-y-3", children: scores.map(({ label, score, weight }) => (_jsxs("div", { className: "flex items-center gap-3", children: [_jsx("div", { className: "w-36 text-sm text-zinc-400", children: label }), _jsx("div", { className: "flex-1 h-2 rounded-full bg-zinc-800", children: _jsx("div", { className: `h-2 rounded-full transition-all ${score !== null ? SCORE_COLOR(score) : "bg-zinc-700"}`, style: { width: `${(score ?? 0) * 10}%` } }) }), _jsx("div", { className: "w-6 text-right font-mono text-sm font-semibold", children: score ?? "—" }), _jsx("div", { className: "w-10 text-right font-mono text-xs text-zinc-600", children: weight })] }, label))) })] }), _jsx("div", { className: "grid grid-cols-2 gap-4 sm:grid-cols-4", children: [
                                        {
                                            label: "Year 1 MRR",
                                            value: evaluation.estimated_mrr_low && evaluation.estimated_mrr_high
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
                                    ].map(({ label, value }) => (_jsxs("div", { className: "rounded-xl border border-surface-2/50 bg-surface-1/40 p-4 backdrop-blur-sm", children: [_jsx("p", { className: "text-xs text-zinc-500", children: label }), _jsx("p", { className: "mt-1 font-semibold", children: value })] }, label))) }), (evaluation.market_analysis || evaluation.market_size_estimate) && (_jsxs("div", { className: "rounded-xl border border-surface-2/50 bg-surface-1/40 p-6 backdrop-blur-sm", children: [_jsx("h2", { className: "mb-3 text-sm font-semibold uppercase tracking-wide text-zinc-400", children: "Market Analysis" }), evaluation.market_analysis && (_jsx("p", { className: "text-sm text-zinc-300", children: evaluation.market_analysis })), evaluation.market_size_estimate && (_jsxs("p", { className: "mt-3 text-xs text-zinc-500", children: [_jsx("strong", { className: "text-zinc-400", children: "Market size:" }), " ", evaluation.market_size_estimate] }))] })), competitors && competitors.length > 0 && (_jsxs("div", { className: "rounded-xl border border-surface-2/50 bg-surface-1/40 p-6 backdrop-blur-sm", children: [_jsx("h2", { className: "mb-4 text-sm font-semibold uppercase tracking-wide text-zinc-400", children: "Competitors" }), _jsx("div", { className: "divide-y divide-surface-2/30", children: competitors.map((comp, i) => (_jsxs("div", { className: "flex justify-between py-3 first:pt-0 last:pb-0", children: [_jsxs("div", { children: [_jsx("p", { className: "text-sm font-medium", children: comp.name }), _jsx("p", { className: "text-xs text-zinc-500", children: comp.pricing })] }), _jsxs("div", { className: "ml-4 text-right text-xs", children: [_jsxs("p", { className: "text-emerald-400", children: ["+ ", comp.strength] }), _jsxs("p", { className: "text-red-400", children: ["\u2212 ", comp.weakness] })] })] }, i))) })] })), ((evaluation.risk_factors?.length ?? 0) > 0 ||
                                    (evaluation.success_factors?.length ?? 0) > 0) && (_jsxs("div", { className: "grid gap-4 md:grid-cols-2", children: [evaluation.risk_factors && evaluation.risk_factors.length > 0 && (_jsxs("div", { className: "rounded-xl border border-surface-2/50 bg-surface-1/40 p-5 backdrop-blur-sm", children: [_jsx("h2", { className: "mb-3 text-sm font-semibold uppercase tracking-wide text-red-400", children: "Risk Factors" }), _jsx("ul", { className: "space-y-2", children: evaluation.risk_factors.map((r, i) => (_jsxs("li", { className: "flex gap-2 text-sm", children: [_jsx("span", { className: "mt-0.5 text-red-400", children: "\u26A0" }), _jsx("span", { className: "text-zinc-300", children: r })] }, i))) })] })), evaluation.success_factors && evaluation.success_factors.length > 0 && (_jsxs("div", { className: "rounded-xl border border-surface-2/50 bg-surface-1/40 p-5 backdrop-blur-sm", children: [_jsx("h2", { className: "mb-3 text-sm font-semibold uppercase tracking-wide text-emerald-400", children: "Success Factors" }), _jsx("ul", { className: "space-y-2", children: evaluation.success_factors.map((f, i) => (_jsxs("li", { className: "flex gap-2 text-sm", children: [_jsx("span", { className: "mt-0.5 text-emerald-400", children: "\u2713" }), _jsx("span", { className: "text-zinc-300", children: f })] }, i))) })] }))] })), evaluation.recommendation_rationale && (_jsxs("div", { className: "rounded-xl border border-surface-2/50 bg-surface-1/40 p-6 backdrop-blur-sm", children: [_jsx("h2", { className: "mb-3 text-sm font-semibold uppercase tracking-wide text-zinc-400", children: "Recommendation Rationale" }), _jsx("p", { className: "text-sm text-zinc-300", children: evaluation.recommendation_rationale })] })), evaluation.suggested_mvp_scope && (_jsxs("div", { className: "rounded-xl border border-surface-2/50 bg-surface-1/40 p-6 backdrop-blur-sm", children: [_jsx("h2", { className: "mb-3 text-sm font-semibold uppercase tracking-wide text-zinc-400", children: "Suggested MVP Scope" }), _jsx("p", { className: "text-sm text-zinc-300", children: evaluation.suggested_mvp_scope })] })), evaluation.suggested_next_steps && evaluation.suggested_next_steps.length > 0 && (_jsxs("div", { className: "rounded-xl border border-surface-2/50 bg-surface-1/40 p-6 backdrop-blur-sm", children: [_jsx("h2", { className: "mb-4 text-sm font-semibold uppercase tracking-wide text-zinc-400", children: "Next Steps" }), _jsx("ol", { className: "space-y-2", children: evaluation.suggested_next_steps.map((step, i) => (_jsxs("li", { className: "flex gap-3 text-sm", children: [_jsxs("span", { className: "mt-0.5 font-mono text-zinc-600", children: [i + 1, "."] }), _jsx("span", { className: "text-zinc-300", children: step })] }, i))) }), _jsxs(fetcher.Form, { method: "post", className: "mt-4", children: [_jsx("input", { type: "hidden", name: "intent", value: "create_tasks" }), _jsx("input", { type: "hidden", name: "steps", value: JSON.stringify(evaluation.suggested_next_steps) }), _jsx("button", { type: "submit", className: "rounded-lg border border-zinc-700 px-4 py-2 text-sm hover:border-zinc-500", children: "Create Tasks from Steps" })] })] })), _jsxs("div", { className: "flex flex-wrap gap-3", children: [_jsxs(fetcher.Form, { method: "post", children: [_jsx("input", { type: "hidden", name: "intent", value: "evaluate" }), _jsx("button", { type: "submit", disabled: isEvaluating, className: "inline-flex items-center gap-2 rounded-lg border border-zinc-700 px-4 py-2 text-sm hover:border-zinc-500 disabled:opacity-50", children: isEvaluating ? (_jsxs(_Fragment, { children: [_jsx(RefreshCw, { className: "h-3 w-3 animate-spin" }), "Evaluating\u2026"] })) : ("Re-evaluate") })] }), rec && (rec === "yes" || rec === "strong_yes") && (_jsx(Link, { to: `/dashboard/pipeline/${item.id}`, className: "rounded-lg bg-emerald-600 px-4 py-2 text-sm font-medium text-white hover:bg-emerald-500", children: "Promote to Building \u2192" }))] })] }))] }) })] }));
}
