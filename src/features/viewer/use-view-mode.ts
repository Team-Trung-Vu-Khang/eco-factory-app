import { useContext, useMemo } from "react";
import { authApi } from "@/features/auth";
import { ViewModeContext } from "./view-mode-context";

export function useViewMode() {
  const ctx = useContext(ViewModeContext);
  if (!ctx) throw new Error("useViewMode must be used inside ViewModeProvider");
  return { ...ctx, isFarmer: ctx.mode === "FARMER" };
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
