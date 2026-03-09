import type { ActionFunctionArgs, LoaderFunctionArgs, MetaFunction } from "react-router";
import {
  useLoaderData,
  useActionData,
  Form,
  Link,
  redirect,
  data,
} from "react-router";
import { Header } from "~/components/dashboard/Header";
import { getSupabaseClient } from "~/lib/supabase.server";
import { FormField } from "~/components/ui/FormField";
import { Input } from "~/components/ui/Input";
import { Select } from "~/components/ui/Select";
import { Button } from "~/components/ui/Button";

export const meta: MetaFunction = () => [{ title: "New Knowledge — Sheetz Labs OS" }];

const KNOWLEDGE_TYPES = [
  "note", "doc", "clip", "playbook", "spec",
  "research", "draft", "learning", "template",
  "meeting_prep", "daily_plan", "insight",
];

export async function loader({ context }: LoaderFunctionArgs) {
  const supabase = getSupabaseClient(context.cloudflare.env);
  const { data: ventures } = await supabase
    .from("ventures")
    .select("id, name, slug")
    .order("name");
  return { ventures: ventures ?? [] };
}

export async function action({ request, context }: ActionFunctionArgs) {
  const supabase = getSupabaseClient(context.cloudflare.env);
  const fd = await request.formData();

  const title = (fd.get("title") as string)?.trim();
  const rawSlug = (fd.get("slug") as string)?.trim();
  const slug =
    rawSlug ||
    title
      ?.toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-|-$/g, "");
  const type = (fd.get("type") as string) || "note";
  const tagsRaw = (fd.get("tags") as string)?.trim();
  const tags = tagsRaw
    ? tagsRaw.split(",").map((t) => t.trim()).filter(Boolean)
    : null;
  const venture_id = (fd.get("venture_id") as string) || null;
  const content = (fd.get("content") as string)?.trim() || null;
  const source_url = (fd.get("source_url") as string)?.trim() || null;

  const errors: Record<string, string> = {};
  if (!title) errors.title = "Required";
  if (!slug) errors.slug = "Required";
  if (Object.keys(errors).length) return data({ errors }, { status: 400 });

  // Calculate word count and reading time
  const wordCount = content ? content.trim().split(/\s+/).length : 0;
  const readingTime = wordCount > 0 ? Math.ceil(wordCount / 200) : null;

  const { data: item, error } = await supabase.from("knowledge").insert({
    title,
    slug,
    type,
    tags,
    venture_id,
    content,
    source_url,
    word_count: wordCount || null,
    reading_time: readingTime,
  }).select("slug").single();

  if (error) return data({ errors: { _form: error.message } }, { status: 500 });

  return redirect(`/dashboard/knowledge/${item.slug}`);
}

export default function NewKnowledge() {
  const { ventures } = useLoaderData<typeof loader>();
  const actionData = useActionData<typeof action>();
  const errors = actionData?.errors ?? {};

  return (
    <div className="flex flex-1 flex-col">
      <Header title="New Knowledge Item" />
      <main className="flex-1 p-6">
        <div className="mx-auto max-w-3xl">
          {errors._form && (
            <div className="mb-4 rounded-lg border border-red-500/20 bg-red-500/10 px-4 py-3 text-sm text-red-400">
              {errors._form}
            </div>
          )}
          <Form
            method="post"
            className="space-y-5 rounded-xl border border-surface-2/50 bg-surface-1/40 p-6 backdrop-blur-sm"
          >
            <div className="grid gap-5 sm:grid-cols-2">
              <FormField label="Title" required error={errors.title}>
                <Input
                  name="title"
                  placeholder="Onboarding Playbook"
                  error={!!errors.title}
                  autoFocus
                />
              </FormField>
              <FormField label="Slug" hint="Auto-derived if blank" error={errors.slug}>
                <Input name="slug" placeholder="onboarding-playbook" error={!!errors.slug} />
              </FormField>
            </div>

            <div className="grid gap-5 sm:grid-cols-2">
              <FormField label="Type">
                <Select name="type" defaultValue="note">
                  {KNOWLEDGE_TYPES.map((t) => (
                    <option key={t} value={t}>
                      {t}
                    </option>
                  ))}
                </Select>
              </FormField>
              <FormField label="Venture">
                <Select name="venture_id" defaultValue="">
                  <option value="">None (general)</option>
                  {ventures.map((v) => (
                    <option key={v.id} value={v.id}>
                      {v.name}
                    </option>
                  ))}
                </Select>
              </FormField>
            </div>

            <FormField label="Tags" hint="Comma-separated: ops, hiring, marketing">
              <Input name="tags" placeholder="ops, onboarding, template" />
            </FormField>

            <FormField label="Source URL" hint="Original URL if clipped from web">
              <Input name="source_url" placeholder="https://example.com/article" type="url" />
            </FormField>

            <FormField label="Content" hint="Markdown supported">
              <textarea
                name="content"
                rows={16}
                placeholder={`# Title\n\nWrite your content here. Markdown is supported.\n\n## Section\n\n- Bullet one\n- Bullet two`}
                className="w-full rounded-lg border border-surface-2/50 bg-surface-1 px-3 py-2 font-mono text-sm text-zinc-200 placeholder-zinc-600 focus:outline-none focus:ring-1 focus:ring-brand"
              />
            </FormField>

            <div className="flex items-center gap-3 pt-2">
              <Button type="submit">Create</Button>
              <Link to="/dashboard/knowledge">
                <Button type="button" variant="secondary">
                  Cancel
                </Button>
              </Link>
            </div>
          </Form>
        </div>
      </main>
    </div>
  );
}
