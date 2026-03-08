import type { ActionFunctionArgs, LoaderFunctionArgs } from "react-router";
import {
  useLoaderData,
  useActionData,
  Form,
  Link,
  redirect,
  data,
} from "react-router";
import { Header } from "~/components/dashboard/Header";
import { getSupabaseClient } from "~/lib/supabase.server";
import { FormField } from "~/components/ui/FormField";
import { Input } from "~/components/ui/Input";
import { Select } from "~/components/ui/Select";
import { Button } from "~/components/ui/Button";

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

const NEXT_STAGE: Record<string, string> = {
  idea: "researching",
  researching: "validating",
  validating: "speccing",
  speccing: "building",
  building: "beta",
  beta: "launched",
};

const SCORES = [
  { field: "score_operator_insight", label: "Operator Insight", max: 25, hint: "Your edge as an operator" },
  { field: "score_ai_leverage", label: "AI Leverage", max: 20, hint: "AI can meaningfully accelerate this" },
  { field: "score_market_size", label: "Market Size", max: 15, hint: "TAM potential" },
  { field: "score_revenue_speed", label: "Revenue Speed", max: 15, hint: "How fast can this generate revenue" },
  { field: "score_portfolio_fit", label: "Portfolio Fit", max: 15, hint: "Complements existing ventures" },
  { field: "score_personal_energy", label: "Personal Energy", max: 10, hint: "Excited to build this" },
] as const;

export async function loader({ params, context }: LoaderFunctionArgs) {
  const supabase = getSupabaseClient(context.cloudflare.env);

  const [itemRes, venturesRes] = await Promise.all([
    supabase.from("pipeline").select("*").eq("id", params.id!).single(),
    supabase.from("ventures").select("id, name, slug").order("name"),
  ]);

  if (!itemRes.data) throw new Response("Not found", { status: 404 });

  return {
    item: itemRes.data,
    ventures: venturesRes.data ?? [],
  };
}

export async function action({ request, params, context }: ActionFunctionArgs) {
  const supabase = getSupabaseClient(context.cloudflare.env);
  const fd = await request.formData();
  const intent = fd.get("intent") as string;

  // Advance stage
  if (intent === "advance") {
    const current = fd.get("current_stage") as string;
    const next = NEXT_STAGE[current];
    if (next) {
      await supabase.from("pipeline").update({ stage: next as never }).eq("id", params.id!);
    }
    return redirect(`/dashboard/pipeline/${params.id}`);
  }

  // Park
  if (intent === "park") {
    await supabase
      .from("pipeline")
      .update({ stage: "parked" as never })
      .eq("id", params.id!);
    return redirect("/dashboard/pipeline");
  }

  // Promote to venture
  if (intent === "promote") {
    const name = fd.get("venture_name") as string;
    const rawSlug = (fd.get("venture_slug") as string)?.trim();
    const slug =
      rawSlug || name.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");

    const { data: newVenture, error: vErr } = await supabase
      .from("ventures")
      .insert({ name, slug, status: "idea" as never, stage: "pre-revenue" as never })
      .select("slug")
      .single();

    if (vErr) return data({ errors: { _form: vErr.message } }, { status: 500 });

    await supabase
      .from("pipeline")
      .update({ venture_id: newVenture.slug ? undefined : undefined, stage: "launched" as never })
      .eq("id", params.id!);

    // Link by fetching the inserted venture id
    const { data: createdVenture } = await supabase
      .from("ventures")
      .select("id, slug")
      .eq("slug", newVenture.slug)
      .single();

    if (createdVenture) {
      await supabase
        .from("pipeline")
        .update({ venture_id: createdVenture.id })
        .eq("id", params.id!);
    }

    return redirect(`/dashboard/ventures/${newVenture.slug}`);
  }

  // Default: update
  const name = (fd.get("name") as string)?.trim();
  const problem_statement = (fd.get("problem_statement") as string)?.trim() || null;
  const target_market = (fd.get("target_market") as string)?.trim() || null;
  const stage = fd.get("stage") as string;
  const notes = (fd.get("notes") as string)?.trim() || null;

  const scoreFields: Record<string, number> = {};
  for (const s of SCORES) {
    scoreFields[s.field] = Math.min(
      s.max,
      Math.max(0, parseInt((fd.get(s.field) as string) || "0", 10)),
    );
  }

  const errors: Record<string, string> = {};
  if (!name) errors.name = "Required";
  if (Object.keys(errors).length) return data({ errors }, { status: 400 });

  const { error } = await supabase
    .from("pipeline")
    .update({
      name,
      problem_statement,
      target_market,
      stage: stage as never,
      notes,
      ...scoreFields,
    } as never)
    .eq("id", params.id!);

  if (error) return data({ errors: { _form: error.message } }, { status: 500 });

  return redirect(`/dashboard/pipeline/${params.id}`);
}

