import { useFormContext } from "react-hook-form";
import type { FactoryFormValues } from "@/features/factory";

export const useFactoryFormContext = () => useFormContext<FactoryFormValues>();
