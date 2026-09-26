import { Button, Form } from "@Team-Trung-Vu-Khang/eco-shared-ui";
import { Crosshair, Loader2, Search, X } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { useForm, useWatch } from "react-hook-form";
import { CapacityField, FormSection, MultiSelectField, SearchSelectField, SelectField, TextareaField } from "@/components/form";
import { LocationPickerMap } from "@/components/map/LocationPickerMap";
import { RADIUS_OPTIONS, SEARCH_QUANTITY_UNIT_OPTIONS, type FactorySearchParams, type SearchQuantityUnit } from "@/features/connection";
import { CROP_OPTIONS } from "@/features/crop";
import { MATERIAL_CONDITION_OPTIONS, type MaterialCondition } from "@/features/demand/constants";
import { CERTIFICATION_TYPE_OPTIONS, PROVINCES } from "@/features/factory";
import { useProcessingServiceOptions } from "@/features/processing-service";

interface FilterValues {
  latitude?: number;
  longitude?: number;
  radiusKm: string;
  provinceCode: string;
  wardCode: string;
  functions: string[];
  cropIds: string[];
  materialCondition: MaterialCondition | "";
  quantity?: number;
  quantityUnit: SearchQuantityUnit;
  packagingRequirements: string;
  technicalRequirements: string;
  requiredCertifications: string[];
}

const EMPTY: FilterValues = {
  radiusKm: "50",
  provinceCode: "",
  wardCode: "",
  functions: [],
  cropIds: [],
  materialCondition: "",
  quantity: undefined,
  quantityUnit: "KG",
  packagingRequirements: "",
  technicalRequirements: "",
  requiredCertifications: [],
};
const PROVINCE_OPTIONS = PROVINCES.map((p) => ({ value: p.code, label: p.name }));

