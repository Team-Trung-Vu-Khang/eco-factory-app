import type { Column } from "@Team-Trung-Vu-Khang/eco-shared-ui";
import dayjs from "dayjs";
import type { Certificate } from "@/features/certificate";
import {
  CERTIFICATION_ISSUER_LABELS,
  CERTIFICATION_TYPE_LABELS,
} from "@/features/factory";
import { FactoryName } from "./FactoryName";
import { ValidityBadge } from "./ValidityBadge";

const date = (d?: string) =>
  d ? dayjs(d).format("DD/MM/YYYY") : "Không thời hạn";

export const certificateColumns: Column<Certificate>[] = [
  {
    key: "certificateType",
    label: "Chứng nhận",
    render: (_, c) => {
      const typeLabel =
        (CERTIFICATION_TYPE_LABELS as Record<string, string>)[
          c.certificateType
        ] ?? c.certificateType;
      return (
        <div className="min-w-44">
          <p className="font-medium text-slate-900">{typeLabel}</p>
          {c.certificateNumber && (
            <p className="text-xs text-slate-500">Số: {c.certificateNumber}</p>
          )}
        </div>
      );
    },
  },
  {
    key: "issuer",
    label: "Đơn vị cấp",
    render: (_, c) => (
      <span className="text-sm">
        {c.issuer
          ? ((CERTIFICATION_ISSUER_LABELS as Record<string, string>)[
              c.issuer
            ] ?? c.issuer)
          : "—"}
      </span>
    ),
  },
  {
    key: "profileId",
    label: "Nhà máy",
    render: (_, c) => {
      if (c.profile?.name) {
        return (
          <div>
            <p className="font-medium text-slate-800">{c.profile.name}</p>
            {c.profile.code && (
              <p className="text-xs text-slate-500">{c.profile.code}</p>
            )}
          </div>
        );
      }
      return <FactoryName id={String(c.workspaceId ?? c.profileId ?? "")} />;
    },
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
    key: "status",
    label: "Tình trạng",
    render: (_, c) => {
      return (
        <ValidityBadge
          validity={c.status}
          daysToExpiry={c.daysUntilExpiry ?? null}
        />
      );
    },
  },
];
