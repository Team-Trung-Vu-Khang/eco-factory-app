import { FormSection, MultiSelectField, TextareaField } from "@/components/form";
import { PROCESSING_SERVICE_OPTIONS, PRODUCT_GROUP_OPTIONS } from "@/features/factory";
import { useFactoryFormContext } from "./useFactoryFormContext";

export function ActivitySection() {
  const { control } = useFactoryFormContext();

  return (
    <FormSection title="Thông tin hoạt động">
      <div className="grid gap-x-4 gap-y-3 md:grid-cols-2">
        <MultiSelectField control={control} name="productGroupIds" label="Nhóm nông sản / sản phẩm đang chế biến" required options={PRODUCT_GROUP_OPTIONS} />
        <MultiSelectField control={control} name="services" label="Dịch vụ chế biến có thể cung cấp" required options={PROCESSING_SERVICE_OPTIONS} />
        <TextareaField control={control} name="description" label="Mô tả ngắn về cơ sở" required className="md:col-span-2" placeholder="Giới thiệu năng lực chế biến..." />
      </div>
    </FormSection>
  );
}
