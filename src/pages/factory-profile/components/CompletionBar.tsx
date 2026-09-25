export function CompletionBar({ percent }: { percent: number }) {
  return (
    <div className="flex items-center gap-2">
      <div className="h-1.5 w-16 overflow-hidden rounded-full bg-slate-100">
        <div
          className={`h-full rounded-full ${percent === 100 ? "bg-emerald-600" : "bg-amber-500"}`}
          style={{ width: `${percent}%` }}
        />
      </div>
      <span className="text-xs tabular-nums text-slate-600">{percent}%</span>
    </div>
  );
}
