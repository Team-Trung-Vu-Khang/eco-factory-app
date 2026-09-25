import { FormSection } from "@/components/form";
import { LocationPickerMap } from "@/components/map/LocationPickerMap";
import {
  GENDER_LABELS,
  PROCESSING_SERVICE_LABELS,
  PRODUCT_GROUP_LABELS,
  getProvinceName,
  getWardName,
  type Factory,
} from "@/features/factory";
import { InfoGrid } from "@/components/common/InfoGrid";

const join = (items: string[]) => items.join(", ");

export function FactoryInfoSections({ factory: f }: { factory: Factory }) {
  const hasGps = f.location.latitude !== undefined && f.location.longitude !== undefined;

  return (
    <>
      <FormSection title="Thông tin cơ bản">
        <InfoGrid
          items={[
            { label: "Mã số thuế", value: f.taxCode },
            { label: "Năm thành lập", value: f.foundedYear },
            { label: "Mô tả", value: f.description, wide: true },
          ]}
        />
      </FormSection>

      <FormSection title="Người đại diện">
        <InfoGrid
          items={[
            { label: "Họ và tên", value: f.representative.fullName },
            { label: "Giới tính", value: GENDER_LABELS[f.representative.gender] },
            { label: "Số điện thoại", value: f.representative.phone },
            { label: "Email", value: f.representative.email },
          ]}
        />
      </FormSection>

      <FormSection title="Địa điểm">
        <InfoGrid
          items={[
            { label: "Tỉnh / Thành phố", value: getProvinceName(f.location.provinceCode) },
            { label: "Xã / Phường", value: getWardName(f.location.provinceCode, f.location.wardCode) },
            { label: "Địa chỉ chi tiết", value: f.location.address, wide: true },
            { label: "Toạ độ", value: hasGps ? `${f.location.latitude}, ${f.location.longitude}` : undefined },
          ]}
        />
        {hasGps && (
          <LocationPickerMap
            value={{ latitude: f.location.latitude!, longitude: f.location.longitude! }}
            className="mt-4 h-64"
          />
        )}
      </FormSection>

      <FormSection title="Thông tin hoạt động">
        <InfoGrid
          items={[
            { label: "Nhóm nông sản", value: join(f.productGroupIds.map((id) => PRODUCT_GROUP_LABELS[id] ?? id)) },
            { label: "Dịch vụ chế biến", value: join(f.services.map((s) => PROCESSING_SERVICE_LABELS[s])) },
          ]}
        />
      </FormSection>
    </>
  );
}
