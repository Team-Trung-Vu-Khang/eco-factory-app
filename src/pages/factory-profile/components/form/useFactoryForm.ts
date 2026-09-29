import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import {
  factoryFormSchema,
  type FactoryProfileFormValues,
} from "@/features/factory";

export function useFactoryForm(defaultValues: FactoryProfileFormValues) {
  return useForm<FactoryProfileFormValues>({
    resolver: zodResolver(factoryFormSchema),
    defaultValues,
    mode: "onTouched",
  });
}
