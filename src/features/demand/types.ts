import type { CertificationType, Gender, ProcessingService } from "@/features/factory";
import type { DemandStatus, MaterialCondition, QuantityUnit, SearchScope } from "./constants";

export interface Requester {
  fullName: string;
  gender: Gender;
  organizationName: string;
  phone: string;
  provinceCode: string;
}

export interface MaterialLocation {
  provinceCode: string;
  wardCode: string;
  address: string;
  latitude?: number;
  longitude?: number;
}

export interface DemandKpi {
  isProfileComplete: boolean;
  hasConfirmedDemand: boolean;
  hasViewedFactory: boolean;
  hasFactoryResponse: boolean;
}

export interface Demand {
  id: string;
  requester: Requester;
  hasDemand: boolean;
  demandTypeId?: string;
  productGroupId: string;
  productName: string;
  materialCondition?: MaterialCondition;
  quantity: number;
  quantityUnit: QuantityUnit;
  services: ProcessingService[];
  technicalRequirements?: string;
  packagingRequirements?: string;
  requiredCertifications: CertificationType[];
  neededFrom: string;
  neededTo?: string;
  materialLocation: MaterialLocation;
  searchScope: SearchScope;
  materialPhotos: string[];
  note?: string;
  status: DemandStatus;
  // System-computed (read only)
  viewedFactoryCount: number;
  sentFactoryCount: number;
  respondedFactoryCount: number;
  kpi: DemandKpi;
  createdAt: string;
  updatedAt: string;
}

export interface DemandListParams {
  page: number;
  size: number;
  keyword?: string;
  status?: string;
  productGroupId?: string;
  provinceCode?: string;
}

export interface DemandSummary {
  total: number;
  open: number;
  connected: number;
  /** Female requesters who viewed ≥ 1 factory (KQ2 reach indicator) */
  femaleReached: number;
}
