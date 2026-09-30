import { zodResolver } from "@hookform/resolvers/zod";
import { Badge, Button, Form } from "@Team-Trung-Vu-Khang/eco-shared-ui";
import { Loader2, Send } from "lucide-react";
import { useEffect, useMemo } from "react";
import { useForm, useWatch } from "react-hook-form";
import {
  CapacityField,
  FormSection,
  SelectField,
  TextareaField,
  TextField,
} from "@/components/form";
import {
  CAPACITY_UNIT_LABELS,
  MACHINE_CAPACITY_UNIT_OPTIONS,
  useFactoryMachines,
  type FactoryMachineItem,
} from "@/features/machine";
import {
  EMPTY_SCHEDULE,
  scheduleSchema,
  type ScheduleFormValues,
  type ScheduleRow,
} from "@/features/processing-schedule";

const fmt = new Intl.NumberFormat("vi-VN");

function ReadonlyTags({
  label,
  items,
}: {
  label: string;
  items: Array<{ id: number; name: string }>;
}) {
  return (
    <div className={`space-y-2 ${items.length ? "" : "hidden! sm:block!"}`}>
      <p className="text-sm font-medium text-slate-700">{label}</p>
      <div className="flex min-h-9 flex-wrap items-center gap-1">
        {items.length ? (
          items.map((item) => (
            <Badge key={item.id} variant="secondary" className="font-normal">
              {item.name}
            </Badge>
          ))
        ) : (
          <span className="text-sm text-slate-400">Chọn máy để hiển thị</span>
        )}
      </div>
    </div>
  );
}

interface ScheduleFormProps {
  /** Pre-select a machine, e.g. from the machines page */
  machineId?: string | number;
  editingSchedule?: ScheduleRow | null;
  isSubmitting?: boolean;
  onSubmit: (values: ScheduleFormValues) => Promise<boolean>;
  onCancelEdit?: () => void;
}

