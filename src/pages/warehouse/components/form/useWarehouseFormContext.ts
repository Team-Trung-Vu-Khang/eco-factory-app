import { useFormContext } from "react-hook-form";
import type { WarehouseFormValues } from "@/features/warehouse";

export const useWarehouseFormContext = () => useFormContext<WarehouseFormValues>();
