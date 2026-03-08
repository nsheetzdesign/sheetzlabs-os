import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useLoaderData, Form, Link, redirect, data } from "react-router";
import { Plus, Receipt, Paperclip, ExternalLink } from "lucide-react";
import { Header } from "~/components/dashboard/Header";
import { getSupabaseClient } from "~/lib/supabase.server";
import { requireAuth } from "~/lib/auth.server";
import { deleteReceipt } from "~/lib/storage.server";
import { Button } from "~/components/ui/Button";
import { EmptyState } from "~/components/ui/EmptyState";
const CATEGORY_COLORS = {
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
function categoryColor(cat) {
    return CATEGORY_COLORS[cat] ?? "text-zinc-400 bg-zinc-500/10 border-zinc-500/20";
}
function formatDollars(cents) {
    return `$${(cents / 100).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
}
function formatDate(str) {
    if (!str)
        return "—";
    return new Date(str + "T00:00:00").toLocaleDateString(undefined, {
        month: "short",
        day: "numeric",
        year: "numeric",
    });
}
export async function loader({ request, context }) {
    const { headers } = await requireAuth(request, context.cloudflare.env);
    const supabase = getSupabaseClient(context.cloudflare.env);
    const url = new URL(request.url);
    const ventureId = url.searchParams.get("venture_id") ?? "";
    const category = url.searchParams.get("category") ?? "";
    let query = supabase
        .from("expenses")
        .select("*, ventures(id, name, slug)")
        .order("expense_date", { ascending: false });
    if (ventureId)
        query = query.eq("venture_id", ventureId);
    if (category)
        query = query.eq("category", category);
    const [expensesRes, venturesRes, revenueRes] = await Promise.all([
        query,
        supabase.from("ventures").select("id, name, slug").order("name"),
        supabase.from("revenue").select("amount_cents"),
    ]);
    const expenses = expensesRes.data ?? [];
    const totalExpenseCents = expenses.reduce((s, e) => s + (e.amount_cents ?? 0), 0);
    const totalRevenueCents = (revenueRes.data ?? []).reduce((s, r) => s + (r.amount_cents ?? 0), 0);
    // Category breakdown (all expenses, no filter)
    const allExpensesRes = await supabase.from("expenses").select("category, amount_cents");
    const byCategory = {};
    for (const e of allExpensesRes.data ?? []) {
        byCategory[e.category] = (byCategory[e.category] ?? 0) + (e.amount_cents ?? 0);
    }
    return data({
        expenses,
        ventures: venturesRes.data ?? [],
        filters: { ventureId, category },
        stats: { totalExpenseCents, totalRevenueCents },
        byCategory,
    }, { headers });
}
export async function action({ request, context }) {
    await requireAuth(request, context.cloudflare.env);
    const supabase = getSupabaseClient(context.cloudflare.env);
    const fd = await request.formData();
    const intent = fd.get("intent");
    if (intent === "delete") {
        const id = fd.get("id");
        const receiptUrl = fd.get("receipt_url");
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
];
export default function ExpensesIndex() {
    const { expenses, ventures, filters, stats, byCategory } = useLoaderData();
    const netCents = stats.totalRevenueCents - stats.totalExpenseCents;
    const netPositive = netCents >= 0;
    return (_jsxs("div", { className: "flex flex-1 flex-col", children: [_jsx(Header, { title: "Expenses" }), _jsxs("main", { className: "flex-1 p-6", children: [_jsxs("div", { className: "mb-6 grid gap-4 sm:grid-cols-3", children: [_jsxs("div", { className: "rounded-xl border border-surface-2/50 bg-surface-1/40 p-4 backdrop-blur-sm", children: [_jsx("p", { className: "text-xs font-medium uppercase tracking-wide text-zinc-600", children: "Total Expenses" }), _jsx("p", { className: "mt-1 font-mono text-2xl font-semibold text-red-400", children: formatDollars(stats.totalExpenseCents) }), _jsxs("p", { className: "mt-0.5 text-xs text-zinc-700", children: [expenses.length, " entries"] })] }), _jsxs("div", { className: "rounded-xl border border-surface-2/50 bg-surface-1/40 p-4 backdrop-blur-sm", children: [_jsx("p", { className: "text-xs font-medium uppercase tracking-wide text-zinc-600", children: "Total Revenue" }), _jsx("p", { className: "mt-1 font-mono text-2xl font-semibold text-green-400", children: formatDollars(stats.totalRevenueCents) }), _jsx("p", { className: "mt-0.5 text-xs text-zinc-700", children: "logged revenue" })] }), _jsxs("div", { className: "rounded-xl border border-surface-2/50 bg-surface-1/40 p-4 backdrop-blur-sm", children: [_jsx("p", { className: "text-xs font-medium uppercase tracking-wide text-zinc-600", children: "Net Revenue" }), _jsxs("p", { className: `mt-1 font-mono text-2xl font-semibold ${netPositive ? "text-green-400" : "text-red-400"}`, children: [netPositive ? "+" : "", formatDollars(netCents)] }), _jsx("p", { className: "mt-0.5 text-xs text-zinc-700", children: "revenue minus expenses" })] })] }), Object.keys(byCategory).length > 0 && (_jsxs("div", { className: "mb-6 rounded-xl border border-surface-2/50 bg-surface-1/40 p-4", children: [_jsx("p", { className: "mb-3 text-xs font-medium uppercase tracking-wide text-zinc-600", children: "By Category" }), _jsx("div", { className: "flex flex-wrap gap-2", children: Object.entries(byCategory)
                                    .sort(([, a], [, b]) => b - a)
                                    .slice(0, 6)
                                    .map(([cat, cents]) => (_jsxs("div", { className: `flex items-center gap-1.5 rounded-lg border px-2.5 py-1.5 text-xs font-medium ${categoryColor(cat)}`, children: [_jsx("span", { children: cat.replace("_", " ") }), _jsx("span", { className: "font-mono opacity-70", children: formatDollars(cents) })] }, cat))) })] })), _jsxs(Form, { method: "get", className: "mb-4 flex flex-wrap items-center gap-2", children: [_jsxs("select", { name: "venture_id", defaultValue: filters.ventureId, className: "rounded-lg border border-surface-2/50 bg-surface-1 px-3 py-1.5 text-sm text-zinc-300 focus:outline-none focus:ring-1 focus:ring-brand", children: [_jsx("option", { value: "", children: "All ventures" }), ventures.map((v) => (_jsx("option", { value: v.id, children: v.name }, v.id)))] }), _jsxs("select", { name: "category", defaultValue: filters.category, className: "rounded-lg border border-surface-2/50 bg-surface-1 px-3 py-1.5 text-sm text-zinc-300 focus:outline-none focus:ring-1 focus:ring-brand", children: [_jsx("option", { value: "", children: "All categories" }), CATEGORIES.map((c) => (_jsx("option", { value: c, children: c.replace("_", " ") }, c)))] }), _jsx(Button, { type: "submit", variant: "secondary", children: "Filter" }), (filters.ventureId || filters.category) && (_jsx(Link, { to: "/dashboard/expenses", children: _jsx(Button, { type: "button", variant: "secondary", children: "Clear" }) })), _jsx("div", { className: "ml-auto", children: _jsxs(Link, { to: "new", className: "inline-flex items-center gap-2 rounded-lg bg-brand px-3 py-1.5 text-sm font-medium text-white transition-colors hover:bg-brand-dark", children: [_jsx(Plus, { className: "h-4 w-4" }), "Add Expense"] }) })] }), _jsx("div", { className: "rounded-xl border border-surface-2/50 bg-surface-1/40 backdrop-blur-sm", children: expenses.length === 0 ? (_jsx(EmptyState, { icon: Receipt, title: "No expenses", description: filters.ventureId || filters.category
                                ? "No expenses match these filters."
                                : "Add your first expense to start tracking costs.", action: _jsxs(Link, { to: "new", className: "inline-flex items-center gap-2 rounded-lg bg-brand px-4 py-2 text-sm font-medium text-white hover:bg-brand-dark", children: [_jsx(Plus, { className: "h-4 w-4" }), "Add Expense"] }) })) : (_jsx("div", { className: "divide-y divide-surface-2/30", children: expenses.map((expense) => (_jsxs("div", { className: "flex items-center gap-4 px-4 py-3 transition-colors hover:bg-surface-2/20", children: [_jsxs("div", { className: "min-w-0 flex-1", children: [_jsxs("div", { className: "flex flex-wrap items-center gap-2", children: [_jsx("span", { className: `shrink-0 rounded border px-1.5 py-0.5 text-xs font-medium ${categoryColor(expense.category)}`, children: expense.category.replace("_", " ") }), _jsx(Link, { to: expense.id, className: "text-sm font-medium text-zinc-200 hover:text-brand", children: expense.vendor }), expense.is_recurring && (_jsx("span", { className: "text-xs text-zinc-600", children: "\u21BB recurring" }))] }), _jsxs("div", { className: "mt-0.5 flex items-center gap-3", children: [expense.ventures?.name && (_jsx("p", { className: "text-xs text-zinc-600", children: expense.ventures.name })), expense.description && (_jsx("p", { className: "text-xs text-zinc-700 truncate max-w-[200px]", children: expense.description }))] })] }), _jsxs("div", { className: "flex shrink-0 items-center gap-4", children: [expense.receipt_url ? (_jsx("a", { href: expense.receipt_url, target: "_blank", rel: "noopener noreferrer", className: "text-zinc-500 transition-colors hover:text-zinc-200", title: expense.receipt_filename ?? "View receipt", children: _jsx(Paperclip, { className: "h-3.5 w-3.5" }) })) : (_jsx("span", { className: "h-3.5 w-3.5" })), _jsx("span", { className: "hidden font-mono text-xs text-zinc-600 sm:block", children: formatDate(expense.expense_date) }), _jsx("span", { className: "w-24 text-right font-mono text-sm font-medium text-zinc-200", children: formatDollars(expense.amount_cents) }), _jsx(Link, { to: expense.id, className: "text-zinc-600 transition-colors hover:text-zinc-300", title: "Edit", children: _jsx(ExternalLink, { className: "h-4 w-4" }) }), _jsxs(Form, { method: "post", onSubmit: (e) => {
                                                    if (!confirm("Delete this expense?"))
                                                        e.preventDefault();
                                                }, children: [_jsx("input", { type: "hidden", name: "intent", value: "delete" }), _jsx("input", { type: "hidden", name: "id", value: expense.id }), _jsx("input", { type: "hidden", name: "receipt_url", value: expense.receipt_url ?? "" }), _jsx("button", { type: "submit", className: "text-zinc-700 transition-colors hover:text-red-400", children: _jsx("svg", { className: "h-4 w-4", fill: "none", viewBox: "0 0 24 24", strokeWidth: 2, stroke: "currentColor", children: _jsx("path", { strokeLinecap: "round", strokeLinejoin: "round", d: "M6 18L18 6M6 6l12 12" }) }) })] })] })] }, expense.id))) })) })] })] }));
}
