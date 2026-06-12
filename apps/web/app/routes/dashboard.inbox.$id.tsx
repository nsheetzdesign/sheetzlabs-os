import { useState, useEffect, useRef } from "react";
import type { ActionFunctionArgs, LoaderFunctionArgs, MetaFunction } from "react-router";
import { useLoaderData, Link, useFetcher, useNavigate } from "react-router";
import { ArrowLeft, Star, Reply, Wand2, Archive, Trash2, Clock } from "lucide-react";
import { getSupabaseClient } from "~/lib/supabase.server";
import { apiFetch } from "~/lib/api";
import { EmailHtmlFrame } from "~/components/inbox/EmailHtmlFrame";
import { SnoozePicker } from "~/components/inbox/SnoozePicker";
import { useToasts, ToastContainer } from "~/components/ui/Toast";
import { useEmailKeyboardShortcuts } from "~/hooks/useEmailKeyboardShortcuts";

export const meta: MetaFunction<typeof loader> = ({ data }) => [
  { title: `${data?.email?.subject ?? "Email"} — Inbox — Sheetz Labs OS` },
];

export async function loader({ params, request, context }: LoaderFunctionArgs) {
  const { id } = params;
  const env = context.cloudflare.env;
  const supabase = getSupabaseClient(env);

  const { data: email } = await supabase
    .from("emails")
    .select("*, email_accounts(email), relationships(id, name, company)")
    .eq("id", id!)
    .eq("is_deleted", false)
    .single();

  if (!email) throw new Response("Not found", { status: 404 });

  let thread: unknown[] = [];
  if (email.thread_id) {
    const { data } = await supabase
      .from("emails")
      .select("id, subject, from_email, from_name, snippet, received_at")
      .eq("thread_id", email.thread_id)
      .eq("is_deleted", false)
      .order("received_at");
    thread = data ?? [];
  }

  // Mark as read — via the API so it writes back to Gmail (ES-1), not Supabase only.
  if (!email.is_read) {
    await apiFetch(request, env, `/email/messages/${id}/read`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ is_read: true }),
    }).catch((err) => console.error("[inbox] mark-read failed", err));
  }

  return { email, thread };
}

export async function action({ request, params, context }: ActionFunctionArgs) {
  const { id } = params;
  const env = context.cloudflare.env;
  const formData = await request.formData();
  const intent = formData.get("intent") as string;

  if (intent !== "archive" && intent !== "trash") {
    return Response.json({ error: "Unknown intent" }, { status: 400 });
  }

  // Route through the API bulk endpoint so the action reaches Gmail (ES-1).
  const res = await apiFetch(request, env, "/email/bulk", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ action: intent, email_ids: [id] }),
  });

  if (!res.ok) {
    const err = await res.json().catch(() => ({ error: "Action failed" }));
    return Response.json(err, { status: res.status });
  }
  return Response.json({ success: true, action: intent === "archive" ? "archived" : "trashed" });
}


