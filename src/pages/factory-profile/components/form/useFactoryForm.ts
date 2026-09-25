import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { factorySchema, type FactoryFormValues } from "@/features/factory";

export function useFactoryForm(defaultValues: FactoryFormValues) {
  return useForm<FactoryFormValues>({
    resolver: zodResolver(factorySchema),
    defaultValues,
    mode: "onTouched",
  });
}
