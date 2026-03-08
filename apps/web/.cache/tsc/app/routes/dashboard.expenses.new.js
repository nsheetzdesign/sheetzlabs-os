import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { redirect, useLoaderData, Form, Link, useNavigation, data } from "react-router";
import { ArrowLeft } from "lucide-react";
import { Header } from "~/components/dashboard/Header";
import { getSupabaseClient } from "~/lib/supabase.server";
import { requireAuth } from "~/lib/auth.server";
import { uploadReceipt } from "~/lib/storage.server";
import { Button } from "~/components/ui/Button";
import { FormField } from "~/components/ui/FormField";
const CATEGORIES = [
    "software", "hosting", "ai_usage", "contractor", "hardware",
    "office", "marketing", "legal", "banking", "travel", "subscriptions", "other",
];
export async function loader({ request, context }) {
    const { headers } = await requireAuth(request, context.cloudflare.env);
    const supabase = getSupabaseClient(context.cloudflare.env);
    const { data: ventures } = await supabase
        .from("ventures")
        .select("id, name, slug")
        .order("name");
    return data({ ventures: ventures ?? [] }, { headers });
}
export async function action({ request, context }) {
    await requireAuth(request, context.cloudflare.env);
    const supabase = getSupabaseClient(context.cloudflare.env);
    // Must parse as formData to get file uploads
    const fd = await request.formData();
    const amountStr = fd.get("amount");
    const category = fd.get("category");
    const vendor = fd.get("vendor").trim();
    const description = fd.get("description") ?? "";
    const expenseDate = fd.get("expense_date");
    const ventureId = fd.get("venture_id") || null;
    const isRecurring = fd.get("is_recurring") === "on";
    const receiptFile = fd.get("receipt");
    if (!vendor || !category || !expenseDate || !amountStr) {
        return data({ error: "Amount, category, vendor, and date are required." }, { status: 400 });
    }
    const amountCents = Math.round(parseFloat(amountStr) * 100);
    if (isNaN(amountCents) || amountCents <= 0) {
        return data({ error: "Amount must be a positive number." }, { status: 400 });
    }
    // Insert expense first to get the ID
    const { data: expense, error: insertErr } = await supabase
        .from("expenses")
        .insert({
        vendor,
        category: category,
        amount_cents: amountCents,
        description: description || null,
        expense_date: expenseDate,
        venture_id: ventureId,
        is_recurring: isRecurring,
        source: "manual",
    })
        .select("id")
        .single();
    if (insertErr || !expense) {
        return data({ error: insertErr?.message ?? "Failed to create expense." }, { status: 500 });
    }
    // Upload receipt if provided
    if (receiptFile && receiptFile.size > 0) {
        try {
            const { url, filename } = await uploadReceipt(supabase, expense.id, receiptFile);
            await supabase
                .from("expenses")
                .update({ receipt_url: url, receipt_filename: filename })
                .eq("id", expense.id);
        }
        catch (err) {
            console.error("Receipt upload failed:", err);
            // Continue even if upload fails — expense is still saved
        }
    }
    return redirect(`/dashboard/expenses/${expense.id}`);
}
export default function NewExpense() {
    const { ventures } = useLoaderData();
    const navigation = useNavigation();
    const busy = navigation.state !== "idle";
    const today = new Date().toISOString().split("T")[0];
    return (_jsxs("div", { className: "flex flex-1 flex-col", children: [_jsx(Header, { title: "New Expense" }), _jsxs("main", { className: "flex-1 p-6", children: [_jsx("div", { className: "mb-6", children: _jsxs(Link, { to: "/dashboard/expenses", className: "inline-flex items-center gap-2 text-sm text-zinc-500 hover:text-zinc-300", children: [_jsx(ArrowLeft, { className: "h-4 w-4" }), "Back to Expenses"] }) }), _jsx("div", { className: "max-w-xl", children: _jsxs(Form, { method: "post", encType: "multipart/form-data", className: "space-y-5 rounded-xl border border-surface-2/50 bg-surface-1/40 p-6", children: [_jsxs("div", { className: "grid gap-5 sm:grid-cols-2", children: [_jsx(FormField, { label: "Amount (USD)", required: true, children: _jsxs("div", { className: "relative", children: [_jsx("span", { className: "absolute left-3 top-1/2 -translate-y-1/2 text-zinc-500", children: "$" }), _jsx("input", { type: "number", name: "amount", step: "0.01", min: "0.01", required: true, placeholder: "0.00", className: "w-full rounded-lg border border-surface-2/50 bg-surface-1 pl-7 pr-3 py-2 text-sm text-zinc-200 placeholder-zinc-600 focus:outline-none focus:ring-1 focus:ring-brand" })] }) }), _jsx(FormField, { label: "Date", required: true, children: _jsx("input", { type: "date", name: "expense_date", defaultValue: today, required: true, className: "w-full rounded-lg border border-surface-2/50 bg-surface-1 px-3 py-2 text-sm text-zinc-200 focus:outline-none focus:ring-1 focus:ring-brand" }) })] }), _jsxs("div", { className: "grid gap-5 sm:grid-cols-2", children: [_jsx(FormField, { label: "Category", required: true, children: _jsxs("select", { name: "category", required: true, className: "w-full rounded-lg border border-surface-2/50 bg-surface-1 px-3 py-2 text-sm text-zinc-200 focus:outline-none focus:ring-1 focus:ring-brand", children: [_jsx("option", { value: "", children: "Select category\u2026" }), CATEGORIES.map((c) => (_jsx("option", { value: c, children: c.replace("_", " ") }, c)))] }) }), _jsx(FormField, { label: "Vendor / Source", required: true, children: _jsx("input", { type: "text", name: "vendor", required: true, placeholder: "e.g. Vercel, AWS, Fiverr", className: "w-full rounded-lg border border-surface-2/50 bg-surface-1 px-3 py-2 text-sm text-zinc-200 placeholder-zinc-600 focus:outline-none focus:ring-1 focus:ring-brand" }) })] }), _jsx(FormField, { label: "Venture", hint: "Optional \u2014 leave blank for shared expenses", children: _jsxs("select", { name: "venture_id", className: "w-full rounded-lg border border-surface-2/50 bg-surface-1 px-3 py-2 text-sm text-zinc-200 focus:outline-none focus:ring-1 focus:ring-brand", children: [_jsx("option", { value: "", children: "No specific venture" }), ventures.map((v) => (_jsx("option", { value: v.id, children: v.name }, v.id)))] }) }), _jsx(FormField, { label: "Description", children: _jsx("textarea", { name: "description", rows: 2, placeholder: "Optional notes\u2026", className: "w-full resize-none rounded-lg border border-surface-2/50 bg-surface-1 px-3 py-2 text-sm text-zinc-200 placeholder-zinc-600 focus:outline-none focus:ring-1 focus:ring-brand" }) }), _jsx(FormField, { label: "Receipt", hint: "JPEG, PNG, WebP, or PDF \u2014 max 10 MB", children: _jsx("input", { type: "file", name: "receipt", accept: "image/jpeg,image/png,image/webp,application/pdf", className: "block w-full text-sm text-zinc-400 file:mr-4 file:rounded-lg file:border-0 file:bg-surface-2 file:px-3 file:py-1.5 file:text-sm file:font-medium file:text-zinc-300 hover:file:bg-surface-3" }) }), _jsxs("div", { className: "flex items-center gap-3", children: [_jsx("input", { type: "checkbox", name: "is_recurring", id: "is_recurring", className: "h-4 w-4 rounded border-surface-2 bg-surface-1 accent-brand" }), _jsx("label", { htmlFor: "is_recurring", className: "text-sm text-zinc-400", children: "Recurring expense" })] }), _jsxs("div", { className: "flex items-center gap-3 pt-2", children: [_jsx(Button, { type: "submit", disabled: busy, children: busy ? "Saving…" : "Add Expense" }), _jsx(Link, { to: "/dashboard/expenses", children: _jsx(Button, { type: "button", variant: "secondary", children: "Cancel" }) })] })] }) })] })] }));
}
