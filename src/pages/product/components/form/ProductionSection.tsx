import { useWatch } from "react-hook-form";
import {
  FormSection,
  MultiSelectField,
  NumberField,
  SelectField,
  SwitchField,
  TextField,
} from "@/components/form";
import { OUTPUT_UNIT_OPTIONS } from "@/features/product";
import { useCertificateOptions } from "@/features/certificate";
import { useProductFormContext } from "./useProductFormContext";

export function ProductionSection() {
  const { control, setValue } = useProductFormContext();
  const certificateOptions = useCertificateOptions();
  const isNew = useWatch({ control, name: "isNewlyDeveloped" });

  return (
    <div className="space-y-8">
      <FormSection title="Năng lực sản xuất">
        <div className="grid gap-x-4 gap-y-3 sm:grid-cols-2 lg:grid-cols-4">
          <NumberField control={control} name="outputCapacity" label="Sản lượng" step="any" />
          <SelectField control={control} name="outputUnit" label="Đơn vị" options={OUTPUT_UNIT_OPTIONS} />
          <MultiSelectField
            control={control}
            name="certificateIds"
            label="Chứng nhận áp dụng"
            options={certificateOptions}
            placeholder={certificateOptions.length ? "Chọn chứng nhận..." : "Chưa có chứng nhận"}
            className="sm:col-span-2"
          />
        </div>
      </FormSection>

      <FormSection title="Chỉ số dự án">
        <div className="space-y-3">
          <SwitchField
            control={control}
            name="isNewlyDeveloped"
            label="Sản phẩm mới phát triển"
            description="Sản phẩm được phát triển trong dự án — tính vào chỉ số 20 sản phẩm nông nghiệp"
            onCheckedChange={(checked) => !checked && setValue("launchedAt", "", { shouldValidate: true })}
          />
          {isNew && (
            <div className="grid gap-x-4 sm:grid-cols-2 lg:grid-cols-4">
              <TextField control={control} name="launchedAt" label="Ngày ra mắt" type="date" required />
            </div>
          )}
        </div>
      </FormSection>
    </div>
  );
}
