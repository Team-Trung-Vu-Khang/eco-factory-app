import { API_ENDPOINTS } from "@/config/api-endpoints";
import type { PageResponse } from "@/features/factory";
import { apiClient } from "@/lib/axios";
import type { CertificateFormValues } from "../schemas/certificate-schema";
import type {
  Certificate,
  CertificateListParams,
  CertificateSummary,
} from "../types";

export const certificateKeys = {
  all: ["certificates"] as const,
  lists: () => [...certificateKeys.all, "list"] as const,
  list: (params: CertificateListParams) =>
    [...certificateKeys.lists(), params] as const,
  summary: (profileId?: number | string) =>
    [...certificateKeys.all, "summary", profileId ?? "all"] as const,
  detail: (id: string | number) =>
    [...certificateKeys.all, "detail", String(id)] as const,
  adminSummary: (profileId?: number | string) =>
    [...certificateKeys.all, "admin-summary", profileId ?? "all"] as const,
  adminDetail: (id: string | number) =>
    [...certificateKeys.all, "admin-detail", String(id)] as const,
  adminLists: () => [...certificateKeys.all, "admin-list"] as const,
  adminList: (params: CertificateListParams) =>
    [...certificateKeys.adminLists(), params] as const,
};

export const certificateApi = {
  // ─── FACTORY SIDE (SCOPE: X-Workspace-Id) ─────────────────────────
  async list(
    params: CertificateListParams,
  ): Promise<PageResponse<Certificate>> {
    const { data } = await apiClient.get<PageResponse<Certificate>>(
      API_ENDPOINTS.factory.certificates.base,
      {
        params: {
          page: params.page,
          size: params.size,
          keyword: params.keyword?.trim() || undefined,
          status: params.status || undefined,
        },
      },
    );
    return data;
  },

  async get(id: string | number): Promise<Certificate> {
    const { data } = await apiClient.get<Certificate>(
      API_ENDPOINTS.factory.certificates.detail(id),
    );
    return data;
  },

  async summary(): Promise<CertificateSummary> {
    const { data } = await apiClient.get<CertificateSummary>(
      API_ENDPOINTS.factory.certificates.summary,
    );
    return {
      total: data.total ?? 0,
      active: data.active ?? 0,
      expiringSoon: data.expiringSoon ?? 0,
      expired: data.expired ?? 0,
      valid: data.active ?? 0,
    };
  },

  async create(values: CertificateFormValues): Promise<Certificate> {
    const payload = {
      certificateType: values.certificateType.trim(),
      certificateNumber: values.certificateNumber?.trim() || undefined,
      issuedDate: values.issuedDate || undefined,
      expiryDate: values.expiryDate || undefined,
      issuer: values.issuer?.trim() || undefined,
      scopeDescription: values.scopeDescription?.trim() || undefined,
    };
    const { data } = await apiClient.post<Certificate>(
      API_ENDPOINTS.factory.certificates.base,
      payload,
    );
    return data;
  },

  async update(
    id: string | number,
    values: CertificateFormValues,
  ): Promise<Certificate> {
    const payload = {
      certificateType: values.certificateType.trim(),
      certificateNumber: values.certificateNumber?.trim() || undefined,
      issuedDate: values.issuedDate || undefined,
      expiryDate: values.expiryDate || undefined,
      issuer: values.issuer?.trim() || undefined,
      scopeDescription: values.scopeDescription?.trim() || undefined,
    };
    const { data } = await apiClient.put<Certificate>(
      API_ENDPOINTS.factory.certificates.detail(id),
      payload,
    );
    return data;
  },

  async remove(id: string | number): Promise<void> {
    await apiClient.delete(API_ENDPOINTS.factory.certificates.detail(id));
  },

  // ─── ADMIN SIDE (SYSTEM-WIDE) ─────────────────────────────────────
  async adminList(
    params: CertificateListParams,
  ): Promise<PageResponse<Certificate>> {
    const { data } = await apiClient.get<PageResponse<Certificate>>(
      API_ENDPOINTS.admin.factory.certificates.base,
      {
        params: {
          page: params.page,
          size: params.size,
          keyword: params.keyword?.trim() || undefined,
          status: params.status || undefined,
          profileId: params.profileId || undefined,
        },
      },
    );
    return data;
  },

  async adminGet(id: string | number): Promise<Certificate> {
    const { data } = await apiClient.get<Certificate>(
      API_ENDPOINTS.admin.factory.certificates.detail(id),
    );
    return data;
  },

  async adminSummary(profileId?: number | string): Promise<CertificateSummary> {
    const { data } = await apiClient.get<CertificateSummary>(
      API_ENDPOINTS.admin.factory.certificates.summary,
      {
        params: {
          profileId: profileId || undefined,
        },
      },
    );
    return {
      total: data.total ?? 0,
      active: data.active ?? 0,
      expiringSoon: data.expiringSoon ?? 0,
      expired: data.expired ?? 0,
      valid: data.active ?? 0,
    };
  },

  async adminRemove(id: string | number): Promise<void> {
    await apiClient.delete(API_ENDPOINTS.admin.factory.certificates.detail(id));
  },
};
