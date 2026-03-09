import type { ActionFunctionArgs, LoaderFunctionArgs, MetaFunction } from "react-router";
import {
  useLoaderData,
  useSearchParams,
  useNavigate,
  useFetcher,
} from "react-router";
import { useEffect, useRef, useState } from "react";
import { Crown, Megaphone, Package, DollarSign, Search, Settings, MessageSquare, Plus, Send } from "lucide-react";
import { Header } from "~/components/dashboard/Header";
import { getSupabaseClient } from "~/lib/supabase.server";

export const meta: MetaFunction = () => [{ title: "Chat — Sheetz Labs OS" }];

const DEPARTMENTS = [
  { id: "executive", label: "Chief of Staff", icon: Crown },
  { id: "marketing", label: "Marketing", icon: Megaphone },
  { id: "product", label: "Product", icon: Package },
  { id: "finance", label: "Finance", icon: DollarSign },
  { id: "research", label: "Research", icon: Search },
  { id: "operations", label: "Operations", icon: Settings },
] as const;

// ─── Loader ───────────────────────────────────────────────────────────────────

export async function loader({ request, context }: LoaderFunctionArgs) {
  const supabase = getSupabaseClient(context.cloudflare.env);
  const url = new URL(request.url);
  const conversationId = url.searchParams.get("conversation");
  const department = url.searchParams.get("department");

  const { data: conversations } = await supabase
    .from("chat_conversations")
    .select("id, title, department, last_message_at, message_count")
    .eq("is_archived", false)
    .order("last_message_at", { ascending: false, nullsFirst: false })
    .limit(20);

  let messages: any[] = [];
  let activeConversation: any = null;

  if (conversationId) {
    const [convRes, msgsRes] = await Promise.all([
      supabase
        .from("chat_conversations")
        .select("*")
        .eq("id", conversationId)
        .single(),
      supabase
        .from("chat_messages")
        .select("*")
        .eq("conversation_id", conversationId)
        .order("created_at"),
    ]);
    activeConversation = convRes.data;
    messages = msgsRes.data || [];
  }

  return {
    conversations: conversations || [],
    messages,
    activeConversation,
    department,
  };
}

// ─── Action ───────────────────────────────────────────────────────────────────

