import { z } from "zod";

const REQUIRED = "Trường này là bắt buộc.";

export const factoryAccountSchema = z.object({
  name: z.string().trim().min(1, REQUIRED),
  username: z
    .string()
    .trim()
    .min(4, "Tối thiểu 4 ký tự.")
    .regex(/^[a-zA-Z0-9._]+$/, "Chỉ gồm chữ, số, dấu chấm hoặc gạch dưới."),
  phone: z.string().trim().regex(/^0\d{9}$/, "Số điện thoại không hợp lệ."),
  email: z.union([z.literal(""), z.string().trim().email("Email không hợp lệ.")]).optional(),
  factoryId: z.string().min(1, REQUIRED),
  role: z.enum(["OWNER", "MANAGER", "STAFF"]),
  /** Only required on create — empty on edit keeps the current password */
  password: z.union([z.literal(""), z.string().min(6, "Tối thiểu 6 ký tự.")]).optional(),
});

export type FactoryAccountFormValues = z.infer<typeof factoryAccountSchema>;

export const EMPTY_FACTORY_ACCOUNT: FactoryAccountFormValues = {
  name: "",
  username: "",
  phone: "",
  email: "",
  factoryId: "",
  role: "STAFF",
  password: "",
};
