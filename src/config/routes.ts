import { FACTORY_ROUTES } from "@Team-Trung-Vu-Khang/eco-shared-ui";

export const ROUTES = {
  ...FACTORY_ROUTES,
  profileCreate: `${FACTORY_ROUTES.profile}/new`,
  profileDetail: (id: string) => `${FACTORY_ROUTES.profile}/${id}`,
  profileEdit: (id: string) => `${FACTORY_ROUTES.profile}/${id}/edit`,
  warehouseCreate: `${FACTORY_ROUTES.warehouse}/new`,
  warehouseDetail: (id: string) => `${FACTORY_ROUTES.warehouse}/${id}`,
  warehouseEdit: (id: string) => `${FACTORY_ROUTES.warehouse}/${id}/edit`,
} as const;
