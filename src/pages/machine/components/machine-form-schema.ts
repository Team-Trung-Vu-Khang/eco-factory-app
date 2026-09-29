import { z } from "zod";

const REQUIRED = "Trường này là bắt buộc.";

export const MACHINE_STATUS_OPTIONS = [
  { value: "ACTIVE", label: "Đang hoạt động" },
  { value: "MAINTENANCE", label: "Bảo trì" },
  { value: "PAUSED", label: "Tạm dừng" },
] as const;

export const MACHINE_CAPACITY_UNIT_OPTIONS = [
  { value: "KG_PER_MONTH", label: "kg/tháng" },
  { value: "TONNE_PER_MONTH", label: "tấn/tháng" },
] as const;

export const machineDialogSchema = z.object({
  id: z.number().optional(),
  name: z.string().trim().min(1, REQUIRED).max(255, "Tối đa 255 ký tự."),
  status: z.enum(["ACTIVE", "MAINTENANCE", "PAUSED"], { error: REQUIRED }),
  processingServiceIds: z
    .array(z.union([z.string(), z.number()]))
    .min(1, "Chọn ít nhất 1 dịch vụ."),
  maxCapacity: z
    .number({ error: REQUIRED })
    .positive("Công suất phải lớn hơn 0.")
    .refine((val) => {
      const decimals = (val.toString().split(".")[1] || "").length;
      return decimals <= 3;
    }, "Tối đa 3 chữ số thập phân."),
  capacityUnit: z.enum(["KG_PER_MONTH", "TONNE_PER_MONTH"], {
    error: REQUIRED,
  }),
  productGroupIds: z
    .array(z.union([z.string(), z.number()]))
    .min(1, "Chọn ít nhất 1 nhóm nông sản / sản phẩm."),
});

export type MachineDialogValues = z.infer<typeof machineDialogSchema>;

export const EMPTY_MACHINE_DIALOG: MachineDialogValues = {
  name: "",
  status: "ACTIVE",
  processingServiceIds: [],
  maxCapacity: undefined as unknown as number,
  capacityUnit: "KG_PER_MONTH",
  productGroupIds: [],
};
