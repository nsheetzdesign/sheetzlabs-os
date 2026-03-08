import type { SelectHTMLAttributes } from "react";

interface SelectProps extends SelectHTMLAttributes<HTMLSelectElement> {
  error?: boolean;
}

export function Select({ error, className = "", children, ...props }: SelectProps) {
  return (
    <select
      className={`w-full rounded-lg border px-3 py-2 text-sm text-zinc-200 focus:outline-none focus:ring-1 ${
        error
          ? "border-red-500/50 bg-surface-1 focus:border-red-500/70 focus:ring-red-500/20"
          : "border-surface-2 bg-surface-1 focus:border-brand/50 focus:ring-brand/20"
      } ${className}`}
      {...props}
    >
      {children}
    </select>
  );
}
