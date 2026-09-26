import {
  FACTORY_MOBILE_NAV_ITEMS,
  FactoryAdminLayout,
  FactoryMobileLayout,
  RadixToaster,
  TooltipProvider,
  useIsMobile,
} from "@Team-Trung-Vu-Khang/eco-shared-ui";
import { Suspense, lazy } from "react";
import { Redirect, Route, Switch, useLocation } from "wouter";
import { AppLoadingState } from "@/components/common/AppLoadingState";
import { LayoutRoleSwitch } from "@/components/common/LayoutRoleSwitch";
import { SwitchToMobileAppButton } from "@/components/common/SwitchToMobileAppButton";
import { AUTH_PATHS } from "@/config/auth";
import { AuthWrapper, authApi } from "@/features/auth";
import { useLayoutRole } from "@/hooks/useLayoutRole";
import { useMobileUiMode } from "@/hooks/useMobileUiMode";
import AppRouter from "./AppRouter";

const LoginPage = lazy(() => import("@/pages/auth/LoginPage"));
const RegisterPage = lazy(() => import("@/pages/auth/RegisterPage"));

const isPublicPath = (path: string) => path.startsWith(AUTH_PATHS.loginPage) || path.startsWith(AUTH_PATHS.register);

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
  const isOwner = useLayoutRole() === "owner";
  const mobileApp = isMobile && !isOwner && mobileUiMode === "app";

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
