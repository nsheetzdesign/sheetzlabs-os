import type { LoaderFunctionArgs } from "react-router";
import { Outlet, data, useLoaderData } from "react-router";
import { useEffect, useState } from "react";
import { Sidebar } from "~/components/dashboard/Sidebar";
import { CommandPalette } from "~/components/dashboard/CommandPalette";
import { requireAuth } from "~/lib/auth.server";

export async function loader({ request, context }: LoaderFunctionArgs) {
  const { user, headers } = await requireAuth(request, context.cloudflare.env);
  return data({ user: { email: user.email } }, { headers });
}

export default function DashboardLayout() {
  const { user } = useLoaderData<typeof loader>();
  const [paletteOpen, setPaletteOpen] = useState(false);

  useEffect(() => {
    function onKeyDown(e: KeyboardEvent) {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault();
        setPaletteOpen((v) => !v);
      }
    }
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, []);

  return (
    <div className="flex h-screen overflow-hidden bg-surface-0">
      <Sidebar user={user} onOpenPalette={() => setPaletteOpen(true)} />
      <div className="ml-64 flex flex-1 flex-col overflow-auto">
        <Outlet />
      </div>
      <CommandPalette
        open={paletteOpen}
        onClose={() => setPaletteOpen(false)}
      />
    </div>
  );
}
