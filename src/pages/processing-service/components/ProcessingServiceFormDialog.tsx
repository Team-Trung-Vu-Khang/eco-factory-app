import { zodResolver } from "@hookform/resolvers/zod";
import { Form, FormDialog } from "@Team-Trung-Vu-Khang/eco-shared-ui";
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { SearchSelectField, SelectField, SwitchField, TextareaField } from "@/components/form";
import { PROCESSING_SERVICE_OPTIONS, useFactoryOptions } from "@/features/factory";
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
  /** Pre-selected factory on create */
  defaultFactoryId?: string;
  isSubmitting?: boolean;
  onSubmit: (values: ProcessingServiceFormValues) => void;
}

export function ProcessingServiceFormDialog({ open, onOpenChange, initialValues, defaultFactoryId, isSubmitting, onSubmit }: ProcessingServiceFormDialogProps) {
  const isEdit = !!initialValues;
  const form = useForm<ProcessingServiceFormValues>({
    resolver: zodResolver(processingServiceSchema),
    defaultValues: EMPTY_PROCESSING_SERVICE,
    mode: "onTouched",
  });
  const { control } = form;
  const { options: factoryOptions } = useFactoryOptions();

  useEffect(() => {
    if (open) form.reset(initialValues ?? { ...EMPTY_PROCESSING_SERVICE, factoryId: defaultFactoryId ?? "" });
  }, [open, initialValues, defaultFactoryId, form]);

  return (
    <FormDialog
      open={open}
      onOpenChange={onOpenChange}
      title={isEdit ? "Chỉnh sửa dịch vụ" : "Thêm dịch vụ chế biến"}
      description="Dịch vụ chế biến nhà máy cung cấp cho nông hộ, HTX, doanh nghiệp"
      submitLabel={isEdit ? "Lưu thay đổi" : "Thêm"}
      loading={isSubmitting}
      onSubmit={form.handleSubmit(onSubmit)}
    >
      <Form {...form}>
        <div className="space-y-4">
          <SearchSelectField control={control} name="factoryId" label="Nhà máy" required disabled={isEdit} options={factoryOptions} />
          <SelectField control={control} name="service" label="Dịch vụ" required options={PROCESSING_SERVICE_OPTIONS} />
          <TextareaField control={control} name="description" label="Mô tả" rows={2} placeholder="VD: Sấy lạnh chè, dược liệu; nhận tối thiểu 100 kg" />
          {isEdit && (
            <SwitchField control={control} name="isActive" label="Đang hoạt động" description="Tắt khi nhà máy tạm ngừng cung cấp dịch vụ này" />
          )}
        </div>
      </Form>
    </FormDialog>
  );
}
