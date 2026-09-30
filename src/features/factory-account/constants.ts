import type { FactoryAccountStatus } from "./types";

export const FACTORY_ACCOUNT_STATUS_LABELS: Record<
  FactoryAccountStatus,
  string
> = {
  active: "Đang hoạt động",
  inactive: "Tạm dừng",
};

export const FACTORY_ACCOUNT_STATUS_OPTIONS = Object.entries(
  FACTORY_ACCOUNT_STATUS_LABELS,
).map(([value, label]) => ({
  value,
  label,
}));
