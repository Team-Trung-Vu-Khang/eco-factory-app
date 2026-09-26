import {
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  Input,
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@Team-Trung-Vu-Khang/eco-shared-ui";
import type { ReactNode } from "react";
import { useController, type Control, type FieldPath, type FieldValues } from "react-hook-form";
import { CAPACITY_UNIT_OPTIONS } from "@/features/factory";

interface CapacityFieldProps<T extends FieldValues> {
  control: Control<T>;
  valueName: FieldPath<T>;
  unitName: FieldPath<T>;
  label: ReactNode;
  required?: boolean;
  description?: ReactNode;
  /** Lock the unit, e.g. a schedule must use its machine's unit */
  unitDisabled?: boolean;
  className?: string;
}

/** Capacity number + unit as a single input group */
export function CapacityField<T extends FieldValues>({
  control,
  valueName,
  unitName,
  label,
  required,
  description,
  unitDisabled,
  className,
}: CapacityFieldProps<T>) {
  const { field: unit } = useController({ control, name: unitName });

  return (
    <FormField
      control={control}
      name={valueName}
      render={({ field, fieldState }) => (
        <FormItem className={className}>
          <FormLabel required={required}>{label}</FormLabel>
          <div
            className={`flex rounded-md border bg-background focus-within:ring-2 focus-within:ring-ring focus-within:ring-offset-1 ${
              fieldState.error ? "border-destructive" : "border-input"
            }`}
          >
            <Input
              type="number"
              inputMode="decimal"
              step="any"
              aria-invalid={!!fieldState.error}
              className="min-w-0 flex-1 rounded-r-none border-0 shadow-none focus-visible:ring-0 focus-visible:ring-offset-0"
              name={field.name}
              ref={field.ref}
              onBlur={field.onBlur}
              value={field.value ?? ""}
              onChange={(e) => field.onChange(e.target.value === "" ? undefined : e.target.valueAsNumber)}
            />
            <Select value={unit.value || undefined} onValueChange={unit.onChange} disabled={unitDisabled}>
              <SelectTrigger
                aria-label="Đơn vị công suất"
                className="w-32 shrink-0 rounded-l-none border-0 border-l border-input bg-slate-50 shadow-none focus:ring-0 focus:ring-offset-0"
              >
                <SelectValue placeholder="Đơn vị" />
              </SelectTrigger>
              <SelectContent>
                {CAPACITY_UNIT_OPTIONS.map((o) => (
                  <SelectItem key={o.value} value={o.value}>
                    {o.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          {description && <FormDescription>{description}</FormDescription>}
          <FormMessage />
        </FormItem>
      )}
    />
  );
}
