import { zodResolver } from "@hookform/resolvers/zod";
import { Form, FormDialog } from "@Team-Trung-Vu-Khang/eco-shared-ui";
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { useUploadStatusState } from "@/components/form";
import {
  EMPTY_MACHINE_DIALOG,
  machineDialogSchema,
  type MachineDialogValues,
} from "./machine-form-schema";
import { MachineFormFields } from "./MachineFormFields";

interface MachineFormDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  /** undefined = create */
  initialValues?: MachineDialogValues;
  isSubmitting?: boolean;
  onSubmit: (values: MachineDialogValues) => void;
}

export function MachineFormDialog({
  open,
  onOpenChange,
  initialValues,
  isSubmitting,
  onSubmit,
}: MachineFormDialogProps) {
  const isEdit = !!initialValues;
  const form = useForm<MachineDialogValues>({
    resolver: zodResolver(machineDialogSchema),
    defaultValues: EMPTY_MACHINE_DIALOG,
    mode: "onTouched",
  });
  const { control } = form;
  const upload = useUploadStatusState();

  useEffect(() => {
    if (open) {
      form.reset(initialValues ?? EMPTY_MACHINE_DIALOG);
    }
  }, [open, initialValues, form]);

  return (
    <FormDialog
      open={open}
      onOpenChange={onOpenChange}
      title={isEdit ? "Chỉnh sửa máy / dây chuyền" : "Thêm máy / dây chuyền"}
      description="Dịch vụ, công suất và nhóm nông sản của máy"
      submitLabel={isEdit ? "Lưu thay đổi" : "Thêm"}
      loading={isSubmitting || upload.isUploading}
      size="lg"
      onSubmit={form.handleSubmit(onSubmit)}
    >
      <Form {...form}>
        <MachineFormFields control={control} onUploadingChange={upload.track} />
      </Form>
    </FormDialog>
  );
}
