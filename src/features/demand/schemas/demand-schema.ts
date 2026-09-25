import { z } from "zod";

const REQUIRED = "Trường này là bắt buộc.";
const PHONE = /^(0|\+84)(3|5|7|8|9)\d{8}$/;

export const demandSchema = z
  .object({
    requester: z.object({
      fullName: z.string().trim().min(1, REQUIRED),
      gender: z.string().min(1, REQUIRED),
      organizationName: z.string().trim().min(1, REQUIRED),
      phone: z.string().trim().min(1, REQUIRED).regex(PHONE, "Số điện thoại không hợp lệ."),
      provinceCode: z.string().min(1, REQUIRED),
    }),
    hasDemand: z.boolean(),

    demandTypeId: z.string().optional(),
    productGroupId: z.string().min(1, REQUIRED),
    productName: z.string().trim().min(1, REQUIRED),
    materialCondition: z.string().optional(),
    quantity: z.number({ error: REQUIRED }).positive("Phải lớn hơn 0."),
    quantityUnit: z.string().min(1, REQUIRED),
    services: z.array(z.string()).min(1, "Chọn ít nhất 1 dịch vụ."),
    technicalRequirements: z.string().trim().optional(),
    packagingRequirements: z.string().trim().optional(),
    requiredCertifications: z.array(z.string()),

    neededFrom: z.string().min(1, REQUIRED),
    neededTo: z.string().optional(),
    materialLocation: z.object({
      provinceCode: z.string().min(1, REQUIRED),
      wardCode: z.string().min(1, REQUIRED),
      address: z.string().trim().min(1, REQUIRED),
      latitude: z.number().optional(),
      longitude: z.number().optional(),
    }),
    searchScope: z.string().min(1, REQUIRED),
    materialPhotos: z.array(z.string()),
    note: z.string().trim().optional(),
    status: z.string().min(1, REQUIRED),
  })
  .superRefine((d, ctx) => {
    if (d.neededTo && d.neededFrom && d.neededTo < d.neededFrom) {
      ctx.addIssue({ code: "custom", path: ["neededTo"], message: "Phải sau ngày bắt đầu." });
    }
  });

export type DemandFormValues = z.infer<typeof demandSchema>;

export const EMPTY_DEMAND: DemandFormValues = {
  requester: { fullName: "", gender: "", organizationName: "", phone: "", provinceCode: "" },
  hasDemand: true,
  demandTypeId: "",
  productGroupId: "",
  productName: "",
  materialCondition: "",
  quantity: undefined as unknown as number,
  quantityUnit: "",
  services: [],
  technicalRequirements: "",
  packagingRequirements: "",
  requiredCertifications: [],
  neededFrom: "",
  neededTo: "",
  materialLocation: { provinceCode: "", wardCode: "", address: "", latitude: undefined, longitude: undefined },
  searchScope: "SAME_PROVINCE",
  materialPhotos: [],
  note: "",
  // New demands start as DRAFT; status is only editable afterwards
  status: "DRAFT",
};
