import {
  FactoryAdminLayout,
  FactoryMobileLayout,
  RadixToaster,
  TooltipProvider,
  useIsMobile,
} from "@Team-Trung-Vu-Khang/eco-shared-ui";
import { Suspense, lazy, useEffect } from "react";
import { Redirect, Route, Switch, useLocation } from "wouter";
import { AppLoadingState } from "@/components/common/AppLoadingState";
import { FactoryMemberHomeGate } from "@/components/common/FactoryMemberHomeGate";
import { LayoutRoleSwitch } from "@/components/common/LayoutRoleSwitch";
import { AUTH_PATHS } from "@/config/auth";
import { AuthWrapper, authApi } from "@/features/auth";
import { isTouchDevice, useMobileUiMode } from "@/hooks/useMobileUiMode";
import AppRouter from "./AppRouter";

const LoginPage = lazy(() => import("@/pages/auth/LoginPage"));
const RegisterPage = lazy(() => import("@/pages/auth/RegisterPage"));

const isPublicPath = (path: string) =>
  path.startsWith(AUTH_PATHS.loginPage) || path.startsWith(AUTH_PATHS.register);

/** Login / register — no layout, no auth guard; signed-in users go home */
function PublicPages() {
  if (authApi.getToken()) return <Redirect to={AUTH_PATHS.home} />;
  return (
    <Suspense fallback={<AppLoadingState />}>
      <Switch>
        <Route path={AUTH_PATHS.register} component={RegisterPage} />
        <Route component={LoginPage} />
      </Switch>
    </Suspense>
  );
}

function App() {
  const [location] = useLocation();
  const isMobile = useIsMobile();
  const mobileUiMode = useMobileUiMode();
  // Real phones always get the mobile UI; narrow desktop windows follow the floating switch
  const mobileApp = isMobile && (isTouchDevice() || mobileUiMode === "app");

  // Lets global CSS restyle every dialog as a bottom sheet on the mobile app (index.css)
  useEffect(() => {
    document.documentElement.toggleAttribute("data-mobile-app", mobileApp);
  }, [mobileApp]);

  const content = (
    <Suspense fallback={<AppLoadingState />}>
      <AppRouter />
    </Suspense>
  );

  if (isPublicPath(location)) {
    return (
      <TooltipProvider>
        <PublicPages />
        <RadixToaster />
      </TooltipProvider>
    );
  }

  return (
    <TooltipProvider>
      <AuthWrapper>
        <FactoryMemberHomeGate>
          {/* Phones: mobile UI; desktop narrow window: picked from the floating menu */}
          {mobileApp ? (
            <FactoryMobileLayout workspaceFeature="factory" moduleSwitcher={{ currentModule: "factory" }}>
              {content}
            </FactoryMobileLayout>
          ) : (
            <FactoryAdminLayout>{content}</FactoryAdminLayout>
          )}
        </FactoryMemberHomeGate>
        <LayoutRoleSwitch />
        <RadixToaster />
      </AuthWrapper>
    </TooltipProvider>
  );
}

export default App;
