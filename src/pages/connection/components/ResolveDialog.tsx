import { FormDialog, Label, Textarea } from "@Team-Trung-Vu-Khang/eco-shared-ui";
import { useState } from "react";
import type { ConnectionRequest } from "@/features/connection";

interface ResolveDialogProps {
  target: { request: ConnectionRequest; status: "SUCCESS" | "FAILED" } | null;
  loading?: boolean;
  onOpenChange: (open: boolean) => void;
  onConfirm: (note: string) => void;
}

export function ResolveDialog({ target, loading, onOpenChange, onConfirm }: ResolveDialogProps) {
  // Parent keys this per request, so the note starts empty each time
  const [note, setNote] = useState("");
  const success = target?.status === "SUCCESS";

  return (
    <FormDialog
      open={!!target}
      onOpenChange={onOpenChange}
      title={success ? "Xác nhận kết nối thành công" : "Kết nối không thành công"}
      description={target ? `${target.request.farmerName} ↔ ${target.request.factoryName}` : undefined}
      submitLabel="Xác nhận"
      loading={loading}
      onSubmit={() => onConfirm(note.trim())}
    >
      <div className="space-y-3">
        {success && (
          <p className="rounded-lg bg-emerald-50 p-3 text-sm text-emerald-800">
            Tin đăng lịch nhận chế biến của "{target?.request.machineName}" sẽ được đóng để không tiếp tục matching.
          </p>
        )}
        <div className="space-y-1.5">
          <Label htmlFor="resolve-note">Ghi chú kết quả</Label>
          <Textarea
            id="resolve-note"
            rows={3}
            value={note}
            onChange={(e) => setNote(e.target.value)}
            placeholder={success ? "VD: Đã ký hợp đồng sấy 2 tấn" : "VD: Sản lượng chưa đủ tối thiểu"}
          />
        </div>
      </div>
    </FormDialog>
  );
}
