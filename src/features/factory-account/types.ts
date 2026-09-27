export type FactoryAccountStatus = "ACTIVE" | "SUSPENDED";
export type FactoryAccountRole = "OWNER" | "MANAGER" | "STAFF";

export interface FactoryAccount {
  id: string;
  /** Full name — `name` so it plugs into useCrudPage */
  name: string;
  username: string;
  phone: string;
  email?: string;
  factoryId: string;
  role: FactoryAccountRole;
  status: FactoryAccountStatus;
  createdAt: string;
}

export interface FactoryAccountListParams {
  page: number;
  size: number;
  keyword?: string;
  status?: FactoryAccountStatus;
  factoryId?: string;
}
