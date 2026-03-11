import { Hono } from "hono";
import { createClient } from "@supabase/supabase-js";
import type { Database } from "@sheetzlabs/shared";

const app = new Hono<{
  Bindings: { SUPABASE_URL: string; SUPABASE_SERVICE_ROLE_KEY: string; ANTHROPIC_API_KEY: string };
}>();

// Get all learning paths
app.get("/paths", async (c) => {
  const supabase = createClient<Database>(c.env.SUPABASE_URL, c.env.SUPABASE_SERVICE_ROLE_KEY);

  const { data: paths, error } = await supabase
    .from("learning_paths")
    .select(`*, learning_modules(count)`)
    .eq("is_published", true)
    .order("title");

  if (error) {
    return c.json({ error: error.message }, 500);
  }

  return c.json({ paths });
});

// Get single learning path with modules and lessons
app.get("/paths/:slug", async (c) => {
  const slug = c.req.param("slug");
  const supabase = createClient<Database>(c.env.SUPABASE_URL, c.env.SUPABASE_SERVICE_ROLE_KEY);

  const { data: path, error } = await supabase
    .from("learning_paths")
    .select(`*, learning_modules(*, learning_lessons(*))`)
    .eq("slug", slug)
    .single();

  if (error || !path) {
    return c.json({ error: "Path not found" }, 404);
  }

  // Sort modules and lessons
  path.learning_modules = path.learning_modules
    .sort((a: any, b: any) => a.sort_order - b.sort_order)
    .map((module: any) => ({
      ...module,
      learning_lessons: module.learning_lessons.sort(
        (a: any, b: any) => a.sort_order - b.sort_order
      ),
    }));

  return c.json({ path });
});

// Get lesson content
app.get("/lessons/:id", async (c) => {
  const lessonId = c.req.param("id");
  const supabase = createClient<Database>(c.env.SUPABASE_URL, c.env.SUPABASE_SERVICE_ROLE_KEY);

  const { data: lesson, error } = await supabase
    .from("learning_lessons")
    .select(
      `*, learning_exercises(*), learning_modules!inner(title, learning_paths!inner(title, slug))`
    )
    .eq("id", lessonId)
    .single();

  if (error || !lesson) {
    return c.json({ error: "Lesson not found" }, 404);
  }

  return c.json({ lesson });
});

// Get user progress for a path
app.get("/progress/:pathId", async (c) => {
  const pathId = c.req.param("pathId");
  const supabase = createClient<Database>(c.env.SUPABASE_URL, c.env.SUPABASE_SERVICE_ROLE_KEY);

  const { data: progress, error } = await supabase
    .from("learning_progress")
    .select("*")
    .eq("learning_path_id", pathId);

  if (error) {
    return c.json({ error: error.message }, 500);
  }

  return c.json({ progress });
});

// Mark lesson as complete
app.post("/lessons/:id/complete", async (c) => {
  const lessonId = c.req.param("id");
  const supabase = createClient<Database>(c.env.SUPABASE_URL, c.env.SUPABASE_SERVICE_ROLE_KEY);
  const body = await c.req.json();

  const { time_spent_seconds } = body;

  // Get lesson to find path and module
  const { data: lesson } = await supabase
    .from("learning_lessons")
    .select("*, learning_modules!inner(learning_path_id)")
    .eq("id", lessonId)
    .single();

  if (!lesson) {
    return c.json({ error: "Lesson not found" }, 404);
  }

  const { data, error } = await supabase
    .from("learning_progress")
    .upsert(
      {
        learning_path_id: lesson.learning_modules.learning_path_id,
        learning_module_id: lesson.learning_module_id,
        learning_lesson_id: lessonId,
        status: "completed",
        completed_at: new Date().toISOString(),
        time_spent_seconds: time_spent_seconds || 0,
      },
      { onConflict: "user_id,learning_lesson_id" }
    )
    .select()
    .single();

  if (error) {
    return c.json({ error: error.message }, 500);
  }

  return c.json({ progress: data });
});

// Generate content for a single lesson (AI)
app.post("/lessons/:id/generate", async (c) => {
  const lessonId = c.req.param("id");
  const supabase = createClient<Database>(c.env.SUPABASE_URL, c.env.SUPABASE_SERVICE_ROLE_KEY);

  const { data: lesson, error } = await supabase
    .from("learning_lessons")
    .select(`*, learning_modules!inner(title, learning_paths!inner(title, slug))`)
    .eq("id", lessonId)
    .single();

  if (error || !lesson) {
    return c.json({ error: "Lesson not found" }, 404);
  }

  const module = lesson.learning_modules as any;
  const path = module.learning_paths as any;

  const response = await fetch("https://api.anthropic.com/v1/messages", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "x-api-key": c.env.ANTHROPIC_API_KEY,
      "anthropic-version": "2023-06-01",
    },
    body: JSON.stringify({
      model: "claude-sonnet-4-20250514",
      max_tokens: 4096,
      system: `You are an expert technical writer creating lesson content for a developer learning platform.

Write in markdown format. Include:
- A brief intro (2-3 sentences)
- Clear explanations with practical focus
- 2-3 real code examples (use TypeScript when applicable)
- Common gotchas or tips in a "💡 Pro Tip" callout
- A "Try It Yourself" exercise at the end

Keep it engaging and practical. Target a developer who learns by doing. Aim for ${lesson.estimated_minutes} minutes of reading time.`,
      messages: [
        {
          role: "user",
          content: `Write a lesson for:

Course: ${path.title}
Module: ${module.title}
Lesson: ${lesson.title}

The lesson should cover this topic thoroughly but concisely.`,
        },
      ],
    }),
  });

  const data: any = await response.json();
  if (!data.content?.[0]?.text) {
    return c.json({ error: "Failed to generate content" }, 500);
  }
  const content = data.content[0].text;

  const { error: updateError } = await supabase
    .from("learning_lessons")
    .update({
      content,
      is_ai_generated: true,
      updated_at: new Date().toISOString(),
    })
    .eq("id", lessonId);

  if (updateError) {
    return c.json({ error: updateError.message }, 500);
  }

  return c.json({ success: true, content });
});

