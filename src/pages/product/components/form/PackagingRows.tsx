import { Button } from "@Team-Trung-Vu-Khang/eco-shared-ui";
import { Plus, Trash2 } from "lucide-react";
import { useFieldArray } from "react-hook-form";
import { NumberField, SelectField, TextField } from "@/components/form";
import { EMPTY_PACKAGING, WEIGHT_UNIT_OPTIONS } from "@/features/product";
import { useProductFormContext } from "./useProductFormContext";

export function PackagingRows() {
  const { control, formState } = useProductFormContext();
  const { fields, append, remove } = useFieldArray({ control, name: "packagings" });
  const arrayError = formState.errors.packagings?.root?.message ?? formState.errors.packagings?.message;

  return (
    <div className="space-y-2">
      {fields.map((field, index) => {
        const base = `packagings.${index}` as const;
        return (
          <div
            key={field.id}
            className="grid items-start gap-x-3 gap-y-2 rounded-lg border border-slate-200 bg-white p-3 sm:grid-cols-2 lg:grid-cols-[2fr_1fr_1fr_1.5fr_auto]"
          >
            <TextField control={control} name={`${base}.name`} label="Quy cách" required placeholder="VD: Túi zip, hộp giấy" />
            <NumberField control={control} name={`${base}.netWeight`} label="Khối lượng tịnh" required step="any" />
            <SelectField control={control} name={`${base}.weightUnit`} label="Đơn vị" required options={WEIGHT_UNIT_OPTIONS} />
            <NumberField control={control} name={`${base}.price`} label="Giá tham khảo (đ)" step={1000} />
            <Button
              type="button"
              variant="ghost"
              size="icon"
              onClick={() => remove(index)}
              className="justify-self-end text-slate-400 hover:text-rose-600 lg:mt-[1.625rem]"
              aria-label={`Xóa quy cách ${index + 1}`}
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
        );
      })}

      {arrayError && <p className="text-sm font-medium text-destructive">{arrayError}</p>}

      <Button type="button" variant="ghost" size="sm" className="text-emerald-700" onClick={() => append({ ...EMPTY_PACKAGING })}>
        <Plus className="mr-2 h-4 w-4" />
        Thêm quy cách
      </Button>
    </div>
  );
}
