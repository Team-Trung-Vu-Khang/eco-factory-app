import { FACTORY_ROUTES } from "@Team-Trung-Vu-Khang/eco-shared-ui";

export const ROUTES = {
  ...FACTORY_ROUTES,
  profileCreate: `${FACTORY_ROUTES.profile}/new`,
  profileDetail: (id: string) => `${FACTORY_ROUTES.profile}/${id}`,
  profileEdit: (id: string) => `${FACTORY_ROUTES.profile}/${id}/edit`,
} as const;
