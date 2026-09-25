import { useWatch } from "react-hook-form";
import type { WarehouseFormValues } from "@/features/warehouse";
import { WarehouseInfo } from "../WarehouseInfo";
import { useWarehouseFormContext } from "./useWarehouseFormContext";

export function ReviewSection() {
  const { control } = useWarehouseFormContext();
  const values = useWatch({ control }) as WarehouseFormValues;
  return <WarehouseInfo values={values} />;
}