export function SearchFilters({ loading, onSearch }: { loading?: boolean; onSearch: (params: FactorySearchParams) => void }) {
  const form = useForm<FilterValues>({ defaultValues: EMPTY });
  const { control, setValue } = form;
  const serviceOptions = useProcessingServiceOptions();
  const [latitude, longitude, provinceCode] = useWatch({ control, name: ["latitude", "longitude", "provinceCode"] });
  const [locating, setLocating] = useState(false);
  const hasPoint = latitude !== undefined && longitude !== undefined;
  // Ward depends on province
  const prevProvince = useRef(provinceCode);
  useEffect(() => {
    if (prevProvince.current !== provinceCode) setValue("wardCode", "");
    prevProvince.current = provinceCode;
  }, [provinceCode, setValue]);

  const wardOptions = (PROVINCES.find((p) => p.code === provinceCode)?.wards ?? []).map((w) => ({ value: w.code, label: w.name }));

  const pick = (p: { latitude: number; longitude: number }) => {
    setValue("latitude", p.latitude);
    setValue("longitude", p.longitude);
  };

  const useMyLocation = () => {
    if (!navigator.geolocation) return;
    setLocating(true);
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        pick({ latitude: pos.coords.latitude, longitude: pos.coords.longitude });
        setLocating(false);
      },
      () => setLocating(false),
      { timeout: 10000 },
    );
  };

  const submit = form.handleSubmit((v) =>
    onSearch({
      latitude: v.latitude,
      longitude: v.longitude,
      // Radius only applies once a point is chosen
      radiusKm: hasPoint && v.radiusKm ? Number(v.radiusKm) : undefined,
      provinceCode: v.provinceCode || undefined,
      wardCode: v.wardCode || undefined,
      functions: v.functions,
      cropIds: v.cropIds,
      quantity: v.quantity,
      quantityUnit: v.quantity ? v.quantityUnit : undefined,
      requiredCertifications: v.requiredCertifications,
      materialCondition: v.materialCondition || undefined,
      packagingRequirements: v.packagingRequirements.trim() || undefined,
      technicalRequirements: v.technicalRequirements.trim() || undefined,
    }),
  );

  return (
    <Form {...form}>
      <form onSubmit={submit} className="space-y-5 rounded-2xl border border-slate-200 bg-white p-4 sm:p-5">
        <FormSection
          title="Địa chỉ"
          description="Chọn vị trí trên bản đồ, khoảng cách tính tới địa chỉ nhà máy"
          actions={
            <div className="flex gap-1">
              {hasPoint && (
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={() => {
                    setValue("latitude", undefined);
                    setValue("longitude", undefined);
                  }}
                >
                  <X className="mr-1 h-4 w-4" />
                  Bỏ vị trí
                </Button>
              )}
              <Button type="button" variant="outline" size="sm" onClick={useMyLocation} disabled={locating}>
                {locating ? <Loader2 className="mr-1 h-4 w-4 animate-spin" /> : <Crosshair className="mr-1 h-4 w-4" />}
                Vị trí của tôi
              </Button>
            </div>
          }
        >
          <div className="grid gap-4 lg:grid-cols-[1fr_280px]">
            <LocationPickerMap value={hasPoint ? { latitude, longitude } : undefined} onPick={pick} className="h-56 sm:h-64" />
            <div className="space-y-3">
              <SelectField control={control} name="radiusKm" label="Phạm vi khoảng cách" options={RADIUS_OPTIONS} disabled={!hasPoint} />
              <SearchSelectField
                control={control}
                name="provinceCode"
                label="Tỉnh/Thành phố"
                options={PROVINCE_OPTIONS}
                placeholder="Tất cả"
              />
              <SearchSelectField
                control={control}
                name="wardCode"
                label="Xã/Phường"
                options={wardOptions}
                disabled={!provinceCode}
                placeholder={provinceCode ? "Tất cả" : "Chọn tỉnh trước"}
              />
            </div>
          </div>
        </FormSection>

        <FormSection title="Nhu cầu chế biến">
          <div className="grid gap-x-4 gap-y-3 md:grid-cols-2">
            <MultiSelectField control={control} name="functions" label="Dịch vụ" options={serviceOptions} placeholder="Tất cả dịch vụ" />
            <MultiSelectField
              control={control}
              name="cropIds"
              label="Nguyên liệu"
              options={CROP_OPTIONS}
              placeholder="VD: Xoài, Sầu riêng..."
              description="Hệ thống tìm nhóm nông sản nhà máy đang chế biến tương ứng"
            />
            <SelectField control={control} name="materialCondition" label="Tình trạng nguyên liệu" options={MATERIAL_CONDITION_OPTIONS} placeholder="Chọn tình trạng" />
            <CapacityField
              control={control}
              valueName="quantity"
              unitName="quantityUnit"
              label="Sản lượng"
              unitOptions={SEARCH_QUANTITY_UNIT_OPTIONS}
              description="Chỉ hiện máy có công suất đủ xử lý trong thời gian nhận chế biến"
            />
            <MultiSelectField
              control={control}
              name="requiredCertifications"
              label="Yêu cầu chứng nhận của cơ sở"
              options={CERTIFICATION_TYPE_OPTIONS}
              placeholder="Không yêu cầu"
              description="Nhà máy phải có đủ các chứng nhận còn hiệu lực"
              className="md:col-span-2"
            />
            <TextareaField control={control} name="packagingRequirements" label="Yêu cầu đóng gói" rows={2} placeholder="VD: Túi hút chân không 500g" />
            <TextareaField control={control} name="technicalRequirements" label="Yêu cầu kỹ thuật đặc biệt" rows={2} placeholder="VD: Sấy lạnh dưới 40°C" />
          </div>
        </FormSection>

        <div className="flex justify-end gap-2">
          <Button type="button" variant="ghost" onClick={() => form.reset(EMPTY)}>
            Xóa bộ lọc
          </Button>
          <Button type="submit" disabled={loading}>
            {loading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Search className="mr-2 h-4 w-4" />}
            Tìm kiếm
          </Button>
        </div>
      </form>
    </Form>
  );
}
