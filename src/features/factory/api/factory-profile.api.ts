import { API_ENDPOINTS } from "@/config/api-endpoints";
import { apiClient } from "@/lib/axios";
import type {
  AdminFactoryProfileListParams,
  FactoryProfile,
  FactoryProfileSubmitInput,
  PageResponse,
} from "../types";

export const factoryProfileKeys = {
  all: ["factory-profile"] as const,
  myProfile: () => [...factoryProfileKeys.all, "me"] as const,
  adminLists: () => [...factoryProfileKeys.all, "admin-list"] as const,
  adminList: (params: AdminFactoryProfileListParams) =>
    [...factoryProfileKeys.adminLists(), params] as const,
  detail: (id: string | number) =>
    [...factoryProfileKeys.all, "detail", String(id)] as const,
};

export const factoryProfileApi = {
  // ─── FACTORY MEMBER / OWNER (SCOPE: X-Workspace-Id) ───────────────
  /**
   * Fetches the current workspace factory profile.
   * Returns null if 404 (no profile created yet).
   */
  async getMyProfile(): Promise<FactoryProfile | null> {
    try {
      const { data } = await apiClient.get<FactoryProfile>(
        API_ENDPOINTS.factory.profile,
      );
      return data;
    } catch (err: unknown) {
      if (
        typeof err === "object" &&
        err !== null &&
        "status" in err &&
        (err as { status: number }).status === 404
      ) {
        return null;
      }
      throw err;
    }
  },

  /**
   * Submits / updates the factory profile (5 steps) and sets reviewStatus to PENDING_REVIEW.
   */
  async submitProfile(
    payload: FactoryProfileSubmitInput,
  ): Promise<FactoryProfile> {
    const { data } = await apiClient.put<FactoryProfile>(
      API_ENDPOINTS.factory.profile,
      payload,
    );
    return data;
  },

  // ─── ADMIN SIDE (SYSTEM-WIDE) ─────────────────────────────────────
  async adminList(
    params: AdminFactoryProfileListParams,
  ): Promise<PageResponse<FactoryProfile>> {
    const { data } = await apiClient.get<PageResponse<FactoryProfile>>(
      API_ENDPOINTS.admin.factory.profiles.base,
      {
        params: {
          page: params.page,
          size: params.size,
          keyword: params.keyword?.trim() || undefined,
          reviewStatus: params.reviewStatus || undefined,
          organizationTypeId: params.organizationTypeId || undefined,
          province: params.province?.trim() || undefined,
          program300Eligible: params.program300Eligible,
          certificateType: params.certificateType?.trim() || undefined,
          certificateStatus: params.certificateStatus || undefined,
        },
      },
    );
    return data;
  },

  async adminGet(id: string | number): Promise<FactoryProfile> {
    const { data } = await apiClient.get<FactoryProfile>(
      API_ENDPOINTS.admin.factory.profiles.detail(id),
    );
    return data;
  },

  async adminApprove(id: string | number): Promise<FactoryProfile> {
    const { data } = await apiClient.post<FactoryProfile>(
      API_ENDPOINTS.admin.factory.profiles.approve(id),
    );
    return data;
  },

  async adminReject(
    id: string | number,
    note: string,
  ): Promise<FactoryProfile> {
    const { data } = await apiClient.post<FactoryProfile>(
      API_ENDPOINTS.admin.factory.profiles.reject(id),
      { note: note.trim() },
    );
    return data;
  },
};
