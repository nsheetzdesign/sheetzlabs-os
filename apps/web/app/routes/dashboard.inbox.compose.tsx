import type { LoaderFunctionArgs, MetaFunction } from "react-router";
import { useLoaderData, useNavigate, Link } from "react-router";
import { useState } from "react";
import { ArrowLeft, Send } from "lucide-react";
import { getSupabaseClient } from "~/lib/supabase.server";

export const meta: MetaFunction = () => [{ title: "Compose — Inbox — Sheetz Labs OS" }];

export async function loader({ request, context }: LoaderFunctionArgs) {
  const env = context.cloudflare.env;
  const supabase = getSupabaseClient(env);
  const url = new URL(request.url);
  const replyToId = url.searchParams.get("reply_to");

  const { data: accounts } = await supabase
    .from("email_accounts")
    .select("id, email")
    .order("email");

  let replyTo: {
    id: string;
    from_email: string | null;
    from_name: string | null;
    subject: string | null;
  } | null = null;

  if (replyToId) {
    const { data } = await supabase
      .from("emails")
      .select("id, from_email, from_name, subject")
      .eq("id", replyToId)
      .single();
    replyTo = data ?? null;
  }

  const { data: aliases } = await supabase
    .from("email_aliases")
    .select("id, account_id, email, name")
    .order("email");

  const { data: drafts } = await supabase
    .from("email_drafts")
    .select("id, to_emails, subject, created_at")
    .eq("status", "draft")
    .order("created_at", { ascending: false });

  return { accounts: accounts ?? [], aliases: aliases ?? [], replyTo, drafts: drafts ?? [] };
}

