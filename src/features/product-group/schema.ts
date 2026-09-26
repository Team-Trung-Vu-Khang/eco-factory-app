import { z } from "zod";

export const productGroupSchema = z.object({
  name: z.string().trim().min(1, "Trường này là bắt buộc."),
  cropRefs: z.array(z.string()).min(1, "Chọn ít nhất 1 nhóm cây trồng hoặc cây trồng."),
  description: z.string().trim().optional(),
});

export type ProductGroupFormValues = z.infer<typeof productGroupSchema>;

export const EMPTY_PRODUCT_GROUP: ProductGroupFormValues = { name: "", cropRefs: [], description: "" };
