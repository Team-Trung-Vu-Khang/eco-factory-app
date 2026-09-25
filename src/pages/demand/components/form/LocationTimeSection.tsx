import { useWatch } from "react-hook-form";
import {
  AddressMapField,
  FormSection,
  ImageUploadField,
  SelectField,
  TextareaField,
  TextField,
  useUploadStatus,
} from "@/components/form";
import { SEARCH_SCOPE_OPTIONS } from "@/features/demand";
import { PROVINCES } from "@/features/factory";
import { PROVINCE_OPTIONS } from "./RequesterSection";
import { useDemandFormContext } from "./useDemandFormContext";

export function LocationTimeSection() {
  const { control, setValue } = useDemandFormContext();
  const { track } = useUploadStatus();
  const provinceCode = useWatch({ control, name: "materialLocation.provinceCode" });
  const wardOptions =
    PROVINCES.find((p) => p.code === provinceCode)?.wards.map((w) => ({ value: w.code, label: w.name })) ?? [];

  return (
    <div className="space-y-8">
      <FormSection title="Thời gian">
        <div className="grid gap-x-4 gap-y-3 sm:grid-cols-2 lg:grid-cols-4">
          <TextField control={control} name="neededFrom" label="Cần chế biến từ ngày" required type="date" />
          <TextField control={control} name="neededTo" label="Đến ngày" type="date" />
          <SelectField control={control} name="searchScope" label="Phạm vi tìm cơ sở" required options={SEARCH_SCOPE_OPTIONS} />
        </div>
      </FormSection>

      <FormSection title="Địa điểm nguyên liệu" description="Dùng để tìm cơ sở gần nhất">
        <div className="space-y-4">
          <div className="grid gap-x-4 gap-y-3 sm:grid-cols-2">
            <SelectField
              control={control}
              name="materialLocation.provinceCode"
              label="Tỉnh / Thành phố"
              required
              options={PROVINCE_OPTIONS}
              onValueChange={() => setValue("materialLocation.wardCode", "")}
            />
            <SelectField
              control={control}
              name="materialLocation.wardCode"
              label="Xã / Phường"
              required
              options={wardOptions}
              disabled={!provinceCode}
              placeholder={provinceCode ? "Chọn..." : "Chọn tỉnh trước"}
            />
          </div>
          <AddressMapField
            addressName="materialLocation.address"
            latitudeName="materialLocation.latitude"
            longitudeName="materialLocation.longitude"
            label="Địa chỉ chi tiết"
            required
            mapClassName="h-64"
          />
        </div>
      </FormSection>

      <FormSection title="Bổ sung">
        <div className="space-y-4">
          <ImageUploadField control={control} name="materialPhotos" label="Ảnh nguyên liệu / sản phẩm" maxFiles={8} folder="demands" onUploadingChange={track} />
          <TextareaField control={control} name="note" label="Ghi chú" rows={3} />
        </div>
      </FormSection>
    </div>
  );
}
