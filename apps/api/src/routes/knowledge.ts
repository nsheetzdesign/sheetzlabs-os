import { Hono } from "hono";
import { createClient } from "@supabase/supabase-js";
import Anthropic from "@anthropic-ai/sdk";

type Bindings = {
  SUPABASE_URL: string;
  SUPABASE_SERVICE_ROLE_KEY: string;
  ANTHROPIC_API_KEY: string;
};

const knowledge = new Hono<{ Bindings: Bindings }>();

// ============================================================
// KNOWLEDGE CRUD
// ============================================================

knowledge.get("/", async (c) => {
  const supabase = createClient(c.env.SUPABASE_URL, c.env.SUPABASE_SERVICE_ROLE_KEY);
  const type = c.req.query("type");
  const venture_id = c.req.query("venture_id");
  const tag = c.req.query("tag");
  const search = c.req.query("search");
  const pinned_only = c.req.query("pinned_only") === "true";

  let query = supabase
    .from("knowledge")
    .select(
      `*, ventures(id, name, slug), knowledge_tags(tag_id, tags(id, name, color))`
    )
    .order("updated_at", { ascending: false })
    .limit(100);

  if (type && type !== "all") query = query.eq("type", type);
  if (venture_id) query = query.eq("venture_id", venture_id);
  if (pinned_only) query = query.eq("is_pinned", true);
  if (search) {
    query = query.textSearch("title", search, { type: "websearch" });
  }

  const { data } = await query;

  let filtered = data || [];
  if (tag) {
    filtered = filtered.filter((k: any) =>
      k.knowledge_tags?.some((kt: any) => kt.tags?.name === tag)
    );
  }

  return c.json({ knowledge: filtered });
});

knowledge.get("/tags/list", async (c) => {
  const supabase = createClient(c.env.SUPABASE_URL, c.env.SUPABASE_SERVICE_ROLE_KEY);
  const { data } = await supabase.from("tags").select("*").order("name");
  return c.json({ tags: data || [] });
});

knowledge.get("/captures", async (c) => {
  const supabase = createClient(c.env.SUPABASE_URL, c.env.SUPABASE_SERVICE_ROLE_KEY);
  const processed = c.req.query("processed") === "true";
  const { data } = await supabase
    .from("captures")
    .select("*")
    .eq("processed", processed)
    .order("created_at", { ascending: false });
  return c.json({ captures: data || [] });
});

knowledge.get("/feeds", async (c) => {
  const supabase = createClient(c.env.SUPABASE_URL, c.env.SUPABASE_SERVICE_ROLE_KEY);
  const { data } = await supabase.from("feed_sources").select("*").order("name");
  return c.json({ feeds: data || [] });
});

knowledge.get("/feeds/items/unread", async (c) => {
  const supabase = createClient(c.env.SUPABASE_URL, c.env.SUPABASE_SERVICE_ROLE_KEY);
  const { data } = await supabase
    .from("feed_items")
    .select("*, feed_sources(name, category)")
    .eq("is_read", false)
    .order("published_at", { ascending: false })
    .limit(100);
  return c.json({ items: data || [] });
});

knowledge.get("/feeds/:id/items", async (c) => {
  const { id } = c.req.param();
  const supabase = createClient(c.env.SUPABASE_URL, c.env.SUPABASE_SERVICE_ROLE_KEY);
  const unread_only = c.req.query("unread_only") === "true";

  let query = supabase
    .from("feed_items")
    .select("*")
    .eq("source_id", id)
    .order("published_at", { ascending: false })
    .limit(50);

  if (unread_only) query = query.eq("is_read", false);
  const { data } = await query;
  return c.json({ items: data || [] });
});

knowledge.get("/:id", async (c) => {
  const { id } = c.req.param();
  const supabase = createClient(c.env.SUPABASE_URL, c.env.SUPABASE_SERVICE_ROLE_KEY);

  const { data } = await supabase
    .from("knowledge")
    .select(
      `*, ventures(id, name, slug), knowledge_tags(tag_id, tags(id, name, color)), parent:parent_id(id, title)`
    )
    .eq("id", id)
    .single();

  return c.json({ item: data });
});

knowledge.post("/", async (c) => {
  const body = await c.req.json();
  const supabase = createClient(c.env.SUPABASE_URL, c.env.SUPABASE_SERVICE_ROLE_KEY);
  const { tags: tagNames, ...itemData } = body;

  if (itemData.content) {
    const words = itemData.content.trim().split(/\s+/).length;
    itemData.word_count = words;
    itemData.reading_time = Math.ceil(words / 200);
  }

  const { data: item } = await supabase.from("knowledge").insert(itemData).select().single();

  if (tagNames && tagNames.length > 0 && item) {
    await linkTags(item.id, tagNames, supabase);
  }

  return c.json({ item });
});

