import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router";
import {
  Search,
  X,
  LayoutDashboard,
  Rocket,
  GitBranch,
  Users,
  CheckSquare,
  Mail,
  Calendar,
  BookOpen,
  PenSquare,
  Bot,
  BarChart3,
  Plus,
  Lightbulb,
  UserPlus,
  ListPlus,
  FilePlus,
  FileText,
  Zap,
  MessageSquare,
  Megaphone,
  Package,
  DollarSign,
  Settings,
  TrendingUp,
  Crown,
} from "lucide-react";

type Action = {
  id: string;
  label: string;
  description?: string;
  shortcut?: string;
  category: string;
  icon: React.ComponentType<{ className?: string }>;
  type: "navigate" | "create" | "chat" | "agent";
  data: Record<string, string>;
};

const ACTIONS: Action[] = [
  // Navigation
  { id: "nav-dashboard", label: "Go to Dashboard", description: "Open command center", shortcut: "g d", category: "navigation", icon: LayoutDashboard, type: "navigate", data: { route: "/dashboard" } },
  { id: "nav-ventures", label: "Go to Ventures", description: "View all ventures", shortcut: "g v", category: "navigation", icon: Rocket, type: "navigate", data: { route: "/dashboard/ventures" } },
  { id: "nav-pipeline", label: "Go to Pipeline", description: "View idea pipeline", shortcut: "g p", category: "navigation", icon: GitBranch, type: "navigate", data: { route: "/dashboard/pipeline" } },
  { id: "nav-relationships", label: "Go to Relationships", description: "View CRM", shortcut: "g r", category: "navigation", icon: Users, type: "navigate", data: { route: "/dashboard/relationships" } },
  { id: "nav-tasks", label: "Go to Tasks", description: "View all tasks", shortcut: "g t", category: "navigation", icon: CheckSquare, type: "navigate", data: { route: "/dashboard/tasks" } },
  { id: "nav-inbox", label: "Go to Inbox", description: "Open email inbox", shortcut: "g i", category: "navigation", icon: Mail, type: "navigate", data: { route: "/dashboard/inbox" } },
  { id: "nav-calendar", label: "Go to Calendar", description: "Open calendar", shortcut: "g c", category: "navigation", icon: Calendar, type: "navigate", data: { route: "/dashboard/calendar" } },
  { id: "nav-knowledge", label: "Go to Knowledge", description: "Open knowledge base", shortcut: "g k", category: "navigation", icon: BookOpen, type: "navigate", data: { route: "/dashboard/knowledge" } },
  { id: "nav-content", label: "Go to Content", description: "Content management", shortcut: "g o", category: "navigation", icon: PenSquare, type: "navigate", data: { route: "/dashboard/content" } },
  { id: "nav-agents", label: "Go to Agents", description: "AI agents dashboard", shortcut: "g a", category: "navigation", icon: Bot, type: "navigate", data: { route: "/dashboard/agents" } },
  { id: "nav-analytics", label: "Go to Analytics", description: "View analytics", shortcut: "g n", category: "navigation", icon: BarChart3, type: "navigate", data: { route: "/dashboard/analytics" } },
  { id: "nav-chat", label: "Go to Chat", description: "AI assistant", shortcut: "g h", category: "navigation", icon: MessageSquare, type: "navigate", data: { route: "/dashboard/chat" } },
  // Create
  { id: "create-venture", label: "New Venture", description: "Create a new venture", shortcut: "c v", category: "create", icon: Plus, type: "create", data: { route: "/dashboard/ventures/new" } },
  { id: "create-pipeline", label: "New Pipeline Idea", description: "Add idea to pipeline", shortcut: "c p", category: "create", icon: Lightbulb, type: "create", data: { route: "/dashboard/pipeline/new" } },
  { id: "create-relationship", label: "New Relationship", description: "Add a contact", shortcut: "c r", category: "create", icon: UserPlus, type: "create", data: { route: "/dashboard/relationships/new" } },
  { id: "create-task", label: "New Task", description: "Create a task", shortcut: "c t", category: "create", icon: ListPlus, type: "create", data: { route: "/dashboard/tasks/new" } },
  { id: "create-knowledge", label: "New Knowledge", description: "Create knowledge item", shortcut: "c k", category: "create", icon: FilePlus, type: "create", data: { route: "/dashboard/knowledge/new" } },
  { id: "create-content", label: "New Content", description: "Create content", shortcut: "c o", category: "create", icon: FileText, type: "create", data: { route: "/dashboard/content/new" } },
  { id: "create-capture", label: "Quick Capture", description: "Capture a thought", shortcut: "c c", category: "create", icon: Zap, type: "create", data: { route: "/dashboard/knowledge/captures" } },
  // Chat
  { id: "chat-general", label: "Chat with Chief of Staff", description: "General assistant", category: "chat", icon: Crown, type: "chat", data: { department: "" } },
  { id: "chat-marketing", label: "Chat with Marketing", description: "Marketing department", category: "chat", icon: Megaphone, type: "chat", data: { department: "marketing" } },
  { id: "chat-product", label: "Chat with Product", description: "Product department", category: "chat", icon: Package, type: "chat", data: { department: "product" } },
  { id: "chat-finance", label: "Chat with Finance", description: "Finance department", category: "chat", icon: DollarSign, type: "chat", data: { department: "finance" } },
  { id: "chat-research", label: "Chat with Research", description: "Research department", category: "chat", icon: Search, type: "chat", data: { department: "research" } },
  { id: "chat-operations", label: "Chat with Operations", description: "Operations department", category: "chat", icon: Settings, type: "chat", data: { department: "operations" } },
  // Agents
  { id: "agent-finance", label: "Run Finance Analyst", description: "Analyze finances now", category: "agents", icon: TrendingUp, type: "agent", data: { slug: "finance-analyst" } },
  { id: "agent-chief", label: "Run Chief of Staff", description: "Weekly digest", category: "agents", icon: Crown, type: "agent", data: { slug: "chief-of-staff" } },
];

