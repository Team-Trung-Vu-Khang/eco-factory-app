import { Button } from "@Team-Trung-Vu-Khang/eco-shared-ui";
import { Trash2 } from "lucide-react";
import {
  AsyncMultiSelectField,
  CapacityField,
  SelectField,
  TextField,
} from "@/components/form";
import { MACHINE_STATUS_OPTIONS } from "@/features/factory";
import { fetchProcessingServiceOptions } from "@/features/processing-service";
import { fetchProductGroupOptions } from "@/features/product-group";
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
        <legend className="text-sm font-semibold text-slate-800">
          Máy / dây chuyền #{index + 1}
        </legend>
        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={onRemove}
          className="text-rose-600 hover:text-rose-700"
        >
          <Trash2 className="mr-1 h-4 w-4" />
          Xóa
        </Button>
      </div>

      <div className="grid gap-x-4 gap-y-3 sm:grid-cols-2 lg:grid-cols-4">
        <TextField
          control={control}
          name={`${base}.name`}
          label="Tên máy / dây chuyền"
          required
          className="sm:col-span-2"
        />
        <SelectField
          control={control}
          name={`${base}.status`}
          label="Tình trạng"
          required
          options={MACHINE_STATUS_OPTIONS}
        />
        <CapacityField
          control={control}
          valueName={`${base}.maxCapacity`}
          unitName={`${base}.capacityUnit`}
          label="Công suất tối đa"
          required
        />

        <AsyncMultiSelectField
          control={control}
          name={`${base}.functions`}
          label="Dịch vụ"
          required
          fetchOptions={fetchProcessingServiceOptions}
          placeholder="Tìm kiếm và chọn dịch vụ..."
          className="sm:col-span-2"
        />
        <AsyncMultiSelectField
          control={control}
          name={`${base}.productGroupIds`}
          label="Nhóm nông sản/sản phẩm"
          required
          fetchOptions={fetchProductGroupOptions}
          placeholder="Tìm kiếm và chọn nhóm nông sản..."
          className="sm:col-span-2"
        />
      </div>
    </fieldset>
  );
}
