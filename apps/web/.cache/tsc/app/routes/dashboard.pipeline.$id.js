import { jsxs as _jsxs, jsx as _jsx } from "react/jsx-runtime";
import { useLoaderData, useActionData, Form, Link, redirect, data, } from "react-router";
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
];
const NEXT_STAGE = {
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
];
export async function loader({ params, context }) {
    const supabase = getSupabaseClient(context.cloudflare.env);
    const [itemRes, venturesRes] = await Promise.all([
        supabase.from("pipeline").select("*").eq("id", params.id).single(),
        supabase.from("ventures").select("id, name, slug").order("name"),
    ]);
    if (!itemRes.data)
        throw new Response("Not found", { status: 404 });
    const item = itemRes.data;
    // Load scaffold template when item is in 'building' stage
    let scaffoldPrompt = null;
    if (item.stage === "building" || item.stage === "speccing") {
        const { data: template } = await supabase
            .from("stack_templates")
            .select("*")
            .eq("venture_type", "saas")
            .single();
        if (template) {
            const skills = template.skills ?? [];
            const hooks = template.hooks ?? [];
            const stackItems = template.stack_items ?? [];
            const claudeMd = (template.claude_md_template ?? "")
                .replace(/\{\{VENTURE_NAME\}\}/g, item.name)
                .replace(/\{\{TAGLINE\}\}/g, item.problem_statement ?? item.name);
            const allSecrets = stackItems.flatMap((s) => s.secrets_required ?? []);
            const envExample = allSecrets.map((s) => `${s}=`).join("\n");
            const skillsBlock = skills
                .map((s) => `# .claude/skills/${s.name}.md\n${s.content}`)
                .join("\n\n---\n\n");
            const hooksBlock = hooks
                .map((h) => `${h.name}: "${h.trigger}"`)
                .join("\n");
            scaffoldPrompt = `# Claude Code Scaffold: ${item.name}

You are initializing a new SaaS project. Follow these instructions exactly.

## Project Overview
Name: ${item.name}
Problem: ${item.problem_statement ?? "TBD"}
Target Market: ${item.target_market ?? "TBD"}

## Repository Structure
Create a pnpm monorepo with:
\`\`\`
${item.name.toLowerCase().replace(/\s+/g, "-")}/
├── apps/
│   ├── web/          # React Router v7 on Cloudflare Workers
│   └── api/          # Hono API on Cloudflare Workers
├── packages/
│   └── shared/       # Shared types, utils
├── supabase/
│   └── migrations/
├── package.json       # pnpm workspaces
├── pnpm-workspace.yaml
├── turbo.json
└── CLAUDE.md
\`\`\`

## Stack
${stackItems.map((s) => `- **${s.category}**: ${s.tool_name}`).join("\n")}

## Environment Variables (.env.local)
\`\`\`env
${envExample}
\`\`\`

## CLAUDE.md
Create this file at the repo root:

\`\`\`markdown
${claudeMd}
\`\`\`

## Claude Skills
Create these files in .claude/skills/:

${skillsBlock}

## Claude Hooks (.claude/settings.json hooks)
\`\`\`json
{
  "hooks": {
${hooks.map((h) => `    "${h.name}": "${h.trigger}"`).join(",\n")}
  }
}
\`\`\`

## wrangler.toml (apps/web)
\`\`\`toml
name = "${item.name.toLowerCase().replace(/\s+/g, "-")}-web"
compatibility_date = "2025-01-01"
main = "workers/app.ts"

[vars]
ENVIRONMENT = "production"
\`\`\`

## wrangler.toml (apps/api)
\`\`\`toml
name = "${item.name.toLowerCase().replace(/\s+/g, "-")}-api"
compatibility_date = "2025-01-01"
main = "src/index.ts"

[vars]
ENVIRONMENT = "production"
\`\`\`

## Initial Commands
\`\`\`bash
mkdir ${item.name.toLowerCase().replace(/\s+/g, "-")} && cd $_
pnpm init
# ... follow the BOHP monorepo pattern
npx supabase init
npx supabase link --project-ref YOUR_PROJECT_REF
\`\`\`

Begin by creating the full monorepo structure described above.`;
        }
    }
    return {
        item,
        ventures: venturesRes.data ?? [],
        scaffoldPrompt,
    };
}
export async function action({ request, params, context }) {
    const supabase = getSupabaseClient(context.cloudflare.env);
    const fd = await request.formData();
    const intent = fd.get("intent");
    // Advance stage
    if (intent === "advance") {
        const current = fd.get("current_stage");
        const next = NEXT_STAGE[current];
        if (next) {
            await supabase.from("pipeline").update({ stage: next }).eq("id", params.id);
        }
        return redirect(`/dashboard/pipeline/${params.id}`);
    }
    // Park
    if (intent === "park") {
        await supabase
            .from("pipeline")
            .update({ stage: "parked" })
            .eq("id", params.id);
        return redirect("/dashboard/pipeline");
    }
    // Promote to venture
    if (intent === "promote") {
        const name = fd.get("venture_name");
        const rawSlug = fd.get("venture_slug")?.trim();
        const slug = rawSlug || name.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
        const { data: newVenture, error: vErr } = await supabase
            .from("ventures")
            .insert({ name, slug, status: "idea", stage: "pre-revenue" })
            .select("slug")
            .single();
        if (vErr)
            return data({ errors: { _form: vErr.message } }, { status: 500 });
        await supabase
            .from("pipeline")
            .update({ venture_id: newVenture.slug ? undefined : undefined, stage: "launched" })
            .eq("id", params.id);
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
                .eq("id", params.id);
        }
        return redirect(`/dashboard/ventures/${newVenture.slug}`);
    }
    // Default: update
    const name = fd.get("name")?.trim();
    const problem_statement = fd.get("problem_statement")?.trim() || null;
    const target_market = fd.get("target_market")?.trim() || null;
    const stage = fd.get("stage");
    const notes = fd.get("notes")?.trim() || null;
    const scoreFields = {};
    for (const s of SCORES) {
        scoreFields[s.field] = Math.min(s.max, Math.max(0, parseInt(fd.get(s.field) || "0", 10)));
    }
    const errors = {};
    if (!name)
        errors.name = "Required";
    if (Object.keys(errors).length)
        return data({ errors }, { status: 400 });
    const { error } = await supabase
        .from("pipeline")
        .update({
        name,
        problem_statement,
        target_market,
        stage: stage,
        notes,
        ...scoreFields,
    })
        .eq("id", params.id);
    if (error)
        return data({ errors: { _form: error.message } }, { status: 500 });
    return redirect(`/dashboard/pipeline/${params.id}`);
}
function ScoreBadge({ score }) {
    const s = score ?? 0;
    const cls = s >= 70
        ? "text-green-400 bg-green-500/10 border-green-500/30"
        : s >= 50
            ? "text-amber-400 bg-amber-500/10 border-amber-500/30"
            : "text-red-400 bg-red-500/10 border-red-500/30";
    return (_jsxs("span", { className: `rounded border px-3 py-1 font-mono text-xl font-bold ${cls}`, children: [s, " / 100"] }));
}
function ScoreBar({ value, max }) {
    const pct = Math.round((value / max) * 100);
    return (_jsx("div", { className: "h-1.5 w-full rounded-full bg-surface-2/50", children: _jsx("div", { className: "h-1.5 rounded-full bg-brand transition-all", style: { width: `${pct}%` } }) }));
}
export default function EditPipeline() {
    const { item, ventures, scaffoldPrompt } = useLoaderData();
    const actionData = useActionData();
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
    return (_jsxs("div", { className: "flex flex-1 flex-col", children: [_jsx(Header, { title: item.name }), _jsx("main", { className: "flex-1 p-6", children: _jsxs("div", { className: "mx-auto max-w-2xl space-y-4", children: [errors._form && (_jsx("div", { className: "rounded-lg border border-red-500/20 bg-red-500/10 px-4 py-3 text-sm text-red-400", children: errors._form })), _jsxs("div", { className: "flex items-center justify-between rounded-xl border border-surface-2/50 bg-surface-1/40 px-5 py-4 backdrop-blur-sm", children: [_jsxs("div", { children: [_jsx("p", { className: "text-xs font-medium uppercase tracking-wide text-zinc-600", children: "Total Score" }), _jsx("div", { className: "mt-1", children: _jsx(ScoreBadge, { score: item.total_score }) })] }), _jsxs("div", { className: "text-right", children: [_jsx("p", { className: "text-xs font-medium uppercase tracking-wide text-zinc-600", children: "Stage" }), _jsx("p", { className: "mt-1 text-sm font-semibold capitalize text-zinc-300", children: currentStage })] })] }), _jsxs("div", { className: "flex flex-wrap gap-2", children: [nextStage && !isParked && (_jsxs(Form, { method: "post", children: [_jsx("input", { type: "hidden", name: "intent", value: "advance" }), _jsx("input", { type: "hidden", name: "current_stage", value: currentStage }), _jsxs(Button, { type: "submit", children: ["Advance \u2192 ", nextStage] })] })), isLaunched && !item.venture_id && (_jsxs(Form, { method: "post", className: "flex items-center gap-2", children: [_jsx("input", { type: "hidden", name: "intent", value: "promote" }), _jsx("input", { type: "text", name: "venture_name", defaultValue: item.name, placeholder: "Venture name", className: "rounded-lg border border-surface-2/50 bg-surface-1 px-3 py-1.5 text-sm text-zinc-200 focus:outline-none focus:ring-1 focus:ring-brand" }), _jsx("input", { type: "text", name: "venture_slug", placeholder: "slug (optional)", className: "w-28 rounded-lg border border-surface-2/50 bg-surface-1 px-3 py-1.5 text-sm text-zinc-200 focus:outline-none focus:ring-1 focus:ring-brand" }), _jsx(Button, { type: "submit", variant: "secondary", children: "\uD83D\uDE80 Promote to Venture" })] })), item.venture_id && (_jsx(Link, { to: `/dashboard/ventures/${ventures.find((v) => v.id === item.venture_id)?.slug ?? ""}`, children: _jsx(Button, { type: "button", variant: "secondary", children: "View Venture \u2192" }) })), !isParked && (_jsxs(Form, { method: "post", onSubmit: (e) => {
                                        if (!confirm("Park this idea?"))
                                            e.preventDefault();
                                    }, children: [_jsx("input", { type: "hidden", name: "intent", value: "park" }), _jsx(Button, { type: "submit", variant: "danger", children: "\uD83D\uDCE6 Park" })] }))] }), _jsxs(Form, { method: "post", className: "space-y-5 rounded-xl border border-surface-2/50 bg-surface-1/40 p-6 backdrop-blur-sm", children: [_jsxs("div", { className: "grid gap-5 sm:grid-cols-2", children: [_jsx(FormField, { label: "Idea Name", required: true, error: errors.name, children: _jsx(Input, { name: "name", defaultValue: item.name, error: !!errors.name }) }), _jsx(FormField, { label: "Stage", children: _jsx(Select, { name: "stage", defaultValue: currentStage, children: STAGES.map((s) => (_jsx("option", { value: s, children: s }, s))) }) })] }), _jsx(FormField, { label: "Problem Statement", children: _jsx("textarea", { name: "problem_statement", rows: 3, defaultValue: item.problem_statement ?? "", className: "w-full rounded-lg border border-surface-2/50 bg-surface-1 px-3 py-2 text-sm text-zinc-200 placeholder-zinc-600 focus:outline-none focus:ring-1 focus:ring-brand" }) }), _jsx(FormField, { label: "Target Market", children: _jsx(Input, { name: "target_market", defaultValue: item.target_market ?? "" }) }), _jsxs("div", { className: "space-y-4 rounded-lg border border-surface-2/30 bg-surface-1/30 p-4", children: [_jsx("p", { className: "text-xs font-semibold uppercase tracking-wide text-zinc-500", children: "Scoring Criteria" }), SCORES.map((s) => {
                                            const val = item[s.field] ?? 0;
                                            return (_jsxs("div", { className: "space-y-1", children: [_jsxs("div", { className: "flex items-center justify-between", children: [_jsxs("label", { className: "text-xs font-medium text-zinc-400", children: [s.label, " ", _jsxs("span", { className: "text-zinc-600", children: ["(0\u2013", s.max, ")"] }), _jsxs("span", { className: "ml-1 text-zinc-600", children: ["\u2014 ", s.hint] })] }), _jsx("input", { type: "number", name: s.field, defaultValue: val, min: 0, max: s.max, className: "w-14 rounded border border-surface-2/50 bg-surface-1 px-2 py-0.5 text-right font-mono text-sm text-zinc-200 focus:outline-none focus:ring-1 focus:ring-brand" })] }), _jsx(ScoreBar, { value: val, max: s.max })] }, s.field));
                                        })] }), _jsx(FormField, { label: "Notes", children: _jsx("textarea", { name: "notes", rows: 3, defaultValue: item.notes ?? "", className: "w-full rounded-lg border border-surface-2/50 bg-surface-1 px-3 py-2 text-sm text-zinc-200 placeholder-zinc-600 focus:outline-none focus:ring-1 focus:ring-brand" }) }), _jsxs("div", { className: "flex items-center gap-3 pt-2", children: [_jsx(Button, { type: "submit", children: "Save Changes" }), _jsx(Link, { to: "/dashboard/pipeline", children: _jsx(Button, { type: "button", variant: "secondary", children: "Back" }) })] })] }), scaffoldPrompt && (_jsx(ScaffoldSection, { prompt: scaffoldPrompt, projectName: item.name }))] }) })] }));
}
function ScaffoldSection({ prompt, projectName }) {
    return (_jsxs("div", { className: "rounded-xl border border-brand/20 bg-brand/5 p-5", children: [_jsxs("div", { className: "mb-4 flex items-center justify-between", children: [_jsxs("div", { children: [_jsx("h2", { className: "text-sm font-semibold text-brand", children: "\uD83D\uDE80 Claude Code Scaffold" }), _jsxs("p", { className: "text-xs text-zinc-500 mt-0.5", children: ["Copy this prompt into Claude Code to scaffold ", projectName, "."] })] }), _jsx("button", { type: "button", onClick: () => navigator.clipboard.writeText(prompt), className: "rounded-lg border border-brand/30 bg-brand/10 px-3 py-1.5 text-xs font-medium text-brand transition-colors hover:bg-brand/20", children: "Copy Prompt" })] }), _jsx("pre", { className: "max-h-96 overflow-y-auto rounded-lg bg-surface-0 p-4 font-mono text-xs text-zinc-400 whitespace-pre-wrap", children: prompt })] }));
}
