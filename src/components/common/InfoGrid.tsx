import type { ReactNode } from "react";

export interface InfoItem {
  label: string;
  value: ReactNode;
  wide?: boolean;
}

export function InfoGrid({ items }: { items: InfoItem[] }) {
  return (
    <dl className="grid gap-x-6 gap-y-4 sm:grid-cols-2">
      {items.map((item) => (
        <div key={item.label} className={item.wide ? "sm:col-span-2" : undefined}>
          <dt className="text-xs text-slate-500">{item.label}</dt>
          <dd className="mt-0.5 text-sm text-slate-900">
            {item.value === undefined || item.value === null || item.value === "" ? (
              <span className="text-slate-400">—</span>
            ) : (
              item.value
            )}
          </dd>
        </div>
      ))}
    </dl>
  );
}
