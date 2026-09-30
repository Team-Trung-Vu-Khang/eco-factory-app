import {
  FormDialog,
  Label,
  Textarea,
} from "@Team-Trung-Vu-Khang/eco-shared-ui";
import { useState } from "react";
import type { ConnectionRequestItem } from "@/features/connection";

interface ResolveDialogProps {
  target: {
    request: ConnectionRequestItem;
    status: "SUCCESS" | "FAILED";
  } | null;
  loading?: boolean;
  onOpenChange: (open: boolean) => void;
  onConfirm: (note: string) => void;
}

export function ResolveDialog({
  target,
  loading,
  onOpenChange,
  onConfirm,
}: ResolveDialogProps) {
  // Parent keys this per request, so the note starts empty each time
  const [note, setNote] = useState("");
  const success = target?.status === "SUCCESS";
  const contact = target?.request.contactName || "Nông hộ";
  const factory = target?.request.profile?.name ?? "Nhà máy";
  const machineName = target?.request.schedule?.machine?.name;

  return (
    <FormDialog
      open={!!target}
      onOpenChange={onOpenChange}
      title={success ? "Xác nhận kết nối thành công" : "Từ chối kết nối"}
      description={target ? `${contact} ↔ ${factory}` : undefined}
      submitLabel="Xác nhận"
      loading={loading}
      onSubmit={() => onConfirm(note.trim())}
    >
      <div className="space-y-3">
        {success && machineName && (
          <p className="rounded-lg bg-emerald-50 p-3 text-sm text-emerald-800">
            Tin đăng lịch nhận chế biến của "{machineName}" sẽ được đóng và các
            yêu cầu khác của tin này sẽ được chuyển sang trạng thái đã từ chối.
          </p>
        )}
        <div className="space-y-1.5">
          <Label htmlFor="resolve-note">
            {success ? "Ghi chú kết quả (không bắt buộc)" : "Lý do từ chối"}
          </Label>
          <Textarea
            id="resolve-note"
            rows={3}
            value={note}
            onChange={(e) => setNote(e.target.value)}
            placeholder={
              success ? "VD: Đã ký hợp đồng sấy 2 tấn" : "VD: Lịch tháng đã kín"
            }
          />
        </div>
      </div>
    </FormDialog>
  );
}
