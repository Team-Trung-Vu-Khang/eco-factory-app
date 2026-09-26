import {
  AutoCompleteSelect,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  Input,
  MultiSelect,
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
  Switch,
  Textarea,
} from "@Team-Trung-Vu-Khang/eco-shared-ui";
import type { ReactNode } from "react";
import type { Control, FieldPath, FieldValues } from "react-hook-form";
import { ImageDropzone } from "./ImageDropzone";

export interface Option {
  value: string;
  label: string;
}

interface BaseFieldProps<T extends FieldValues> {
  control: Control<T>;
  name: FieldPath<T>;
  label: ReactNode;
  required?: boolean;
  description?: ReactNode;
  disabled?: boolean;
  className?: string;
}

export function TextField<T extends FieldValues>({
  control,
  name,
  label,
  required,
  description,
  disabled,
  className,
  type = "text",
  placeholder,
}: BaseFieldProps<T> & { type?: "text" | "email" | "tel" | "date" | "url" | "password"; placeholder?: string }) {
  return (
    <FormField
      control={control}
      name={name}
      render={({ field }) => (
        <FormItem className={className}>
          <FormLabel required={required}>{label}</FormLabel>
          <FormControl>
            <Input {...field} value={field.value ?? ""} type={type} placeholder={placeholder} disabled={disabled} />
          </FormControl>
          {description && <FormDescription>{description}</FormDescription>}
          <FormMessage />
        </FormItem>
      )}
    />
  );
}

export function NumberField<T extends FieldValues>({
  control,
  name,
  label,
  required,
  description,
  disabled,
  className,
  placeholder,
  step,
}: BaseFieldProps<T> & { placeholder?: string; step?: number | "any" }) {
  return (
    <FormField
      control={control}
      name={name}
      render={({ field }) => (
        <FormItem className={className}>
          <FormLabel required={required}>{label}</FormLabel>
          <FormControl>
            <Input
              type="number"
              inputMode="decimal"
              step={step}
              placeholder={placeholder}
              disabled={disabled}
              name={field.name}
              ref={field.ref}
              onBlur={field.onBlur}
              value={field.value ?? ""}
              onChange={(e) =>
                field.onChange(e.target.value === "" ? undefined : e.target.valueAsNumber)
              }
            />
          </FormControl>
          {description && <FormDescription>{description}</FormDescription>}
          <FormMessage />
        </FormItem>
      )}
    />
  );
}

export function TextareaField<T extends FieldValues>({
  control,
  name,
  label,
  required,
  description,
  disabled,
  className,
  placeholder,
  rows = 3,
}: BaseFieldProps<T> & { placeholder?: string; rows?: number }) {
  return (
    <FormField
      control={control}
      name={name}
      render={({ field }) => (
        <FormItem className={className}>
          <FormLabel required={required}>{label}</FormLabel>
          <FormControl>
            <Textarea {...field} value={field.value ?? ""} rows={rows} placeholder={placeholder} disabled={disabled} />
          </FormControl>
          {description && <FormDescription>{description}</FormDescription>}
          <FormMessage />
        </FormItem>
      )}
    />
  );
}

