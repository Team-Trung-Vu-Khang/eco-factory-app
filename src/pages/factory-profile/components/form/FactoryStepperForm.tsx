import { useIsMobile } from "@Team-Trung-Vu-Khang/eco-shared-ui";
import { SchemaStepperForm } from "@/components/form";
import {
  factoryFormSchema,
  type FactoryProfileFormValues,
} from "@/features/factory";
import { useMobileUiMode } from "@/hooks/useMobileUiMode";
import { MobileStepperForm } from "@/pages/connection/mobile/MobileStepperForm";
import { FACTORY_STEPS } from "./factory-steps";
import { useFactoryForm } from "./useFactoryForm";

/** Short step names so 5 steps fit the mobile progress header */
const MOBILE_STEP_LABELS = [
  "Chung",
  "Địa điểm",
  "Hoạt động",
  "Chứng nhận",
  "Xác nhận",
];

interface FactoryStepperFormProps {
  defaultValues: FactoryProfileFormValues;
  /** Page title, shown inside the mobile-app layout */
  title: string;
  submitLabel: string;
  isSubmitting?: boolean;
  onSubmit: (values: FactoryProfileFormValues) => void;
  onCancel: () => void;
}

export function FactoryStepperForm({
  defaultValues,
  title,
  submitLabel = "Gửi duyệt",
  ...props
}: FactoryStepperFormProps) {
  const form = useFactoryForm(defaultValues);
  const isMobile = useIsMobile();
  const mobileUiMode = useMobileUiMode();

  if (isMobile && mobileUiMode === "app")
    return (
      <MobileStepperForm
        form={form}
        steps={FACTORY_STEPS}
        stepLabels={MOBILE_STEP_LABELS}
        title={title}
        submitLabel={submitLabel}
        {...props}
      />
    );

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
