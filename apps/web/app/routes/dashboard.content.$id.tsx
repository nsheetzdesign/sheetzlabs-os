import type { LoaderFunctionArgs, MetaFunction } from "react-router";
import { useLoaderData, Link, useFetcher, useNavigate } from "react-router";
import { useState } from "react";
import { ArrowLeft, ExternalLink } from "lucide-react";
import { getSupabaseClient } from "~/lib/supabase.server";

export const meta: MetaFunction<typeof loader> = ({ data }) => [
  { title: `${data?.item?.title ?? "Content"} — Sheetz Labs OS` },
];

export async function loader({ params, context }: LoaderFunctionArgs) {
  const supabase = getSupabaseClient(context.cloudflare.env);
  const { id } = params;

  const { data: item } = await supabase
    .from("content")
    .select(`
      *,
      ventures(id, name, slug),
      parent:parent_id(id, title, type),
      children:content(id, title, type, status, platform_url),
      knowledge(id, title)
    `)
    .eq("id", id!)
    .single();

  return { item };
}

const STATUS_COLORS: Record<string, string> = {
  idea: "bg-purple-500/20 text-purple-400 border-purple-500/30",
  draft: "bg-zinc-500/20 text-zinc-400 border-zinc-500/30",
  review: "bg-amber-500/20 text-amber-400 border-amber-500/30",
  scheduled: "bg-blue-500/20 text-blue-400 border-blue-500/30",
  published: "bg-emerald-500/20 text-emerald-400 border-emerald-500/30",
  archived: "bg-zinc-700/20 text-zinc-600 border-zinc-700/30",
};

