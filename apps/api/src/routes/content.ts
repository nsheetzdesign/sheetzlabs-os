import { Hono } from "hono";
import { createClient } from "@supabase/supabase-js";
import Anthropic from "@anthropic-ai/sdk";
import { Resend } from "resend";

type Bindings = {
  SUPABASE_URL: string;
  SUPABASE_SERVICE_ROLE_KEY: string;
  ANTHROPIC_API_KEY: string;
  RESEND_API_KEY: string;
  NEWSLETTER_FROM: string;
  LINKEDIN_ACCESS_TOKEN: string;
  LINKEDIN_PERSON_ID: string;
};

const content = new Hono<{ Bindings: Bindings }>();

// ============================================
// CONTENT CRUD
// ============================================

content.get("/", async (c) => {
  const supabase = createClient(c.env.SUPABASE_URL, c.env.SUPABASE_SERVICE_ROLE_KEY);
  const type = c.req.query("type");
  const status = c.req.query("status");
  const venture_id = c.req.query("venture_id");

  let query = supabase
    .from("content")
    .select("*, ventures(id, name, slug), parent:parent_id(id, title)")
    .order("created_at", { ascending: false })
    .limit(50);

  if (type && type !== "all") query = query.eq("type", type);
  if (status && status !== "all") query = query.eq("status", status);
  if (venture_id) query = query.eq("venture_id", venture_id);

  const { data } = await query;
  return c.json({ content: data });
});

content.get("/calendar/view", async (c) => {
  const supabase = createClient(c.env.SUPABASE_URL, c.env.SUPABASE_SERVICE_ROLE_KEY);
  const start = c.req.query("start") || new Date().toISOString().split("T")[0];
  const end =
    c.req.query("end") ||
    new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split("T")[0];

  const { data: scheduled } = await supabase
    .from("content")
    .select("*")
    .gte("scheduled_for", start)
    .lte("scheduled_for", end)
    .in("status", ["scheduled", "published"])
    .order("scheduled_for");

  const { data: calendar } = await supabase
    .from("content_calendar")
    .select("*, content(*)")
    .gte("calendar_date", start)
    .lte("calendar_date", end)
    .order("calendar_date");

  return c.json({ scheduled, calendar });
});

content.post("/calendar", async (c) => {
  const body = await c.req.json();
  const supabase = createClient(c.env.SUPABASE_URL, c.env.SUPABASE_SERVICE_ROLE_KEY);

  const { data } = await supabase
    .from("content_calendar")
    .insert(body)
    .select()
    .single();

  return c.json({ entry: data });
});

content.delete("/calendar/:id", async (c) => {
  const { id } = c.req.param();
  const supabase = createClient(c.env.SUPABASE_URL, c.env.SUPABASE_SERVICE_ROLE_KEY);

  await supabase.from("content_calendar").delete().eq("id", id);
  return c.json({ success: true });
});

// ============================================
// TEMPLATES
// ============================================

content.get("/templates", async (c) => {
  const supabase = createClient(c.env.SUPABASE_URL, c.env.SUPABASE_SERVICE_ROLE_KEY);
  const type = c.req.query("type");

  let query = supabase.from("content_templates").select("*").order("name");
  if (type) query = query.eq("type", type);

  const { data } = await query;
  return c.json({ templates: data });
});

content.post("/templates", async (c) => {
  const body = await c.req.json();
  const supabase = createClient(c.env.SUPABASE_URL, c.env.SUPABASE_SERVICE_ROLE_KEY);

  const { data } = await supabase
    .from("content_templates")
    .insert(body)
    .select()
    .single();

  return c.json({ template: data });
});

content.delete("/templates/:id", async (c) => {
  const { id } = c.req.param();
  const supabase = createClient(c.env.SUPABASE_URL, c.env.SUPABASE_SERVICE_ROLE_KEY);

  await supabase.from("content_templates").delete().eq("id", id);
  return c.json({ success: true });
});

