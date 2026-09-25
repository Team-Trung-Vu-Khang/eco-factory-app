import {
  AdminLayout,
  MobileAppLayout,
  RadixToaster,
  TooltipProvider,
  useIsMobile,
} from "@Team-Trung-Vu-Khang/eco-shared-ui";
import { Suspense } from "react";
import { AppLoadingState } from "@/components/common/AppLoadingState";
import { AuthWrapper } from "@/features/auth";

function App() {
  const isMobile = useIsMobile();

  // TODO: replace with <AppRouter /> once routes are defined
  const content = (
    <Suspense fallback={<AppLoadingState />}>
      <div className="p-6">Eco Factory</div>
    </Suspense>
  );

  return (
    <TooltipProvider>
      <AuthWrapper>
        {isMobile ? (
          <MobileAppLayout>{content}</MobileAppLayout>
        ) : (
          <AdminLayout isDev isMevi>
            {content}
          </AdminLayout>
        )}
        <RadixToaster />
      </AuthWrapper>
    </TooltipProvider>
  );
}

export default App;
