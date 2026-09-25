import { z } from "zod";

export const exampleSchema = z.object({
  name: z.string().trim().min(1, "Name is required"),
});

export type ExampleFormValues = z.infer<typeof exampleSchema>;
