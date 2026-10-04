export type ConnectionStatus =
  "PENDING" | "ACCEPTED" | "REJECTED" | "CANCELLED" | "SUCCESS" | "FAILED";

export const CONNECTION_STATUS_LABELS: Record<string, string> = {
  PENDING: "Chờ kết nối",
  ACCEPTED: "Đã kết nối",
  REJECTED: "Đã từ chối",
  CANCELLED: "Đã hủy",
  SUCCESS: "Đã kết nối",
  FAILED: "Đã từ chối",
};

export const CONNECTION_STATUS_CLASS: Record<string, string> = {
  PENDING: "border-amber-200 bg-amber-50 text-amber-700",
  ACCEPTED: "border-emerald-200 bg-emerald-50 text-emerald-700",
  REJECTED: "border-rose-200 bg-rose-50 text-rose-700",
  CANCELLED: "border-slate-200 bg-slate-100 text-slate-600",
  SUCCESS: "border-emerald-200 bg-emerald-50 text-emerald-700",
  FAILED: "border-rose-200 bg-rose-50 text-rose-700",
};

export const CONNECTION_STATUS_OPTIONS = [
  { value: "PENDING", label: "Chờ kết nối" },
  { value: "ACCEPTED", label: "Đã kết nối" },
  { value: "REJECTED", label: "Đã từ chối" },
  { value: "CANCELLED", label: "Đã hủy" },
];

export const RADIUS_OPTIONS = [10, 20, 50, 100, 200].map((km) => ({
  value: String(km),
  label: `Trong ${km} km`,
}));
