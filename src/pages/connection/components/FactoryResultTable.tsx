import dayjs from "dayjs";
import { ExternalLink, Users } from "lucide-react";
import type { FactorySearchResult } from "@/features/connection";
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

const HEADERS = ["Nhà máy", "Địa chỉ", "Tỉnh/Thành", "Xã/Phường", "Máy / dây chuyền", "Lịch nhận", "Công suất tối đa", "Ngày đăng", "Yêu cầu kết nối"];

/** One row per available machine; read-only — connecting is done once for the whole search */
export function FactoryResultTable({ results }: { results: FactorySearchResult[] }) {
  const rows = results.flatMap(({ factory, machines }) => machines.map((m) => ({ factory, m })));

  return (
    <div className="overflow-x-auto rounded-2xl border border-slate-200 bg-white">
      <table className="w-full min-w-[1100px] text-sm">
        <thead className="border-b border-slate-200 bg-slate-50 text-left text-xs font-semibold text-slate-600">
          <tr>
            {HEADERS.map((h) => (
              <th key={h} className="whitespace-nowrap px-3 py-2.5">
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
              <td className="px-3 py-3">
                <span className={`inline-flex items-center gap-1 tabular-nums ${m.connectionCount ? "text-slate-700" : "text-slate-400"}`}>
                  <Users className="h-4 w-4" />
                  {m.connectionCount}
                </span>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
