import { Outlet } from "react-router";
import { PageTabs } from "~/components/ui/PageTabs";

const TABS = [
  { to: "/dashboard/knowledge", label: "Articles", end: true },
  { to: "/dashboard/knowledge/content", label: "Content" },
  { to: "/dashboard/knowledge/captures", label: "Captures" },
];

export default function KnowledgeLayout() {
  return (
    <div className="flex flex-1 flex-col">
      <div className="border-b border-surface-2/50 px-6">
        <PageTabs tabs={TABS} />
      </div>
      <Outlet />
    </div>
  );
}
