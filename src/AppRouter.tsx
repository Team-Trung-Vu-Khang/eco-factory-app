import { lazy } from "react";
import { Redirect, Route, Switch } from "wouter";
import { ComingSoonPage } from "@/components/common/ComingSoonPage";
import { ROUTES } from "@/config/routes";

const DashboardPage = lazy(() => import("./pages/dashboard/DashboardPage"));
const FactoryListPage = lazy(() => import("./pages/factory-profile/FactoryListPage"));
const FactoryCreatePage = lazy(() => import("./pages/factory-profile/FactoryCreatePage"));
const FactoryDetailPage = lazy(() => import("./pages/factory-profile/FactoryDetailPage"));
const FactoryEditPage = lazy(() => import("./pages/factory-profile/FactoryEditPage"));
const WarehousePage = lazy(() => import("./pages/warehouse/WarehousePage"));
const WarehouseCreatePage = lazy(() => import("./pages/warehouse/WarehouseCreatePage"));
const WarehouseDetailPage = lazy(() => import("./pages/warehouse/WarehouseDetailPage"));
const WarehouseEditPage = lazy(() => import("./pages/warehouse/WarehouseEditPage"));
const CertificatePage = lazy(() => import("./pages/certificate/CertificatePage"));
const CertificateCreatePage = lazy(() => import("./pages/certificate/CertificateCreatePage"));
const CertificateDetailPage = lazy(() => import("./pages/certificate/CertificateDetailPage"));
const CertificateEditPage = lazy(() => import("./pages/certificate/CertificateEditPage"));

// TODO: replace each placeholder with its real page
const PLACEHOLDER_ROUTES: { path: string; title: string }[] = [
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

      <Route path={ROUTES.warehouse} component={WarehousePage} />
      <Route path={ROUTES.warehouseCreate} component={WarehouseCreatePage} />
      <Route path={ROUTES.warehouseEdit(":id")} component={WarehouseEditPage} />
      <Route path={ROUTES.warehouseDetail(":id")} component={WarehouseDetailPage} />

      <Route path={ROUTES.certificates} component={CertificatePage} />
      <Route path={ROUTES.certificateCreate} component={CertificateCreatePage} />
      <Route path={ROUTES.certificateEdit(":id")} component={CertificateEditPage} />
      <Route path={ROUTES.certificateDetail(":id")} component={CertificateDetailPage} />

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
