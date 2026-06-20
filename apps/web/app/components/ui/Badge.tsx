const TASK_STATUS: Record<string, string> = {
  backlog: "bg-zinc-800 text-zinc-500",
  todo: "bg-zinc-700 text-zinc-300",
  "in-progress": "bg-blue-500/15 text-blue-400",
  review: "bg-yellow-500/15 text-yellow-400",
  done: "bg-brand/10 text-brand",
  blocked: "bg-red-500/15 text-red-400",
};

const TASK_PRIORITY: Record<string, string> = {
  urgent: "bg-red-500/15 text-red-400",
  high: "bg-orange-500/15 text-orange-400",
  medium: "bg-yellow-500/15 text-yellow-400",
  low: "bg-zinc-800 text-zinc-500",
};

const VENTURE_STATUS: Record<string, string> = {
  active: "bg-brand/10 text-brand",
  building: "bg-zinc-800 text-zinc-400",
  validating: "bg-yellow-500/15 text-yellow-400",
  idea: "bg-zinc-900 text-zinc-600",
  maintenance: "bg-orange-500/15 text-orange-400",
  sunset: "bg-zinc-900 text-zinc-600",
  sold: "bg-purple-500/15 text-purple-400",
};

// GitHub Actions run status/conclusion → semantic tokens (success/caution/warning/
// danger, defined in tailwind.config.ts). Keys are the conclusion when present,
// else the in-flight status (queued/in_progress).
const WORKFLOW_STATUS: Record<string, string> = {
  success: "bg-success/15 text-success",
  completed: "bg-success/15 text-success",
  failure: "bg-danger/15 text-danger",
  timed_out: "bg-danger/15 text-danger",
  startup_failure: "bg-danger/15 text-danger",
  action_required: "bg-warning/15 text-warning",
  in_progress: "bg-caution/15 text-caution",
  queued: "bg-zinc-700 text-zinc-300",
  requested: "bg-zinc-700 text-zinc-300",
  waiting: "bg-zinc-700 text-zinc-300",
  cancelled: "bg-zinc-800 text-zinc-400",
  skipped: "bg-zinc-800 text-zinc-400",
  neutral: "bg-zinc-800 text-zinc-400",
  stale: "bg-zinc-800 text-zinc-400",
};

type BadgeVariant =
  | "task-status"
  | "task-priority"
  | "venture-status"
  | "workflow-status";

const COLOR_MAPS: Record<BadgeVariant, Record<string, string>> = {
  "task-status": TASK_STATUS,
  "task-priority": TASK_PRIORITY,
  "venture-status": VENTURE_STATUS,
  "workflow-status": WORKFLOW_STATUS,
};

export function Badge({
  value,
  variant,
  className = "",
}: {
  value: string;
  variant: BadgeVariant;
  className?: string;
}) {
  const colorClass =
    COLOR_MAPS[variant][value] ?? "bg-zinc-800 text-zinc-400";
  return (
    <span
      className={`inline-flex items-center rounded-full px-2 py-0.5 font-mono text-xs ${colorClass} ${className}`}
    >
      {value}
    </span>
  );
}
