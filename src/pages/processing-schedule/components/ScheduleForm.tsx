import { zodResolver } from "@hookform/resolvers/zod";
import { Button, Form } from "@Team-Trung-Vu-Khang/eco-shared-ui";
import { Loader2, Send } from "lucide-react";
import { useEffect, useMemo } from "react";
import { useForm, useWatch } from "react-hook-form";
import { CapacityField, FormSection, SearchSelectField, TextareaField, TextField } from "@/components/form";
import { CAPACITY_UNIT_LABELS, useFactoryOptions, useMachines } from "@/features/factory";
import { EMPTY_SCHEDULE, scheduleSchema, type ScheduleFormValues } from "@/features/processing-schedule";

const fmt = new Intl.NumberFormat("vi-VN");

interface ScheduleFormProps {
  /** Pre-select a machine, e.g. from the machines page */
  machineId?: string;
  isSubmitting?: boolean;
  onSubmit: (values: ScheduleFormValues) => Promise<boolean>;
}

export function ScheduleForm({ machineId, isSubmitting, onSubmit }: ScheduleFormProps) {
  const form = useForm<ScheduleFormValues>({ resolver: zodResolver(scheduleSchema), defaultValues: EMPTY_SCHEDULE, mode: "onTouched" });
  const { control, setValue } = form;
  const [factoryId, selectedMachineId] = useWatch({ control, name: ["factoryId", "machineId"] });

  const { options: factoryOptions } = useFactoryOptions();
  const { data: machines } = useMachines({ page: 0, size: 1000, status: "ACTIVE" });
  const allMachines = useMemo(() => machines?.content ?? [], [machines]);
  const machineOptions = allMachines.filter((m) => m.factoryId === factoryId).map((m) => ({ value: m.id, label: m.name }));
  const machine = allMachines.find((m) => m.id === selectedMachineId);

  // Deep link: ?machineId= selects the machine and its factory
  useEffect(() => {
    const target = allMachines.find((m) => m.id === machineId);
    if (target && !form.getValues("machineId")) {
      setValue("factoryId", target.factoryId);
      setValue("machineId", target.id);
    }
  }, [machineId, allMachines, form, setValue]);

  // Default the unit to the machine's; the user can still change it
  useEffect(() => {
    if (machine) setValue("capacityUnit", machine.capacityUnit, { shouldValidate: form.formState.isSubmitted });
  }, [machine, setValue, form]);

  const submit = form.handleSubmit(async (values) => {
    if (await onSubmit(values)) form.reset({ ...EMPTY_SCHEDULE, factoryId: values.factoryId });
  });

  return (
    <Form {...form}>
      <form onSubmit={submit} className="space-y-4 rounded-2xl border border-slate-200 bg-white p-5">
        <FormSection title="Đăng tin nhận chế biến" description="Máy chỉ xuất hiện trong tìm kiếm của nông hộ khi có lịch đang mở">
          <div className="grid gap-x-4 gap-y-3 sm:grid-cols-2">
            <SearchSelectField control={control} name="factoryId" label="Nhà máy" required options={factoryOptions} />
            <SearchSelectField
              control={control}
              name="machineId"
              label="Máy / dây chuyền"
              required
              disabled={!factoryId}
              options={machineOptions}
              placeholder={factoryId ? "Chọn máy đang hoạt động..." : "Chọn nhà máy trước"}
            />
            <TextField control={control} name="fromDate" label="Từ ngày" type="date" required />
            <TextField control={control} name="toDate" label="Đến ngày" type="date" required />
            <CapacityField
              control={control}
              valueName="maxCapacity"
              unitName="capacityUnit"
              label="Công suất tối đa nhận"
              required
              description={
                machine
                  ? `Công suất tối đa của máy: ${fmt.format(machine.maxCapacity)} ${CAPACITY_UNIT_LABELS[machine.capacityUnit]}`
                  : undefined
              }
            />
            <TextareaField control={control} name="note" label="Ghi chú" rows={2} placeholder="VD: Ưu tiên chè búp tươi trong ngày" />
          </div>
        </FormSection>
        <div className="flex justify-end">
          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Send className="mr-2 h-4 w-4" />}
            Đăng tin
          </Button>
        </div>
      </form>
    </Form>
  );
}
