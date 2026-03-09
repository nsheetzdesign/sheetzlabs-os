import type { LoaderFunctionArgs, MetaFunction } from "react-router";
import { useLoaderData, Link } from "react-router";
import { useState } from "react";
import { Inbox, PenSquare, RefreshCw, Star, Plus, X } from "lucide-react";
import { Header } from "~/components/dashboard/Header";
import { getSupabaseClient } from "~/lib/supabase.server";
import { EmptyState } from "~/components/ui/EmptyState";

export const meta: MetaFunction = () => [{ title: "Inbox — Sheetz Labs OS" }];

const CATEGORIES = [
  { id: "all", label: "All" },
  { id: "action_required", label: "Action Required", color: "text-red-400" },
  { id: "fyi", label: "FYI", color: "text-blue-400" },
  { id: "newsletter", label: "Newsletters", color: "text-amber-400" },
  { id: "automated", label: "Automated", color: "text-zinc-400" },
];

function formatDate(dateStr: string | null): string {
  if (!dateStr) return "";
  const d = new Date(dateStr);
  const now = new Date();
  const isToday = d.toDateString() === now.toDateString();
  if (isToday) {
    return d.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
  }
  return d.toLocaleDateString([], { month: "short", day: "numeric" });
}

export async function loader({ request, context }: LoaderFunctionArgs) {
  const env = context.cloudflare.env;
  const supabase = getSupabaseClient(env);
  const url = new URL(request.url);
  const category = url.searchParams.get("category") ?? "all";
  const unreadOnly = url.searchParams.get("unread") === "true";

  let query = supabase
    .from("emails")
    .select("id, subject, snippet, from_email, from_name, is_read, is_starred, ai_category, ai_priority, received_at, email_accounts(email)")
    .order("received_at", { ascending: false })
    .limit(50);

  if (category !== "all") query = query.eq("ai_category", category);
  if (unreadOnly) query = query.eq("is_read", false);

  const { data: emails } = await query;

  const { data: accounts } = await supabase
    .from("email_accounts")
    .select("id, email, provider, sync_enabled, last_sync_at")
    .order("email");

  const { data: aliases } = await supabase
    .from("email_aliases")
    .select("id, account_id, email, name, source")
    .order("email");

  const unreadCount = (emails ?? []).filter((e) => !e.is_read).length;

  return { emails: emails ?? [], accounts: accounts ?? [], aliases: aliases ?? [], category, unreadOnly, unreadCount };
}

const API = "https://api.sheetzlabs.com";

