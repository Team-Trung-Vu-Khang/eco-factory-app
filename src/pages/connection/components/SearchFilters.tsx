import { Button, Form } from "@Team-Trung-Vu-Khang/eco-shared-ui";
import { Loader2, Search } from "lucide-react";
import { useEffect, useMemo, useRef } from "react";
import { useForm, useWatch } from "react-hook-form";
import {
  AsyncMultiSelectField,
  CapacityField,
  FormSection,
  MultiSelectField,
  SearchSelectField,
  SelectField,
  TextareaField,
} from "@/components/form";
import {
  MATERIAL_CONDITION_OPTIONS,
  type MaterialCondition,
} from "@/features/demand/constants";
import type { FactorySearchParams } from "@/features/connection";
import { CROP_OPTIONS, getCropName } from "@/features/crop";
import { CERTIFICATION_TYPE_NAMED_OPTIONS } from "@/features/factory";
import { useProvinceOptions, useWardOptions } from "@/features/geo";
import { MACHINE_CAPACITY_UNIT_OPTIONS } from "@/features/machine";
import { fetchProductGroupOptions } from "@/features/product-group";
import { fetchProcessingServiceOptions } from "@/features/processing-service";
import { searchSession } from "../search-session";

interface FilterValues {
  province: string;
  ward: string;
  processingServiceIds: string[];
  crops: string[];
  productGroupIds: string[];
  maxCapacity?: number;
  capacityUnit: "KG_PER_MONTH" | "TONNE_PER_MONTH";
  certificateTypes: string[];
  materialCondition: MaterialCondition | "";
  packagingRequirement: string;
  technicalRequirement: string;
  message: string;
}

const EMPTY: FilterValues = {
  province: "",
  ward: "",
  processingServiceIds: [],
  crops: [],
  productGroupIds: [],
  maxCapacity: undefined,
  capacityUnit: "KG_PER_MONTH",
  certificateTypes: [],
  materialCondition: "",
  packagingRequirement: "",
  technicalRequirement: "",
  message: "",
};

interface SearchFiltersProps {
  mode: "admin" | "member";
  searching?: boolean;
  onSearch: (params: FactorySearchParams) => void;
  onReset?: () => void;
}

