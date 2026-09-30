import { z } from "zod";
import dayjs from "dayjs";

const REQUIRED = "Trường này là bắt buộc.";

export const scheduleSchema = z
  .object({
    id: z.number().optional(),
    title: z.string().trim().min(1, REQUIRED).max(255, "Tối đa 255 ký tự."),
    machineId: z.union([z.string(), z.number()], {
      error: REQUIRED,
    }),
    startDate: z.string().min(1, REQUIRED),
    endDate: z.string().min(1, REQUIRED),
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
    note: z
      .string()
      .trim()
      .max(1000, "Tối đa 1000 ký tự.")
      .optional()
      .nullable(),
  })
  .superRefine((s, ctx) => {
    const todayStr = dayjs().format("YYYY-MM-DD");
    if (s.startDate && s.endDate && s.endDate < s.startDate) {
      ctx.addIssue({
        code: "custom",
        path: ["endDate"],
        message: "Đến ngày không được trước Từ ngày.",
      });
    }
    if (s.endDate && s.endDate < todayStr) {
      ctx.addIssue({
        code: "custom",
        path: ["endDate"],
        message: "Đến ngày không được trước ngày hôm nay.",
      });
    }
  });

export type ScheduleFormValues = z.infer<typeof scheduleSchema>;

export const EMPTY_SCHEDULE: ScheduleFormValues = {
  title: "",
  machineId: "",
  startDate: "",
  endDate: "",
  maxCapacity: undefined as unknown as number,
  capacityUnit: "KG_PER_MONTH",
  note: "",
};
