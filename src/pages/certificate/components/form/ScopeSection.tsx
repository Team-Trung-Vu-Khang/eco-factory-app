import { FormSection, TextareaField } from "@/components/form";
import { useCertificateFormContext } from "./useCertificateFormContext";

export function ScopeSection() {
  const { control } = useCertificateFormContext();

  return (
    <FormSection
      title="Phạm vi chứng nhận"
      description="Mô tả phạm vi các hoạt động / sản phẩm được chứng nhận"
    >
      <div className="space-y-4">
        <TextareaField
          control={control}
          name="scopeDescription"
          label="Mô tả phạm vi"
          rows={4}
          placeholder="VD: Sơ chế, sấy và đóng gói chè khô theo tiêu chuẩn hữu cơ"
        />
      </div>
    </FormSection>
  );
}
