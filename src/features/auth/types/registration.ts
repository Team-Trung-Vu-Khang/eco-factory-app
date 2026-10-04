type Gender = "MALE" | "FEMALE" | "OTHER";

/** POST /api/registrations — đăng ký tài khoản (public) */
export type AudienceType = "individual" | "cooperative" | "business" | "other";

/** Chứng nhận mới trong hồ sơ đăng ký — không gửi id, không gửi imageUrl */
export interface RegistrationCertificateInput {
  /** Bắt buộc, ≤255 */
  certificateType: string;
  /** ≤120 */
  certificateNumber?: string;
  /** YYYY-MM-DD */
  issuedDate?: string;
  /** YYYY-MM-DD, không trước issuedDate */
  expiryDate?: string;
  /** ≤255 */
  issuer?: string;
  /** ≤1000 */
  scopeDescription?: string;
}

/** Hồ sơ nhà máy tùy chọn — chỉ `name` bắt buộc */
export interface RegistrationFactoryProfileInput {
  /** ≤255 */
  name: string;
  /** ID danh mục /api/master-data/organization-types đang hoạt động */
  organizationTypeId?: number;
  /** ≤80 */
  taxCode?: string;
  /** 1800..năm hiện tại */
  foundedYear?: number;
  /** Bỏ trống → dùng fullName tài khoản */
  representativeName?: string;
  representativeGender?: Gender;
  /** ≤32. Bỏ trống → dùng phoneNumber tài khoản */
  representativePhone?: string;
  /** Bỏ trống → dùng email tài khoản */
  representativeEmail?: string;
  address?: string;
  /** Tên tỉnh, không phải ID */
  province?: string;
  /** Tên xã, không phải ID */
  ward?: string;
  /** −90..90 */
  latitude?: number;
  /** −180..180 */
  longitude?: number;
  /** Tối đa 100 */
  productGroupIds?: number[];
  /** Tối đa 100 */
  processingServiceIds?: number[];
  /** ≤4000 */
  description?: string;
  /** Bỏ trống → suy ra từ certificates. false không đi kèm danh sách có dữ liệu */
  hasCertificates?: boolean;
  certificates?: RegistrationCertificateInput[];
  /** 0..100, client tính */
  completenessPercent?: number;
}

export interface RegistrationRequest {
  fullName: string;
  phoneNumber: string;
  audienceType: AudienceType;
  password?: string;
  birthYear?: number;
  /** ≤255, bỏ trống lưu null */
  email?: string | null;
  /** Form nhà máy luôn gửi "factory", kể cả khi bỏ qua hồ sơ */
  registrationTarget?: "factory" | null;
  /** Chỉ nhận khi registrationTarget = "factory"; bỏ qua → chưa tạo hồ sơ */
  factoryProfile?: RegistrationFactoryProfileInput | null;
  /** Địa bàn / người giới thiệu theo contract hiện có */
  [extra: string]: unknown;
}

/** POST /api/registrations/phone-availability */
export interface PhoneAvailabilityResponse {
  phoneNumber: string;
  exists: boolean;
}

/**
 * Response giữ các trường hiện có + `email`. Không có workspace/profile ID —
 * provisioning (workspace → MEVI_FACTORY_MEMBER → hồ sơ PENDING_REVIEW) chạy nền.
 */
export interface RegistrationResponse {
  fullName: string;
  phoneNumber: string;
  audienceType: AudienceType;
  email?: string | null;
  [extra: string]: unknown;
}
