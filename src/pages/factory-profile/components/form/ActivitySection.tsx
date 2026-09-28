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
          name="services"
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
          className="md:col-span-2"
          placeholder="Giới thiệu năng lực chế biến..."
        />
      </div>
    </FormSection>
  );
}
