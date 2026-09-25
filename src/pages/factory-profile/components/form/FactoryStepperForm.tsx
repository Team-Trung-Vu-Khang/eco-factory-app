import {
  Form,
  StepperForm,
  type Step,
} from "@Team-Trung-Vu-Khang/eco-shared-ui";
import {
  UploadStatusProvider,
  useStepValidity,
  useUploadStatusState,
} from "@/components/form";
import { factorySchema, type FactoryFormValues } from "@/features/factory";
import { FACTORY_STEPS } from "./factory-steps";
import { useFactoryForm } from "./useFactoryForm";

const STEP_FIELDS = FACTORY_STEPS.map((s) => s.fields as string[]);

interface FactoryStepperFormProps {
  defaultValues: FactoryFormValues;
  submitLabel: string;
  isSubmitting?: boolean;
  onSubmit: (values: FactoryFormValues) => void;
  onCancel: () => void;
}

export function FactoryStepperForm({
  defaultValues,
  submitLabel,
  isSubmitting,
  onSubmit,
  onCancel,
}: FactoryStepperFormProps) {
  const form = useFactoryForm(defaultValues);
  const validity = useStepValidity(form.control, factorySchema, STEP_FIELDS);
  const upload = useUploadStatusState();

  const steps: Step[] = FACTORY_STEPS.map((step, index) => ({
    id: step.id,
    title: step.title,
    description: step.description,
    isValid: validity[index] && !upload.isUploading,
    content: (
      <div className="space-y-4">
        {step.content}
        {!validity[index] && (
          <p className="text-xs text-slate-500">
            Điền đủ và đúng các trường bắt buộc (
            <span className="text-destructive">*</span>) để tiếp tục.
          </p>
        )}
      </div>
    ),
  }));

  return (
    <UploadStatusProvider value={upload}>
      <Form {...form}>
        <StepperForm
          steps={steps}
          onComplete={form.handleSubmit(onSubmit)}
          onCancel={onCancel}
          loading={isSubmitting}
          completeLabel={submitLabel}
        />
      </Form>
    </UploadStatusProvider>
  );
}
