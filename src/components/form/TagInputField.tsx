import {
  Badge,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  Input,
} from "@Team-Trung-Vu-Khang/eco-shared-ui";
import { X } from "lucide-react";
import { useState, type KeyboardEvent, type ReactNode } from "react";
import type { Control, FieldPath, FieldValues } from "react-hook-form";

interface TagInputFieldProps<T extends FieldValues> {
  control: Control<T>;
  name: FieldPath<T>;
  label: ReactNode;
  required?: boolean;
  description?: ReactNode;
  disabled?: boolean;
  className?: string;
  placeholder?: string;
}

export function TagInputField<T extends FieldValues>({
  control,
  name,
  label,
  required,
  description,
  disabled,
  className,
  placeholder = "Nhập tên cây trồng rồi ấn Enter...",
}: TagInputFieldProps<T>) {
  const [inputValue, setInputValue] = useState("");

  return (
    <FormField
      control={control}
      name={name}
      render={({ field }) => {
        const tags: string[] = Array.isArray(field.value) ? field.value : [];

        const addTag = (rawText: string) => {
          const trimmed = rawText.trim();
          if (!trimmed) return;
          // Avoid duplicate tags (case-insensitive)
          if (tags.some((t) => t.toLowerCase() === trimmed.toLowerCase())) {
            setInputValue("");
            return;
          }
          field.onChange([...tags, trimmed]);
          setInputValue("");
        };

        const removeTag = (indexToRemove: number) => {
          field.onChange(tags.filter((_, idx) => idx !== indexToRemove));
        };

        const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
          if (e.key === "Enter" || e.key === ",") {
            e.preventDefault();
            addTag(inputValue);
          } else if (e.key === "Backspace" && !inputValue && tags.length > 0) {
            removeTag(tags.length - 1);
          }
        };

        return (
          <FormItem className={className}>
            <FormLabel required={required}>{label}</FormLabel>
            <FormControl>
              <div className="space-y-2">
                <Input
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  onKeyDown={handleKeyDown}
                  onBlur={() => {
                    if (inputValue.trim()) {
                      addTag(inputValue);
                    }
                  }}
                  placeholder={placeholder}
                  disabled={disabled}
                />
                {tags.length > 0 && (
                  <div className="flex flex-wrap gap-1.5 pt-1">
                    {tags.map((tag, idx) => (
                      <Badge
                        key={`${tag}-${idx}`}
                        variant="secondary"
                        className="flex items-center gap-1 py-1 px-2.5 font-normal"
                      >
                        <span>{tag}</span>
                        {!disabled && (
                          <button
                            type="button"
                            onClick={() => removeTag(idx)}
                            className="text-slate-400 hover:text-slate-700 transition-colors"
                            aria-label={`Xoá tag ${tag}`}
                          >
                            <X className="h-3.5 w-3.5" />
                          </button>
                        )}
                      </Badge>
                    ))}
                  </div>
                )}
              </div>
            </FormControl>
            {description && <FormDescription>{description}</FormDescription>}
            <FormMessage />
          </FormItem>
        );
      }}
    />
  );
}
