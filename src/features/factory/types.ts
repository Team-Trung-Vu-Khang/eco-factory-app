import type {
  CapacityUnit,
  CertificationType,
  Gender,
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
  page: number;
  size: number;
  keyword?: string;
  factoryId?: string;
  status?: string;
  function?: string;
}
