import {
  FormSection,
  MultiSelectField,
  NumberField,
  SelectField,
  TextField,
} from "@/components/form";
import { PROCESSING_SERVICE_OPTIONS } from "@/features/factory";
import { SHELF_LIFE_UNIT_OPTIONS } from "@/features/product";
import { PackagingRows } from "./PackagingRows";
import { useProductFormContext } from "./useProductFormContext";

export function ProcessingSection() {
  const { control } = useProductFormContext();

  return (
    <div className="space-y-8">
      <FormSection title="Nguyên liệu & chế biến">
        <div className="grid gap-x-4 gap-y-3 sm:grid-cols-2">
          <TextField control={control} name="rawMaterials" label="Nguyên liệu chính" required placeholder="VD: Búp chè Shan tuyết tươi" />
          <MultiSelectField control={control} name="processingServices" label="Công đoạn chế biến" required options={PROCESSING_SERVICE_OPTIONS} />
        </div>
      </FormSection>

      <FormSection title="Quy cách đóng gói" description="Mỗi sản phẩm có thể có nhiều quy cách">
        <PackagingRows />
      </FormSection>

      <FormSection title="Bảo quản">
        <div className="grid gap-x-4 gap-y-3 sm:grid-cols-2 lg:grid-cols-4">
          <NumberField control={control} name="shelfLifeValue" label="Hạn sử dụng" step={1} />
          <SelectField control={control} name="shelfLifeUnit" label="Đơn vị" options={SHELF_LIFE_UNIT_OPTIONS} />
          <TextField control={control} name="storageConditions" label="Điều kiện bảo quản" placeholder="VD: Nơi khô ráo, 2–8°C" className="sm:col-span-2" />
        </div>
      </FormSection>
    </div>
  );
}
