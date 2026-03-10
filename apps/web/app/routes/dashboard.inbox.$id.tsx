import { useState, useEffect } from "react";
import type { ActionFunctionArgs, LoaderFunctionArgs, MetaFunction } from "react-router";
import { useLoaderData, Link, useFetcher, useNavigate } from "react-router";
import { ArrowLeft, Star, Reply, Wand2, Archive, Trash2, Clock } from "lucide-react";
import { getSupabaseClient } from "~/lib/supabase.server";
import { SnoozePicker } from "~/components/inbox/SnoozePicker";

export const meta: MetaFunction<typeof loader> = ({ data }) => [
  { title: `${data?.email?.subject ?? "Email"} — Inbox — Sheetz Labs OS` },
];

export async function loader({ params, context }: LoaderFunctionArgs) {
  const { id } = params;
  const env = context.cloudflare.env;
  const supabase = getSupabaseClient(env);

  const { data: email } = await supabase
    .from("emails")
    .select("*, email_accounts(email), relationships(id, name, company)")
    .eq("id", id!)
    .single();

  if (!email) throw new Response("Not found", { status: 404 });

  let thread: unknown[] = [];
  if (email.thread_id) {
    const { data } = await supabase
      .from("emails")
      .select("id, subject, from_email, from_name, snippet, received_at")
      .eq("thread_id", email.thread_id)
      .order("received_at");
    thread = data ?? [];
  }

  // Mark as read
  if (!email.is_read) {
    await supabase.from("emails").update({ is_read: true }).eq("id", id!);
  }

  return { email, thread };
}

export async function action({ request, params, context }: ActionFunctionArgs) {
  const { id } = params;
  const env = context.cloudflare.env;
  const supabase = getSupabaseClient(env);
  const formData = await request.formData();
  const intent = formData.get("intent") as string;

  switch (intent) {
    case "archive":
      await supabase
        .from("emails")
        .update({ is_archived: true, folder: "ARCHIVE" })
        .eq("id", id!);
      return Response.json({ success: true, action: "archived" });

    case "trash":
      await supabase
        .from("emails")
        .update({ is_trashed: true, folder: "TRASH" })
        .eq("id", id!);
      return Response.json({ success: true, action: "trashed" });

    default:
      return Response.json({ error: "Unknown intent" }, { status: 400 });
  }
}

function forceEmailDarkMode(html: string): string {
  return html
    .replace(/color:\s*black/gi, "color: #e4e4e7")
    .replace(/color:\s*#000000/gi, "color: #e4e4e7")
    .replace(/color:\s*#000(?![0-9a-f])/gi, "color: #e4e4e7")
    .replace(/color:\s*rgb\(\s*0\s*,\s*0\s*,\s*0\s*\)/gi, "color: rgb(228, 228, 231)");
}

export default function EmailDetail() {
  const { email, thread } = useLoaderData<typeof loader>();
  const starFetcher = useFetcher();
  const actionFetcher = useFetcher();
  const aiFetcher = useFetcher();
  const navigate = useNavigate();
  const [snoozeOpen, setSnoozeOpen] = useState(false);

  const rel = email.relationships as { id: string; name: string; company: string | null } | null;
  const isStarred =
    starFetcher.formData
      ? starFetcher.formData.get("is_starred") === "true"
      : email.is_starred;

  // Navigate to inbox after archive/trash completes
  useEffect(() => {
    if (actionFetcher.state === "idle" && actionFetcher.data) {
      const data = actionFetcher.data as { success?: boolean; action?: string };
      if (data.success && (data.action === "archived" || data.action === "trashed")) {
        navigate("/dashboard/inbox");
      }
    }
  }, [actionFetcher.state, actionFetcher.data, navigate]);

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
          <actionFetcher.Form method="post">
            <input type="hidden" name="intent" value="archive" />
            <button
              type="submit"
              disabled={isActioning}
              className="p-1.5 text-zinc-500 transition-colors hover:text-zinc-200 hover:bg-zinc-800 rounded disabled:opacity-50"
              title="Archive"
            >
              <Archive className="h-4 w-4" />
            </button>
          </actionFetcher.Form>

          {/* Trash */}
          <actionFetcher.Form method="post">
            <input type="hidden" name="intent" value="trash" />
            <button
              type="submit"
              disabled={isActioning}
              className="p-1.5 text-zinc-500 transition-colors hover:text-red-400 hover:bg-zinc-800 rounded disabled:opacity-50"
              title="Delete"
            >
              <Trash2 className="h-4 w-4" />
            </button>
          </actionFetcher.Form>

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
            to={`/dashboard/inbox/compose?reply_to=${email.id}`}
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
            <div className="email-body text-zinc-200 text-sm leading-relaxed">
              <style>{`
                .email-body, .email-body * { color: #e4e4e7 !important; background: transparent !important; }
                .email-body a { color: #34d399 !important; }
                .email-body blockquote { border-left: 2px solid #3f3f46 !important; padding-left: 0.75rem; color: #a1a1aa !important; }
                .email-body img { max-width: 100%; height: auto; }
              `}</style>
              <div
                dangerouslySetInnerHTML={{ __html: forceEmailDarkMode(bodyHtml) }}
              />
            </div>
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
              <Link to="/dashboard/inbox/compose" className="text-brand hover:text-brand-light">
                View drafts
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
    </div>
  );
}
