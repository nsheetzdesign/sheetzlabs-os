import type { ActionFunctionArgs, LoaderFunctionArgs } from "react-router";
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
] as const;

export async function loader({ request, params, context }: LoaderFunctionArgs) {
  const { headers } = await requireAuth(request, context.cloudflare.env);
  const supabase = getSupabaseClient(context.cloudflare.env);
  const id = params.id!;

  const [expenseRes, venturesRes] = await Promise.all([
    supabase.from("expenses").select("*, ventures(id, name, slug)").eq("id", id).single(),
    supabase.from("ventures").select("id, name, slug").order("name"),
  ]);

  if (expenseRes.error || !expenseRes.data) {
    throw new Response("Expense not found", { status: 404 });
  }

  return data(
    { expense: expenseRes.data, ventures: venturesRes.data ?? [] },
    { headers },
  );
}

export async function action({ request, params, context }: ActionFunctionArgs) {
  await requireAuth(request, context.cloudflare.env);
  const supabase = getSupabaseClient(context.cloudflare.env);
  const id = params.id!;
  const fd = await request.formData();
  const intent = fd.get("intent") as string;

  if (intent === "delete") {
    const receiptUrl = fd.get("receipt_url") as string;
    if (receiptUrl) {
      await deleteReceipt(supabase, receiptUrl).catch(console.error);
    }
    await supabase.from("expenses").delete().eq("id", id);
    return redirect("/dashboard/expenses");
  }

  if (intent === "update") {
    const amountStr = fd.get("amount") as string;
    const category = fd.get("category") as string;
    const vendor = (fd.get("vendor") as string).trim();
    const description = (fd.get("description") as string | null) ?? "";
    const expenseDate = fd.get("expense_date") as string;
    const ventureId = (fd.get("venture_id") as string) || null;
    const isRecurring = fd.get("is_recurring") === "on";
    const receiptFile = fd.get("receipt") as File | null;
    const existingReceiptUrl = fd.get("existing_receipt_url") as string;

    const amountCents = Math.round(parseFloat(amountStr) * 100);
    if (isNaN(amountCents) || amountCents <= 0) {
      return data({ error: "Amount must be a positive number." }, { status: 400 });
    }

    let receiptUrl = existingReceiptUrl || null;
    let receiptFilename: string | null = null;

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
      } catch (err) {
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
        category: category as never,
        amount_cents: amountCents,
        description: description || null,
        expense_date: expenseDate,
        venture_id: ventureId,
        is_recurring: isRecurring,
        receipt_url: receiptUrl,
        receipt_filename: receiptFilename ?? (receiptUrl ? fd.get("existing_receipt_filename") as string : null),
      })
      .eq("id", id);

    return redirect(`/dashboard/expenses/${id}`);
  }

  return redirect("/dashboard/expenses");
}

function ReceiptPreview({ url, filename }: { url: string; filename: string | null }) {
  const isPdf = filename?.toLowerCase().endsWith(".pdf") ||
    url.toLowerCase().includes(".pdf");
  const isImage = !isPdf;

  return (
    <div className="rounded-xl border border-surface-2/50 bg-surface-1/40 p-4">
      <div className="mb-3 flex items-center justify-between">
        <p className="text-sm font-medium text-zinc-300">Receipt</p>
        <a
          href={url}
          target="_blank"
          rel="noopener noreferrer"
          download={filename ?? true}
          className="inline-flex items-center gap-1.5 text-xs text-zinc-500 hover:text-zinc-300"
        >
          <Download className="h-3.5 w-3.5" />
          Download
        </a>
      </div>
      {isImage ? (
        <a href={url} target="_blank" rel="noopener noreferrer">
          <img
            src={url}
            alt={filename ?? "Receipt"}
            className="max-h-64 w-full rounded-lg object-contain bg-surface-0/60"
          />
        </a>
      ) : (
        <a
          href={url}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-3 rounded-lg border border-surface-2/50 bg-surface-0/60 px-4 py-3 hover:border-brand/30"
        >
          <FileText className="h-8 w-8 shrink-0 text-red-400" />
          <div className="min-w-0">
            <p className="truncate text-sm text-zinc-200">{filename ?? "Receipt.pdf"}</p>
            <p className="text-xs text-zinc-500">Click to open PDF</p>
          </div>
        </a>
      )}
    </div>
  );
}

