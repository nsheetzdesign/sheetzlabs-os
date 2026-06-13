import type { LoaderFunctionArgs } from "react-router";
import { Outlet, data, useLoaderData } from "react-router";
import { useEffect, useState } from "react";
import { PanelLeft } from "lucide-react";
import { Sidebar } from "~/components/dashboard/Sidebar";
import { CommandPalette } from "~/components/dashboard/CommandPalette";
import { Drawer } from "~/components/ui/Drawer";
import { useSidebarCollapsed } from "~/hooks/useSidebarCollapsed";
import { requireAuth } from "~/lib/auth.server";

export async function loader({ request, context }: LoaderFunctionArgs) {
  const { user, headers } = await requireAuth(request, context.cloudflare.env);
  return data({ user: { email: user.email } }, { headers });
}

export default function DashboardLayout() {
  const { user } = useLoaderData<typeof loader>();
  const [paletteOpen, setPaletteOpen] = useState(false);
  // Mobile (<lg): the primary sidebar is a hamburger-triggered drawer.
  const [navOpen, setNavOpen] = useState(false);
  // Desktop (≥lg): collapse to an icon rail. Persisted, SSR-safe, no auto-collapse.
  const { collapsed, toggle, mounted } = useSidebarCollapsed();

  // Keyboard shortcuts. Cmd/Ctrl+K → command palette; Cmd/Ctrl+\ → toggle the
  // sidebar rail. We use `\` rather than `[` because bare `[` is the inbox
  // archive shortcut — and even the modified combo reads as a collision, so we
  // sidestep it. `\` is unused across the inbox + calendar shortcut maps.
  useEffect(() => {
    function onKeyDown(e: KeyboardEvent) {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault();
        setPaletteOpen((v) => !v);
      }
      if ((e.metaKey || e.ctrlKey) && e.key === "\\") {
        e.preventDefault();
        toggle();
      }
    }
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [toggle]);

  return (
    <div className="flex h-screen overflow-hidden bg-surface-0">
      {/* Desktop rail (≥lg) — fixed; hidden below the breakpoint. */}
      <Sidebar
        user={user}
        onOpenPalette={() => setPaletteOpen(true)}
        collapsed={collapsed}
        onToggle={toggle}
        mounted={mounted}
      />

      {/* Mobile nav drawer (<lg) — focus-trapped, Esc-closes, restores focus. */}
      <Drawer
        open={navOpen}
        onClose={() => setNavOpen(false)}
        ariaLabel="Main navigation"
        panelClassName="w-64"
      >
        <Sidebar
          user={user}
          onOpenPalette={() => {
            setNavOpen(false);
            setPaletteOpen(true);
          }}
          inDrawer
          onNavigate={() => setNavOpen(false)}
        />
      </Drawer>

      <div
        data-testid="dashboard-content"
        className={`flex min-w-0 flex-1 flex-col ${
          mounted ? "transition-all duration-200" : ""
        } ml-0 ${collapsed ? "lg:ml-16" : "lg:ml-64"}`}
      >
        {/* Mobile top app bar (<lg) — holds the primary-nav hamburger + brand.
            On the inbox route the inbox's own "Open mailboxes" hamburger lives in
            the toolbar one row below this, with a different icon + label, so the
            two drawer triggers stay visually and functionally distinct. */}
        <header className="flex items-center gap-3 border-b border-surface-2/50 bg-surface-0 px-4 py-2.5 lg:hidden">
          <button
            type="button"
            onClick={() => setNavOpen(true)}
            aria-label="Open navigation menu"
            data-testid="main-nav-trigger"
            className="flex items-center justify-center rounded-lg p-1.5 text-zinc-400 transition-colors hover:bg-surface-1/50 hover:text-zinc-200"
          >
            <PanelLeft className="h-5 w-5" />
          </button>
          <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-brand text-xs font-bold text-white">
            SL
          </div>
          <span className="text-sm font-semibold">Sheetz Labs</span>
        </header>

        <div className="min-h-0 flex-1 overflow-auto min-w-0">
          <Outlet />
        </div>
      </div>

      <CommandPalette open={paletteOpen} onClose={() => setPaletteOpen(false)} />
    </div>
  );
}
