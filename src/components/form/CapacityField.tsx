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
  /** Defaults to machine capacity units */
  unitOptions?: { value: string; label: string }[];
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
  unitOptions = CAPACITY_UNIT_OPTIONS,
  className,
}: CapacityFieldProps<T>) {
  const { field: unit, fieldState: unitState } = useController({ control, name: unitName });

  return (
    <FormField
      control={control}
      name={valueName}
      render={({ field, fieldState }) => (
        <FormItem className={className}>
          <FormLabel required={required}>{label}</FormLabel>
          <div className="flex gap-2">
            <Input
              type="number"
              inputMode="decimal"
              step="any"
              aria-invalid={!!fieldState.error}
              className={`min-w-0 flex-1 ${fieldState.error ? "border-destructive" : ""}`}
              name={field.name}
              ref={field.ref}
              onBlur={field.onBlur}
              value={field.value ?? ""}
              onChange={(e) => field.onChange(e.target.value === "" ? undefined : e.target.valueAsNumber)}
            />
            <Select value={unit.value || undefined} onValueChange={unit.onChange} disabled={unitDisabled}>
              <SelectTrigger
                aria-label="Đơn vị công suất"
                className={`w-28 shrink-0 bg-slate-50 ${unitState.error ? "border-destructive" : ""}`}
              >
                <SelectValue placeholder="Đơn vị" />
              </SelectTrigger>
              <SelectContent>
                {unitOptions.map((o) => (
                  <SelectItem key={o.value} value={o.value}>
                    {o.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          {description && <FormDescription>{description}</FormDescription>}
          <FormMessage />
          {!fieldState.error && unitState.error && <p className="text-sm font-medium text-destructive">{unitState.error.message}</p>}
        </FormItem>
      )}
    />
  );
}
