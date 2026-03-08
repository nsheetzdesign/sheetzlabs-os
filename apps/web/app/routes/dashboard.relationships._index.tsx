import type { LoaderFunctionArgs } from "react-router";
import { useLoaderData, Form, Link } from "react-router";
import { Plus, Users, ChevronRight } from "lucide-react";
import { Header } from "~/components/dashboard/Header";
import { getSupabaseClient } from "~/lib/supabase.server";
import { Button } from "~/components/ui/Button";
import { EmptyState } from "~/components/ui/EmptyState";

const REL_TYPE_COLORS: Record<string, string> = {
  client: "text-green-400 bg-green-500/10 border-green-500/20",
  partner: "text-blue-400 bg-blue-500/10 border-blue-500/20",
  investor: "text-violet-400 bg-violet-500/10 border-violet-500/20",
  advisor: "text-amber-400 bg-amber-500/10 border-amber-500/20",
  vendor: "text-zinc-400 bg-zinc-500/10 border-zinc-500/20",
  prospect: "text-cyan-400 bg-cyan-500/10 border-cyan-500/20",
  friend: "text-pink-400 bg-pink-500/10 border-pink-500/20",
};

const TYPES = ["client", "partner", "investor", "advisor", "vendor", "prospect", "friend"];

function decayClass(lastContact: string | null): string {
  if (!lastContact) return "";
  const days = (Date.now() - new Date(lastContact).getTime()) / 86400000;
  if (days > 60) return "border-red-500/30 bg-red-500/5";
  if (days > 30) return "border-amber-500/30 bg-amber-500/5";
  return "";
}

function decayBadge(lastContact: string | null) {
  if (!lastContact) return null;
  const days = Math.floor((Date.now() - new Date(lastContact).getTime()) / 86400000);
  if (days > 60)
    return (
      <span className="rounded border border-red-500/30 bg-red-500/10 px-1.5 py-0.5 text-xs text-red-400">
        {days}d ago
      </span>
    );
  if (days > 30)
    return (
      <span className="rounded border border-amber-500/30 bg-amber-500/10 px-1.5 py-0.5 text-xs text-amber-400">
        {days}d ago
      </span>
    );
  return (
    <span className="text-xs text-zinc-600">
      {days}d ago
    </span>
  );
}

function StrengthBar({ value }: { value: number | null }) {
  const v = value ?? 0;
  const color = v >= 70 ? "bg-green-500" : v >= 40 ? "bg-amber-500" : "bg-red-500";
  return (
    <div className="h-1.5 w-16 rounded-full bg-surface-2/50">
      <div className={`h-1.5 rounded-full transition-all ${color}`} style={{ width: `${v}%` }} />
    </div>
  );
}

export async function loader({ request, context }: LoaderFunctionArgs) {
  const supabase = getSupabaseClient(context.cloudflare.env);
  const url = new URL(request.url);
  const typeFilter = url.searchParams.get("type") || "";

  let query = supabase
    .from("relationships")
    .select("*")
    .order("last_contact", { ascending: true, nullsFirst: true });

  if (typeFilter) query = query.eq("type", typeFilter as never);

  const { data } = await query;

  return { relationships: data ?? [], filters: { type: typeFilter } };
}

export default function RelationshipsIndex() {
  const { relationships, filters } = useLoaderData<typeof loader>();

  return (
    <div className="flex flex-1 flex-col">
      <Header title="Relationships" />
      <main className="flex-1 p-6">
        {/* Filters */}
        <Form method="get" className="mb-4 flex flex-wrap items-center gap-2">
          <select
            name="type"
            defaultValue={filters.type}
            className="rounded-lg border border-surface-2/50 bg-surface-1 px-3 py-1.5 text-sm text-zinc-300 focus:outline-none focus:ring-1 focus:ring-brand"
          >
            <option value="">All types</option>
            {TYPES.map((t) => (
              <option key={t} value={t}>
                {t}
              </option>
            ))}
          </select>
          <Button type="submit" variant="secondary">
            Filter
          </Button>
          {filters.type && (
            <Link to="/dashboard/relationships">
              <Button type="button" variant="secondary">
                Clear
              </Button>
            </Link>
          )}
          <div className="ml-auto flex items-center gap-3">
            <p className="text-xs text-zinc-600">
              {relationships.length} contact{relationships.length !== 1 ? "s" : ""}
            </p>
            <Link
              to="new"
              className="inline-flex items-center gap-2 rounded-lg bg-brand px-3 py-1.5 text-sm font-medium text-white transition-colors hover:bg-brand-dark"
            >
              <Plus className="h-4 w-4" />
              New Contact
            </Link>
          </div>
        </Form>

        {/* List */}
        <div className="rounded-xl border border-surface-2/50 bg-surface-1/40 backdrop-blur-sm">
          <div
            className="grid border-b border-surface-2/50 px-4 py-2 text-xs font-medium uppercase tracking-wide text-zinc-600"
            style={{ gridTemplateColumns: "1fr auto" }}
          >
            <span>Contact</span>
            <div className="flex items-center gap-4">
              <span>Strength</span>
              <span className="hidden sm:block">Last Contact</span>
              <span className="w-4" />
            </div>
          </div>

          {relationships.length === 0 ? (
            <EmptyState
              icon={Users}
              title="No contacts"
              description={
                filters.type
                  ? `No ${filters.type} contacts found.`
                  : "Add your first contact to start tracking relationships."
              }
              action={
                <Link
                  to="new"
                  className="inline-flex items-center gap-2 rounded-lg bg-brand px-4 py-2 text-sm font-medium text-white hover:bg-brand-dark"
                >
                  <Plus className="h-4 w-4" />
                  New Contact
                </Link>
              }
            />
          ) : (
            <div className="divide-y divide-surface-2/30 py-1">
              {relationships.map((rel) => (
                <Link
                  key={rel.id}
                  to={rel.id}
                  className={`flex items-center gap-4 rounded-lg border border-transparent px-4 py-3 transition-colors hover:bg-surface-2/30 ${decayClass(rel.last_contact)}`}
                >
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-medium text-zinc-200">{rel.name}</span>
                      {rel.type && (
                        <span
                          className={`rounded border px-1.5 py-0.5 text-xs font-medium ${REL_TYPE_COLORS[rel.type] ?? "text-zinc-400 bg-zinc-500/10 border-zinc-500/20"}`}
                        >
                          {rel.type}
                        </span>
                      )}
                    </div>
                    {(rel.company || rel.role) && (
                      <p className="mt-0.5 text-xs text-zinc-600">
                        {[rel.role, rel.company].filter(Boolean).join(" · ")}
                      </p>
                    )}
                  </div>
                  <div className="flex shrink-0 items-center gap-4">
                    <StrengthBar value={rel.strength} />
                    <span className="hidden sm:block">
                      {decayBadge(rel.last_contact)}
                    </span>
                    <ChevronRight className="h-4 w-4 text-zinc-700" />
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>

        {/* Legend */}
        <div className="mt-2 flex items-center gap-4 text-xs text-zinc-700">
          <span className="flex items-center gap-1">
            <span className="inline-block h-2 w-2 rounded-full bg-amber-500/60" />
            &gt;30 days since contact
          </span>
          <span className="flex items-center gap-1">
            <span className="inline-block h-2 w-2 rounded-full bg-red-500/60" />
            &gt;60 days since contact
          </span>
        </div>
      </main>
    </div>
  );
}
