import { useMemo } from "react";
import { useCertificates } from "@/features/certificate";
import { CERTIFICATION_TYPE_LABELS } from "@/features/factory";

/** Factory certificates as select options (label: "HACCP · HACCP-VN-2024-0156") */
export function useCertificateOptions() {
  const { data } = useCertificates({ page: 0, size: 100 });
  return useMemo(
    () =>
      (data?.content ?? []).map((c) => ({
        value: c.id,
        label: `${c.standardName || CERTIFICATION_TYPE_LABELS[c.type]} · ${c.number}`,
      })),
    [data],
  );
}
