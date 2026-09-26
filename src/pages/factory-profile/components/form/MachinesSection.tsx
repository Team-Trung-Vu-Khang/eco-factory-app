import { Button } from "@Team-Trung-Vu-Khang/eco-shared-ui";
import { Plus } from "lucide-react";
import { useFieldArray, useWatch } from "react-hook-form";
import { FormSection, SwitchField } from "@/components/form";
import { EMPTY_MACHINE } from "@/features/factory";
import { MachineFieldset } from "./MachineFieldset";
import { useFactoryFormContext } from "./useFactoryFormContext";

export function MachinesSection() {
  const { control, formState } = useFactoryFormContext();
  const { fields, append, remove, replace } = useFieldArray({ control, name: "machines" });
  const offersExternalCapacity = useWatch({ control, name: "offersExternalCapacity" });
  const arrayError = formState.errors.machines?.root?.message ?? formState.errors.machines?.message;

  return (
    <FormSection
      title="Máy móc & công suất"
      description="Khai báo máy & công suất tối đa. Lịch nhận chế biến được đăng riêng theo từng đợt sau khi tạo nhà máy."
    >
      <div className="space-y-4">
        <SwitchField
          control={control}
          name="offersExternalCapacity"
          label="Có máy móc / năng lực chế biến cung cấp cho bên ngoài"
          description="Bật nếu cơ sở có thể nhận chế biến cho nông hộ, HTX, doanh nghiệp khác"
          onCheckedChange={(checked) => replace(checked ? [{ ...EMPTY_MACHINE }] : [])}
        />

        {offersExternalCapacity && (
          <>
            {fields.map((field, index) => (
              <MachineFieldset key={field.id} index={index} onRemove={() => remove(index)} />
            ))}

            {arrayError && <p className="text-sm font-medium text-destructive">{arrayError}</p>}

            <Button type="button" variant="outline" onClick={() => append({ ...EMPTY_MACHINE })}>
              <Plus className="mr-2 h-4 w-4" />
              Thêm máy / dây chuyền
            </Button>
          </>
        )}
      </div>
    </FormSection>
  );
}
