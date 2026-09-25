import { Form, StepperForm, type Step } from "@Team-Trung-Vu-Khang/eco-shared-ui";
import type { ReactNode } from "react";
import type { FieldValues, UseFormReturn } from "react-hook-form";
import type { ZodType } from "zod";
import { UploadStatusProvider } from "./UploadStatusProvider";
import { useUploadStatusState } from "./upload-status";
import { useStepValidity } from "./useStepValidity";

export interface SchemaStep<T extends FieldValues> {
  id: string;
  title: string;
  description?: string;
  /** Top-level fields that must be valid before "Tiếp theo" is enabled */
  fields: (keyof T & string)[];
  content: ReactNode;
}

interface SchemaStepperFormProps<T extends FieldValues> {
  form: UseFormReturn<T>;
  schema: ZodType;
  steps: SchemaStep<T>[];
  submitLabel: string;
  isSubmitting?: boolean;
  onSubmit: (values: T) => void;
  onCancel: () => void;
}

/**
 * Library `StepperForm` + react-hook-form + zod: each step's "Next" is enabled
 * only when the schema has no issue for that step's fields, and uploads block it.
 */
export function SchemaStepperForm<T extends FieldValues>({
  form,
  schema,
  steps,
  submitLabel,
  isSubmitting,
  onSubmit,
  onCancel,
}: SchemaStepperFormProps<T>) {
  const validity = useStepValidity(form.control, schema, steps.map((s) => s.fields));
  const upload = useUploadStatusState();

  const stepperSteps: Step[] = steps.map((step, index) => ({
    id: step.id,
    title: step.title,
    description: step.description,
    isValid: validity[index] && !upload.isUploading,
    content: (
      <div className="space-y-4">
        {step.content}
        {!validity[index] && (
          <p className="text-xs text-slate-500">
            Điền đủ và đúng các trường bắt buộc (<span className="text-destructive">*</span>) để tiếp tục.
          </p>
        )}
      </div>
    ),
  }));

  return (
    <UploadStatusProvider value={upload}>
      <Form {...form}>
        <StepperForm
          steps={stepperSteps}
          onComplete={form.handleSubmit(onSubmit)}
          onCancel={onCancel}
          loading={isSubmitting}
          completeLabel={submitLabel}
        />
      </Form>
    </UploadStatusProvider>
  );
}
