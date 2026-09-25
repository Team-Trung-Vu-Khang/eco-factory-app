import { useWatch } from "react-hook-form";
import type { DemandFormValues } from "@/features/demand";
import { DemandInfo } from "../DemandInfo";
import { useDemandFormContext } from "./useDemandFormContext";

export function ReviewSection() {
  const { control } = useDemandFormContext();
  return <DemandInfo values={useWatch({ control }) as DemandFormValues} />;
}