export default function ComposeEmail() {
  const { accounts, aliases, replyTo, drafts } = useLoaderData<typeof loader>();
  const navigate = useNavigate();
  const [status, setStatus] = useState<"idle" | "sending" | "sent" | "error">("idle");

  // Build a flat list of "from" options: each account + its aliases
  const fromOptions = [
    ...accounts.map((a) => ({ value: `account:${a.id}`, label: a.email, account_id: a.id, from_email: a.email })),
    ...aliases.map((a) => ({ value: `alias:${a.id}`, label: a.name ? `${a.name} <${a.email}>` : a.email, account_id: a.account_id, from_email: a.email })),
  ];
  const defaultFrom = fromOptions[0];

  const [draft, setDraft] = useState({
    account_id: defaultFrom?.account_id ?? "",
    from_email: defaultFrom?.from_email ?? "",
    to_emails: replyTo?.from_email ? [replyTo.from_email] : ([] as string[]),
    cc_emails: [] as string[],
    subject: replyTo?.subject ? `Re: ${replyTo.subject}` : "",
    body_text: "",
    reply_to_email_id: replyTo?.id ?? null,
  });

  const handleFromChange = (val: string) => {
    const opt = fromOptions.find((o) => o.value === val);
    if (opt) setDraft((d) => ({ ...d, account_id: opt.account_id, from_email: opt.from_email }));
  };

  const apiUrl = "https://api.sheetzlabs.com";

  const handleSend = async () => {
    if (!draft.to_emails.length || !draft.subject) return;
    setStatus("sending");

    try {
      // Create draft
      const createRes = await fetch(`${apiUrl}/email/drafts`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(draft),
      });
      if (!createRes.ok) throw new Error("Failed to create draft");
      const { draft: created } = (await createRes.json()) as { draft: { id: string } };

      // Send
      const sendRes = await fetch(`${apiUrl}/email/drafts/${created.id}/send`, {
        method: "POST",
      });
      if (!sendRes.ok) throw new Error("Failed to send");

      setStatus("sent");
      setTimeout(() => navigate("/dashboard/inbox"), 1000);
    } catch {
      setStatus("error");
    }
  };

  const handleSaveDraft = async () => {
    await fetch(`${apiUrl}/email/drafts`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(draft),
    });
    navigate("/dashboard/inbox");
  };

  return (
    <div className="flex flex-1 flex-col">
      <div className="flex items-center gap-3 border-b border-surface-2/50 px-6 py-3">
        <Link
          to="/dashboard/inbox"
          className="flex items-center gap-1.5 text-sm text-zinc-500 transition-colors hover:text-zinc-300"
        >
          <ArrowLeft className="h-4 w-4" />
          Inbox
        </Link>
        <h1 className="text-sm font-semibold text-zinc-200">
          {replyTo ? "Reply" : "New Message"}
        </h1>
      </div>

      <div className="mx-auto w-full max-w-3xl flex-1 overflow-auto p-6">
        <div className="space-y-4">
          {/* From */}
          {fromOptions.length > 0 && (
            <div className="flex items-center gap-3">
              <label className="w-16 shrink-0 text-sm text-zinc-500">From</label>
              <select
                value={fromOptions.find((o) => o.from_email === draft.from_email)?.value ?? fromOptions[0]?.value}
                onChange={(e) => handleFromChange(e.target.value)}
                className="flex-1 rounded-lg border border-surface-2/50 bg-surface-1 px-3 py-2 text-sm text-zinc-200 focus:outline-none focus:ring-1 focus:ring-brand"
              >
                {fromOptions.map((opt) => (
                  <option key={opt.value} value={opt.value}>
                    {opt.label}
                  </option>
                ))}
              </select>
            </div>
          )}

          {/* To */}
          <div className="flex items-center gap-3">
            <label className="w-16 shrink-0 text-sm text-zinc-500">To</label>
            <input
              type="text"
              value={draft.to_emails.join(", ")}
              onChange={(e) =>
                setDraft({
                  ...draft,
                  to_emails: e.target.value
                    .split(",")
                    .map((s) => s.trim())
                    .filter(Boolean),
                })
              }
              placeholder="recipient@example.com"
              className="flex-1 rounded-lg border border-surface-2/50 bg-surface-1 px-3 py-2 text-sm text-zinc-200 placeholder-zinc-600 focus:outline-none focus:ring-1 focus:ring-brand"
            />
          </div>

          {/* Cc */}
          <div className="flex items-center gap-3">
            <label className="w-16 shrink-0 text-sm text-zinc-500">Cc</label>
            <input
              type="text"
              value={draft.cc_emails.join(", ")}
              onChange={(e) =>
                setDraft({
                  ...draft,
                  cc_emails: e.target.value
                    .split(",")
                    .map((s) => s.trim())
                    .filter(Boolean),
                })
              }
              placeholder="optional"
              className="flex-1 rounded-lg border border-surface-2/50 bg-surface-1 px-3 py-2 text-sm text-zinc-200 placeholder-zinc-600 focus:outline-none focus:ring-1 focus:ring-brand"
            />
          </div>

          {/* Subject */}
          <div className="flex items-center gap-3">
            <label className="w-16 shrink-0 text-sm text-zinc-500">Subject</label>
            <input
              type="text"
              value={draft.subject}
              onChange={(e) => setDraft({ ...draft, subject: e.target.value })}
              placeholder="Subject"
              className="flex-1 rounded-lg border border-surface-2/50 bg-surface-1 px-3 py-2 text-sm text-zinc-200 placeholder-zinc-600 focus:outline-none focus:ring-1 focus:ring-brand"
            />
          </div>

          {/* Body */}
          <div className="rounded-lg border border-surface-2/50 bg-surface-1/20">
            <textarea
              value={draft.body_text}
              onChange={(e) => setDraft({ ...draft, body_text: e.target.value })}
              rows={16}
              placeholder="Write your message..."
              className="w-full resize-none rounded-lg bg-transparent p-4 text-sm text-zinc-200 placeholder-zinc-600 focus:outline-none"
            />
          </div>

          {/* Actions */}
          <div className="flex items-center gap-3">
            <button
              onClick={handleSend}
              disabled={status === "sending" || !draft.to_emails.length}
              className="flex items-center gap-2 rounded-lg bg-brand px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-brand-dark disabled:opacity-50"
            >
              <Send className="h-4 w-4" />
              {status === "sending" ? "Sending..." : status === "sent" ? "Sent!" : "Send"}
            </button>
            <button
              onClick={handleSaveDraft}
              className="rounded-lg border border-surface-2/50 px-4 py-2 text-sm text-zinc-400 transition-colors hover:border-surface-3 hover:text-zinc-200"
            >
              Save Draft
            </button>
            <Link
              to="/dashboard/inbox"
              className="text-sm text-zinc-600 transition-colors hover:text-zinc-400"
            >
              Cancel
            </Link>
            {status === "error" && (
              <span className="text-sm text-red-400">Failed to send. Try again.</span>
            )}
          </div>

          {/* Saved drafts */}
          {drafts.length > 0 && (
            <div className="mt-6 border-t border-surface-2/50 pt-6">
              <h2 className="mb-3 text-sm font-medium text-zinc-500">
                Saved Drafts ({drafts.length})
              </h2>
              <div className="space-y-2">
                {drafts.map((d) => (
                  <div
                    key={d.id}
                    className="flex items-center justify-between rounded-lg border border-surface-2/50 bg-surface-1/20 px-4 py-3"
                  >
                    <div>
                      <div className="text-sm text-zinc-300">{d.subject ?? "(no subject)"}</div>
                      <div className="text-xs text-zinc-600">
                        To: {(d.to_emails ?? []).join(", ") || "—"}
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <button
                        onClick={() => {
                          setDraft((prev) => ({
                            ...prev,
                            to_emails: d.to_emails ?? [],
                            subject: d.subject ?? "",
                          }));
                        }}
                        className="text-xs text-brand hover:text-brand-light"
                      >
                        Load
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
