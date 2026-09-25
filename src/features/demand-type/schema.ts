import { z } from "zod";

const REQUIRED = "Trường này là bắt buộc.";

export const demandTypeSchema = z.object({
  name: z.string().trim().min(1, REQUIRED),
  code: z
    .string()
    .trim()
    .min(1, REQUIRED)
    .regex(/^[A-Z0-9_]+$/, "Chỉ gồm chữ in hoa, số và dấu _ (VD: SAY_LANH)."),
  processingServices: z.array(z.string()).min(1, "Chọn ít nhất 1 dịch vụ."),
  description: z.string().trim().optional(),
  isActive: z.boolean(),
});

export type DemandTypeFormValues = z.infer<typeof demandTypeSchema>;

export const EMPTY_DEMAND_TYPE: DemandTypeFormValues = {
  name: "",
  code: "",
  processingServices: [],
  description: "",
  // New types start active; only editable afterwards
  isActive: true,
};
