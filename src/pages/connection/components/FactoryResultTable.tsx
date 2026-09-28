import { Button } from "@Team-Trung-Vu-Khang/eco-shared-ui";
import dayjs from "dayjs";
import { Eye, ExternalLink, Handshake, Loader2 } from "lucide-react";
import type { FactorySearchResult, MatchedMachine } from "@/features/connection";
import { Link } from "wouter";
import { ROUTES } from "@/config/routes";
import { ScheduleConnectionsButton } from "@/pages/processing-schedule/components/ScheduleConnectionsButton";
import { CAPACITY_UNIT_LABELS, getProvinceName, getWardName, type Factory } from "@/features/factory";

const fmt = new Intl.NumberFormat("vi-VN");
const date = (d: string) => dayjs(d).format("DD/MM/YYYY");

/** Google Maps directions — coordinates when known, else the full address text */
const directionsUrl = (f: Factory) => {
  const { latitude, longitude, address, provinceCode, wardCode } = f.location;
  const destination =
    latitude !== undefined && longitude !== undefined
      ? `${latitude},${longitude}`
      : [address, getWardName(provinceCode, wardCode), getProvinceName(provinceCode)].filter(Boolean).join(", ");
  return `https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(destination)}`;
};

const BASE_HEADERS = ["Nhà máy", "Địa chỉ", "Tỉnh/Thành", "Xã/Phường", "Máy / dây chuyền", "Lịch nhận", "Công suất tối đa", "Ngày đăng"];

type Target = { factory: Factory; machine: MatchedMachine };

interface FactoryResultTableProps {
  results: FactorySearchResult[];
  /** admin: sees request count · member: detail + connect per row */
  mode: "admin" | "member";
  /** Key of the row being connected (`factoryId-machineId`) */
  connectingKey?: string;
  onConnect?: (target: Target) => void;
}

/** One row per available machine */
export function FactoryResultTable({ results, mode, connectingKey, onConnect }: FactoryResultTableProps) {
  const rows = results.flatMap(({ factory, machines }) => machines.map((m) => ({ factory, m })));
  const isAdmin = mode === "admin";
  const headers = [...BASE_HEADERS, isAdmin ? "Yêu cầu kết nối" : ""];

  return (
    <div className="overflow-x-auto rounded-2xl border border-slate-200 bg-white">
      <table className="w-full min-w-[1100px] text-sm">
        <thead className="border-b border-slate-200 bg-slate-50 text-left text-xs font-semibold text-slate-600">
          <tr>
            {headers.map((h) => (
              <th key={h || "actions"} className="whitespace-nowrap px-3 py-2.5">
                {h}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-100">
          {rows.map(({ factory: f, m }) => (
            <tr key={`${f.id}-${m.id}`} className="align-top">
              <td className="px-3 py-3 font-medium text-slate-900">{f.name}</td>
              <td className="px-3 py-3">
                <a
                  href={directionsUrl(f)}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-start gap-1 text-emerald-700 hover:underline"
                  title="Mở bản đồ chỉ đường"
                >
                  <span>{f.location.address || "Xem bản đồ"}</span>
                  <ExternalLink className="mt-0.5 h-3.5 w-3.5 shrink-0" />
                </a>
              </td>
              <td className="px-3 py-3 text-slate-700">{getProvinceName(f.location.provinceCode)}</td>
              <td className="px-3 py-3 text-slate-700">{getWardName(f.location.provinceCode, f.location.wardCode) || "—"}</td>
              <td className="px-3 py-3 text-slate-800">{m.name}</td>
              <td className="whitespace-nowrap px-3 py-3 tabular-nums text-slate-700">
                {date(m.scheduleFrom)} → {date(m.scheduleTo)}
              </td>
              <td className="whitespace-nowrap px-3 py-3 tabular-nums text-slate-700">
                {fmt.format(m.scheduleCapacity)} {CAPACITY_UNIT_LABELS[m.scheduleUnit]}
              </td>
              <td className="whitespace-nowrap px-3 py-3 tabular-nums text-slate-700">{dayjs(m.schedulePostedAt).format("DD/MM/YYYY HH:mm")}</td>
              {isAdmin ? (
                <td className="px-3 py-3">
                  <ScheduleConnectionsButton
                    schedule={{ id: m.scheduleId, machineName: m.name, fromDate: m.scheduleFrom, toDate: m.scheduleTo }}
                  />
                </td>
              ) : (
                <td className="px-3 py-3">
                  <div className="flex justify-end gap-1">
                    <Button size="sm" variant="outline" className="h-8" asChild>
                      <Link href={ROUTES.profileDetail(f.id)}>
                        <Eye className="mr-1 h-3.5 w-3.5" />
                        Chi tiết
                      </Link>
                    </Button>
                    <Button
                      size="sm"
                      className="h-8 whitespace-nowrap"
                      disabled={!!connectingKey}
                      onClick={() => onConnect?.({ factory: f, machine: m })}
                    >
                      {connectingKey === `${f.id}-${m.id}` ? (
                        <Loader2 className="mr-1 h-3.5 w-3.5 animate-spin" />
                      ) : (
                        <Handshake className="mr-1 h-3.5 w-3.5" />
                      )}
                      Kết nối
                    </Button>
                  </div>
                </td>
              )}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