content.post("/templates/:id/apply", async (c) => {
  const { id } = c.req.param();
  const { variables } = await c.req.json();
  const supabase = createClient(c.env.SUPABASE_URL, c.env.SUPABASE_SERVICE_ROLE_KEY);

  const { data: template } = await supabase
    .from("content_templates")
    .select("*")
    .eq("id", id)
    .single();

  if (!template) return c.json({ error: "Template not found" }, 404);

  let body = template.structure;
  for (const [key, value] of Object.entries(variables || {})) {
    body = body.replaceAll(`{{${key}}}`, value as string);
  }

  const { data: item } = await supabase
    .from("content")
    .insert({
      title: `${template.name} - ${new Date().toLocaleDateString()}`,
      body,
      type: template.type,
      status: "draft",
    })
    .select()
    .single();

  return c.json({ item });
});

// ============================================
// NEWSLETTER SUBSCRIBERS
// ============================================

content.get("/newsletter/subscribers", async (c) => {
  const supabase = createClient(c.env.SUPABASE_URL, c.env.SUPABASE_SERVICE_ROLE_KEY);
  const status = c.req.query("status") || "active";

  const { data, count } = await supabase
    .from("newsletter_subscribers")
    .select("*", { count: "exact" })
    .eq("status", status)
    .order("subscribed_at", { ascending: false });

  return c.json({ subscribers: data, count });
});

content.post("/newsletter/subscribers", async (c) => {
  const body = await c.req.json();
  const supabase = createClient(c.env.SUPABASE_URL, c.env.SUPABASE_SERVICE_ROLE_KEY);

  const { data } = await supabase
    .from("newsletter_subscribers")
    .insert({ ...body, source: body.source || "manual" })
    .select()
    .single();

  return c.json({ subscriber: data });
});

content.post("/newsletter/subscribers/import", async (c) => {
  const { emails } = await c.req.json();
  const supabase = createClient(c.env.SUPABASE_URL, c.env.SUPABASE_SERVICE_ROLE_KEY);

  const records = emails.map((e: any) => ({
    email: typeof e === "string" ? e : e.email,
    name: typeof e === "string" ? null : e.name,
    source: "import",
  }));

  const { data } = await supabase
    .from("newsletter_subscribers")
    .upsert(records, { onConflict: "email", ignoreDuplicates: true })
    .select();

  return c.json({ imported: data?.length || 0 });
});

content.get("/newsletter/sends", async (c) => {
  const supabase = createClient(c.env.SUPABASE_URL, c.env.SUPABASE_SERVICE_ROLE_KEY);

  const { data } = await supabase
    .from("newsletter_sends")
    .select("*, content(id, title)")
    .order("created_at", { ascending: false })
    .limit(20);

  return c.json({ sends: data });
});

// ============================================
// AI GENERATION
// ============================================

content.post("/generate", async (c) => {
  const { type, topic, angle, tone, length } = await c.req.json();
  const supabase = createClient(c.env.SUPABASE_URL, c.env.SUPABASE_SERVICE_ROLE_KEY);
  const anthropic = new Anthropic({ apiKey: c.env.ANTHROPIC_API_KEY });

  const lengthGuide =
    {
      short: "Keep it brief, under 200 words",
      medium: "400-600 words",
      long: "800-1200 words",
    }[length as string] || "400-600 words";

  const typeGuide =
    {
      blog: "Write a blog post with an engaging intro, clear sections, and actionable takeaways",
      linkedin:
        "Write a LinkedIn post with a hook in the first line, use line breaks, end with a question or CTA, max 1300 characters",
      newsletter: "Write a newsletter with a personal opening, clear value, and a single CTA",
      twitter: "Write a punchy tweet, max 280 characters",
      thread: "Write a Twitter thread with 5-7 tweets, each building on the last",
    }[type as string] || "";

  const response = await anthropic.messages.create({
    model: "claude-sonnet-4-20250514",
    max_tokens: 2000,
    system: `You are a content writer for a solo founder. Write in first person, be authentic, avoid corporate speak.

Tone: ${tone || "professional but approachable"}
${lengthGuide}
${typeGuide}
Output JSON: {"title": "...", "body": "...", "excerpt": "..."}`,
    messages: [
      {
        role: "user",
        content: `Topic: ${topic}\nAngle: ${angle || "practical insights"}`,
      },
    ],
  });

  const text = response.content[0].type === "text" ? response.content[0].text : "{}";
  const parsed = JSON.parse(text.replace(/```json\n?|\n?```/g, ""));

  const { data: item } = await supabase
    .from("content")
    .insert({
      title: parsed.title,
      body: parsed.body,
      excerpt: parsed.excerpt,
      type,
      status: "draft",
      tags: [topic.toLowerCase()],
    })
    .select()
    .single();

  return c.json({ item });
});

