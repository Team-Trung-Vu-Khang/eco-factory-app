import { Form, FormDialog } from "@Team-Trung-Vu-Khang/eco-shared-ui";
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { CapacityField, MultiSelectField, TextareaField } from "@/components/form";
import { SEARCH_QUANTITY_UNIT_OPTIONS, type MatchedMachine, type SearchQuantityUnit } from "@/features/connection";
import { CROP_OPTIONS } from "@/features/crop";

export interface RegisterValues {
  cropIds: string[];
  quantity?: number;
  quantityUnit: SearchQuantityUnit;
  note: string;
}

interface RegisterDialogProps {
  machine: MatchedMachine | null;
  defaultCropIds: string[];
  defaultQuantity?: number;
  defaultQuantityUnit?: SearchQuantityUnit;
  isSubmitting?: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (values: RegisterValues) => void;
}

export function RegisterDialog({ machine, defaultCropIds, defaultQuantity, defaultQuantityUnit, isSubmitting, onOpenChange, onSubmit }: RegisterDialogProps) {
  const form = useForm<RegisterValues>();
  const { control } = form;

  useEffect(() => {
    if (machine) form.reset({ cropIds: defaultCropIds, quantity: defaultQuantity, quantityUnit: defaultQuantityUnit ?? "KG", note: "" });
  }, [machine, defaultCropIds, defaultQuantity, defaultQuantityUnit, form]);

  return (
    <FormDialog
      open={!!machine}
      onOpenChange={onOpenChange}
      title="Đăng ký chờ kết nối"
      description={machine ? `${machine.name} · ${machine.factoryName}` : undefined}
      submitLabel="Đăng ký"
      loading={isSubmitting}
      onSubmit={form.handleSubmit(onSubmit)}
    >
      <Form {...form}>
        <div className="space-y-4">
          <MultiSelectField control={control} name="cropIds" label="Cây trồng cần chế biến" options={CROP_OPTIONS} />
          <CapacityField control={control} valueName="quantity" unitName="quantityUnit" label="Sản lượng dự kiến" unitOptions={SEARCH_QUANTITY_UNIT_OPTIONS} />
          <TextareaField control={control} name="note" label="Ghi chú cho nhà máy" rows={3} placeholder="VD: Thời gian thu hoạch, yêu cầu chế biến..." />
          <p className="text-xs text-slate-500">Quản trị viên sẽ liên hệ và xác nhận kết quả kết nối. Theo dõi tại mục Lịch sử kết nối.</p>
        </div>
      </Form>
    </FormDialog>
  );
}
