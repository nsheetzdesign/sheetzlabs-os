import { Bell, Plus } from "lucide-react";

interface HeaderProps {
  title: string;
}

export function Header({ title }: HeaderProps) {
  return (
    <header className="sticky top-0 z-10 flex items-center justify-between border-b border-surface-2/50 bg-surface-0/80 px-6 py-4 backdrop-blur-md">
      <h1 className="text-lg font-semibold">{title}</h1>
      <div className="flex items-center gap-3">
        <button className="relative text-zinc-500 transition-colors hover:text-zinc-300">
          <Bell className="h-5 w-5" />
          <span className="absolute -right-0.5 -top-0.5 h-2 w-2 rounded-full bg-brand" />
        </button>
        <button className="flex items-center gap-1.5 rounded-lg bg-brand px-3 py-1.5 text-sm font-medium text-white transition-colors hover:bg-brand-dark">
          <Plus className="h-4 w-4" />
          New
        </button>
      </div>
    </header>
  );
}
