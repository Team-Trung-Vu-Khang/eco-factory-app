import {
  FACTORY_FARMER_MOBILE_NAV_ITEMS,
  FACTORY_MOBILE_NAV_ITEMS,
  FactoryAdminLayout,
  FactoryMobileLayout,
  RadixToaster,
  TooltipProvider,
  useIsMobile,
} from "@Team-Trung-Vu-Khang/eco-shared-ui";
import { Suspense } from "react";
import { AppLoadingState } from "@/components/common/AppLoadingState";
import { AuthWrapper } from "@/features/auth";
import { ViewModeSwitch, useViewMode } from "@/features/viewer";
import AppRouter from "./AppRouter";

function App() {
  const isMobile = useIsMobile();
  const { isFarmer } = useViewMode();

  const content = (
    <Suspense fallback={<AppLoadingState />}>
      <AppRouter />
    </Suspense>
  );

  return (
    <TooltipProvider>
      <AuthWrapper>
        {isMobile ? (
          <FactoryMobileLayout
            navItems={isFarmer ? FACTORY_FARMER_MOBILE_NAV_ITEMS : FACTORY_MOBILE_NAV_ITEMS}
            headerActions={<ViewModeSwitch />}
          >
            {content}
          </FactoryMobileLayout>
        ) : (
          <FactoryAdminLayout>{content}</FactoryAdminLayout>
        )}
        <RadixToaster />
      </AuthWrapper>
    </TooltipProvider>
  );
}

export default App;
