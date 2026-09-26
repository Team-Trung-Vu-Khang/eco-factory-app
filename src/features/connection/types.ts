import type { CapacityUnit, Factory, MachineRow } from "@/features/factory";
import type { MaterialCondition } from "@/features/demand/constants";
import type { ConnectionStatus, SearchQuantityUnit } from "./constants";

export interface FactorySearchParams {
  /** Farmer's chosen location; distance is measured to the factory address */
  latitude?: number;
  longitude?: number;
  radiusKm?: number;
  provinceCode?: string;
  wardCode?: string;
  /** Matching: machine must offer at least one of these services */
  functions: string[];
  /** Matching: raw material = crops, resolved to product groups */
  cropIds: string[];
  /** Matching: schedule capacity over its remaining window must cover this */
  quantity?: number;
  quantityUnit?: SearchQuantityUnit;
  /** Matching: factory must hold every one of these (unexpired) */
  requiredCertifications: string[];
  /** Info only — passed on to the factory when registering */
  materialCondition?: MaterialCondition;
  packagingRequirements?: string;
  technicalRequirements?: string;
}

/** Farmer's needs carried from the search into the connection request */
export type ConnectionRequirements = Pick<
  FactorySearchParams,
  "quantityUnit" | "requiredCertifications" | "materialCondition" | "packagingRequirements" | "technicalRequirements"
>;

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
  requirements?: ConnectionRequirements;
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
  requirements?: ConnectionRequirements;
  note?: string;
}
