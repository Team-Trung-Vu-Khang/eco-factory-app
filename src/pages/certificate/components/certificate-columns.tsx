import type { Column } from "@Team-Trung-Vu-Khang/eco-shared-ui";
import dayjs from "dayjs";
import type { Certificate } from "@/features/certificate";
import { CERTIFICATION_ISSUER_LABELS, CERTIFICATION_TYPE_LABELS, PRODUCT_GROUP_LABELS } from "@/features/factory";
import { ValidityBadge } from "./ValidityBadge";

const date = (d?: string) => (d ? dayjs(d).format("DD/MM/YYYY") : "Không thời hạn");

export const certificateColumns: Column<Certificate>[] = [
  {
    key: "type",
    label: "Chứng nhận",
    render: (_, c) => (
      <div className="min-w-44">
        <p className="font-medium text-slate-900">{c.standardName || CERTIFICATION_TYPE_LABELS[c.type]}</p>
        <p className="text-xs text-slate-500">
          {CERTIFICATION_TYPE_LABELS[c.type]} · {c.number}
        </p>
      </div>
    ),
  },
  {
    key: "issuer",
    label: "Đơn vị cấp",
    render: (_, c) => <span className="text-sm">{CERTIFICATION_ISSUER_LABELS[c.issuer] ?? c.issuer}</span>,
  },
  {
    key: "productGroupIds",
    label: "Phạm vi",
    render: (_, c) => (
      <span className="text-sm text-slate-600">{c.productGroupIds.map((id) => PRODUCT_GROUP_LABELS[id] ?? id).join(", ")}</span>
    ),
  },
  {
    key: "issuedDate",
    label: "Hiệu lực",
    render: (_, c) => (
      <span className="whitespace-nowrap text-sm tabular-nums text-slate-600">
        {date(c.issuedDate)} → {date(c.expiryDate)}
      </span>
    ),
  },
  {
    key: "validity",
    label: "Tình trạng",
    render: (_, c) => <ValidityBadge validity={c.validity} daysToExpiry={c.daysToExpiry} />,
  },
];
