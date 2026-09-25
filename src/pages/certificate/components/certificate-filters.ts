import { CERTIFICATE_VALIDITY_OPTIONS } from "@/features/certificate";
import { CERTIFICATION_TYPE_OPTIONS } from "@/features/factory";

export const certificateFilters = [
  { key: "type", label: "Loại chứng nhận", options: CERTIFICATION_TYPE_OPTIONS },
  { key: "validity", label: "Tình trạng", options: CERTIFICATE_VALIDITY_OPTIONS },
];
