export type ConnectionStatus = "PENDING" | "SUCCESS" | "FAILED";

export const CONNECTION_STATUS_LABELS: Record<ConnectionStatus, string> = {
  PENDING: "Chờ kết nối",
  SUCCESS: "Kết nối thành công",
  FAILED: "Không thành công",
};

export const CONNECTION_STATUS_CLASS: Record<ConnectionStatus, string> = {
  PENDING: "border-amber-200 bg-amber-50 text-amber-700",
  SUCCESS: "border-emerald-200 bg-emerald-50 text-emerald-700",
  FAILED: "border-rose-200 bg-rose-50 text-rose-700",
};

export const CONNECTION_STATUS_OPTIONS = (Object.entries(CONNECTION_STATUS_LABELS) as [ConnectionStatus, string][]).map(
  ([value, label]) => ({ value, label }),
);

/** Search quantity units — litres are treated ≈ kg when comparing to machine capacity */
export type SearchQuantityUnit = "KG" | "LITER";

export const SEARCH_QUANTITY_UNIT_LABELS: Record<SearchQuantityUnit, string> = { KG: "kg", LITER: "lít" };

export const SEARCH_QUANTITY_UNIT_OPTIONS = (Object.entries(SEARCH_QUANTITY_UNIT_LABELS) as [SearchQuantityUnit, string][]).map(
  ([value, label]) => ({ value, label }),
);

export const RADIUS_OPTIONS = [10, 20, 50, 100, 200].map((km) => ({ value: String(km), label: `Trong ${km} km` }));
