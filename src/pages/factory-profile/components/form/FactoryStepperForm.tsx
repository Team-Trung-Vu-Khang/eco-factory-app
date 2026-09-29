import { SchemaStepperForm } from "@/components/form";
import {
  factoryFormSchema,
  type FactoryProfileFormValues,
} from "@/features/factory";
import { FACTORY_STEPS } from "./factory-steps";
import { useFactoryForm } from "./useFactoryForm";

interface FactoryStepperFormProps {
  defaultValues: FactoryProfileFormValues;
  submitLabel: string;
  isSubmitting?: boolean;
  onSubmit: (values: FactoryProfileFormValues) => void;
  onCancel: () => void;
}

export function FactoryStepperForm({
  defaultValues,
  submitLabel = "Gửi duyệt",
  ...props
}: FactoryStepperFormProps) {
  const form = useFactoryForm(defaultValues);
  return (
    <SchemaStepperForm
      form={form}
      schema={factoryFormSchema}
      steps={FACTORY_STEPS}
      submitLabel={submitLabel}
      {...props}
    />
  );
}
