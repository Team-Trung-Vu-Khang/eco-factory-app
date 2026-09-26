import type { CertificationType } from "@/features/factory";
import type { CertificateValidity } from "./constants";

export interface Certificate {
  id: string;
  type: CertificationType;
  standardName?: string;
  number: string;
  issuer: string;
  issuedDate: string;
  expiryDate?: string;
  factoryId: string;
  scopeDescription?: string;
  files: string[];
  note?: string;
  // computed
  validity: CertificateValidity;
  daysToExpiry: number | null;
  updatedAt: string;
}

export interface CertificateListParams {
  page: number;
  size: number;
  keyword?: string;
  type?: string;
  validity?: string;
  factoryId?: string;
}

export interface CertificateSummary {
  total: number;
  valid: number;
  expiringSoon: number;
  expired: number;
}
