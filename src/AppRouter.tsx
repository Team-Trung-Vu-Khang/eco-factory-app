import { lazy } from "react";
import { Redirect, Route, Switch } from "wouter";
import { ComingSoonPage } from "@/components/common/ComingSoonPage";
import { ROUTES } from "@/config/routes";

const DashboardPage = lazy(() => import("./pages/dashboard/DashboardPage"));
const FactoryListPage = lazy(() => import("./pages/factory-profile/FactoryListPage"));
const FactoryCreatePage = lazy(() => import("./pages/factory-profile/FactoryCreatePage"));
const FactoryDetailPage = lazy(() => import("./pages/factory-profile/FactoryDetailPage"));
const FactoryEditPage = lazy(() => import("./pages/factory-profile/FactoryEditPage"));

// TODO: replace each placeholder with its real page
const PLACEHOLDER_ROUTES: { path: string; title: string }[] = [
  { path: ROUTES.warehouse, title: "Quản lý kho" },
  { path: ROUTES.certificates, title: "Chứng nhận sản xuất" },
  { path: ROUTES.products, title: "Sản phẩm chế biến" },
  { path: ROUTES.demandTypes, title: "Loại nhu cầu" },
  { path: ROUTES.demandSuggestions, title: "Gợi ý nhà máy phù hợp" },
  { path: ROUTES.demandMatching, title: "Tìm nhu cầu phù hợp" },
  { path: ROUTES.demands, title: "Danh sách nhu cầu" },
];

export default function AppRouter() {
  return (
    <Switch>
      <Route path={ROUTES.dashboard} component={DashboardPage} />

      <Route path={ROUTES.profile} component={FactoryListPage} />
      <Route path={ROUTES.profileCreate} component={FactoryCreatePage} />
      <Route path={ROUTES.profileEdit(":id")} component={FactoryEditPage} />
      <Route path={ROUTES.profileDetail(":id")} component={FactoryDetailPage} />

      {PLACEHOLDER_ROUTES.map(({ path, title }) => (
        <Route key={path} path={path}>
          <ComingSoonPage title={title} />
        </Route>
      ))}
      <Route>
        <Redirect to={ROUTES.dashboard} replace />
      </Route>
    </Switch>
  );
}
