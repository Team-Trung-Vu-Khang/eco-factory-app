import { Button, FormDialog, Label, Textarea, useToast } from "@Team-Trung-Vu-Khang/eco-shared-ui";
import { Check, X } from "lucide-react";
import { useState } from "react";
import { useReviewFactory, type Factory } from "@/features/factory";

/** Admin: approve / reject a pending profile */
export function ReviewActions({ factory }: { factory: Factory }) {
  const { toast } = useToast();
  const review = useReviewFactory();
  const [rejecting, setRejecting] = useState(false);
  const [note, setNote] = useState("");

  const submit = async (status: "APPROVED" | "REJECTED") => {
    try {
      await review.mutateAsync({ id: factory.id, status, note: note.trim() || undefined });
      toast({ title: status === "APPROVED" ? "Đã duyệt hồ sơ" : "Đã từ chối hồ sơ" });
      setRejecting(false);
    } catch (error) {
      toast({ title: "Không thể cập nhật", description: (error as Error).message, variant: "destructive" });
    }
  };

  if (factory.approvalStatus !== "PENDING") return null;

  return (
    <>
      <Button variant="outline" className="text-rose-600" onClick={() => setRejecting(true)} disabled={review.isPending}>
        <X className="mr-2 h-4 w-4" />
        Từ chối
      </Button>
      <Button className="bg-emerald-600 hover:bg-emerald-700" onClick={() => submit("APPROVED")} disabled={review.isPending}>
        <Check className="mr-2 h-4 w-4" />
        Duyệt
      </Button>

      <FormDialog
        open={rejecting}
        onOpenChange={setRejecting}
        title="Từ chối hồ sơ"
        description={factory.name}
        submitLabel="Từ chối"
        loading={review.isPending}
        onSubmit={() => submit("REJECTED")}
      >
        <div className="space-y-1.5">
          <Label htmlFor="review-note">Lý do</Label>
          <Textarea id="review-note" rows={3} value={note} onChange={(e) => setNote(e.target.value)} placeholder="VD: Thiếu ảnh cơ sở sản xuất" />
        </div>
      </FormDialog>
    </>
  );
}
