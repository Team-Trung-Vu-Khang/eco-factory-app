import type { Column } from "@Team-Trung-Vu-Khang/eco-shared-ui";
import { ImageOff } from "lucide-react";
import { PRODUCT_GROUP_LABELS } from "@/features/factory";
import { WEIGHT_UNIT_LABELS, type Product } from "@/features/product";
import { NewProductBadge, ProductStatusBadge } from "./ProductStatusBadge";

const fmt = new Intl.NumberFormat("vi-VN");

export const productColumns: Column<Product>[] = [
  {
    key: "name",
    label: "Sản phẩm",
    render: (_, p) => (
      <div className="flex min-w-56 items-center gap-3">
        {p.images[0] ? (
          <img src={p.images[0]} alt="" className="h-11 w-11 shrink-0 rounded-md object-cover" />
        ) : (
          <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-md bg-slate-100 text-slate-400">
            <ImageOff className="h-4 w-4" />
          </div>
        )}
        <div className="min-w-0">
          <p className="truncate font-medium text-slate-900">{p.name}</p>
          <p className="text-xs text-slate-500">{[p.sku, PRODUCT_GROUP_LABELS[p.productGroupId]].filter(Boolean).join(" · ")}</p>
        </div>
      </div>
    ),
  },
  {
    key: "packagings",
    label: "Quy cách",
    render: (_, p) => (
      <div className="space-y-0.5 text-sm tabular-nums">
        {p.packagings.map((pk) => (
          <p key={pk.id} className="whitespace-nowrap text-slate-600">
            {pk.name} {fmt.format(pk.netWeight)}
            {WEIGHT_UNIT_LABELS[pk.weightUnit]}
            {pk.price !== undefined && <span className="text-slate-400"> · {fmt.format(pk.price)}đ</span>}
          </p>
        ))}
      </div>
    ),
  },
  {
    key: "rawMaterials",
    label: "Nguyên liệu",
    render: (_, p) => <span className="text-sm text-slate-600">{p.rawMaterials}</span>,
  },
  {
    key: "status",
    label: "Trạng thái",
    render: (_, p) => (
      <div className="flex flex-col items-start gap-1">
        <ProductStatusBadge status={p.status} />
        {p.isNewlyDeveloped && <NewProductBadge />}
      </div>
    ),
  },
];
