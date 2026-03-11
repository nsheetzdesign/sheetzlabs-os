import { Outlet } from "react-router";
import { PageTabs } from "~/components/ui/PageTabs";

const TABS = [
  { to: "/dashboard/calendar", label: "Schedule", end: true },
  { to: "/dashboard/calendar/booking-links", label: "Booking Links" },
  { to: "/dashboard/calendar/bookings", label: "Bookings" },
];

export default function CalendarLayout() {
  return (
    <div className="flex flex-1 flex-col overflow-hidden">
      <div className="shrink-0 border-b border-surface-2/50 px-6">
        <PageTabs tabs={TABS} />
      </div>
      <div className="flex-1 overflow-auto min-h-0">
        <Outlet />
      </div>
    </div>
  );
}
