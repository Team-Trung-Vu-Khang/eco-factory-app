import { useQuery } from "@tanstack/react-query";
import { AUTH_PATHS } from "@/config/auth";
import { apiClient } from "@/lib/axios";
import type { CurrentUser } from "../types";

export function useCurrentUser() {
  return useQuery({
    queryKey: ["auth", "me", "profile"],
    queryFn: async () => (await apiClient.get<CurrentUser>("/api/me/profile")).data,
    staleTime: 5 * 60_000,
  });
}

/** GET /auth/me — only the role fields are used */
interface AuthMe {
  role?: string | string[];
  roles?: string[];
}

export function useCurrentRoles(): { roles: string[]; isLoading: boolean } {
  const { data, isLoading } = useQuery({
    queryKey: ["auth", "me", "roles"],
    queryFn: async () => (await apiClient.get<AuthMe>(AUTH_PATHS.me)).data,
    staleTime: 5 * 60_000,
  });
  return { roles: [...new Set([...(data?.roles ?? []), ...[data?.role ?? []].flat()])], isLoading };
}
