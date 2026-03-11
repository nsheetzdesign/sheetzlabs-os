import { useState, useRef, useEffect } from "react";
import { useLoaderData, useFetcher, Link } from "react-router";
import {
  Send,
  Bot,
  User,
  Plus,
  MessageSquare,
  MoreHorizontal,
  Pencil,
  Trash2,
  X,
} from "lucide-react";
import type { LoaderFunctionArgs, ActionFunctionArgs } from "react-router";

export async function loader({ request, context }: LoaderFunctionArgs) {
  const url = new URL(request.url);
  const conversationId = url.searchParams.get("id");
  const apiUrl = context.cloudflare.env.API_URL;

  const convsResponse = await fetch(`${apiUrl}/learning/conversations`, {
    headers: { Cookie: request.headers.get("Cookie") || "" },
  });
  const convsData: any = convsResponse.ok ? await convsResponse.json() : {};

  let messages: any[] = [];
  if (conversationId) {
    const msgsResponse = await fetch(
      `${apiUrl}/learning/conversations/${conversationId}/messages`,
      { headers: { Cookie: request.headers.get("Cookie") || "" } }
    );
    const msgsData: any = msgsResponse.ok ? await msgsResponse.json() : {};
    messages = msgsData.messages || [];
  }

  return {
    conversations: convsData.conversations || [],
    currentConversationId: conversationId,
    messages,
    apiUrl,
  };
}

