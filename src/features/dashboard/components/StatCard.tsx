import { Card, CardContent } from "@Team-Trung-Vu-Khang/eco-shared-ui";
import type { LucideIcon } from "lucide-react";
import type { ReactNode } from "react";

interface StatCardProps {
  label: string;
  value: ReactNode;
  hint?: ReactNode;
  icon: LucideIcon;
}

// Phones: compact tile (icon above, no hint) so several fit per row.
// sm+ values carry `!` — eco-shared-ui's CSS loads after ours and would win otherwise.
export function StatCard({ label, value, hint, icon: Icon }: StatCardProps) {
  return (
    <Card className="h-full">
      <CardContent className="flex h-full flex-col-reverse justify-end gap-2 p-3 sm:flex-row! sm:items-start! sm:justify-between! sm:gap-3! sm:p-5!">
        <div className="min-w-0 space-y-0.5 sm:space-y-1!">
          <p className="line-clamp-2 text-xs leading-snug text-slate-500 sm:text-sm!">{label}</p>
          <p className="text-lg font-semibold tabular-nums leading-tight text-slate-900 sm:text-2xl!">{value}</p>
          {hint && <p className="hidden! text-xs text-slate-500 sm:block!">{hint}</p>}
        </div>
        <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-emerald-50 text-emerald-700 sm:h-10! sm:w-10! sm:rounded-xl!">
          <Icon className="h-4 w-4 sm:h-5! sm:w-5!" />
        </div>
      </CardContent>
    </Card>
  );
}
