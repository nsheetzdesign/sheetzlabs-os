import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
import { useLoaderData, useSearchParams, useNavigate, useFetcher, } from "react-router";
import { useEffect, useRef, useState } from "react";
import { Crown, Megaphone, Package, DollarSign, Search, Settings, MessageSquare, Plus, Send } from "lucide-react";
import { Header } from "~/components/dashboard/Header";
import { getSupabaseClient } from "~/lib/supabase.server";
import { apiFetch } from "~/lib/api";
export const meta = () => [{ title: "Chat — Sheetz Labs OS" }];
const DEPARTMENTS = [
    { id: "executive", label: "Chief of Staff", icon: Crown },
    { id: "marketing", label: "Marketing", icon: Megaphone },
    { id: "product", label: "Product", icon: Package },
    { id: "finance", label: "Finance", icon: DollarSign },
    { id: "research", label: "Research", icon: Search },
    { id: "operations", label: "Operations", icon: Settings },
];
// ─── Loader ───────────────────────────────────────────────────────────────────
export async function loader({ request, context }) {
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
    let messages = [];
    let activeConversation = null;
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
export async function action({ request, context }) {
    const env = context.cloudflare.env;
    const formData = await request.formData();
    const intent = formData.get("intent");
    if (intent === "create_conversation") {
        const department = formData.get("department");
        const res = await apiFetch(request, env, `/chat/conversations`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ department: department || null }),
        });
        return await res.json();
    }
    if (intent === "send_message") {
        const conversationId = formData.get("conversationId");
        const content = formData.get("content");
        const res = await apiFetch(request, env, `/chat/conversations/${conversationId}/messages`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ content }),
        });
        return await res.json();
    }
    return null;
}
// ─── Page ─────────────────────────────────────────────────────────────────────
export default function Chat() {
    const { conversations, messages: initialMessages, activeConversation, department } = useLoaderData();
    const [searchParams, setSearchParams] = useSearchParams();
    const navigate = useNavigate();
    const createFetcher = useFetcher();
    const sendFetcher = useFetcher();
    const [conversationId, setConversationId] = useState(activeConversation?.id ?? null);
    const [messages, setMessages] = useState(initialMessages);
    const [input, setInput] = useState("");
    const messagesEndRef = useRef(null);
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
    function startConversation(dept) {
        setMessages([]);
        setConversationId(null);
        const params = new URLSearchParams();
        if (dept)
            params.set("department", dept);
        setSearchParams(params, { replace: true });
    }
    function openConversation(id) {
        navigate(`/dashboard/chat?conversation=${id}`, { replace: true });
    }
    function sendMessage() {
        if (!input.trim() || sendFetcher.state !== "idle")
            return;
        // Optimistically add user message
        const userMsg = { role: "user", content: input, id: `temp-${Date.now()}` };
        setMessages((prev) => [...prev, userMsg]);
        const content = input;
        setInput("");
        if (!conversationId) {
            // Need to create a conversation first — use a combined approach:
            // Store the pending message, create conversation, then send
            setPendingMessage(content);
            createFetcher.submit({ intent: "create_conversation", department: department || "" }, { method: "post" });
        }
        else {
            sendFetcher.submit({ intent: "send_message", conversationId, content }, { method: "post" });
        }
    }
    const [pendingMessage, setPendingMessage] = useState(null);
    // After conversation created, send the pending message
    useEffect(() => {
        if (createFetcher.data?.conversation && pendingMessage) {
            const conv = createFetcher.data.conversation;
            sendFetcher.submit({ intent: "send_message", conversationId: conv.id, content: pendingMessage }, { method: "post" });
            setPendingMessage(null);
        }
    }, [createFetcher.data, pendingMessage]);
    const isLoading = sendFetcher.state !== "idle" || createFetcher.state !== "idle";
    const activeDept = activeConversation?.department || department || null;
    const deptInfo = DEPARTMENTS.find((d) => d.id === activeDept);
    return (_jsxs("div", { className: "flex h-full", children: [_jsxs("div", { className: "flex w-60 flex-col border-r border-surface-2/50", children: [_jsx("div", { className: "border-b border-surface-2/50 p-3", children: _jsxs("button", { onClick: () => startConversation(department || undefined), className: "flex w-full items-center gap-2 rounded-lg bg-brand/10 px-3 py-2 text-sm text-brand hover:bg-brand/20 transition-colors", children: [_jsx(Plus, { className: "h-4 w-4" }), "New Conversation"] }) }), _jsxs("div", { className: "border-b border-surface-2/50 p-3", children: [_jsx("div", { className: "mb-2 px-1 text-xs font-medium uppercase tracking-wider text-zinc-600", children: "Departments" }), _jsxs("div", { className: "space-y-0.5", children: [_jsxs("button", { onClick: () => startConversation(), className: `flex w-full items-center gap-2 rounded-lg px-2 py-1.5 text-sm transition-colors ${!activeDept
                                            ? "bg-surface-2 text-white"
                                            : "text-zinc-500 hover:text-zinc-300 hover:bg-surface-1/50"}`, children: [_jsx(Crown, { className: "h-3.5 w-3.5 shrink-0" }), "Chief of Staff"] }), DEPARTMENTS.slice(1).map(({ id, label, icon: Icon }) => (_jsxs("button", { onClick: () => startConversation(id), className: `flex w-full items-center gap-2 rounded-lg px-2 py-1.5 text-sm transition-colors ${activeDept === id
                                            ? "bg-surface-2 text-white"
                                            : "text-zinc-500 hover:text-zinc-300 hover:bg-surface-1/50"}`, children: [_jsx(Icon, { className: "h-3.5 w-3.5 shrink-0" }), label] }, id)))] })] }), _jsx("div", { className: "min-h-0 flex-1 overflow-y-auto p-3", children: conversations.length > 0 && (_jsxs(_Fragment, { children: [_jsx("div", { className: "mb-2 px-1 text-xs font-medium uppercase tracking-wider text-zinc-600", children: "Recent" }), _jsx("div", { className: "space-y-0.5", children: conversations.map((c) => (_jsx("button", { onClick: () => openConversation(c.id), className: `w-full truncate rounded-lg px-2 py-1.5 text-left text-sm transition-colors ${conversationId === c.id
                                            ? "bg-surface-2 text-white"
                                            : "text-zinc-500 hover:text-zinc-300 hover:bg-surface-1/50"}`, children: c.title || "New Conversation" }, c.id))) })] })) })] }), _jsxs("div", { className: "flex flex-1 flex-col overflow-hidden", children: [_jsx(Header, { title: deptInfo ? `${deptInfo.label} AI` : "Chief of Staff AI" }), _jsxs("div", { className: "flex-1 overflow-y-auto p-6", children: [messages.length === 0 && !isLoading && (_jsxs("div", { className: "flex h-full flex-col items-center justify-center text-center", children: [_jsx(MessageSquare, { className: "mb-4 h-12 w-12 text-zinc-700" }), _jsx("p", { className: "text-sm text-zinc-500", children: "Start a conversation with your AI team" }), _jsx("p", { className: "mt-1 text-xs text-zinc-600", children: "Ask questions, get insights, or request actions" })] })), _jsxs("div", { className: "mx-auto max-w-3xl space-y-4", children: [messages.map((m, i) => (_jsx("div", { className: `flex ${m.role === "user" ? "justify-end" : "justify-start"}`, children: _jsxs("div", { className: `max-w-2xl rounded-2xl px-4 py-3 text-sm ${m.role === "user"
                                                ? "bg-brand text-white"
                                                : "border border-surface-2/50 bg-surface-1/60 text-zinc-100"}`, children: [_jsx("div", { className: "whitespace-pre-wrap leading-relaxed", children: m.content }), m.cost_cents && (_jsxs("div", { className: "mt-1.5 text-xs opacity-40", children: ["$", (m.cost_cents / 100).toFixed(4)] }))] }) }, m.id || i))), isLoading && (_jsx("div", { className: "flex justify-start", children: _jsx("div", { className: "rounded-2xl border border-surface-2/50 bg-surface-1/60 px-4 py-3", children: _jsx("div", { className: "flex gap-1", children: [0, 0.15, 0.3].map((delay, i) => (_jsx("span", { className: "h-2 w-2 animate-bounce rounded-full bg-zinc-500", style: { animationDelay: `${delay}s` } }, i))) }) }) })), _jsx("div", { ref: messagesEndRef })] })] }), _jsx("div", { className: "border-t border-surface-2/50 p-4", children: _jsxs("div", { className: "mx-auto flex max-w-3xl gap-3", children: [_jsx("textarea", { value: input, onChange: (e) => setInput(e.target.value), onKeyDown: (e) => {
                                        if (e.key === "Enter" && !e.shiftKey) {
                                            e.preventDefault();
                                            sendMessage();
                                        }
                                    }, placeholder: `Message ${deptInfo?.label ?? "Chief of Staff"}… (Enter to send, Shift+Enter for newline)`, rows: 2, className: "flex-1 resize-none rounded-xl border border-surface-2 bg-surface-1/50 px-4 py-3 text-sm text-zinc-100 placeholder-zinc-600 outline-none transition-colors focus:border-brand/50" }), _jsx("button", { onClick: sendMessage, disabled: !input.trim() || isLoading, className: "flex items-center justify-center rounded-xl bg-brand px-4 text-white transition-colors hover:bg-brand/80 disabled:cursor-not-allowed disabled:opacity-40", children: _jsx(Send, { className: "h-4 w-4" }) })] }) })] })] }));
}
