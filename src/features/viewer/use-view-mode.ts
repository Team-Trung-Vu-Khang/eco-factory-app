import { useMemo } from "react";
import { authApi, useCurrentRoles } from "@/features/auth";

/** Mirrors eco-shared-ui FACTORY_ADMIN_ROLES */
const FACTORY_ADMIN_ROLES = ["MEVI_SUPER_ADMIN", "MEVI_ADMIN", "MEVI_FACTORY_ADMIN"];

/** Admin gets the admin search form; every other member gets the member form */
export function useIsFactoryAdmin() {
  return useCurrentRoles().roles.some((r) => FACTORY_ADMIN_ROLES.includes(r));
}

/** MEVI_FACTORY_MEMBER (chủ nhà máy): manages only their own factory profile */
export function useIsFactoryMember() {
  return isMember(useCurrentRoles().roles);
}

/** `undefined` while roles are loading — avoids flashing the wrong page */
export function useFactoryMemberStatus(): boolean | undefined {
  const { roles, isLoading } = useCurrentRoles();
  return isLoading ? undefined : isMember(roles);
}

function isMember(roles: string[]) {
  return roles.includes("MEVI_FACTORY_MEMBER") && !roles.some((r) => FACTORY_ADMIN_ROLES.includes(r));
}

/**
 * Farmer (nông hộ) sees only their own connections; everyone else sees all.
 * TODO: derive from the user's roles once the BE exposes them — until then
 * every user gets the factory / admin view.
 */
export function useIsFarmer() {
  return false;
}

/** Best-effort read of the SSO access token's claims */
const tokenClaims = (): Record<string, string | undefined> => {
  try {
    const payload = authApi.getToken()?.split(".")[1];
    if (!payload) return {};
    const json = atob(payload.replace(/-/g, "+").replace(/_/g, "/"));
    return JSON.parse(decodeURIComponent(escape(json)));
  } catch {
    return {};
  }
};

/** Current user as the farmer registering connections */
export function useCurrentFarmer() {
  return useMemo(() => {
    const c = tokenClaims();
    return {
      // "me" matches the mock seed data until the BE owns connections
      id: c.userId ?? c.sub ?? "me",
      name: c.name ?? c.preferred_username ?? "Nông hộ",
      phone: c.phone_number ?? c.phoneNumber ?? "",
    };
  }, []);
}
