import type { ComponentType } from "react";

export function EmptyState({
  icon: Icon,
  title,
  description,
  action,
}: {
  icon?: ComponentType<{ className?: string }>;
  title: string;
  description?: string;
  action?: React.ReactNode;
}) {
  return (
    <div className="flex flex-col items-center justify-center py-16 text-center">
      {Icon && <Icon className="mb-4 h-10 w-10 text-zinc-700" />}
      <h3 className="text-sm font-semibold text-zinc-400">{title}</h3>
      {description && (
        <p className="mt-1 max-w-sm text-xs text-zinc-600">{description}</p>
      )}
      {action && <div className="mt-4">{action}</div>}
    </div>
  );
}
