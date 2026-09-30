import { useFactoryOptions } from "@/features/factory";
import { useIsFactoryAdmin } from "@/features/viewer";

/** Values match API `status` */
export const CERTIFICATE_STATUS_OPTIONS = [
  { value: "ACTIVE", label: "Còn hiệu lực" },
  { value: "EXPIRING_SOON", label: "Sắp hết hạn" },
  { value: "EXPIRED", label: "Hết hạn" },
];

/** API supports keyword + status (+ profileId for admin) */
export function useCertificateFilters() {
  const isAdmin = useIsFactoryAdmin();
  const { options } = useFactoryOptions();
  const statusFilter = {
    key: "status",
    label: "Tình trạng",
    options: CERTIFICATE_STATUS_OPTIONS,
  };
  return isAdmin
    ? [{ key: "profileId", label: "Nhà máy", options }, statusFilter]
    : [statusFilter];
}