knowledge.patch("/:id", async (c) => {
  const { id } = c.req.param();
  const body = await c.req.json();
  const supabase = createClient(c.env.SUPABASE_URL, c.env.SUPABASE_SERVICE_ROLE_KEY);
  const { tags: tagNames, ...itemData } = body;

  if (itemData.content) {
    const words = itemData.content.trim().split(/\s+/).length;
    itemData.word_count = words;
    itemData.reading_time = Math.ceil(words / 200);
  }

  const { data: item } = await supabase
    .from("knowledge")
    .update(itemData)
    .eq("id", id)
    .select()
    .single();

  if (tagNames !== undefined && item) {
    await supabase.from("knowledge_tags").delete().eq("knowledge_id", id);
    if (tagNames.length > 0) await linkTags(id, tagNames, supabase);
  }

  return c.json({ item });
});

knowledge.delete("/:id", async (c) => {
  const { id } = c.req.param();
  const supabase = createClient(c.env.SUPABASE_URL, c.env.SUPABASE_SERVICE_ROLE_KEY);
  await supabase.from("knowledge").delete().eq("id", id);
  return c.json({ success: true });
});

// Toggle pin
knowledge.post("/:id/pin", async (c) => {
  const { id } = c.req.param();
  const supabase = createClient(c.env.SUPABASE_URL, c.env.SUPABASE_SERVICE_ROLE_KEY);
  const { data: current } = await supabase
    .from("knowledge")
    .select("is_pinned")
    .eq("id", id)
    .single();
  const { data } = await supabase
    .from("knowledge")
    .update({ is_pinned: !current?.is_pinned })
    .eq("id", id)
    .select()
    .single();
  return c.json({ item: data });
});

// AI Summarize
knowledge.post("/:id/summarize", async (c) => {
  const { id } = c.req.param();
  const supabase = createClient(c.env.SUPABASE_URL, c.env.SUPABASE_SERVICE_ROLE_KEY);
  const { data: item } = await supabase.from("knowledge").select("*").eq("id", id).single();

  if (!item?.content) return c.json({ error: "No content to summarize" }, 400);

  const anthropic = new Anthropic({ apiKey: c.env.ANTHROPIC_API_KEY });
  const response = await anthropic.messages.create({
    model: "claude-sonnet-4-6",
    max_tokens: 300,
    system: "Summarize the following content in 2-3 sentences. Be concise and capture the key points.",
    messages: [{ role: "user", content: item.content }],
  });

  const summary = response.content[0].type === "text" ? response.content[0].text : "";
  await supabase.from("knowledge").update({ summary }).eq("id", id);
  return c.json({ summary });
});

// ============================================================
// TAGS
// ============================================================

knowledge.post("/tags", async (c) => {
  const body = await c.req.json();
  const supabase = createClient(c.env.SUPABASE_URL, c.env.SUPABASE_SERVICE_ROLE_KEY);
  const { data } = await supabase.from("tags").insert(body).select().single();
  return c.json({ tag: data });
});

knowledge.delete("/tags/:id", async (c) => {
  const { id } = c.req.param();
  const supabase = createClient(c.env.SUPABASE_URL, c.env.SUPABASE_SERVICE_ROLE_KEY);
  await supabase.from("tags").delete().eq("id", id);
  return c.json({ success: true });
});

// ============================================================
// QUICK CAPTURE
// ============================================================

knowledge.post("/captures", async (c) => {
  const body = await c.req.json();
  const supabase = createClient(c.env.SUPABASE_URL, c.env.SUPABASE_SERVICE_ROLE_KEY);
  const { data } = await supabase.from("captures").insert(body).select().single();
  return c.json({ capture: data });
});

knowledge.post("/captures/:id/process", async (c) => {
  const { id } = c.req.param();
  const body = await c.req.json();
  const supabase = createClient(c.env.SUPABASE_URL, c.env.SUPABASE_SERVICE_ROLE_KEY);

  const { data: capture } = await supabase.from("captures").select("*").eq("id", id).single();
  if (!capture) return c.json({ error: "Capture not found" }, 404);

  const slug = (body.title || capture.source_title || "untitled")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");

  const { data: item } = await supabase
    .from("knowledge")
    .insert({
      title: body.title || capture.source_title || "Untitled Capture",
      slug: `${slug}-${Date.now()}`,
      content: capture.content,
      type: body.type || "clip",
      source_url: capture.source_url,
      source_type: "clip",
    })
    .select()
    .single();

  await supabase
    .from("captures")
    .update({ processed: true, knowledge_id: item?.id })
    .eq("id", id);

  return c.json({ item });
});

knowledge.delete("/captures/:id", async (c) => {
  const { id } = c.req.param();
  const supabase = createClient(c.env.SUPABASE_URL, c.env.SUPABASE_SERVICE_ROLE_KEY);
  await supabase.from("captures").delete().eq("id", id);
  return c.json({ success: true });
});

// ============================================================
// RSS FEEDS
// ============================================================

