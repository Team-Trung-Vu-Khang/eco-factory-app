import type {
  CapacityUnit,
  CertificationType,
  Gender,
  FactoryApprovalStatus,
  MachineStatus,
  OrganizationType,
  ProcessingService,
} from "./constants";

export interface Machine {
  id: string;
  name: string;
  functions: ProcessingService[];
  productGroupIds: string[];
  maxCapacity: number;
  capacityUnit: CapacityUnit;
  status: MachineStatus;
  /** Factory certificates that apply to this machine / line */
  certificateIds?: string[];
  // Derived from the machine's active "Lịch nhận chế biến" (read-only)
  availableCapacity: number;
  /** Unit of availableCapacity — the schedule may use a different unit than the machine */
  availableUnit?: CapacityUnit;
  availableFrom?: string;
  availableTo?: string;
}

export interface Certification {
  id: string;
  type: CertificationType;
  number?: string;
  issuedDate?: string;
  expiryDate?: string;
  issuer?: string;
}

export interface Factory {
  id: string;
  name: string;
  organizationType: OrganizationType;
  taxCode?: string;
  foundedYear?: number;
  representative: {
    fullName: string;
    gender: Gender;
    phone: string;
    email?: string;
  };
  location: {
    provinceCode: string;
    wardCode: string;
    address: string;
    latitude?: number;
    longitude?: number;
  };
  productGroupIds: string[];
  services: ProcessingService[];
  description: string;
  offersExternalCapacity: boolean;
  machines: Machine[];
  hasCertification: boolean;
  certifications: Certification[];
  avatarUrl?: string;
  facilityPhotos: string[];
  machinePhotos: string[];

  // System fields (read-only, computed server side)
  completionPercent: number;
  isProfileComplete: boolean;
  hasAvailableCapacity: boolean;
  isKpiEligible: boolean;
  kpiEligibleAt: string | null;
  approvalStatus: FactoryApprovalStatus;
  /** Admin note when rejecting */
  reviewNote?: string;
  createdAt: string;
  updatedAt: string;
}

export interface FactoryListParams {
  page: number;
  size: number;
  keyword?: string;
  organizationType?: string;
  provinceCode?: string;
  kpiStatus?: "ELIGIBLE" | "NOT_ELIGIBLE";
  approvalStatus?: FactoryApprovalStatus;
}

export type FactoryReviewStatus = "PENDING_REVIEW" | "APPROVED" | "REJECTED";

export interface ProfileCertificateItem {
  id?: number | string;
  workspaceId?: number | string;
  profileId?: number | string;
  certificateType: string;
  certificateNumber?: string;
  issuedDate?: string;
  expiryDate?: string;
  issuer?: string;
  scopeDescription?: string;
  status?: "ACTIVE" | "EXPIRING_SOON" | "EXPIRED";
  daysUntilExpiry?: number;
  displayOrder?: number;
  createdAt?: string;
  updatedAt?: string;
}

export interface ProfileImageItem {
  id?: number | string;
  fileUrl: string;
  fileName?: string;
  mimeType: string;
  sizeBytes?: number;
}

export interface FactoryProfile {
  id: number | string;
  code: string;
  workspaceId: number | string;
  logoUrl?: string;
  name: string;
  organizationType: {
    id: number | string;
    code: string;
    name: string;
  };
  organizationTypeId?: number | string;
  taxCode?: string;
  foundedYear?: number;
  representativeName: string;
  representativeGender: Gender;
  representativePhone: string;
  representativeEmail?: string;
  address: string;
  province: string;
  ward: string;
  latitude?: number;
  longitude?: number;
  productGroups: Array<{
    id: number | string;
    code: string;
    name: string;
  }>;
  productGroupIds?: (number | string)[];
  processingServices: Array<{
    id: number | string;
    code: string;
    name: string;
  }>;
  processingServiceIds?: (number | string)[];
  description: string;
  hasCertificates: boolean;
  certificates: ProfileCertificateItem[];
  images: ProfileImageItem[];
  completenessPercent: number;
  reviewStatus: FactoryReviewStatus;
  submittedAt?: string | null;
  submittedByUserId?: number | null;
  reviewedAt?: string | null;
  reviewedByUserId?: number | null;
  reviewNote?: string | null;
  createdAt?: string;
  updatedAt?: string;
}

export interface FactoryProfileSubmitInput {
  logoUrl?: string;
  name: string;
  organizationTypeId: number;
  taxCode?: string;
  foundedYear?: number;
  representativeName: string;
  representativeGender: Gender;
  representativePhone: string;
  representativeEmail?: string;
  address: string;
  province: string;
  ward: string;
  latitude?: number;
  longitude?: number;
  productGroupIds: number[];
  processingServiceIds: number[];
  description: string;
  hasCertificates: boolean;
  certificates: Array<{
    id?: number;
    certificateType: string;
    certificateNumber?: string;
    issuedDate?: string;
    expiryDate?: string;
    issuer?: string;
    scopeDescription?: string;
  }>;
  images: Array<{
    id?: number;
    fileUrl: string;
    fileName?: string;
    mimeType: string;
    sizeBytes?: number;
  }>;
  completenessPercent: number;
}

export interface AdminFactoryProfileListParams {
  page: number;
  size: number;
  keyword?: string;
  reviewStatus?: FactoryReviewStatus;
  organizationTypeId?: number | string;
  province?: string;
  certificateType?: string;
  certificateStatus?: "ACTIVE" | "EXPIRING_SOON" | "EXPIRED";
}

export interface PageResponse<T> {
  content: T[];
  totalElements: number;
  totalPages: number;
  page: number;
  size: number;
}

export interface MachineRow extends Machine {
  factoryId: string;
  factoryName: string;
}

export interface MachineListParams {
  page?: number;
  size?: number;
  keyword?: string;
  factoryId?: string;
  status?: string;
  function?: string;
}
