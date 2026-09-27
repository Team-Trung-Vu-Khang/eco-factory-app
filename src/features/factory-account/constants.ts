import type { FactoryAccountRole, FactoryAccountStatus } from "./types";

export const FACTORY_ACCOUNT_ROLE_LABELS: Record<FactoryAccountRole, string> = {
  OWNER: "Chủ nhà máy",
  MANAGER: "Quản lý",
  STAFF: "Nhân viên",
};

export const FACTORY_ACCOUNT_STATUS_LABELS: Record<FactoryAccountStatus, string> = {
  ACTIVE: "Đang hoạt động",
  SUSPENDED: "Tạm dừng",
};

export const FACTORY_ACCOUNT_ROLE_OPTIONS = Object.entries(FACTORY_ACCOUNT_ROLE_LABELS).map(([value, label]) => ({ value, label }));
export const FACTORY_ACCOUNT_STATUS_OPTIONS = Object.entries(FACTORY_ACCOUNT_STATUS_LABELS).map(([value, label]) => ({ value, label }));
