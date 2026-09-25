import { useWatch } from "react-hook-form";
import { FormSection, NumberField, SelectField } from "@/components/form";
import {
  STORAGE_UNIT_LABELS,
  STORAGE_UNIT_OPTIONS,
  TEMPERATURE_CONTROLLED,
  type StorageUnit,
  type WarehouseType,
} from "@/features/warehouse";
import { useWarehouseFormContext } from "./useWarehouseFormContext";

const fmt = new Intl.NumberFormat("vi-VN");

export function CapacitySection() {
  const { control } = useWarehouseFormContext();
  const [type, capacity, usedCapacity, unit] = useWatch({
    control,
    name: ["type", "capacity", "usedCapacity", "capacityUnit"],
  });
  const tempControlled = TEMPERATURE_CONTROLLED.includes(type as WarehouseType);
  const available = Number.isFinite(capacity) ? Math.max(0, capacity - (usedCapacity || 0)) : undefined;
  const unitLabel = STORAGE_UNIT_LABELS[unit as StorageUnit] ?? "";

  return (
    <div className="space-y-8">
      <FormSection title="Sức chứa">
        <div className="grid gap-x-4 gap-y-3 sm:grid-cols-2 lg:grid-cols-4">
          <NumberField control={control} name="capacity" label="Sức chứa" required step="any" />
          <NumberField control={control} name="usedCapacity" label="Đang sử dụng" required step="any" />
          <SelectField control={control} name="capacityUnit" label="Đơn vị" required options={STORAGE_UNIT_OPTIONS} />
          <div className="space-y-2">
            <p className="text-sm font-medium">Còn trống</p>
            <p className="flex h-10 items-center text-sm font-semibold tabular-nums text-emerald-700">
              {available !== undefined ? `${fmt.format(available)} ${unitLabel}` : "—"}
            </p>
          </div>
        </div>
      </FormSection>

      <FormSection
        title="Điều kiện bảo quản"
        description={tempControlled ? "Bắt buộc khai báo nhiệt độ với kho mát / lạnh / đông lạnh" : undefined}
      >
        <div className="grid gap-x-4 gap-y-3 sm:grid-cols-2 lg:grid-cols-4">
          <NumberField control={control} name="temperatureMin" label="Nhiệt độ min (°C)" required={tempControlled} step="any" />
          <NumberField control={control} name="temperatureMax" label="Nhiệt độ max (°C)" required={tempControlled} step="any" />
          <NumberField control={control} name="humidityMin" label="Độ ẩm min (%)" step="any" />
          <NumberField control={control} name="humidityMax" label="Độ ẩm max (%)" step="any" />
        </div>
      </FormSection>
    </div>
  );
}
