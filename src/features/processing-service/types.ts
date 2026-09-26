/** A processing service in the shared catalog; factories pick from it */
export interface ProcessingServiceItem {
  /** Also the value stored in factory.services */
  id: string;
  name: string;
  description?: string;
  /** Names of factories offering this service */
  factoryNames: string[];
  updatedAt: string;
}

export interface ProcessingServiceListParams {
  page: number;
  size: number;
  keyword?: string;
}
