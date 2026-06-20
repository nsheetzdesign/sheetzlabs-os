import { Outlet } from "react-router";

// Thin layout so the `reconcile` action route nests under /dashboard/repos. The
// index page owns the UI; this just renders the matched child.
export default function ReposLayout() {
  return <Outlet />;
}
