import type { WorkspaceMetadata } from "@/features/workspace";

export type FactoryAccountStatus = "active" | "inactive";

export interface WorkspaceRoleItem {
  id: number;
  code?: string;
  name?: string;
  status?: string;
  roleCodes?: string[];
  metadataJson?: WorkspaceMetadata;
  factoryProfile?: {
    id: number;
    code: string;
    name: string;
    province?: string;
    ward?: string;
    reviewStatus?: string;
  } | null;
}

export interface AdminFactoryAccountItem {
  id: number;
  code?: string;
  username: string;
  fullName: string;
  phoneNumber: string;
  email?: string | null;
  operatingArea?: string | null;
  province?: string | null;
  commune?: string | null;
  birthYear?: number | null;
  audienceType?: "individual" | "cooperative" | "business" | "other" | null;
  status: FactoryAccountStatus;
  mustChangePassword?: boolean;
  roleCodes?: string[];
  workspaces?: WorkspaceRoleItem[];
  lastLoginAt?: string | null;
  createdAt?: string;
}

export interface FactoryAccountWorkspaceRoleInput {
  roleCode: "MEVI_FACTORY_MEMBER" | string;
  workspaceId: number;
}

export interface AdminCreateUserInput {
  fullName: string;
  phoneNumber: string;
  email?: string;
  password?: string;
  workspaceRoles: FactoryAccountWorkspaceRoleInput[];
  operatingArea?: string;
  province?: string;
  commune?: string;
  birthYear?: number;
  audienceType?: "individual" | "cooperative" | "business" | "other";
}

export interface AdminUpdateUserInput {
  fullName: string;
  email?: string;
  password?: string;
  addWorkspaceRoles?: FactoryAccountWorkspaceRoleInput[];
  removeWorkspaceRoles?: FactoryAccountWorkspaceRoleInput[];
  operatingArea?: string;
  province?: string;
  commune?: string;
  birthYear?: number;
  audienceType?: "individual" | "cooperative" | "business" | "other";
}

export interface FactoryAccountListParams {
  page: number;
  size: number;
  keyword?: string;
  status?: FactoryAccountStatus;
  workspaceId?: number | string;
  roleCode?: string;
  profileStatus?: string;
}
