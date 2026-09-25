import { Badge } from "@Team-Trung-Vu-Khang/eco-shared-ui";
import { PRODUCT_STATUS_LABELS, type ProductStatus } from "@/features/product";

const CLASS: Record<ProductStatus, string> = {
  ACTIVE: "border-emerald-200 bg-emerald-50 text-emerald-700",
  PAUSED: "border-amber-200 bg-amber-50 text-amber-700",
  DISCONTINUED: "border-slate-200 bg-slate-50 text-slate-600",
};

export function ProductStatusBadge({ status }: { status: ProductStatus }) {
  return (
    <Badge variant="outline" className={`whitespace-nowrap ${CLASS[status]}`}>
      {PRODUCT_STATUS_LABELS[status]}
    </Badge>
  );
}

export function NewProductBadge() {
  return (
    <Badge variant="outline" className="border-violet-200 bg-violet-50 text-violet-700">
      Mới phát triển
    </Badge>
  );
}
