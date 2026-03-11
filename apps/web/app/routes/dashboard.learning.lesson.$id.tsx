import type { LoaderFunctionArgs, ActionFunctionArgs } from "react-router";
import { useState } from "react";
import { useLoaderData, Link, useFetcher } from "react-router";
import { ChevronLeft, CheckCircle, Clock, Sparkles, RefreshCw } from "lucide-react";

export async function loader({ params, context }: LoaderFunctionArgs) {
  const response = await fetch(
    `${context.cloudflare.env.API_URL}/learning/lessons/${params.id}`
  );
  const data: any = await response.json();

  if (!data.lesson) {
    throw new Response("Not Found", { status: 404 });
  }

  return { lesson: data.lesson };
}

export async function action({ request, params, context }: ActionFunctionArgs) {
  const formData = await request.formData();
  const intent = formData.get("intent");

  if (intent === "complete") {
    await fetch(
      `${context.cloudflare.env.API_URL}/learning/lessons/${params.id}/complete`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Cookie: request.headers.get("Cookie") || "",
        },
        body: JSON.stringify({
          time_spent_seconds:
            parseInt(formData.get("time_spent") as string) || 0,
        }),
      }
    );
  }

  if (intent === "generate") {
    const response = await fetch(
      `${context.cloudflare.env.API_URL}/learning/lessons/${params.id}/generate`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Cookie: request.headers.get("Cookie") || "",
        },
      }
    );

    if (!response.ok) {
      return { error: "Failed to generate content" };
    }

    return { success: true };
  }

  return { success: true };
}

function MarkdownContent({ content }: { content: string }) {
  // Simple markdown renderer without external dependency
  const lines = content.split("\n");
  const elements: React.ReactNode[] = [];
  let i = 0;

  while (i < lines.length) {
    const line = lines[i];

    if (line.startsWith("### ")) {
      elements.push(
        <h3 key={i} className="text-lg font-semibold text-zinc-100 mt-6 mb-2">
          {line.slice(4)}
        </h3>
      );
    } else if (line.startsWith("## ")) {
      elements.push(
        <h2 key={i} className="text-xl font-semibold text-zinc-100 mt-8 mb-3">
          {line.slice(3)}
        </h2>
      );
    } else if (line.startsWith("# ")) {
      elements.push(
        <h1 key={i} className="text-2xl font-bold text-zinc-100 mt-8 mb-4">
          {line.slice(2)}
        </h1>
      );
    } else if (line.startsWith("```")) {
      const codeLines: string[] = [];
      i++;
      while (i < lines.length && !lines[i].startsWith("```")) {
        codeLines.push(lines[i]);
        i++;
      }
      elements.push(
        <pre
          key={i}
          className="bg-zinc-800 rounded-lg p-4 overflow-x-auto my-4 text-sm text-zinc-200 font-mono"
        >
          <code>{codeLines.join("\n")}</code>
        </pre>
      );
    } else if (line.startsWith("- ") || line.startsWith("* ")) {
      const items: string[] = [];
      while (
        i < lines.length &&
        (lines[i].startsWith("- ") || lines[i].startsWith("* "))
      ) {
        items.push(lines[i].slice(2));
        i++;
      }
      elements.push(
        <ul key={i} className="list-disc list-inside space-y-1 my-3 text-zinc-300">
          {items.map((item, j) => (
            <li key={j}>{item}</li>
          ))}
        </ul>
      );
      continue;
    } else if (line.trim() === "") {
      // skip blank lines
    } else {
      elements.push(
        <p key={i} className="text-zinc-300 my-3 leading-relaxed">
          {line}
        </p>
      );
    }

    i++;
  }

  return <div>{elements}</div>;
}

export default function LessonPage() {
  const { lesson } = useLoaderData<typeof loader>();
  const fetcher = useFetcher();
  const [startTime] = useState(Date.now());

  const pathSlug = lesson.learning_modules.learning_paths.slug;
  const pathTitle = lesson.learning_modules.learning_paths.title;

  const isGenerating =
    fetcher.state !== "idle" &&
    fetcher.formData?.get("intent") === "generate";

  const handleComplete = () => {
    const timeSpent = Math.round((Date.now() - startTime) / 1000);
    fetcher.submit(
      { intent: "complete", time_spent: timeSpent.toString() },
      { method: "post" }
    );
  };

  return (
    <div className="max-w-3xl py-6">
      {/* Breadcrumb */}
      <div className="mb-6">
        <Link
          to={`/dashboard/learning/path/${pathSlug}`}
          className="text-sm text-zinc-400 hover:text-zinc-200 flex items-center gap-1"
        >
          <ChevronLeft className="w-4 h-4" />
          {pathTitle}
        </Link>
      </div>

      {/* Lesson header */}
      <div className="mb-8">
        <p className="text-sm text-emerald-400 mb-2">
          {lesson.learning_modules.title}
        </p>
        <h1 className="text-2xl font-semibold text-zinc-100">{lesson.title}</h1>
        <div className="flex items-center gap-2 mt-2 text-sm text-zinc-500">
          <Clock className="w-4 h-4" />
          {lesson.estimated_minutes} min
        </div>
      </div>

      {/* Content */}
      <div className="mb-8">
        {lesson.content ? (
          <>
            <MarkdownContent content={lesson.content} />

            {/* Regenerate button */}
            <div className="mt-8 pt-4 border-t border-zinc-800">
              <fetcher.Form method="post">
                <input type="hidden" name="intent" value="generate" />
                <button
                  type="submit"
                  disabled={isGenerating}
                  className="flex items-center gap-2 text-sm text-zinc-400 hover:text-zinc-200 disabled:opacity-50"
                >
                  <RefreshCw
                    className={`w-4 h-4 ${isGenerating ? "animate-spin" : ""}`}
                  />
                  {isGenerating ? "Regenerating..." : "Regenerate with AI"}
                </button>
              </fetcher.Form>
            </div>
          </>
        ) : (
          <div className="bg-zinc-800 rounded-lg p-8 text-center">
            <Sparkles className="w-12 h-12 text-emerald-400 mx-auto mb-4" />
            <p className="text-zinc-300 mb-4">
              This lesson hasn&apos;t been written yet.
            </p>
            <fetcher.Form method="post">
              <input type="hidden" name="intent" value="generate" />
              <button
                type="submit"
                disabled={isGenerating}
                className="px-6 py-3 bg-emerald-600 hover:bg-emerald-500 rounded-lg text-white font-medium disabled:opacity-50 flex items-center gap-2 mx-auto"
              >
                {isGenerating ? (
                  <>
                    <RefreshCw className="w-5 h-5 animate-spin" />
                    Generating...
                  </>
                ) : (
                  <>
                    <Sparkles className="w-5 h-5" />
                    Generate with AI
                  </>
                )}
              </button>
            </fetcher.Form>
          </div>
        )}
      </div>

      {/* Complete button */}
      <div className="flex justify-between items-center pt-6 border-t border-zinc-800">
        <button
          onClick={handleComplete}
          disabled={fetcher.state !== "idle"}
          className="flex items-center gap-2 px-6 py-3 bg-emerald-600 hover:bg-emerald-500 rounded-lg text-white font-medium disabled:opacity-50"
        >
          <CheckCircle className="w-5 h-5" />
          {fetcher.state !== "idle" &&
          fetcher.formData?.get("intent") === "complete"
            ? "Saving..."
            : "Mark Complete"}
        </button>
      </div>
    </div>
  );
}
