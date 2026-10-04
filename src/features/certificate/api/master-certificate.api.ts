import { API_ENDPOINTS } from "@/config/api-endpoints";
import type { PageResponse } from "@/features/factory";
import { apiClient } from "@/lib/axios";
import type {
  MasterCertificate,
  MasterCertificateListParams,
} from "../master-certificate.types";

const ep = API_ENDPOINTS.masterData.certificates;

export const masterCertificateKeys = {
  all: ["master-certificates"] as const,
  list: (params: MasterCertificateListParams) =>
    [...masterCertificateKeys.all, "list", params] as const,
  detail: (id: string | number) =>
    [...masterCertificateKeys.all, "detail", String(id)] as const,
  search: (keyword: string, size = 20) =>
    [...masterCertificateKeys.all, "search", keyword, size] as const,
};

export const masterCertificateApi = {
  /** GET /api/master-data/certificates — cần đăng nhập */
  async list(
    params: MasterCertificateListParams,
  ): Promise<PageResponse<MasterCertificate>> {
    const { data } = await apiClient.get<PageResponse<MasterCertificate>>(
      ep.public,
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

  /** Options for AsyncSelect — value = code (gửi lên API tìm kiếm nhà máy) */
  async searchOptions(
    keyword = "",
    size = 20,
  ): Promise<Array<{ value: string; label: string }>> {
    const { content = [] } = await masterCertificateApi.list({
      page: 0,
      size,
      keyword,
    });
    return content.map((c) => ({ value: c.code, label: c.name || c.code }));
  },

  /** GET /api/master-data/certificates/{id} */
  async get(id: string | number): Promise<MasterCertificate> {
    const { data } = await apiClient.get<MasterCertificate>(
      ep.publicDetail(id),
    );
    return data;
  },
};
