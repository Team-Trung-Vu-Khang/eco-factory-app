import {
  FormSection,
  MultiSelectField,
  SwitchField,
  TextareaField,
} from "@/components/form";
import { PRODUCT_GROUP_OPTIONS } from "@/features/factory";
import { ManagerField } from "./ManagerField";
import { useWarehouseFormContext } from "./useWarehouseFormContext";

export function OperationSection() {
  const { control } = useWarehouseFormContext();

  return (
    <FormSection title="Vận hành">
      <div className="space-y-4">
        <div className="grid gap-x-4 gap-y-3 sm:grid-cols-2 lg:grid-cols-4">
          <MultiSelectField control={control} name="productGroupIds" label="Nông sản phù hợp" options={PRODUCT_GROUP_OPTIONS} className="sm:col-span-2" />
          <ManagerField />
        </div>
        <SwitchField
          control={control}
          name="acceptsExternalStorage"
          label="Nhận bảo quản cho bên ngoài"
          description="Phần còn trống sẽ được gợi ý cho người có nhu cầu bảo quản"
        />
        <TextareaField control={control} name="note" label="Ghi chú" rows={2} />
      </div>
    </FormSection>
  );
}
