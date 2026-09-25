import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { exampleSchema, type ExampleFormValues } from "../schemas/example-schema";

export function useExampleForm(defaultValues?: Partial<ExampleFormValues>) {
  return useForm<ExampleFormValues>({
    resolver: zodResolver(exampleSchema),
    defaultValues: { name: "", ...defaultValues },
  });
}
