import { z } from "zod";

const REQUIRED = "Trường này là bắt buộc.";
const PHONE_REGEX = /^(0|\+84)\d{9,10}$/;

const optionalNumber = z.number().optional();

export const machineSchema = z
  .object({
    id: z.string().optional(),
    name: z.string().trim().min(1, REQUIRED),
    functions: z.array(z.string()).min(1, "Chọn ít nhất 1 chức năng."),
    productGroupIds: z.array(z.string()).min(1, "Chọn ít nhất 1 loại nông sản."),
    maxCapacity: z.number({ error: REQUIRED }).positive("Phải lớn hơn 0."),
    capacityUnit: z.string().min(1, REQUIRED),
    availableCapacity: z.number({ error: REQUIRED }).min(0, "Không được âm."),
    availableFrom: z.string().optional(),
    availableTo: z.string().optional(),
    status: z.string().min(1, REQUIRED),
  })
  .superRefine((m, ctx) => {
    if (m.availableCapacity > m.maxCapacity) {
      ctx.addIssue({
        code: "custom",
        path: ["availableCapacity"],
        message: "Không được lớn hơn công suất tối đa.",
      });
    }
    if (m.availableFrom && m.availableTo && m.availableTo < m.availableFrom) {
      ctx.addIssue({
        code: "custom",
        path: ["availableTo"],
        message: "Ngày kết thúc phải sau ngày bắt đầu.",
      });
    }
  });

export const certificationSchema = z
  .object({
    id: z.string().optional(),
    type: z.string().min(1, REQUIRED),
    number: z.string().optional(),
    issuedDate: z.string().optional(),
    expiryDate: z.string().optional(),
    issuer: z.string().optional(),
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

export const factorySchema = z
  .object({
    // Thông tin cơ bản
    name: z.string().trim().min(1, REQUIRED),
    organizationType: z.string().min(1, REQUIRED),
    taxCode: z.string().trim().optional(),
    foundedYear: optionalNumber.refine(
      (y) => y === undefined || (y >= 1900 && y <= new Date().getFullYear()),
      "Năm không hợp lệ.",
    ),

    // Người đại diện
    representative: z.object({
      fullName: z.string().trim().min(1, REQUIRED),
      gender: z.string().min(1, REQUIRED),
      phone: z.string().trim().regex(PHONE_REGEX, "Số điện thoại không hợp lệ."),
      email: z.union([z.literal(""), z.email("Email không hợp lệ.")]).optional(),
    }),

    // Địa điểm
    location: z.object({
      provinceCode: z.string().min(1, REQUIRED),
      wardCode: z.string().min(1, REQUIRED),
      address: z.string().trim().min(1, REQUIRED),
      latitude: optionalNumber.refine((v) => v === undefined || (v >= -90 && v <= 90), "Vĩ độ không hợp lệ."),
      longitude: optionalNumber.refine((v) => v === undefined || (v >= -180 && v <= 180), "Kinh độ không hợp lệ."),
    }),

    // Thông tin hoạt động
    productGroupIds: z.array(z.string()).min(1, "Chọn ít nhất 1 nhóm nông sản."),
    services: z.array(z.string()).min(1, "Chọn ít nhất 1 dịch vụ."),
    description: z.string().trim().min(1, REQUIRED),

    // Máy móc & công suất
    offersExternalCapacity: z.boolean(),
    machines: z.array(machineSchema),

    // Chứng nhận
    hasCertification: z.boolean(),
    certifications: z.array(certificationSchema),

    // Hình ảnh (URL sau khi upload qua /api/storage/files)
    avatarUrl: z.string().optional(),
    facilityPhotos: z.array(z.string()),
    machinePhotos: z.array(z.string()),
  })
  .superRefine((f, ctx) => {
    if (f.offersExternalCapacity && f.machines.length === 0) {
      ctx.addIssue({
        code: "custom",
        path: ["machines"],
        message: "Khai báo ít nhất 1 máy / dây chuyền khi có cung cấp cho bên ngoài.",
      });
    }
  });

export type FactoryFormValues = z.infer<typeof factorySchema>;
export type MachineFormValues = z.infer<typeof machineSchema>;
export type CertificationFormValues = z.infer<typeof certificationSchema>;

export const EMPTY_MACHINE: MachineFormValues = {
  name: "",
  functions: [],
  productGroupIds: [],
  maxCapacity: undefined as unknown as number,
  capacityUnit: "KG_PER_DAY",
  availableCapacity: undefined as unknown as number,
  availableFrom: "",
  availableTo: "",
  status: "ACTIVE",
};

export const EMPTY_CERTIFICATION: CertificationFormValues = {
  type: "",
  number: "",
  issuedDate: "",
  expiryDate: "",
  issuer: "",
};

export const EMPTY_FACTORY: FactoryFormValues = {
  name: "",
  organizationType: "",
  taxCode: "",
  foundedYear: undefined,
  representative: { fullName: "", gender: "", phone: "", email: "" },
  location: { provinceCode: "", wardCode: "", address: "", latitude: undefined, longitude: undefined },
  productGroupIds: [],
  services: [],
  description: "",
  offersExternalCapacity: false,
  machines: [],
  hasCertification: false,
  certifications: [],
  avatarUrl: "",
  facilityPhotos: [],
  machinePhotos: [],
};
