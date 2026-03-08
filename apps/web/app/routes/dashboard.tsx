import { Outlet } from "react-router";
import { useEffect, useState } from "react";
import { Sidebar } from "~/components/dashboard/Sidebar";
import { CommandPalette } from "~/components/dashboard/CommandPalette";

export default function DashboardLayout() {
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
      <Sidebar onOpenPalette={() => setPaletteOpen(true)} />
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
