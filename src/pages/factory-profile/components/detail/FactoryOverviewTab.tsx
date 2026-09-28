import dayjs from "dayjs";
import {
  Activity,
  Award,
  Building2,
  Calendar,
  FileText,
  Gauge,
  Hash,
  Layers,
  Mail,
  MapPin,
  Phone,
  Sprout,
  User,
  Wrench,
} from "lucide-react";
import { LocationPickerMap } from "@/components/map/LocationPickerMap";
import {
  GENDER_LABELS,
  PROCESSING_SERVICE_LABELS,
  PRODUCT_GROUP_LABELS,
  getProvinceName,
  getWardName,
  type Factory,
} from "@/features/factory";
import { KpiStatusBadge } from "../KpiStatusBadge";
import { DetailCard, DetailField } from "@/components/common/DetailCard";

function Chips({ items }: { items: string[] }) {
  if (items.length === 0) return null;
  return (
    <div className="flex flex-wrap gap-1.5">
      {items.map((t) => (
        <span key={t} className="rounded-md border border-emerald-100 bg-emerald-50 px-2 py-0.5 text-xs font-medium text-emerald-700">
          {t}
        </span>
      ))}
    </div>
  );
}

export function FactoryOverviewTab({ factory: f }: { factory: Factory }) {
  const hasGps = f.location.latitude !== undefined && f.location.longitude !== undefined;
  const address = [f.location.address, getWardName(f.location.provinceCode, f.location.wardCode), getProvinceName(f.location.provinceCode)]
    .filter(Boolean)
    .join(", ");
  const activeMachines = f.machines.filter((m) => m.status === "ACTIVE").length;

  return (
    <div className="grid gap-5 lg:grid-cols-[minmax(0,1fr)_minmax(0,2fr)] lg:gap-6">
      {/* Left column */}
      <div className="space-y-5 lg:space-y-6">
        <DetailCard icon={User} title="Người đại diện">
          <div className="flex items-center gap-3">
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-emerald-600 text-white">
              <User className="h-6 w-6" />
            </div>
            <div className="min-w-0">
              <p className="text-[11px] font-semibold uppercase tracking-wide text-emerald-700">{GENDER_LABELS[f.representative.gender]}</p>
              <p className="truncate font-semibold text-slate-900">{f.representative.fullName}</p>
            </div>
          </div>
          <ul className="mt-4 space-y-2 text-sm text-slate-700">
            <li className="flex items-center gap-2">
              <Phone className="h-4 w-4 shrink-0 text-slate-400" />
              <a href={`tel:${f.representative.phone}`} className="hover:text-emerald-700">{f.representative.phone}</a>
            </li>
            {f.representative.email && (
              <li className="flex items-center gap-2">
                <Mail className="h-4 w-4 shrink-0 text-slate-400" />
                <a href={`mailto:${f.representative.email}`} className="truncate hover:text-emerald-700">{f.representative.email}</a>
              </li>
            )}
          </ul>
        </DetailCard>

        <DetailCard icon={Gauge} title="Tình trạng hồ sơ">
          <div className="space-y-4">
            <DetailField icon={Activity} label="Hoàn thiện hồ sơ" iconClassName="text-violet-500">
              <span className={`text-xl font-bold tabular-nums ${f.completionPercent >= 100 ? "text-emerald-600" : "text-amber-600"}`}>{f.completionPercent}%</span>
            </DetailField>
            <DetailField icon={Award} label="Chỉ số 300 cơ sở" iconClassName="text-amber-500">
              <KpiStatusBadge eligible={f.isKpiEligible} />
            </DetailField>
            {f.kpiEligibleAt && (
              <DetailField icon={Calendar} label="Ngày đạt điều kiện">
                <span className="tabular-nums">{dayjs(f.kpiEligibleAt).format("DD/MM/YYYY")}</span>
              </DetailField>
            )}
          </div>
        </DetailCard>
      </div>

      {/* Right column */}
      <div className="space-y-5 lg:space-y-6">
        <DetailCard icon={Building2} title="Thông tin chi tiết nhà máy">
          <div className="grid grid-cols-2 gap-x-4 gap-y-5 md:grid-cols-4">
            <DetailField icon={Hash} label="Mã số thuế" iconClassName="text-blue-500">
              {f.taxCode && <span className="inline-block rounded-md bg-blue-50 px-2 py-0.5 text-sm font-semibold text-blue-700 shadow-sm">{f.taxCode}</span>}
            </DetailField>
            <DetailField icon={Calendar} label="Năm thành lập">
              {f.foundedYear}
            </DetailField>
            <DetailField icon={Wrench} label="Máy móc" iconClassName="text-emerald-500">
              <span className="text-xl font-bold text-emerald-600">{activeMachines}</span>
              <span className="ml-1 text-sm font-normal text-slate-500">/ {f.machines.length} hoạt động</span>
            </DetailField>
            <DetailField icon={Award} label="Chứng nhận" iconClassName="text-violet-500">
              <span className="text-xl font-bold text-violet-600">{f.certifications.length}</span>
            </DetailField>
            <div className="col-span-2 md:col-span-4">
              <DetailField icon={Sprout} label="Nhóm nông sản" iconClassName="text-emerald-500">
                <Chips items={f.productGroupIds.map((id) => PRODUCT_GROUP_LABELS[id] ?? id)} />
              </DetailField>
            </div>
            <div className="col-span-2 md:col-span-4">
              <DetailField icon={Layers} label="Dịch vụ chế biến" iconClassName="text-emerald-500">
                <Chips items={f.services.map((s) => PROCESSING_SERVICE_LABELS[s])} />
              </DetailField>
            </div>
            <div className="col-span-2 md:col-span-4">
              <DetailField icon={MapPin} label="Địa chỉ" iconClassName="text-rose-500">
                <span className="font-medium">{address}</span>
              </DetailField>
            </div>
            {f.description && (
              <div className="col-span-2 md:col-span-4">
                <DetailField icon={FileText} label="Mô tả">
                  <p className="whitespace-pre-line text-sm font-normal text-slate-700">{f.description}</p>
                </DetailField>
              </div>
            )}
          </div>
        </DetailCard>

        {hasGps && (
          <div className="overflow-hidden rounded-xl border border-slate-200 shadow-sm">
            <LocationPickerMap value={{ latitude: f.location.latitude!, longitude: f.location.longitude! }} className="h-72 sm:h-96" />
          </div>
        )}
      </div>
    </div>
  );
}
