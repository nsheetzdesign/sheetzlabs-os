import type { ActionFunctionArgs, LoaderFunctionArgs } from "react-router";
import { useLoaderData, Form, Link, redirect, data } from "react-router";
import { Plus, Receipt, Paperclip, ExternalLink } from "lucide-react";
import { Header } from "~/components/dashboard/Header";
import { getSupabaseClient } from "~/lib/supabase.server";
import { requireAuth } from "~/lib/auth.server";
import { deleteReceipt } from "~/lib/storage.server";
import { Button } from "~/components/ui/Button";
import { EmptyState } from "~/components/ui/EmptyState";

const CATEGORY_COLORS: Record<string, string> = {
  software: "text-blue-400 bg-blue-500/10 border-blue-500/20",
  hosting: "text-violet-400 bg-violet-500/10 border-violet-500/20",
  ai_usage: "text-cyan-400 bg-cyan-500/10 border-cyan-500/20",
  contractor: "text-amber-400 bg-amber-500/10 border-amber-500/20",
  hardware: "text-orange-400 bg-orange-500/10 border-orange-500/20",
  subscriptions: "text-pink-400 bg-pink-500/10 border-pink-500/20",
  marketing: "text-green-400 bg-green-500/10 border-green-500/20",
  legal: "text-red-400 bg-red-500/10 border-red-500/20",
  other: "text-zinc-400 bg-zinc-500/10 border-zinc-500/20",
};

function categoryColor(cat: string) {
  return CATEGORY_COLORS[cat] ?? "text-zinc-400 bg-zinc-500/10 border-zinc-500/20";
}

