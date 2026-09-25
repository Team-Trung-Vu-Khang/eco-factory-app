import type { ProcessingService } from "@/types/factory";

export type DemandStatus =
  | "SENT"
  | "RESPONDED"
  | "NEGOTIATING"
  | "CONNECTED"
  | "COMPLETED"
  | "CANCELLED";

export interface DashboardStats {
  availableCapacityTonPerDay: number;
  maxCapacityTonPerDay: number;
  newMatchingDemands: number;
  activeDemands: number;
  connectedDemands: number;
  profileCompletionPercent: number;
}

export interface ProfileChecklistItem {
  key: string;
  label: string;
  done: boolean;
}

export interface ProfileStatus {
  completionPercent: number;
  isKpiEligible: boolean;
  kpiEligibleAt: string | null;
  checklist: ProfileChecklistItem[];
}

export interface MonthlyDemandPoint {
  month: string;
  received: number;
  connected: number;
}

export interface MachineCapacity {
  id: string;
  name: string;
  unit: string;
  maxCapacity: number;
  availableCapacity: number;
  status: "ACTIVE" | "MAINTENANCE" | "PAUSED";
}

export interface RecentDemand {
  id: string;
  requesterName: string;
  productName: string;
  quantity: number;
  unit: string;
  services: ProcessingService[];
  provinceName: string;
  distanceKm: number | null;
  status: DemandStatus;
  createdAt: string;
}

export interface FactoryDashboard {
  stats: DashboardStats;
  profile: ProfileStatus;
  monthlyDemands: MonthlyDemandPoint[];
  machines: MachineCapacity[];
  recentDemands: RecentDemand[];
}
