export function DashboardError({ onRetry }: { onRetry: () => void }) {
  return (
    <div className="text-sm text-slate-600">
      Không tải được dữ liệu.{" "}
      <button
        className="font-medium text-emerald-700 underline"
        onClick={onRetry}
      >
        Thử lại
      </button>
    </div>
  );
}
