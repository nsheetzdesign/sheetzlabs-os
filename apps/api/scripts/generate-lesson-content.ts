import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

const ANTHROPIC_API_KEY = process.env.ANTHROPIC_API_KEY!;

async function generateLessonContent(
  lesson: any,
  module: any,
  path: any
): Promise<string> {
  const response = await fetch("https://api.anthropic.com/v1/messages", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "x-api-key": ANTHROPIC_API_KEY,
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
    throw new Error(`API error: ${JSON.stringify(data)}`);
  }
  return data.content[0].text;
}

async function main() {
  console.log("Starting bulk lesson generation...\n");

  if (!ANTHROPIC_API_KEY) {
    console.error("ANTHROPIC_API_KEY is not set");
    process.exit(1);
  }

  // Get all lessons without content
  const { data: lessons, error } = await supabase
    .from("learning_lessons")
    .select(
      `
      *,
      learning_modules!inner(
        title,
        learning_paths!inner(title, slug)
      )
    `
    )
    .is("content", null)
    .order("sort_order");

  if (error) {
    console.error("Error fetching lessons:", error);
    process.exit(1);
  }

  console.log(`Found ${lessons.length} lessons without content.\n`);

  let generated = 0;
  let failed = 0;

  for (const lesson of lessons) {
    const module = lesson.learning_modules;
    const path = module.learning_paths;

    console.log(`Generating: ${path.title} > ${module.title} > ${lesson.title}`);

    try {
      const content = await generateLessonContent(lesson, module, path);

      const { error: updateError } = await supabase
        .from("learning_lessons")
        .update({
          content,
          is_ai_generated: true,
          updated_at: new Date().toISOString(),
        })
        .eq("id", lesson.id);

      if (updateError) {
        console.error(`  ❌ Failed to save: ${updateError.message}`);
        failed++;
      } else {
        console.log(`  ✅ Generated (${content.length} chars)`);
        generated++;
      }

      // Rate limit: 1 second between requests
      await new Promise((resolve) => setTimeout(resolve, 1000));
    } catch (err) {
      console.error(`  ❌ Error: ${err}`);
      failed++;
    }
  }

  console.log(`\n=== Complete ===`);
  console.log(`Generated: ${generated}`);
  console.log(`Failed: ${failed}`);

  // Send notification
  if (process.env.RESEND_API_KEY) {
    const { Resend } = await import("resend");
    const resend = new Resend(process.env.RESEND_API_KEY);

    await resend.emails.send({
      from: "Sheetz Labs <notifications@sheetzlabs.com>",
      to: "nick@sheetzlabs.com",
      subject: `Lesson Generation Complete: ${generated} lessons`,
      html: `<p>Generated ${generated} lessons. ${failed} failed.</p>`,
    });
  }
}

main();
