export type MachineStatus = "ACTIVE" | "MAINTENANCE" | "PAUSED";
export type MachineCapacityUnit = "KG_PER_MONTH" | "TONNE_PER_MONTH";

export interface ProcessingServiceRef {
  id: number;
  code: string;
  name: string;
  imageUrl?: string | null;
}

export interface ProductGroupRef {
  id: number;
  code: string;
  name: string;
  imageUrl?: string | null;
}

export interface FactoryProfileRef {
  id: number;
  code: string;
  name: string;
}

export interface MachineOpenSchedule {
  id: number;
  startDate: string;
  endDate: string;
  maxCapacity: number;
  capacityUnit: MachineCapacityUnit;
}

export interface FactoryMachineItem {
  id: number;
  workspaceId: number;
  profileId: number;
  code: string;
  name: string;
  /** Ảnh (upload qua /api/storage/files). PUT ghi đè: bỏ/null = xóa ảnh */
  imageUrl?: string | null;
  status: MachineStatus;
  maxCapacity: number;
  capacityUnit: MachineCapacityUnit;
  maxCapacityKgPerMonth?: number;
  processingServices: ProcessingServiceRef[];
  productGroups: ProductGroupRef[];
  displayOrder?: number;
  createdAt: string;
  updatedAt: string;
  /** Present on admin responses */
  profile?: FactoryProfileRef;
  /** Open active schedules of the machine, sorted by startDate ascending */
  openSchedules?: MachineOpenSchedule[];
}

export interface FactoryMachineInput {
  name: string;
  imageUrl?: string | null;
  status: MachineStatus;
  processingServiceIds: number[];
  maxCapacity: number;
  capacityUnit: MachineCapacityUnit;
  productGroupIds: number[];
}

export interface FactoryMachineListParams {
  keyword?: string;
  status?: MachineStatus;
  processingServiceId?: number;
  productGroupId?: number;
  profileId?: number;
  page?: number;
  size?: number;
}
