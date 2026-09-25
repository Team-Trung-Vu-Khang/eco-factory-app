import { useWatch } from "react-hook-form";
import type { CertificateFormValues } from "@/features/certificate";
import { CertificateInfo } from "../CertificateInfo";
import { useCertificateFormContext } from "./useCertificateFormContext";

export function ReviewSection() {
  const { control } = useCertificateFormContext();
  return <CertificateInfo values={useWatch({ control }) as CertificateFormValues} />;
}