function ScoreBadge({ score }: { score: number | null }) {
  const s = score ?? 0;
  const cls =
    s >= 70
      ? "text-green-400 bg-green-500/10 border-green-500/30"
      : s >= 50
        ? "text-amber-400 bg-amber-500/10 border-amber-500/30"
        : "text-red-400 bg-red-500/10 border-red-500/30";
  return (
    <span className={`rounded border px-3 py-1 font-mono text-xl font-bold ${cls}`}>
      {s} / 100
    </span>
  );
}

function ScoreBar({ value, max }: { value: number; max: number }) {
  const pct = Math.round((value / max) * 100);
  return (
    <div className="h-1.5 w-full rounded-full bg-surface-2/50">
      <div
        className="h-1.5 rounded-full bg-brand transition-all"
        style={{ width: `${pct}%` }}
      />
    </div>
  );
}

export default function EditPipeline() {
  const { item, ventures } = useLoaderData<typeof loader>();
  const actionData = useActionData<typeof action>();
  const errors = actionData?.errors ?? {};

  const currentStage = item.stage ?? "idea";
  const nextStage = NEXT_STAGE[currentStage];
  const isLaunched = currentStage === "launched";
  const isParked = currentStage === "parked";

  const STAGES = [
    "idea",
    "researching",
    "validating",
    "speccing",
    "building",
    "beta",
    "launched",
    "parked",
  ];

  return (
    <div className="flex flex-1 flex-col">
      <Header title={item.name} />
      <main className="flex-1 p-6">
        <div className="mx-auto max-w-2xl space-y-4">
          {errors._form && (
            <div className="rounded-lg border border-red-500/20 bg-red-500/10 px-4 py-3 text-sm text-red-400">
              {errors._form}
            </div>
          )}

          {/* Score summary */}
          <div className="flex items-center justify-between rounded-xl border border-surface-2/50 bg-surface-1/40 px-5 py-4 backdrop-blur-sm">
            <div>
              <p className="text-xs font-medium uppercase tracking-wide text-zinc-600">
                Total Score
              </p>
              <div className="mt-1">
                <ScoreBadge score={item.total_score} />
              </div>
            </div>
            <div className="text-right">
              <p className="text-xs font-medium uppercase tracking-wide text-zinc-600">Stage</p>
              <p className="mt-1 text-sm font-semibold capitalize text-zinc-300">{currentStage}</p>
            </div>
          </div>

          {/* Stage actions */}
          <div className="flex flex-wrap gap-2">
            {nextStage && !isParked && (
              <Form method="post">
                <input type="hidden" name="intent" value="advance" />
                <input type="hidden" name="current_stage" value={currentStage} />
                <Button type="submit">
                  Advance → {nextStage}
                </Button>
              </Form>
            )}

            {isLaunched && !item.venture_id && (
              <Form method="post" className="flex items-center gap-2">
                <input type="hidden" name="intent" value="promote" />
                <input
                  type="text"
                  name="venture_name"
                  defaultValue={item.name}
                  placeholder="Venture name"
                  className="rounded-lg border border-surface-2/50 bg-surface-1 px-3 py-1.5 text-sm text-zinc-200 focus:outline-none focus:ring-1 focus:ring-brand"
                />
                <input
                  type="text"
                  name="venture_slug"
                  placeholder="slug (optional)"
                  className="w-28 rounded-lg border border-surface-2/50 bg-surface-1 px-3 py-1.5 text-sm text-zinc-200 focus:outline-none focus:ring-1 focus:ring-brand"
                />
                <Button type="submit" variant="secondary">
                  🚀 Promote to Venture
                </Button>
              </Form>
            )}

            {item.venture_id && (
              <Link to={`/dashboard/ventures/${ventures.find((v) => v.id === item.venture_id)?.slug ?? ""}`}>
                <Button type="button" variant="secondary">View Venture →</Button>
              </Link>
            )}

            {!isParked && (
              <Form
                method="post"
                onSubmit={(e) => {
                  if (!confirm("Park this idea?")) e.preventDefault();
                }}
              >
                <input type="hidden" name="intent" value="park" />
                <Button type="submit" variant="danger">
                  📦 Park
                </Button>
              </Form>
            )}
          </div>

          {/* Main edit form */}
          <Form
            method="post"
            className="space-y-5 rounded-xl border border-surface-2/50 bg-surface-1/40 p-6 backdrop-blur-sm"
          >
            <div className="grid gap-5 sm:grid-cols-2">
              <FormField label="Idea Name" required error={errors.name}>
                <Input name="name" defaultValue={item.name} error={!!errors.name} />
              </FormField>
              <FormField label="Stage">
                <Select name="stage" defaultValue={currentStage}>
                  {STAGES.map((s) => (
                    <option key={s} value={s}>
                      {s}
                    </option>
                  ))}
                </Select>
              </FormField>
            </div>

            <FormField label="Problem Statement">
              <textarea
                name="problem_statement"
                rows={3}
                defaultValue={item.problem_statement ?? ""}
                className="w-full rounded-lg border border-surface-2/50 bg-surface-1 px-3 py-2 text-sm text-zinc-200 placeholder-zinc-600 focus:outline-none focus:ring-1 focus:ring-brand"
              />
            </FormField>

            <FormField label="Target Market">
              <Input name="target_market" defaultValue={item.target_market ?? ""} />
            </FormField>

            {/* Scoring section */}
            <div className="space-y-4 rounded-lg border border-surface-2/30 bg-surface-1/30 p-4">
              <p className="text-xs font-semibold uppercase tracking-wide text-zinc-500">
                Scoring Criteria
              </p>
              {SCORES.map((s) => {
                const val = (item[s.field as keyof typeof item] as number) ?? 0;
                return (
                  <div key={s.field} className="space-y-1">
                    <div className="flex items-center justify-between">
                      <label className="text-xs font-medium text-zinc-400">
                        {s.label}{" "}
                        <span className="text-zinc-600">(0–{s.max})</span>
                        <span className="ml-1 text-zinc-600">— {s.hint}</span>
                      </label>
                      <input
                        type="number"
                        name={s.field}
                        defaultValue={val}
                        min={0}
                        max={s.max}
                        className="w-14 rounded border border-surface-2/50 bg-surface-1 px-2 py-0.5 text-right font-mono text-sm text-zinc-200 focus:outline-none focus:ring-1 focus:ring-brand"
                      />
                    </div>
                    <ScoreBar value={val} max={s.max} />
                  </div>
                );
              })}
            </div>

            <FormField label="Notes">
              <textarea
                name="notes"
                rows={3}
                defaultValue={item.notes ?? ""}
                className="w-full rounded-lg border border-surface-2/50 bg-surface-1 px-3 py-2 text-sm text-zinc-200 placeholder-zinc-600 focus:outline-none focus:ring-1 focus:ring-brand"
              />
            </FormField>

            <div className="flex items-center gap-3 pt-2">
              <Button type="submit">Save Changes</Button>
              <Link to="/dashboard/pipeline">
                <Button type="button" variant="secondary">
                  Back
                </Button>
              </Link>
            </div>
          </Form>
        </div>
      </main>
    </div>
  );
}
