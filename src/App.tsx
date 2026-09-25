import {
  FactoryAdminLayout,
  FactoryMobileLayout,
  RadixToaster,
  TooltipProvider,
  useIsMobile,
} from "@Team-Trung-Vu-Khang/eco-shared-ui";
import { Suspense } from "react";
import { AppLoadingState } from "@/components/common/AppLoadingState";
import { AuthWrapper } from "@/features/auth";
import AppRouter from "./AppRouter";

function App() {
  const isMobile = useIsMobile();

  const content = (
    <Suspense fallback={<AppLoadingState />}>
      <AppRouter />
    </Suspense>
  );

  return (
    <TooltipProvider>
      <AuthWrapper>
        {isMobile ? (
          <FactoryMobileLayout>{content}</FactoryMobileLayout>
        ) : (
          <FactoryAdminLayout>{content}</FactoryAdminLayout>
        )}
        <RadixToaster />
      </AuthWrapper>
    </TooltipProvider>
  );
}

export default App;
