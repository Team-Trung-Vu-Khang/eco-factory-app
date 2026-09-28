import { zodResolver } from "@hookform/resolvers/zod";
import { Form, FormDialog } from "@Team-Trung-Vu-Khang/eco-shared-ui";
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { TagInputField, TextareaField, TextField } from "@/components/form";
import {
  EMPTY_PRODUCT_GROUP,
  productGroupSchema,
  type ProductGroupFormValues,
} from "@/features/product-group";

interface ProductGroupFormDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  /** undefined = create */
  initialValues?: ProductGroupFormValues;
  isSubmitting?: boolean;
  onSubmit: (values: ProductGroupFormValues) => void;
}

export function ProductGroupFormDialog({
  open,
  onOpenChange,
  initialValues,
  isSubmitting,
  onSubmit,
}: ProductGroupFormDialogProps) {
  const isEdit = !!initialValues;
  const form = useForm<ProductGroupFormValues>({
    resolver: zodResolver(productGroupSchema),
    defaultValues: EMPTY_PRODUCT_GROUP,
    mode: "onTouched",
  });
  const { control } = form;

  useEffect(() => {
    if (open) form.reset(initialValues ?? EMPTY_PRODUCT_GROUP);
  }, [open, initialValues, form]);

  return (
    <FormDialog
      open={open}
      onOpenChange={onOpenChange}
      title={isEdit ? "Chỉnh sửa nhóm nông sản" : "Thêm nhóm nông sản"}
      description="Nhóm nông sản / sản phẩm nhà máy đang chế biến"
      submitLabel={isEdit ? "Lưu thay đổi" : "Thêm"}
      loading={isSubmitting}
      size="lg"
      onSubmit={form.handleSubmit(onSubmit)}
    >
      <Form {...form}>
        <div className="space-y-4">
          <TextField
            control={control}
            name="name"
            label="Tên nhóm nông sản / sản phẩm"
            required
            placeholder="VD: Cây chè, Cà phê, Lúa gạo..."
          />
          <TextField
            control={control}
            name="code"
            label="Mã nhóm"
            disabled={isEdit}
            clearable={!isEdit}
            placeholder={
              isEdit ? undefined : "Tự sinh nếu để trống (VD: FPG-001)"
            }
            description={
              isEdit
                ? "Mã nhóm không thể thay đổi sau khi tạo."
                : "Tối đa 80 ký tự. Hệ thống tự sinh nếu để trống."
            }
          />
          <TagInputField
            control={control}
            name="crops"
            label="Cây trồng liên kết"
            placeholder="Nhập tên cây trồng rồi ấn Enter hoặc phẩy (VD: Chè búp tươi, Chè khô)..."
            description="Để trống = áp dụng cho tất cả cây trồng trong nhóm. Dùng để tìm nhà máy theo cây trồng."
          />
          <TextareaField
            control={control}
            name="description"
            label="Mô tả"
            rows={2}
          />
        </div>
      </Form>
    </FormDialog>
  );
}
