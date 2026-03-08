import { NavLink, Outlet } from "react-router";

const settingsTabs = [
  { label: "Stripe", to: "/dashboard/settings/stripe" },
  { label: "Expenses", to: "/dashboard/settings/expenses" },
];

export default function SettingsLayout() {
  return (
    <div className="min-h-screen p-8">
      <div className="mb-6">
        <h1 className="text-2xl font-semibold text-zinc-100">Settings</h1>
        <p className="mt-1 text-sm text-zinc-500">
          Manage integrations and workspace configuration.
        </p>
      </div>

      {/* Sub-nav tabs */}
      <div className="mb-6 flex gap-1 border-b border-surface-2/50">
        {settingsTabs.map(({ label, to }) => (
          <NavLink
            key={to}
            to={to}
            className={({ isActive }) =>
              `px-4 py-2 text-sm font-medium transition-colors border-b-2 -mb-px ${
                isActive
                  ? "border-brand text-brand"
                  : "border-transparent text-zinc-500 hover:text-zinc-300"
              }`
            }
          >
            {label}
          </NavLink>
        ))}
      </div>

      <Outlet />
    </div>
  );
}
