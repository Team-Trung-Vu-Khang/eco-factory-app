import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { SchemaStepperForm } from "@/components/form";
import { certificateSchema, type CertificateFormValues } from "@/features/certificate";
import { CERTIFICATE_STEPS } from "./certificate-steps";

interface CertificateStepperFormProps {
  defaultValues: CertificateFormValues;
  submitLabel: string;
  isSubmitting?: boolean;
  onSubmit: (values: CertificateFormValues) => void;
  onCancel: () => void;
}

export function CertificateStepperForm({ defaultValues, ...props }: CertificateStepperFormProps) {
  const form = useForm<CertificateFormValues>({
    resolver: zodResolver(certificateSchema),
    defaultValues,
    mode: "onTouched",
  });
  return <SchemaStepperForm form={form} schema={certificateSchema} steps={CERTIFICATE_STEPS} {...props} />;
}
