import { z } from "zod";

export const processingServiceSchema = z.object({
  name: z.string().trim().min(1, "Trường này là bắt buộc."),
  description: z.string().trim().optional(),
});

export type ProcessingServiceFormValues = z.infer<typeof processingServiceSchema>;

export const EMPTY_PROCESSING_SERVICE: ProcessingServiceFormValues = { name: "", description: "" };
