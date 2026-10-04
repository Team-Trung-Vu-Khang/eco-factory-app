/** Chứng nhận MASTER dùng chung mọi workspace — /api/master-data/certificates */

export interface MasterRef {
  id: number;
  code: string;
  name: string;
}

export interface CertificateIssuer extends MasterRef {
  phone?: string | null;
  email?: string | null;
  website?: string | null;
  address?: string | null;
  description?: string | null;
  status?: "active" | "inactive" | "archived";
  createdAt?: string;
  updatedAt?: string;
}

export interface MasterCertificate {
  id: number;
  source: "OWNER" | (string & {});
  code: string;
  name: string;
  agricultureCertificate?: MasterRef | null;
  issuer?: CertificateIssuer | null;
  standardType?: string | null;
  organization?: string | null;
  issuedDate?: string | null;
  expiryDate?: string | null;
  targetType?: "workspace" | (string & {});
  targetRegions?: MasterRef[];
  status?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface MasterCertificateListParams {
  page: number;
  size: number;
  keyword?: string;
  status?: string;
}
