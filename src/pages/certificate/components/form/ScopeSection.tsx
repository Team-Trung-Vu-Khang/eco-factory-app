import { FormSection, SearchSelectField, TextareaField } from "@/components/form";
import { useFactoryOptions } from "@/features/factory";
import { useCertificateFormContext } from "./useCertificateFormContext";

export function ScopeSection() {
  const { control } = useCertificateFormContext();
  const { options } = useFactoryOptions();

  return (
    <FormSection title="Phạm vi áp dụng" description="Chứng nhận cấp cho nhà máy / cơ sở chế biến">
      <div className="grid gap-x-4 gap-y-3 lg:grid-cols-2">
        <SearchSelectField control={control} name="factoryId" label="Nhà máy" required options={options} placeholder="Chọn nhà máy..." />
        <TextareaField control={control} name="scopeDescription" label="Mô tả phạm vi" rows={3} placeholder="VD: Sơ chế, sấy và đóng gói chè khô" />
      </div>
    </FormSection>
  );
}
