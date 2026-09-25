import { FormSection, SelectField, SwitchField, TextField } from "@/components/form";
import { DEMAND_STATUS_OPTIONS } from "@/features/demand";
import { GENDER_OPTIONS, PROVINCES } from "@/features/factory";
import { useDemandFormContext } from "./useDemandFormContext";

export const PROVINCE_OPTIONS = PROVINCES.map((p) => ({ value: p.code, label: p.name }));

/** `showStatus` is false on create — new demands are saved as DRAFT */
export function RequesterSection({ showStatus }: { showStatus: boolean }) {
  const { control } = useDemandFormContext();

  return (
    <div className="space-y-8">
      <FormSection title="Người có nhu cầu" description="Dùng cho thống kê chỉ số tiếp cận của dự án">
        <div className="grid gap-x-4 gap-y-3 sm:grid-cols-2 lg:grid-cols-4">
          <TextField control={control} name="requester.fullName" label="Họ và tên" required />
          <SelectField control={control} name="requester.gender" label="Giới tính" required options={GENDER_OPTIONS} />
          <TextField control={control} name="requester.organizationName" label="Tên đơn vị / nông hộ / HTX" required className="sm:col-span-2" />
          <TextField control={control} name="requester.phone" label="Số điện thoại" required type="tel" placeholder="VD: 0912345678" />
          <SelectField control={control} name="requester.provinceCode" label="Tỉnh / Thành phố" required options={PROVINCE_OPTIONS} />
          {showStatus && (
            <SelectField control={control} name="status" label="Trạng thái" required options={DEMAND_STATUS_OPTIONS} />
          )}
        </div>
      </FormSection>

      <FormSection title="Xác nhận">
        <SwitchField
          control={control}
          name="hasDemand"
          label="Hiện có nhu cầu tìm cơ sở bảo quản / chế biến"
          description="Tính vào điều kiện “Đã xác nhận có nhu cầu”"
        />
      </FormSection>
    </div>
  );
}