export function SelectField<T extends FieldValues>({
  control,
  name,
  label,
  required,
  description,
  disabled,
  className,
  options,
  placeholder = "Chọn...",
  onValueChange,
}: BaseFieldProps<T> & {
  options: Option[];
  placeholder?: string;
  onValueChange?: (value: string) => void;
}) {
  return (
    <FormField
      control={control}
      name={name}
      render={({ field }) => (
        <FormItem className={className}>
          <FormLabel required={required}>{label}</FormLabel>
          <Select
            value={field.value || undefined}
            onValueChange={(v) => {
              field.onChange(v);
              onValueChange?.(v);
            }}
            disabled={disabled}
          >
            <FormControl>
              <SelectTrigger>
                <SelectValue placeholder={placeholder} />
              </SelectTrigger>
            </FormControl>
            <SelectContent>
              {options.map((o) => (
                <SelectItem key={o.value} value={o.value}>
                  {o.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          {description && <FormDescription>{description}</FormDescription>}
          <FormMessage />
        </FormItem>
      )}
    />
  );
}

export function MultiSelectField<T extends FieldValues>({
  control,
  name,
  label,
  required,
  description,
  disabled,
  className,
  options,
  placeholder = "Chọn...",
}: BaseFieldProps<T> & { options: Option[]; placeholder?: string }) {
  return (
    <FormField
      control={control}
      name={name}
      render={({ field }) => (
        <FormItem className={className}>
          <FormLabel required={required}>{label}</FormLabel>
          <FormControl>
            <MultiSelect
              options={options}
              value={field.value ?? []}
              onChange={field.onChange}
              placeholder={placeholder}
              searchPlaceholder="Tìm kiếm..."
              emptyText="Không có kết quả"
              disabled={disabled}
              clearable
            />
          </FormControl>
          {description && <FormDescription>{description}</FormDescription>}
          <FormMessage />
        </FormItem>
      )}
    />
  );
}

export function SwitchField<T extends FieldValues>({
  control,
  name,
  label,
  description,
  disabled,
  className,
  onCheckedChange,
}: BaseFieldProps<T> & { onCheckedChange?: (checked: boolean) => void }) {
  return (
    <FormField
      control={control}
      name={name}
      render={({ field }) => (
        <FormItem
          className={`flex items-center justify-between gap-4 rounded-lg border border-slate-200 p-4 ${className ?? ""}`}
        >
          <div className="space-y-1">
            <FormLabel>{label}</FormLabel>
            {description && <FormDescription>{description}</FormDescription>}
          </div>
          <FormControl>
            <Switch
              checked={!!field.value}
              onCheckedChange={(checked) => {
                field.onChange(checked);
                onCheckedChange?.(checked);
              }}
              disabled={disabled}
            />
          </FormControl>
        </FormItem>
      )}
    />
  );
}

export function ImageUploadField<T extends FieldValues>({
  control,
  name,
  label,
  required,
  description,
  disabled,
  className,
  maxFiles = 10,
  folder,
  onUploadingChange,
  variant = "default",
  allowPdf,
}: BaseFieldProps<T> & {
  /** 1 = field value is a single URL string, otherwise string[] */
  maxFiles?: number;
  folder?: string;
  onUploadingChange?: (uploading: boolean) => void;
  variant?: "default" | "avatar";
  allowPdf?: boolean;
}) {
  const single = maxFiles === 1 || variant === "avatar";
  return (
    <FormField
      control={control}
      name={name}
      render={({ field }) => {
        const urls: string[] = single ? (field.value ? [field.value] : []) : (field.value ?? []);
        return (
          <FormItem className={className}>
            <FormLabel required={required}>{label}</FormLabel>
            <FormControl>
              <ImageDropzone
                value={urls}
                onChange={(next) => field.onChange(single ? (next[0] ?? "") : next)}
                maxFiles={single ? 1 : maxFiles}
                variant={variant}
                allowPdf={allowPdf}
                folder={folder}
                disabled={disabled}
                onUploadingChange={onUploadingChange}
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

export function SearchSelectField<T extends FieldValues>({
  control,
  name,
  label,
  required,
  description,
  disabled,
  className,
  options,
  placeholder = "Chọn...",
}: BaseFieldProps<T> & { options: Option[]; placeholder?: string }) {
  return (
    <FormField
      control={control}
      name={name}
      render={({ field }) => (
        <FormItem className={className}>
          <FormLabel required={required}>{label}</FormLabel>
          <FormControl>
            <AutoCompleteSelect
              options={options}
              value={field.value || undefined}
              onChange={field.onChange}
              placeholder={placeholder}
              searchPlaceholder="Tìm kiếm..."
              emptyText="Không có kết quả"
              disabled={disabled}
              clearable
            />
          </FormControl>
          {description && <FormDescription>{description}</FormDescription>}
          <FormMessage />
        </FormItem>
      )}
    />
  );
}
