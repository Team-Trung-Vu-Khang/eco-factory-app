import type { ProcessingService } from "@/features/factory/constants";

export type DemandStatus =
  | "SENT"
  | "RESPONDED"
  | "NEGOTIATING"
  | "CONNECTED"
  | "COMPLETED"
  | "CANCELLED";

/** Totals across all posts. Dedup rules (server-side):
 * - views: max 1 per viewer unit per day
 * - connectionRequests: max 1 per viewer unit per post
 * - successfulConnections: max 1 per viewer unit per post */
export interface DashboardOverview {
  totalViews: number;
  totalConnectionRequests: number;
  totalSuccessfulConnections: number;
}

export interface LatestPostStats {
  id: string;
  title: string;
  availableCapacity: number;
  capacityUnit: string;
  views: number;
  connectionRequests: number;
  successfulConnections: number;
}

export interface DashboardStats {
  overview: DashboardOverview;
  latestPost: LatestPostStats | null;
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

export interface GroupConnectionPoint {
  name: string;
  requests: number;
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
  serviceGroupStats: GroupConnectionPoint[];
  productGroupStats: GroupConnectionPoint[];
  machines: MachineCapacity[];
  recentDemands: RecentDemand[];
}
