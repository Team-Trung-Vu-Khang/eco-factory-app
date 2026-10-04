import type {
  MachineCapacityUnit,
  ProcessingServiceRef,
  ProductGroupRef,
  FactoryProfileRef,
} from "@/features/machine";
import type { ConnectionStatus } from "./constants";

export interface MarketplaceProfileRef {
  id: number;
  code?: string;
  name: string;
  logoUrl?: string | null;
  address?: string;
  province?: string;
  ward?: string;
  latitude?: number | null;
  longitude?: number | null;
  representativeName?: string;
  representativePhone?: string;
}

export interface MarketplaceMachineRef {
  id: number;
  code?: string;
  name: string;
  processingServices?: ProcessingServiceRef[];
  productGroups?: ProductGroupRef[];
}

export interface MarketplaceScheduleItem {
  id: number;
  title: string;
  profile: MarketplaceProfileRef;
  machine: MarketplaceMachineRef;
  startDate: string;
  endDate: string;
  maxCapacity: number;
  capacityUnit: MachineCapacityUnit;
  maxCapacityKgPerMonth?: number;
  note?: string | null;
  createdAt: string;
  myConnectionRequest?: {
    id: number;
    status: ConnectionStatus;
  } | null;
}

export interface MarketplaceCertificateItem {
  id: number;
  certificateType: string;
  certificateNumber: string;
  issuer?: string;
  issuedDate?: string;
  expiryDate?: string;
  scopeDescription?: string | null;
  status: "ACTIVE" | "EXPIRING_SOON" | string;
}

export interface MarketplaceImageItem {
  id: number;
  fileUrl: string;
  fileName: string;
  mimeType: string;
  sizeBytes?: number;
}

export interface MarketplaceProfileDetail {
  id: number;
  code: string;
  logoUrl?: string | null;
  name: string;
  organizationType?: { id: number; code: string; name: string };
  reviewStatus: "APPROVED" | string;
  taxCode?: string;
  foundedYear?: number;
  representativeName?: string;
  representativeGender?: string;
  representativePhone?: string;
  address?: string;
  province?: string;
  ward?: string;
  latitude?: number | null;
  longitude?: number | null;
  description?: string;
  productGroups?: ProductGroupRef[];
  processingServices?: ProcessingServiceRef[];
  machineCount?: number;
  activeMachineCount?: number;
  certificateCount?: number;
  certificates?: MarketplaceCertificateItem[];
  images?: MarketplaceImageItem[];
}

export interface FactorySearchParams {
  /** Lọc tin đăng của một nhà máy (tab "Tin đăng" trên hồ sơ) */
  profileId?: number;
  keyword?: string;
  province?: string;
  ward?: string;
  processingServiceIds?: number[];
  crops?: string[];
  maxCapacity?: number;
  capacityUnit?: MachineCapacityUnit;
  certificateTypes?: string[];
  page?: number;
  size?: number;
  // Extra criteria stored in session to prefill connection requests
  materialCondition?: string;
  packagingRequirement?: string;
  technicalRequirement?: string;
  message?: string;
}

export interface ConnectionRequestItem {
  id: number;
  code?: string;
  scheduleId: number;
  schedule?: {
    id: number;
    title: string;
    startDate: string;
    endDate: string;
    maxCapacity: number;
    capacityUnit: MachineCapacityUnit;
    status: string;
    machine?: { id: number; code?: string; name: string };
  };
  profile?: FactoryProfileRef;
  factoryWorkspaceId?: number;
  contactName?: string | null;
  contactPhone?: string | null;
  crops?: string[];
  processingServices?: ProcessingServiceRef[];
  maxCapacity?: number;
  capacityUnit?: MachineCapacityUnit;
  maxCapacityKgPerMonth?: number;
  materialCondition?: string | null;
  packagingRequirement?: string | null;
  technicalRequirement?: string | null;
  message?: string | null;
  status: ConnectionStatus;
  requestedAt?: string;
  requestedByUserId?: number;
  requesterProfile?: {
    province?: string | null;
    commune?: string | null;
    operatingArea?: string | null;
  } | null;
  respondedAt?: string | null;
  respondedByUserId?: number | null;
  rejectReason?: string | null;
  resultNote?: string | null;
  cancelledAt?: string | null;
  cancelledByUserId?: number | null;
  createdAt: string;
  updatedAt?: string;
}

export type ConnectionRequest = ConnectionRequestItem;

export interface CreateConnectionRequestInput {
  scheduleId: number;
  crops?: string[];
  processingServiceIds?: number[];
  maxCapacity?: number;
  capacityUnit?: MachineCapacityUnit;
  materialCondition?: string | null;
  packagingRequirement?: string | null;
  technicalRequirement?: string | null;
  message?: string | null;
}

export interface ConnectionListParams {
  page: number;
  size: number;
  keyword?: string;
  status?: string;
  scheduleId?: number;
  profileId?: number;
  requestedByUserId?: number;
  sort?: "REQUESTED_AT" | "RESPONDED_AT" | string;
}
