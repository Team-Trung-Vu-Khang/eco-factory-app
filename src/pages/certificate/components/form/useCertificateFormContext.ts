import { useFormContext } from "react-hook-form";
import type { CertificateFormValues } from "@/features/certificate";

export const useCertificateFormContext = () => useFormContext<CertificateFormValues>();
