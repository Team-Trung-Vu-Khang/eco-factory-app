import {
  FACTORY_MOBILE_NAV_ITEMS,
  FactoryAdminLayout,
  FactoryMobileLayout,
  RadixToaster,
  TooltipProvider,
  useIsMobile,
} from "@Team-Trung-Vu-Khang/eco-shared-ui";
import { Suspense } from "react";
import { AppLoadingState } from "@/components/common/AppLoadingState";
import { LayoutRoleSwitch } from "@/components/common/LayoutRoleSwitch";
import { SwitchToMobileAppButton } from "@/components/common/SwitchToMobileAppButton";
import { AuthWrapper } from "@/features/auth";
import { useLayoutRole } from "@/hooks/useLayoutRole";
import { useMobileUiMode } from "@/hooks/useMobileUiMode";
import AppRouter from "./AppRouter";

function App() {
  const isMobile = useIsMobile();
  const mobileUiMode = useMobileUiMode();
  const isOwner = useLayoutRole() === "owner";
  const mobileApp = isMobile && !isOwner && mobileUiMode === "app";

  const content = (
    <Suspense fallback={<AppLoadingState />}>
      <AppRouter />
    </Suspense>
  );

  return (
    <TooltipProvider>
      <AuthWrapper>
        {/* Factory owners have no mobile UI; farmers on phones pick "app" or "classic" (from the Tài khoản page) */}
        {mobileApp ? (
          <FactoryMobileLayout navItems={FACTORY_MOBILE_NAV_ITEMS}>
            {content}
          </FactoryMobileLayout>
        ) : (
          <FactoryAdminLayout isOwnerFactory={isOwner}>{content}</FactoryAdminLayout>
        )}
        {!mobileApp && <LayoutRoleSwitch />}
        {isMobile && !isOwner && mobileUiMode === "classic" && <SwitchToMobileAppButton />}
        <RadixToaster />
      </AuthWrapper>
    </TooltipProvider>
  );
}

export default App;