export default function ExpenseDetail() {
  const { expense, ventures } = useLoaderData<typeof loader>();
  const navigation = useNavigation();
  const busy = navigation.state !== "idle";

  return (
    <div className="flex flex-1 flex-col">
      <Header title={expense.vendor} />
      <main className="flex-1 p-6">
        <div className="mb-6 flex items-center justify-between">
          <Link
            to="/dashboard/expenses"
            className="inline-flex items-center gap-2 text-sm text-zinc-500 hover:text-zinc-300"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Expenses
          </Link>
          <Form method="post">
            <input type="hidden" name="intent" value="delete" />
            <input type="hidden" name="receipt_url" value={expense.receipt_url ?? ""} />
            <button
              type="submit"
              onClick={(e) => {
                if (!confirm("Delete this expense and its receipt?")) e.preventDefault();
              }}
              className="inline-flex items-center gap-2 rounded-lg border border-red-500/20 bg-red-500/10 px-3 py-1.5 text-sm text-red-400 transition-colors hover:bg-red-500/20"
            >
              <Trash2 className="h-4 w-4" />
              Delete
            </button>
          </Form>
        </div>

        <div className="grid gap-6 lg:grid-cols-5">
          {/* Edit form */}
          <div className="lg:col-span-3">
            <Form
              method="post"
              encType="multipart/form-data"
              className="space-y-5 rounded-xl border border-surface-2/50 bg-surface-1/40 p-6"
            >
              <input type="hidden" name="intent" value="update" />
              <input type="hidden" name="existing_receipt_url" value={expense.receipt_url ?? ""} />
              <input type="hidden" name="existing_receipt_filename" value={expense.receipt_filename ?? ""} />

              <div className="grid gap-5 sm:grid-cols-2">
                <FormField label="Amount (USD)" required>
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-500">$</span>
                    <input
                      type="number"
                      name="amount"
                      step="0.01"
                      min="0.01"
                      required
                      defaultValue={(expense.amount_cents / 100).toFixed(2)}
                      className="w-full rounded-lg border border-surface-2/50 bg-surface-1 pl-7 pr-3 py-2 text-sm text-zinc-200 focus:outline-none focus:ring-1 focus:ring-brand"
                    />
                  </div>
                </FormField>
                <FormField label="Date" required>
                  <input
                    type="date"
                    name="expense_date"
                    required
                    defaultValue={expense.expense_date}
                    className="w-full rounded-lg border border-surface-2/50 bg-surface-1 px-3 py-2 text-sm text-zinc-200 focus:outline-none focus:ring-1 focus:ring-brand"
                  />
                </FormField>
              </div>

              <div className="grid gap-5 sm:grid-cols-2">
                <FormField label="Category" required>
                  <select
                    name="category"
                    required
                    defaultValue={expense.category}
                    className="w-full rounded-lg border border-surface-2/50 bg-surface-1 px-3 py-2 text-sm text-zinc-200 focus:outline-none focus:ring-1 focus:ring-brand"
                  >
                    {CATEGORIES.map((c) => (
                      <option key={c} value={c}>{c.replace("_", " ")}</option>
                    ))}
                  </select>
                </FormField>
                <FormField label="Vendor / Source" required>
                  <input
                    type="text"
                    name="vendor"
                    required
                    defaultValue={expense.vendor}
                    className="w-full rounded-lg border border-surface-2/50 bg-surface-1 px-3 py-2 text-sm text-zinc-200 focus:outline-none focus:ring-1 focus:ring-brand"
                  />
                </FormField>
              </div>

              <FormField label="Venture">
                <select
                  name="venture_id"
                  defaultValue={expense.venture_id ?? ""}
                  className="w-full rounded-lg border border-surface-2/50 bg-surface-1 px-3 py-2 text-sm text-zinc-200 focus:outline-none focus:ring-1 focus:ring-brand"
                >
                  <option value="">No specific venture</option>
                  {ventures.map((v) => (
                    <option key={v.id} value={v.id}>{v.name}</option>
                  ))}
                </select>
              </FormField>

              <FormField label="Description">
                <textarea
                  name="description"
                  rows={2}
                  defaultValue={expense.description ?? ""}
                  className="w-full resize-none rounded-lg border border-surface-2/50 bg-surface-1 px-3 py-2 text-sm text-zinc-200 placeholder-zinc-600 focus:outline-none focus:ring-1 focus:ring-brand"
                />
              </FormField>

              <FormField
                label={expense.receipt_url ? "Replace Receipt" : "Receipt"}
                hint="JPEG, PNG, WebP, or PDF — max 10 MB"
              >
                <input
                  type="file"
                  name="receipt"
                  accept="image/jpeg,image/png,image/webp,application/pdf"
                  className="block w-full text-sm text-zinc-400 file:mr-4 file:rounded-lg file:border-0 file:bg-surface-2 file:px-3 file:py-1.5 file:text-sm file:font-medium file:text-zinc-300 hover:file:bg-surface-3"
                />
              </FormField>

              <div className="flex items-center gap-3">
                <input
                  type="checkbox"
                  name="is_recurring"
                  id="is_recurring"
                  defaultChecked={expense.is_recurring ?? false}
                  className="h-4 w-4 rounded border-surface-2 bg-surface-1 accent-brand"
                />
                <label htmlFor="is_recurring" className="text-sm text-zinc-400">
                  Recurring expense
                </label>
              </div>

              <div className="flex items-center gap-3 pt-2">
                <Button type="submit" disabled={busy}>
                  {busy ? "Saving…" : "Save Changes"}
                </Button>
                <Link to="/dashboard/expenses">
                  <Button type="button" variant="secondary">Cancel</Button>
                </Link>
              </div>
            </Form>
          </div>

          {/* Receipt panel */}
          <div className="lg:col-span-2 space-y-4">
            {expense.receipt_url ? (
              <>
                <ReceiptPreview url={expense.receipt_url} filename={expense.receipt_filename} />
                {/* Remove receipt */}
                <Form method="post">
                  <input type="hidden" name="intent" value="update" />
                  <input type="hidden" name="remove_receipt" value="true" />
                  <input type="hidden" name="existing_receipt_url" value={expense.receipt_url} />
                  <input type="hidden" name="amount" value={(expense.amount_cents / 100).toFixed(2)} />
                  <input type="hidden" name="category" value={expense.category} />
                  <input type="hidden" name="vendor" value={expense.vendor} />
                  <input type="hidden" name="expense_date" value={expense.expense_date} />
                  <button
                    type="submit"
                    className="text-xs text-zinc-600 hover:text-red-400"
                    onClick={(e) => {
                      if (!confirm("Remove this receipt?")) e.preventDefault();
                    }}
                  >
                    Remove receipt
                  </button>
                </Form>
              </>
            ) : (
              <div className="rounded-xl border border-dashed border-surface-2/50 p-6 text-center">
                <FileImage className="mx-auto mb-2 h-8 w-8 text-zinc-700" />
                <p className="text-sm text-zinc-600">No receipt attached</p>
                <p className="mt-1 text-xs text-zinc-700">Upload one using the form</p>
              </div>
            )}

            {/* Metadata */}
            <div className="rounded-xl border border-surface-2/50 bg-surface-1/40 p-4 space-y-2">
              <p className="text-xs font-medium uppercase tracking-wide text-zinc-600">Meta</p>
              <div className="space-y-1.5 text-sm">
                <div className="flex justify-between">
                  <span className="text-zinc-600">Source</span>
                  <span className="font-mono text-xs text-zinc-400">{expense.source ?? "manual"}</span>
                </div>
                {expense.external_id && (
                  <div className="flex justify-between">
                    <span className="text-zinc-600">External ID</span>
                    <span className="font-mono text-xs text-zinc-400 truncate max-w-[140px]">
                      {expense.external_id}
                    </span>
                  </div>
                )}
                <div className="flex justify-between">
                  <span className="text-zinc-600">Created</span>
                  <span className="text-xs text-zinc-400">
                    {new Date(expense.created_at!).toLocaleDateString()}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
