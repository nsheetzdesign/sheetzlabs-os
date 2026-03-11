import { Outlet } from "react-router";
import { PageTabs } from "~/components/ui/PageTabs";

const TABS = [
  { to: "/dashboard/agents", label: "Agents", end: true },
  { to: "/dashboard/agents/runs", label: "Runs" },
  { to: "/dashboard/agents/performance", label: "Performance" },
];

export default function AgentsLayout() {
  return (
    <div className="flex flex-1 flex-col">
      <div className="border-b border-surface-2/50 px-6">
        <PageTabs tabs={TABS} />
      </div>
      <Outlet />
    </div>
  );
}
