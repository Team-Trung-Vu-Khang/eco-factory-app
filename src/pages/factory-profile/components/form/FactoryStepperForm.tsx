import { SchemaStepperForm } from "@/components/form";
import { factorySchema, type FactoryFormValues } from "@/features/factory";
import { FACTORY_STEPS } from "./factory-steps";
import { useFactoryForm } from "./useFactoryForm";

// Machines are edited separately, so the edit flow skips that step
const EDIT_STEPS = FACTORY_STEPS.filter((step) => step.id !== "machines");

interface FactoryStepperFormProps {
  defaultValues: FactoryFormValues;
  submitLabel: string;
  isSubmitting?: boolean;
  onSubmit: (values: FactoryFormValues) => void;
  onCancel: () => void;
  mode?: "create" | "edit";
}

export function FactoryStepperForm({ defaultValues, mode = "create", ...props }: FactoryStepperFormProps) {
  const form = useFactoryForm(defaultValues);
  return <SchemaStepperForm form={form} schema={factorySchema} steps={mode === "edit" ? EDIT_STEPS : FACTORY_STEPS} {...props} />;
}
