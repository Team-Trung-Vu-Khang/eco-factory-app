import { useFormContext } from "react-hook-form";
import type { ProductFormValues } from "@/features/product";

export const useProductFormContext = () => useFormContext<ProductFormValues>();
