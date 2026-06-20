import type { LoaderFunctionArgs } from "react-router";
import { useLoaderData, useSearchParams, useFetcher } from "react-router";
import { useEffect, useState } from "react";
import { GitBranch, RefreshCw, ExternalLink, GitCommit, X } from "lucide-react";
import { Header } from "~/components/dashboard/Header";
import { Badge } from "~/components/ui/Badge";
import { EmptyState } from "~/components/ui/EmptyState";
import { apiFetch } from "~/lib/api";

interface WorkflowRun {
  id: string;
  run_id: number;
  repo_full_name: string;
  workflow_name: string;
  run_number: number | null;
  event: string | null;
  head_branch: string | null;
  head_sha: string | null;
  status: string;
  conclusion: string | null;
  actor: string | null;
  html_url: string | null;
  run_started_at: string | null;
  run_updated_at: string | null;
}

interface RepoRow {
  full_name: string;
  last_polled_at: string | null;
}

const CONCLUSIONS = ["success", "failure", "cancelled", "timed_out"];

export async function loader({ request, context }: LoaderFunctionArgs) {
  const env = context.cloudflare.env;
  const url = new URL(request.url);
  const repo = url.searchParams.get("repo") ?? "";
  const conclusion = url.searchParams.get("conclusion") ?? "";

  const qs = new URLSearchParams();
  if (repo) qs.set("repo", repo);
  if (conclusion) qs.set("conclusion", conclusion);
  const suffix = qs.toString() ? `?${qs.toString()}` : "";

  let runs: WorkflowRun[] = [];
  let repos: RepoRow[] = [];
  try {
    const res = await apiFetch(request, env, `/github/runs${suffix}`);
    if (res.ok) {
      const body = (await res.json()) as { runs?: WorkflowRun[]; repos?: RepoRow[] };
      runs = body.runs ?? [];
      repos = body.repos ?? [];
    }
  } catch (err) {
    console.error("[repos] runs load failed:", err);
  }

  return { runs, repos, filters: { repo, conclusion } };
}

function relativeTime(str: string | null): string {
  if (!str) return "—";
  const diff = Date.now() - new Date(str).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 1) return "just now";
  if (mins < 60) return `${mins}m ago`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `${hrs}h ago`;
  return `${Math.floor(hrs / 24)}d ago`;
}

/** The badge value: the conclusion once finished, else the in-flight status. */
function runState(run: WorkflowRun): string {
  return run.conclusion ?? run.status;
}

