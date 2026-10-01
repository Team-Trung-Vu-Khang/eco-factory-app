import {
  Badge,
  Button,
  Card,
  CardContent,
  CardHeader,
  FACTORY_ROUTES,
} from "@Team-Trung-Vu-Khang/eco-shared-ui";
import dayjs from "dayjs";
import { useState } from "react";
import { MapPin } from "lucide-react";
import { Link } from "wouter";
import {
  useAdminConnections,
  CONNECTION_STATUS_LABELS,
  CONNECTION_STATUS_CLASS,
  type ConnectionRequestItem,
} from "@/features/connection";
import { CAPACITY_UNIT_LABELS } from "@/features/machine";

const TABS = [
  { key: "requests", label: "Yêu cầu gần nhất" },
  { key: "connections", label: "Kết nối gần nhất" },
] as const;

type TabKey = (typeof TABS)[number]["key"];

export function RecentDemandsCard() {
  const [tab, setTab] = useState<TabKey>("requests");

  const { data: requestsData, isLoading: isLoadingRequests } =
    useAdminConnections(
      { page: 0, size: 5, sort: "REQUESTED_AT" },
      { enabled: tab === "requests" },
    );

  const { data: connectionsData, isLoading: isLoadingConnections } =
    useAdminConnections(
      { page: 0, size: 5, status: "ACCEPTED", sort: "RESPONDED_AT" },
      { enabled: tab === "connections" },
    );

  const isLoading =
    tab === "requests" ? isLoadingRequests : isLoadingConnections;
  const items: ConnectionRequestItem[] =
    (tab === "requests" ? requestsData?.content : connectionsData?.content) ||
    [];

  return (
    <Card className="h-full">
      <CardHeader className="flex flex-row items-start justify-between gap-2 space-y-0">
        <div className="inline-flex rounded-lg bg-slate-100 p-1" role="tablist">
          {TABS.map((t) => (
            <button
              key={t.key}
              type="button"
              role="tab"
              aria-selected={tab === t.key}
              onClick={() => setTab(t.key)}
              className={`rounded-md px-3 py-1.5 text-sm font-medium transition-colors ${
                tab === t.key
                  ? "bg-white text-slate-900 shadow-sm"
                  : "text-slate-500 hover:text-slate-700"
              }`}
            >
              {t.label}
            </button>
          ))}
        </div>
        <Button asChild variant="outline" size="sm">
          <Link href={FACTORY_ROUTES.demands}>Xem tất cả</Link>
        </Button>
      </CardHeader>
      <CardContent className="p-0">
        {isLoading ? (
          <div className="flex h-40 items-center justify-center text-sm text-slate-400">
            Đang tải dữ liệu...
          </div>
        ) : (
          <ul className="divide-y divide-slate-100">
            {items.length === 0 ? (
              <li className="px-6 py-8 text-center text-sm text-slate-500">
                {tab === "connections"
                  ? "Chưa có kết nối nào."
                  : "Chưa có yêu cầu nào."}
              </li>
            ) : (
              items.map((item) => {
                const title =
                  item.schedule?.title ||
                  item.schedule?.machine?.name ||
                  item.crops?.join(", ") ||
                  "Yêu cầu kết nối";

                const capacityText = item.maxCapacity
                  ? `${item.maxCapacity.toLocaleString("vi-VN")} ${
                      item.capacityUnit
                        ? CAPACITY_UNIT_LABELS[item.capacityUnit] ||
                          item.capacityUnit
                        : ""
                    }`
                  : null;

                const contact =
                  item.contactName ||
                  (item.requestedByUserId
                    ? `Người dùng #${item.requestedByUserId}`
                    : "Nông hộ/Cơ sở");

                const services =
                  item.processingServices?.map((s) => s.name).join(", ") || "";

                const location =
                  item.requesterProfile?.province ||
                  item.requesterProfile?.commune ||
                  item.requesterProfile?.operatingArea ||
                  "";

                const dateValue =
                  tab === "connections"
                    ? item.respondedAt || item.updatedAt || item.createdAt
                    : item.requestedAt || item.createdAt;

                return (
                  <li
                    key={item.id}
                    className="flex flex-col gap-2 px-6 py-3 sm:flex-row sm:items-center sm:justify-between"
                  >
                    <div className="min-w-0 space-y-1">
                      <p className="truncate text-sm font-medium text-slate-900">
                        {title}
                        {capacityText && ` · ${capacityText}`}
                      </p>
                      <p className="truncate text-xs text-slate-500">
                        {contact}
                        {services && ` · ${services}`}
                      </p>
                      <p className="flex items-center gap-1 text-xs text-slate-500">
                        {location && (
                          <>
                            <MapPin className="h-3 w-3 shrink-0" />
                            <span>{location}</span>
                            <span>·</span>
                          </>
                        )}
                        <span>{dayjs(dateValue).format("DD/MM/YYYY")}</span>
                      </p>
                    </div>
                    <Badge
                      variant="outline"
                      className={`w-fit shrink-0 ${
                        CONNECTION_STATUS_CLASS[item.status] || ""
                      }`}
                    >
                      {CONNECTION_STATUS_LABELS[item.status] || item.status}
                    </Badge>
                  </li>
                );
              })
            )}
          </ul>
        )}
      </CardContent>
    </Card>
  );
}
