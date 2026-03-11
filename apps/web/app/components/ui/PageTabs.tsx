import { NavLink } from "react-router";

interface Tab {
  to: string;
  label: string;
  end?: boolean;
}

interface PageTabsProps {
  tabs: Tab[];
}

export function PageTabs({ tabs }: PageTabsProps) {
  return (
    <nav className="flex gap-1">
      {tabs.map((tab) => (
        <NavLink
          key={tab.to}
          to={tab.to}
          end={tab.end ?? false}
          className={({ isActive }) =>
            `px-4 py-2.5 text-sm font-medium border-b-2 -mb-px transition-colors ${
              isActive
                ? "border-brand text-brand"
                : "border-transparent text-zinc-400 hover:text-zinc-200"
            }`
          }
        >
          {tab.label}
        </NavLink>
      ))}
    </nav>
  );
}
