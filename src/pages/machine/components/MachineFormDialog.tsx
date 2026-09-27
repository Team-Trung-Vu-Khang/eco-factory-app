import { zodResolver } from "@hookform/resolvers/zod";
import { Form, FormDialog } from "@Team-Trung-Vu-Khang/eco-shared-ui";
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { CapacityField, MultiSelectField, SelectField, TextField } from "@/components/form";
import { MACHINE_STATUS_OPTIONS, useCurrentFactory } from "@/features/factory";
import { useProcessingServiceOptions } from "@/features/processing-service";
import { useProductGroupOptions } from "@/features/product-group";

import { EMPTY_MACHINE_DIALOG, machineFormSchema, type MachineDialogValues } from "./machine-form-schema";

interface MachineFormDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  /** undefined = create */
  initialValues?: MachineDialogValues;
  isSubmitting?: boolean;
  onSubmit: (values: MachineDialogValues) => void;
}

export function MachineFormDialog({ open, onOpenChange, initialValues, isSubmitting, onSubmit }: MachineFormDialogProps) {
  const isEdit = !!initialValues;
  const form = useForm<MachineDialogValues>({
    resolver: zodResolver(machineFormSchema),
    defaultValues: EMPTY_MACHINE_DIALOG,
    mode: "onTouched",
  });
  const { control } = form;
  const { factoryId } = useCurrentFactory();
  const productGroupOptions = useProductGroupOptions();
  const serviceOptions = useProcessingServiceOptions();

  useEffect(() => {
    if (open) form.reset(initialValues ?? { ...EMPTY_MACHINE_DIALOG, factoryId: factoryId ?? "" });
  }, [open, initialValues, factoryId, form]);

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
          <TextField control={control} name="name" label="Tên máy / dây chuyền" required />
          <SelectField control={control} name="status" label="Tình trạng" required options={MACHINE_STATUS_OPTIONS} />
          <MultiSelectField
            control={control}
            name="functions"
            label="Dịch vụ"
            required
            options={serviceOptions}
            description="Dịch vụ máy thực hiện — dùng để tìm kiếm nhà máy"
            className="sm:col-span-2"
          />
          <CapacityField control={control} valueName="maxCapacity" unitName="capacityUnit" label="Công suất tối đa" required />
          <MultiSelectField control={control} name="productGroupIds" label="Nhóm nông sản/sản phẩm" required options={productGroupOptions} />
        </div>
      </Form>
    </FormDialog>
  );
}