export default function InboxIndex() {
  const { emails, accounts, aliases, category, unreadOnly, unreadCount } = useLoaderData<typeof loader>();
  const [addingAliasFor, setAddingAliasFor] = useState<string | null>(null);
  const [aliasEmail, setAliasEmail] = useState("");
  const [aliasName, setAliasName] = useState("");
  const [syncing, setSyncing] = useState<string | null>(null);

  const callApi = async (url: string, method = "POST") => {
    setSyncing(url);
    await fetch(url, { method });
    setSyncing(null);
    window.location.reload();
  };

  return (
    <div className="flex h-full flex-col">
      <Header title="Inbox" />
      <div className="flex flex-1 overflow-hidden">
        {/* Sidebar */}
        <aside className="flex w-64 flex-col border-r border-surface-2/50 p-4">
          <Link
            to="/dashboard/inbox/compose"
            className="mb-4 flex items-center justify-center gap-2 rounded-lg bg-brand px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-brand-dark"
          >
            <PenSquare className="h-4 w-4" />
            Compose
          </Link>

          {/* Filters */}
          <nav className="space-y-0.5">
            {CATEGORIES.map((cat) => (
              <Link
                key={cat.id}
                to={`/dashboard/inbox?category=${cat.id}${unreadOnly ? "&unread=true" : ""}`}
                className={`flex items-center justify-between rounded-lg px-3 py-2 text-sm transition-colors ${
                  category === cat.id
                    ? "bg-surface-2 text-zinc-100"
                    : "text-zinc-500 hover:bg-surface-1/50 hover:text-zinc-300"
                }`}
              >
                <span className={cat.color ?? ""}>{cat.label}</span>
                {cat.id === "all" && unreadCount > 0 && (
                  <span className="rounded-full bg-brand px-1.5 py-0.5 text-xs font-medium text-white">
                    {unreadCount}
                  </span>
                )}
              </Link>
            ))}
          </nav>

          <div className="mt-3 border-t border-surface-2/50 pt-3">
            <Link
              to={`/dashboard/inbox?category=${category}&unread=${!unreadOnly}`}
              className="block rounded-lg px-3 py-2 text-sm text-zinc-500 transition-colors hover:bg-surface-1/50 hover:text-zinc-300"
            >
              {unreadOnly ? "Show all" : "Unread only"}
            </Link>
          </div>

          {/* Accounts */}
          <div className="mt-4 border-t border-surface-2/50 pt-4">
            <h3 className="mb-2 px-3 text-xs font-medium uppercase tracking-wide text-zinc-600">
              Accounts
            </h3>
            {accounts.length === 0 ? (
              <a
                href="https://api.sheetzlabs.com/email/auth/gmail"
                className="flex items-center gap-2 rounded-lg px-3 py-2 text-sm text-brand transition-colors hover:text-brand-light"
              >
                + Connect Gmail
              </a>
            ) : (
              <div className="space-y-2">
                {accounts.map((account) => {
                  const accountAliases = aliases.filter((a) => a.account_id === account.id);
                  return (
                    <div key={account.id}>
                      <div className="flex items-center justify-between px-3 py-1">
                        <span className="truncate text-xs text-zinc-400">{account.email}</span>
                        <div className="flex items-center gap-1.5">
                          <button
                            onClick={() => callApi(`${API}/email/accounts/${account.id}/sync-aliases`)}
                            title="Sync aliases from Gmail"
                            className="text-zinc-600 hover:text-zinc-300"
                          >
                            <RefreshCw className={`h-3 w-3 ${syncing?.includes("sync-aliases") ? "animate-spin" : ""}`} />
                          </button>
                          <button
                            onClick={() => callApi(`${API}/email/accounts/${account.id}/sync`)}
                            title="Sync emails"
                            className="text-zinc-600 hover:text-zinc-300"
                          >
                            <RefreshCw className={`h-3 w-3 ${syncing?.includes("/sync") && !syncing.includes("aliases") ? "animate-spin" : ""}`} />
                          </button>
                        </div>
                      </div>
                      {/* Aliases for this account */}
                      {accountAliases.map((alias) => (
                        <div key={alias.id} className="flex items-center justify-between py-0.5 pl-6 pr-3">
                          <span className="truncate text-xs text-zinc-600">{alias.email}</span>
                          <button
                            onClick={() => callApi(`${API}/email/aliases/${alias.id}`, "DELETE")}
                            className="text-zinc-700 hover:text-red-400"
                          >
                            <X className="h-3 w-3" />
                          </button>
                        </div>
                      ))}
                      {/* Add alias */}
                      {addingAliasFor === account.id ? (
                        <div className="mt-1 space-y-1 px-3">
                          <input
                            type="text"
                            placeholder="Email address"
                            value={aliasEmail}
                            onChange={(e) => setAliasEmail(e.target.value)}
                            className="w-full rounded border border-surface-2/50 bg-surface-1 px-2 py-1 text-xs text-zinc-200 placeholder-zinc-600 focus:outline-none"
                          />
                          <input
                            type="text"
                            placeholder="Name (optional)"
                            value={aliasName}
                            onChange={(e) => setAliasName(e.target.value)}
                            className="w-full rounded border border-surface-2/50 bg-surface-1 px-2 py-1 text-xs text-zinc-200 placeholder-zinc-600 focus:outline-none"
                          />
                          <div className="flex gap-2">
                            <button
                              onClick={async () => {
                                if (!aliasEmail) return;
                                await fetch("https://api.sheetzlabs.com/email/aliases", {
                                  method: "POST",
                                  headers: { "Content-Type": "application/json" },
                                  body: JSON.stringify({ account_id: account.id, email: aliasEmail, name: aliasName || undefined }),
                                });
                                setAliasEmail("");
                                setAliasName("");
                                setAddingAliasFor(null);
                                window.location.reload();
                              }}
                              className="text-xs text-brand hover:text-brand-light"
                            >
                              Save
                            </button>
                            <button
                              onClick={() => { setAddingAliasFor(null); setAliasEmail(""); setAliasName(""); }}
                              className="text-xs text-zinc-600 hover:text-zinc-400"
                            >
                              Cancel
                            </button>
                          </div>
                        </div>
                      ) : (
                        <button
                          onClick={() => setAddingAliasFor(account.id)}
                          className="flex items-center gap-1 py-0.5 pl-6 text-xs text-zinc-700 hover:text-zinc-400"
                        >
                          <Plus className="h-3 w-3" />
                          Add alias
                        </button>
                      )}
                    </div>
                  );
                })}
                <a
                  href="https://api.sheetzlabs.com/email/auth/gmail"
                  className="flex items-center gap-1 px-3 py-1 text-xs text-zinc-600 hover:text-brand"
                >
                  <Plus className="h-3 w-3" />
                  Connect another account
                </a>
              </div>
            )}
          </div>
        </aside>

        {/* Email list */}
        <main className="flex-1 overflow-auto">
          {emails.length === 0 ? (
            <EmptyState
              icon={Inbox}
              title="No emails"
              description={
                accounts.length === 0
                  ? "Connect your Gmail account to sync emails."
                  : category !== "all"
                  ? `No ${category.replace("_", " ")} emails.`
                  : "Your inbox is empty."
              }
              action={
                accounts.length === 0 ? (
                  <a
                    href="https://api.sheetzlabs.com/email/auth/gmail"
                    className="inline-flex items-center gap-2 rounded-lg bg-brand px-4 py-2 text-sm font-medium text-white hover:bg-brand-dark"
                  >
                    Connect Gmail
                  </a>
                ) : undefined
              }
            />
          ) : (
            <div className="divide-y divide-surface-2/30">
              {emails.map((email) => (
                <Link
                  key={email.id}
                  to={`/dashboard/inbox/${email.id}`}
                  className={`flex items-start gap-3 px-6 py-4 transition-colors hover:bg-surface-1/30 ${
                    !email.is_read ? "bg-surface-1/20" : ""
                  }`}
                >
                  {/* Unread dot */}
                  <div className="mt-1.5 flex w-2 shrink-0 justify-center">
                    {!email.is_read && (
                      <span className="h-2 w-2 rounded-full bg-brand" />
                    )}
                  </div>

                  <div className="min-w-0 flex-1">
                    <div className="flex items-center justify-between gap-2">
                      <span
                        className={`text-sm font-medium ${
                          !email.is_read ? "text-zinc-100" : "text-zinc-400"
                        }`}
                      >
                        {email.from_name || email.from_email}
                      </span>
                      <div className="flex shrink-0 items-center gap-2">
                        {email.ai_priority === "high" && (
                          <span className="rounded border border-red-500/30 bg-red-500/10 px-1.5 py-0.5 text-xs text-red-400">
                            High
                          </span>
                        )}
                        {email.is_starred && (
                          <Star className="h-3.5 w-3.5 fill-amber-400 text-amber-400" />
                        )}
                        <span className="text-xs text-zinc-600">
                          {formatDate(email.received_at)}
                        </span>
                      </div>
                    </div>
                    <div
                      className={`mt-0.5 text-sm ${
                        !email.is_read ? "text-zinc-300" : "text-zinc-500"
                      }`}
                    >
                      {email.subject ?? "(no subject)"}
                    </div>
                    <div className="mt-0.5 truncate text-xs text-zinc-600">
                      {email.snippet}
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </main>
      </div>
    </div>
  );
}
