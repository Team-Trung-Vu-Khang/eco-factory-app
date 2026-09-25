const color = (percent: number) =>
  percent >= 90 ? "bg-rose-500" : percent >= 70 ? "bg-amber-500" : "bg-emerald-600";

export function UtilizationBar({ percent }: { percent: number }) {
  return (
    <div className="flex items-center gap-2">
      <div className="h-1.5 w-20 overflow-hidden rounded-full bg-slate-100">
        <div className={`h-full rounded-full ${color(percent)}`} style={{ width: `${Math.min(percent, 100)}%` }} />
      </div>
      <span className="text-xs tabular-nums text-slate-600">{percent}%</span>
    </div>
  );
}
