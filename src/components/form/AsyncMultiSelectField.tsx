import {
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@Team-Trung-Vu-Khang/eco-shared-ui";
import { useEffect, useMemo, useState, type ReactNode } from "react";
import type { Control, FieldPath, FieldValues } from "react-hook-form";
import {
  RemoteMultiSelect,
  type RemoteMultiSelectOption,
} from "./RemoteMultiSelect";

export type Option = RemoteMultiSelectOption;

interface AsyncMultiSelectFieldProps<T extends FieldValues> {
  control: Control<T>;
  name: FieldPath<T>;
  label: ReactNode;
  required?: boolean;
  description?: ReactNode;
  disabled?: boolean;
  className?: string;
  placeholder?: string;
  searchPlaceholder?: string;
  emptyText?: string;
  clearable?: boolean;
  /** Function to fetch options (size: 20) */
  fetchOptions: (keyword: string) => Promise<Option[]>;
  /** Optional preloaded initial options or label mapping */
  initialOptions?: Option[];
}

export function AsyncMultiSelectField<T extends FieldValues>({
  control,
  name,
  label,
  required,
  description,
  disabled,
  className,
  placeholder = "Chọn...",
  searchPlaceholder = "Tìm kiếm...",
  emptyText = "Không có kết quả",
  clearable,
  fetchOptions,
  initialOptions = [],
}: AsyncMultiSelectFieldProps<T>) {
  const [options, setOptions] = useState<Option[]>([]);
  const [loading, setLoading] = useState(false);
  const [searchKeyword, setSearchKeyword] = useState("");

  // Search options - immediately on mount (when keyword is empty), debounced when typing
  useEffect(() => {
    let active = true;
    const delay = searchKeyword ? 300 : 0;
    const timer = setTimeout(async () => {
      setLoading(true);
      try {
        const results = await fetchOptions(searchKeyword);
        if (active) {
          setOptions((prev) => {
            const map = new Map<string, Option>();
            // Keep previous options to preserve labels of selected items
            prev.forEach((opt) => map.set(opt.value, opt));
            // Add or overwrite with fresh search results
            results.forEach((opt) => map.set(opt.value, opt));
            return Array.from(map.values());
          });
        }
      } catch (err) {
        console.error("Failed to load options", err);
      } finally {
        if (active) setLoading(false);
      }
    }, delay);

    return () => {
      active = false;
      clearTimeout(timer);
    };
  }, [searchKeyword, fetchOptions]);

  const allOptions = useMemo(() => {
    if (!initialOptions.length) return options;
    const map = new Map<string, Option>();
    initialOptions.forEach((opt) => map.set(opt.value, opt));
    options.forEach((opt) => map.set(opt.value, opt));
    return Array.from(map.values());
  }, [options, initialOptions]);

  return (
    <FormField
      control={control}
      name={name}
      render={({ field }) => {
        const rawValue = Array.isArray(field.value) ? field.value : [];
        const stringValues = rawValue.map((v) => String(v));

        return (
          <FormItem className={className}>
            <FormLabel required={required}>{label}</FormLabel>
            <FormControl>
              <RemoteMultiSelect
                options={allOptions}
                value={stringValues}
                onChange={field.onChange}
                onSearch={(kw) => setSearchKeyword(kw)}
                placeholder={placeholder}
                searchPlaceholder={searchPlaceholder}
                emptyText={emptyText}
                disabled={disabled}
                loading={loading}
                clearable={disabled ? false : (clearable ?? true)}
              />
            </FormControl>
            {description && <FormDescription>{description}</FormDescription>}
            <FormMessage />
          </FormItem>
        );
      }}
    />
  );
}
