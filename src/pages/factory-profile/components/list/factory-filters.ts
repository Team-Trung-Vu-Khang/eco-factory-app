import { useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import {
  CERTIFICATION_TYPE_OPTIONS,
  organizationTypeApi,
  organizationTypeKeys,
} from "@/features/factory";

export const FACTORY_REVIEW_STATUS_OPTIONS = [
  { value: "PENDING_REVIEW", label: "Chờ duyệt" },
  { value: "APPROVED", label: "Đã duyệt" },
  { value: "REJECTED", label: "Từ chối" },
];

export const CERTIFICATE_STATUS_FILTER_OPTIONS = [
  { value: "ACTIVE", label: "Còn hạn" },
  { value: "EXPIRING_SOON", label: "Sắp hết hạn" },
  { value: "EXPIRED", label: "Đã hết hạn" },
];

const staticFilters = [
  {
    key: "reviewStatus",
    label: "Trạng thái duyệt",
    options: FACTORY_REVIEW_STATUS_OPTIONS,
  },
  {
    key: "certificateStatus",
    label: "Trạng thái chứng nhận",
    options: CERTIFICATE_STATUS_FILTER_OPTIONS,
  },
];

/** Static filters + catalog-backed ones (loại hình, loại chứng nhận) */
export function useFactoryFilters() {
  const { data: orgTypes } = useQuery({
    queryKey: organizationTypeKeys.lists(),
    queryFn: organizationTypeApi.list,
    staleTime: 1000 * 60 * 10,
  });

  return useMemo(
    () => [
      ...staticFilters,
      {
        key: "organizationTypeId",
        label: "Loại hình",
        options: (orgTypes ?? []).map((t) => ({
          value: String(t.id),
          label: t.name,
        })),
      },
      {
        key: "certificateType",
        label: "Loại chứng nhận",
        options: CERTIFICATION_TYPE_OPTIONS,
      },
    ],
    [orgTypes],
  );
}