export function ScheduleForm({
  machineId,
  editingSchedule,
  isSubmitting,
  onSubmit,
  onCancelEdit,
}: ScheduleFormProps) {
  const form = useForm<ScheduleFormValues>({
    resolver: zodResolver(scheduleSchema),
    defaultValues: EMPTY_SCHEDULE,
    mode: "onTouched",
  });
  const { control, setValue } = form;
  const selectedMachineId = useWatch({
    control,
    name: "machineId",
  });

  const { data: machinesData } = useFactoryMachines({
    page: 0,
    size: 100,
    status: "ACTIVE",
  });
  const allMachines = useMemo(
    () => machinesData?.content ?? [],
    [machinesData],
  );

  const machineOptions = useMemo(
    () =>
      allMachines.map((m: FactoryMachineItem) => ({
        value: String(m.id),
        label: `${m.name} (${m.code})`,
      })),
    [allMachines],
  );

  const selectedMachine = useMemo(
    () => allMachines.find((m) => String(m.id) === String(selectedMachineId)),
    [allMachines, selectedMachineId],
  );

  // Sync when editing schedule changes
  useEffect(() => {
    if (editingSchedule) {
      form.reset({
        id: editingSchedule.id,
        title: editingSchedule.title,
        machineId: editingSchedule.machine.id,
        startDate: editingSchedule.startDate,
        endDate: editingSchedule.endDate,
        maxCapacity: editingSchedule.maxCapacity,
        capacityUnit: editingSchedule.capacityUnit,
        note: editingSchedule.note ?? "",
      });
    }
  }, [editingSchedule, form]);

  // Deep link: ?machineId= selects the machine (only if not editing)
  useEffect(() => {
    if (editingSchedule || !machineId) return;
    const target = allMachines.find((m) => String(m.id) === String(machineId));
    if (target && !form.getValues("machineId")) {
      setValue("machineId", target.id);
    }
  }, [machineId, allMachines, form, setValue, editingSchedule]);

  // Default the unit and title to the selected machine
  useEffect(() => {
    if (selectedMachine && !editingSchedule) {
      if (!form.getValues("capacityUnit")) {
        setValue("capacityUnit", selectedMachine.capacityUnit, {
          shouldValidate: form.formState.isSubmitted,
        });
      }
    }
  }, [selectedMachine, setValue, form, editingSchedule]);

  const handleCancel = () => {
    form.reset(EMPTY_SCHEDULE);
    onCancelEdit?.();
  };

  const submit = form.handleSubmit(async (values) => {
    // Validate capacity does not exceed machine's maximum capacity if comparable
    if (selectedMachine) {
      if (
        values.capacityUnit === selectedMachine.capacityUnit &&
        values.maxCapacity > selectedMachine.maxCapacity
      ) {
        form.setError("maxCapacity", {
          type: "custom",
          message: `Công suất nhận không được vượt quá công suất tối đa của máy (${fmt.format(selectedMachine.maxCapacity)} ${CAPACITY_UNIT_LABELS[selectedMachine.capacityUnit]}).`,
        });
        return;
      }
    }

    if (await onSubmit(values)) {
      form.reset(EMPTY_SCHEDULE);
    }
  });

  return (
    <Form {...form}>
      <form
        onSubmit={submit}
        className="space-y-4 rounded-2xl border border-slate-200 bg-white p-4 sm:p-5"
      >
        <FormSection
          title={
            editingSchedule
              ? "Chỉnh sửa tin nhận chế biến"
              : "Đăng tin nhận chế biến"
          }
          description={
            editingSchedule
              ? `Đang chỉnh sửa lịch đăng cho máy "${editingSchedule.machine.name}"`
              : "Máy chỉ xuất hiện trong tìm kiếm của nông hộ khi có lịch đang mở"
          }
        >
          <div className="grid gap-x-4 gap-y-3 sm:grid-cols-2">
            <TextField
              control={control}
              name="title"
              label="Tiêu đề tin"
              placeholder="VD: Nhận sấy chè Shan tuyết vụ thu"
              required
              className="sm:col-span-2"
            />
            <SelectField
              control={control}
              name="machineId"
              label="Máy / dây chuyền"
              required
              options={machineOptions}
              placeholder="Chọn máy đang hoạt động..."
              className="sm:col-span-2"
            />
            <ReadonlyTags
              label="Dịch vụ"
              items={selectedMachine?.processingServices ?? []}
            />
            <ReadonlyTags
              label="Nhóm nông sản/sản phẩm"
              items={selectedMachine?.productGroups ?? []}
            />
            <TextField
              control={control}
              name="startDate"
              label="Từ ngày"
              type="date"
              required
            />
            <TextField
              control={control}
              name="endDate"
              label="Đến ngày"
              type="date"
              required
            />
            <CapacityField
              control={control}
              valueName="maxCapacity"
              unitName="capacityUnit"
              unitOptions={MACHINE_CAPACITY_UNIT_OPTIONS}
              label="Công suất tối đa nhận"
              required
              description={
                selectedMachine
                  ? `Công suất tối đa của máy: ${fmt.format(selectedMachine.maxCapacity)} ${CAPACITY_UNIT_LABELS[selectedMachine.capacityUnit]}`
                  : undefined
              }
            />
            <TextareaField
              control={control}
              name="note"
              label="Ghi chú"
              rows={2}
              placeholder="VD: Ưu tiên chè búp tươi trong ngày"
            />
          </div>
        </FormSection>
        <div className="flex justify-end gap-2">
          {editingSchedule && (
            <Button
              type="button"
              variant="outline"
              onClick={handleCancel}
              disabled={isSubmitting}
              className="w-full sm:w-auto!"
            >
              Hủy
            </Button>
          )}
          <Button
            type="submit"
            disabled={isSubmitting}
            className="w-full sm:w-auto!"
          >
            {isSubmitting ? (
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            ) : (
              <Send className="mr-2 h-4 w-4" />
            )}
            {editingSchedule ? "Cập nhật tin đăng" : "Đăng tin"}
          </Button>
        </div>
      </form>
    </Form>
  );
}
