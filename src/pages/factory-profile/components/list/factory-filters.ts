import { ORGANIZATION_TYPE_OPTIONS, PROVINCES } from "@/features/factory";

export const factoryFilters = [
  { key: "organizationType", label: "Loại hình", options: ORGANIZATION_TYPE_OPTIONS },
  {
    key: "provinceCode",
    label: "Tỉnh / Thành phố",
    options: PROVINCES.map((p) => ({ value: p.code, label: p.name })),
  },
  {
    key: "kpiStatus",
    label: "Chỉ số 300 cơ sở",
    options: [
      { value: "ELIGIBLE", label: "Đủ điều kiện" },
      { value: "NOT_ELIGIBLE", label: "Chưa đủ" },
    ],
  },
];
