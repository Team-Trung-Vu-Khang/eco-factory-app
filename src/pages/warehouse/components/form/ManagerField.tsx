import { FormControl, FormField, FormItem, FormLabel, FormMessage } from "@Team-Trung-Vu-Khang/eco-shared-ui";
import { ChevronDown, UserRound, X } from "lucide-react";
import { useState } from "react";
import { useWatch } from "react-hook-form";
import { PersonnelPickerDialog, TextField } from "@/components/form";
import { useWarehouseFormContext } from "./useWarehouseFormContext";

/** Pick the person in charge from personnel; phone auto-fills, editable when missing */
export function ManagerField() {
  const { control, setValue } = useWarehouseFormContext();
  const [open, setOpen] = useState(false);
  const managerId = useWatch({ control, name: "managerId" });
  const opts = { shouldDirty: true, shouldValidate: true };

  const clear = () => {
    setValue("managerId", "", opts);
    setValue("managerName", "", opts);
    setValue("managerPhone", "", opts);
  };

  return (
    <>
      <FormField
        control={control}
        name="managerName"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Người phụ trách</FormLabel>
            <FormControl>
              <div className="relative">
                <button
                  type="button"
                  ref={field.ref}
                  onClick={() => setOpen(true)}
                  className="flex h-10 w-full items-center gap-2 rounded-md border border-input bg-background px-3 pr-14 text-left text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                >
                  <UserRound className="h-4 w-4 shrink-0 text-slate-400" />
                  <span className={`truncate ${field.value ? "text-slate-900" : "text-muted-foreground"}`}>
                    {field.value || "Chọn nhân sự..."}
                  </span>
                </button>
                {field.value && (
                  <button
                    type="button"
                    onClick={clear}
                    className="absolute right-8 top-1/2 -translate-y-1/2 rounded p-0.5 text-slate-400 hover:text-slate-600"
                    aria-label="Bỏ chọn"
                  >
                    <X className="h-4 w-4" />
                  </button>
                )}
                <ChevronDown className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
              </div>
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      <TextField
        control={control}
        name="managerPhone"
        label="SĐT phụ trách"
        type="tel"
        placeholder={managerId ? "Nhân sự chưa có SĐT, nhập tại đây" : "Tự điền khi chọn nhân sự"}
      />

      <PersonnelPickerDialog
        open={open}
        onOpenChange={setOpen}
        selectedId={managerId}
        onSelect={(p) => {
          setValue("managerId", p.id, opts);
          setValue("managerName", p.fullName, opts);
          setValue("managerPhone", p.phone ?? "", opts);
        }}
      />
    </>
  );
}
