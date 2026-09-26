import { z } from "zod";

const REQUIRED = "Trường này là bắt buộc.";

export const scheduleSchema = z
  .object({
    factoryId: z.string().min(1, REQUIRED),
    /** One schedule is created per selected machine */
    machineIds: z.array(z.string()).min(1, "Chọn ít nhất 1 máy / dây chuyền."),
    fromDate: z.string().min(1, REQUIRED),
    toDate: z.string().min(1, REQUIRED),
    maxCapacity: z.number({ error: REQUIRED }).positive("Phải lớn hơn 0."),
    capacityUnit: z.string().min(1, REQUIRED),
    note: z.string().trim().optional(),
  })
  .superRefine((s, ctx) => {
    if (s.fromDate && s.toDate && s.toDate < s.fromDate) {
      ctx.addIssue({ code: "custom", path: ["toDate"], message: "Ngày kết thúc phải sau ngày bắt đầu." });
    }
  });

export type ScheduleFormValues = z.infer<typeof scheduleSchema>;

export const EMPTY_SCHEDULE: ScheduleFormValues = {
  factoryId: "",
  machineIds: [],
  fromDate: "",
  toDate: "",
  maxCapacity: undefined as unknown as number,
  capacityUnit: "",
  note: "",
};
