import { Button, Skeleton } from "@Team-Trung-Vu-Khang/eco-shared-ui";

export function FactoryPageSkeleton() {
  return (
    <div className="space-y-6">
      <Skeleton className="h-24" />
      <Skeleton className="h-48" />
      <Skeleton className="h-48" />
    </div>
  );
}

export function FactoryNotFound({ onBack }: { onBack: () => void }) {
  return (
    <div className="flex min-h-[40vh] flex-col items-center justify-center gap-3 text-center">
      <p className="text-sm text-slate-600">Không tìm thấy nhà máy hoặc đã bị xóa.</p>
      <Button variant="outline" onClick={onBack}>
        Quay lại danh sách
      </Button>
    </div>
  );
}
