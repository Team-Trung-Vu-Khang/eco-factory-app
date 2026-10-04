import { zodResolver } from "@hookform/resolvers/zod";
import { Form } from "@Team-Trung-Vu-Khang/eco-shared-ui";
import { Check, Loader2 } from "lucide-react";
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { useUploadStatusState } from "@/components/form";
import { useFillViewportHeight } from "@/hooks/useFillViewportHeight";
import {
  WizardFooter,
  WizardHeader,
} from "@/pages/connection/mobile/wizard-ui";
import {
  EMPTY_MACHINE_DIALOG,
  machineDialogSchema,
  type MachineDialogValues,
} from "./machine-form-schema";
import { MachineFormFields } from "./MachineFormFields";

/** Full-screen create/edit form for the mobile app (replaces the dialog) */
export function MobileMachineForm({
  initialValues,
  isSubmitting,
  onSubmit,
  onClose,
}: {
  /** undefined = create */
  initialValues?: MachineDialogValues;
  isSubmitting?: boolean;
  onSubmit: (values: MachineDialogValues) => void;
  onClose: () => void;
}) {
  const isEdit = !!initialValues;
  const [fillRef, fillHeight] = useFillViewportHeight<HTMLFormElement>();
  const upload = useUploadStatusState();
  const form = useForm<MachineDialogValues>({
    resolver: zodResolver(machineDialogSchema),
    defaultValues: initialValues ?? EMPTY_MACHINE_DIALOG,
    mode: "onTouched",
  });

  // Block body: an expression body would return scrollTo's result as the "cleanup"
  useEffect(() => {
    window.scrollTo({ top: 0 });
  }, []);

  return (
    <Form {...form}>
      <form
        ref={fillRef}
        style={{ minHeight: fillHeight }}
        onSubmit={(e) => e.preventDefault()}
        className="-mx-4 -mt-4 -mb-[calc(5.5rem+env(safe-area-inset-bottom))] flex flex-col overflow-x-clip bg-[#f7f5ee] px-4 pt-4"
      >
        <WizardHeader onBack={onClose} />
        <div className="relative -mt-14 flex-1">
          <h1 className="text-[1.625rem] font-extrabold leading-tight tracking-tight text-[#0f3d22]">
            {isEdit ? "Chỉnh sửa máy" : "Thêm máy / dây chuyền"}
          </h1>
          <p className="mb-4 text-sm text-slate-600">
            Dịch vụ, công suất và nhóm nông sản của máy
          </p>
          <div className="fsl-card-in rounded-3xl bg-white p-4 shadow-[0_2px_12px_rgba(20,83,45,0.06)] ring-1 ring-emerald-900/5">
            <MachineFormFields
              control={form.control}
              onUploadingChange={upload.track}
            />
          </div>
        </div>

        <WizardFooter>
          <button
            type="button"
            onClick={onClose}
            className="flex h-14 flex-1 items-center justify-center rounded-2xl border border-slate-300 bg-white text-base font-semibold text-slate-800 shadow-sm active:scale-[0.98]"
          >
            Hủy
          </button>
          <button
            type="button"
            disabled={isSubmitting || upload.isUploading}
            onClick={form.handleSubmit(onSubmit)}
            className="flex h-14 flex-[1.6] items-center justify-center gap-2 rounded-2xl bg-[#14532d] text-base font-semibold text-white shadow-lg shadow-emerald-900/25 active:scale-[0.98] disabled:opacity-70"
          >
            {isSubmitting || upload.isUploading ? (
              <Loader2 className="h-5 w-5 animate-spin" />
            ) : (
              <Check className="h-5 w-5" />
            )}
            {upload.isUploading
              ? "Đang tải ảnh..."
              : isEdit
                ? "Lưu thay đổi"
                : "Thêm máy"}
          </button>
        </WizardFooter>
      </form>
    </Form>
  );
}
