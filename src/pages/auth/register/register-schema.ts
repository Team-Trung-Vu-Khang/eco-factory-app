import { z } from "zod";
import type {
  AudienceType,
  RegistrationRequest,
} from "@/features/auth/types/registration";
import { calculateCompletenessPercent } from "@/features/factory/utils/profile-calculator";

const REQUIRED = "Trường này là bắt buộc.";
const max = (n: number) => `Tối đa ${n} ký tự.`;
const optionalText = (n: number) => z.string().trim().max(n, max(n));
const optionalEmail = z.union([
  z.literal(""),
  z.string().trim().max(255, max(255)).email("Email không hợp lệ."),
]);
export const PHONE_REGEX = /^0\d{9}$/;
const CURRENT_YEAR = new Date().getFullYear();

export const AUDIENCE_TYPE_OPTIONS: { value: AudienceType; label: string }[] = [
  { value: "business", label: "Doanh nghiệp" },
  { value: "cooperative", label: "Hợp tác xã" },
  { value: "individual", label: "Cá nhân / hộ kinh doanh" },
  { value: "other", label: "Khác" },
];

export const GENDER_OPTIONS = [
  { value: "MALE", label: "Nam" },
  { value: "FEMALE", label: "Nữ" },
  { value: "OTHER", label: "Khác" },
];

const certificateSchema = z
  .object({
    certificateType: z.string().trim().min(1, REQUIRED).max(255, max(255)),
    certificateNumber: optionalText(120),
    issuer: optionalText(255),
    issuedDate: z.string(),
    expiryDate: z.string(),
    scopeDescription: optionalText(1000),
  })
  .superRefine((c, ctx) => {
    if (c.issuedDate && c.expiryDate && c.expiryDate < c.issuedDate)
      ctx.addIssue({
        code: "custom",
        path: ["expiryDate"],
        message: "Ngày hết hạn không được trước ngày cấp.",
      });
  });

const profileSchema = z.object({
  name: optionalText(255),
  organizationTypeId: z.string(),
  taxCode: optionalText(80),
  foundedYear: z
    .number()
    .int("Năm không hợp lệ.")
    .min(1800, "Năm từ 1800 trở đi.")
    .max(CURRENT_YEAR, `Năm không vượt quá ${CURRENT_YEAR}.`)
    .optional(),
  representativeName: optionalText(255),
  representativeGender: z.string(),
  representativePhone: optionalText(32),
  representativeEmail: optionalEmail,
  province: optionalText(255),
  ward: optionalText(255),
  address: optionalText(255),
  productGroupIds: z.array(z.string()).max(100, "Tối đa 100 mục."),
  processingServiceIds: z.array(z.string()).max(100, "Tối đa 100 mục."),
  description: optionalText(4000),
  hasCertificates: z.boolean(),
  certificates: z.array(certificateSchema),
});

export const registerSchema = z
  .object({
    fullName: z.string().trim().min(1, REQUIRED).max(255, max(255)),
    phone: z.string().trim().regex(PHONE_REGEX, "Số điện thoại không hợp lệ."),
    email: optionalEmail,
    audienceType: z.enum(["business", "cooperative", "individual", "other"]),
    password: z.string().min(8, "Mật khẩu tối thiểu 8 ký tự."),
    confirmPassword: z.string(),
    withProfile: z.boolean(),
    profile: profileSchema,
  })
  .superRefine((v, ctx) => {
    if (v.confirmPassword !== v.password)
      ctx.addIssue({
        code: "custom",
        path: ["confirmPassword"],
        message: "Mật khẩu nhập lại không khớp.",
      });
    if (v.withProfile && !v.profile.name)
      ctx.addIssue({
        code: "custom",
        path: ["profile", "name"],
        message: "Nhập tên nhà máy hoặc tắt phần thông tin nhà máy.",
      });
  });

export type RegisterValues = z.infer<typeof registerSchema>;
export type RegisterCertificateValues = RegisterValues["profile"]["certificates"][number];

export const EMPTY_CERTIFICATE: RegisterCertificateValues = {
  certificateType: "",
  certificateNumber: "",
  issuer: "",
  issuedDate: "",
  expiryDate: "",
  scopeDescription: "",
};

export const EMPTY_REGISTER: RegisterValues = {
  fullName: "",
  phone: "",
  email: "",
  audienceType: "business",
  password: "",
  confirmPassword: "",
  withProfile: false,
  profile: {
    name: "",
    organizationTypeId: "",
    taxCode: "",
    foundedYear: undefined,
    representativeName: "",
    representativeGender: "",
    representativePhone: "",
    representativeEmail: "",
    province: "",
    ward: "",
    address: "",
    productGroupIds: [],
    processingServiceIds: [],
    description: "",
    hasCertificates: false,
    certificates: [],
  },
};

const orUndef = (s: string) => s.trim() || undefined;
const toIds = (ids: string[]) =>
  ids.map(Number).filter((id) => Number.isFinite(id));

/** Form → POST /api/registrations. Factory form always sends registrationTarget. */
export function toRegistrationRequest(v: RegisterValues): RegistrationRequest {
  const base: RegistrationRequest = {
    fullName: v.fullName.trim(),
    phoneNumber: v.phone.trim(),
    audienceType: v.audienceType,
    password: v.password,
    email: v.email.trim() || null,
    registrationTarget: "factory",
  };
  if (!v.withProfile) return base;

  const p = v.profile;
  const certificates = p.hasCertificates
    ? p.certificates.map((c) => ({
        certificateType: c.certificateType.trim(),
        certificateNumber: orUndef(c.certificateNumber),
        issuer: orUndef(c.issuer),
        issuedDate: c.issuedDate || undefined,
        expiryDate: c.expiryDate || undefined,
        scopeDescription: orUndef(c.scopeDescription),
      }))
    : [];
  const profile = {
    name: p.name.trim(),
    organizationTypeId: p.organizationTypeId
      ? Number(p.organizationTypeId)
      : undefined,
    taxCode: orUndef(p.taxCode),
    foundedYear: p.foundedYear,
    representativeName: orUndef(p.representativeName),
    representativeGender: (p.representativeGender || undefined) as
      | "MALE"
      | "FEMALE"
      | "OTHER"
      | undefined,
    representativePhone: orUndef(p.representativePhone),
    representativeEmail: orUndef(p.representativeEmail),
    province: orUndef(p.province),
    ward: orUndef(p.ward),
    address: orUndef(p.address),
    productGroupIds: toIds(p.productGroupIds),
    processingServiceIds: toIds(p.processingServiceIds),
    description: orUndef(p.description),
    hasCertificates: p.hasCertificates,
    certificates,
  };
  return {
    ...base,
    factoryProfile: {
      ...profile,
      completenessPercent: calculateCompletenessPercent(profile),
    },
  };
}

/** BE fieldErrors path → form path (null = no matching field) */
export function toFormPath(apiPath: string): string | null {
  if (apiPath === "phoneNumber") return "phone";
  if (["fullName", "email", "audienceType", "password"].includes(apiPath))
    return apiPath;
  if (apiPath.startsWith("factoryProfile."))
    return (
      "profile." +
      apiPath
        .slice("factoryProfile.".length)
        .replace(/\[(\d+)\]/g, ".$1")
    );
  return null;
}
