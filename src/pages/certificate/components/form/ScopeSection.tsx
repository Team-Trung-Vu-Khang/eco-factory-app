import { FormSection, MultiSelectField, TextareaField } from "@/components/form";
import { PRODUCT_GROUP_OPTIONS } from "@/features/factory";
import { useCertificateFormContext } from "./useCertificateFormContext";

export function ScopeSection() {
  const { control } = useCertificateFormContext();

  return (
    <FormSection title="Phạm vi áp dụng" description="Sản phẩm / hoạt động được chứng nhận">
      <div className="grid gap-x-4 gap-y-3 lg:grid-cols-2">
        <MultiSelectField control={control} name="productGroupIds" label="Nhóm sản phẩm" required options={PRODUCT_GROUP_OPTIONS} />
        <TextareaField control={control} name="scopeDescription" label="Mô tả phạm vi" rows={3} placeholder="VD: Sơ chế, sấy và đóng gói chè khô" />
      </div>
    </FormSection>
  );
}
