import { Button, Skeleton } from "@Team-Trung-Vu-Khang/eco-shared-ui";

export function DetailPageSkeleton() {
  return (
    <div className="space-y-6">
      <Skeleton className="h-24" />
      <Skeleton className="h-48" />
      <Skeleton className="h-48" />
    </div>
  );
}

export function NotFoundState({ message, onBack }: { message: string; onBack: () => void }) {
  return (
    <div className="flex min-h-[40vh] flex-col items-center justify-center gap-3 text-center">
      <p className="text-sm text-slate-600">{message}</p>
      <Button variant="outline" onClick={onBack}>
        Quay lại danh sách
      </Button>
    </div>
  );
}
