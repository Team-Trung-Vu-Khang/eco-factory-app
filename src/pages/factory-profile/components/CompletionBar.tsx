/** Profile completion — percentage only, green at 100% */
export function CompletionBar({ percent }: { percent: number }) {
  return (
    <span className={`text-sm font-semibold tabular-nums ${percent >= 100 ? "text-emerald-600" : "text-amber-600"}`}>
      {percent}%
    </span>
  );
}
