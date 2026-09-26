import { zodResolver } from "@hookform/resolvers/zod";
import { Form, FormDialog } from "@Team-Trung-Vu-Khang/eco-shared-ui";
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { MultiSelectField, TextareaField, TextField } from "@/components/form";
import { CROP_REF_OPTIONS } from "@/features/crop";
import { EMPTY_PRODUCT_GROUP, productGroupSchema, type ProductGroupFormValues } from "@/features/product-group";

interface ProductGroupFormDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  /** undefined = create */
  initialValues?: ProductGroupFormValues;
  isSubmitting?: boolean;
  onSubmit: (values: ProductGroupFormValues) => void;
}

export function ProductGroupFormDialog({ open, onOpenChange, initialValues, isSubmitting, onSubmit }: ProductGroupFormDialogProps) {
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
          <TextField control={control} name="name" label="Tên nhóm" required placeholder="VD: Trái cây nhiệt đới" />
          <MultiSelectField
            control={control}
            name="cropRefs"
            label="Cây trồng liên kết"
            required
            options={CROP_REF_OPTIONS}
            description="Chọn cả nhóm cây trồng hoặc từng cây trồng. Dùng để tìm nhà máy theo cây trồng."
          />
          <TextareaField control={control} name="description" label="Mô tả" rows={2} />
        </div>
      </Form>
    </FormDialog>
  );
}
