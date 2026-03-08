import type { ActionFunctionArgs, LoaderFunctionArgs } from "react-router";
import { Form, useLoaderData, data } from "react-router";
import { getSupabaseClient } from "~/lib/supabase.server";
import { Button } from "~/components/ui/Button";
import { Input } from "~/components/ui/Input";
import { Select } from "~/components/ui/Select";
import { FormField } from "~/components/ui/FormField";

const STATUS_COLOR: Record<string, string> = {
  open: "text-blue-400 border-blue-500/30 bg-blue-500/10",
  "in-progress": "text-amber-400 border-amber-500/30 bg-amber-500/10",
  resolved: "text-green-400 border-green-500/30 bg-green-500/10",
  closed: "text-zinc-500 border-zinc-600/30 bg-zinc-600/10",
};

const PRIORITY_COLOR: Record<string, string> = {
  urgent: "text-red-400",
  high: "text-orange-400",
  medium: "text-amber-400",
  low: "text-zinc-500",
};

const TYPE_ICON: Record<string, string> = {
  bug: "🐛",
  feature: "✨",
  support: "💬",
};

export async function loader({ request, params, context }: LoaderFunctionArgs) {
  const supabase = getSupabaseClient(context.cloudflare.env);
  const url = new URL(request.url);
  const filterStatus = url.searchParams.get("status") || "";
  const filterType = url.searchParams.get("type") || "";

  const { data: v } = await supabase
    .from("ventures")
    .select("id")
    .eq("slug", params.slug!)
    .single();
  if (!v) throw new Response("Not found", { status: 404 });

  let q = supabase
    .from("tickets")
    .select("*, tasks(id, title, status), milestones(id, title, status)")
    .eq("venture_id", v.id)
    .order("created_at", { ascending: false });

  if (filterStatus) q = q.eq("status", filterStatus);
  if (filterType) q = q.eq("type", filterType);

  const { data: tickets } = await q;

  const { data: milestones } = await supabase
    .from("milestones")
    .select("id, title")
    .eq("venture_id", v.id)
    .order("sort_order");

  return {
    ventureId: v.id,
    tickets: tickets ?? [],
    milestones: milestones ?? [],
    filterStatus,
    filterType,
  };
}

export async function action({ request, params, context }: ActionFunctionArgs) {
  const supabase = getSupabaseClient(context.cloudflare.env);
  const fd = await request.formData();
  const intent = fd.get("intent") as string;

  const { data: v } = await supabase
    .from("ventures")
    .select("id")
    .eq("slug", params.slug!)
    .single();
  if (!v) throw new Response("Not found", { status: 404 });

  if (intent === "add-manual") {
    const title = (fd.get("title") as string)?.trim();
    const description = (fd.get("description") as string)?.trim() || null;
    const type = (fd.get("type") as string) || "feature";
    const priority = (fd.get("priority") as string) || "medium";
    const submitterEmail = (fd.get("submitter_email") as string)?.trim() || null;

    if (!title) return data({ error: "Title required" }, { status: 400 });

    const { error } = await supabase.from("tickets").insert({
      venture_id: v.id,
      source: "manual",
      type,
      title,
      description,
      priority,
      status: "open",
      submitter_email: submitterEmail,
    });
    if (error) return data({ error: error.message }, { status: 500 });
    return { ok: true };
  }

  if (intent === "convert-to-task") {
    const ticketId = fd.get("ticket_id") as string;
    const { data: ticket } = await supabase
      .from("tickets")
      .select("*")
      .eq("id", ticketId)
      .single();
    if (!ticket) return data({ error: "Ticket not found" }, { status: 404 });

    const { data: newTask, error: taskErr } = await supabase
      .from("tasks")
      .insert({
        venture_id: v.id,
        title: `[${ticket.type?.toUpperCase()}] ${ticket.title}`,
        description: ticket.description,
        priority:
          (ticket.priority as "urgent" | "high" | "medium" | "low") ?? "medium",
        status: "backlog" as const,
      })
      .select("id")
      .single();

    if (taskErr) return data({ error: taskErr.message }, { status: 500 });

    await supabase
      .from("tickets")
      .update({ converted_task_id: newTask.id, status: "in-progress" })
      .eq("id", ticketId);

    return { ok: true };
  }

  if (intent === "add-to-roadmap") {
    const ticketId = fd.get("ticket_id") as string;
    const milestoneId = fd.get("milestone_id") as string | null;
    const { data: ticket } = await supabase
      .from("tickets")
      .select("*")
      .eq("id", ticketId)
      .single();
    if (!ticket) return data({ error: "Ticket not found" }, { status: 404 });

    let targetMilestoneId = milestoneId;

    if (!targetMilestoneId) {
      // Create a new milestone from this ticket
      const { data: newMs } = await supabase
        .from("milestones")
        .insert({
          venture_id: v.id,
          title: ticket.title,
          description: ticket.description,
          status: "planned",
        })
        .select("id")
        .single();
      targetMilestoneId = newMs?.id ?? null;
    }

    if (targetMilestoneId) {
      await supabase
        .from("tickets")
        .update({ converted_milestone_id: targetMilestoneId, status: "in-progress" })
        .eq("id", ticketId);
    }

    return { ok: true };
  }

  if (intent === "update-status") {
    const ticketId = fd.get("ticket_id") as string;
    const status = fd.get("status") as string;
    await supabase.from("tickets").update({ status }).eq("id", ticketId);
    return { ok: true };
  }

  if (intent === "delete") {
    await supabase.from("tickets").delete().eq("id", fd.get("id") as string);
    return { ok: true };
  }

  return { ok: true };
}

