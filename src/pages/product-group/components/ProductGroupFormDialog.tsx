import { zodResolver } from "@hookform/resolvers/zod";
import { Form, FormDialog } from "@Team-Trung-Vu-Khang/eco-shared-ui";
import { useEffect, useMemo } from "react";
import { useForm } from "react-hook-form";
import { MultiSelectField, SearchSelectField, TextareaField } from "@/components/form";
import { CROP_GROUP_OPTIONS, cropOptionsInGroup } from "@/features/crop";
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
  const cropGroupId = form.watch("cropGroupId");
  const cropOptions = useMemo(() => cropOptionsInGroup(cropGroupId), [cropGroupId]);

  // Drop crops that don't belong to the newly picked group
  useEffect(() => {
    const ids = form.getValues("cropIds");
    const kept = ids.filter((id) => cropOptions.some((o) => o.value === id));
    if (kept.length !== ids.length) form.setValue("cropIds", kept);
  }, [cropOptions, form]);

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
          <SearchSelectField
            control={control}
            name="cropGroupId"
            label="Tên nhóm (nhóm cây trồng)"
            required
            options={CROP_GROUP_OPTIONS}
          />
          <MultiSelectField
            control={control}
            name="cropIds"
            label="Cây trồng liên kết"
            disabled={!cropGroupId}
            options={cropOptions}
            placeholder={cropGroupId ? "Tất cả cây trồng trong nhóm" : "Chọn nhóm cây trồng trước"}
            description="Để trống = áp dụng cho tất cả cây trồng trong nhóm. Dùng để tìm nhà máy theo cây trồng."
          />
          <TextareaField control={control} name="description" label="Mô tả" rows={2} />
        </div>
      </Form>
    </FormDialog>
  );
}
