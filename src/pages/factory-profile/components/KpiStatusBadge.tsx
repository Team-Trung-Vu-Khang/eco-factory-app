import { Badge } from "@Team-Trung-Vu-Khang/eco-shared-ui";

export function KpiStatusBadge({ eligible }: { eligible: boolean }) {
  return eligible ? (
    <Badge variant="outline" className="border-emerald-200 bg-emerald-50 text-emerald-700">
      Đủ điều kiện
    </Badge>
  ) : (
    <Badge variant="outline" className="border-slate-200 bg-slate-50 text-slate-600">
      Chưa đủ
    </Badge>
  );
}
