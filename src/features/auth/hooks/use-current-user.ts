import { useQuery } from "@tanstack/react-query";
import { apiClient } from "@/lib/axios";
import type { CurrentUser } from "../types";

export function useCurrentUser() {
  return useQuery({
    queryKey: ["auth", "me", "profile"],
    queryFn: async () => (await apiClient.get<CurrentUser>("/api/me/profile")).data,
    staleTime: 5 * 60_000,
  });
}
