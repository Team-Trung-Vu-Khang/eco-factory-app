import {
  Button,
  FormDialog,
  Label,
  Textarea,
  useToast,
} from "@Team-Trung-Vu-Khang/eco-shared-ui";
import { Check, X } from "lucide-react";
import { useState } from "react";
import {
  useAdminApproveProfile,
  useAdminRejectProfile,
  type FactoryProfile,
} from "@/features/factory";

/** Admin: approve / reject a pending profile */
export function ReviewActions({
  factory,
  mobile,
}: {
  factory: FactoryProfile;
  /** Large thumb-friendly buttons for the mobile sticky footer */
  mobile?: boolean;
}) {
  const { toast } = useToast();
  const approve = useAdminApproveProfile();
  const reject = useAdminRejectProfile();
  const [rejecting, setRejecting] = useState(false);
  const [note, setNote] = useState("");

  const isPending = factory.reviewStatus === "PENDING_REVIEW";
  if (!isPending) return null;

  const handleApprove = async () => {
    try {
      await approve.mutateAsync(factory.id);
      toast({ title: "Thành công", description: "Đã duyệt hồ sơ nhà máy." });
    } catch (error) {
      toast({
        title: "Không thể duyệt",
        description: (error as Error).message,
        variant: "destructive",
      });
    }
  };

  const handleReject = async () => {
    if (!note.trim()) {
      toast({
        title: "Chưa nhập lý do",
        description: "Vui lòng nhập lý do từ chối hồ sơ.",
        variant: "destructive",
      });
      return;
    }
    try {
      await reject.mutateAsync({ id: factory.id, note: note.trim() });
      toast({ title: "Đã từ chối", description: "Đã từ chối hồ sơ nhà máy." });
      setRejecting(false);
    } catch (error) {
      toast({
        title: "Không thể từ chối",
        description: (error as Error).message,
        variant: "destructive",
      });
    }
  };

  const isLoading = approve.isPending || reject.isPending;

  return (
    <>
      {mobile ? (
        <>
          <button
            type="button"
            onClick={() => setRejecting(true)}
            disabled={isLoading}
            className="flex h-14 flex-1 items-center justify-center gap-1.5 rounded-2xl border border-rose-200 bg-white text-base font-semibold text-rose-600 shadow-sm active:scale-[0.98] disabled:opacity-60"
          >
            <X className="h-5 w-5" /> Từ chối
          </button>
          <button
            type="button"
            onClick={handleApprove}
            disabled={isLoading}
            className="flex h-14 flex-[1.4] items-center justify-center gap-1.5 rounded-2xl bg-[#14532d] text-base font-semibold text-white shadow-lg shadow-emerald-900/25 active:scale-[0.98] disabled:opacity-60"
          >
            <Check className="h-5 w-5" /> Duyệt hồ sơ
          </button>
        </>
      ) : (
        <>
          <Button
            variant="outline"
            className="text-rose-600"
            onClick={() => setRejecting(true)}
            disabled={isLoading}
          >
            <X className="mr-2 h-4 w-4" />
            Từ chối
          </Button>
          <Button
            className="bg-emerald-600 hover:bg-emerald-700"
            onClick={handleApprove}
            disabled={isLoading}
          >
            <Check className="mr-2 h-4 w-4" />
            Duyệt
          </Button>
        </>
      )}

      <FormDialog
        open={rejecting}
        onOpenChange={setRejecting}
        title="Từ chối hồ sơ"
        description={factory.name}
        submitLabel="Từ chối"
        loading={reject.isPending}
        onSubmit={handleReject}
      >
        <div className="space-y-1.5">
          <Label htmlFor="review-note">
            Lý do từ chối <span className="text-rose-500">*</span>
          </Label>
          <Textarea
            id="review-note"
            rows={3}
            value={note}
            onChange={(e) => setNote(e.target.value)}
            placeholder="VD: Thiếu ảnh cơ sở sản xuất hoặc thông tin giấy phép chưa rõ ràng"
            required
          />
        </div>
      </FormDialog>
    </>
  );
}
