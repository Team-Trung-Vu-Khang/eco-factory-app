import { http } from "@/lib/axios";
import type { Example } from "../types";
import type { ExampleFormValues } from "../schemas/example-schema";

export const exampleKeys = {
  all: ["examples"] as const,
  list: () => [...exampleKeys.all, "list"] as const,
  detail: (id: string) => [...exampleKeys.all, "detail", id] as const,
};

export const exampleApi = {
  list: () => http.get<Example[]>("/examples").then((r) => r.data),
  get: (id: string) => http.get<Example>(`/examples/${id}`).then((r) => r.data),
  create: (body: ExampleFormValues) =>
    http.post<Example>("/examples", body).then((r) => r.data),
};
