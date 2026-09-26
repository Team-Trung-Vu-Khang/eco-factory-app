import { useQuery } from "@tanstack/react-query";
import { apiClient } from "@/lib/axios";

export interface WorkspaceSummary {
  id: number | string;
  name: string;
  brandName?: string;
}

// Imported by path, not via features/workspace/index — lib/axios imports that index

/** Same list eco-shared-ui's workspace switcher uses */
export function useWorkspaces() {
  return useQuery({
    queryKey: ["workspaces", "list"],
    queryFn: async () =>
      (await apiClient.get<{ content?: WorkspaceSummary[] }>("/api/center/workspaces", { params: { page: 0, size: 100 } })).data.content ?? [],
    staleTime: 5 * 60_000,
  });
}
