import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { SchemaStepperForm } from "@/components/form";
import { demandSchema, type DemandFormValues } from "@/features/demand";
import { getDemandSteps } from "./demand-steps";

interface DemandStepperFormProps {
  mode: "create" | "edit";
  defaultValues: DemandFormValues;
  submitLabel: string;
  isSubmitting?: boolean;
  onSubmit: (values: DemandFormValues) => void;
  onCancel: () => void;
}

export function DemandStepperForm({ mode, defaultValues, ...props }: DemandStepperFormProps) {
  const form = useForm<DemandFormValues>({
    resolver: zodResolver(demandSchema),
    defaultValues,
    mode: "onTouched",
  });
  return <SchemaStepperForm form={form} schema={demandSchema} steps={getDemandSteps(mode)} {...props} />;
}
