import type {
  MachineCapacityUnit,
  ProcessingServiceRef,
  ProductGroupRef,
  FactoryProfileRef,
} from "@/features/machine";

export type ScheduleBackendStatus = "OPEN" | "EXPIRED" | "CLOSED";
export type ScheduleDisplayStatus = "OPEN" | "EXPIRED" | "CLOSED" | "ACTIVE";

export interface ScheduleMachineRef {
  id: number;
  code: string;
  name: string;
  status?: string;
  maxCapacity?: number;
  capacityUnit?: MachineCapacityUnit;
  maxCapacityKgPerMonth?: number;
  processingServices?: ProcessingServiceRef[];
  productGroups?: ProductGroupRef[];
}

export interface ProcessingScheduleItem {
  id: number;
  workspaceId: number;
  profileId: number;
  profile?: FactoryProfileRef;
  machineId?: number;
  machine: ScheduleMachineRef;
  title: string;
  startDate: string;
  endDate: string;
  maxCapacity: number;
  capacityUnit: MachineCapacityUnit;
  maxCapacityKgPerMonth?: number;
  note?: string | null;
  connectionRequestCount: number;
  totalViews?: number;
  status: ScheduleBackendStatus;
  createdByUserId?: number;
  closedAt?: string | null;
  closedByUserId?: number | null;
  createdAt: string;
  updatedAt: string;
}

export type ProcessingSchedule = ProcessingScheduleItem;
export type ScheduleRow = ProcessingScheduleItem;

export interface ProcessingScheduleInput {
  machineId: number;
  title: string;
  startDate: string;
  endDate: string;
  maxCapacity: number;
  capacityUnit: MachineCapacityUnit;
  note?: string;
}

export interface ScheduleListParams {
  page: number;
  size: number;
  keyword?: string;
  status?: string;
  machineId?: number;
  profileId?: number;
  factoryId?: string | number;
}
