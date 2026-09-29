import {
  Award,
  Building2,
  Calendar,
  FileText,
  Hash,
  Layers,
  Mail,
  MapPin,
  Phone,
  Sprout,
  User,
} from "lucide-react";
import { LocationPickerMap } from "@/components/map/LocationPickerMap";
import { GENDER_LABELS, type FactoryProfile } from "@/features/factory";
import { DetailCard, DetailField } from "@/components/common/DetailCard";

function Chips({ items }: { items: string[] }) {
  if (items.length === 0) return null;
  return (
    <div className="flex flex-wrap gap-1.5">
      {items.map((t) => (
        <span
          key={t}
          className="rounded-md border border-emerald-100 bg-emerald-50 px-2 py-0.5 text-xs font-medium text-emerald-700"
        >
          {t}
        </span>
      ))}
    </div>
  );
}

export function FactoryOverviewTab({
  factory: f,
}: {
  factory: FactoryProfile;
}) {
  const repName = f.representativeName;
  const repGender = f.representativeGender;
  const repPhone = f.representativePhone;
  const repEmail = f.representativeEmail;

  const lat = f.latitude;
  const lng = f.longitude;
  const hasGps = lat !== undefined && lng !== undefined;

  const fullAddress = [f.address, f.ward, f.province]
    .filter(Boolean)
    .join(", ");
  const productGroupNames = (f.productGroups ?? []).map((p) => p.name);
  const serviceNames = (f.processingServices ?? []).map((s) => s.name);
  const certCount = f.certificates?.length ?? 0;

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
              <p className="text-[11px] font-semibold uppercase tracking-wide text-emerald-700">
                {repGender ? GENDER_LABELS[repGender] : "—"}
              </p>
              <p className="truncate font-semibold text-slate-900">{repName}</p>
            </div>
          </div>
          <ul className="mt-4 space-y-2 text-sm text-slate-700">
            <li className="flex items-center gap-2">
              <Phone className="h-4 w-4 shrink-0 text-slate-400" />
              <a href={`tel:${repPhone}`} className="hover:text-emerald-700">
                {repPhone}
              </a>
            </li>
            {repEmail && (
              <li className="flex items-center gap-2">
                <Mail className="h-4 w-4 shrink-0 text-slate-400" />
                <a
                  href={`mailto:${repEmail}`}
                  className="truncate hover:text-emerald-700"
                >
                  {repEmail}
                </a>
              </li>
            )}
          </ul>
        </DetailCard>
      </div>

      {/* Right column */}
      <div className="space-y-5 lg:space-y-6">
        <DetailCard icon={Building2} title="Thông tin chi tiết nhà máy">
          <div className="grid grid-cols-2 gap-x-4 gap-y-5 md:grid-cols-4">
            <DetailField
              icon={Hash}
              label="Mã số thuế"
              iconClassName="text-blue-500"
            >
              {f.taxCode && (
                <span className="inline-block rounded-md bg-blue-50 px-2 py-0.5 text-sm font-semibold text-blue-700 shadow-sm">
                  {f.taxCode}
                </span>
              )}
            </DetailField>
            <DetailField icon={Calendar} label="Năm thành lập">
              {f.foundedYear ?? "—"}
            </DetailField>
            <DetailField
              icon={Award}
              label="Chứng nhận"
              iconClassName="text-violet-500"
            >
              <span className="text-xl font-bold text-violet-600">
                {certCount}
              </span>
            </DetailField>
            <div className="col-span-2 md:col-span-4">
              <DetailField
                icon={Sprout}
                label="Nhóm nông sản"
                iconClassName="text-emerald-500"
              >
                <Chips items={productGroupNames} />
              </DetailField>
            </div>
            <div className="col-span-2 md:col-span-4">
              <DetailField
                icon={Layers}
                label="Dịch vụ chế biến"
                iconClassName="text-emerald-500"
              >
                <Chips items={serviceNames} />
              </DetailField>
            </div>
            <div className="col-span-2 md:col-span-4">
              <DetailField
                icon={MapPin}
                label="Địa chỉ"
                iconClassName="text-rose-500"
              >
                <span className="font-medium">{fullAddress}</span>
              </DetailField>
            </div>
            {f.description && (
              <div className="col-span-2 md:col-span-4">
                <DetailField icon={FileText} label="Mô tả">
                  <p className="whitespace-pre-line text-sm font-normal text-slate-700">
                    {f.description}
                  </p>
                </DetailField>
              </div>
            )}
          </div>
        </DetailCard>

        {hasGps && (
          <div className="overflow-hidden rounded-xl border border-slate-200 shadow-sm">
            <LocationPickerMap
              value={{ latitude: lat!, longitude: lng! }}
              className="h-72 sm:h-96"
            />
          </div>
        )}
      </div>
    </div>
  );
}
