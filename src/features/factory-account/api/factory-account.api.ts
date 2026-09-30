import { API_ENDPOINTS } from "@/config/api-endpoints";
import type { PageResponse } from "@/features/factory";
import { apiClient } from "@/lib/axios";
import type {
  AdminCreateUserInput,
  AdminFactoryAccountItem,
  AdminUpdateUserInput,
  FactoryAccountListParams,
  FactoryAccountStatus,
} from "../types";

export const factoryAccountKeys = {
  all: ["factory-accounts"] as const,
  lists: () => [...factoryAccountKeys.all, "list"] as const,
  list: (params: FactoryAccountListParams) =>
    [...factoryAccountKeys.lists(), params] as const,
  detail: (id: string | number) =>
    [...factoryAccountKeys.all, "detail", String(id)] as const,
};

const adminAccountEp = API_ENDPOINTS.admin.factory.accounts;
const adminUserEp = API_ENDPOINTS.admin.users;

export const factoryAccountApi = {
  /** Danh sách tài khoản MEVI (mặc định roleCode = MEVI_FACTORY_MEMBER cho chủ nhà máy) */
  async list(
    params: FactoryAccountListParams,
  ): Promise<PageResponse<AdminFactoryAccountItem>> {
    const { data } = await apiClient.get<PageResponse<AdminFactoryAccountItem>>(
      adminAccountEp.base,
      {
        params: {
          page: params.page,
          size: params.size,
          keyword: params.keyword?.trim() || undefined,
          status: params.status || undefined,
          workspaceId: params.workspaceId || undefined,
          roleCode: params.roleCode || "MEVI_FACTORY_MEMBER",
          profileStatus: params.profileStatus || undefined,
        },
      },
    );
    return data;
  },

  /** Chi tiết tài khoản một chủ nhà máy */
  async getDetail(userId: string | number): Promise<AdminFactoryAccountItem> {
    const { data } = await apiClient.get<AdminFactoryAccountItem>(
      adminAccountEp.detail(userId),
    );
    return data;
  },

  /** Tạo tài khoản chủ nhà máy gán vào workspace */
  async create(
    payload: AdminCreateUserInput,
  ): Promise<AdminFactoryAccountItem> {
    const { data } = await apiClient.post<AdminFactoryAccountItem>(
      adminUserEp.base,
      payload,
    );
    return data;
  },

  /** Cập nhật thông tin tài khoản chủ nhà máy & đổi workspace roles */
  async update(
    userId: string | number,
    payload: AdminUpdateUserInput,
  ): Promise<AdminFactoryAccountItem> {
    const { data } = await apiClient.put<AdminFactoryAccountItem>(
      adminUserEp.detail(userId),
      payload,
    );
    return data;
  },

  /** Đổi trạng thái tài khoản: active / inactive */
  async setStatus(
    userId: string | number,
    status: FactoryAccountStatus,
  ): Promise<void> {
    await apiClient.put(adminUserEp.status(userId), { status });
  },
};