export default function VentureTickets() {
  const { tickets, milestones, filterStatus, filterType } = useLoaderData<typeof loader>();

  return (
    <div className="mx-auto max-w-3xl space-y-6">
      {/* Filters */}
      <div className="flex flex-wrap items-center gap-2">
        {["", "open", "in-progress", "resolved", "closed"].map((s) => (
          <a
            key={s}
            href={s ? `?status=${s}` : "?"}
            className={`rounded-full px-3 py-1 text-xs font-medium transition-colors border ${
              filterStatus === s
                ? "border-brand bg-brand/10 text-brand"
                : "border-surface-2/50 text-zinc-500 hover:text-zinc-300"
            }`}
          >
            {s || "All"}
          </a>
        ))}
        <span className="text-zinc-700">|</span>
        {["", "bug", "feature", "support"].map((t) => (
          <a
            key={t}
            href={t ? `?type=${t}` : "?"}
            className={`rounded-full px-3 py-1 text-xs font-medium transition-colors border ${
              filterType === t
                ? "border-brand bg-brand/10 text-brand"
                : "border-surface-2/50 text-zinc-500 hover:text-zinc-300"
            }`}
          >
            {t ? `${TYPE_ICON[t]} ${t}` : "All types"}
          </a>
        ))}
      </div>

      {/* Add manual ticket form */}
      <Form
        method="post"
        className="rounded-xl border border-surface-2/50 bg-surface-1/40 p-5 backdrop-blur-sm"
      >
        <input type="hidden" name="intent" value="add-manual" />
        <h2 className="mb-4 text-sm font-semibold text-zinc-300">Add Manual Ticket</h2>
        <div className="grid gap-4 sm:grid-cols-3">
          <div className="sm:col-span-2">
            <FormField label="Title" required>
              <Input name="title" placeholder="User reported login issue…" />
            </FormField>
          </div>
          <FormField label="Type">
            <Select name="type" defaultValue="feature">
              <option value="bug">🐛 Bug</option>
              <option value="feature">✨ Feature</option>
              <option value="support">💬 Support</option>
            </Select>
          </FormField>
        </div>
        <div className="mt-4 grid gap-4 sm:grid-cols-3">
          <FormField label="Priority">
            <Select name="priority" defaultValue="medium">
              <option value="urgent">🔴 Urgent</option>
              <option value="high">🟠 High</option>
              <option value="medium">🟡 Medium</option>
              <option value="low">⚪ Low</option>
            </Select>
          </FormField>
          <div className="sm:col-span-2">
            <FormField label="Submitter Email">
              <Input name="submitter_email" type="email" placeholder="user@example.com" />
            </FormField>
          </div>
        </div>
        <FormField label="Description" className="mt-4">
          <textarea
            name="description"
            rows={2}
            className="w-full rounded-lg border border-surface-2/50 bg-surface-1 px-3 py-2 text-sm text-zinc-200 placeholder-zinc-600 focus:outline-none focus:ring-1 focus:ring-brand"
            placeholder="Describe the issue or request…"
          />
        </FormField>
        <div className="mt-4 flex justify-end">
          <Button type="submit">Add Ticket</Button>
        </div>
      </Form>

      {/* Tickets list */}
      {tickets.length === 0 ? (
        <p className="py-8 text-center text-sm text-zinc-600">No tickets found.</p>
      ) : (
        <div className="space-y-3">
          {tickets.map((t) => {
            const isConverted = !!(t.converted_task_id || t.converted_milestone_id);
            return (
              <div
                key={t.id}
                className={`rounded-xl border bg-surface-1/40 p-4 ${isConverted ? "border-green-500/20 opacity-75" : "border-surface-2/50"}`}
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="flex-1 min-w-0">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="text-sm font-medium text-zinc-200">{t.title}</span>
                      <span className="text-xs text-zinc-600">
                        {TYPE_ICON[t.type] ?? "📋"} {t.type}
                      </span>
                      <span
                        className={`text-xs font-medium ${PRIORITY_COLOR[t.priority ?? "medium"]}`}
                      >
                        {t.priority}
                      </span>
                      <span
                        className={`rounded border px-1.5 py-0.5 text-xs font-medium ${STATUS_COLOR[t.status ?? "open"]}`}
                      >
                        {t.status}
                      </span>
                      {isConverted && (
                        <span className="rounded border border-green-500/30 bg-green-500/10 px-1.5 py-0.5 text-xs text-green-400">
                          ✓ Converted
                        </span>
                      )}
                    </div>
                    {t.description && (
                      <p className="mt-1 text-xs text-zinc-600 line-clamp-2">{t.description}</p>
                    )}
                    {t.submitter_email && (
                      <p className="mt-1 text-xs text-zinc-600">From: {t.submitter_email}</p>
                    )}
                    {t.source !== "manual" && (
                      <p className="mt-1 text-xs text-zinc-600">Source: {t.source}</p>
                    )}
                  </div>

                  {/* Actions */}
                  <div className="flex shrink-0 flex-col gap-1.5">
                    {!t.converted_task_id && (
                      <Form method="post">
                        <input type="hidden" name="intent" value="convert-to-task" />
                        <input type="hidden" name="ticket_id" value={t.id} />
                        <button
                          type="submit"
                          className="whitespace-nowrap rounded-lg border border-surface-2/50 bg-surface-1 px-2.5 py-1 text-xs text-zinc-400 hover:border-brand/40 hover:text-brand transition-colors"
                        >
                          → Task
                        </button>
                      </Form>
                    )}
                    {!t.converted_milestone_id && (
                      <Form method="post" className="flex items-center gap-1">
                        <input type="hidden" name="intent" value="add-to-roadmap" />
                        <input type="hidden" name="ticket_id" value={t.id} />
                        <select
                          name="milestone_id"
                          className="rounded border border-surface-2/50 bg-surface-1 px-1 py-0.5 text-xs text-zinc-500"
                        >
                          <option value="">New milestone</option>
                          {milestones.map((ms) => (
                            <option key={ms.id} value={ms.id}>{ms.title}</option>
                          ))}
                        </select>
                        <button
                          type="submit"
                          className="whitespace-nowrap rounded-lg border border-surface-2/50 bg-surface-1 px-2.5 py-1 text-xs text-zinc-400 hover:border-amber-400/40 hover:text-amber-400 transition-colors"
                        >
                          → Roadmap
                        </button>
                      </Form>
                    )}
                    <Form method="post">
                      <input type="hidden" name="intent" value="delete" />
                      <input type="hidden" name="id" value={t.id} />
                      <button
                        type="submit"
                        className="text-zinc-600 hover:text-red-400 transition-colors text-xs"
                      >
                        ✕
                      </button>
                    </Form>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
