export interface GeoProvince {
  code: string;
  name: string;
  nameEn?: string | null;
  fullName: string;
  fullNameEn?: string | null;
  codeName?: string | null;
  administrativeUnitId?: number | null;
  status?: "active" | "inactive" | "archived" | string;
  metadataJson?: Record<string, unknown> | null;
  createdAt?: string;
  updatedAt?: string;
}

export interface GeoWard {
  code: string;
  name: string;
  nameEn?: string | null;
  fullName: string;
  fullNameEn?: string | null;
  codeName?: string | null;
  provinceCode: string;
  administrativeUnitId?: number | null;
  status?: "active" | "inactive" | "archived" | string;
  metadataJson?: Record<string, unknown> | null;
  createdAt?: string;
  updatedAt?: string;
}

export interface GeoProvinceListParams {
  keyword?: string;
  status?: string;
  page?: number;
  size?: number;
}

export interface GeoWardListParams {
  provinceCode: string;
  keyword?: string;
  status?: string;
  page?: number;
  size?: number;
}
