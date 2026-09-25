import { useFormContext } from "react-hook-form";
import type { DemandFormValues } from "@/features/demand";

export const useDemandFormContext = () => useFormContext<DemandFormValues>();
