export interface ProcessingServiceItem {
  /** Matches `ProcessingService` codes for the seeded services */
  id: string;
  name: string;
  description?: string;
  isActive: boolean;
  /** Factories offering this service */
  factoryCount: number;
  updatedAt: string;
}

export interface ProcessingServiceListParams {
  page: number;
  size: number;
  keyword?: string;
}
