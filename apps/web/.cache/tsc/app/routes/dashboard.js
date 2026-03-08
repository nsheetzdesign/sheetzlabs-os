import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { Outlet, data, useLoaderData } from "react-router";
import { useEffect, useState } from "react";
import { Sidebar } from "~/components/dashboard/Sidebar";
import { CommandPalette } from "~/components/dashboard/CommandPalette";
import { requireAuth } from "~/lib/auth.server";
export async function loader({ request, context }) {
    const { user, headers } = await requireAuth(request, context.cloudflare.env);
    return data({ user: { email: user.email } }, { headers });
}
export default function DashboardLayout() {
    const { user } = useLoaderData();
    const [paletteOpen, setPaletteOpen] = useState(false);
    useEffect(() => {
        function onKeyDown(e) {
            if ((e.metaKey || e.ctrlKey) && e.key === "k") {
                e.preventDefault();
                setPaletteOpen((v) => !v);
            }
        }
        window.addEventListener("keydown", onKeyDown);
        return () => window.removeEventListener("keydown", onKeyDown);
    }, []);
    return (_jsxs("div", { className: "flex h-screen overflow-hidden bg-surface-0", children: [_jsx(Sidebar, { user: user, onOpenPalette: () => setPaletteOpen(true) }), _jsx("div", { className: "ml-64 flex flex-1 flex-col overflow-auto", children: _jsx(Outlet, {}) }), _jsx(CommandPalette, { open: paletteOpen, onClose: () => setPaletteOpen(false) })] }));
}
