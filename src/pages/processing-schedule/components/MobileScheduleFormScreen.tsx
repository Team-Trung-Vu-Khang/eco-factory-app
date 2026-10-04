import { Loader2, Send } from "lucide-react";
import { useEffect } from "react";
import type {
  ScheduleFormValues,
  ScheduleRow,
} from "@/features/processing-schedule";
import { useFillViewportHeight } from "@/hooks/useFillViewportHeight";
import {
  WizardFooter,
  WizardHeader,
} from "@/pages/connection/mobile/wizard-ui";
import { ScheduleForm } from "./ScheduleForm";

const FORM_ID = "mobile-schedule-form";

/** Full-screen create/edit for the mobile app — wraps the existing ScheduleForm */
export function MobileScheduleFormScreen({
  machineId,
  editingSchedule,
  isSubmitting,
  onSubmit,
  onClose,
}: {
  machineId?: string;
  editingSchedule: ScheduleRow | null;
  isSubmitting: boolean;
  onSubmit: (values: ScheduleFormValues) => Promise<boolean>;
  onClose: () => void;
}) {
  const [fillRef, fillHeight] = useFillViewportHeight<HTMLDivElement>();

  useEffect(() => {
    window.scrollTo({ top: 0 });
  }, []);

  return (
    <div
      ref={fillRef}
      style={{ minHeight: fillHeight }}
      className="-mx-4 -mt-4 -mb-[calc(5.5rem+env(safe-area-inset-bottom))] flex flex-col overflow-x-clip bg-[#f7f5ee] px-4 pt-4"
    >
      <WizardHeader onBack={onClose} />
      <div className="relative -mt-14 flex-1">
        <h1 className="text-[1.625rem] font-extrabold leading-tight tracking-tight text-[#0f3d22]">
          {editingSchedule ? "Sửa tin đăng" : "Đăng lịch nhận chế biến"}
        </h1>
        <p className="mb-4 text-sm text-slate-600">
          Chọn máy, khoảng thời gian và công suất có thể nhận
        </p>
        {/* Existing form keeps its machine logic & validation; restyle its card */}
        <div className="fsl-card-in [&>form]:rounded-3xl [&>form]:border-0 [&>form]:shadow-[0_2px_12px_rgba(20,83,45,0.06)] [&>form]:ring-1 [&>form]:ring-emerald-900/5">
          <ScheduleForm
            machineId={machineId}
            editingSchedule={editingSchedule}
            isSubmitting={isSubmitting}
            onSubmit={async (values) => {
              const ok = await onSubmit(values);
              if (ok) onClose();
              return ok;
            }}
            onCancelEdit={onClose}
            formId={FORM_ID}
            hideActions
          />
        </div>
      </div>

      {/* Same sticky footer as the machine form */}
      <WizardFooter>
        <button
          type="button"
          onClick={onClose}
          className="flex h-14 flex-1 items-center justify-center rounded-2xl border border-slate-300 bg-white text-base font-semibold text-slate-800 shadow-sm active:scale-[0.98]"
        >
          Hủy
        </button>
        <button
          type="submit"
          form={FORM_ID}
          disabled={isSubmitting}
          className="flex h-14 flex-[1.6] items-center justify-center gap-2 rounded-2xl bg-[#14532d] text-base font-semibold text-white shadow-lg shadow-emerald-900/25 active:scale-[0.98] disabled:opacity-70"
        >
          {isSubmitting ? (
            <Loader2 className="h-5 w-5 animate-spin" />
          ) : (
            <Send className="h-5 w-5" />
          )}
          {editingSchedule ? "Cập nhật tin" : "Đăng tin"}
        </button>
      </WizardFooter>
    </div>
  );
}
