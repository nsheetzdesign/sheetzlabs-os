import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { Outlet, data, useLoaderData, useLocation } from "react-router";
import { useEffect, useState, useRef } from "react";
import { Sidebar } from "~/components/dashboard/Sidebar";
import { CommandPalette } from "~/components/dashboard/CommandPalette";
import { requireAuth } from "~/lib/auth.server";
// Pages with a secondary sidebar — auto-collapse the primary one
const SECONDARY_SIDEBAR_PATHS = [
    "/dashboard/inbox",
    "/dashboard/calendar",
    "/dashboard/relationships",
];
export async function loader({ request, context }) {
    const { user, headers } = await requireAuth(request, context.cloudflare.env);
    return data({ user: { email: user.email } }, { headers });
}
export default function DashboardLayout() {
    const { user } = useLoaderData();
    const location = useLocation();
    const [paletteOpen, setPaletteOpen] = useState(false);
    const [sidebarCollapsed, setSidebarCollapsed] = useState(() => {
        if (typeof window !== "undefined") {
            return localStorage.getItem("sidebar-collapsed") === "true";
        }
        return false;
    });
    // Once user manually toggles, stop auto-collapsing on navigation
    const userToggled = useRef(false);
    // Persist collapse state
    useEffect(() => {
        localStorage.setItem("sidebar-collapsed", String(sidebarCollapsed));
    }, [sidebarCollapsed]);
    // Auto-collapse when navigating to pages with secondary sidebars
    useEffect(() => {
        if (userToggled.current)
            return;
        const hasSecondary = SECONDARY_SIDEBAR_PATHS.some((p) => location.pathname.startsWith(p));
        setSidebarCollapsed(hasSecondary);
    }, [location.pathname]);
    const toggleSidebar = () => {
        userToggled.current = true;
        setSidebarCollapsed((v) => !v);
    };
    useEffect(() => {
        function onKeyDown(e) {
            if ((e.metaKey || e.ctrlKey) && e.key === "k") {
                e.preventDefault();
                setPaletteOpen((v) => !v);
            }
            if ((e.metaKey || e.ctrlKey) && e.key === "[") {
                e.preventDefault();
                toggleSidebar();
            }
        }
        window.addEventListener("keydown", onKeyDown);
        return () => window.removeEventListener("keydown", onKeyDown);
    }, []);
    return (_jsxs("div", { className: "flex h-screen overflow-hidden bg-surface-0", children: [_jsx(Sidebar, { user: user, onOpenPalette: () => setPaletteOpen(true), collapsed: sidebarCollapsed, onToggle: toggleSidebar }), _jsx("div", { className: `flex flex-1 flex-col overflow-auto transition-all duration-200 ${sidebarCollapsed ? "ml-16" : "ml-64"}`, children: _jsx(Outlet, {}) }), _jsx(CommandPalette, { open: paletteOpen, onClose: () => setPaletteOpen(false) })] }));
}
