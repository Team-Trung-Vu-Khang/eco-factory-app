import { FormControl, FormField, FormItem, FormLabel, FormMessage } from "@Team-Trung-Vu-Khang/eco-shared-ui";
import { Loader2 } from "lucide-react";
import { useRef, useState } from "react";
import { useFormContext, useWatch, type FieldPath, type FieldValues, type PathValue } from "react-hook-form";
import { LocationPickerMap, type LatLng } from "@/components/map/LocationPickerMap";
import { goongApi, type ResolvedPlace } from "@/features/geo";
import { AddressAutocomplete } from "./AddressAutocomplete";

interface AddressMapFieldProps<T extends FieldValues> {
  addressName: FieldPath<T>;
  latitudeName: FieldPath<T>;
  longitudeName: FieldPath<T>;
  label?: string;
  required?: boolean;
  placeholder?: string;
  mapClassName?: string;
}

/** Goong address search + coordinates note + Leaflet map (click / drag to pick) */
export function AddressMapField<T extends FieldValues>({
  addressName,
  latitudeName,
  longitudeName,
  label = "Địa chỉ",
  required,
  placeholder = "Nhập địa chỉ để tìm…",
  mapClassName = "h-72",
}: AddressMapFieldProps<T>) {
  const { control, setValue } = useFormContext<T>();
  const [latitude, longitude] = useWatch({ control, name: [latitudeName, longitudeName] }) as [number?, number?];
  const [resolving, setResolving] = useState(false);
  const requestRef = useRef(0);

  const opts = { shouldDirty: true, shouldValidate: true };
  const set = (name: FieldPath<T>, value: unknown) => setValue(name, value as PathValue<T, FieldPath<T>>, opts);

  const applyPlace = (place: ResolvedPlace, overwriteAddress: boolean) => {
    set(latitudeName, place.latitude);
    set(longitudeName, place.longitude);
    if (overwriteAddress && place.address) set(addressName, place.address);
  };

  const handleMapPick = async ({ latitude, longitude }: LatLng) => {
    const requestId = ++requestRef.current;
    set(latitudeName, latitude);
    set(longitudeName, longitude);
    setResolving(true);
    try {
      const place = await goongApi.reverseGeocode(latitude, longitude);
      if (place && requestId === requestRef.current) applyPlace(place, true);
    } catch {
      // keep picked coordinates
    } finally {
      if (requestId === requestRef.current) setResolving(false);
    }
  };

  const hasPosition = Number.isFinite(latitude) && Number.isFinite(longitude);

  return (
    <div className="space-y-3">
      <FormField
        control={control}
        name={addressName}
        render={({ field }) => (
          <FormItem>
            <FormLabel required={required}>{label}</FormLabel>
            <FormControl>
              <AddressAutocomplete
                ref={field.ref}
                value={field.value ?? ""}
                onChange={field.onChange}
                onBlur={field.onBlur}
                onSelectPlace={(place) => applyPlace(place, false)}
                placeholder={placeholder}
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
      <LocationPickerMap
        value={hasPosition ? { latitude: latitude!, longitude: longitude! } : undefined}
        onPick={handleMapPick}
        className={mapClassName}
      />
    </div>
  );
}
