import type { LoaderFunctionArgs } from "react-router";
import { useLoaderData, Link } from "react-router";
import { Plus, Box, ChevronRight } from "lucide-react";
import { Header } from "~/components/dashboard/Header";
import { getSupabaseClient } from "~/lib/supabase.server";
import { Badge } from "~/components/ui/Badge";
import { EmptyState } from "~/components/ui/EmptyState";
import type { Venture } from "@sheetzlabs/shared";

export async function loader({ context }: LoaderFunctionArgs) {
  const supabase = getSupabaseClient(context.cloudflare.env);
  const { data } = await supabase
    .from("ventures")
    .select("*")
    .order("created_at");
  return { ventures: data ?? [] };
}

function formatMrr(cents: number | null) {
  if (!cents) return "—";
  return `$${(cents / 100).toLocaleString()}`;
}

function VentureRow({
  venture,
  indent = false,
}: {
  venture: Venture;
  indent?: boolean;
}) {
  return (
    <Link
      to={venture.slug}
      className={`flex items-center gap-4 rounded-lg px-4 py-3 transition-colors hover:bg-surface-2/30 ${indent ? "ml-8 border-l border-surface-2/50 pl-6" : ""}`}
    >
      <div className="min-w-0 flex-1">
        <div className="flex items-center gap-2">
          <span className="text-sm font-medium text-zinc-200">
            {venture.name}
          </span>
          {venture.domain && (
            <span className="font-mono text-xs text-zinc-600">
              {venture.domain}
            </span>
          )}
        </div>
        {venture.tagline && (
          <p className="mt-0.5 text-xs text-zinc-500">{venture.tagline}</p>
        )}
      </div>

      <div className="flex items-center gap-3">
        <Badge value={venture.status ?? "idea"} variant="venture-status" />
        <span className="hidden font-mono text-xs text-zinc-600 sm:block">
          {venture.stage ?? "pre-revenue"}
        </span>
        <span className="w-16 text-right font-mono text-sm text-zinc-400">
          {formatMrr(venture.mrr_cents)}
        </span>
        <ChevronRight className="h-4 w-4 shrink-0 text-zinc-700" />
      </div>
    </Link>
  );
}

export default function VenturesIndex() {
  const { ventures } = useLoaderData<typeof loader>();

  const roots = ventures.filter((v) => !v.parent_venture_id);
  const byParent: Record<string, Venture[]> = {};
  ventures
    .filter((v) => v.parent_venture_id)
    .forEach((v) => {
      const pid = v.parent_venture_id!;
      (byParent[pid] ??= []).push(v);
    });

  return (
    <div className="flex flex-1 flex-col">
      <Header title="Ventures" />
      <main className="flex-1 p-6">
        <div className="mb-4 flex items-center justify-between">
          <p className="text-sm text-zinc-500">
            {ventures.length} venture{ventures.length !== 1 ? "s" : ""}
          </p>
          <Link
            to="new"
            className="inline-flex items-center gap-2 rounded-lg bg-brand px-3 py-1.5 text-sm font-medium text-white transition-colors hover:bg-brand-dark"
          >
            <Plus className="h-4 w-4" />
            New Venture
          </Link>
        </div>

        <div className="rounded-xl border border-surface-2/50 bg-surface-1/40 backdrop-blur-sm">
          {/* Header row */}
          <div className="grid border-b border-surface-2/50 px-4 py-2 text-xs font-medium uppercase tracking-wide text-zinc-600"
            style={{ gridTemplateColumns: "1fr auto" }}>
            <span>Venture</span>
            <div className="flex items-center gap-3">
              <span>Status</span>
              <span className="hidden sm:block">Stage</span>
              <span className="w-16 text-right">MRR</span>
              <span className="w-4" />
            </div>
          </div>

          {ventures.length === 0 ? (
            <EmptyState
              icon={Box}
              title="No ventures yet"
              description="Add your first venture to start tracking."
              action={
                <Link
                  to="new"
                  className="inline-flex items-center gap-2 rounded-lg bg-brand px-4 py-2 text-sm font-medium text-white hover:bg-brand-dark"
                >
                  <Plus className="h-4 w-4" />
                  New Venture
                </Link>
              }
            />
          ) : (
            <div className="divide-y divide-surface-2/30 py-1">
              {roots.map((v) => (
                <div key={v.id}>
                  <VentureRow venture={v} />
                  {(byParent[v.id] ?? []).map((child) => (
                    <VentureRow key={child.id} venture={child} indent />
                  ))}
                </div>
              ))}
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
