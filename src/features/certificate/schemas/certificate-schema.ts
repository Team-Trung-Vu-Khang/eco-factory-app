import { z } from "zod";

const REQUIRED = "Trường này là bắt buộc.";

export const certificateSchema = z
  .object({
    type: z.string().min(1, REQUIRED),
    standardName: z.string().trim().optional(),
    number: z.string().trim().min(1, REQUIRED),
    issuer: z.string().min(1, REQUIRED),
    issuedDate: z.string().min(1, REQUIRED),
    expiryDate: z.string().optional(),
    // Certificates belong to a factory, not to a growing area / crop
    factoryId: z.string().min(1, REQUIRED),
    scopeDescription: z.string().trim().optional(),
    files: z.array(z.string()).min(1, "Tải lên ít nhất 1 ảnh / file chứng nhận."),
    note: z.string().optional(),
  })
  .superRefine((c, ctx) => {
    if (c.issuedDate && c.expiryDate && c.expiryDate < c.issuedDate) {
      ctx.addIssue({ code: "custom", path: ["expiryDate"], message: "Ngày hết hạn phải sau ngày cấp." });
    }
  });

export type CertificateFormValues = z.infer<typeof certificateSchema>;

export const EMPTY_CERTIFICATE: CertificateFormValues = {
  type: "",
  standardName: "",
  number: "",
  issuer: "",
  issuedDate: "",
  expiryDate: "",
  factoryId: "",
  scopeDescription: "",
  files: [],
  note: "",
};
