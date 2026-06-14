import { NavLink, Form } from "react-router";
import {
  Home,
  Briefcase,
  Users,
  BookOpen,
  Mail,
  Calendar,
  Target,
  Bot,
  BarChart3,
  Settings2,
  LogOut,
  Search,
  GraduationCap,
  ChevronsLeft,
  ChevronsRight,
} from "lucide-react";
import type { ProximityLevel } from "~/lib/meeting-proximity";

// Proximity level → semantic colour token (defined in tailwind.config.ts). Literal
// strings so Tailwind's JIT can see the classes. Prompt 68.
const DOT_COLOR: Record<ProximityLevel, string> = {
  "in-progress": "bg-danger",
  soon: "bg-warning",
  upcoming: "bg-caution",
  clear: "bg-success",
};

const NAV_ITEMS = [
  { icon: Home, label: "Home", to: "/dashboard", exact: true },
  { icon: Briefcase, label: "Ventures", to: "/dashboard/ventures" },
  { icon: Users, label: "Relationships", to: "/dashboard/relationships" },
  { icon: BookOpen, label: "Knowledge", to: "/dashboard/knowledge" },
  { icon: Mail, label: "Inbox", to: "/dashboard/inbox" },
  { icon: Calendar, label: "Calendar", to: "/dashboard/calendar" },
  { icon: Target, label: "Work", to: "/dashboard/work" },
  { icon: Bot, label: "Agents", to: "/dashboard/agents" },
  { icon: BarChart3, label: "Analytics", to: "/dashboard/analytics" },
  { icon: GraduationCap, label: "Learning", to: "/dashboard/learning" },
];

