export type AuthProvider = string;

export interface ReferrerSummary {
  userId: number;
  fullName: string;
  phoneNumber: string;
}

/** GET /api/me/profile (same endpoint as MEVI Farms) */
export interface CurrentUser {
  id: number;
  username: string;
  email?: string;
  fullName: string;
  phoneNumber: string;
  referrer?: ReferrerSummary;
  /** Same fields eco-shared-ui reads for menu RBAC */
  roles?: string[];
  role?: string | string[];
}
