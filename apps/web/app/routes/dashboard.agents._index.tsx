import type { LoaderFunctionArgs } from "react-router";
import { useLoaderData, Link } from "react-router";
import {
  Bot,
  ChevronRight,
  Briefcase,
  Megaphone,
  Package,
  DollarSign,
  Search,
  Settings,
} from "lucide-react";
import { Header } from "~/components/dashboard/Header";
import { getSupabaseClient } from "~/lib/supabase.server";

const DEPT_META: Record<
  string,
  {
    label: string;
    Icon: React.ComponentType<{ className?: string }>;
    color: string;
    bg: string;
    border: string;
  }
> = {
  executive: {
    label: "Executive",
    Icon: Briefcase,
    color: "text-violet-400",
    bg: "bg-violet-500/10",
    border: "border-violet-500/20",
  },
  marketing: {
    label: "Marketing",
    Icon: Megaphone,
    color: "text-pink-400",
    bg: "bg-pink-500/10",
    border: "border-pink-500/20",
  },
  product: {
    label: "Product",
    Icon: Package,
    color: "text-blue-400",
    bg: "bg-blue-500/10",
    border: "border-blue-500/20",
  },
  finance: {
    label: "Finance",
    Icon: DollarSign,
    color: "text-green-400",
    bg: "bg-green-500/10",
    border: "border-green-500/20",
  },
  research: {
    label: "Research",
    Icon: Search,
    color: "text-amber-400",
    bg: "bg-amber-500/10",
    border: "border-amber-500/20",
  },
  operations: {
    label: "Operations",
    Icon: Settings,
    color: "text-zinc-400",
    bg: "bg-zinc-500/10",
    border: "border-zinc-500/20",
  },
};

const STATUS_DOT: Record<string, string> = {
  completed: "bg-green-400",
  running: "bg-amber-400 animate-pulse",
  failed: "bg-red-400",
};

function formatRelativeTime(str: string | null) {
  if (!str) return null;
  const diff = Date.now() - new Date(str).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 60) return `${mins}m ago`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `${hrs}h ago`;
  return `${Math.floor(hrs / 24)}d ago`;
}

export async function loader({ context }: LoaderFunctionArgs) {
  const supabase = getSupabaseClient(context.cloudflare.env);

  const [{ data: agentsData }, { data: runsData }] = await Promise.all([
    supabase.from("agents").select("id, department, name, slug, enabled"),
    supabase
      .from("agent_runs")
      .select("agent_id, status, created_at")
      .not("agent_id", "is", null)
      .order("created_at", { ascending: false })
      .limit(200),
  ]);

  const departments = [
    "executive",
    "marketing",
    "product",
    "finance",
    "research",
    "operations",
  ] as const;

  const deptSummary = departments.map((dept) => {
    const deptAgents = (agentsData ?? []).filter((a) => a.department === dept);
    const deptIds = new Set(deptAgents.map((a) => a.id));
    const deptRuns = (runsData ?? []).filter((r) =>
      r.agent_id ? deptIds.has(r.agent_id) : false
    );

    return {
      dept,
      agents: deptAgents,
      agent_count: deptAgents.length,
      enabled_count: deptAgents.filter((a) => a.enabled).length,
      last_run: deptRuns[0]?.created_at ?? null,
      recent_status: deptRuns[0]?.status ?? null,
    };
  });

  const totalAgents = (agentsData ?? []).length;
  const totalEnabled = (agentsData ?? []).filter((a) => a.enabled).length;

  return { deptSummary, totalAgents, totalEnabled };
}

export default function AgentsDepartmentDashboard() {
  const { deptSummary, totalAgents, totalEnabled } =
    useLoaderData<typeof loader>();

  return (
    <div className="flex flex-1 flex-col">
      <Header title="AI Agents" />
      <main className="flex-1 p-6">
        {/* Stats bar */}
        <div className="mb-6 flex flex-wrap items-center gap-6">
          <div>
            <p className="text-xs font-medium uppercase tracking-wide text-zinc-600">
              Total Agents
            </p>
            <p className="mt-0.5 font-mono text-2xl font-semibold text-zinc-200">
              {totalAgents}
            </p>
          </div>
          <div>
            <p className="text-xs font-medium uppercase tracking-wide text-zinc-600">
              Enabled
            </p>
            <p className="mt-0.5 font-mono text-2xl font-semibold text-green-400">
              {totalEnabled}
            </p>
          </div>
          <Link
            to="/dashboard/agents/runs"
            className="ml-auto text-xs text-zinc-500 hover:text-zinc-300 transition-colors"
          >
            View all runs →
          </Link>
          <Link
            to="/dashboard/agents/content"
            className="text-xs text-zinc-500 hover:text-zinc-300 transition-colors"
          >
            Content queue →
          </Link>
        </div>

        {/* Department grid */}
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {deptSummary.map(
            ({ dept, agents, agent_count, enabled_count, last_run, recent_status }) => {
              const meta = DEPT_META[dept];
              const Icon = meta.Icon;
              const dot = recent_status ? STATUS_DOT[recent_status] : null;

              return (
                <div
                  key={dept}
                  className={`rounded-xl border ${meta.border} ${meta.bg} p-5 backdrop-blur-sm`}
                >
                  {/* Header */}
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-2">
                      <Icon className={`h-5 w-5 ${meta.color}`} />
                      <span className={`font-semibold ${meta.color}`}>
                        {meta.label}
                      </span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      {dot && (
                        <span className={`h-2 w-2 rounded-full ${dot}`} />
                      )}
                      <span className="text-xs text-zinc-600">
                        {last_run ? formatRelativeTime(last_run) : "never run"}
                      </span>
                    </div>
                  </div>

                  {/* Counts */}
                  <div className="mb-4 flex items-center gap-4 text-sm text-zinc-400">
                    <span>
                      <span className="font-mono font-semibold text-zinc-200">
                        {agent_count}
                      </span>{" "}
                      agent{agent_count !== 1 ? "s" : ""}
                    </span>
                    <span>
                      <span className="font-mono font-semibold text-green-400">
                        {enabled_count}
                      </span>{" "}
                      active
                    </span>
                  </div>

                  {/* Agent list */}
                  {agents.length === 0 ? (
                    <p className="text-xs italic text-zinc-600">No agents yet</p>
                  ) : (
                    <div className="space-y-1">
                      {agents.map((agent) => (
                        <Link
                          key={agent.id}
                          to={`/dashboard/agents/${agent.slug}`}
                          className="flex items-center justify-between rounded-lg px-3 py-2 text-sm transition-colors hover:bg-black/20"
                        >
                          <div className="flex items-center gap-2 min-w-0">
                            <span
                              className={`h-1.5 w-1.5 shrink-0 rounded-full ${agent.enabled ? "bg-green-400" : "bg-zinc-600"}`}
                            />
                            <span className="truncate text-zinc-300">
                              {agent.name}
                            </span>
                          </div>
                          <ChevronRight className="h-3.5 w-3.5 shrink-0 text-zinc-600" />
                        </Link>
                      ))}
                    </div>
                  )}
                </div>
              );
            }
          )}
        </div>

        {/* Empty state */}
        {totalAgents === 0 && (
          <div className="mt-8 flex flex-col items-center gap-3 rounded-xl border border-surface-2/50 bg-surface-1/40 py-16">
            <Bot className="h-10 w-10 text-zinc-700" />
            <p className="text-sm text-zinc-500">No agents configured yet.</p>
            <p className="text-xs text-zinc-600">
              Agents are defined in the database via the agents table.
            </p>
          </div>
        )}
      </main>
    </div>
  );
}
