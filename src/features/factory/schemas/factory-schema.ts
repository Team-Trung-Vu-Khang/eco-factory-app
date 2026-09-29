import { z } from "zod";
import type { FactoryProfile, FactoryProfileSubmitInput } from "../types";
import {
  calculateCompletenessPercent,
  calculateProgram300Eligible,
} from "../utils/profile-calculator";

const REQUIRED = "Trường này là bắt buộc.";
const PHONE_REGEX = /^(0|\+84)\d{9,10}$/;

const optionalNumber = z.number().nullish();

// Processing windows are posted separately as "Lịch nhận chế biến" (processing-schedule)
export const machineSchema = z.object({
  id: z.string().optional(),
  name: z.string().trim().min(1, REQUIRED),
  functions: z.array(z.string()).min(1, "Chọn ít nhất 1 dịch vụ."),
  productGroupIds: z.array(z.string()).min(1, "Chọn ít nhất 1 loại nông sản."),
  maxCapacity: z.number().positive("Phải lớn hơn 0."),
  capacityUnit: z.string().min(1, REQUIRED),
  status: z.string().min(1, REQUIRED),
  certificateIds: z.array(z.string()).optional(),
});

export const profileCertificateSchema = z
  .object({
    id: z.union([z.number(), z.string()]).optional(),
    certificateType: z.string().trim().min(1, "Loại chứng nhận là bắt buộc."),
    certificateNumber: z.string().trim().optional().or(z.literal("")),
    issuedDate: z.string().optional().or(z.literal("")),
    expiryDate: z.string().optional().or(z.literal("")),
    issuer: z.string().trim().optional().or(z.literal("")),
    scopeDescription: z.string().trim().optional().or(z.literal("")),
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

export const profileImageSchema = z.object({
  id: z.union([z.number(), z.string()]).optional(),
  fileUrl: z.string().min(1, "URL ảnh là bắt buộc."),
  fileName: z.string().optional(),
  mimeType: z.string().min(1, "Mime type là bắt buộc."),
  sizeBytes: z.number().optional(),
});

export const factoryFormSchema = z
  .object({
    // Bước 1: Thông tin chung & Đại diện
    logoUrl: z.string().optional(),
    name: z.string().trim().min(1, REQUIRED),
    organizationTypeId: z
      .union([z.string(), z.number()])
      .refine((v) => v !== "" && v !== undefined && v !== null, REQUIRED),
    taxCode: z.string().trim().optional(),
    foundedYear: optionalNumber.refine(
      (y) =>
        y === undefined ||
        y === null ||
        (y >= 1800 && y <= new Date().getFullYear()),
      "Năm không hợp lệ.",
    ),
    representativeName: z.string().trim().min(1, REQUIRED),
    representativeGender: z.enum(["MALE", "FEMALE", "OTHER"]),
    representativePhone: z

      .string()
      .trim()
      .regex(PHONE_REGEX, "Số điện thoại không hợp lệ."),
    representativeEmail: z
      .union([z.literal(""), z.string().trim().email("Email không hợp lệ.")])
      .optional(),

    // Bước 2: Địa điểm
    address: z.string().trim().min(1, REQUIRED),
    province: z.string().trim().min(1, REQUIRED),
    ward: z.string().trim().min(1, REQUIRED),
    latitude: optionalNumber.refine(
      (v) => v === undefined || v === null || (v >= -90 && v <= 90),
      "Vĩ độ không hợp lệ.",
    ),
    longitude: optionalNumber.refine(
      (v) => v === undefined || v === null || (v >= -180 && v <= 180),
      "Kinh độ không hợp lệ.",
    ),

    // Bước 3: Hoạt động
    productGroupIds: z
      .array(z.union([z.string(), z.number()]))
      .min(1, "Chọn ít nhất 1 nhóm nông sản."),
    processingServiceIds: z
      .array(z.union([z.string(), z.number()]))
      .min(1, "Chọn ít nhất 1 dịch vụ."),
    description: z
      .string()
      .trim()
      .min(1, REQUIRED)
      .max(4000, "Tối đa 4000 ký tự."),

    // Bước 4: Chứng nhận & Ảnh máy móc
    hasCertificates: z.boolean(),
    certificates: z.array(profileCertificateSchema),
    images: z.array(profileImageSchema).max(10, "Tối đa 10 ảnh."),
  })
  .superRefine((f, ctx) => {
    if (f.hasCertificates && f.certificates.length === 0) {
      ctx.addIssue({
        code: "custom",
        path: ["certificates"],
        message: "Khai báo ít nhất 1 chứng nhận khi cơ sở có chứng nhận.",
      });
    }
  });

export type FactoryProfileFormValues = z.infer<typeof factoryFormSchema>;
export type FactoryFormValues = FactoryProfileFormValues;
export type MachineFormValues = z.infer<typeof machineSchema>;

export const EMPTY_MACHINE: MachineFormValues = {
  name: "",
  functions: [],
  productGroupIds: [],
  maxCapacity: 0,
  capacityUnit: "KG_PER_DAY",
  status: "ACTIVE",
  certificateIds: [],
};

export const EMPTY_FACTORY_PROFILE: FactoryProfileFormValues = {
  logoUrl: "",
  name: "",
  organizationTypeId: "",
  taxCode: "",
  foundedYear: undefined,
  representativeName: "",
  representativeGender: "MALE",
  representativePhone: "",
  representativeEmail: "",
  address: "",
  province: "",
  ward: "",
  latitude: undefined,
  longitude: undefined,
  productGroupIds: [],
  processingServiceIds: [],
  description: "",
  hasCertificates: false,
  certificates: [],
  images: [],
};

export const EMPTY_FACTORY = EMPTY_FACTORY_PROFILE;

export function toFactoryProfileSubmitInput(
  values: FactoryProfileFormValues,
): FactoryProfileSubmitInput {
  const orgId = Number(values.organizationTypeId);
  const pGroupIds = values.productGroupIds
    .map((id) => Number(id))
    .filter((id) => !isNaN(id));
  const pServiceIds = values.processingServiceIds
    .map((id) => Number(id))
    .filter((id) => !isNaN(id));

  const certs = values.hasCertificates
    ? values.certificates.map((c) => ({
        id: c.id !== undefined && c.id !== "" ? Number(c.id) : undefined,
        certificateType: c.certificateType.trim(),
        certificateNumber: c.certificateNumber?.trim() || undefined,
        issuedDate: c.issuedDate || undefined,
        expiryDate: c.expiryDate || undefined,
        issuer: c.issuer?.trim() || undefined,
        scopeDescription: c.scopeDescription?.trim() || undefined,
      }))
    : [];

  const imgs = (values.images ?? []).map((img) => ({
    id: img.id !== undefined && img.id !== "" ? Number(img.id) : undefined,
    fileUrl: img.fileUrl,
    fileName: img.fileName,
    mimeType: img.mimeType,
    sizeBytes: img.sizeBytes,
  }));

  const partialPayload = {
    logoUrl: values.logoUrl || undefined,
    name: values.name.trim(),
    organizationTypeId: orgId,
    taxCode: values.taxCode?.trim() || undefined,
    foundedYear: values.foundedYear ?? undefined,
    representativeName: values.representativeName.trim(),
    representativeGender: values.representativeGender,
    representativePhone: values.representativePhone.trim(),
    representativeEmail: values.representativeEmail?.trim() || undefined,
    address: values.address.trim(),
    province: values.province.trim(),
    ward: values.ward.trim(),
    latitude: values.latitude ?? undefined,
    longitude: values.longitude ?? undefined,
    productGroupIds: pGroupIds,
    processingServiceIds: pServiceIds,
    description: values.description.trim(),
    hasCertificates: values.hasCertificates,
    certificates: certs,
    images: imgs,
  };

  const completenessPercent = calculateCompletenessPercent(partialPayload);
  const program300Eligible = calculateProgram300Eligible(partialPayload);

  return {
    ...partialPayload,
    completenessPercent,
    program300Eligible,
  };
}

export function fromFactoryProfileToFormValues(
  profile?: FactoryProfile | null,
): FactoryProfileFormValues {
  if (!profile) return EMPTY_FACTORY_PROFILE;

  return {
    logoUrl: profile.logoUrl ?? "",
    name: profile.name ?? "",
    organizationTypeId:
      profile.organizationType?.id !== undefined
        ? String(profile.organizationType.id)
        : profile.organizationTypeId !== undefined
          ? String(profile.organizationTypeId)
          : "",
    taxCode: profile.taxCode ?? "",
    foundedYear: profile.foundedYear ?? undefined,
    representativeName: profile.representativeName ?? "",
    representativeGender: profile.representativeGender ?? "MALE",
    representativePhone: profile.representativePhone ?? "",
    representativeEmail: profile.representativeEmail ?? "",
    address: profile.address ?? "",
    province: profile.province ?? "",
    ward: profile.ward ?? "",
    latitude: profile.latitude ?? undefined,
    longitude: profile.longitude ?? undefined,
    productGroupIds: (profile.productGroups ?? []).map((g) => String(g.id)),
    processingServiceIds: (profile.processingServices ?? []).map((s) =>
      String(s.id),
    ),
    description: profile.description ?? "",
    hasCertificates: !!profile.hasCertificates,
    certificates: (profile.certificates ?? []).map((c) => ({
      id: c.id,
      certificateType: c.certificateType ?? "",
      certificateNumber: c.certificateNumber ?? "",
      issuedDate: c.issuedDate ?? "",
      expiryDate: c.expiryDate ?? "",
      issuer: c.issuer ?? "",
      scopeDescription: c.scopeDescription ?? "",
    })),
    images: (profile.images ?? []).map((img) => ({
      id: img.id,
      fileUrl: img.fileUrl,
      fileName: img.fileName,
      mimeType: img.mimeType,
      sizeBytes: img.sizeBytes,
    })),
  };
}
