import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { exampleApi, exampleKeys } from "../api/example-api";

export function useExamples() {
  return useQuery({ queryKey: exampleKeys.list(), queryFn: exampleApi.list });
}

export function useExample(id: string) {
  return useQuery({
    queryKey: exampleKeys.detail(id),
    queryFn: () => exampleApi.get(id),
    enabled: !!id,
  });
}

export function useCreateExample() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: exampleApi.create,
    onSuccess: () => qc.invalidateQueries({ queryKey: exampleKeys.all }),
  });
}
