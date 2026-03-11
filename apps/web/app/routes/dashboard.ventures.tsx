import { Outlet } from "react-router";
import { PageTabs } from "~/components/ui/PageTabs";

const TABS = [
  { to: "/dashboard/ventures", label: "Portfolio", end: true },
  { to: "/dashboard/ventures/pipeline", label: "Pipeline" },
];

export default function VenturesLayout() {
  return (
    <div className="flex flex-1 flex-col">
      <div className="border-b border-surface-2/50 px-6">
        <PageTabs tabs={TABS} />
      </div>
      <Outlet />
    </div>
  );
}
