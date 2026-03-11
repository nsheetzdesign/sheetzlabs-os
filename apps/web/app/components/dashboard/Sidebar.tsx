import { NavLink, Form } from "react-router";
import {
  Home,
  Briefcase,
  Users,
  BookOpen,
  Mail,
  Calendar,
  Bot,
  BarChart3,
  Settings2,
  LogOut,
  Search,
  GraduationCap,
  ChevronsLeft,
  ChevronsRight,
} from "lucide-react";

const NAV_ITEMS = [
  { icon: Home, label: "Home", to: "/dashboard", exact: true },
  { icon: Briefcase, label: "Ventures", to: "/dashboard/ventures" },
  { icon: Users, label: "Relationships", to: "/dashboard/relationships" },
  { icon: BookOpen, label: "Knowledge", to: "/dashboard/knowledge" },
  { icon: Mail, label: "Inbox", to: "/dashboard/inbox" },
  { icon: Calendar, label: "Calendar", to: "/dashboard/calendar" },
  { icon: Bot, label: "Agents", to: "/dashboard/agents" },
  { icon: BarChart3, label: "Analytics", to: "/dashboard/analytics" },
  { icon: GraduationCap, label: "Learning", to: "/dashboard/learning" },
];

interface SidebarProps {
  user?: { email?: string };
  onOpenPalette: () => void;
  collapsed?: boolean;
  onToggle?: () => void;
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

export function Sidebar({ user, onOpenPalette, collapsed = false, onToggle }: SidebarProps) {
  const initials = getInitials(user?.email);
  const displayEmail = user?.email ?? "";

  return (
    <aside
      className={`fixed left-0 top-0 flex h-screen flex-col border-r border-surface-2/50 bg-surface-0 transition-all duration-200 ${
        collapsed ? "w-16" : "w-64"
      }`}
    >
      {/* Logo */}
      <div
        className={`flex items-center border-b border-surface-2/50 px-4 py-5 ${
          collapsed ? "justify-center" : "gap-3"
        }`}
      >
        <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-brand text-sm font-bold text-white">
          SL
        </div>
        {!collapsed && (
          <div className="flex-1 min-w-0">
            <div className="text-sm font-semibold">Sheetz Labs</div>
            <div className="font-mono text-xs text-zinc-500">OS v0.1.0</div>
          </div>
        )}
        {onToggle && (
          <button
            onClick={onToggle}
            title={collapsed ? "Expand sidebar (⌘[)" : "Collapse sidebar (⌘[)"}
            className="text-zinc-600 hover:text-zinc-300 transition-colors flex-shrink-0"
          >
            {collapsed ? (
              <ChevronsRight className="h-4 w-4" />
            ) : (
              <ChevronsLeft className="h-4 w-4" />
            )}
          </button>
        )}
      </div>

      {/* Search */}
      <div className={`py-3 ${collapsed ? "px-2" : "px-3"}`}>
        <button
          onClick={onOpenPalette}
          title={collapsed ? "Search (⌘K)" : undefined}
          className={`flex w-full items-center rounded-lg border border-surface-2 bg-surface-1/50 text-sm text-zinc-500 transition-colors hover:border-surface-3 hover:text-zinc-300 ${
            collapsed ? "justify-center p-2" : "gap-2 px-3 py-2"
          }`}
        >
          <Search className="h-4 w-4 shrink-0" />
          {!collapsed && (
            <>
              <span className="flex-1 text-left">Search...</span>
              <kbd className="font-mono text-xs text-zinc-600">⌘K</kbd>
            </>
          )}
        </button>
      </div>

      {/* Main Nav */}
      <nav className={`min-h-0 flex-1 space-y-0.5 overflow-y-auto py-2 ${collapsed ? "px-2" : "px-3"}`}>
        {NAV_ITEMS.map(({ icon: Icon, label, to, exact }) => (
          <NavLink
            key={to}
            to={to}
            end={exact}
            title={collapsed ? label : undefined}
            className={({ isActive }) =>
              `flex items-center rounded-lg py-2 text-sm transition-colors ${
                collapsed ? "justify-center px-2" : "gap-3 px-3"
              } ${
                isActive
                  ? "border border-brand/30 bg-brand/10 text-brand"
                  : "text-zinc-500 hover:bg-surface-1/50 hover:text-zinc-300"
              }`
            }
          >
            <Icon className="h-4 w-4 shrink-0" />
            {!collapsed && label}
          </NavLink>
        ))}
      </nav>

      {/* Settings (bottom) */}
      <div className={`border-t border-surface-2/50 pt-2 ${collapsed ? "px-2" : "px-3"}`}>
        <NavLink
          to="/dashboard/settings"
          title={collapsed ? "Settings" : undefined}
          className={({ isActive }) =>
            `flex items-center rounded-lg py-2 text-sm transition-colors ${
              collapsed ? "justify-center px-2" : "gap-3 px-3"
            } ${
              isActive
                ? "border border-brand/30 bg-brand/10 text-brand"
                : "text-zinc-500 hover:bg-surface-1/50 hover:text-zinc-300"
            }`
          }
        >
          <Settings2 className="h-4 w-4 shrink-0" />
          {!collapsed && "Settings"}
        </NavLink>
      </div>

      {/* User footer */}
      <div className="border-t border-surface-2/50 p-3">
        {collapsed ? (
          <div className="flex flex-col items-center gap-2">
            <div
              className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-surface-2 text-sm font-semibold text-zinc-300"
              title={displayEmail}
            >
              {initials}
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
        ) : (
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
        )}
      </div>
    </aside>
  );
}