knowledge.post("/feeds", async (c) => {
  const body = await c.req.json();
  const supabase = createClient(c.env.SUPABASE_URL, c.env.SUPABASE_SERVICE_ROLE_KEY);
  const { data } = await supabase.from("feed_sources").insert(body).select().single();
  return c.json({ feed: data });
});

knowledge.delete("/feeds/:id", async (c) => {
  const { id } = c.req.param();
  const supabase = createClient(c.env.SUPABASE_URL, c.env.SUPABASE_SERVICE_ROLE_KEY);
  await supabase.from("feed_items").delete().eq("source_id", id);
  await supabase.from("feed_sources").delete().eq("id", id);
  return c.json({ success: true });
});

knowledge.post("/feeds/:id/fetch", async (c) => {
  const { id } = c.req.param();
  const supabase = createClient(c.env.SUPABASE_URL, c.env.SUPABASE_SERVICE_ROLE_KEY);

  const { data: feed } = await supabase.from("feed_sources").select("*").eq("id", id).single();
  if (!feed) return c.json({ error: "Feed not found" }, 404);

  const response = await fetch(feed.url);
  const text = await response.text();
  const items = parseRSS(text);

  let addedCount = 0;
  for (const item of items) {
    const { error } = await supabase.from("feed_items").upsert(
      {
        source_id: id,
        external_id: item.guid || item.link,
        title: item.title,
        url: item.link,
        content: item.description,
        published_at: item.pubDate ? new Date(item.pubDate).toISOString() : null,
      },
      { onConflict: "source_id,external_id", ignoreDuplicates: true }
    );
    if (!error) addedCount++;
  }

  await supabase
    .from("feed_sources")
    .update({ last_fetched_at: new Date().toISOString() })
    .eq("id", id);

  return c.json({ message: "Feed fetched", added: addedCount });
});

knowledge.patch("/feeds/items/:id/read", async (c) => {
  const { id } = c.req.param();
  const supabase = createClient(c.env.SUPABASE_URL, c.env.SUPABASE_SERVICE_ROLE_KEY);
  await supabase.from("feed_items").update({ is_read: true }).eq("id", id);
  return c.json({ success: true });
});

knowledge.post("/feeds/items/:id/save", async (c) => {
  const { id } = c.req.param();
  const body = await c.req.json();
  const supabase = createClient(c.env.SUPABASE_URL, c.env.SUPABASE_SERVICE_ROLE_KEY);

  const { data: feedItem } = await supabase
    .from("feed_items")
    .select("*, feed_sources(name, category)")
    .eq("id", id)
    .single();

  if (!feedItem) return c.json({ error: "Item not found" }, 404);

  let summary = feedItem.summary;
  if (!summary && feedItem.content) {
    const anthropic = new Anthropic({ apiKey: c.env.ANTHROPIC_API_KEY });
    const response = await anthropic.messages.create({
      model: "claude-sonnet-4-6",
      max_tokens: 200,
      system: "Summarize this article in 1-2 sentences.",
      messages: [{ role: "user", content: feedItem.content }],
    });
    summary = response.content[0].type === "text" ? response.content[0].text : "";
    await supabase.from("feed_items").update({ summary }).eq("id", id);
  }

  const titleSlug = feedItem.title
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "")
    .slice(0, 60);

  const { data: item } = await supabase
    .from("knowledge")
    .insert({
      title: feedItem.title,
      slug: `${titleSlug}-${Date.now()}`,
      content: feedItem.content,
      summary,
      type: body.type || "clip",
      source_url: feedItem.url,
      source_type: "rss",
    })
    .select()
    .single();

  await supabase
    .from("feed_items")
    .update({ is_saved: true, is_read: true, knowledge_id: item?.id })
    .eq("id", id);

  return c.json({ item });
});

export default knowledge;

// ============================================================
// HELPERS
// ============================================================

async function linkTags(knowledgeId: string, tagNames: string[], supabase: any) {
  for (const name of tagNames) {
    const { data: tag } = await supabase
      .from("tags")
      .upsert({ name: name.toLowerCase().trim() }, { onConflict: "name" })
      .select()
      .single();

    if (tag) {
      await supabase
        .from("knowledge_tags")
        .upsert(
          { knowledge_id: knowledgeId, tag_id: tag.id },
          { onConflict: "knowledge_id,tag_id" }
        );
    }
  }
}

function parseRSS(xml: string): any[] {
  const items: any[] = [];
  const itemMatches = xml.matchAll(/<item>([\s\S]*?)<\/item>/g);

  for (const match of itemMatches) {
    const itemXml = match[1];
    const getTag = (tag: string) => {
      const m = itemXml.match(new RegExp(`<${tag}[^>]*>([\\s\\S]*?)<\\/${tag}>`));
      return m ? m[1].replace(/<!\[CDATA\[|\]\]>/g, "").trim() : null;
    };
    items.push({
      title: getTag("title"),
      link: getTag("link"),
      description: getTag("description"),
      guid: getTag("guid"),
      pubDate: getTag("pubDate"),
    });
  }

  return items;
}
