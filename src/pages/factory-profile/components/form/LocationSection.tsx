import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@Team-Trung-Vu-Khang/eco-shared-ui";
import { Loader2 } from "lucide-react";
import { useEffect, useMemo, useRef, useState } from "react";
import { useWatch } from "react-hook-form";
import {
  AddressAutocomplete,
  FormSection,
  SearchSelectField,
} from "@/components/form";
import {
  LocationPickerMap,
  type LatLng,
} from "@/components/map/LocationPickerMap";
import {
  findByName,
  geoApi,
  goongApi,
  useProvinceOptions,
  useWardOptions,
  type ResolvedPlace,
} from "@/features/geo";
import { useFactoryFormContext } from "./useFactoryFormContext";

const FORM_OPTS = { shouldDirty: true, shouldValidate: true } as const;

export function LocationSection() {
  const { control, setValue, getValues } = useFactoryFormContext();
  const [province, latitude, longitude] = useWatch({
    control,
    name: ["province", "latitude", "longitude"],
  });
  const [resolving, setResolving] = useState(false);
  const pickRequestRef = useRef(0);
  const prevProvinceRef = useRef(province);

  const { options: provinceOptions, provinces } = useProvinceOptions();

  const currentProvince = useMemo(
    () =>
      provinces.find(
        (p) =>
          p.name === province || p.fullName === province || p.code === province,
      ),
    [provinces, province],
  );

  const { options: wardOptions } = useWardOptions(currentProvince?.code);

  // Reset ward when province changes manually
  useEffect(() => {
    if (prevProvinceRef.current && prevProvinceRef.current !== province) {
      setValue("ward", "", FORM_OPTS);
    }
    prevProvinceRef.current = province;
  }, [province, setValue]);

  const applyPlace = async (
    place: ResolvedPlace,
    { overwriteAddress }: { overwriteAddress: boolean },
  ) => {
    setValue("latitude", place.latitude, FORM_OPTS);
    setValue("longitude", place.longitude, FORM_OPTS);
    if (overwriteAddress && place.address)
      setValue("address", place.address, FORM_OPTS);

    // Match Goong province name with API master data provinces
    const foundProvince = findByName(provinces, place.compound.province);
    if (!foundProvince) return;

    if (foundProvince.name !== getValues("province")) {
      setValue("province", foundProvince.name, FORM_OPTS);
      setValue("ward", "", FORM_OPTS);
    }

    // Fetch wards for the found province to auto-select ward
    try {
      const wardsResp = await geoApi.getWards({
        provinceCode: foundProvince.code,
      });
      const wardList = wardsResp.content ?? [];
      const foundWard =
        findByName(wardList, place.compound.commune) ??
        place.address
          .split(",")
          .map((part) => findByName(wardList, part.trim()))
          .find(Boolean);
      if (foundWard) setValue("ward", foundWard.name, FORM_OPTS);
    } catch {
      // Keep silent on ward auto-selection error
    }
  };

  const handleMapPick = async ({ latitude: lat, longitude: lng }: LatLng) => {
    const requestId = ++pickRequestRef.current;
    setValue("latitude", lat, FORM_OPTS);
    setValue("longitude", lng, FORM_OPTS);
    setResolving(true);
    try {
      const place = await goongApi.reverseGeocode(lat, lng);
      if (place && requestId === pickRequestRef.current)
        await applyPlace(place, { overwriteAddress: true });
    } catch {
      // keep the picked coordinates even if reverse geocoding fails
    } finally {
      if (requestId === pickRequestRef.current) setResolving(false);
    }
  };

  const hasPosition = Number.isFinite(latitude) && Number.isFinite(longitude);

  return (
    <FormSection
      title="Địa điểm"
      description="Dùng để tìm kiếm và gợi ý cơ sở gần người có nhu cầu"
    >
      <div className="space-y-4">
        <div className="grid gap-x-4 gap-y-3 sm:grid-cols-2 lg:grid-cols-4">
          <FormField
            control={control}
            name="address"
            render={({ field }) => (
              <FormItem className="sm:col-span-2">
                <FormLabel required>Địa chỉ</FormLabel>
                <FormControl>
                  <AddressAutocomplete
                    ref={field.ref}
                    value={field.value ?? ""}
                    onChange={field.onChange}
                    onBlur={field.onBlur}
                    onSelectPlace={(place) =>
                      applyPlace(place, { overwriteAddress: false })
                    }
                    placeholder="Nhập số nhà, đường, thôn/xóm… để tìm"
                  />
                </FormControl>
                <p className="flex items-center gap-1 text-xs text-slate-500">
                  {resolving && <Loader2 className="h-3 w-3 animate-spin" />}
                  {hasPosition
                    ? `Toạ độ: ${latitude!.toFixed(6)}, ${longitude!.toFixed(6)}`
                    : "Chưa có toạ độ — chọn gợi ý địa chỉ hoặc bấm trên bản đồ."}
                </p>
                <FormMessage />
              </FormItem>
            )}
          />
          <SearchSelectField
            control={control}
            name="province"
            label="Tỉnh / Thành phố"
            required
            options={provinceOptions}
            placeholder="Tìm & chọn tỉnh/thành..."
          />
          <SearchSelectField
            control={control}
            name="ward"
            label="Xã / Phường"
            required
            options={wardOptions}
            disabled={!province}
            placeholder={
              province ? "Tìm & chọn xã/phường..." : "Chọn tỉnh trước"
            }
          />
        </div>

        <div className="space-y-1.5">
          <LocationPickerMap
            value={
              hasPosition
                ? { latitude: latitude!, longitude: longitude! }
                : undefined
            }
            onPick={handleMapPick}
          />
          <p className="text-xs text-slate-500">
            Bấm lên bản đồ hoặc kéo ghim để chọn lại vị trí chính xác.
          </p>
        </div>
      </div>
    </FormSection>
  );
}
