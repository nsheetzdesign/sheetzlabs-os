import { NavLink, Form } from "react-router";
import {
  LayoutDashboard,
  Box,
  Rocket,
  DollarSign,
  Receipt,
  Users,
  CheckSquare,
  BookOpen,
  Brain,
  Settings2,
  LogOut,
  Search,
} from "lucide-react";

const navItems = [
  { icon: LayoutDashboard, label: "Command Center", to: "/dashboard" },
  { icon: Box, label: "Ventures", to: "/dashboard/ventures" },
  { icon: Rocket, label: "Pipeline", to: "/dashboard/pipeline" },
  { icon: DollarSign, label: "Revenue", to: "/dashboard/revenue" },
  { icon: Receipt, label: "Expenses", to: "/dashboard/expenses" },
  { icon: Users, label: "Relationships", to: "/dashboard/relationships" },
  { icon: CheckSquare, label: "Tasks", to: "/dashboard/tasks" },
  { icon: BookOpen, label: "Knowledge", to: "/dashboard/knowledge" },
  { icon: Brain, label: "AI Agents", to: "/dashboard/agents" },
  { icon: Settings2, label: "Settings", to: "/dashboard/settings/stripe" },
];

interface SidebarProps {
  user?: { email?: string };
  onOpenPalette: () => void;
}

function getInitials(email?: string): string {
  if (!email) return "SL";
  const local = email.split("@")[0];
  const parts = local.split(/[._-]/);
  if (parts.length >= 2) {
    return (parts[0][0] + parts[1][0]).toUpperCase();
  }
  return local.slice(0, 2).toUpperCase();
}

export function Sidebar({ user, onOpenPalette }: SidebarProps) {
  const initials = getInitials(user?.email);
  const displayEmail = user?.email ?? "";

  return (
    <aside className="fixed left-0 top-0 flex h-screen w-64 flex-col border-r border-surface-2/50 bg-surface-0">
      {/* Logo */}
      <div className="flex items-center gap-3 border-b border-surface-2/50 px-4 py-5">
        <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-brand text-sm font-bold text-white">
          SL
        </div>
        <div>
          <div className="text-sm font-semibold">Sheetz Labs</div>
          <div className="font-mono text-xs text-zinc-500">OS v0.1.0</div>
        </div>
      </div>

      {/* Search */}
      <div className="px-3 py-3">
        <button
          onClick={onOpenPalette}
          className="flex w-full items-center gap-2 rounded-lg border border-surface-2 bg-surface-1/50 px-3 py-2 text-sm text-zinc-500 transition-colors hover:border-surface-3 hover:text-zinc-300"
        >
          <Search className="h-4 w-4" />
          <span className="flex-1 text-left">Search...</span>
          <kbd className="font-mono text-xs text-zinc-600">⌘K</kbd>
        </button>
      </div>

      {/* Nav */}
      <nav className="flex-1 space-y-0.5 overflow-y-auto px-3 py-2">
        {navItems.map(({ icon: Icon, label, to }) => (
          <NavLink
            key={to}
            to={to}
            end={to === "/dashboard"}
            className={({ isActive }) =>
              `flex items-center gap-3 rounded-lg px-3 py-2 text-sm transition-colors ${
                isActive
                  ? "border border-brand/30 bg-brand/10 text-brand"
                  : "text-zinc-500 hover:bg-surface-1/50 hover:text-zinc-300"
              }`
            }
          >
            <Icon className="h-4 w-4 shrink-0" />
            {label}
          </NavLink>
        ))}
      </nav>

      {/* User footer */}
      <div className="border-t border-surface-2/50 p-3">
        <div className="flex items-center gap-3 rounded-lg px-2 py-2">
          <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-surface-2 text-sm font-semibold text-zinc-300">
            {initials}
          </div>
          <div className="min-w-0 flex-1">
            <div className="truncate text-xs text-zinc-400">{displayEmail}</div>
            <div className="text-xs text-zinc-600">Founder</div>
          </div>
          <Form method="post" action="/auth/logout">
            <button
              type="submit"
              title="Sign out"
              className="text-zinc-600 transition-colors hover:text-zinc-300"
            >
              <LogOut className="h-4 w-4" />
            </button>
          </Form>
        </div>
      </div>
    </aside>
  );
}
