import { useMemo } from "react";
import { CERTIFICATION_TYPE_LABELS } from "@/features/factory";
import { useCertificates } from "./use-certificates";

/** Factory certificates as select options (label: "HACCP · HACCP-VN-2024-0156") */
export function useCertificateOptions(factoryId?: string) {
  const { data } = useCertificates({ page: 0, size: 100, factoryId });
  return useMemo(
    () =>
      (data?.content ?? []).map((c) => ({
        value: c.id,
        label: `${c.standardName || CERTIFICATION_TYPE_LABELS[c.type]} · ${c.number}`,
      })),
    [data],
  );
}