const CATEGORY_LABELS: Record<string, string> = {
  navigation: "Go to",
  create: "Create",
  chat: "Chat",
  agents: "Agents",
};

export function CommandPalette({
  open,
  onClose,
}: {
  open: boolean;
  onClose: () => void;
}) {
  const [query, setQuery] = useState("");
  const [selectedIndex, setSelectedIndex] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);
  const navigate = useNavigate();

  useEffect(() => {
    if (open) {
      setTimeout(() => inputRef.current?.focus(), 10);
      setQuery("");
      setSelectedIndex(0);
    }
  }, [open]);

  const filtered = query
    ? ACTIONS.filter(
        (a) =>
          a.label.toLowerCase().includes(query.toLowerCase()) ||
          (a.description?.toLowerCase().includes(query.toLowerCase()))
      )
    : ACTIONS;

  // Group by category
  const grouped: Record<string, Action[]> = {};
  for (const action of filtered) {
    if (!grouped[action.category]) grouped[action.category] = [];
    grouped[action.category].push(action);
  }

  // Flat list for index tracking
  const flat = filtered;

  useEffect(() => {
    setSelectedIndex(0);
  }, [query]);

  function executeAction(action: Action) {
    onClose();
    switch (action.type) {
      case "navigate":
      case "create":
        navigate(action.data.route);
        break;
      case "chat": {
        const params = action.data.department
          ? `?department=${action.data.department}`
          : "";
        navigate(`/dashboard/chat${params}`);
        break;
      }
      case "agent":
        navigate(`/dashboard/agents/${action.data.slug}`);
        break;
    }
  }

  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-start justify-center bg-black/60 pt-24 backdrop-blur-sm"
      onClick={onClose}
    >
      <div
        className="w-full max-w-xl rounded-xl border border-surface-2 bg-surface-1 shadow-2xl overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Search input */}
        <div className="flex items-center gap-3 border-b border-surface-2 px-4 py-3">
          <Search className="h-4 w-4 shrink-0 text-zinc-500" />
          <input
            ref={inputRef}
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Type a command or search..."
            className="flex-1 bg-transparent text-sm text-white placeholder-zinc-500 outline-none"
            onKeyDown={(e) => {
              if (e.key === "Escape") {
                onClose();
              } else if (e.key === "ArrowDown") {
                e.preventDefault();
                setSelectedIndex((i) => Math.min(i + 1, flat.length - 1));
              } else if (e.key === "ArrowUp") {
                e.preventDefault();
                setSelectedIndex((i) => Math.max(i - 1, 0));
              } else if (e.key === "Enter" && flat[selectedIndex]) {
                e.preventDefault();
                executeAction(flat[selectedIndex]);
              }
            }}
          />
          <button
            onClick={onClose}
            className="text-zinc-500 transition-colors hover:text-zinc-300"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        {/* Results grouped by category */}
        <div className="max-h-96 overflow-auto p-2">
          {flat.length === 0 ? (
            <p className="px-3 py-6 text-center text-sm text-zinc-500">
              No results for &ldquo;{query}&rdquo;
            </p>
          ) : (
            Object.entries(grouped).map(([category, actions]) => (
              <div key={category} className="mb-1">
                <div className="px-3 py-1.5 text-xs font-medium text-zinc-600 uppercase tracking-wider">
                  {CATEGORY_LABELS[category] || category}
                </div>
                {actions.map((action) => {
                  const globalIndex = flat.indexOf(action);
                  const Icon = action.icon;
                  return (
                    <button
                      key={action.id}
                      onClick={() => executeAction(action)}
                      onMouseEnter={() => setSelectedIndex(globalIndex)}
                      className={`flex w-full items-center justify-between gap-3 rounded-lg px-3 py-2 text-sm transition-colors ${
                        globalIndex === selectedIndex
                          ? "bg-surface-2 text-white"
                          : "text-zinc-300 hover:bg-surface-2/50"
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <Icon className="h-4 w-4 shrink-0 text-zinc-500" />
                        <div className="text-left">
                          <div>{action.label}</div>
                          {action.description && (
                            <div className="text-xs text-zinc-500">
                              {action.description}
                            </div>
                          )}
                        </div>
                      </div>
                      {action.shortcut && (
                        <div className="flex shrink-0 gap-1">
                          {action.shortcut.split(" ").map((key, i) => (
                            <kbd
                              key={i}
                              className="rounded border border-surface-3 bg-surface-2 px-1.5 py-0.5 font-mono text-xs text-zinc-400"
                            >
                              {key}
                            </kbd>
                          ))}
                        </div>
                      )}
                    </button>
                  );
                })}
              </div>
            ))
          )}
        </div>

        {/* Footer */}
        <div className="border-t border-surface-2 px-4 py-2 font-mono text-xs text-zinc-600">
          <kbd>↑↓</kbd> navigate · <kbd>↵</kbd> select · <kbd>esc</kbd> close
        </div>
      </div>
    </div>
  );
}
