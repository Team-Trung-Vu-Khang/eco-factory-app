import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@Team-Trung-Vu-Khang/eco-shared-ui";
import { Loader2 } from "lucide-react";
import { useRef, useState } from "react";
import { useWatch } from "react-hook-form";
import { AddressAutocomplete, FormSection, SelectField } from "@/components/form";
import { LocationPickerMap, type LatLng } from "@/components/map/LocationPickerMap";
import { PROVINCES } from "@/features/factory";
import { findByName, goongApi, type ResolvedPlace } from "@/features/geo";
import { useFactoryFormContext } from "./useFactoryFormContext";

const PROVINCE_OPTIONS = PROVINCES.map((p) => ({ value: p.code, label: p.name }));

export function LocationSection() {
  const { control, setValue, getValues } = useFactoryFormContext();
  const [provinceCode, latitude, longitude] = useWatch({
    control,
    name: ["location.provinceCode", "location.latitude", "location.longitude"],
  });
  const [resolving, setResolving] = useState(false);
  const pickRequestRef = useRef(0);

  const wardOptions =
    PROVINCES.find((p) => p.code === provinceCode)?.wards.map((w) => ({ value: w.code, label: w.name })) ?? [];

  const opts = { shouldDirty: true, shouldValidate: true };

  const applyPlace = (place: ResolvedPlace, { overwriteAddress }: { overwriteAddress: boolean }) => {
    setValue("location.latitude", place.latitude, opts);
    setValue("location.longitude", place.longitude, opts);
    if (overwriteAddress && place.address) setValue("location.address", place.address, opts);

    // Fill province / ward only when Goong's names match our list
    const province = findByName(PROVINCES, place.compound.province);
    if (!province) return;
    if (province.code !== getValues("location.provinceCode")) {
      setValue("location.provinceCode", province.code, opts);
      setValue("location.wardCode", "", opts);
    }
    // compound.commune may still be the pre-2025 name; the new ward usually
    // appears in the formatted address ("Tràng Tiền, Cửa Nam, Hà Nội")
    const ward =
      findByName(province.wards, place.compound.commune) ??
      place.address.split(",").map((part) => findByName(province.wards, part)).find(Boolean);
    if (ward) setValue("location.wardCode", ward.code, opts);
  };

  const handleMapPick = async ({ latitude, longitude }: LatLng) => {
    const requestId = ++pickRequestRef.current;
    setValue("location.latitude", latitude, opts);
    setValue("location.longitude", longitude, opts);
    setResolving(true);
    try {
      const place = await goongApi.reverseGeocode(latitude, longitude);
      if (place && requestId === pickRequestRef.current) applyPlace(place, { overwriteAddress: true });
    } catch {
      // keep the picked coordinates even if reverse geocoding fails
    } finally {
      if (requestId === pickRequestRef.current) setResolving(false);
    }
  };

  const hasPosition = Number.isFinite(latitude) && Number.isFinite(longitude);

  return (
    <FormSection title="Địa điểm" description="Dùng để tìm kiếm và gợi ý cơ sở gần người có nhu cầu">
      <div className="space-y-4">
        <div className="grid gap-x-4 gap-y-3 sm:grid-cols-2 lg:grid-cols-4">
          <FormField
            control={control}
            name="location.address"
            render={({ field }) => (
              <FormItem className="sm:col-span-2">
                <FormLabel required>Địa chỉ</FormLabel>
                <FormControl>
                  <AddressAutocomplete
                    ref={field.ref}
                    value={field.value ?? ""}
                    onChange={field.onChange}
                    onBlur={field.onBlur}
                    onSelectPlace={(place) => applyPlace(place, { overwriteAddress: false })}
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
          <SelectField
            control={control}
            name="location.provinceCode"
            label="Tỉnh / Thành phố"
            required
            options={PROVINCE_OPTIONS}
            onValueChange={() => setValue("location.wardCode", "")}
          />
          <SelectField
            control={control}
            name="location.wardCode"
            label="Xã / Phường"
            required
            options={wardOptions}
            disabled={!provinceCode}
            placeholder={provinceCode ? "Chọn..." : "Chọn tỉnh trước"}
          />
        </div>

        <div className="space-y-1.5">
          <LocationPickerMap
            value={hasPosition ? { latitude: latitude!, longitude: longitude! } : undefined}
            onPick={handleMapPick}
          />
          <p className="text-xs text-slate-500">Bấm lên bản đồ hoặc kéo ghim để chọn lại vị trí chính xác.</p>
        </div>
      </div>
    </FormSection>
  );
}
