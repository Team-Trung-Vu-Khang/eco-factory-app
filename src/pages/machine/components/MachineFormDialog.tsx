import { zodResolver } from "@hookform/resolvers/zod";
import { Form, FormDialog } from "@Team-Trung-Vu-Khang/eco-shared-ui";
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import {
  AsyncMultiSelectField,
  CapacityField,
  SelectField,
  TextField,
} from "@/components/form";
import { fetchProcessingServiceOptions } from "@/features/processing-service";
import { fetchProductGroupOptions } from "@/features/product-group";
import {
  EMPTY_MACHINE_DIALOG,
  MACHINE_CAPACITY_UNIT_OPTIONS,
  MACHINE_STATUS_OPTIONS,
  machineDialogSchema,
  type MachineDialogValues,
} from "./machine-form-schema";

interface MachineFormDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  /** undefined = create */
  initialValues?: MachineDialogValues;
  isSubmitting?: boolean;
  onSubmit: (values: MachineDialogValues) => void;
}

export function MachineFormDialog({
  open,
  onOpenChange,
  initialValues,
  isSubmitting,
  onSubmit,
}: MachineFormDialogProps) {
  const isEdit = !!initialValues;
  const form = useForm<MachineDialogValues>({
    resolver: zodResolver(machineDialogSchema),
    defaultValues: EMPTY_MACHINE_DIALOG,
    mode: "onTouched",
  });
  const { control } = form;

  useEffect(() => {
    if (open) {
      form.reset(initialValues ?? EMPTY_MACHINE_DIALOG);
    }
  }, [open, initialValues, form]);

  return (
    <FormDialog
      open={open}
      onOpenChange={onOpenChange}
      title={isEdit ? "Chỉnh sửa máy / dây chuyền" : "Thêm máy / dây chuyền"}
      description="Dịch vụ, công suất và nhóm nông sản của máy"
      submitLabel={isEdit ? "Lưu thay đổi" : "Thêm"}
      loading={isSubmitting}
      size="lg"
      onSubmit={form.handleSubmit(onSubmit)}
    >
      <Form {...form}>
        <div className="grid gap-x-4 gap-y-3 sm:grid-cols-2">
          <TextField
            control={control}
            name="name"
            label="Tên máy / dây chuyền"
            required
            placeholder="VD: Máy sấy tháp liên hoàn"
          />
          <SelectField
            control={control}
            name="status"
            label="Tình trạng"
            required
            options={MACHINE_STATUS_OPTIONS}
          />
          <AsyncMultiSelectField
            control={control}
            name="processingServiceIds"
            label="Dịch vụ chế biến"
            required
            fetchOptions={fetchProcessingServiceOptions}
            placeholder="Tìm kiếm và chọn dịch vụ..."
            description="Dịch vụ máy thực hiện"
            className="sm:col-span-2"
          />
          <CapacityField
            control={control}
            valueName="maxCapacity"
            unitName="capacityUnit"
            unitOptions={MACHINE_CAPACITY_UNIT_OPTIONS}
            label="Công suất tối đa"
            required
          />
          <AsyncMultiSelectField
            control={control}
            name="productGroupIds"
            label="Nhóm nông sản / sản phẩm"
            required
            fetchOptions={fetchProductGroupOptions}
            placeholder="Tìm kiếm và chọn nhóm nông sản..."
          />
        </div>
      </Form>
    </FormDialog>
  );
}