export default function EmailDetail() {
  const { email, thread } = useLoaderData<typeof loader>();
  const starFetcher = useFetcher();
  const actionFetcher = useFetcher();
  const undoFetcher = useFetcher();
  const aiFetcher = useFetcher();
  const navigate = useNavigate();
  const [snoozeOpen, setSnoozeOpen] = useState(false);
  const { toasts, push: pushToast, dismiss: dismissToast } = useToasts();
  // Optimistic action state: once set, the message is treated as gone and we
  // hand the user an Undo window before navigating back to the inbox.
  const [actioned, setActioned] = useState(false);
  const navTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const rel = email.relationships as { id: string; name: string; company: string | null } | null;
  const isStarred =
    starFetcher.formData
      ? starFetcher.formData.get("is_starred") === "true"
      : email.is_starred;

  // Optimistic archive/trash with toast + undo, mirroring the list (Part 0.2).
  // The action fires immediately; an Undo toast replays the inverse through the
  // write-back-aware /email/undo before we leave the page.
  function doUndo(intent: "archive" | "trash") {
    if (navTimer.current) clearTimeout(navTimer.current);
    setActioned(false);
    const fd = new FormData();
    fd.set("action", intent);
    fd.set("email_ids", JSON.stringify([email.id]));
    undoFetcher.submit(fd, { method: "post", action: "/dashboard/inbox/undo" });
  }
  function doAction(intent: "archive" | "trash") {
    if (actioned) return;
    setActioned(true);
    const fd = new FormData();
    fd.set("intent", intent);
    actionFetcher.submit(fd, { method: "post" });
    pushToast({
      message: intent === "archive" ? "Archived" : "Trashed",
      actionLabel: "Undo",
      duration: 6000,
      onAction: () => doUndo(intent),
    });
    navTimer.current = setTimeout(() => navigate("/dashboard/inbox"), 6000);
  }
  useEffect(() => () => { if (navTimer.current) clearTimeout(navTimer.current); }, []);

  // Keyboard shortcuts on the detail route (Part 0.2) — single-message context.
  useEmailKeyboardShortcuts({
    emails: [{ id: email.id, is_starred: !!email.is_starred }],
    focusIndex: 0,
    setFocusIndex: () => {},
    activeEmail: { id: email.id },
    onOpenFocused: () => {},
    onClose: () => navigate("/dashboard/inbox"),
    onBulkAction: (action) => {
      if (action === "archive") doAction("archive");
      else if (action === "trash") doAction("trash");
    },
    onToggleSelect: () => {},
    onCompose: () => navigate("/dashboard/inbox?compose=1"),
    onReply: () => navigate(`/dashboard/inbox?reply=${email.id}`),
    onReplyAll: () => navigate(`/dashboard/inbox?reply=${email.id}`),
    onForward: () => navigate(`/dashboard/inbox?reply=${email.id}`),
    onSearch: () => navigate("/dashboard/inbox"),
    onShowHelp: () => {},
    onUndo: () => { if (actioned) doUndo("archive"); },
    enabled: !snoozeOpen,
  });

  const isActioning = actionFetcher.state !== "idle";

  const bodyHtml = email.body_html as string | null;
  const bodyText = email.body_text as string | null;

  return (
    <div className="flex flex-1 flex-col">
      {/* Toolbar */}
      <div className="flex items-center gap-3 border-b border-surface-2/50 px-6 py-3">
        <Link
          to="/dashboard/inbox"
          className="flex items-center gap-1.5 text-sm text-zinc-500 transition-colors hover:text-zinc-300"
        >
          <ArrowLeft className="h-4 w-4" />
          Inbox
        </Link>
        <div className="ml-auto flex items-center gap-2">
          {/* Archive */}
          <button
            type="button"
            onClick={() => doAction("archive")}
            disabled={isActioning || actioned}
            className="p-1.5 text-zinc-500 transition-colors hover:text-zinc-200 hover:bg-zinc-800 rounded disabled:opacity-50"
            title="Archive (e)"
            aria-label="Archive"
          >
            <Archive className="h-4 w-4" />
          </button>

          {/* Trash */}
          <button
            type="button"
            onClick={() => doAction("trash")}
            disabled={isActioning || actioned}
            className="p-1.5 text-zinc-500 transition-colors hover:text-red-400 hover:bg-zinc-800 rounded disabled:opacity-50"
            title="Delete (#)"
            aria-label="Delete"
          >
            <Trash2 className="h-4 w-4" />
          </button>

          {/* Snooze */}
          <div className="relative">
            <button
              onClick={() => setSnoozeOpen(!snoozeOpen)}
              className="p-1.5 text-zinc-500 transition-colors hover:text-zinc-200 hover:bg-zinc-800 rounded"
              title="Snooze"
            >
              <Clock className="h-4 w-4" />
            </button>
            <SnoozePicker
              emailId={email.id}
              isOpen={snoozeOpen}
              onClose={() => setSnoozeOpen(false)}
              onSuccess={() => navigate("/dashboard/inbox")}
            />
          </div>

          <div className="w-px h-5 bg-zinc-800" />

          <starFetcher.Form method="patch" action={`/dashboard/inbox/${email.id}/star`}>
            <input type="hidden" name="is_starred" value={isStarred ? "false" : "true"} />
            <button
              type="submit"
              className={`p-1.5 transition-colors hover:text-amber-400 ${
                isStarred ? "text-amber-400" : "text-zinc-600"
              }`}
            >
              <Star className={`h-4 w-4 ${isStarred ? "fill-current" : ""}`} />
            </button>
          </starFetcher.Form>
          <Link
            to={`/dashboard/inbox?reply=${email.id}`}
            className="flex items-center gap-1.5 rounded-lg border border-surface-2/50 px-3 py-1.5 text-sm text-zinc-400 transition-colors hover:border-surface-3 hover:text-zinc-200"
          >
            <Reply className="h-4 w-4" />
            Reply
          </Link>
          <aiFetcher.Form method="post" action="/dashboard/inbox/draft-ai">
            <input type="hidden" name="email_type" value="response" />
            <input type="hidden" name="recipient_email" value={email.from_email ?? ""} />
            <input type="hidden" name="recipient_name" value={email.from_name ?? ""} />
            <input type="hidden" name="context" value={email.subject ?? ""} />
            <input type="hidden" name="goal" value="respond helpfully" />
            <button
              type="submit"
              disabled={aiFetcher.state === "submitting"}
              className="flex items-center gap-1.5 rounded-lg bg-brand px-3 py-1.5 text-sm font-medium text-white transition-colors hover:bg-brand-dark disabled:opacity-50"
            >
              <Wand2 className="h-4 w-4" />
              {aiFetcher.state === "submitting" ? "Drafting..." : "Draft with AI"}
            </button>
          </aiFetcher.Form>
        </div>
      </div>

      <div className="mx-auto w-full max-w-3xl flex-1 overflow-auto p-6">
        {/* Header */}
        <div className="mb-6">
          <h1 className="mb-3 text-xl font-semibold">
            {email.subject ?? "(no subject)"}
          </h1>
          <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-sm text-zinc-500">
            <span>
              <span className="text-zinc-400">{email.from_name}</span>
              {email.from_name && email.from_email && " "}
              {email.from_email && <span className="text-zinc-600">&lt;{email.from_email}&gt;</span>}
            </span>
            {email.received_at && (
              <span>{new Date(email.received_at).toLocaleString()}</span>
            )}
          </div>
          {rel && (
            <Link
              to={`/dashboard/relationships/${rel.id}`}
              className="mt-2 inline-flex items-center gap-1 text-sm text-brand transition-colors hover:text-brand-light"
            >
              Relationship: {rel.name}
              {rel.company && ` · ${rel.company}`}
            </Link>
          )}
        </div>

        {/* AI summary */}
        {email.ai_summary && (
          <div className="mb-6 rounded-lg border border-surface-2/50 bg-surface-1/40 p-4">
            <div className="mb-1 text-xs font-medium uppercase tracking-wide text-zinc-600">
              AI Summary
            </div>
            <p className="text-sm text-zinc-300">{email.ai_summary}</p>
          </div>
        )}

        {/* Body */}
        <div className="rounded-lg border border-surface-2/50 bg-surface-1/20 p-6">
          {bodyHtml ? (
            <EmailHtmlFrame html={bodyHtml} />
          ) : (
            <pre className="whitespace-pre-wrap font-sans text-sm leading-relaxed text-zinc-300">
              {bodyText || email.snippet || "(empty)"}
            </pre>
          )}
        </div>

        {/* AI draft result */}
        {aiFetcher.data && (
          <div className="mt-4 rounded-lg border border-brand/30 bg-brand/5 p-4">
            <div className="mb-2 text-xs font-medium uppercase tracking-wide text-brand">
              Draft Created
            </div>
            <p className="text-sm text-zinc-400">
              AI draft saved.{" "}
              <Link to={`/dashboard/inbox?reply=${email.id}`} className="text-brand hover:text-brand-light">
                Open reply
              </Link>
            </p>
          </div>
        )}

        {/* Thread */}
        {(thread as unknown[]).length > 1 && (
          <div className="mt-8">
            <h2 className="mb-4 text-sm font-medium text-zinc-500">
              Thread ({(thread as unknown[]).length} messages)
            </h2>
            <div className="space-y-3">
              {(thread as Array<{
                id: string;
                from_name: string | null;
                from_email: string | null;
                received_at: string | null;
                snippet: string | null;
              }>).map((msg) => (
                <Link
                  key={msg.id}
                  to={`/dashboard/inbox/${msg.id}`}
                  className={`block rounded-lg border p-4 transition-colors hover:border-surface-3 ${
                    msg.id === email.id
                      ? "border-surface-3 bg-surface-2/30"
                      : "border-surface-2/50 bg-surface-1/20 hover:bg-surface-1/40"
                  }`}
                >
                  <div className="mb-1 text-sm text-zinc-400">
                    {msg.from_name || msg.from_email}
                    {msg.received_at && (
                      <span className="ml-2 text-xs text-zinc-600">
                        · {new Date(msg.received_at).toLocaleString()}
                      </span>
                    )}
                  </div>
                  <div className="truncate text-xs text-zinc-600">{msg.snippet}</div>
                </Link>
              ))}
            </div>
          </div>
        )}
      </div>
      <ToastContainer toasts={toasts} onDismiss={dismissToast} />
    </div>
  );
}
