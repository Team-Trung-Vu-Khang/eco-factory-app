import { AddressMapField, FormSection, SelectField, TextField } from "@/components/form";
import { WAREHOUSE_STATUS_OPTIONS, WAREHOUSE_TYPE_OPTIONS, type WarehouseFormValues } from "@/features/warehouse";
import { useWarehouseFormContext } from "./useWarehouseFormContext";

/** `showStatus` is false on create — new warehouses are saved as ACTIVE */
export function GeneralSection({ showStatus }: { showStatus: boolean }) {
  const { control } = useWarehouseFormContext();

  return (
    <div className="space-y-8">
      <FormSection title="Thông tin chung">
        <div className="grid gap-x-4 gap-y-3 sm:grid-cols-2 lg:grid-cols-4">
          <TextField control={control} name="name" label="Tên kho" required className="sm:col-span-2" />
          <TextField control={control} name="code" label="Mã kho" placeholder="VD: KL-01" />
          <SelectField control={control} name="type" label="Loại kho" required options={WAREHOUSE_TYPE_OPTIONS} />
          {showStatus && (
            <SelectField control={control} name="status" label="Trạng thái" required options={WAREHOUSE_STATUS_OPTIONS} />
          )}
        </div>
      </FormSection>

      <FormSection title="Vị trí kho" description="Tìm địa chỉ hoặc bấm trên bản đồ để chọn vị trí chính xác">
        <AddressMapField<WarehouseFormValues>
          addressName="address"
          latitudeName="latitude"
          longitudeName="longitude"
          required
        />
      </FormSection>
    </div>
  );
}
