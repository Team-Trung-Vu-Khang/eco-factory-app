import type { UseFormReturn } from "react-hook-form";
import type { CertificateFormValues } from "@/features/certificate";
import { MobileStepperForm } from "@/pages/connection/mobile/MobileStepperForm";
import { CERTIFICATE_STEPS } from "./certificate-steps";

interface Props {
  form: UseFormReturn<CertificateFormValues>;
  title: string;
  submitLabel: string;
  isSubmitting?: boolean;
  onSubmit: (values: CertificateFormValues) => void;
  onCancel: () => void;
}

/** Mobile-app version of the certificate stepper */
export function MobileCertificateForm(props: Props) {
  return <MobileStepperForm steps={CERTIFICATE_STEPS} {...props} />;
}
