import { Clock, XCircle } from "lucide-react";
import type { FactoryProfile } from "@/features/factory";

export function ApprovalNotice({
  factory,
  isOwner,
}: {
  factory: FactoryProfile;
  isOwner?: boolean;
}) {
  if (factory.reviewStatus === "PENDING_REVIEW") {
    return (
      <div className="flex items-start gap-3 rounded-xl border border-amber-200 bg-amber-50 p-4 text-sm text-amber-800">
        <Clock className="mt-0.5 h-4 w-4 shrink-0" />
        <p>
          {isOwner
            ? "Hồ sơ đã được gửi và đang chờ quản trị viên duyệt."
            : "Hồ sơ vừa được chủ nhà máy cập nhật, đang chờ duyệt."}
        </p>
      </div>
    );
  }
  if (factory.reviewStatus === "REJECTED") {
    return (
      <div className="flex items-start gap-3 rounded-xl border border-rose-200 bg-rose-50 p-4 text-sm text-rose-800">
        <XCircle className="mt-0.5 h-4 w-4 shrink-0" />
        <div>
          <p className="font-medium">
            Hồ sơ bị từ chối
            {isOwner ? " — vui lòng chỉnh sửa và gửi lại." : "."}
          </p>
          {factory.reviewNote && (
            <p className="mt-0.5">Lý do: {factory.reviewNote}</p>
          )}
        </div>
      </div>
    );
  }
  return null;
}
