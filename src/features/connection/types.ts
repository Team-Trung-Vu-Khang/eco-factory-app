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
  /** Matching: raw material = crops, resolved to product groups (member form) */
  cropIds: string[];
  /** Matching: machine processes one of these product groups (admin form) */
  productGroupIds?: string[];
  /** Matching: machine max capacity in this unit must reach this (member form) */
  minCapacity?: number;
  capacityUnit?: CapacityUnit;
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
  /** Schedule's own capacity (Công suất tối đa of the posting) */
  scheduleCapacity: number;
  scheduleUnit: CapacityUnit;
  /** Ngày đăng */
  schedulePostedAt: string;
  /** Post content (Ghi chú of the posting) */
  scheduleNote?: string;
  /** Connection requests on this schedule */
  connectionCount: number;
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
  /** Empty until admin matches the request to a factory */
  factoryId?: string;
  factoryName?: string;
  machineId?: string;
  machineName?: string;
  scheduleId?: string;
  /** Search criteria the farmer submitted with "Kết nối nhà máy" */
  criteria?: FactorySearchParams;
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
  /** Requests registered against one processing-schedule post */
  scheduleId?: string;
}

/** Request with the search criteria — tied to one result row when `target` is set */
export interface ConnectFactoriesInput {
  farmer: { id: string; name: string; phone: string };
  criteria: FactorySearchParams;
  target?: { factory: Factory; machine: MatchedMachine };
}
