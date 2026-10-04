import { Button } from "@Team-Trung-Vu-Khang/eco-shared-ui";
import { Plus, Trash2 } from "lucide-react";
import { useEffect, useMemo, useRef } from "react";
import { useFieldArray, useFormContext, useWatch } from "react-hook-form";
import {
  AsyncMultiSelectField,
  AsyncSearchSelectField,
  NumberField,
  SearchSelectField,
  SelectField,
  SwitchField,
  TextareaField,
  TextField,
} from "@/components/form";
import { fetchOrganizationTypeOptions } from "@/features/factory";
import { useProvinceOptions, useWardOptions } from "@/features/geo";
import { fetchProcessingServiceOptions } from "@/features/processing-service";
import { fetchProductGroupOptions } from "@/features/product-group";
import {
  EMPTY_CERTIFICATE,
  GENDER_OPTIONS,
  type RegisterValues,
} from "./register-schema";

function Group({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <fieldset className="space-y-3">
      <legend className="mb-1 text-xs font-semibold uppercase tracking-wide text-slate-500">
        {title}
      </legend>
      {children}
    </fieldset>
  );
}

/** Optional factory profile in the register form — only `name` is required */
export function FactoryProfileFields() {
  const { control, setValue } = useFormContext<RegisterValues>();
  const [province, hasCertificates] = useWatch({
    control,
    name: ["profile.province", "profile.hasCertificates"],
  });

  const { options: provinceOptions, provinces } = useProvinceOptions();
  const provinceCode = useMemo(
    () => provinces.find((p) => p.name === province)?.code,
    [provinces, province],
  );
  const { options: wardOptions } = useWardOptions(provinceCode);

  const prevProvince = useRef(province);
  useEffect(() => {
    if (prevProvince.current !== province) setValue("profile.ward", "");
    prevProvince.current = province;
  }, [province, setValue]);

  const certs = useFieldArray({ control, name: "profile.certificates" });

  return (
    <div className="space-y-6">
      <Group title="Cơ sở">
        <TextField control={control} name="profile.name" label="Tên nhà máy / cơ sở" required placeholder="VD: Cơ sở chế biến An Phát" />
        <div className="grid gap-3 sm:grid-cols-2">
          <AsyncSearchSelectField
            control={control}
            name="profile.organizationTypeId"
            label="Loại hình tổ chức"
            fetchOptions={fetchOrganizationTypeOptions}
            placeholder="Chọn loại hình"
            clearable
          />
          <TextField control={control} name="profile.taxCode" label="Mã số thuế" placeholder="VD: 0101234567" />
          <NumberField control={control} name="profile.foundedYear" label="Năm thành lập" placeholder="VD: 2015" />
        </div>
      </Group>

      <Group title="Người đại diện">
        <p className="-mt-1 text-xs text-slate-500">
          Bỏ trống tên, SĐT, email để dùng thông tin tài khoản ở trên.
        </p>
        <div className="grid gap-3 sm:grid-cols-2">
          <TextField control={control} name="profile.representativeName" label="Họ tên người đại diện" placeholder="Mặc định: họ tên tài khoản" />
          <SelectField
            control={control}
            name="profile.representativeGender"
            label="Giới tính"
            options={GENDER_OPTIONS}
            placeholder="Chọn giới tính"
          />
          <TextField control={control} name="profile.representativePhone" label="SĐT người đại diện" type="tel" placeholder="Mặc định: SĐT tài khoản" />
          <TextField control={control} name="profile.representativeEmail" label="Email người đại diện" type="email" placeholder="Mặc định: email tài khoản" />
        </div>
      </Group>

      <Group title="Địa điểm">
        <div className="grid gap-3 sm:grid-cols-2">
          <SearchSelectField
            control={control}
            name="profile.province"
            label="Tỉnh / Thành phố"
            options={provinceOptions}
            placeholder="Chọn tỉnh / thành"
            clearable
          />
          <SearchSelectField
            control={control}
            name="profile.ward"
            label="Phường / Xã"
            options={wardOptions}
            placeholder={province ? "Chọn phường / xã" : "Chọn tỉnh trước"}
            disabled={!province}
            clearable
          />
        </div>
        <TextField control={control} name="profile.address" label="Địa chỉ chi tiết" placeholder="Số nhà, đường, thôn/ấp..." />
      </Group>

      <Group title="Hoạt động">
        <AsyncMultiSelectField
          control={control}
          name="profile.productGroupIds"
          label="Nhóm nông sản / sản phẩm"
          fetchOptions={fetchProductGroupOptions}
          placeholder="Tìm và chọn nhóm nông sản..."
        />
        <AsyncMultiSelectField
          control={control}
          name="profile.processingServiceIds"
          label="Dịch vụ chế biến"
          fetchOptions={fetchProcessingServiceOptions}
          placeholder="Tìm và chọn dịch vụ..."
        />
        <TextareaField control={control} name="profile.description" label="Mô tả" placeholder="Giới thiệu ngắn về nhà máy, sản phẩm, năng lực chế biến..." />
      </Group>

      <Group title="Chứng nhận">
        <SwitchField
          control={control}
          name="profile.hasCertificates"
          label="Nhà máy có chứng nhận sản xuất"
          description="Có thể bổ sung chi tiết và ảnh chứng nhận sau khi đăng nhập."
          onCheckedChange={(on) => {
            if (on && certs.fields.length === 0) certs.append(EMPTY_CERTIFICATE);
            if (!on) certs.replace([]);
          }}
        />
        {hasCertificates && (
          <div className="space-y-3">
            {certs.fields.map((f, i) => (
              <div key={f.id} className="space-y-3 rounded-lg border border-slate-200 p-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-slate-700">Chứng nhận {i + 1}</span>
                  <Button type="button" variant="ghost" size="sm" onClick={() => certs.remove(i)} aria-label="Xóa chứng nhận">
                    <Trash2 className="h-4 w-4 text-slate-500" />
                  </Button>
                </div>
                <div className="grid gap-3 sm:grid-cols-2">
                  <TextField control={control} name={`profile.certificates.${i}.certificateType`} label="Loại chứng nhận" required placeholder="VD: VietGAP, ISO 22000" />
                  <TextField control={control} name={`profile.certificates.${i}.certificateNumber`} label="Số chứng nhận" placeholder="VD: VG-2024-001" />
                  <TextField control={control} name={`profile.certificates.${i}.issuedDate`} label="Ngày cấp" type="date" />
                  <TextField control={control} name={`profile.certificates.${i}.expiryDate`} label="Ngày hết hạn" type="date" />
                </div>
                <TextField control={control} name={`profile.certificates.${i}.issuer`} label="Đơn vị cấp" placeholder="VD: Trung tâm Chứng nhận Phù hợp QUACERT" />
                <TextareaField control={control} name={`profile.certificates.${i}.scopeDescription`} label="Phạm vi chứng nhận" placeholder="Sản phẩm, quy trình được chứng nhận..." />
              </div>
            ))}
            <Button type="button" variant="outline" size="sm" onClick={() => certs.append(EMPTY_CERTIFICATE)}>
              <Plus className="mr-1 h-4 w-4" /> Thêm chứng nhận
            </Button>
          </div>
        )}
      </Group>
    </div>
  );
}
