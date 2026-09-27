import type { ReactNode } from "react";
import { Redirect, useLocation } from "wouter";
import { ROUTES } from "@/config/routes";
import { useFactoryMemberStatus } from "@/features/viewer";
import { AppLoadingState } from "./AppLoadingState";

const isHome = (path: string) => path.replace(/\/$/, "") === ROUTES.dashboard;

/**
 * MEVI_FACTORY_MEMBER has no dashboard in the menu → the layout would show
 * "Không có quyền truy cập". Land them on their factory profile instead.
 */
export function FactoryMemberHomeGate({ children }: { children: ReactNode }) {
  const [location] = useLocation();
  const isMember = useFactoryMemberStatus();

  if (!isHome(location)) return children;
  // Wait for roles so the unauthorized screen never flashes
  if (isMember === undefined) return <AppLoadingState />;
  if (isMember) return <Redirect to={ROUTES.profile} replace />;
  return children;
}
