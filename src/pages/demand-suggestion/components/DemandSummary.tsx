import dayjs from "dayjs";
import { Link } from "wouter";
import { ROUTES } from "@/config/routes";
import { QUANTITY_UNIT_LABELS, SEARCH_SCOPE_LABELS, type Demand } from "@/features/demand";
import { CERTIFICATION_TYPE_LABELS, PROCESSING_SERVICE_LABELS, PRODUCT_GROUP_LABELS, getProvinceName } from "@/features/factory";

const fmt = new Intl.NumberFormat("vi-VN");
const date = (v?: string) => (v ? dayjs(v).format("DD/MM/YYYY") : "");

/** The criteria the suggestions are matched against */
export function DemandSummary({ demand: d }: { demand: Demand }) {
  const items = [
    { label: "Sản phẩm", value: `${d.productName} · ${PRODUCT_GROUP_LABELS[d.productGroupId]}` },
    { label: "Khối lượng", value: `${fmt.format(d.quantity)} ${QUANTITY_UNIT_LABELS[d.quantityUnit]}` },
    { label: "Dịch vụ", value: d.services.map((s) => PROCESSING_SERVICE_LABELS[s]).join(", ") },
    { label: "Thời gian", value: [date(d.neededFrom), date(d.neededTo)].filter(Boolean).join(" – ") },
    { label: "Nguyên liệu tại", value: `${getProvinceName(d.materialLocation.provinceCode)} · ${SEARCH_SCOPE_LABELS[d.searchScope]}` },
    { label: "Chứng nhận", value: d.requiredCertifications.map((c) => CERTIFICATION_TYPE_LABELS[c]).join(", ") || "Không yêu cầu" },
  ];

  return (
    <div className="rounded-lg border border-slate-200 bg-white p-4">
      <div className="mb-3 flex items-baseline justify-between gap-4">
        <p className="text-sm text-slate-500">
          {d.requester.fullName} · {d.requester.organizationName}
        </p>
        <Link href={ROUTES.demandDetail(d.id)} className="text-sm text-emerald-700 hover:underline">
          Xem nhu cầu
        </Link>
      </div>
      <dl className="grid gap-x-6 gap-y-3 sm:grid-cols-3 lg:grid-cols-6">
        {items.map((i) => (
          <div key={i.label}>
            <dt className="text-xs text-slate-500">{i.label}</dt>
            <dd className="mt-0.5 text-sm text-slate-900">{i.value}</dd>
          </div>
        ))}
      </dl>
    </div>
  );
}