export async function action({ request, context }: ActionFunctionArgs) {
  const env = context.cloudflare.env as Record<string, string>;
  const formData = await request.formData();
  const intent = formData.get("intent") as string;
  const apiUrl = env.API_URL ?? "https://api.sheetzlabs.com";

  if (intent === "create_conversation") {
    const department = formData.get("department") as string | null;
    const res = await fetch(`${apiUrl}/chat/conversations`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ department: department || null }),
    });
    return await res.json();
  }

  if (intent === "send_message") {
    const conversationId = formData.get("conversationId") as string;
    const content = formData.get("content") as string;
    const res = await fetch(
      `${apiUrl}/chat/conversations/${conversationId}/messages`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ content }),
      }
    );
    return await res.json();
  }

  return null;
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function Chat() {
  const { conversations, messages: initialMessages, activeConversation, department } =
    useLoaderData<typeof loader>();
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();
  const createFetcher = useFetcher<any>();
  const sendFetcher = useFetcher<any>();

  const [conversationId, setConversationId] = useState<string | null>(
    activeConversation?.id ?? null
  );
  const [messages, setMessages] = useState<any[]>(initialMessages);
  const [input, setInput] = useState("");
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Scroll to bottom on new messages
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, sendFetcher.state]);

  // When create fetcher returns, navigate to the new conversation
  useEffect(() => {
    if (createFetcher.data?.conversation) {
      const conv = createFetcher.data.conversation;
      setConversationId(conv.id);
      setMessages([]);
      const params = new URLSearchParams(searchParams);
      params.set("conversation", conv.id);
      setSearchParams(params, { replace: true });
    }
  }, [createFetcher.data]);

  // When send fetcher returns assistant message, add it to messages
  useEffect(() => {
    if (sendFetcher.data?.message) {
      setMessages((prev) => [...prev, sendFetcher.data.message]);
    }
  }, [sendFetcher.data]);

  function startConversation(dept?: string) {
    setMessages([]);
    setConversationId(null);
    const params = new URLSearchParams();
    if (dept) params.set("department", dept);
    setSearchParams(params, { replace: true });
  }

  function openConversation(id: string) {
    navigate(`/dashboard/chat?conversation=${id}`, { replace: true });
  }

  function sendMessage() {
    if (!input.trim() || sendFetcher.state !== "idle") return;

    // Optimistically add user message
    const userMsg = { role: "user", content: input, id: `temp-${Date.now()}` };
    setMessages((prev) => [...prev, userMsg]);
    const content = input;
    setInput("");

    if (!conversationId) {
      // Need to create a conversation first — use a combined approach:
      // Store the pending message, create conversation, then send
      setPendingMessage(content);
      createFetcher.submit(
        { intent: "create_conversation", department: department || "" },
        { method: "post" }
      );
    } else {
      sendFetcher.submit(
        { intent: "send_message", conversationId, content },
        { method: "post" }
      );
    }
  }

  const [pendingMessage, setPendingMessage] = useState<string | null>(null);

  // After conversation created, send the pending message
  useEffect(() => {
    if (createFetcher.data?.conversation && pendingMessage) {
      const conv = createFetcher.data.conversation;
      sendFetcher.submit(
        { intent: "send_message", conversationId: conv.id, content: pendingMessage },
        { method: "post" }
      );
      setPendingMessage(null);
    }
  }, [createFetcher.data, pendingMessage]);

  const isLoading =
    sendFetcher.state !== "idle" || createFetcher.state !== "idle";

  const activeDept = activeConversation?.department || department || null;
  const deptInfo = DEPARTMENTS.find((d) => d.id === activeDept);

  return (
    <div className="flex h-full">
      {/* ── Sidebar ── */}
      <div className="flex w-60 flex-col border-r border-surface-2/50">
        {/* New chat button */}
        <div className="border-b border-surface-2/50 p-3">
          <button
            onClick={() => startConversation(department || undefined)}
            className="flex w-full items-center gap-2 rounded-lg bg-brand/10 px-3 py-2 text-sm text-brand hover:bg-brand/20 transition-colors"
          >
            <Plus className="h-4 w-4" />
            New Conversation
          </button>
        </div>

        {/* Department list */}
        <div className="border-b border-surface-2/50 p-3">
          <div className="mb-2 px-1 text-xs font-medium uppercase tracking-wider text-zinc-600">
            Departments
          </div>
          <div className="space-y-0.5">
            <button
              onClick={() => startConversation()}
              className={`flex w-full items-center gap-2 rounded-lg px-2 py-1.5 text-sm transition-colors ${
                !activeDept
                  ? "bg-surface-2 text-white"
                  : "text-zinc-500 hover:text-zinc-300 hover:bg-surface-1/50"
              }`}
            >
              <Crown className="h-3.5 w-3.5 shrink-0" />
              Chief of Staff
            </button>
            {DEPARTMENTS.slice(1).map(({ id, label, icon: Icon }) => (
              <button
                key={id}
                onClick={() => startConversation(id)}
                className={`flex w-full items-center gap-2 rounded-lg px-2 py-1.5 text-sm transition-colors ${
                  activeDept === id
                    ? "bg-surface-2 text-white"
                    : "text-zinc-500 hover:text-zinc-300 hover:bg-surface-1/50"
                }`}
              >
                <Icon className="h-3.5 w-3.5 shrink-0" />
                {label}
              </button>
            ))}
          </div>
        </div>

        {/* Recent conversations */}
        <div className="min-h-0 flex-1 overflow-y-auto p-3">
          {conversations.length > 0 && (
            <>
              <div className="mb-2 px-1 text-xs font-medium uppercase tracking-wider text-zinc-600">
                Recent
              </div>
              <div className="space-y-0.5">
                {conversations.map((c: any) => (
                  <button
                    key={c.id}
                    onClick={() => openConversation(c.id)}
                    className={`w-full truncate rounded-lg px-2 py-1.5 text-left text-sm transition-colors ${
                      conversationId === c.id
                        ? "bg-surface-2 text-white"
                        : "text-zinc-500 hover:text-zinc-300 hover:bg-surface-1/50"
                    }`}
                  >
                    {c.title || "New Conversation"}
                  </button>
                ))}
              </div>
            </>
          )}
        </div>
      </div>

      {/* ── Main chat area ── */}
      <div className="flex flex-1 flex-col overflow-hidden">
        <Header title={deptInfo ? `${deptInfo.label} AI` : "Chief of Staff AI"} />

        {/* Messages */}
        <div className="flex-1 overflow-y-auto p-6">
          {messages.length === 0 && !isLoading && (
            <div className="flex h-full flex-col items-center justify-center text-center">
              <MessageSquare className="mb-4 h-12 w-12 text-zinc-700" />
              <p className="text-sm text-zinc-500">
                Start a conversation with your AI team
              </p>
              <p className="mt-1 text-xs text-zinc-600">
                Ask questions, get insights, or request actions
              </p>
            </div>
          )}

          <div className="mx-auto max-w-3xl space-y-4">
            {messages.map((m, i) => (
              <div
                key={m.id || i}
                className={`flex ${m.role === "user" ? "justify-end" : "justify-start"}`}
              >
                <div
                  className={`max-w-2xl rounded-2xl px-4 py-3 text-sm ${
                    m.role === "user"
                      ? "bg-brand text-white"
                      : "border border-surface-2/50 bg-surface-1/60 text-zinc-100"
                  }`}
                >
                  <div className="whitespace-pre-wrap leading-relaxed">{m.content}</div>
                  {m.cost_cents && (
                    <div className="mt-1.5 text-xs opacity-40">
                      ${(m.cost_cents / 100).toFixed(4)}
                    </div>
                  )}
                </div>
              </div>
            ))}

            {isLoading && (
              <div className="flex justify-start">
                <div className="rounded-2xl border border-surface-2/50 bg-surface-1/60 px-4 py-3">
                  <div className="flex gap-1">
                    {[0, 0.15, 0.3].map((delay, i) => (
                      <span
                        key={i}
                        className="h-2 w-2 animate-bounce rounded-full bg-zinc-500"
                        style={{ animationDelay: `${delay}s` }}
                      />
                    ))}
                  </div>
                </div>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>
        </div>

        {/* Input */}
        <div className="border-t border-surface-2/50 p-4">
          <div className="mx-auto flex max-w-3xl gap-3">
            <textarea
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter" && !e.shiftKey) {
                  e.preventDefault();
                  sendMessage();
                }
              }}
              placeholder={`Message ${deptInfo?.label ?? "Chief of Staff"}… (Enter to send, Shift+Enter for newline)`}
              rows={2}
              className="flex-1 resize-none rounded-xl border border-surface-2 bg-surface-1/50 px-4 py-3 text-sm text-zinc-100 placeholder-zinc-600 outline-none transition-colors focus:border-brand/50"
            />
            <button
              onClick={sendMessage}
              disabled={!input.trim() || isLoading}
              className="flex items-center justify-center rounded-xl bg-brand px-4 text-white transition-colors hover:bg-brand/80 disabled:cursor-not-allowed disabled:opacity-40"
            >
              <Send className="h-4 w-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
