import { Button, Form } from "@Team-Trung-Vu-Khang/eco-shared-ui";
import { Handshake, Loader2, Search } from "lucide-react";
import { useEffect, useRef } from "react";
import { useForm, useWatch } from "react-hook-form";
import { CapacityField, FormSection, MultiSelectField, SearchSelectField, SelectField, TextareaField } from "@/components/form";
import { MATERIAL_CONDITION_OPTIONS, type MaterialCondition } from "@/features/demand/constants";
import { SEARCH_QUANTITY_UNIT_OPTIONS, type FactorySearchParams, type SearchQuantityUnit } from "@/features/connection";
import { CROP_OPTIONS } from "@/features/crop";
import { CERTIFICATION_TYPE_OPTIONS, PROVINCES, type CapacityUnit } from "@/features/factory";
import { useProductGroupOptions } from "@/features/product-group";
import { useProcessingServiceOptions } from "@/features/processing-service";

interface FilterValues {
  provinceCode: string;
  wardCode: string;
  functions: string[];
  cropIds: string[];
  productGroupIds: string[];
  quantity?: number;
  quantityUnit: SearchQuantityUnit;
  minCapacity?: number;
  capacityUnit: CapacityUnit;
  requiredCertifications: string[];
  materialCondition: MaterialCondition | "";
  packagingRequirements: string;
  technicalRequirements: string;
}

const EMPTY: FilterValues = {
  provinceCode: "",
  wardCode: "",
  functions: [],
  cropIds: [],
  productGroupIds: [],
  quantity: undefined,
  quantityUnit: "KG",
  minCapacity: undefined,
  capacityUnit: "KG_PER_DAY",
  requiredCertifications: [],
  materialCondition: "",
  packagingRequirements: "",
  technicalRequirements: "",
};
const PROVINCE_OPTIONS = PROVINCES.map((p) => ({ value: p.code, label: p.name }));

interface SearchFiltersProps {
  /** admin: khu vực, dịch vụ, nhóm nông sản, chứng nhận · member: + nguyên liệu, sản lượng, năng suất */
  mode: "admin" | "member";
  searching?: boolean;
  connecting?: boolean;
  /** Only lists matching factories */
  onSearch: (params: FactorySearchParams) => void;
  /** Sends one connection request with these criteria (member only) */
  onConnect?: (params: FactorySearchParams) => void;
}

