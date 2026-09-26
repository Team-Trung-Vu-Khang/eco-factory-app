import { z } from "zod";

export const productGroupSchema = z.object({
  /** Group name is picked from the crop-group master list */
  cropGroupId: z.string().min(1, "Trường này là bắt buộc."),
  /** Crops within that group; empty = the whole group */
  cropIds: z.array(z.string()),
  description: z.string().trim().optional(),
});

export type ProductGroupFormValues = z.infer<typeof productGroupSchema>;

export const EMPTY_PRODUCT_GROUP: ProductGroupFormValues = { cropGroupId: "", cropIds: [], description: "" };
