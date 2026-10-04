import { z } from "zod";

const REQUIRED = "Trường này là bắt buộc.";

export const certificateSchema = z
  .object({
    certificateType: z
      .string()
      .trim()
      .min(1, REQUIRED)
      .max(255, "Tối đa 255 ký tự."),
    certificateNumber: z
      .string()
      .trim()
      .max(120, "Tối đa 120 ký tự.")
      .optional()
      .or(z.literal("")),
    issuer: z
      .string()
      .trim()
      .max(255, "Tối đa 255 ký tự.")
      .optional()
      .or(z.literal("")),
    issuedDate: z.string().optional().or(z.literal("")),
    expiryDate: z.string().optional().or(z.literal("")),
    scopeDescription: z
      .string()
      .trim()
      .max(1000, "Tối đa 1000 ký tự.")
      .optional()
      .or(z.literal("")),
    imageUrl: z.string().trim().max(1000, "Tối đa 1000 ký tự.").optional(),
  })
  .superRefine((c, ctx) => {
    if (c.issuedDate && c.expiryDate && c.expiryDate < c.issuedDate) {
      ctx.addIssue({
        code: "custom",
        path: ["expiryDate"],
        message: "Ngày hết hạn phải sau ngày cấp.",
      });
    }
  });

export type CertificateFormValues = z.infer<typeof certificateSchema>;

export const EMPTY_CERTIFICATE: CertificateFormValues = {
  certificateType: "",
  certificateNumber: "",
  issuer: "",
  issuedDate: "",
  expiryDate: "",
  scopeDescription: "",
  imageUrl: "",
};