export function SearchFilters({ mode, searching, connecting, onSearch, onConnect }: SearchFiltersProps) {
  const form = useForm<FilterValues>({ defaultValues: EMPTY });
  const { control, setValue } = form;
  const isAdmin = mode === "admin";
  const serviceOptions = useProcessingServiceOptions();
  const productGroupOptions = useProductGroupOptions();
  const provinceCode = useWatch({ control, name: "provinceCode" });
  // Ward depends on province
  const prevProvince = useRef(provinceCode);
  useEffect(() => {
    if (prevProvince.current !== provinceCode) setValue("wardCode", "");
    prevProvince.current = provinceCode;
  }, [provinceCode, setValue]);

  const wardOptions = (PROVINCES.find((p) => p.code === provinceCode)?.wards ?? []).map((w) => ({ value: w.code, label: w.name }));

  const toParams = (v: FilterValues): FactorySearchParams => ({
      provinceCode: v.provinceCode || undefined,
      wardCode: v.wardCode || undefined,
      functions: v.functions,
      requiredCertifications: v.requiredCertifications,
      ...(isAdmin
        ? { cropIds: [], productGroupIds: v.productGroupIds }
        : {
            cropIds: v.cropIds,
            quantity: v.quantity,
            quantityUnit: v.quantity ? v.quantityUnit : undefined,
            minCapacity: v.minCapacity,
            capacityUnit: v.minCapacity ? v.capacityUnit : undefined,
            materialCondition: v.materialCondition || undefined,
            packagingRequirements: v.packagingRequirements.trim() || undefined,
            technicalRequirements: v.technicalRequirements.trim() || undefined,
          }),
  });

  const submit = form.handleSubmit((v) => onSearch(toParams(v)));
  const connect = form.handleSubmit((v) => {
    if (!v.cropIds.length) {
      form.setError("cropIds", { message: "Chọn nguyên liệu để kết nối nhà máy." });
      return;
    }
    onConnect?.(toParams(v));
  });

  return (
    <Form {...form}>
      <form onSubmit={submit} className="space-y-5 rounded-2xl border border-slate-200 bg-white p-4 sm:p-5">
        <FormSection title="Khu vực" description="Để trống để tìm tất cả tỉnh/thành">
          <div className="grid gap-x-4 gap-y-3 md:grid-cols-2">
            <SearchSelectField control={control} name="provinceCode" label="Tỉnh/Thành phố" options={PROVINCE_OPTIONS} placeholder="Tất cả" />
            <SearchSelectField
              control={control}
              name="wardCode"
              label="Xã/Phường"
              options={wardOptions}
              disabled={!provinceCode}
              placeholder={provinceCode ? "Tất cả" : "Chọn tỉnh trước"}
            />
          </div>
        </FormSection>

        <FormSection title={isAdmin ? "Điều kiện tìm kiếm" : "Nhu cầu chế biến"}>
          <div className="grid gap-x-4 gap-y-3 md:grid-cols-2">
            <MultiSelectField control={control} name="functions" label="Dịch vụ" options={serviceOptions} placeholder="Tất cả dịch vụ" />
            {isAdmin ? (
              <MultiSelectField
                control={control}
                name="productGroupIds"
                label="Nhóm nông sản/sản phẩm"
                options={productGroupOptions}
                placeholder="Tất cả nhóm"
              />
            ) : (
              <>
                <MultiSelectField
                  control={control}
                  name="cropIds"
                  label="Nguyên liệu (cây trồng)"
                  options={CROP_OPTIONS}
                  placeholder="VD: Xoài, Sầu riêng..."
                  description="Hệ thống tìm nhóm nông sản nhà máy đang chế biến tương ứng"
                />
                <CapacityField
                  control={control}
                  valueName="quantity"
                  unitName="quantityUnit"
                  label="Sản lượng"
                  unitOptions={SEARCH_QUANTITY_UNIT_OPTIONS}
                  description="Chỉ hiện máy có công suất đủ xử lý trong thời gian nhận chế biến"
                />
                <CapacityField
                  control={control}
                  valueName="minCapacity"
                  unitName="capacityUnit"
                  label="Năng suất - đơn vị"
                  description="Năng suất tối thiểu của máy / dây chuyền"
                />
              </>
            )}
            <MultiSelectField
              control={control}
              name="requiredCertifications"
              label="Chứng nhận của cơ sở"
              options={CERTIFICATION_TYPE_OPTIONS}
              placeholder="Không yêu cầu"
              description="Nhà máy phải có đủ các chứng nhận còn hiệu lực"
              className="md:col-span-2"
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
                <TextareaField control={control} name="packagingRequirements" label="Yêu cầu đóng gói" rows={2} placeholder="VD: Túi hút chân không 500g" />
                <TextareaField control={control} name="technicalRequirements" label="Yêu cầu kỹ thuật đặc biệt" rows={2} placeholder="VD: Sấy lạnh dưới 40°C" />
              </>
            )}
          </div>
        </FormSection>

        {/* Phones: stacked full-width, primary action on top */}
        <div className="flex flex-col-reverse gap-2 sm:flex-row sm:justify-end [&>button]:w-full sm:[&>button]:w-auto">
          <Button type="button" variant="ghost" onClick={() => form.reset(EMPTY)}>
            Xóa bộ lọc
          </Button>
          <Button type="submit" variant={isAdmin ? "default" : "outline"} disabled={searching}>
            {searching ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Search className="mr-2 h-4 w-4" />}
            Xem nhà máy phù hợp
          </Button>
          {!isAdmin && onConnect && (
            <Button type="button" onClick={connect} disabled={connecting}>
              {connecting ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Handshake className="mr-2 h-4 w-4" />}
              Kết nối nhà máy
            </Button>
          )}
        </div>
      </form>
    </Form>
  );
}