export default function ContentDetail() {
  const { item } = useLoaderData<typeof loader>();
  const fetcher = useFetcher();
  const navigate = useNavigate();
  const [isEditing, setIsEditing] = useState(false);
  const [editBody, setEditBody] = useState(item?.body ?? "");
  const [editTitle, setEditTitle] = useState(item?.title ?? "");
  const [repurposing, setRepurposing] = useState(false);

  if (!item) {
    return (
      <div className="flex h-full items-center justify-center text-zinc-500">
        Content not found.
      </div>
    );
  }

  async function handleSave() {
    const res = await fetch(`/api/content/${item.id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ title: editTitle, body: editBody }),
    });
    if (res.ok) {
      setIsEditing(false);
      navigate(".", { replace: true });
    }
  }

  async function handleStatusChange(status: string, extra: Record<string, any> = {}) {
    await fetch(`/api/content/${item.id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status, ...extra }),
    });
    navigate(".", { replace: true });
  }

  async function handleRepurpose() {
    setRepurposing(true);
    const targets =
      item.type === "blog"
        ? ["linkedin", "twitter", "newsletter"]
        : item.type === "linkedin"
        ? ["twitter", "thread"]
        : ["linkedin", "twitter"];

    await fetch(`/api/content/${item.id}/repurpose`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ target_types: targets }),
    });
    setRepurposing(false);
    navigate(".", { replace: true });
  }

  async function handlePublishLinkedIn() {
    await fetch(`/api/content/${item.id}/publish/linkedin`, { method: "POST" });
    navigate(".", { replace: true });
  }

  async function handleDelete() {
    if (!confirm("Delete this content?")) return;
    await fetch(`/api/content/${item.id}`, { method: "DELETE" });
    navigate("/dashboard/knowledge/content");
  }

  const children = (item.children as any[]) ?? [];
  const parent = item.parent as any;

  return (
    <div className="mx-auto max-w-4xl p-6">
      {/* Back */}
      <Link
        to="/dashboard/knowledge/content"
        className="mb-4 inline-flex items-center gap-1.5 text-sm text-zinc-500 hover:text-zinc-300"
      >
        <ArrowLeft className="h-3.5 w-3.5" />
        Content
      </Link>

      {/* Header */}
      <div className="mb-6 flex items-start justify-between gap-4">
        <div className="min-w-0 flex-1">
          {isEditing ? (
            <input
              value={editTitle}
              onChange={(e) => setEditTitle(e.target.value)}
              className="w-full rounded-lg border border-surface-2 bg-surface-1 px-3 py-2 text-xl font-semibold text-zinc-100 focus:outline-none focus:ring-1 focus:ring-brand"
            />
          ) : (
            <h1 className="text-2xl font-semibold">{item.title}</h1>
          )}
          <div className="mt-2 flex flex-wrap items-center gap-2 text-sm">
            <span
              className={`rounded border px-2 py-0.5 text-xs font-medium ${
                STATUS_COLORS[item.status] ?? STATUS_COLORS.draft
              }`}
            >
              {item.status}
            </span>
            <span className="capitalize text-zinc-500">{item.type}</span>
            {item.word_count && (
              <span className="text-zinc-500">
                {item.word_count} words · {item.reading_time}m read
              </span>
            )}
            {item.scheduled_for && (
              <span className="text-zinc-500">
                📅 {new Date(item.scheduled_for).toLocaleDateString()}
              </span>
            )}
          </div>
        </div>

        <div className="flex shrink-0 gap-2">
          {isEditing ? (
            <>
              <button
                onClick={handleSave}
                className="rounded-lg bg-brand px-3 py-1.5 text-sm font-medium text-white hover:bg-brand-dark"
              >
                Save
              </button>
              <button
                onClick={() => {
                  setIsEditing(false);
                  setEditTitle(item.title);
                  setEditBody(item.body ?? "");
                }}
                className="rounded-lg border border-surface-2 px-3 py-1.5 text-sm text-zinc-400 hover:text-zinc-200"
              >
                Cancel
              </button>
            </>
          ) : (
            <>
              <button
                onClick={() => setIsEditing(true)}
                className="rounded-lg border border-surface-2 px-3 py-1.5 text-sm text-zinc-400 hover:border-surface-3 hover:text-zinc-200"
              >
                Edit
              </button>
              <button
                onClick={handleDelete}
                className="rounded-lg border border-surface-2 px-3 py-1.5 text-sm text-zinc-600 hover:border-red-500/30 hover:text-red-400"
              >
                Delete
              </button>
            </>
          )}
        </div>
      </div>

      {/* Parent link */}
      {parent && (
        <div className="mb-4 text-sm text-zinc-500">
          Repurposed from{" "}
          <Link to={`/dashboard/knowledge/content/${parent.id}`} className="text-brand hover:text-brand-dark">
            {parent.title}
          </Link>
        </div>
      )}

      {/* Body */}
      <div className="mb-6 rounded-xl border border-surface-2/50 bg-surface-1/40 p-6">
        {isEditing ? (
          <textarea
            value={editBody}
            onChange={(e) => setEditBody(e.target.value)}
            rows={20}
            className="w-full bg-transparent font-mono text-sm text-zinc-200 focus:outline-none"
          />
        ) : (
          <pre className="whitespace-pre-wrap font-sans text-sm leading-relaxed text-zinc-200">
            {item.body}
          </pre>
        )}
      </div>

      {/* Actions */}
      {!isEditing && (
        <div className="mb-6 flex flex-wrap gap-3">
          {item.status === "draft" && (
            <>
              <button
                onClick={() => handleStatusChange("review")}
                className="rounded-lg bg-amber-600/80 px-4 py-2 text-sm font-medium hover:bg-amber-500"
              >
                Send to Review
              </button>
              <button
                onClick={() =>
                  handleStatusChange("scheduled", {
                    scheduled_for: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(),
                  })
                }
                className="rounded-lg border border-surface-2 px-4 py-2 text-sm hover:border-surface-3"
              >
                Schedule (Tomorrow)
              </button>
            </>
          )}

          {item.status === "review" && (
            <button
              onClick={() => handleStatusChange("scheduled")}
              className="rounded-lg bg-blue-600/80 px-4 py-2 text-sm font-medium hover:bg-blue-500"
            >
              Approve &amp; Schedule
            </button>
          )}

          {["scheduled", "review"].includes(item.status) && item.type === "linkedin" && (
            <button
              onClick={handlePublishLinkedIn}
              className="rounded-lg bg-brand px-4 py-2 text-sm font-medium text-white hover:bg-brand-dark"
            >
              Publish to LinkedIn
            </button>
          )}

          {["scheduled", "review"].includes(item.status) && item.type === "newsletter" && (
            <button
              onClick={async () => {
                await fetch(`/api/content/${item.id}/publish/newsletter`, {
                  method: "POST",
                  headers: { "Content-Type": "application/json" },
                  body: JSON.stringify({ subject: item.title }),
                });
                navigate(".", { replace: true });
              }}
              className="rounded-lg bg-brand px-4 py-2 text-sm font-medium text-white hover:bg-brand-dark"
            >
              Send Newsletter
            </button>
          )}

          {item.status !== "idea" && (
            <button
              onClick={handleRepurpose}
              disabled={repurposing}
              className="rounded-lg border border-surface-2 px-4 py-2 text-sm hover:border-surface-3 disabled:opacity-50"
            >
              {repurposing ? "Repurposing…" : "Repurpose →"}
            </button>
          )}
        </div>
      )}

      {/* Repurposed versions */}
      {children.length > 0 && (
        <div className="mb-6 border-t border-surface-2/50 pt-6">
          <h2 className="mb-3 text-base font-semibold">Repurposed Versions</h2>
          <div className="space-y-2">
            {children.map((child: any) => (
              <Link
                key={child.id}
                to={`/dashboard/knowledge/content/${child.id}`}
                className="flex items-center justify-between rounded-lg border border-surface-2/50 bg-surface-1/40 p-3 hover:border-surface-3/50"
              >
                <div>
                  <span className="text-sm font-medium text-zinc-200">{child.title}</span>
                  <span className="ml-2 text-xs text-zinc-500 capitalize">{child.type}</span>
                </div>
                <span
                  className={`rounded border px-1.5 py-0.5 text-xs font-medium ${
                    STATUS_COLORS[child.status] ?? STATUS_COLORS.draft
                  }`}
                >
                  {child.status}
                </span>
              </Link>
            ))}
          </div>
        </div>
      )}

      {/* Performance */}
      {item.status === "published" && (
        <div className="border-t border-surface-2/50 pt-6">
          <h2 className="mb-3 text-base font-semibold">Performance</h2>
          <div className="grid grid-cols-5 gap-3">
            {(
              [
                ["Views", item.views],
                ["Likes", item.likes],
                ["Comments", item.comments],
                ["Shares", item.shares],
                ["Clicks", item.clicks],
              ] as [string, number][]
            ).map(([label, val]) => (
              <div
                key={label}
                className="rounded-lg border border-surface-2/50 bg-surface-1/40 p-3 text-center"
              >
                <div className="text-xl font-bold">{val ?? 0}</div>
                <div className="text-xs text-zinc-500">{label}</div>
              </div>
            ))}
          </div>
          {item.platform_url && (
            <a
              href={item.platform_url}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-3 inline-flex items-center gap-1.5 text-sm text-brand hover:text-brand-dark"
            >
              View on {item.type}
              <ExternalLink className="h-3.5 w-3.5" />
            </a>
          )}
        </div>
      )}
    </div>
  );
}
