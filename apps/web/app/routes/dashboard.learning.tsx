import { Outlet } from "react-router";
import { PageTabs } from "~/components/ui/PageTabs";

const TABS = [
  { to: "/dashboard/learning", label: "Paths", end: true },
  { to: "/dashboard/learning/progress", label: "Progress" },
  { to: "/dashboard/learning/tutor", label: "Tutor" },
];

export default function LearningLayout() {
  return (
    <div className="p-6 h-full flex flex-col">
      <h1 className="text-2xl font-semibold text-zinc-100 mb-6">Learning</h1>
      <PageTabs tabs={TABS} />
      <div className="flex-1 overflow-auto">
        <Outlet />
      </div>
    </div>
  );
}
