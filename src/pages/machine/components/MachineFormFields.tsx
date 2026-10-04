import type { Control } from "react-hook-form";
import {
  AsyncMultiSelectField,
  CapacityField,
  ImageUploadField,
  SelectField,
  TextField,
} from "@/components/form";
import { fetchProcessingServiceOptions } from "@/features/processing-service";
import { fetchProductGroupOptions } from "@/features/product-group";
import {
  MACHINE_CAPACITY_UNIT_OPTIONS,
  MACHINE_STATUS_OPTIONS,
  type MachineDialogValues,
} from "./machine-form-schema";

/** Machine fields shared by the desktop dialog and the mobile form */
export function MachineFormFields({
  control,
  onUploadingChange,
}: {
  control: Control<MachineDialogValues>;
  onUploadingChange: (uploading: boolean) => void;
}) {
  return (
    <div className="grid gap-x-4 gap-y-3 sm:grid-cols-2">
      <ImageUploadField
        control={control}
        name="imageUrl"
        label="Ảnh máy / dây chuyền"
        maxFiles={1}
        folder="machines"
        onUploadingChange={onUploadingChange}
        className="sm:col-span-2"
        description="Ảnh thực tế của máy, hiển thị trên lịch nhận chế biến."
      />
      <TextField
        control={control}
        name="name"
        label="Tên máy / dây chuyền"
        required
        placeholder="VD: Máy sấy tháp liên hoàn"
      />
      <SelectField
        control={control}
        name="status"
        label="Tình trạng"
        required
        options={MACHINE_STATUS_OPTIONS}
      />
      <AsyncMultiSelectField
        control={control}
        name="processingServiceIds"
        label="Dịch vụ chế biến"
        required
        fetchOptions={fetchProcessingServiceOptions}
        placeholder="Tìm kiếm và chọn dịch vụ..."
        description="Dịch vụ máy thực hiện"
        className="sm:col-span-2"
      />
      <CapacityField
        control={control}
        valueName="maxCapacity"
        unitName="capacityUnit"
        unitOptions={MACHINE_CAPACITY_UNIT_OPTIONS}
        label="Công suất tối đa"
        required
      />
      <AsyncMultiSelectField
        control={control}
        name="productGroupIds"
        label="Nhóm nông sản / sản phẩm"
        required
        fetchOptions={fetchProductGroupOptions}
        placeholder="Tìm kiếm và chọn nhóm nông sản..."
      />
    </div>
  );
}
