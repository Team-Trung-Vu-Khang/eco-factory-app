import { z } from "zod";

const REQUIRED = "Trường này là bắt buộc.";

export const packagingSchema = z.object({
  id: z.string().optional(),
  name: z.string().trim().min(1, REQUIRED),
  netWeight: z.number({ error: REQUIRED }).positive("Phải lớn hơn 0."),
  weightUnit: z.string().min(1, REQUIRED),
  price: z.number().min(0, "Không được âm.").optional(),
});

export const productSchema = z
  .object({
    images: z.array(z.string()).min(1, "Tải lên ít nhất 1 ảnh sản phẩm."),
    name: z.string().trim().min(1, REQUIRED),
    sku: z.string().trim().optional(),
    productGroupId: z.string().min(1, REQUIRED),
    status: z.string().min(1, REQUIRED),
    description: z.string().trim().optional(),

    rawMaterials: z.string().trim().min(1, REQUIRED),
    processingServices: z.array(z.string()).min(1, "Chọn ít nhất 1 công đoạn."),
    packagings: z.array(packagingSchema).min(1, "Khai báo ít nhất 1 quy cách đóng gói."),
    shelfLifeValue: z.number().positive("Phải lớn hơn 0.").optional(),
    shelfLifeUnit: z.string().optional(),
    storageConditions: z.string().trim().optional(),

    outputCapacity: z.number().positive("Phải lớn hơn 0.").optional(),
    outputUnit: z.string().optional(),
    certificateIds: z.array(z.string()),
    isNewlyDeveloped: z.boolean(),
    launchedAt: z.string().optional(),
  })
  .superRefine((p, ctx) => {
    if (p.shelfLifeValue !== undefined && !p.shelfLifeUnit) {
      ctx.addIssue({ code: "custom", path: ["shelfLifeUnit"], message: "Chọn đơn vị." });
    }
    if (p.outputCapacity !== undefined && !p.outputUnit) {
      ctx.addIssue({ code: "custom", path: ["outputUnit"], message: "Chọn đơn vị." });
    }
    if (p.isNewlyDeveloped && !p.launchedAt) {
      ctx.addIssue({ code: "custom", path: ["launchedAt"], message: "Nhập ngày ra mắt cho sản phẩm mới." });
    }
  });

export type ProductFormValues = z.infer<typeof productSchema>;
export type PackagingFormValues = z.infer<typeof packagingSchema>;

export const EMPTY_PACKAGING: PackagingFormValues = {
  name: "",
  netWeight: undefined as unknown as number,
  weightUnit: "",
  price: undefined,
};

export const EMPTY_PRODUCT: ProductFormValues = {
  images: [],
  name: "",
  sku: "",
  productGroupId: "",
  // New products start active; status is only editable afterwards
  status: "ACTIVE",
  description: "",
  rawMaterials: "",
  processingServices: [],
  packagings: [],
  shelfLifeValue: undefined,
  shelfLifeUnit: "",
  storageConditions: "",
  outputCapacity: undefined,
  outputUnit: "",
  certificateIds: [],
  isNewlyDeveloped: false,
  launchedAt: "",
};
