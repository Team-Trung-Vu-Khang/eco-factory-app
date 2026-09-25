import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { SchemaStepperForm } from "@/components/form";
import { warehouseSchema, type WarehouseFormValues } from "@/features/warehouse";
import { getWarehouseSteps } from "./warehouse-steps";

interface WarehouseStepperFormProps {
  mode: "create" | "edit";
  defaultValues: WarehouseFormValues;
  submitLabel: string;
  isSubmitting?: boolean;
  onSubmit: (values: WarehouseFormValues) => void;
  onCancel: () => void;
}

export function WarehouseStepperForm({ mode, defaultValues, ...props }: WarehouseStepperFormProps) {
  const form = useForm<WarehouseFormValues>({
    resolver: zodResolver(warehouseSchema),
    defaultValues,
    mode: "onTouched",
  });
  return <SchemaStepperForm form={form} schema={warehouseSchema} steps={getWarehouseSteps(mode)} {...props} />;
}
