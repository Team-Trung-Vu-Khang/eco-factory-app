import { Button } from "@Team-Trung-Vu-Khang/eco-shared-ui";
import { Trash2 } from "lucide-react";
import {
  MultiSelectField,
  NumberField,
  SelectField,
  TextField,
} from "@/components/form";
import {
  CAPACITY_UNIT_OPTIONS,
  MACHINE_STATUS_OPTIONS,
  PROCESSING_SERVICE_OPTIONS,
  PRODUCT_GROUP_OPTIONS,
} from "@/features/factory";
import { useFactoryFormContext } from "./useFactoryFormContext";

interface MachineFieldsetProps {
  index: number;
  onRemove: () => void;
}

export function MachineFieldset({ index, onRemove }: MachineFieldsetProps) {
  const { control } = useFactoryFormContext();
  const base = `machines.${index}` as const;

  return (
    <fieldset className="space-y-3 rounded-lg border border-slate-200 p-4">
      <div className="flex items-center justify-between">
        <legend className="text-sm font-semibold text-slate-800">Máy / dây chuyền #{index + 1}</legend>
        <Button type="button" variant="ghost" size="sm" onClick={onRemove} className="text-rose-600 hover:text-rose-700">
          <Trash2 className="mr-1 h-4 w-4" />
          Xóa
        </Button>
      </div>

      <div className="grid gap-x-4 gap-y-3 sm:grid-cols-2 lg:grid-cols-4">
        <TextField control={control} name={`${base}.name`} label="Tên máy / dây chuyền" required className="sm:col-span-2" />
        <SelectField control={control} name={`${base}.status`} label="Tình trạng" required options={MACHINE_STATUS_OPTIONS} />
        <SelectField control={control} name={`${base}.capacityUnit`} label="Đơn vị công suất" required options={CAPACITY_UNIT_OPTIONS} />

        <MultiSelectField control={control} name={`${base}.functions`} label="Chức năng" required options={PROCESSING_SERVICE_OPTIONS} className="sm:col-span-2" />
        <MultiSelectField control={control} name={`${base}.productGroupIds`} label="Loại nông sản phù hợp" required options={PRODUCT_GROUP_OPTIONS} className="sm:col-span-2" />

        <NumberField control={control} name={`${base}.maxCapacity`} label="Công suất tối đa" required step="any" />
        <NumberField control={control} name={`${base}.availableCapacity`} label="Công suất cho bên ngoài" required step="any" />
        <TextField control={control} name={`${base}.availableFrom`} label="Nhận chế biến từ" type="date" />
        <TextField control={control} name={`${base}.availableTo`} label="Đến ngày" type="date" />
      </div>
    </fieldset>
  );
}
