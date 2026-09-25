import {
  FormSection,
  MultiSelectField,
  NumberField,
  SearchSelectField,
  SelectField,
  TextareaField,
  TextField,
} from "@/components/form";
import { MATERIAL_CONDITION_OPTIONS, QUANTITY_UNIT_OPTIONS } from "@/features/demand";
import { CERTIFICATION_TYPE_OPTIONS, PROCESSING_SERVICE_OPTIONS, PRODUCT_GROUP_OPTIONS } from "@/features/factory";
import { useDemandTypeOptions } from "../../hooks/useDemandTypeOptions";
import { useDemandFormContext } from "./useDemandFormContext";

export function NeedSection() {
  const { control, setValue } = useDemandFormContext();
  const { types, options: typeOptions } = useDemandTypeOptions();

  // Picking a type pre-fills its services; the user can still adjust them
  const handleTypeChange = (id: string) => {
    const type = types.find((t) => t.id === id);
    if (type) setValue("services", type.processingServices, { shouldDirty: true, shouldValidate: true });
  };

  return (
    <div className="space-y-8">
      <FormSection title="Sản phẩm">
        <div className="grid gap-x-4 gap-y-3 sm:grid-cols-2 lg:grid-cols-4">
          <TextField control={control} name="productName" label="Tên sản phẩm cụ thể" required placeholder="VD: Chè Shan tuyết, bưởi, dứa" />
          <SearchSelectField control={control} name="productGroupId" label="Nhóm nông sản" required options={PRODUCT_GROUP_OPTIONS} />
          <NumberField control={control} name="quantity" label="Khối lượng cần chế biến" required step="any" />
          <SelectField control={control} name="quantityUnit" label="Đơn vị" required options={QUANTITY_UNIT_OPTIONS} />
          <SelectField control={control} name="materialCondition" label="Tình trạng nguyên liệu" options={MATERIAL_CONDITION_OPTIONS} />
        </div>
      </FormSection>

      <FormSection title="Loại nhu cầu">
        <div className="grid gap-x-4 gap-y-3 sm:grid-cols-2">
          <SelectField
            control={control}
            name="demandTypeId"
            label="Loại nhu cầu"
            options={typeOptions}
            onValueChange={handleTypeChange}
            description="Tự điền dịch vụ tương ứng"
          />
          <MultiSelectField control={control} name="services" label="Dịch vụ cần thực hiện" required options={PROCESSING_SERVICE_OPTIONS} />
          <MultiSelectField
            control={control}
            name="requiredCertifications"
            label="Yêu cầu chứng nhận của cơ sở"
            options={CERTIFICATION_TYPE_OPTIONS}
            description="Chỉ gợi ý cơ sở có chứng nhận còn hạn"
          />
          <div className="hidden sm:block" />
          <TextareaField control={control} name="technicalRequirements" label="Yêu cầu kỹ thuật đặc biệt" rows={3} />
          <TextareaField control={control} name="packagingRequirements" label="Yêu cầu đóng gói" rows={3} />
        </div>
      </FormSection>
    </div>
  );
}
