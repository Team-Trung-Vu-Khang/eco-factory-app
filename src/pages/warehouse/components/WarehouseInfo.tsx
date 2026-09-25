import { FormSection } from "@/components/form";
import { LocationPickerMap } from "@/components/map/LocationPickerMap";
import { PRODUCT_GROUP_LABELS } from "@/features/factory";
import {
  STORAGE_UNIT_LABELS,
  WAREHOUSE_STATUS_LABELS,
  WAREHOUSE_TYPE_LABELS,
  type StorageUnit,
  type WarehouseFormValues,
  type WarehouseStatus,
  type WarehouseType,
} from "@/features/warehouse";
import { InfoGrid } from "@/components/common/InfoGrid";
import { UtilizationBar } from "./UtilizationBar";

const fmt = new Intl.NumberFormat("vi-VN");
const range = (min?: number, max?: number, unit = "") =>
  min === undefined && max === undefined ? undefined : `${min ?? "…"} → ${max ?? "…"} ${unit}`;

/** Read-only view of a warehouse, used by the review step and the detail page */
export function WarehouseInfo({ values: w }: { values: WarehouseFormValues }) {
  const unit = STORAGE_UNIT_LABELS[w.capacityUnit as StorageUnit] ?? "";
  const capacity = Number.isFinite(w.capacity) ? w.capacity : 0;
  const used = w.usedCapacity || 0;
  const percent = capacity ? Math.round((used / capacity) * 100) : 0;

  return (
    <div className="grid gap-x-10 gap-y-8 lg:grid-cols-2">
      <FormSection title="Thông tin chung">
        <InfoGrid
          items={[
            { label: "Tên kho", value: w.name },
            { label: "Mã kho", value: w.code },
            { label: "Loại kho", value: WAREHOUSE_TYPE_LABELS[w.type as WarehouseType] },
            { label: "Trạng thái", value: WAREHOUSE_STATUS_LABELS[w.status as WarehouseStatus] },
            { label: "Địa chỉ", value: w.address, wide: true },
          ]}
        />
      </FormSection>

      <FormSection title="Sức chứa & điều kiện">
        <InfoGrid
          items={[
            { label: "Đang sử dụng / sức chứa", value: `${fmt.format(used)} / ${fmt.format(capacity)} ${unit}` },
            { label: "Mức sử dụng", value: <UtilizationBar percent={percent} /> },
            { label: "Nhiệt độ", value: range(w.temperatureMin, w.temperatureMax, "°C") },
            { label: "Độ ẩm", value: range(w.humidityMin, w.humidityMax, "%") },
          ]}
        />
      </FormSection>

      {Number.isFinite(w.latitude) && Number.isFinite(w.longitude) && (
        <FormSection title="Bản đồ">
          <LocationPickerMap value={{ latitude: w.latitude!, longitude: w.longitude! }} className="h-56" />
        </FormSection>
      )}

      <FormSection title="Vận hành">
        <InfoGrid
          items={[
            { label: "Nông sản phù hợp", value: w.productGroupIds.map((id) => PRODUCT_GROUP_LABELS[id] ?? id).join(", "), wide: true },
            { label: "Người phụ trách", value: [w.managerName, w.managerPhone].filter(Boolean).join(" · ") },
            { label: "Nhận bảo quản bên ngoài", value: w.acceptsExternalStorage ? "Có" : "Không" },
            { label: "Ghi chú", value: w.note, wide: true },
          ]}
        />
      </FormSection>
    </div>
  );
}
