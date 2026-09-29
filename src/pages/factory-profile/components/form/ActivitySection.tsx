import {
  AsyncMultiSelectField,
  FormSection,
  TextareaField,
} from "@/components/form";
import { fetchProcessingServiceOptions } from "@/features/processing-service";
import { fetchProductGroupOptions } from "@/features/product-group";
import { useFactoryFormContext } from "./useFactoryFormContext";

export function ActivitySection() {
  const { control } = useFactoryFormContext();

  return (
    <FormSection title="Thông tin hoạt động">
      <div className="grid gap-x-4 gap-y-3 md:grid-cols-2">
        <AsyncMultiSelectField
          control={control}
          name="productGroupIds"
          label="Nhóm nông sản / sản phẩm đang chế biến"
          required
          fetchOptions={fetchProductGroupOptions}
          placeholder="Tìm kiếm và chọn nhóm nông sản..."
        />
        <AsyncMultiSelectField
          control={control}
          name="processingServiceIds"
          label="Dịch vụ chế biến có thể cung cấp"
          required
          fetchOptions={fetchProcessingServiceOptions}
          placeholder="Tìm kiếm và chọn dịch vụ..."
        />
        <TextareaField
          control={control}
          name="description"
          label="Mô tả ngắn về cơ sở"
          required
          rows={4}
          className="md:col-span-2"
          placeholder="Giới thiệu năng lực chế biến, quy mô, công nghệ..."
        />
      </div>
    </FormSection>
  );
}
