import { useWatch } from "react-hook-form";
import type { ProductFormValues } from "@/features/product";
import { ProductInfo } from "../ProductInfo";
import { useProductFormContext } from "./useProductFormContext";

export function ReviewSection() {
  const { control } = useProductFormContext();
  return <ProductInfo values={useWatch({ control }) as ProductFormValues} />;
}
