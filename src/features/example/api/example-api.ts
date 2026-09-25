import { apiClient } from "@/lib/axios";
import type { Example } from "../types";
import type { ExampleFormValues } from "../schemas/example-schema";

export const exampleKeys = {
  all: ["examples"] as const,
  list: () => [...exampleKeys.all, "list"] as const,
  detail: (id: string) => [...exampleKeys.all, "detail", id] as const,
};

export const exampleApi = {
  list: () => apiClient.get<Example[]>("/examples").then((r) => r.data),
  get: (id: string) => apiClient.get<Example>(`/examples/${id}`).then((r) => r.data),
  create: (body: ExampleFormValues) =>
    apiClient.post<Example>("/examples", body).then((r) => r.data),
};
