import { StatsCard } from "@Team-Trung-Vu-Khang/eco-shared-ui";
import type { LucideIcon } from "lucide-react";
import type { ComponentProps } from "react";

type StatsCardProps = ComponentProps<typeof StatsCard>;

export interface StatItem {
  title: string;
  value: string | number;
  icon: LucideIcon;
  change?: string;
  changeType?: StatsCardProps["changeType"];
}

/**
 * Phones: compact 2-column tiles · sm+: regular StatsCards.
 * `!` because eco-shared-ui's CSS loads after ours and its `grid`/`hidden` win otherwise.
 */
export function StatsGrid({ items, className = "sm:grid-cols-2 xl:grid-cols-4" }: { items: StatItem[]; className?: string }) {
  return (
    <>
      <div className="grid grid-cols-2 gap-2 sm:hidden!">
        {items.map(({ title, value, icon: Icon, change }) => (
          <div key={title} className="rounded-xl border border-slate-200 bg-white p-3">
            <div className="flex items-center justify-between gap-2">
              <p className="truncate text-xs text-slate-500">{title}</p>
              <Icon className="h-4 w-4 shrink-0 text-primary" />
            </div>
            <p className="mt-1 text-xl font-bold tabular-nums text-slate-900">{value}</p>
            {change && <p className="truncate text-[11px] text-slate-500">{change}</p>}
          </div>
        ))}
      </div>
      <div className={`hidden! gap-4 sm:grid! ${className}`}>
        {items.map((item) => (
          <StatsCard key={item.title} {...item} />
        ))}
      </div>
    </>
  );
}
