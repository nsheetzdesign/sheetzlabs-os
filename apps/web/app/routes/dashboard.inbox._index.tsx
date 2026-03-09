import type { LoaderFunctionArgs, MetaFunction } from "react-router";
import { useLoaderData, Link, useFetcher } from "react-router";
import { Inbox, PenSquare, RefreshCw, Star } from "lucide-react";
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

  const unreadCount = (emails ?? []).filter((e) => !e.is_read).length;

  return { emails: emails ?? [], accounts: accounts ?? [], category, unreadOnly, unreadCount };
}

export default function InboxIndex() {
  const { emails, accounts, category, unreadOnly, unreadCount } = useLoaderData<typeof loader>();
  const syncFetcher = useFetcher();

  const apiUrl = typeof window !== "undefined"
    ? (window as Window & { ENV?: { API_URL?: string } }).ENV?.API_URL ?? "https://api.sheetzlabs.com"
    : "https://api.sheetzlabs.com";

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
              <div className="space-y-1">
                {accounts.map((account) => (
                  <div key={account.id} className="flex items-center justify-between px-3 py-1">
                    <span className="truncate text-xs text-zinc-400">{account.email}</span>
                    <syncFetcher.Form
                      method="post"
                      action={`https://api.sheetzlabs.com/email/accounts/${account.id}/sync`}
                    >
                      <button
                        type="submit"
                        title="Sync"
                        className="text-zinc-600 transition-colors hover:text-zinc-300"
                      >
                        <RefreshCw
                          className={`h-3 w-3 ${syncFetcher.state === "submitting" ? "animate-spin" : ""}`}
                        />
                      </button>
                    </syncFetcher.Form>
                  </div>
                ))}
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
