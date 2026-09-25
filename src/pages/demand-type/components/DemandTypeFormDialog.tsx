import { zodResolver } from "@hookform/resolvers/zod";
import { Form, FormDialog } from "@Team-Trung-Vu-Khang/eco-shared-ui";
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import {
  MultiSelectField,
  SwitchField,
  TextareaField,
  TextField,
} from "@/components/form";
import {
  EMPTY_DEMAND_TYPE,
  demandTypeSchema,
  type DemandTypeFormValues,
} from "@/features/demand-type";
import { PROCESSING_SERVICE_OPTIONS } from "@/features/factory";

interface DemandTypeFormDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  /** undefined = create */
  initialValues?: DemandTypeFormValues;
  isSubmitting?: boolean;
  onSubmit: (values: DemandTypeFormValues) => void;
}

/** "Sấy lạnh" → "SAY_LANH" */
const toCode = (name: string) =>
  name
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .replace(/đ/gi, "d")
    .toUpperCase()
    .replace(/[^A-Z0-9]+/g, "_")
    .replace(/^_|_$/g, "");

export function DemandTypeFormDialog({ open, onOpenChange, initialValues, isSubmitting, onSubmit }: DemandTypeFormDialogProps) {
  const isEdit = !!initialValues;
  const form = useForm<DemandTypeFormValues>({
    resolver: zodResolver(demandTypeSchema),
    defaultValues: EMPTY_DEMAND_TYPE,
    mode: "onTouched",
  });
  const { control } = form;

  useEffect(() => {
    if (open) form.reset(initialValues ?? EMPTY_DEMAND_TYPE);
  }, [open, initialValues, form]);

  return (
    <FormDialog
      open={open}
      onOpenChange={onOpenChange}
      title={isEdit ? "Chỉnh sửa loại nhu cầu" : "Thêm loại nhu cầu"}
      description="Danh mục dùng khi người dùng tạo nhu cầu chế biến / bảo quản"
      submitLabel={isEdit ? "Lưu thay đổi" : "Thêm"}
      loading={isSubmitting}
      size="lg"
      onSubmit={form.handleSubmit(onSubmit)}
    >
      <Form {...form}>
        <div className="space-y-4">
          <div className="grid gap-x-4 gap-y-3 sm:grid-cols-2">
            <TextField control={control} name="name" label="Tên loại nhu cầu" required placeholder="VD: Sấy lạnh" />
            <TextField
              control={control}
              name="code"
              label="Mã"
              required
              placeholder="VD: SAY_LANH"
              description={!isEdit ? "Tự tạo theo tên, có thể sửa lại" : undefined}
            />
          </div>

          <MultiSelectField control={control} name="processingServices" label="Dịch vụ liên quan" required options={PROCESSING_SERVICE_OPTIONS} description="Dùng để gợi ý nhà máy có dịch vụ phù hợp" />
          <TextareaField control={control} name="description" label="Mô tả" rows={2} />

          {isEdit && (
            <SwitchField control={control} name="isActive" label="Đang hoạt động" description="Tắt để ẩn khỏi danh sách chọn khi tạo nhu cầu mới" />
          )}
        </div>
      </Form>

      <AutoCode form={form} enabled={!isEdit} toCode={toCode} />
    </FormDialog>
  );
}

/** Fills `code` from `name` on create while the user hasn't typed a code */
function AutoCode({
  form,
  enabled,
  toCode,
}: {
  form: ReturnType<typeof useForm<DemandTypeFormValues>>;
  enabled: boolean;
  toCode: (name: string) => string;
}) {
  useEffect(() => {
    if (!enabled) return;
    const sub = form.watch((values, { name }) => {
      if (name === "name" && !form.getFieldState("code").isDirty) {
        form.setValue("code", toCode(values.name ?? ""), { shouldValidate: form.formState.isSubmitted });
      }
    });
    return () => sub.unsubscribe();
  }, [enabled, form, toCode]);
  return null;
}