export default function ReposIndex() {
  const { runs, repos, filters } = useLoaderData<typeof loader>();
  const [searchParams, setSearchParams] = useSearchParams();
  const reconcile = useFetcher<{ ok?: boolean; repo?: string; status?: number; ingested?: number; error?: string }>();
  const [selected, setSelected] = useState<WorkflowRun | null>(null);

  // Esc closes the run-detail panel.
  useEffect(() => {
    if (!selected) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setSelected(null);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [selected]);

  const reconciling = reconcile.state !== "idle";

  function setFilter(key: "repo" | "conclusion", value: string) {
    const next = new URLSearchParams(searchParams);
    if (value) next.set(key, value);
    else next.delete(key);
    setSearchParams(next);
  }

  return (
    <div className="flex flex-1 flex-col">
      <Header title="Repos & Actions" />
      <main className="flex-1 p-6">
        {/* Toolbar: filters + reconcile */}
        <div className="mb-5 flex flex-wrap items-center gap-3">
          <select
            aria-label="Filter by repository"
            value={filters.repo}
            onChange={(e) => setFilter("repo", e.target.value)}
            className="rounded-lg border border-surface-2 bg-surface-1/50 px-3 py-1.5 text-sm text-zinc-300"
          >
            <option value="">All repos</option>
            {repos.map((r) => (
              <option key={r.full_name} value={r.full_name}>
                {r.full_name}
              </option>
            ))}
          </select>

          <select
            aria-label="Filter by conclusion"
            value={filters.conclusion}
            onChange={(e) => setFilter("conclusion", e.target.value)}
            className="rounded-lg border border-surface-2 bg-surface-1/50 px-3 py-1.5 text-sm text-zinc-300"
          >
            <option value="">All conclusions</option>
            {CONCLUSIONS.map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </select>

          <reconcile.Form method="post" action="/dashboard/repos/reconcile" className="ml-auto">
            <button
              type="submit"
              disabled={reconciling}
              data-testid="repos-reconcile"
              className="flex items-center gap-2 rounded-lg border border-surface-2 bg-surface-1/50 px-3 py-1.5 text-sm text-zinc-300 transition-colors hover:border-surface-3 hover:text-zinc-100 disabled:opacity-50"
            >
              <RefreshCw className={`h-4 w-4 ${reconciling ? "animate-spin" : ""}`} />
              {reconciling ? "Reconciling…" : "Reconcile now"}
            </button>
          </reconcile.Form>
        </div>

        {reconcile.data && (
          <p className="mb-4 text-xs text-zinc-500">
            {reconcile.data.error
              ? `Reconcile failed: ${reconcile.data.error}`
              : reconcile.data.repo
                ? `Polled ${reconcile.data.repo} — status ${reconcile.data.status}, ${reconcile.data.ingested ?? 0} updated.`
                : "No repos registered yet — they auto-register on the first webhook event."}
          </p>
        )}

        {/* Runs table */}
        {runs.length === 0 ? (
          <EmptyState
            icon={GitBranch}
            title="No workflow runs yet"
            description="Runs appear here once the org webhook delivers a workflow_run event, or after the next poll reconcile."
          />
        ) : (
          <div className="overflow-hidden rounded-xl border border-surface-2/50">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-surface-2/50 text-left text-xs uppercase tracking-wide text-zinc-600">
                  <th className="px-4 py-2.5 font-medium">Status</th>
                  <th className="px-4 py-2.5 font-medium">Workflow</th>
                  <th className="px-4 py-2.5 font-medium">Repo</th>
                  <th className="px-4 py-2.5 font-medium">Branch</th>
                  <th className="px-4 py-2.5 font-medium">Actor</th>
                  <th className="px-4 py-2.5 font-medium">Started</th>
                </tr>
              </thead>
              <tbody>
                {runs.map((run) => (
                  <tr
                    key={run.id}
                    onClick={() => setSelected(run)}
                    data-testid="repos-run-row"
                    className="cursor-pointer border-b border-surface-2/30 transition-colors last:border-0 hover:bg-surface-1/40"
                  >
                    <td className="px-4 py-2.5">
                      <Badge value={runState(run)} variant="workflow-status" />
                    </td>
                    <td className="px-4 py-2.5 text-zinc-300">
                      {run.workflow_name}
                      {run.run_number != null && (
                        <span className="ml-1.5 font-mono text-xs text-zinc-600">#{run.run_number}</span>
                      )}
                    </td>
                    <td className="px-4 py-2.5 font-mono text-xs text-zinc-500">{run.repo_full_name}</td>
                    <td className="px-4 py-2.5 text-zinc-400">{run.head_branch ?? "—"}</td>
                    <td className="px-4 py-2.5 text-zinc-400">{run.actor ?? "—"}</td>
                    <td className="px-4 py-2.5 text-zinc-500">{relativeTime(run.run_started_at)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* Run-detail panel — inline overlay so it shows at every breakpoint (the
            shared Drawer is lg:hidden by design). */}
        {selected && (
          <div className="fixed inset-0 z-40" role="presentation">
            <div
              className="absolute inset-0 bg-black/50"
              onClick={() => setSelected(null)}
              aria-hidden="true"
            />
            <div
              role="dialog"
              aria-modal="true"
              aria-label="Workflow run detail"
              data-testid="repos-run-detail"
              className="absolute right-0 top-0 h-full w-full max-w-md overflow-y-auto border-l border-surface-2/50 bg-surface-0 pt-safe pb-safe pr-safe shadow-2xl"
            >
              <button
                type="button"
                onClick={() => setSelected(null)}
                aria-label="Close"
                className="absolute right-4 top-4 rounded-lg p-1.5 text-zinc-500 transition-colors hover:bg-surface-1/50 hover:text-zinc-300"
              >
                <X className="h-4 w-4" />
              </button>
              <div className="flex h-full flex-col p-6">
              <div className="mb-4 flex items-start justify-between gap-3">
                <div className="min-w-0">
                  <h2 className="truncate text-base font-semibold text-zinc-200">
                    {selected.workflow_name}
                  </h2>
                  <p className="font-mono text-xs text-zinc-500">{selected.repo_full_name}</p>
                </div>
                <Badge value={runState(selected)} variant="workflow-status" />
              </div>

              <dl className="space-y-3 text-sm">
                <Detail label="Run number" value={selected.run_number != null ? `#${selected.run_number}` : "—"} />
                <Detail label="Event" value={selected.event ?? "—"} />
                <Detail label="Branch" value={selected.head_branch ?? "—"} />
                <Detail
                  label="Commit"
                  value={
                    selected.head_sha ? (
                      <span className="flex items-center gap-1.5 font-mono text-xs">
                        <GitCommit className="h-3.5 w-3.5 text-zinc-600" />
                        {selected.head_sha.slice(0, 7)}
                      </span>
                    ) : (
                      "—"
                    )
                  }
                />
                <Detail label="Actor" value={selected.actor ?? "—"} />
                <Detail label="Status" value={selected.status} />
                <Detail label="Conclusion" value={selected.conclusion ?? "—"} />
                <Detail label="Started" value={relativeTime(selected.run_started_at)} />
                <Detail label="Updated" value={relativeTime(selected.run_updated_at)} />
              </dl>

              {selected.html_url && (
                <a
                  href={selected.html_url}
                  target="_blank"
                  rel="noreferrer"
                  className="mt-6 flex items-center justify-center gap-2 rounded-lg border border-surface-2 bg-surface-1/50 px-3 py-2 text-sm text-zinc-300 transition-colors hover:border-surface-3 hover:text-zinc-100"
                >
                  <ExternalLink className="h-4 w-4" />
                  Open on GitHub
                </a>
              )}
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}

function Detail({ label, value }: { label: string; value: React.ReactNode }) {
  return (
    <div className="flex items-center justify-between gap-4 border-b border-surface-2/30 pb-2">
      <dt className="text-xs uppercase tracking-wide text-zinc-600">{label}</dt>
      <dd className="text-right text-zinc-300">{value}</dd>
    </div>
  );
}
