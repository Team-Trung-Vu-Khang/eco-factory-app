import { z } from "zod";

const REQUIRED = "Trường này là bắt buộc.";

export const processingServiceSchema = z.object({
  factoryId: z.string().min(1, REQUIRED),
  service: z.string().min(1, REQUIRED),
  description: z.string().trim().optional(),
  isActive: z.boolean(),
});

export type ProcessingServiceFormValues = z.infer<typeof processingServiceSchema>;

export const EMPTY_PROCESSING_SERVICE: ProcessingServiceFormValues = { factoryId: "", service: "", description: "", isActive: true };