interface SidebarProps {
  user?: { email?: string };
  onOpenPalette: () => void;
  /** Collapse to an icon rail (desktop only). Ignored inside the drawer. */
  collapsed?: boolean;
  onToggle?: () => void;
  /**
   * Rendered inside the mobile nav drawer (<lg). In that mode the sidebar is
   * always full-width/expanded, never `fixed`, and shows no collapse toggle —
   * the drawer owns open/closed there. Also gates off `hidden lg:flex` so the
   * panel is visible below the breakpoint.
   */
  inDrawer?: boolean;
  /**
   * False until the client has mounted. Used to suppress the width transition on
   * the first persisted-state reconcile so the rail snaps rather than animating
   * a collapse on load. See {@link useSidebarCollapsed}.
   */
  mounted?: boolean;
  /** Close the drawer after navigating (mobile only). */
  onNavigate?: () => void;
  /** Global unread inbox total → badge on the Inbox item. Hidden when 0. */
  unreadCount?: number;
  /** Meeting-proximity status for the Calendar item dot. */
  meetingDot?: { level: ProximityLevel; tooltip: string };
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

export function Sidebar({
  user,
  onOpenPalette,
  collapsed = false,
  onToggle,
  inDrawer = false,
  mounted = true,
  onNavigate,
  unreadCount = 0,
  meetingDot,
}: SidebarProps) {
  const initials = getInitials(user?.email);
  const displayEmail = user?.email ?? "";
  // Inside the drawer the rail is always expanded; collapse is a desktop concept.
  const isCollapsed = inDrawer ? false : collapsed;

  return (
    <aside
      data-testid={inDrawer ? "main-sidebar-drawer" : "main-sidebar"}
      className={
        inDrawer
          ? "flex h-full w-full flex-col bg-surface-0"
          : `fixed left-0 top-0 z-30 hidden h-screen flex-col border-r border-surface-2/50 bg-surface-0 pt-safe pb-safe pl-safe lg:flex ${
              mounted ? "transition-all duration-200" : ""
            } ${isCollapsed ? "w-16" : "w-64"}`
      }
    >
      {/* Logo / brand — mark always; wordmark only when expanded */}
      <div
        className={`flex items-center border-b border-surface-2/50 px-4 py-5 ${
          isCollapsed ? "justify-center" : "gap-3"
        }`}
      >
        <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-brand text-sm font-bold text-white">
          SL
        </div>
        {!isCollapsed && (
          <div className="min-w-0 flex-1">
            <div className="text-sm font-semibold">Sheetz Labs</div>
            <div className="font-mono text-xs text-zinc-500">OS v0.1.0</div>
          </div>
        )}
      </div>

      {/* Search */}
      <div className={`py-3 ${isCollapsed ? "px-2" : "px-3"}`}>
        <button
          onClick={onOpenPalette}
          title={isCollapsed ? "Search (⌘K)" : undefined}
          aria-label={isCollapsed ? "Search" : undefined}
          className={`flex w-full items-center rounded-lg border border-surface-2 bg-surface-1/50 text-sm text-zinc-500 transition-colors hover:border-surface-3 hover:text-zinc-300 ${
            isCollapsed ? "justify-center p-2" : "gap-2 px-3 py-2"
          }`}
        >
          <Search className="h-4 w-4 shrink-0" />
          {!isCollapsed && (
            <>
              <span className="flex-1 text-left">Search...</span>
              <kbd className="font-mono text-xs text-zinc-600">⌘K</kbd>
            </>
          )}
        </button>
      </div>

      {/* Main Nav */}
      <nav className={`min-h-0 flex-1 space-y-0.5 overflow-y-auto py-2 ${isCollapsed ? "px-2" : "px-3"}`}>
        {NAV_ITEMS.map(({ icon: Icon, label, to, exact }) => {
          const showBadge = to === "/dashboard/inbox" && unreadCount > 0;
          const dot = to === "/dashboard/calendar" ? meetingDot : undefined;
          // Collapsed: the title carries the count/meeting info too (no visible label).
          const title = isCollapsed
            ? dot
              ? `${label} — ${dot.tooltip}`
              : showBadge
                ? `${label} (${unreadCount} unread)`
                : label
            : dot
              ? dot.tooltip
              : undefined;
          return (
            <NavLink
              key={to}
              to={to}
              end={exact}
              onClick={onNavigate}
              title={title}
              aria-label={isCollapsed ? label : undefined}
              className={({ isActive }) =>
                `flex items-center rounded-lg py-2 text-sm transition-colors ${
                  isCollapsed ? "justify-center px-2" : "gap-3 px-3"
                } ${
                  isActive
                    ? "border border-brand/30 bg-brand/10 text-brand"
                    : "text-zinc-500 hover:bg-surface-1/50 hover:text-zinc-300"
                }`
              }
            >
              <span className="relative shrink-0">
                <Icon className="h-4 w-4" />
                {/* Collapsed-rail adornments ride the top-right of the icon. */}
                {isCollapsed && showBadge && (
                  <span
                    data-testid="nav-inbox-dot"
                    className="absolute -right-1.5 -top-1.5 h-2.5 w-2.5 rounded-full bg-brand ring-2 ring-surface-0"
                  />
                )}
                {isCollapsed && dot && (
                  <span
                    data-testid="nav-calendar-dot"
                    className={`absolute -right-1.5 -top-1.5 h-2.5 w-2.5 rounded-full ring-2 ring-surface-0 ${DOT_COLOR[dot.level]}`}
                  />
                )}
              </span>
              {!isCollapsed && <span className="flex-1 truncate">{label}</span>}
              {/* Expanded adornments sit at the trailing edge. */}
              {!isCollapsed && showBadge && (
                <span
                  data-testid="nav-inbox-badge"
                  className="ml-auto shrink-0 rounded-full bg-brand/20 px-1.5 py-0.5 text-xs font-medium tabular-nums text-brand"
                >
                  {unreadCount > 99 ? "99+" : unreadCount}
                </span>
              )}
              {!isCollapsed && dot && (
                <span
                  data-testid="nav-calendar-dot"
                  className={`ml-auto h-2.5 w-2.5 shrink-0 rounded-full ${DOT_COLOR[dot.level]}`}
                />
              )}
            </NavLink>
          );
        })}
      </nav>

      {/* Settings */}
      <div className={`border-t border-surface-2/50 pt-2 ${isCollapsed ? "px-2" : "px-3"}`}>
        <NavLink
          to="/dashboard/settings"
          onClick={onNavigate}
          title={isCollapsed ? "Settings" : undefined}
          aria-label={isCollapsed ? "Settings" : undefined}
          className={({ isActive }) =>
            `flex items-center rounded-lg py-2 text-sm transition-colors ${
              isCollapsed ? "justify-center px-2" : "gap-3 px-3"
            } ${
              isActive
                ? "border border-brand/30 bg-brand/10 text-brand"
                : "text-zinc-500 hover:bg-surface-1/50 hover:text-zinc-300"
            }`
          }
        >
          <Settings2 className="h-4 w-4 shrink-0" />
          {!isCollapsed && "Settings"}
        </NavLink>
      </div>

      {/* User footer */}
      <div className="border-t border-surface-2/50 p-3">
        {isCollapsed ? (
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
                aria-label="Sign out"
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
                aria-label="Sign out"
                className="text-zinc-600 transition-colors hover:text-zinc-300"
              >
                <LogOut className="h-4 w-4" />
              </button>
            </Form>
          </div>
        )}
      </div>

      {/* Collapse toggle — pinned to the very bottom, desktop rail only. The
          drawer owns open/closed below lg, so it's hidden there. */}
      {!inDrawer && onToggle && (
        <div className={`border-t border-surface-2/50 py-2 ${isCollapsed ? "px-2" : "px-3"}`}>
          <button
            type="button"
            onClick={onToggle}
            data-testid="sidebar-toggle"
            title={isCollapsed ? "Expand sidebar (⌘\\)" : "Collapse sidebar (⌘\\)"}
            aria-label={isCollapsed ? "Expand sidebar" : "Collapse sidebar"}
            aria-pressed={isCollapsed}
            className={`flex w-full items-center rounded-lg py-2 text-sm text-zinc-500 transition-colors hover:bg-surface-1/50 hover:text-zinc-300 ${
              isCollapsed ? "justify-center px-2" : "gap-3 px-3"
            }`}
          >
            {isCollapsed ? (
              <ChevronsRight className="h-4 w-4 shrink-0" />
            ) : (
              <>
                <ChevronsLeft className="h-4 w-4 shrink-0" />
                <span className="flex-1 text-left">Collapse</span>
                <kbd className="font-mono text-xs text-zinc-600">⌘\</kbd>
              </>
            )}
          </button>
        </div>
      )}
    </aside>
  );
}
