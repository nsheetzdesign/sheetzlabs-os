import type { LoaderFunctionArgs, ActionFunctionArgs, MetaFunction } from "react-router";
import { useLoaderData, useFetcher, Link } from "react-router";
import { useState, useEffect } from "react";
import { Plus, Copy, ExternalLink, Pencil, Trash2, Check, Clock, X } from "lucide-react";
import { apiFetch } from "~/lib/api";
import type { AvailabilityRules, BookingLink } from "@sheetzlabs/shared";
import { AvailabilityEditor } from "~/components/booking/AvailabilityEditor";

export const meta: MetaFunction = () => [{ title: "Booking Links — Sheetz Labs OS" }];

const DEFAULT_AVAILABILITY: AvailabilityRules = {
  timezone: "America/Chicago",
  days: {
    monday: { enabled: true, slots: [{ start: "09:00", end: "17:00" }] },
    tuesday: { enabled: true, slots: [{ start: "09:00", end: "17:00" }] },
    wednesday: { enabled: true, slots: [{ start: "09:00", end: "17:00" }] },
    thursday: { enabled: true, slots: [{ start: "09:00", end: "17:00" }] },
    friday: { enabled: true, slots: [{ start: "09:00", end: "17:00" }] },
    saturday: { enabled: false, slots: [] },
    sunday: { enabled: false, slots: [] },
  },
  buffer_before_minutes: 0,
  buffer_after_minutes: 15,
  minimum_notice_hours: 24,
  date_range_days: 14,
};

type Account = { id: string; email: string; color?: string; display_name?: string };
type LinkRow = BookingLink & {
  calendar_accounts: { email: string; color?: string; display_name?: string } | null;
};

export async function loader({ request, context }: LoaderFunctionArgs) {
  const env = context.cloudflare.env as Record<string, string>;

  const [linksRes, accountsRes] = await Promise.all([
    apiFetch(request, env, `/booking/links`),
    apiFetch(request, env, `/calendar/accounts`),
  ]);

  const linksData = (await linksRes.json()) as { links: LinkRow[] };
  const accountsData = (await accountsRes.json()) as { accounts: Account[] };

  return {
    links: linksData.links ?? [],
    accounts: accountsData.accounts ?? [],
    appUrl: env.APP_URL ?? "https://app.sheetzlabs.com",
  };
}

export async function action({ request, context }: ActionFunctionArgs) {
  const env = context.cloudflare.env as Record<string, string>;
  const fd = await request.formData();
  const intent = fd.get("intent") as string;

  if (intent === "create") {
    await apiFetch(request, env, `/booking/links`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        calendar_account_id: fd.get("calendar_account_id"),
        slug: fd.get("slug"),
        title: fd.get("title"),
        description: fd.get("description") || undefined,
        duration_minutes: parseInt(fd.get("duration_minutes") as string, 10),
        availability_rules: DEFAULT_AVAILABILITY,
      }),
    });
  }

  if (intent === "edit") {
    const rulesRaw = fd.get("availability_rules") as string;
    await apiFetch(request, env, `/booking/links/${fd.get("id")}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        title: fd.get("title"),
        description: fd.get("description") || null,
        slug: fd.get("slug"),
        duration_minutes: parseInt(fd.get("duration_minutes") as string, 10),
        host_image_url: (fd.get("host_image_url") as string) || null,
        availability_rules: rulesRaw ? JSON.parse(rulesRaw) : undefined,
      }),
    });
  }

  if (intent === "toggle") {
    await apiFetch(request, env, `/booking/links/${fd.get("id")}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ is_active: fd.get("is_active") === "true" }),
    });
  }

  if (intent === "delete") {
    await apiFetch(request, env, `/booking/links/${fd.get("id")}`, { method: "DELETE" });
  }

  return null;
}

// ── Create Modal ─────────────────────────────────────────────────────────────