// ============================================
// CONTENT CRUD (continued — id routes)
// ============================================

content.get("/:id", async (c) => {
  const { id } = c.req.param();
  const supabase = createClient(c.env.SUPABASE_URL, c.env.SUPABASE_SERVICE_ROLE_KEY);

  const { data } = await supabase
    .from("content")
    .select(`
      *,
      ventures(id, name, slug),
      parent:parent_id(id, title, type),
      children:content(id, title, type, status, platform_url),
      knowledge(id, title)
    `)
    .eq("id", id)
    .single();

  return c.json({ item: data });
});

content.post("/", async (c) => {
  const body = await c.req.json();
  const supabase = createClient(c.env.SUPABASE_URL, c.env.SUPABASE_SERVICE_ROLE_KEY);

  if (body.body) {
    const words = body.body.trim().split(/\s+/).length;
    body.word_count = words;
    body.reading_time = Math.ceil(words / 200);
  }

  const { data } = await supabase.from("content").insert(body).select().single();
  return c.json({ item: data });
});

content.patch("/:id", async (c) => {
  const { id } = c.req.param();
  const body = await c.req.json();
  const supabase = createClient(c.env.SUPABASE_URL, c.env.SUPABASE_SERVICE_ROLE_KEY);

  if (body.body) {
    const words = body.body.trim().split(/\s+/).length;
    body.word_count = words;
    body.reading_time = Math.ceil(words / 200);
  }

  const { data } = await supabase
    .from("content")
    .update(body)
    .eq("id", id)
    .select()
    .single();

  return c.json({ item: data });
});

content.delete("/:id", async (c) => {
  const { id } = c.req.param();
  const supabase = createClient(c.env.SUPABASE_URL, c.env.SUPABASE_SERVICE_ROLE_KEY);

  await supabase.from("content").delete().eq("id", id);
  return c.json({ success: true });
});

// ============================================
// REPURPOSING
// ============================================

content.post("/:id/repurpose", async (c) => {
  const { id } = c.req.param();
  const { target_types } = await c.req.json();
  const supabase = createClient(c.env.SUPABASE_URL, c.env.SUPABASE_SERVICE_ROLE_KEY);

  const { data: item } = await supabase
    .from("content")
    .select("*")
    .eq("id", id)
    .single();

  if (!item) return c.json({ error: "Content not found" }, 404);

  const anthropic = new Anthropic({ apiKey: c.env.ANTHROPIC_API_KEY });

  const response = await anthropic.messages.create({
    model: "claude-sonnet-4-20250514",
    max_tokens: 2000,
    system: `You are a content repurposing expert. Given a piece of content, create variations for different platforms.
Guidelines per platform:
- linkedin: Professional tone, 1200-1500 chars max, hook in first line, use line breaks, end with question or CTA
- twitter: 280 chars, punchy, conversational
- thread: Twitter thread format, 5-10 tweets, numbered
- newsletter: Email format, personal tone, clear sections
- blog: Long-form, SEO-friendly, headers, 800-1500 words
Output JSON: {"variations": [{"type": "linkedin", "title": "...", "body": "..."}]}`,
    messages: [
      {
        role: "user",
        content: `Repurpose this ${item.type} into: ${(target_types as string[]).join(", ")}\n\nTitle: ${item.title}\n\nContent:\n${item.body}`,
      },
    ],
  });

  const text = response.content[0].type === "text" ? response.content[0].text : "{}";
  const parsed = JSON.parse(text.replace(/```json\n?|\n?```/g, ""));

  const created = [];
  for (const variation of parsed.variations || []) {
    const { data: newItem } = await supabase
      .from("content")
      .insert({
        title: variation.title,
        body: variation.body,
        type: variation.type,
        status: "draft",
        parent_id: id,
        tags: item.tags,
        venture_id: item.venture_id,
      })
      .select()
      .single();

    if (newItem) created.push(newItem);
  }

  return c.json({ variations: created });
});

// ============================================
// LINKEDIN PUBLISHING
// ============================================

