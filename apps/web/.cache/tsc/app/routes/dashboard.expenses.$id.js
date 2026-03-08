import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
import { redirect, useLoaderData, Form, Link, useNavigation, data } from "react-router";
import { ArrowLeft, Download, FileImage, FileText, Trash2 } from "lucide-react";
import { Header } from "~/components/dashboard/Header";
import { getSupabaseClient } from "~/lib/supabase.server";
import { requireAuth } from "~/lib/auth.server";
import { uploadReceipt, deleteReceipt } from "~/lib/storage.server";
import { Button } from "~/components/ui/Button";
import { FormField } from "~/components/ui/FormField";
const CATEGORIES = [
    "software", "hosting", "ai_usage", "contractor", "hardware",
    "office", "marketing", "legal", "banking", "travel", "subscriptions", "other",
];
export async function loader({ request, params, context }) {
    const { headers } = await requireAuth(request, context.cloudflare.env);
    const supabase = getSupabaseClient(context.cloudflare.env);
    const id = params.id;
    const [expenseRes, venturesRes] = await Promise.all([
        supabase.from("expenses").select("*, ventures(id, name, slug)").eq("id", id).single(),
        supabase.from("ventures").select("id, name, slug").order("name"),
    ]);
    if (expenseRes.error || !expenseRes.data) {
        throw new Response("Expense not found", { status: 404 });
    }
    return data({ expense: expenseRes.data, ventures: venturesRes.data ?? [] }, { headers });
}
export async function action({ request, params, context }) {
    await requireAuth(request, context.cloudflare.env);
    const supabase = getSupabaseClient(context.cloudflare.env);
    const id = params.id;
    const fd = await request.formData();
    const intent = fd.get("intent");
    if (intent === "delete") {
        const receiptUrl = fd.get("receipt_url");
        if (receiptUrl) {
            await deleteReceipt(supabase, receiptUrl).catch(console.error);
        }
        await supabase.from("expenses").delete().eq("id", id);
        return redirect("/dashboard/expenses");
    }
    if (intent === "update") {
        const amountStr = fd.get("amount");
        const category = fd.get("category");
        const vendor = fd.get("vendor").trim();
        const description = fd.get("description") ?? "";
        const expenseDate = fd.get("expense_date");
        const ventureId = fd.get("venture_id") || null;
        const isRecurring = fd.get("is_recurring") === "on";
        const receiptFile = fd.get("receipt");
        const existingReceiptUrl = fd.get("existing_receipt_url");
        const amountCents = Math.round(parseFloat(amountStr) * 100);
        if (isNaN(amountCents) || amountCents <= 0) {
            return data({ error: "Amount must be a positive number." }, { status: 400 });
        }
        let receiptUrl = existingReceiptUrl || null;
        let receiptFilename = null;
        // Handle new receipt upload
        if (receiptFile && receiptFile.size > 0) {
            // Delete old receipt first
            if (existingReceiptUrl) {
                await deleteReceipt(supabase, existingReceiptUrl).catch(console.error);
            }
            try {
                const result = await uploadReceipt(supabase, id, receiptFile);
                receiptUrl = result.url;
                receiptFilename = result.filename;
            }
            catch (err) {
                console.error("Receipt upload failed:", err);
            }
        }
        // Handle receipt removal
        if (fd.get("remove_receipt") === "true" && existingReceiptUrl) {
            await deleteReceipt(supabase, existingReceiptUrl).catch(console.error);
            receiptUrl = null;
            receiptFilename = null;
        }
        await supabase
            .from("expenses")
            .update({
            vendor,
            category: category,
            amount_cents: amountCents,
            description: description || null,
            expense_date: expenseDate,
            venture_id: ventureId,
            is_recurring: isRecurring,
            receipt_url: receiptUrl,
            receipt_filename: receiptFilename ?? (receiptUrl ? fd.get("existing_receipt_filename") : null),
        })
            .eq("id", id);
        return redirect(`/dashboard/expenses/${id}`);
    }
    return redirect("/dashboard/expenses");
}
function ReceiptPreview({ url, filename }) {
    const isPdf = filename?.toLowerCase().endsWith(".pdf") ||
        url.toLowerCase().includes(".pdf");
    const isImage = !isPdf;
    return (_jsxs("div", { className: "rounded-xl border border-surface-2/50 bg-surface-1/40 p-4", children: [_jsxs("div", { className: "mb-3 flex items-center justify-between", children: [_jsx("p", { className: "text-sm font-medium text-zinc-300", children: "Receipt" }), _jsxs("a", { href: url, target: "_blank", rel: "noopener noreferrer", download: filename ?? true, className: "inline-flex items-center gap-1.5 text-xs text-zinc-500 hover:text-zinc-300", children: [_jsx(Download, { className: "h-3.5 w-3.5" }), "Download"] })] }), isImage ? (_jsx("a", { href: url, target: "_blank", rel: "noopener noreferrer", children: _jsx("img", { src: url, alt: filename ?? "Receipt", className: "max-h-64 w-full rounded-lg object-contain bg-surface-0/60" }) })) : (_jsxs("a", { href: url, target: "_blank", rel: "noopener noreferrer", className: "flex items-center gap-3 rounded-lg border border-surface-2/50 bg-surface-0/60 px-4 py-3 hover:border-brand/30", children: [_jsx(FileText, { className: "h-8 w-8 shrink-0 text-red-400" }), _jsxs("div", { className: "min-w-0", children: [_jsx("p", { className: "truncate text-sm text-zinc-200", children: filename ?? "Receipt.pdf" }), _jsx("p", { className: "text-xs text-zinc-500", children: "Click to open PDF" })] })] }))] }));
}
export default function ExpenseDetail() {
    const { expense, ventures } = useLoaderData();
    const navigation = useNavigation();
    const busy = navigation.state !== "idle";
    return (_jsxs("div", { className: "flex flex-1 flex-col", children: [_jsx(Header, { title: expense.vendor }), _jsxs("main", { className: "flex-1 p-6", children: [_jsxs("div", { className: "mb-6 flex items-center justify-between", children: [_jsxs(Link, { to: "/dashboard/expenses", className: "inline-flex items-center gap-2 text-sm text-zinc-500 hover:text-zinc-300", children: [_jsx(ArrowLeft, { className: "h-4 w-4" }), "Back to Expenses"] }), _jsxs(Form, { method: "post", children: [_jsx("input", { type: "hidden", name: "intent", value: "delete" }), _jsx("input", { type: "hidden", name: "receipt_url", value: expense.receipt_url ?? "" }), _jsxs("button", { type: "submit", onClick: (e) => {
                                            if (!confirm("Delete this expense and its receipt?"))
                                                e.preventDefault();
                                        }, className: "inline-flex items-center gap-2 rounded-lg border border-red-500/20 bg-red-500/10 px-3 py-1.5 text-sm text-red-400 transition-colors hover:bg-red-500/20", children: [_jsx(Trash2, { className: "h-4 w-4" }), "Delete"] })] })] }), _jsxs("div", { className: "grid gap-6 lg:grid-cols-5", children: [_jsx("div", { className: "lg:col-span-3", children: _jsxs(Form, { method: "post", encType: "multipart/form-data", className: "space-y-5 rounded-xl border border-surface-2/50 bg-surface-1/40 p-6", children: [_jsx("input", { type: "hidden", name: "intent", value: "update" }), _jsx("input", { type: "hidden", name: "existing_receipt_url", value: expense.receipt_url ?? "" }), _jsx("input", { type: "hidden", name: "existing_receipt_filename", value: expense.receipt_filename ?? "" }), _jsxs("div", { className: "grid gap-5 sm:grid-cols-2", children: [_jsx(FormField, { label: "Amount (USD)", required: true, children: _jsxs("div", { className: "relative", children: [_jsx("span", { className: "absolute left-3 top-1/2 -translate-y-1/2 text-zinc-500", children: "$" }), _jsx("input", { type: "number", name: "amount", step: "0.01", min: "0.01", required: true, defaultValue: (expense.amount_cents / 100).toFixed(2), className: "w-full rounded-lg border border-surface-2/50 bg-surface-1 pl-7 pr-3 py-2 text-sm text-zinc-200 focus:outline-none focus:ring-1 focus:ring-brand" })] }) }), _jsx(FormField, { label: "Date", required: true, children: _jsx("input", { type: "date", name: "expense_date", required: true, defaultValue: expense.expense_date, className: "w-full rounded-lg border border-surface-2/50 bg-surface-1 px-3 py-2 text-sm text-zinc-200 focus:outline-none focus:ring-1 focus:ring-brand" }) })] }), _jsxs("div", { className: "grid gap-5 sm:grid-cols-2", children: [_jsx(FormField, { label: "Category", required: true, children: _jsx("select", { name: "category", required: true, defaultValue: expense.category, className: "w-full rounded-lg border border-surface-2/50 bg-surface-1 px-3 py-2 text-sm text-zinc-200 focus:outline-none focus:ring-1 focus:ring-brand", children: CATEGORIES.map((c) => (_jsx("option", { value: c, children: c.replace("_", " ") }, c))) }) }), _jsx(FormField, { label: "Vendor / Source", required: true, children: _jsx("input", { type: "text", name: "vendor", required: true, defaultValue: expense.vendor, className: "w-full rounded-lg border border-surface-2/50 bg-surface-1 px-3 py-2 text-sm text-zinc-200 focus:outline-none focus:ring-1 focus:ring-brand" }) })] }), _jsx(FormField, { label: "Venture", children: _jsxs("select", { name: "venture_id", defaultValue: expense.venture_id ?? "", className: "w-full rounded-lg border border-surface-2/50 bg-surface-1 px-3 py-2 text-sm text-zinc-200 focus:outline-none focus:ring-1 focus:ring-brand", children: [_jsx("option", { value: "", children: "No specific venture" }), ventures.map((v) => (_jsx("option", { value: v.id, children: v.name }, v.id)))] }) }), _jsx(FormField, { label: "Description", children: _jsx("textarea", { name: "description", rows: 2, defaultValue: expense.description ?? "", className: "w-full resize-none rounded-lg border border-surface-2/50 bg-surface-1 px-3 py-2 text-sm text-zinc-200 placeholder-zinc-600 focus:outline-none focus:ring-1 focus:ring-brand" }) }), _jsx(FormField, { label: expense.receipt_url ? "Replace Receipt" : "Receipt", hint: "JPEG, PNG, WebP, or PDF \u2014 max 10 MB", children: _jsx("input", { type: "file", name: "receipt", accept: "image/jpeg,image/png,image/webp,application/pdf", className: "block w-full text-sm text-zinc-400 file:mr-4 file:rounded-lg file:border-0 file:bg-surface-2 file:px-3 file:py-1.5 file:text-sm file:font-medium file:text-zinc-300 hover:file:bg-surface-3" }) }), _jsxs("div", { className: "flex items-center gap-3", children: [_jsx("input", { type: "checkbox", name: "is_recurring", id: "is_recurring", defaultChecked: expense.is_recurring ?? false, className: "h-4 w-4 rounded border-surface-2 bg-surface-1 accent-brand" }), _jsx("label", { htmlFor: "is_recurring", className: "text-sm text-zinc-400", children: "Recurring expense" })] }), _jsxs("div", { className: "flex items-center gap-3 pt-2", children: [_jsx(Button, { type: "submit", disabled: busy, children: busy ? "Saving…" : "Save Changes" }), _jsx(Link, { to: "/dashboard/expenses", children: _jsx(Button, { type: "button", variant: "secondary", children: "Cancel" }) })] })] }) }), _jsxs("div", { className: "lg:col-span-2 space-y-4", children: [expense.receipt_url ? (_jsxs(_Fragment, { children: [_jsx(ReceiptPreview, { url: expense.receipt_url, filename: expense.receipt_filename }), _jsxs(Form, { method: "post", children: [_jsx("input", { type: "hidden", name: "intent", value: "update" }), _jsx("input", { type: "hidden", name: "remove_receipt", value: "true" }), _jsx("input", { type: "hidden", name: "existing_receipt_url", value: expense.receipt_url }), _jsx("input", { type: "hidden", name: "amount", value: (expense.amount_cents / 100).toFixed(2) }), _jsx("input", { type: "hidden", name: "category", value: expense.category }), _jsx("input", { type: "hidden", name: "vendor", value: expense.vendor }), _jsx("input", { type: "hidden", name: "expense_date", value: expense.expense_date }), _jsx("button", { type: "submit", className: "text-xs text-zinc-600 hover:text-red-400", onClick: (e) => {
                                                            if (!confirm("Remove this receipt?"))
                                                                e.preventDefault();
                                                        }, children: "Remove receipt" })] })] })) : (_jsxs("div", { className: "rounded-xl border border-dashed border-surface-2/50 p-6 text-center", children: [_jsx(FileImage, { className: "mx-auto mb-2 h-8 w-8 text-zinc-700" }), _jsx("p", { className: "text-sm text-zinc-600", children: "No receipt attached" }), _jsx("p", { className: "mt-1 text-xs text-zinc-700", children: "Upload one using the form" })] })), _jsxs("div", { className: "rounded-xl border border-surface-2/50 bg-surface-1/40 p-4 space-y-2", children: [_jsx("p", { className: "text-xs font-medium uppercase tracking-wide text-zinc-600", children: "Meta" }), _jsxs("div", { className: "space-y-1.5 text-sm", children: [_jsxs("div", { className: "flex justify-between", children: [_jsx("span", { className: "text-zinc-600", children: "Source" }), _jsx("span", { className: "font-mono text-xs text-zinc-400", children: expense.source ?? "manual" })] }), expense.external_id && (_jsxs("div", { className: "flex justify-between", children: [_jsx("span", { className: "text-zinc-600", children: "External ID" }), _jsx("span", { className: "font-mono text-xs text-zinc-400 truncate max-w-[140px]", children: expense.external_id })] })), _jsxs("div", { className: "flex justify-between", children: [_jsx("span", { className: "text-zinc-600", children: "Created" }), _jsx("span", { className: "text-xs text-zinc-400", children: new Date(expense.created_at).toLocaleDateString() })] })] })] })] })] })] })] }));
}
