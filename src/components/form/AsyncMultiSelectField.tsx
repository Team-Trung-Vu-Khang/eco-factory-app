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

  // Danh sách hiển thị = đúng kết quả API mới nhất (không trộn kết quả cũ / dữ liệu local).
  // seenLabels chỉ dùng để hiển thị nhãn cho giá trị đã chọn.
  const [seenLabels, setSeenLabels] = useState<Record<string, string>>({});
  const labelOf = useMemo(() => {
    const map: Record<string, string> = {};
    initialOptions.forEach((opt) => (map[opt.value] = opt.label));
    return { ...map, ...seenLabels };
  }, [initialOptions, seenLabels]);

  // Fetch immediately on mount (empty keyword), debounced while typing
  useEffect(() => {
    let active = true;
    const delay = searchKeyword ? 300 : 0;
    const timer = setTimeout(async () => {
      setLoading(true);
      try {
        const results = await fetchOptions(searchKeyword);
        if (active) {
          setSeenLabels((prev) => ({
            ...prev,
            ...Object.fromEntries(results.map((o) => [o.value, o.label])),
          }));
          setOptions(results);
        }
      } catch (err) {
        console.error("Failed to load options", err);
        if (active) setOptions([]);
      } finally {
        if (active) setLoading(false);
      }
    }, delay);

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
        const rawValue = Array.isArray(field.value) ? field.value : [];
        const stringValues = rawValue.map((v) => String(v));

        return (
          <FormItem className={className}>
            <FormLabel required={required}>{label}</FormLabel>
            <FormControl>
              <RemoteMultiSelect
                options={options}
                selectedLabels={Object.fromEntries(
                  stringValues.map((v) => [v, labelOf[v] ?? v]),
                )}
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
