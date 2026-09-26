import type { CapacityUnit } from "@/features/factory";
import type { ScheduleStatus } from "./constants";

export interface ProcessingSchedule {
  id: string;
  factoryId: string;
  machineId: string;
  fromDate: string;
  toDate: string;
  maxCapacity: number;
  capacityUnit: CapacityUnit;
  note?: string;
  /** Stored status; EXPIRED is derived on read (OPEN + toDate in the past) */
  status: "OPEN" | "CLOSED";
  /** CONNECTED = admin confirmed a successful connection (spec: đóng tin để không matching nữa) */
  closedReason?: "MANUAL" | "CONNECTED";
  closedAt?: string;
  createdAt: string;
}

export interface ScheduleRow extends ProcessingSchedule {
  displayStatus: ScheduleStatus;
  factoryName: string;
  machineName: string;
}

export interface ScheduleListParams {
  page: number;
  size: number;
  keyword?: string;
  status?: string;
  factoryId?: string;
}