export async function action({ request, context }: ActionFunctionArgs) {
  const formData = await request.formData();
  const intent = formData.get("intent");
  const apiUrl = context.cloudflare.env.API_URL;

  if (intent === "send") {
    const message = formData.get("message") as string;
    const conversationId = formData.get("conversationId") as string;

    const response = await fetch(`${apiUrl}/learning/chat`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Cookie: request.headers.get("Cookie") || "",
      },
      body: JSON.stringify({
        conversation_id: conversationId || undefined,
        message,
      }),
    });

    const data: any = await response.json();
    return { conversationId: data.conversation_id, message: data.message };
  }

  if (intent === "rename") {
    const conversationId = formData.get("conversationId") as string;
    const title = formData.get("title") as string;

    await fetch(`${apiUrl}/learning/conversations/${conversationId}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        Cookie: request.headers.get("Cookie") || "",
      },
      body: JSON.stringify({ title }),
    });

    return { success: true };
  }

  if (intent === "delete") {
    const conversationId = formData.get("conversationId") as string;

    await fetch(`${apiUrl}/learning/conversations/${conversationId}`, {
      method: "DELETE",
      headers: { Cookie: request.headers.get("Cookie") || "" },
    });

    return { success: true, deleted: conversationId };
  }

  return null;
}

export default function TutorPage() {
  const { conversations, currentConversationId, messages: initialMessages } =
    useLoaderData<typeof loader>();
  const fetcher = useFetcher();

  const [messages, setMessages] = useState(initialMessages);
  const [input, setInput] = useState("");
  const [conversationId, setConversationId] = useState<string | null>(
    currentConversationId
  );
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editTitle, setEditTitle] = useState("");
  const [menuOpenId, setMenuOpenId] = useState<string | null>(null);
  const [localConversations, setLocalConversations] = useState(conversations);

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const isLoading = fetcher.state !== "idle";

  useEffect(() => {
    setMessages(initialMessages);
    setConversationId(currentConversationId);
    setLocalConversations(conversations);
  }, [initialMessages, currentConversationId, conversations]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  useEffect(() => {
    if (fetcher.data?.conversationId && fetcher.data?.message) {
      const newConvId = fetcher.data.conversationId;
      setConversationId(newConvId);
      setMessages((prev: any[]) => [
        ...prev,
        { role: "assistant", content: fetcher.data.message },
      ]);
      // Add new conversation to sidebar if it's new
      setLocalConversations((prev: any[]) => {
        if (prev.find((c: any) => c.id === newConvId)) return prev;
        return [
          { id: newConvId, title: messages[0]?.content?.slice(0, 50) || "New Chat", updated_at: new Date().toISOString() },
          ...prev,
        ];
      });
    }
  }, [fetcher.data]);

  // Close menu on outside click
  useEffect(() => {
    const handler = () => setMenuOpenId(null);
    document.addEventListener("click", handler);
    return () => document.removeEventListener("click", handler);
  }, []);

  const handleSend = () => {
    if (!input.trim() || isLoading) return;

    const userMessage = input.trim();
    setInput("");
    setMessages((prev: any[]) => [
      ...prev,
      { role: "user", content: userMessage },
    ]);

    fetcher.submit(
      {
        intent: "send",
        message: userMessage,
        conversationId: conversationId || "",
      },
      { method: "post" }
    );
  };

  const handleNewChat = () => {
    setConversationId(null);
    setMessages([]);
    inputRef.current?.focus();
  };

  const handleRename = (id: string) => {
    fetcher.submit(
      { intent: "rename", conversationId: id, title: editTitle },
      { method: "post" }
    );
    setLocalConversations((prev: any[]) =>
      prev.map((c: any) => (c.id === id ? { ...c, title: editTitle } : c))
    );
    setEditingId(null);
    setEditTitle("");
  };

  const handleDelete = (id: string) => {
    if (!confirm("Delete this conversation?")) return;
    fetcher.submit({ intent: "delete", conversationId: id }, { method: "post" });
    setLocalConversations((prev: any[]) => prev.filter((c: any) => c.id !== id));
    if (conversationId === id) {
      setConversationId(null);
      setMessages([]);
    }
    setMenuOpenId(null);
  };

  return (
    <div className="flex h-[calc(100vh-200px)] -mx-6 -mb-6">
      {/* Sidebar */}
      <div className="w-64 border-r border-zinc-800 flex flex-col bg-zinc-950">
        <div className="p-3 border-b border-zinc-800">
          <button
            onClick={handleNewChat}
            className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-emerald-600 hover:bg-emerald-500 rounded-lg text-sm text-white font-medium transition-colors"
          >
            <Plus className="w-4 h-4" />
            New Chat
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-2 space-y-1">
          {localConversations.length === 0 ? (
            <p className="text-xs text-zinc-500 text-center py-4">
              No conversations yet
            </p>
          ) : (
            localConversations.map((conv: any) => (
              <div
                key={conv.id}
                className={`group relative rounded-lg ${
                  conversationId === conv.id
                    ? "bg-zinc-800"
                    : "hover:bg-zinc-800/50"
                }`}
              >
                {editingId === conv.id ? (
                  <div className="flex items-center gap-1 p-2">
                    <input
                      type="text"
                      value={editTitle}
                      onChange={(e) => setEditTitle(e.target.value)}
                      onKeyDown={(e) =>
                        e.key === "Enter" && handleRename(conv.id)
                      }
                      className="flex-1 px-2 py-1 bg-zinc-700 border border-zinc-600 rounded text-sm text-zinc-100"
                      autoFocus
                    />
                    <button
                      onClick={() => handleRename(conv.id)}
                      className="p-1 text-emerald-400 hover:text-emerald-300"
                    >
                      ✓
                    </button>
                    <button
                      onClick={() => setEditingId(null)}
                      className="p-1 text-zinc-400 hover:text-zinc-200"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                ) : (
                  <Link
                    to={`/dashboard/learning/tutor?id=${conv.id}`}
                    className="flex items-center gap-2 p-2 pr-8"
                  >
                    <MessageSquare className="w-4 h-4 text-zinc-500 flex-shrink-0" />
                    <span className="text-sm text-zinc-300 truncate">
                      {conv.title || "Untitled"}
                    </span>
                  </Link>
                )}

                {editingId !== conv.id && (
                  <div className="absolute right-1 top-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100">
                    <button
                      onClick={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        setMenuOpenId(menuOpenId === conv.id ? null : conv.id);
                      }}
                      className="p-1 text-zinc-500 hover:text-zinc-300 rounded"
                    >
                      <MoreHorizontal className="w-4 h-4" />
                    </button>

                    {menuOpenId === conv.id && (
                      <div className="absolute right-0 top-full mt-1 bg-zinc-800 border border-zinc-700 rounded-lg shadow-lg py-1 z-10 min-w-[120px]">
                        <button
                          onClick={(e) => {
                            e.preventDefault();
                            setEditingId(conv.id);
                            setEditTitle(conv.title || "");
                            setMenuOpenId(null);
                          }}
                          className="w-full flex items-center gap-2 px-3 py-2 text-sm text-zinc-300 hover:bg-zinc-700"
                        >
                          <Pencil className="w-3.5 h-3.5" />
                          Rename
                        </button>
                        <button
                          onClick={(e) => {
                            e.preventDefault();
                            handleDelete(conv.id);
                          }}
                          className="w-full flex items-center gap-2 px-3 py-2 text-sm text-red-400 hover:bg-zinc-700"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                          Delete
                        </button>
                      </div>
                    )}
                  </div>
                )}
              </div>
            ))
          )}
        </div>
      </div>

      {/* Chat Area */}
      <div className="flex-1 flex flex-col min-w-0">
        <div className="flex-1 overflow-y-auto p-6 space-y-4">
          {messages.length === 0 && (
            <div className="text-center py-12">
              <Bot className="w-12 h-12 text-emerald-400 mx-auto mb-4" />
              <h2 className="text-xl font-medium text-zinc-100 mb-2">
                AI Tutor
              </h2>
              <p className="text-zinc-400 max-w-md mx-auto">
                Ask me anything about TypeScript, React, Angular, AWS, or your
                codebase. I'll help you understand concepts and debug issues.
              </p>
            </div>
          )}

          {messages.map((msg: any, i: number) => (
            <div
              key={i}
              className={`flex gap-3 ${msg.role === "user" ? "justify-end" : ""}`}
            >
              {msg.role === "assistant" && (
                <div className="w-8 h-8 rounded-full bg-emerald-500/20 flex items-center justify-center flex-shrink-0">
                  <Bot className="w-4 h-4 text-emerald-400" />
                </div>
              )}
              <div
                className={`max-w-2xl rounded-lg p-4 ${
                  msg.role === "user"
                    ? "bg-emerald-600 text-white"
                    : "bg-zinc-800 text-zinc-100"
                }`}
              >
                <p className="text-sm whitespace-pre-wrap">{msg.content}</p>
              </div>
              {msg.role === "user" && (
                <div className="w-8 h-8 rounded-full bg-zinc-700 flex items-center justify-center flex-shrink-0">
                  <User className="w-4 h-4 text-zinc-300" />
                </div>
              )}
            </div>
          ))}

          {isLoading && (
            <div className="flex gap-3">
              <div className="w-8 h-8 rounded-full bg-emerald-500/20 flex items-center justify-center">
                <Bot className="w-4 h-4 text-emerald-400" />
              </div>
              <div className="bg-zinc-800 rounded-lg p-4">
                <div className="flex gap-1">
                  <div className="w-2 h-2 bg-zinc-500 rounded-full animate-bounce" />
                  <div className="w-2 h-2 bg-zinc-500 rounded-full animate-bounce [animation-delay:0.1s]" />
                  <div className="w-2 h-2 bg-zinc-500 rounded-full animate-bounce [animation-delay:0.2s]" />
                </div>
              </div>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        <div className="border-t border-zinc-800 p-4">
          <div className="flex gap-2">
            <input
              ref={inputRef}
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) =>
                e.key === "Enter" && !e.shiftKey && handleSend()
              }
              placeholder="Ask a question..."
              className="flex-1 px-4 py-3 bg-zinc-800 border border-zinc-700 rounded-lg text-zinc-100 placeholder-zinc-500 focus:outline-none focus:border-emerald-500"
            />
            <button
              onClick={handleSend}
              disabled={!input.trim() || isLoading}
              className="px-4 py-3 bg-emerald-600 hover:bg-emerald-500 rounded-lg text-white disabled:opacity-50 transition-colors"
            >
              <Send className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
