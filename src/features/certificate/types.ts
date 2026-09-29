import type { CertificateValidity } from "./constants";

export type CertificateStatus = "ACTIVE" | "EXPIRING_SOON" | "EXPIRED";

export interface FactoryCertificate {
  id: number | string;
  workspaceId: number | string;
  profileId: number | string;
  certificateType: string;
  certificateNumber?: string;
  issuedDate?: string;
  expiryDate?: string;
  issuer?: string;
  scopeDescription?: string;
  status: CertificateStatus;
  daysUntilExpiry?: number;
  displayOrder?: number;
  createdAt: string;
  updatedAt: string;
  /** Admin response includes associated factory profile summary */
  profile?: {
    id: number | string;
    code: string;
    name: string;
  };
}

/** Legacy alias for backwards compatibility */
export type Certificate = FactoryCertificate;

export interface CertificateListParams {
  page: number;
  size: number;
  keyword?: string;
  status?: CertificateStatus | CertificateValidity;
  profileId?: number | string;
  factoryId?: string;
}

export interface CertificateSummary {
  total: number;
  active: number;
  expiringSoon: number;
  expired: number;
  /** Legacy alias */
  valid?: number;
}

export interface CertificateInput {
  certificateType: string;
  certificateNumber?: string;
  issuedDate?: string;
  expiryDate?: string;
  issuer?: string;
  scopeDescription?: string;
}
