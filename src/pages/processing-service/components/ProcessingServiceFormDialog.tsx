import { zodResolver } from "@hookform/resolvers/zod";
import { Form, FormDialog } from "@Team-Trung-Vu-Khang/eco-shared-ui";
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { TextareaField, TextField } from "@/components/form";
import {
  EMPTY_PROCESSING_SERVICE,
  processingServiceSchema,
  type ProcessingServiceFormValues,
} from "@/features/processing-service";

interface ProcessingServiceFormDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  /** undefined = create */
  initialValues?: ProcessingServiceFormValues;
  isSubmitting?: boolean;
  onSubmit: (values: ProcessingServiceFormValues) => void;
}

export function ProcessingServiceFormDialog({ open, onOpenChange, initialValues, isSubmitting, onSubmit }: ProcessingServiceFormDialogProps) {
  const isEdit = !!initialValues;
  const form = useForm<ProcessingServiceFormValues>({
    resolver: zodResolver(processingServiceSchema),
    defaultValues: EMPTY_PROCESSING_SERVICE,
    mode: "onTouched",
  });
  const { control } = form;

  useEffect(() => {
    if (open) form.reset(initialValues ?? EMPTY_PROCESSING_SERVICE);
  }, [open, initialValues, form]);

  return (
    <FormDialog
      open={open}
      onOpenChange={onOpenChange}
      title={isEdit ? "Chỉnh sửa dịch vụ" : "Thêm dịch vụ chế biến"}
      description="Danh mục dịch vụ chung — nhà máy chọn khi khai báo hồ sơ"
      submitLabel={isEdit ? "Lưu thay đổi" : "Thêm"}
      loading={isSubmitting}
      onSubmit={form.handleSubmit(onSubmit)}
    >
      <Form {...form}>
        <div className="space-y-4">
          <TextField control={control} name="name" label="Tên dịch vụ" required placeholder="VD: Sấy lạnh" />
          <TextareaField control={control} name="description" label="Mô tả" rows={2} />
        </div>
      </Form>
    </FormDialog>
  );
}
