import { FACTORY_ROUTES } from "@Team-Trung-Vu-Khang/eco-shared-ui";

export const ROUTES = {
  ...FACTORY_ROUTES,
  profileCreate: `${FACTORY_ROUTES.profile}/new`,
  profileDetail: (id: string) => `${FACTORY_ROUTES.profile}/${id}`,
  profileEdit: (id: string) => `${FACTORY_ROUTES.profile}/${id}/edit`,
  warehouseCreate: `${FACTORY_ROUTES.warehouse}/new`,
  warehouseDetail: (id: string) => `${FACTORY_ROUTES.warehouse}/${id}`,
  warehouseEdit: (id: string) => `${FACTORY_ROUTES.warehouse}/${id}/edit`,
  certificateCreate: `${FACTORY_ROUTES.certificates}/new`,
  certificateDetail: (id: string) => `${FACTORY_ROUTES.certificates}/${id}`,
  certificateEdit: (id: string) => `${FACTORY_ROUTES.certificates}/${id}/edit`,
  productCreate: `${FACTORY_ROUTES.products}/new`,
  productDetail: (id: string) => `${FACTORY_ROUTES.products}/${id}`,
  productEdit: (id: string) => `${FACTORY_ROUTES.products}/${id}/edit`,
  demandCreate: `${FACTORY_ROUTES.demands}/new`,
  demandDetail: (id: string) => `${FACTORY_ROUTES.demands}/${id}`,
  demandEdit: (id: string) => `${FACTORY_ROUTES.demands}/${id}/edit`,
} as const;
