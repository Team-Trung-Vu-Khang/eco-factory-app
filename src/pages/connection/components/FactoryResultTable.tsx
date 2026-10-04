import { ThumbnailLabel } from "@/components/common/Thumbnail";
import { Button } from "@Team-Trung-Vu-Khang/eco-shared-ui";
import dayjs from "dayjs";
import { Building2, ExternalLink, Handshake, Loader2 } from "lucide-react";
import { Link } from "wouter";
import { ROUTES } from "@/config/routes";
import type { MarketplaceScheduleItem } from "@/features/connection";
import { CAPACITY_UNIT_LABELS } from "@/features/machine";
import { ConnectionStatusBadge } from "./ConnectionStatusBadge";

const fmt = new Intl.NumberFormat("vi-VN");
const date = (d: string) => dayjs(d).format("DD/MM/YYYY");

/** Google Maps directions — coordinates when known, else the full address text */
const directionsUrl = (profile: MarketplaceScheduleItem["profile"]) => {
  const { latitude, longitude, address, province, ward } = profile;
  const destination =
    latitude !== undefined &&
    latitude !== null &&
    longitude !== undefined &&
    longitude !== null
      ? `${latitude},${longitude}`
      : [address, ward, province].filter(Boolean).join(", ");
  return `https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(destination)}`;
};

const BASE_HEADERS = [
  "Tin đăng",
  "Nhà máy",
  "Địa chỉ",
  "Tỉnh/Thành",
  "Xã/Phường",
  "Máy / dây chuyền",
  "Lịch nhận",
  "Công suất tối đa",
  "Ngày đăng",
  "",
];

interface FactoryResultTableProps {
  results: MarketplaceScheduleItem[];
  mode: "admin" | "member";
  connectingId?: number;
  onConnect?: (schedule: MarketplaceScheduleItem) => void;
  /** Hủy yêu cầu/kết nối hiện có của mình với tin đăng này */
  onCancel?: (schedule: MarketplaceScheduleItem) => void;
}

export function FactoryResultTable({
  results,
  connectingId,
  onConnect,
  onCancel,
}: FactoryResultTableProps) {
  return (
    <div className="overflow-x-auto rounded-2xl border border-slate-200 bg-white">
      <table className="w-full min-w-[1300px] text-sm">
        <thead className="border-b border-slate-200 bg-slate-50 text-left text-xs font-semibold text-slate-600">
          <tr>
            {BASE_HEADERS.map((h, i) => (
              <th
                key={h || `actions-${i}`}
                className="whitespace-nowrap px-3 py-2.5"
              >
                {h}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-100">
          {results.map((item) => {
            const req = item.myConnectionRequest;
            const canConnect = !req || req.status === "CANCELLED";

            return (
              <tr key={item.id} className="align-top">
                <td className="min-w-56 px-3 py-3">
                  <p className="font-medium text-slate-900">{item.title}</p>
                  <p className="mt-0.5 text-xs text-slate-500">
                    {item.machine?.processingServices
                      ?.map((s) => s.name)
                      .join(", ") || "—"}
                  </p>
                </td>
                <td className="px-3 py-3 font-medium text-slate-800">
                  {item.profile.name}
                </td>
                <td className="px-3 py-3">
                  <a
                    href={directionsUrl(item.profile)}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-start gap-1 text-emerald-700 hover:underline"
                    title="Mở bản đồ chỉ đường"
                  >
                    <span>{item.profile.address || "Xem bản đồ"}</span>
                    <ExternalLink className="mt-0.5 h-3.5 w-3.5 shrink-0" />
                  </a>
                </td>
                <td className="px-3 py-3 text-slate-700">
                  {item.profile.province || "—"}
                </td>
                <td className="px-3 py-3 text-slate-700">
                  {item.profile.ward || "—"}
                </td>
                <td className="px-3 py-3 text-slate-800">
                  <ThumbnailLabel src={item.machine.imageUrl} label={item.machine.name} size="sm">
                    {item.machine.name}
                  </ThumbnailLabel>
                </td>
                <td className="whitespace-nowrap px-3 py-3 tabular-nums text-slate-700">
                  {date(item.startDate)} → {date(item.endDate)}
                </td>
                <td className="whitespace-nowrap px-3 py-3 tabular-nums text-slate-700">
                  {fmt.format(item.maxCapacity)}{" "}
                  {CAPACITY_UNIT_LABELS[item.capacityUnit] ?? item.capacityUnit}
                </td>
                <td className="whitespace-nowrap px-3 py-3 tabular-nums text-slate-700">
                  {dayjs(item.createdAt).format("DD/MM/YYYY HH:mm")}
                </td>
                <td className="px-3 py-3">
                  <div className="flex items-center justify-end gap-1.5 whitespace-nowrap">
                    <Button size="sm" variant="outline" className="h-8" asChild>
                      <Link
                        href={`${ROUTES.profileDetail(item.profile.id.toString())}?scheduleId=${item.id}`}
                      >
                        <Building2 className="mr-1 h-3.5 w-3.5" />
                        Hồ sơ nhà máy
                      </Link>
                    </Button>

                    {canConnect ? (
                      <Button
                        size="sm"
                        className="h-8"
                        disabled={connectingId === item.id}
                        onClick={() => onConnect?.(item)}
                      >
                        {connectingId === item.id ? (
                          <Loader2 className="mr-1 h-3.5 w-3.5 animate-spin" />
                        ) : (
                          <Handshake className="mr-1 h-3.5 w-3.5" />
                        )}
                        Kết nối
                      </Button>
                    ) : (
                      <>
                        <ConnectionStatusBadge status={req.status} />
                        {onCancel &&
                          (req.status === "PENDING" ||
                            req.status === "SUCCESS") && (
                            <Button
                              size="sm"
                              variant="outline"
                              className="h-8 text-rose-600 hover:bg-rose-50 hover:text-rose-700"
                              onClick={() => onCancel(item)}
                            >
                              Hủy
                            </Button>
                          )}
                      </>
                    )}
                  </div>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
