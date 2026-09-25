import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { SchemaStepperForm } from "@/components/form";
import { productSchema, type ProductFormValues } from "@/features/product";
import { getProductSteps } from "./product-steps";

interface ProductStepperFormProps {
  mode: "create" | "edit";
  defaultValues: ProductFormValues;
  submitLabel: string;
  isSubmitting?: boolean;
  onSubmit: (values: ProductFormValues) => void;
  onCancel: () => void;
}

export function ProductStepperForm({ mode, defaultValues, ...props }: ProductStepperFormProps) {
  const form = useForm<ProductFormValues>({
    resolver: zodResolver(productSchema),
    defaultValues,
    mode: "onTouched",
  });
  return <SchemaStepperForm form={form} schema={productSchema} steps={getProductSteps(mode)} {...props} />;
}
