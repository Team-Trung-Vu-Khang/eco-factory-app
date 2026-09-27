import type { ReactNode } from "react";
import { Redirect, useLocation } from "wouter";
import { ROUTES } from "@/config/routes";
import { useFactoryMemberStatus, useIsFactoryAdmin } from "@/features/viewer";
import { AppLoadingState } from "./AppLoadingState";

const isHome = (path: string) => path.replace(/\/$/, "") === ROUTES.dashboard;

/**
 * Only admins have the dashboard in their menu → others would see
 * "Không có quyền truy cập" on /factory. Land them on their own home instead:
 * MEVI_FACTORY_MEMBER → factory profile, any other member → connection search.
 */
export function FactoryMemberHomeGate({ children }: { children: ReactNode }) {
  const [location] = useLocation();
  const isMember = useFactoryMemberStatus();
  const isAdmin = useIsFactoryAdmin();

  if (!isHome(location)) return children;
  // Wait for roles so the unauthorized screen never flashes
  if (isMember === undefined) return <AppLoadingState />;
  if (isMember) return <Redirect to={ROUTES.profile} replace />;
  if (!isAdmin) return <Redirect to={ROUTES.connectionSearch} replace />;
  return children;
}
