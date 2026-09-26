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
import { SwitchToMobileAppButton } from "@/components/common/SwitchToMobileAppButton";
import { AuthWrapper } from "@/features/auth";
import { useMobileUiMode } from "@/hooks/useMobileUiMode";
import AppRouter from "./AppRouter";

function App() {
  const isMobile = useIsMobile();
  const mobileUiMode = useMobileUiMode();

  const content = (
    <Suspense fallback={<AppLoadingState />}>
      <AppRouter />
    </Suspense>
  );

  return (
    <TooltipProvider>
      <AuthWrapper>
        {/* "classic" = full sidebar UI on phones, toggled from the Tài khoản page */}
        {isMobile && mobileUiMode === "app" ? (
          <FactoryMobileLayout navItems={FACTORY_MOBILE_NAV_ITEMS}>{content}</FactoryMobileLayout>
        ) : (
          <FactoryAdminLayout>{content}</FactoryAdminLayout>
        )}
        {isMobile && mobileUiMode === "classic" && <SwitchToMobileAppButton />}
        <RadixToaster />
      </AuthWrapper>
    </TooltipProvider>
  );
}

export default App;
