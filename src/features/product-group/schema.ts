import { z } from "zod";

export const productGroupSchema = z.object({
  name: z
    .string()
    .trim()
    .min(1, "Trường này là bắt buộc.")
    .max(255, "Tối đa 255 ký tự."),
  code: z.string().trim().max(80, "Tối đa 80 ký tự.").optional(),
  crops: z
    .array(z.string().trim().max(255, "Tên cây trồng tối đa 255 ký tự."))
    .max(1000, "Tối đa 1000 cây trồng."),
  description: z.string().trim().optional(),
  status: z.enum(["active", "inactive", "archived"]),
});

export type ProductGroupFormValues = z.infer<typeof productGroupSchema>;

export const EMPTY_PRODUCT_GROUP: ProductGroupFormValues = {
  name: "",
  code: "",
  crops: [],
  description: "",
  status: "active",
};
