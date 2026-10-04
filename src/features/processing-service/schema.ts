import { z } from "zod";

export const processingServiceSchema = z.object({
  name: z
    .string()
    .trim()
    .min(1, "Trường này là bắt buộc.")
    .max(255, "Tối đa 255 ký tự."),
  code: z.string().trim().max(80, "Tối đa 80 ký tự.").optional(),
  description: z.string().trim().optional(),
  imageUrl: z.string().trim().max(1000, "Tối đa 1000 ký tự.").optional(),
  status: z.enum(["active", "inactive", "archived"]),
});

export type ProcessingServiceFormValues = z.infer<
  typeof processingServiceSchema
>;

export const EMPTY_PROCESSING_SERVICE: ProcessingServiceFormValues = {
  name: "",
  code: "",
  description: "",
  imageUrl: "",
  status: "active",
};
