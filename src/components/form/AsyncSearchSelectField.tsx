import {
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  RemoteAutoCompleteSelect,
} from "@Team-Trung-Vu-Khang/eco-shared-ui";
import { useEffect, useState, type ReactNode } from "react";
import type { Control, FieldPath, FieldValues } from "react-hook-form";

export interface Option {
  value: string;
  label: string;
}

interface AsyncSearchSelectFieldProps<T extends FieldValues> {
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
  /** Function to fetch options based on user keyword (size: 20) */
  fetchOptions: (keyword: string) => Promise<Option[]>;
  /** Optional preloaded initial options or label mapping */
  initialOptions?: Option[];
}

export function AsyncSearchSelectField<T extends FieldValues>({
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
}: AsyncSearchSelectFieldProps<T>) {
  const [options, setOptions] = useState<Option[]>(initialOptions);
  const [loading, setLoading] = useState(false);
  const [searchKeyword, setSearchKeyword] = useState("");

  // Debounced search
  useEffect(() => {
    let active = true;
    const timer = setTimeout(async () => {
      setLoading(true);
      try {
        const results = await fetchOptions(searchKeyword);
        if (active) {
          // Merge with previously selected options so selected item label remains visible
          setOptions((prev) => {
            const mergedMap = new Map<string, Option>();
            // Keep existing options first
            prev.forEach((opt) => mergedMap.set(opt.value, opt));
            // Add or overwrite with fresh search results
            results.forEach((opt) => mergedMap.set(opt.value, opt));
            return Array.from(mergedMap.values());
          });
        }
      } catch (err) {
        console.error("Failed to fetch search options", err);
      } finally {
        if (active) setLoading(false);
      }
    }, 300);

    return () => {
      active = false;
      clearTimeout(timer);
    };
  }, [searchKeyword, fetchOptions]);

  return (
    <FormField
      control={control}
      name={name}
      render={({ field }) => {
        return (
          <FormItem className={className}>
            <FormLabel required={required}>{label}</FormLabel>
            <FormControl>
              <RemoteAutoCompleteSelect
                options={options}
                value={field.value || undefined}
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