export function SearchFilters({
  mode,
  searching,
  onSearch,
  onReset,
}: SearchFiltersProps) {
  const storeKey = `${mode}:form`;
  const form = useForm<FilterValues>({
    defaultValues: {
      ...EMPTY,
      ...searchSession.read<Partial<FilterValues>>(storeKey),
    },
  });

  const { control, setValue, watch } = form;

  useEffect(() => {
    const sub = watch((values) => searchSession.write(storeKey, values));
    return () => sub.unsubscribe();
  }, [watch, storeKey]);
  const isAdmin = mode === "admin";
  const provinceName = useWatch({ control, name: "province" });

  const { options: provinceOptions, provinces } = useProvinceOptions();

  const currentProvince = useMemo(
    () =>
      provinces.find(
        (p) =>
          p.name === provinceName ||
          p.fullName === provinceName ||
          p.code === provinceName,
      ),
    [provinces, provinceName],
  );

  const { options: wardOptions } = useWardOptions(currentProvince?.code);

  const prevProvince = useRef(provinceName);
  useEffect(() => {
    if (prevProvince.current !== provinceName) setValue("ward", "");
    prevProvince.current = provinceName;
  }, [provinceName, setValue]);

  const toParams = (v: FilterValues): FactorySearchParams => ({
    province: v.province || undefined,
    ward: v.ward || undefined,
    processingServiceIds: v.processingServiceIds?.length
      ? v.processingServiceIds.map(Number)
      : undefined,
    crops: v.crops?.length
      ? v.crops.map((c) => getCropName(c) || c)
      : undefined,
    maxCapacity: v.maxCapacity,
    capacityUnit: v.maxCapacity ? v.capacityUnit : undefined,
    certificateTypes: v.certificateTypes?.length
      ? v.certificateTypes
      : undefined,
    materialCondition: v.materialCondition || undefined,
    packagingRequirement: v.packagingRequirement?.trim() || undefined,
    technicalRequirement: v.technicalRequirement?.trim() || undefined,
    message: v.message?.trim() || undefined,
  });

  const submit = form.handleSubmit((v) => onSearch(toParams(v)));

  return (
    <Form {...form}>
      <form
        onSubmit={submit}
        className="space-y-5 rounded-2xl border border-slate-200 bg-white p-4 sm:p-5"
      >
        <FormSection
          title="Khu vực"
          description="Để trống để tìm tất cả tỉnh/thành"
        >
          <div className="grid gap-x-4 gap-y-3 md:grid-cols-2">
            <SearchSelectField
              control={control}
              name="province"
              label="Tỉnh/Thành phố"
              options={provinceOptions}
              placeholder="Tất cả"
            />
            <SearchSelectField
              control={control}
              name="ward"
              label="Xã/Phường"
              options={wardOptions}
              disabled={!provinceName}
              placeholder={provinceName ? "Tất cả" : "Chọn tỉnh trước"}
            />
          </div>
        </FormSection>

        <FormSection
          title={isAdmin ? "Điều kiện tìm kiếm" : "Nhu cầu chế biến"}
        >
          <div className="grid gap-x-4 gap-y-3 md:grid-cols-2">
            <AsyncMultiSelectField
              control={control}
              name="processingServiceIds"
              label="Dịch vụ"
              fetchOptions={fetchProcessingServiceOptions}
              placeholder="Tất cả dịch vụ"
            />
            {isAdmin ? (
              <AsyncMultiSelectField
                control={control}
                name="productGroupIds"
                label="Nhóm nông sản/sản phẩm"
                fetchOptions={fetchProductGroupOptions}
                placeholder="Tất cả nhóm"
              />
            ) : (
              <>
                <MultiSelectField
                  control={control}
                  name="crops"
                  label="Nguyên liệu (cây trồng)"
                  options={CROP_OPTIONS}
                  placeholder="VD: Xoài, Sầu riêng..."
                  description="Hệ thống tìm nhóm nông sản nhà máy đang chế biến tương ứng"
                />
                <CapacityField
                  control={control}
                  valueName="maxCapacity"
                  unitName="capacityUnit"
                  label="Sản lượng"
                  unitOptions={MACHINE_CAPACITY_UNIT_OPTIONS}
                  description="Chỉ hiện máy có công suất đủ xử lý trong thời gian nhận chế biến"
                />
              </>
            )}
            <MultiSelectField
              control={control}
              name="certificateTypes"
              label="Chứng nhận của cơ sở"
              options={CERTIFICATION_TYPE_NAMED_OPTIONS}
              placeholder="Không yêu cầu"
              description="Nhà máy phải có đủ các chứng nhận còn hiệu lực"
              className={isAdmin ? "md:col-span-2" : undefined}
            />
            {!isAdmin && (
              <>
                <SelectField
                  control={control}
                  name="materialCondition"
                  label="Tình trạng nguyên liệu"
                  options={MATERIAL_CONDITION_OPTIONS}
                  placeholder="Chọn tình trạng"
                  className="md:col-span-2"
                />
                <TextareaField
                  control={control}
                  name="packagingRequirement"
                  label="Yêu cầu đóng gói"
                  rows={2}
                  placeholder="VD: Túi hút chân không 500g"
                />
                <TextareaField
                  control={control}
                  name="technicalRequirement"
                  label="Yêu cầu kỹ thuật đặc biệt"
                  rows={2}
                  placeholder="VD: Sấy lạnh dưới 40°C"
                />
                <TextareaField
                  control={control}
                  name="message"
                  label="Lời nhắn"
                  rows={2}
                  placeholder="VD: Giao hàng trong ngày..."
                  className="md:col-span-2"
                />
              </>
            )}
          </div>
        </FormSection>

        <div className="flex flex-col-reverse gap-2 sm:flex-row sm:justify-end [&>button]:w-full sm:[&>button]:w-auto">
          <Button
            type="button"
            variant="ghost"
            onClick={() => {
              form.reset(EMPTY);
              onReset?.();
            }}
          >
            Xóa bộ lọc
          </Button>
          <Button type="submit" disabled={searching}>
            {searching ? (
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            ) : (
              <Search className="mr-2 h-4 w-4" />
            )}
            Xem nhà máy phù hợp
          </Button>
        </div>
      </form>
    </Form>
  );
}
