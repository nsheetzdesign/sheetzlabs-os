import { BarChart3 } from "lucide-react";
import { Header } from "~/components/dashboard/Header";

export default function AgentsPerformance() {
  return (
    <div className="flex flex-1 flex-col">
      <Header title="Agent Performance" />
      <main className="flex-1 p-6">
        <div className="flex flex-col items-center gap-3 rounded-xl border border-surface-2/50 bg-surface-1/40 py-24">
          <BarChart3 className="h-10 w-10 text-zinc-700" />
          <p className="text-sm text-zinc-500">Performance metrics coming soon</p>
          <p className="text-xs text-zinc-700">
            Track agent success rates, latency, and token usage over time.
          </p>
        </div>
      </main>
    </div>
  );
}