// Generate curriculum (AI)
app.post("/generate/curriculum", async (c) => {
  const body = await c.req.json();
  const { topic, depth, include_exercises } = body;

  const response = await fetch("https://api.anthropic.com/v1/messages", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "x-api-key": c.env.ANTHROPIC_API_KEY,
      "anthropic-version": "2023-06-01",
    },
    body: JSON.stringify({
      model: "claude-sonnet-4-20250514",
      max_tokens: 4096,
      system: `You are an expert curriculum designer. Create a learning path for the given topic.

Output valid JSON with this structure:
{
  "title": "Path title",
  "description": "2-3 sentence description",
  "estimated_hours": number,
  "difficulty": "beginner" | "intermediate" | "advanced",
  "modules": [
    {
      "title": "Module title",
      "description": "Module description",
      "estimated_minutes": number,
      "lessons": [
        {
          "title": "Lesson title",
          "description": "What this lesson covers",
          "estimated_minutes": number,
          "key_concepts": ["concept1", "concept2"]
        }
      ]
    }
  ]
}`,
      messages: [
        {
          role: "user",
          content: `Create a ${depth || "comprehensive"} learning path for: ${topic}

${include_exercises ? "Include practical exercises in each module." : ""}

The learner is a software developer who learns best through real code examples.`,
        },
      ],
    }),
  });

  const data: any = await response.json();
  const content = data.content[0].text;

  const jsonMatch = content.match(/\{[\s\S]*\}/);
  if (!jsonMatch) {
    return c.json({ error: "Failed to generate curriculum" }, 500);
  }

  const curriculum = JSON.parse(jsonMatch[0]);
  return c.json({ curriculum });
});

// Generate lesson content (AI)
app.post("/generate/lesson", async (c) => {
  const body = await c.req.json();
  const { title, description, key_concepts, codebase_context } = body;

  const response = await fetch("https://api.anthropic.com/v1/messages", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "x-api-key": c.env.ANTHROPIC_API_KEY,
      "anthropic-version": "2023-06-01",
    },
    body: JSON.stringify({
      model: "claude-sonnet-4-20250514",
      max_tokens: 4096,
      system: `You are an expert technical writer creating lesson content.

Write in markdown format. Include:
- Clear explanations with practical focus
- Real code examples (use TypeScript/React patterns)
- Common gotchas and tips
- A "Try it yourself" exercise at the end

${codebase_context ? `Reference this actual code from the learner's project when relevant:\n${codebase_context}` : ""}

Keep it engaging and practical, not academic.`,
      messages: [
        {
          role: "user",
          content: `Write a lesson on: ${title}

Description: ${description}

Key concepts to cover: ${key_concepts?.join(", ") || "N/A"}`,
        },
      ],
    }),
  });

  const data: any = await response.json();
  const content = data.content[0].text;

  return c.json({ content });
});

// Tutor chat
app.post("/chat", async (c) => {
  const supabase = createClient<Database>(c.env.SUPABASE_URL, c.env.SUPABASE_SERVICE_ROLE_KEY);
  const body = await c.req.json();

  const { conversation_id, message, path_slug, codebase_context } = body;

  // Get or create conversation
  let convId = conversation_id;
  if (!convId) {
    let pathId: string | null = null;
    if (path_slug) {
      const { data: pathData } = await supabase
        .from("learning_paths")
        .select("id")
        .eq("slug", path_slug)
        .single();
      pathId = pathData?.id ?? null;
    }

    const { data: conv } = await supabase
      .from("learning_conversations")
      .insert({ title: message.slice(0, 50), learning_path_id: pathId })
      .select()
      .single();
    convId = conv?.id;
  }

  // Save user message
  await supabase.from("learning_messages").insert({
    conversation_id: convId,
    role: "user",
    content: message,
  });

  // Get conversation history
  const { data: history } = await supabase
    .from("learning_messages")
    .select("role, content")
    .eq("conversation_id", convId)
    .order("created_at")
    .limit(20);

  const messages = (history || []).map((msg: any) => ({
    role: msg.role,
    content: msg.content,
  }));

  const response = await fetch("https://api.anthropic.com/v1/messages", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "x-api-key": c.env.ANTHROPIC_API_KEY,
      "anthropic-version": "2023-06-01",
    },
    body: JSON.stringify({
      model: "claude-sonnet-4-20250514",
      max_tokens: 2048,
      system: `You are a patient, knowledgeable tutor helping a developer learn.

${codebase_context ? `The learner is working on this codebase. Reference it when relevant:\n${codebase_context}` : ""}

${path_slug ? `The learner is studying: ${path_slug}` : ""}

Be concise but thorough. Use code examples when helpful. Encourage good practices.`,
      messages,
    }),
  });

  const data: any = await response.json();
  const assistantMessage = data.content[0].text;

  // Save assistant message
  await supabase.from("learning_messages").insert({
    conversation_id: convId,
    role: "assistant",
    content: assistantMessage,
  });

  return c.json({ conversation_id: convId, message: assistantMessage });
});

export default app;
