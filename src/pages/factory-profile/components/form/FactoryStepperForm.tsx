import { SchemaStepperForm } from "@/components/form";
import { factorySchema, type FactoryFormValues } from "@/features/factory";
import { FACTORY_STEPS } from "./factory-steps";
import { useFactoryForm } from "./useFactoryForm";

interface FactoryStepperFormProps {
  defaultValues: FactoryFormValues;
  submitLabel: string;
  isSubmitting?: boolean;
  onSubmit: (values: FactoryFormValues) => void;
  onCancel: () => void;
}

export function FactoryStepperForm({ defaultValues, ...props }: FactoryStepperFormProps) {
  const form = useFactoryForm(defaultValues);
  return <SchemaStepperForm form={form} schema={factorySchema} steps={FACTORY_STEPS} {...props} />;
}
