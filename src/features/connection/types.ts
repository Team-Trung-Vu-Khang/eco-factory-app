import type { CapacityUnit, Factory, MachineRow } from "@/features/factory";
import type { ConnectionStatus } from "./constants";

export interface FactorySearchParams {
  /** Farmer's chosen location; distance is measured to the factory address */
  latitude?: number;
  longitude?: number;
  radiusKm?: number;
  provinceCode?: string;
  wardCode?: string;
  functions: string[];
  cropIds: string[];
}

export interface MatchedMachine extends MachineRow {
  scheduleId: string;
  scheduleFrom: string;
  scheduleTo: string;
}

export interface FactorySearchResult {
  factory: Factory;
  distanceKm?: number;
  machines: MatchedMachine[];
}

export interface ConnectionRequest {
  id: string;
  farmerId: string;
  farmerName: string;
  farmerPhone: string;
  factoryId: string;
  factoryName: string;
  machineId: string;
  machineName: string;
  scheduleId: string;
  cropIds: string[];
  quantity?: number;
  capacityUnit?: CapacityUnit;
  note?: string;
  status: ConnectionStatus;
  /** Admin note when resolving */
  resultNote?: string;
  createdAt: string;
  resolvedAt?: string;
}

export interface ConnectionListParams {
  page: number;
  size: number;
  keyword?: string;
  status?: string;
  /** Farmer view: only their own requests */
  farmerId?: string;
}

export interface RegisterConnectionInput {
  farmer: { id: string; name: string; phone: string };
  factory: Factory;
  machine: MatchedMachine;
  cropIds: string[];
  quantity?: number;
  note?: string;
}