function CreateModal({ accounts, onClose }: { accounts: Account[]; onClose: () => void }) {
  const fetcher = useFetcher();

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm" onClick={onClose}>
      <div className="w-full max-w-md bg-zinc-900 border border-zinc-700 rounded-xl p-6 shadow-xl" role="dialog" aria-modal="true" aria-label="New booking link" onClick={(e) => e.stopPropagation()}>
        <div className="flex items-center justify-between mb-5">
          <h2 className="text-base font-semibold text-zinc-100">New Booking Link</h2>
          <button onClick={onClose} aria-label="Close" className="text-zinc-500 hover:text-zinc-200"><X className="w-4 h-4" /></button>
        </div>

        <fetcher.Form method="post" onSubmit={() => setTimeout(onClose, 100)} className="space-y-4">
          <input type="hidden" name="intent" value="create" />

          {accounts.length > 1 && (
            <div>
              <label className="block text-xs text-zinc-500 mb-1">Calendar Account</label>
              <select name="calendar_account_id" className="w-full bg-zinc-800 border border-zinc-700 rounded-lg px-3 py-2 text-sm text-zinc-200 focus:outline-none focus:border-emerald-500">
                {accounts.map((a) => (
                  <option key={a.id} value={a.id}>{a.display_name || a.email}</option>
                ))}
              </select>
            </div>
          )}
          {accounts.length === 1 && (
            <input type="hidden" name="calendar_account_id" value={accounts[0].id} />
          )}

          <div>
            <label className="block text-xs text-zinc-500 mb-1">Title *</label>
            <input name="title" required autoFocus placeholder="30 Minute Meeting"
              className="w-full bg-zinc-800 border border-zinc-700 rounded-lg px-3 py-2 text-sm text-zinc-200 placeholder-zinc-600 focus:outline-none focus:border-emerald-500" />
          </div>

          <div>
            <label className="block text-xs text-zinc-500 mb-1">URL Slug *</label>
            <div className="flex items-center">
              <span className="px-3 py-2 bg-zinc-800/50 border border-zinc-700 border-r-0 rounded-l-lg text-xs text-zinc-500">sheetzlabs.com/book/</span>
              <input name="slug" required placeholder="30min"
                className="flex-1 bg-zinc-800 border border-zinc-700 rounded-r-lg px-3 py-2 text-sm text-zinc-200 placeholder-zinc-600 focus:outline-none focus:border-emerald-500" />
            </div>
          </div>

          <div>
            <label className="block text-xs text-zinc-500 mb-1">Duration</label>
            <select name="duration_minutes" defaultValue="30" className="w-full bg-zinc-800 border border-zinc-700 rounded-lg px-3 py-2 text-sm text-zinc-200 focus:outline-none focus:border-emerald-500">
              {[15, 30, 45, 60, 90].map((m) => (
                <option key={m} value={m}>{m} minutes</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-xs text-zinc-500 mb-1">Description (optional)</label>
            <textarea name="description" rows={2} placeholder="What this meeting is about"
              className="w-full bg-zinc-800 border border-zinc-700 rounded-lg px-3 py-2 text-sm text-zinc-200 placeholder-zinc-600 focus:outline-none focus:border-emerald-500 resize-none" />
          </div>

          <div className="flex gap-3 pt-1">
            <button type="button" onClick={onClose} className="flex-1 py-2 text-sm text-zinc-400 hover:text-zinc-200 border border-zinc-700 rounded-lg">Cancel</button>
            <button type="submit" disabled={fetcher.state !== "idle"}
              className="flex-1 py-2 text-sm font-medium bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg disabled:opacity-50">
              {fetcher.state !== "idle" ? "Creating…" : "Create Link"}
            </button>
          </div>
        </fetcher.Form>
      </div>
    </div>
  );
}

// ── Edit Modal (BK-13/14) ─────────────────────────────────────────────────────

function EditModal({ link, appUrl, onClose }: { link: LinkRow; appUrl: string; onClose: () => void }) {
  const fetcher = useFetcher();
  const [title, setTitle] = useState(link.title);
  const [description, setDescription] = useState(link.description ?? "");
  const [slug, setSlug] = useState(link.slug);
  const [duration, setDuration] = useState(link.duration_minutes);
  const [hostImage, setHostImage] = useState(link.host_image_url ?? "");
  const [rules, setRules] = useState<AvailabilityRules>(
    (link.availability_rules as unknown as AvailabilityRules) ?? DEFAULT_AVAILABILITY
  );
  const [slugState, setSlugState] = useState<"idle" | "checking" | "ok" | "taken">("idle");
  const bookHost = appUrl.replace(/^https?:\/\//, "");

  // Live slug uniqueness check (debounced) against the API proxy.
  useEffect(() => {
    const clean = slug.toLowerCase().replace(/[^a-z0-9-]/g, "-");
    if (!clean || clean === link.slug) {
      setSlugState("idle");
      return;
    }
    setSlugState("checking");
    const t = setTimeout(async () => {
      try {
        const res = await fetch(
          `/api/booking/links/check-slug?slug=${encodeURIComponent(clean)}&exclude_id=${link.id}`
        );
        const data = (await res.json()) as { available?: boolean };
        setSlugState(data.available ? "ok" : "taken");
      } catch {
        setSlugState("idle");
      }
    }, 350);
    return () => clearTimeout(t);
  }, [slug, link.slug, link.id]);

  function submit() {
    const fd = new FormData();
    fd.set("intent", "edit");
    fd.set("id", link.id);
    fd.set("title", title);
    fd.set("description", description);
    fd.set("slug", slug);
    fd.set("duration_minutes", String(duration));
    fd.set("host_image_url", hostImage);
    fd.set("availability_rules", JSON.stringify(rules));
    fetcher.submit(fd, { method: "post" });
  }

  useEffect(() => {
    if (fetcher.state === "idle" && fetcher.data !== undefined) onClose();
  }, [fetcher.state, fetcher.data, onClose]);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4" onClick={onClose}>
      <div className="w-full max-w-lg max-h-[90vh] overflow-y-auto bg-zinc-900 border border-zinc-700 rounded-xl p-6 shadow-xl" role="dialog" aria-modal="true" aria-label={`Edit ${link.title}`} onClick={(e) => e.stopPropagation()}>
        <div className="flex items-center justify-between mb-5">
          <h2 className="text-base font-semibold text-zinc-100">Edit Booking Link</h2>
          <button onClick={onClose} aria-label="Close" className="text-zinc-500 hover:text-zinc-200"><X className="w-4 h-4" /></button>
        </div>

        <div className="space-y-4">
          <div>
            <label className="block text-xs text-zinc-500 mb-1">Title</label>
            <input value={title} onChange={(e) => setTitle(e.target.value)}
              className="w-full bg-zinc-800 border border-zinc-700 rounded-lg px-3 py-2 text-sm text-zinc-200 focus:outline-none focus:border-emerald-500" />
          </div>

          <div>
            <label className="block text-xs text-zinc-500 mb-1">URL Slug</label>
            <div className="flex items-center">
              <span className="px-3 py-2 bg-zinc-800/50 border border-zinc-700 border-r-0 rounded-l-lg text-xs text-zinc-500">{bookHost}/book/</span>
              <input value={slug} onChange={(e) => setSlug(e.target.value)}
                className="flex-1 bg-zinc-800 border border-zinc-700 rounded-r-lg px-3 py-2 text-sm text-zinc-200 focus:outline-none focus:border-emerald-500" />
            </div>
            <p className="text-xs mt-1 h-4">
              {slugState === "checking" && <span className="text-zinc-500">Checking…</span>}
              {slugState === "ok" && <span className="text-emerald-400">Available</span>}
              {slugState === "taken" && <span className="text-red-400">That slug is taken</span>}
            </p>
          </div>

          <div>
            <label className="block text-xs text-zinc-500 mb-1">Duration (minutes)</label>
            <select value={duration} onChange={(e) => setDuration(parseInt(e.target.value, 10))}
              className="w-full bg-zinc-800 border border-zinc-700 rounded-lg px-3 py-2 text-sm text-zinc-200 focus:outline-none focus:border-emerald-500">
              {[15, 30, 45, 60, 90, 120].map((m) => (
                <option key={m} value={m}>{m} minutes</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-xs text-zinc-500 mb-1">Description</label>
            <textarea value={description} onChange={(e) => setDescription(e.target.value)} rows={2}
              className="w-full bg-zinc-800 border border-zinc-700 rounded-lg px-3 py-2 text-sm text-zinc-200 focus:outline-none focus:border-emerald-500 resize-none" />
          </div>

          <div>
            <label className="block text-xs text-zinc-500 mb-1">Host image URL (optional)</label>
            <input value={hostImage} onChange={(e) => setHostImage(e.target.value)} placeholder="https://…"
              className="w-full bg-zinc-800 border border-zinc-700 rounded-lg px-3 py-2 text-sm text-zinc-200 placeholder-zinc-600 focus:outline-none focus:border-emerald-500" />
          </div>

          <div className="border-t border-zinc-800 pt-4">
            <h3 className="text-sm font-medium text-zinc-200 mb-3">Availability</h3>
            <AvailabilityEditor value={rules} onChange={setRules} />
          </div>

          <div className="flex gap-3 pt-2">
            <button type="button" onClick={onClose} className="flex-1 py-2 text-sm text-zinc-400 hover:text-zinc-200 border border-zinc-700 rounded-lg">Cancel</button>
            <button type="button" onClick={submit} disabled={fetcher.state !== "idle" || slugState === "taken"}
              className="flex-1 py-2 text-sm font-medium bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg disabled:opacity-50">
              {fetcher.state !== "idle" ? "Saving…" : "Save Changes"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

// ── Active toggle switch (separate from the edit pencil — BK-13) ──────────────

function ActiveSwitch({ link }: { link: LinkRow }) {
  const fetcher = useFetcher();
  // Optimistic: reflect the in-flight intent immediately.
  const pending = fetcher.formData?.get("is_active");
  const active = pending != null ? pending === "true" : !!link.is_active;

  return (
    <fetcher.Form method="post">
      <input type="hidden" name="intent" value="toggle" />
      <input type="hidden" name="id" value={link.id} />
      <input type="hidden" name="is_active" value={String(!active)} />
      <button
        type="submit"
        role="switch"
        aria-checked={active}
        aria-label={active ? "Deactivate link" : "Activate link"}
        title={active ? "Active — click to deactivate" : "Inactive — click to activate"}
        className={`relative inline-flex h-5 w-9 items-center rounded-full transition-colors ${
          active ? "bg-emerald-600" : "bg-zinc-700"
        }`}
      >
        <span
          className={`inline-block h-3.5 w-3.5 transform rounded-full bg-white transition-transform ${
            active ? "translate-x-4" : "translate-x-1"
          }`}
        />
      </button>
    </fetcher.Form>
  );
}

// ── Main Page ─────────────────────────────────────────────────────────────────

export default function BookingLinksPage() {
  const { links, accounts, appUrl } = useLoaderData<typeof loader>();
  const bookHost = appUrl.replace(/^https?:\/\//, "");
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [showCreate, setShowCreate] = useState(false);
  const [editing, setEditing] = useState<LinkRow | null>(null);

  function copyLink(slug: string, id: string) {
    navigator.clipboard.writeText(`${appUrl}/book/${slug}`);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  }

  return (
    <div className="p-6 max-w-3xl">
      {showCreate && accounts.length > 0 && (
        <CreateModal accounts={accounts as Account[]} onClose={() => setShowCreate(false)} />
      )}
      {editing && (
        <EditModal link={editing} appUrl={appUrl} onClose={() => setEditing(null)} />
      )}

      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-lg font-semibold text-zinc-100">Booking Links</h1>
          <p className="text-xs text-zinc-500 mt-0.5">Share a link so people can book time on your calendar</p>
        </div>
        {accounts.length === 0 ? (
          <Link to="/dashboard/calendar" className="flex items-center gap-1.5 px-3 py-1.5 text-xs text-zinc-400 border border-zinc-700 rounded-lg hover:border-zinc-500">
            Connect Calendar First
          </Link>
        ) : (
          <button
            onClick={() => setShowCreate(true)}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg transition-colors"
          >
            <Plus className="w-3.5 h-3.5" /> New Link
          </button>
        )}
      </div>

      {links.length === 0 ? (
        <div className="text-center py-16 border border-zinc-800 rounded-xl">
          <Clock className="w-8 h-8 text-zinc-600 mx-auto mb-3" />
          <p className="text-zinc-400 mb-1">No booking links yet</p>
          <p className="text-xs text-zinc-600 mb-4">Create a link so others can schedule time with you</p>
          {accounts.length > 0 && (
            <button
              onClick={() => setShowCreate(true)}
              className="text-emerald-400 hover:text-emerald-300 text-sm"
            >
              Create your first booking link →
            </button>
          )}
        </div>
      ) : (
        <div className="space-y-3">
          {(links as LinkRow[]).map((link) => (
            <div key={link.id} className="bg-zinc-900 border border-zinc-800 rounded-xl p-4">
              <div className="flex items-start justify-between gap-4">
                <div className="min-w-0">
                  <div className="flex items-center gap-2 mb-0.5">
                    <h3 className="text-sm font-medium text-zinc-100">{link.title}</h3>
                    {!link.is_active && (
                      <span className="px-1.5 py-0.5 text-[10px] bg-zinc-800 text-zinc-500 rounded">Inactive</span>
                    )}
                  </div>
                  <p className="text-xs text-zinc-500">
                    <span className="text-zinc-400">{link.duration_minutes} min</span>
                    {" · "}{bookHost}/book/{link.slug}
                  </p>
                  {link.description && (
                    <p className="text-xs text-zinc-600 mt-1 truncate">{link.description}</p>
                  )}
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  <ActiveSwitch link={link} />

                  <button
                    onClick={() => copyLink(link.slug, link.id)}
                    className="p-1.5 text-zinc-500 hover:text-zinc-200 hover:bg-zinc-800 rounded transition-colors"
                    aria-label="Copy link"
                    title="Copy link"
                  >
                    {copiedId === link.id ? <Check className="w-3.5 h-3.5 text-emerald-500" /> : <Copy className="w-3.5 h-3.5" />}
                  </button>

                  <a
                    href={`/book/${link.slug}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-1.5 text-zinc-500 hover:text-zinc-200 hover:bg-zinc-800 rounded transition-colors"
                    aria-label="Preview booking page"
                    title="Preview"
                  >
                    <ExternalLink className="w-3.5 h-3.5" />
                  </a>

                  <button
                    onClick={() => setEditing(link)}
                    className="p-1.5 text-zinc-500 hover:text-zinc-200 hover:bg-zinc-800 rounded transition-colors"
                    aria-label="Edit link"
                    title="Edit"
                  >
                    <Pencil className="w-3.5 h-3.5" />
                  </button>

                  <DeleteButton id={link.id} />
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

function DeleteButton({ id }: { id: string }) {
  const fetcher = useFetcher();
  return (
    <fetcher.Form method="post">
      <input type="hidden" name="intent" value="delete" />
      <input type="hidden" name="id" value={id} />
      <button type="submit"
        className="p-1.5 text-zinc-600 hover:text-red-400 hover:bg-zinc-800 rounded transition-colors"
        aria-label="Delete link"
        title="Delete"
        onClick={(e) => { if (!confirm("Delete this booking link?")) e.preventDefault(); }}>
        <Trash2 className="w-3.5 h-3.5" />
      </button>
    </fetcher.Form>
  );
}