content.post("/:id/publish/linkedin", async (c) => {
  const { id } = c.req.param();
  const supabase = createClient(c.env.SUPABASE_URL, c.env.SUPABASE_SERVICE_ROLE_KEY);

  const { data: item } = await supabase
    .from("content")
    .select("*")
    .eq("id", id)
    .single();

  if (!item) return c.json({ error: "Content not found" }, 404);
  if (item.type !== "linkedin") return c.json({ error: "Not a LinkedIn post" }, 400);

  const response = await fetch("https://api.linkedin.com/v2/ugcPosts", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${c.env.LINKEDIN_ACCESS_TOKEN}`,
      "Content-Type": "application/json",
      "X-Restli-Protocol-Version": "2.0.0",
    },
    body: JSON.stringify({
      author: `urn:li:person:${c.env.LINKEDIN_PERSON_ID}`,
      lifecycleState: "PUBLISHED",
      specificContent: {
        "com.linkedin.ugc.ShareContent": {
          shareCommentary: { text: item.body },
          shareMediaCategory: "NONE",
        },
      },
      visibility: { "com.linkedin.ugc.MemberNetworkVisibility": "PUBLIC" },
    }),
  });

  if (!response.ok) {
    return c.json({ error: "LinkedIn API error", details: await response.text() }, 500);
  }

  const result: any = await response.json();

  await supabase
    .from("content")
    .update({
      status: "published",
      published_at: new Date().toISOString(),
      platform_id: result.id,
      platform_url: `https://www.linkedin.com/feed/update/${result.id}`,
    })
    .eq("id", id);

  return c.json({ success: true, platform_id: result.id });
});

// ============================================
// NEWSLETTER SEND (RESEND)
// ============================================

content.post("/:id/publish/newsletter", async (c) => {
  const { id } = c.req.param();
  const { subject, preview_text } = await c.req.json();
  const supabase = createClient(c.env.SUPABASE_URL, c.env.SUPABASE_SERVICE_ROLE_KEY);

  const { data: item } = await supabase
    .from("content")
    .select("*")
    .eq("id", id)
    .single();

  if (!item) return c.json({ error: "Content not found" }, 404);

  const { data: subscribers } = await supabase
    .from("newsletter_subscribers")
    .select("email, name")
    .eq("status", "active");

  if (!subscribers?.length) {
    return c.json({ error: "No active subscribers" }, 400);
  }

  const { data: send } = await supabase
    .from("newsletter_sends")
    .insert({
      content_id: id,
      subject: subject || item.title,
      preview_text,
      recipient_count: subscribers.length,
      status: "sending",
    })
    .select()
    .single();

  const resend = new Resend(c.env.RESEND_API_KEY);
  const fromAddress = c.env.NEWSLETTER_FROM || "Nick Sheetz <nick@sheetzlabs.com>";

  try {
    const { data: batch } = await resend.batch.send(
      subscribers.map((sub: any) => ({
        from: fromAddress,
        to: sub.email,
        subject: subject || item.title,
        html: formatNewsletterHTML(item, sub),
        text: item.body,
      }))
    );

    await supabase
      .from("newsletter_sends")
      .update({
        status: "sent",
        sent_at: new Date().toISOString(),
        resend_id: (batch as any)?.id,
      })
      .eq("id", send?.id);

    await supabase
      .from("content")
      .update({
        status: "published",
        published_at: new Date().toISOString(),
      })
      .eq("id", id);

    return c.json({ success: true, sent_to: subscribers.length });
  } catch (error: any) {
    await supabase
      .from("newsletter_sends")
      .update({ status: "failed" })
      .eq("id", send?.id);

    return c.json({ error: error.message }, 500);
  }
});

export default content;

// ============================================
// HELPERS
// ============================================

function formatNewsletterHTML(item: any, subscriber: any): string {
  return `
<!DOCTYPE html>
<html>
<head>
  <style>
    body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px; }
    h1 { color: #111; }
    a { color: #2FE8B6; }
    .footer { margin-top: 40px; padding-top: 20px; border-top: 1px solid #eee; font-size: 12px; color: #666; }
  </style>
</head>
<body>
  <h1>${item.title}</h1>
  ${item.body
    .split("\n")
    .map((p: string) => `<p>${p}</p>`)
    .join("")}
  <div class="footer">
    <p>You're receiving this because you subscribed to updates from Nick Sheetz.</p>
    <p><a href="{{unsubscribe_url}}">Unsubscribe</a></p>
  </div>
</body>
</html>
  `.trim();
}