function formatDollars(cents: number) {
  return `$${(cents / 100).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
}

function formatDate(str: string | null) {
  if (!str) return "—";
  return new Date(str + "T00:00:00").toLocaleDateString(undefined, {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

export async function loader({ request, context }: LoaderFunctionArgs) {
  const { headers } = await requireAuth(request, context.cloudflare.env);
  const supabase = getSupabaseClient(context.cloudflare.env);
  const url = new URL(request.url);
  const ventureId = url.searchParams.get("venture_id") ?? "";
  const category = url.searchParams.get("category") ?? "";

  let query = supabase
    .from("expenses")
    .select("*, ventures(id, name, slug)")
    .order("expense_date", { ascending: false });

  if (ventureId) query = query.eq("venture_id", ventureId);
  if (category) query = query.eq("category", category as never);

  const [expensesRes, venturesRes, revenueRes] = await Promise.all([
    query,
    supabase.from("ventures").select("id, name, slug").order("name"),
    supabase.from("revenue").select("amount_cents"),
  ]);

  const expenses = expensesRes.data ?? [];
  const totalExpenseCents = expenses.reduce((s, e) => s + (e.amount_cents ?? 0), 0);
  const totalRevenueCents = (revenueRes.data ?? []).reduce(
    (s, r) => s + (r.amount_cents ?? 0),
    0,
  );

  // Category breakdown (all expenses, no filter)
  const allExpensesRes = await supabase.from("expenses").select("category, amount_cents");
  const byCategory: Record<string, number> = {};
  for (const e of allExpensesRes.data ?? []) {
    byCategory[e.category] = (byCategory[e.category] ?? 0) + (e.amount_cents ?? 0);
  }

  return data(
    {
      expenses,
      ventures: venturesRes.data ?? [],
      filters: { ventureId, category },
      stats: { totalExpenseCents, totalRevenueCents },
      byCategory,
    },
    { headers },
  );
}

export async function action({ request, context }: ActionFunctionArgs) {
  await requireAuth(request, context.cloudflare.env);
  const supabase = getSupabaseClient(context.cloudflare.env);
  const fd = await request.formData();
  const intent = fd.get("intent") as string;

  if (intent === "delete") {
    const id = fd.get("id") as string;
    const receiptUrl = fd.get("receipt_url") as string;

    // Delete receipt from storage first
    if (receiptUrl) {
      await deleteReceipt(supabase, receiptUrl).catch(console.error);
    }
    await supabase.from("expenses").delete().eq("id", id);
    return redirect("/dashboard/expenses");
  }

  return null;
}

const CATEGORIES = [
  "software", "hosting", "ai_usage", "contractor", "hardware",
  "office", "marketing", "legal", "banking", "travel", "subscriptions", "other",
] as const;

export default function ExpensesIndex() {
  const { expenses, ventures, filters, stats, byCategory } =
    useLoaderData<typeof loader>();

  const netCents = stats.totalRevenueCents - stats.totalExpenseCents;
  const netPositive = netCents >= 0;

  return (
    <div className="flex flex-1 flex-col">
      <Header title="Expenses" />
      <main className="flex-1 p-6">
        {/* Stats */}
        <div className="mb-6 grid gap-4 sm:grid-cols-3">
          <div className="rounded-xl border border-surface-2/50 bg-surface-1/40 p-4 backdrop-blur-sm">
            <p className="text-xs font-medium uppercase tracking-wide text-zinc-600">Total Expenses</p>
            <p className="mt-1 font-mono text-2xl font-semibold text-red-400">
              {formatDollars(stats.totalExpenseCents)}
            </p>
            <p className="mt-0.5 text-xs text-zinc-700">{expenses.length} entries</p>
          </div>
          <div className="rounded-xl border border-surface-2/50 bg-surface-1/40 p-4 backdrop-blur-sm">
            <p className="text-xs font-medium uppercase tracking-wide text-zinc-600">Total Revenue</p>
            <p className="mt-1 font-mono text-2xl font-semibold text-green-400">
              {formatDollars(stats.totalRevenueCents)}
            </p>
            <p className="mt-0.5 text-xs text-zinc-700">logged revenue</p>
          </div>
          <div className="rounded-xl border border-surface-2/50 bg-surface-1/40 p-4 backdrop-blur-sm">
            <p className="text-xs font-medium uppercase tracking-wide text-zinc-600">Net Revenue</p>
            <p className={`mt-1 font-mono text-2xl font-semibold ${netPositive ? "text-green-400" : "text-red-400"}`}>
              {netPositive ? "+" : ""}{formatDollars(netCents)}
            </p>
            <p className="mt-0.5 text-xs text-zinc-700">revenue minus expenses</p>
          </div>
        </div>

        {/* Category breakdown (top 4) */}
        {Object.keys(byCategory).length > 0 && (
          <div className="mb-6 rounded-xl border border-surface-2/50 bg-surface-1/40 p-4">
            <p className="mb-3 text-xs font-medium uppercase tracking-wide text-zinc-600">By Category</p>
            <div className="flex flex-wrap gap-2">
              {Object.entries(byCategory)
                .sort(([, a], [, b]) => b - a)
                .slice(0, 6)
                .map(([cat, cents]) => (
                  <div
                    key={cat}
                    className={`flex items-center gap-1.5 rounded-lg border px-2.5 py-1.5 text-xs font-medium ${categoryColor(cat)}`}
                  >
                    <span>{cat.replace("_", " ")}</span>
                    <span className="font-mono opacity-70">{formatDollars(cents)}</span>
                  </div>
                ))}
            </div>
          </div>
        )}

        {/* Filters + New */}
        <Form method="get" className="mb-4 flex flex-wrap items-center gap-2">
          <select
            name="venture_id"
            defaultValue={filters.ventureId}
            className="rounded-lg border border-surface-2/50 bg-surface-1 px-3 py-1.5 text-sm text-zinc-300 focus:outline-none focus:ring-1 focus:ring-brand"
          >
            <option value="">All ventures</option>
            {ventures.map((v) => (
              <option key={v.id} value={v.id}>{v.name}</option>
            ))}
          </select>
          <select
            name="category"
            defaultValue={filters.category}
            className="rounded-lg border border-surface-2/50 bg-surface-1 px-3 py-1.5 text-sm text-zinc-300 focus:outline-none focus:ring-1 focus:ring-brand"
          >
            <option value="">All categories</option>
            {CATEGORIES.map((c) => (
              <option key={c} value={c}>{c.replace("_", " ")}</option>
            ))}
          </select>
          <Button type="submit" variant="secondary">Filter</Button>
          {(filters.ventureId || filters.category) && (
            <Link to="/dashboard/expenses">
              <Button type="button" variant="secondary">Clear</Button>
            </Link>
          )}
          <div className="ml-auto">
            <Link
              to="new"
              className="inline-flex items-center gap-2 rounded-lg bg-brand px-3 py-1.5 text-sm font-medium text-white transition-colors hover:bg-brand-dark"
            >
              <Plus className="h-4 w-4" />
              Add Expense
            </Link>
          </div>
        </Form>

        {/* Table */}
        <div className="rounded-xl border border-surface-2/50 bg-surface-1/40 backdrop-blur-sm">
          {expenses.length === 0 ? (
            <EmptyState
              icon={Receipt}
              title="No expenses"
              description={
                filters.ventureId || filters.category
                  ? "No expenses match these filters."
                  : "Add your first expense to start tracking costs."
              }
              action={
                <Link
                  to="new"
                  className="inline-flex items-center gap-2 rounded-lg bg-brand px-4 py-2 text-sm font-medium text-white hover:bg-brand-dark"
                >
                  <Plus className="h-4 w-4" />
                  Add Expense
                </Link>
              }
            />
          ) : (
            <div className="divide-y divide-surface-2/30">
              {expenses.map((expense) => (
                <div
                  key={expense.id}
                  className="flex items-center gap-4 px-4 py-3 transition-colors hover:bg-surface-2/20"
                >
                  <div className="min-w-0 flex-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className={`shrink-0 rounded border px-1.5 py-0.5 text-xs font-medium ${categoryColor(expense.category)}`}>
                        {expense.category.replace("_", " ")}
                      </span>
                      <Link
                        to={expense.id}
                        className="text-sm font-medium text-zinc-200 hover:text-brand"
                      >
                        {expense.vendor}
                      </Link>
                      {expense.is_recurring && (
                        <span className="text-xs text-zinc-600">↻ recurring</span>
                      )}
                    </div>
                    <div className="mt-0.5 flex items-center gap-3">
                      {(expense.ventures as { name: string } | null)?.name && (
                        <p className="text-xs text-zinc-600">
                          {(expense.ventures as { name: string }).name}
                        </p>
                      )}
                      {expense.description && (
                        <p className="text-xs text-zinc-700 truncate max-w-[200px]">
                          {expense.description}
                        </p>
                      )}
                    </div>
                  </div>

                  <div className="flex shrink-0 items-center gap-4">
                    {/* Receipt indicator */}
                    {expense.receipt_url ? (
                      <a
                        href={expense.receipt_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-zinc-500 transition-colors hover:text-zinc-200"
                        title={expense.receipt_filename ?? "View receipt"}
                      >
                        <Paperclip className="h-3.5 w-3.5" />
                      </a>
                    ) : (
                      <span className="h-3.5 w-3.5" />
                    )}

                    <span className="hidden font-mono text-xs text-zinc-600 sm:block">
                      {formatDate(expense.expense_date)}
                    </span>
                    <span className="w-24 text-right font-mono text-sm font-medium text-zinc-200">
                      {formatDollars(expense.amount_cents)}
                    </span>

                    <Link
                      to={expense.id}
                      className="text-zinc-600 transition-colors hover:text-zinc-300"
                      title="Edit"
                    >
                      <ExternalLink className="h-4 w-4" />
                    </Link>

                    <Form
                      method="post"
                      onSubmit={(e) => {
                        if (!confirm("Delete this expense?")) e.preventDefault();
                      }}
                    >
                      <input type="hidden" name="intent" value="delete" />
                      <input type="hidden" name="id" value={expense.id} />
                      <input type="hidden" name="receipt_url" value={expense.receipt_url ?? ""} />
                      <button
                        type="submit"
                        className="text-zinc-700 transition-colors hover:text-red-400"
                      >
                        <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                        </svg>
                      </button>
                    </Form>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
