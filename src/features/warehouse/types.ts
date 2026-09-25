import type { StorageUnit, WarehouseStatus, WarehouseType } from "./constants";

export interface Warehouse {
  id: string;
  name: string;
  code?: string;
  type: WarehouseType;
  status: WarehouseStatus;
  capacity: number;
  usedCapacity: number;
  capacityUnit: StorageUnit;
  temperatureMin?: number;
  temperatureMax?: number;
  humidityMin?: number;
  humidityMax?: number;
  productGroupIds: string[];
  acceptsExternalStorage: boolean;
  address: string;
  latitude?: number;
  longitude?: number;
  managerId?: string;
  managerName?: string;
  managerPhone?: string;
  note?: string;
  // computed
  availableCapacity: number;
  utilizationPercent: number;
  updatedAt: string;
}

export interface WarehouseListParams {
  page: number;
  size: number;
  keyword?: string;
  type?: string;
  status?: string;
}

export interface WarehouseSummary {
  total: number;
  active: number;
  avgUtilizationPercent: number;
  acceptingExternal: number;
}
