import { FACTORY_ROUTES } from "@Team-Trung-Vu-Khang/eco-shared-ui";
import { lazy } from "react";
import { Redirect, Route, Switch } from "wouter";
import { ComingSoonPage } from "@/components/common/ComingSoonPage";

const DashboardPage = lazy(() => import("./pages/dashboard/DashboardPage"));

// TODO: replace each placeholder with its real page
const PLACEHOLDER_ROUTES: { path: string; title: string }[] = [
  { path: FACTORY_ROUTES.profile, title: "Hồ sơ nhà máy" },
  { path: FACTORY_ROUTES.warehouse, title: "Quản lý kho" },
  { path: FACTORY_ROUTES.certificates, title: "Chứng nhận sản xuất" },
  { path: FACTORY_ROUTES.products, title: "Sản phẩm chế biến" },
  { path: FACTORY_ROUTES.demandTypes, title: "Loại nhu cầu" },
  { path: FACTORY_ROUTES.demandSuggestions, title: "Gợi ý nhà máy phù hợp" },
  { path: FACTORY_ROUTES.demandMatching, title: "Tìm nhu cầu phù hợp" },
  { path: FACTORY_ROUTES.demands, title: "Danh sách nhu cầu" },
];

export default function AppRouter() {
  return (
    <Switch>
      <Route path={FACTORY_ROUTES.dashboard} component={DashboardPage} />
      {PLACEHOLDER_ROUTES.map(({ path, title }) => (
        <Route key={path} path={path}>
          <ComingSoonPage title={title} />
        </Route>
      ))}
      <Route>
        <Redirect to={FACTORY_ROUTES.dashboard} replace />
      </Route>
    </Switch>
  );
}
