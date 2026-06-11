import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState, useRef, useEffect } from "react";
import { useLoaderData, useFetcher, Link } from "react-router";
import { Send, Bot, User, Plus, MessageSquare, MoreHorizontal, Pencil, Trash2, X, } from "lucide-react";
import { apiFetch } from "~/lib/api";
export async function loader({ request, context }) {
    const env = context.cloudflare.env;
    const url = new URL(request.url);
    const conversationId = url.searchParams.get("id");
    const convsResponse = await apiFetch(request, env, `/learning/conversations`);
    const convsData = convsResponse.ok ? await convsResponse.json() : {};
    let messages = [];
    if (conversationId) {
        const msgsResponse = await apiFetch(request, env, `/learning/conversations/${conversationId}/messages`);
        const msgsData = msgsResponse.ok ? await msgsResponse.json() : {};
        messages = msgsData.messages || [];
    }
    return {
        conversations: convsData.conversations || [],
        currentConversationId: conversationId,
        messages,
    };
}
export async function action({ request, context }) {
    const env = context.cloudflare.env;
    const formData = await request.formData();
    const intent = formData.get("intent");
    if (intent === "send") {
        const message = formData.get("message");
        const conversationId = formData.get("conversationId");
        const response = await apiFetch(request, env, `/learning/chat`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                conversation_id: conversationId || undefined,
                message,
            }),
        });
        const data = await response.json();
        return { conversationId: data.conversation_id, message: data.message };
    }
    if (intent === "rename") {
        const conversationId = formData.get("conversationId");
        const title = formData.get("title");
        await apiFetch(request, env, `/learning/conversations/${conversationId}`, {
            method: "PATCH",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ title }),
        });
        return { success: true };
    }
    if (intent === "delete") {
        const conversationId = formData.get("conversationId");
        await apiFetch(request, env, `/learning/conversations/${conversationId}`, {
            method: "DELETE",
        });
        return { success: true, deleted: conversationId };
    }
    return null;
}
export default function TutorPage() {
    const { conversations, currentConversationId, messages: initialMessages } = useLoaderData();
    const fetcher = useFetcher();
    const [messages, setMessages] = useState(initialMessages);
    const [input, setInput] = useState("");
    const [conversationId, setConversationId] = useState(currentConversationId);
    const [editingId, setEditingId] = useState(null);
    const [editTitle, setEditTitle] = useState("");
    const [menuOpenId, setMenuOpenId] = useState(null);
    const [localConversations, setLocalConversations] = useState(conversations);
    const messagesEndRef = useRef(null);
    const inputRef = useRef(null);
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
            setMessages((prev) => [
                ...prev,
                { role: "assistant", content: fetcher.data.message },
            ]);
            // Add new conversation to sidebar if it's new
            setLocalConversations((prev) => {
                if (prev.find((c) => c.id === newConvId))
                    return prev;
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
        if (!input.trim() || isLoading)
            return;
        const userMessage = input.trim();
        setInput("");
        setMessages((prev) => [
            ...prev,
            { role: "user", content: userMessage },
        ]);
        fetcher.submit({
            intent: "send",
            message: userMessage,
            conversationId: conversationId || "",
        }, { method: "post" });
    };
    const handleNewChat = () => {
        setConversationId(null);
        setMessages([]);
        inputRef.current?.focus();
    };
    const handleRename = (id) => {
        fetcher.submit({ intent: "rename", conversationId: id, title: editTitle }, { method: "post" });
        setLocalConversations((prev) => prev.map((c) => (c.id === id ? { ...c, title: editTitle } : c)));
        setEditingId(null);
        setEditTitle("");
    };
    const handleDelete = (id) => {
        if (!confirm("Delete this conversation?"))
            return;
        fetcher.submit({ intent: "delete", conversationId: id }, { method: "post" });
        setLocalConversations((prev) => prev.filter((c) => c.id !== id));
        if (conversationId === id) {
            setConversationId(null);
            setMessages([]);
        }
        setMenuOpenId(null);
    };
    return (_jsxs("div", { className: "flex h-[calc(100vh-200px)] -mx-6 -mb-6", children: [_jsxs("div", { className: "w-64 border-r border-zinc-800 flex flex-col bg-zinc-950", children: [_jsx("div", { className: "p-3 border-b border-zinc-800", children: _jsxs("button", { onClick: handleNewChat, className: "w-full flex items-center justify-center gap-2 px-4 py-2 bg-emerald-600 hover:bg-emerald-500 rounded-lg text-sm text-white font-medium transition-colors", children: [_jsx(Plus, { className: "w-4 h-4" }), "New Chat"] }) }), _jsx("div", { className: "flex-1 overflow-y-auto p-2 space-y-1", children: localConversations.length === 0 ? (_jsx("p", { className: "text-xs text-zinc-500 text-center py-4", children: "No conversations yet" })) : (localConversations.map((conv) => (_jsxs("div", { className: `group relative rounded-lg ${conversationId === conv.id
                                ? "bg-zinc-800"
                                : "hover:bg-zinc-800/50"}`, children: [editingId === conv.id ? (_jsxs("div", { className: "flex items-center gap-1 p-2", children: [_jsx("input", { type: "text", value: editTitle, onChange: (e) => setEditTitle(e.target.value), onKeyDown: (e) => e.key === "Enter" && handleRename(conv.id), className: "flex-1 px-2 py-1 bg-zinc-700 border border-zinc-600 rounded text-sm text-zinc-100", autoFocus: true }), _jsx("button", { onClick: () => handleRename(conv.id), className: "p-1 text-emerald-400 hover:text-emerald-300", children: "\u2713" }), _jsx("button", { onClick: () => setEditingId(null), className: "p-1 text-zinc-400 hover:text-zinc-200", children: _jsx(X, { className: "w-4 h-4" }) })] })) : (_jsxs(Link, { to: `/dashboard/learning/tutor?id=${conv.id}`, className: "flex items-center gap-2 p-2 pr-8", children: [_jsx(MessageSquare, { className: "w-4 h-4 text-zinc-500 flex-shrink-0" }), _jsx("span", { className: "text-sm text-zinc-300 truncate", children: conv.title || "Untitled" })] })), editingId !== conv.id && (_jsxs("div", { className: "absolute right-1 top-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100", children: [_jsx("button", { onClick: (e) => {
                                                e.preventDefault();
                                                e.stopPropagation();
                                                setMenuOpenId(menuOpenId === conv.id ? null : conv.id);
                                            }, className: "p-1 text-zinc-500 hover:text-zinc-300 rounded", children: _jsx(MoreHorizontal, { className: "w-4 h-4" }) }), menuOpenId === conv.id && (_jsxs("div", { className: "absolute right-0 top-full mt-1 bg-zinc-800 border border-zinc-700 rounded-lg shadow-lg py-1 z-10 min-w-[120px]", children: [_jsxs("button", { onClick: (e) => {
                                                        e.preventDefault();
                                                        setEditingId(conv.id);
                                                        setEditTitle(conv.title || "");
                                                        setMenuOpenId(null);
                                                    }, className: "w-full flex items-center gap-2 px-3 py-2 text-sm text-zinc-300 hover:bg-zinc-700", children: [_jsx(Pencil, { className: "w-3.5 h-3.5" }), "Rename"] }), _jsxs("button", { onClick: (e) => {
                                                        e.preventDefault();
                                                        handleDelete(conv.id);
                                                    }, className: "w-full flex items-center gap-2 px-3 py-2 text-sm text-red-400 hover:bg-zinc-700", children: [_jsx(Trash2, { className: "w-3.5 h-3.5" }), "Delete"] })] }))] }))] }, conv.id)))) })] }), _jsxs("div", { className: "flex-1 flex flex-col min-w-0", children: [_jsxs("div", { className: "flex-1 overflow-y-auto p-6 space-y-4", children: [messages.length === 0 && (_jsxs("div", { className: "text-center py-12", children: [_jsx(Bot, { className: "w-12 h-12 text-emerald-400 mx-auto mb-4" }), _jsx("h2", { className: "text-xl font-medium text-zinc-100 mb-2", children: "AI Tutor" }), _jsx("p", { className: "text-zinc-400 max-w-md mx-auto", children: "Ask me anything about TypeScript, React, Angular, AWS, or your codebase. I'll help you understand concepts and debug issues." })] })), messages.map((msg, i) => (_jsxs("div", { className: `flex gap-3 ${msg.role === "user" ? "justify-end" : ""}`, children: [msg.role === "assistant" && (_jsx("div", { className: "w-8 h-8 rounded-full bg-emerald-500/20 flex items-center justify-center flex-shrink-0", children: _jsx(Bot, { className: "w-4 h-4 text-emerald-400" }) })), _jsx("div", { className: `max-w-2xl rounded-lg p-4 ${msg.role === "user"
                                            ? "bg-emerald-600 text-white"
                                            : "bg-zinc-800 text-zinc-100"}`, children: _jsx("p", { className: "text-sm whitespace-pre-wrap", children: msg.content }) }), msg.role === "user" && (_jsx("div", { className: "w-8 h-8 rounded-full bg-zinc-700 flex items-center justify-center flex-shrink-0", children: _jsx(User, { className: "w-4 h-4 text-zinc-300" }) }))] }, i))), isLoading && (_jsxs("div", { className: "flex gap-3", children: [_jsx("div", { className: "w-8 h-8 rounded-full bg-emerald-500/20 flex items-center justify-center", children: _jsx(Bot, { className: "w-4 h-4 text-emerald-400" }) }), _jsx("div", { className: "bg-zinc-800 rounded-lg p-4", children: _jsxs("div", { className: "flex gap-1", children: [_jsx("div", { className: "w-2 h-2 bg-zinc-500 rounded-full animate-bounce" }), _jsx("div", { className: "w-2 h-2 bg-zinc-500 rounded-full animate-bounce [animation-delay:0.1s]" }), _jsx("div", { className: "w-2 h-2 bg-zinc-500 rounded-full animate-bounce [animation-delay:0.2s]" })] }) })] })), _jsx("div", { ref: messagesEndRef })] }), _jsx("div", { className: "border-t border-zinc-800 p-4", children: _jsxs("div", { className: "flex gap-2", children: [_jsx("input", { ref: inputRef, type: "text", value: input, onChange: (e) => setInput(e.target.value), onKeyDown: (e) => e.key === "Enter" && !e.shiftKey && handleSend(), placeholder: "Ask a question...", className: "flex-1 px-4 py-3 bg-zinc-800 border border-zinc-700 rounded-lg text-zinc-100 placeholder-zinc-500 focus:outline-none focus:border-emerald-500" }), _jsx("button", { onClick: handleSend, disabled: !input.trim() || isLoading, className: "px-4 py-3 bg-emerald-600 hover:bg-emerald-500 rounded-lg text-white disabled:opacity-50 transition-colors", children: _jsx(Send, { className: "w-5 h-5" }) })] }) })] })] }));
}
