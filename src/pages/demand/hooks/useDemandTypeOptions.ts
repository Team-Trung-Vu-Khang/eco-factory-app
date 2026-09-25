import { useMemo } from "react";
import { useDemandTypes } from "@/features/demand-type";

/** Active demand types; also returns the raw list so callers can read `processingServices` */
export function useDemandTypeOptions() {
  const { data } = useDemandTypes({ page: 0, size: 100, isActive: "true" });
  return useMemo(() => {
    const types = data?.content ?? [];
    return { types, options: types.map((t) => ({ value: t.id, label: t.name })) };
  }, [data]);
}
