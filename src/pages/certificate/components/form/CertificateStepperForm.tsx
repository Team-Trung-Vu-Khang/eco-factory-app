import { zodResolver } from "@hookform/resolvers/zod";
import { useIsMobile } from "@Team-Trung-Vu-Khang/eco-shared-ui";
import { useForm } from "react-hook-form";
import { SchemaStepperForm } from "@/components/form";
import {
  certificateSchema,
  type CertificateFormValues,
} from "@/features/certificate";
import { useMobileUiMode } from "@/hooks/useMobileUiMode";
import { CERTIFICATE_STEPS } from "./certificate-steps";
import { MobileCertificateForm } from "./MobileCertificateForm";

interface CertificateStepperFormProps {
  defaultValues: CertificateFormValues;
  /** Page title, shown inside the mobile-app layout */
  title: string;
  submitLabel: string;
  isSubmitting?: boolean;
  onSubmit: (values: CertificateFormValues) => void;
  onCancel: () => void;
}

export function CertificateStepperForm({
  defaultValues,
  title,
  ...props
}: CertificateStepperFormProps) {
  const form = useForm<CertificateFormValues>({
    resolver: zodResolver(certificateSchema),
    defaultValues,
    mode: "onTouched",
  });
  const isMobile = useIsMobile();
  const mobileUiMode = useMobileUiMode();

  if (isMobile && mobileUiMode === "app")
    return <MobileCertificateForm form={form} title={title} {...props} />;
  return (
    <SchemaStepperForm
      form={form}
      schema={certificateSchema}
      steps={CERTIFICATE_STEPS}
      {...props}
    />
  );
}
