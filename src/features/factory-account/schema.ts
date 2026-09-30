import { z } from "zod";

const REQUIRED = "Trường này là bắt buộc.";

export const factoryAccountSchema = z.object({
  fullName: z.string().trim().min(1, REQUIRED).max(255, "Tối đa 255 ký tự."),
  phoneNumber: z
    .string()
    .trim()
    .min(1, REQUIRED)
    .regex(
      /^(0|\+?84)[35789]\d{8}$/,
      "Số điện thoại di động Việt Nam không hợp lệ (10 số, đầu số 3/5/7/8/9).",
    ),
  email: z
    .union([z.literal(""), z.string().trim().email("Email không hợp lệ.")])
    .optional(),
  workspaceId: z.union([z.string(), z.number()]).refine(
    (val) => {
      const num = Number(val);
      return !isNaN(num) && num > 0;
    },
    { message: "Vui lòng chọn nhà máy." },
  ),
  /** Only required/validated if entered: 8–128 characters */
  password: z
    .union([
      z.literal(""),
      z
        .string()
        .min(8, "Mật khẩu tối thiểu 8 ký tự.")
        .max(128, "Mật khẩu tối đa 128 ký tự."),
    ])
    .optional(),
  operatingArea: z.string().trim().max(150, "Tối đa 150 ký tự.").optional(),
  province: z.string().trim().max(150, "Tối đa 150 ký tự.").optional(),
  commune: z.string().trim().max(150, "Tối đa 150 ký tự.").optional(),
  birthYear: z.number().min(1900).max(2100).optional(),
  audienceType: z
    .enum(["individual", "cooperative", "business", "other"])
    .optional(),
});

export type FactoryAccountFormValues = z.infer<typeof factoryAccountSchema>;

export const EMPTY_FACTORY_ACCOUNT: FactoryAccountFormValues = {
  fullName: "",
  phoneNumber: "",
  email: "",
  workspaceId: "",
  password: "",
};
