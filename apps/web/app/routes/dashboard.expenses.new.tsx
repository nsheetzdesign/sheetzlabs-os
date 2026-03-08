import type { ActionFunctionArgs, LoaderFunctionArgs } from "react-router";
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
] as const;

export async function loader({ request, context }: LoaderFunctionArgs) {
  const { headers } = await requireAuth(request, context.cloudflare.env);
  const supabase = getSupabaseClient(context.cloudflare.env);
  const { data: ventures } = await supabase
    .from("ventures")
    .select("id, name, slug")
    .order("name");
  return data({ ventures: ventures ?? [] }, { headers });
}

export async function action({ request, context }: ActionFunctionArgs) {
  await requireAuth(request, context.cloudflare.env);
  const supabase = getSupabaseClient(context.cloudflare.env);

  // Must parse as formData to get file uploads
  const fd = await request.formData();
  const amountStr = fd.get("amount") as string;
  const category = fd.get("category") as string;
  const vendor = (fd.get("vendor") as string).trim();
  const description = (fd.get("description") as string | null) ?? "";
  const expenseDate = fd.get("expense_date") as string;
  const ventureId = (fd.get("venture_id") as string) || null;
  const isRecurring = fd.get("is_recurring") === "on";
  const receiptFile = fd.get("receipt") as File | null;

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
      category: category as never,
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
    } catch (err) {
      console.error("Receipt upload failed:", err);
      // Continue even if upload fails — expense is still saved
    }
  }

  return redirect(`/dashboard/expenses/${expense.id}`);
}

export default function NewExpense() {
  const { ventures } = useLoaderData<typeof loader>();
  const navigation = useNavigation();
  const busy = navigation.state !== "idle";
  const today = new Date().toISOString().split("T")[0];

  return (
    <div className="flex flex-1 flex-col">
      <Header title="New Expense" />
      <main className="flex-1 p-6">
        <div className="mb-6">
          <Link
            to="/dashboard/expenses"
            className="inline-flex items-center gap-2 text-sm text-zinc-500 hover:text-zinc-300"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Expenses
          </Link>
        </div>

        <div className="max-w-xl">
          <Form
            method="post"
            encType="multipart/form-data"
            className="space-y-5 rounded-xl border border-surface-2/50 bg-surface-1/40 p-6"
          >
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
                    placeholder="0.00"
                    className="w-full rounded-lg border border-surface-2/50 bg-surface-1 pl-7 pr-3 py-2 text-sm text-zinc-200 placeholder-zinc-600 focus:outline-none focus:ring-1 focus:ring-brand"
                  />
                </div>
              </FormField>

              <FormField label="Date" required>
                <input
                  type="date"
                  name="expense_date"
                  defaultValue={today}
                  required
                  className="w-full rounded-lg border border-surface-2/50 bg-surface-1 px-3 py-2 text-sm text-zinc-200 focus:outline-none focus:ring-1 focus:ring-brand"
                />
              </FormField>
            </div>

            <div className="grid gap-5 sm:grid-cols-2">
              <FormField label="Category" required>
                <select
                  name="category"
                  required
                  className="w-full rounded-lg border border-surface-2/50 bg-surface-1 px-3 py-2 text-sm text-zinc-200 focus:outline-none focus:ring-1 focus:ring-brand"
                >
                  <option value="">Select category…</option>
                  {CATEGORIES.map((c) => (
                    <option key={c} value={c}>
                      {c.replace("_", " ")}
                    </option>
                  ))}
                </select>
              </FormField>

              <FormField label="Vendor / Source" required>
                <input
                  type="text"
                  name="vendor"
                  required
                  placeholder="e.g. Vercel, AWS, Fiverr"
                  className="w-full rounded-lg border border-surface-2/50 bg-surface-1 px-3 py-2 text-sm text-zinc-200 placeholder-zinc-600 focus:outline-none focus:ring-1 focus:ring-brand"
                />
              </FormField>
            </div>

            <FormField label="Venture" hint="Optional — leave blank for shared expenses">
              <select
                name="venture_id"
                className="w-full rounded-lg border border-surface-2/50 bg-surface-1 px-3 py-2 text-sm text-zinc-200 focus:outline-none focus:ring-1 focus:ring-brand"
              >
                <option value="">No specific venture</option>
                {ventures.map((v) => (
                  <option key={v.id} value={v.id}>
                    {v.name}
                  </option>
                ))}
              </select>
            </FormField>

            <FormField label="Description">
              <textarea
                name="description"
                rows={2}
                placeholder="Optional notes…"
                className="w-full resize-none rounded-lg border border-surface-2/50 bg-surface-1 px-3 py-2 text-sm text-zinc-200 placeholder-zinc-600 focus:outline-none focus:ring-1 focus:ring-brand"
              />
            </FormField>

            <FormField label="Receipt" hint="JPEG, PNG, WebP, or PDF — max 10 MB">
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
                className="h-4 w-4 rounded border-surface-2 bg-surface-1 accent-brand"
              />
              <label htmlFor="is_recurring" className="text-sm text-zinc-400">
                Recurring expense
              </label>
            </div>

            <div className="flex items-center gap-3 pt-2">
              <Button type="submit" disabled={busy}>
                {busy ? "Saving…" : "Add Expense"}
              </Button>
              <Link to="/dashboard/expenses">
                <Button type="button" variant="secondary">Cancel</Button>
              </Link>
            </div>
          </Form>
        </div>
      </main>
    </div>
  );
}
