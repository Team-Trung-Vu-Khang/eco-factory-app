import {
  Award,
  Building2,
  Box,
  Cog,
  Factory,
  FileText,
  Image as ImageIcon,
  Leaf,
  MapPin,
  Phone,
  Send,
  ShieldCheck,
  Wrench,
} from "lucide-react";
import { useState } from "react";
import { ImagePreview } from "@/components/common/ImagePreview";
import {
  useMarketplaceProfile,
  type MarketplaceScheduleItem,
} from "@/features/connection";
import { ConnectionStatusBadge } from "../components/ConnectionStatusBadge";
import { capacityText } from "./result-format";
import { Chip, InfoRows, Section, VerifiedBadge } from "./result-ui";
import { TileImage, WizardFooter } from "./wizard-ui";

const scrollTo = (id: string) =>
  document
    .getElementById(id)
    ?.scrollIntoView({ behavior: "smooth", block: "start" });

const fmtDate = (d?: string | null) =>
  d ? new Date(d).toLocaleDateString("vi-VN") : undefined;

const CERT_STATUS: Record<string, { label: string; cls: string }> = {
  ACTIVE: {
    label: "Còn hiệu lực",
    cls: "bg-emerald-50 text-emerald-700 ring-emerald-100",
  },
  EXPIRING_SOON: {
    label: "Sắp hết hạn",
    cls: "bg-amber-50 text-amber-700 ring-amber-100",
  },
  EXPIRED: { label: "Hết hạn", cls: "bg-rose-50 text-rose-700 ring-rose-100" },
};

const GENDER_TITLE: Record<string, string> = { MALE: "Ông", FEMALE: "Bà" };

/** Factory detail for a search result — only fields the marketplace API returns */
export function MobileFactoryDetail({
  schedule,
  onConnect,
}: {
  schedule: MarketplaceScheduleItem;
  onConnect: (s: MarketplaceScheduleItem) => void;
}) {
  const { data: p, isLoading } = useMarketplaceProfile(schedule.profile.id, {
    scheduleId: schedule.id,
  });
  const req = schedule.myConnectionRequest;
  const canConnect = !req || req.status === "CANCELLED";

  const images = p?.images ?? [];
  const services =
    p?.processingServices ?? schedule.machine.processingServices ?? [];
  const groups = p?.productGroups ?? schedule.machine.productGroups ?? [];
  const certs = p?.certificates ?? [];
  const logo = p?.logoUrl ?? schedule.profile.logoUrl;
  const province = p?.province ?? schedule.profile.province;
  const ward = p?.ward ?? schedule.profile.ward;

  const tabs = [
    { id: "fd-overview", label: "Tổng quan", icon: FileText, show: true },
    {
      id: "fd-services",
      label: "Dịch vụ",
      icon: Box,
      show: services.length > 0,
    },
    {
      id: "fd-certs",
      label: "Chứng nhận",
      icon: ShieldCheck,
      show: certs.length > 0,
    },
    {
      id: "fd-images",
      label: "Hình ảnh",
      icon: ImageIcon,
      show: images.length > 0,
    },
  ].filter((t) => t.show);
  const [tab, setTab] = useState(tabs[0].id);

  return (
    <div className="relative -mt-14 pb-2">
      <h1 className="relative mb-3 text-[1.75rem] font-extrabold leading-tight tracking-tight text-[#0f3d22]">
        Chi tiết nhà máy
      </h1>

      <div id="fd-overview" className="mt-3 scroll-mt-16">
        <div className="flex items-start gap-3">
          {logo && (
            <ImagePreview
              src={logo}
              alt={schedule.profile.name}
              className="rounded-xl"
            >
              <TileImage
                src={logo}
                alt=""
                className="block h-12 w-12 rounded-xl bg-white ring-1 ring-slate-200"
              />
            </ImagePreview>
          )}
          <div className="min-w-0 flex-1">
            <h2 className="text-[1.375rem] font-extrabold leading-snug text-slate-900">
              {schedule.profile.name}
            </h2>
            {p?.code && <p className="text-xs text-slate-500">{p.code}</p>}
          </div>
          <VerifiedBadge className="mt-1 shrink-0 bg-emerald-50 shadow-none ring-1 ring-emerald-100" />
        </div>
        {(province || ward) && (
          <p className="mt-1 flex items-center gap-1 text-sm text-slate-500">
            <MapPin className="h-4 w-4" />
            {[ward, province].filter(Boolean).join(", ")}
          </p>
        )}
      </div>

      {tabs.length > 1 && (
        <nav className="-mx-4 mt-3 flex gap-1 overflow-x-auto border-b border-slate-200 px-4 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
          {tabs.map((t) => (
            <button
              key={t.id}
              type="button"
              onClick={() => {
                setTab(t.id);
                scrollTo(t.id);
              }}
              className={`flex shrink-0 items-center gap-1.5 border-b-2 px-2.5 py-2.5 text-[13px] font-semibold transition-colors ${
                tab === t.id
                  ? "border-[#14532d] text-[#14532d]"
                  : "border-transparent text-slate-500"
              }`}
            >
              <t.icon className="h-4 w-4" /> {t.label}
            </button>
          ))}
        </nav>
      )}

      <div className="mt-3 space-y-2.5">
        {services.length > 0 && (
          <Section
            id="fd-services"
            icon={<Cog className="h-4 w-4" />}
            title="Dịch vụ cung cấp"
          >
            <div className="flex flex-wrap gap-1.5">
              {services.map((s) => (
                <Chip
                  key={s.id}
                  lead={
                    s.imageUrl ? (
                      <TileImage
                        src={s.imageUrl}
                        alt=""
                        className="h-4 w-4 rounded-full"
                      />
                    ) : (
                      <Leaf className="h-3.5 w-3.5 text-emerald-600" />
                    )
                  }
                >
                  {s.name}
                </Chip>
              ))}
            </div>
          </Section>
        )}

        <Section
          icon={<Factory className="h-4 w-4" />}
          title="Công suất còn nhận"
        >
          <p className="-mt-1 text-[1.6rem] font-extrabold leading-tight text-[#14532d]">
            {capacityText(schedule)}
          </p>
          <p className="mt-0.5 text-xs text-slate-500">
            {new Date(schedule.startDate).toLocaleDateString("vi-VN")} →{" "}
            {new Date(schedule.endDate).toLocaleDateString("vi-VN")}
          </p>
        </Section>

        {p && (
          <Section
            icon={<Building2 className="h-4 w-4" />}
            title="Thông tin cơ sở"
          >
            <InfoRows
              rows={[
                ["Loại hình", p.organizationType?.name],
                ["Mã số thuế", p.taxCode],
                ["Năm thành lập", p.foundedYear],
                [
                  "Địa chỉ",
                  [p.address, p.ward, p.province].filter(Boolean).join(", "),
                ],
                [
                  "Máy móc",
                  p.machineCount !== undefined
                    ? `${p.activeMachineCount ?? 0}/${p.machineCount} đang hoạt động`
                    : undefined,
                ],
              ]}
            />
          </Section>
        )}

        {groups.length > 0 && (
          <Section
            icon={<Leaf className="h-4 w-4 text-emerald-600" />}
            title="Nông sản thường xử lý"
          >
            <div className="-mx-3.5 flex gap-2 overflow-x-auto px-3.5 pb-0.5 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
              {groups.map((g) => (
                <div
                  key={g.id}
                  className="flex w-[4.5rem] shrink-0 flex-col items-center gap-1 rounded-xl p-1.5 ring-1 ring-slate-200/80"
                >
                  <TileImage
                    src={g.imageUrl}
                    alt={g.name}
                    className="h-12 w-12 rounded-lg"
                  />
                  <span className="line-clamp-2 text-center text-[11px] leading-tight text-slate-700">
                    {g.name}
                  </span>
                </div>
              ))}
            </div>
          </Section>
        )}

        <Section
          icon={<Wrench className="h-4 w-4" />}
          title="Máy móc nhận chế biến"
        >
          <div className="grid grid-cols-3 gap-2">
            <figure className="overflow-hidden rounded-xl ring-1 ring-slate-200/80">
              {schedule.machine.imageUrl ? (
                <ImagePreview
                  src={schedule.machine.imageUrl}
                  alt={schedule.machine.name}
                  className="block w-full rounded-none"
                >
                  <TileImage
                    src={schedule.machine.imageUrl}
                    alt={schedule.machine.name}
                    className="block aspect-[4/3] w-full"
                  />
                </ImagePreview>
              ) : (
                <TileImage
                  alt={schedule.machine.name}
                  className="block aspect-[4/3] w-full"
                />
              )}
              <figcaption className="line-clamp-2 px-1.5 py-1 text-[11px] leading-tight text-slate-700">
                {schedule.machine.name}
              </figcaption>
            </figure>
          </div>
        </Section>

        {certs.length > 0 && (
          <Section
            id="fd-certs"
            icon={<ShieldCheck className="h-4 w-4" />}
            title={`Chứng nhận (${p?.certificateCount ?? certs.length})`}
          >
            <ul className="space-y-2.5">
              {certs.map((c) => {
                const st = CERT_STATUS[c.status];
                return (
                  <li
                    key={c.id}
                    className="flex gap-3 rounded-xl p-2 ring-1 ring-slate-200/80"
                  >
                    {c.imageUrl ? (
                      <ImagePreview
                        src={c.imageUrl}
                        alt={c.certificateType}
                        className="rounded-lg"
                      >
                        <TileImage
                          src={c.imageUrl}
                          alt=""
                          className="block h-16 w-16 rounded-lg"
                        />
                      </ImagePreview>
                    ) : (
                      <span className="flex h-16 w-16 shrink-0 items-center justify-center rounded-lg bg-emerald-50 text-emerald-700">
                        <Award className="h-6 w-6" />
                      </span>
                    )}
                    <div className="min-w-0 flex-1">
                      <div className="flex items-start justify-between gap-2">
                        <p className="font-semibold text-slate-900">
                          {c.certificateType}
                        </p>
                        {st && (
                          <span
                            className={`shrink-0 rounded-full px-2 py-0.5 text-[11px] font-semibold ring-1 ${st.cls}`}
                          >
                            {st.label}
                          </span>
                        )}
                      </div>
                      {c.certificateNumber && (
                        <p className="text-xs text-slate-500">
                          Số: {c.certificateNumber}
                        </p>
                      )}
                      {c.issuer && (
                        <p className="text-xs text-slate-500">
                          Cấp bởi: {c.issuer}
                        </p>
                      )}
                      {(c.issuedDate || c.expiryDate) && (
                        <p className="text-xs text-slate-500">
                          {fmtDate(c.issuedDate) ?? "—"} →{" "}
                          {fmtDate(c.expiryDate) ?? "Không thời hạn"}
                        </p>
                      )}
                      {c.scopeDescription && (
                        <p className="mt-0.5 line-clamp-2 text-xs text-slate-600">
                          {c.scopeDescription}
                        </p>
                      )}
                    </div>
                  </li>
                );
              })}
            </ul>
          </Section>
        )}

        {(p?.representativeName || p?.representativePhone) && (
          <Section
            icon={<Phone className="h-4 w-4" />}
            title="Thông tin liên hệ"
          >
            <div className="flex items-center gap-3">
              <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-emerald-100 text-base font-bold text-[#14532d]">
                {(p.representativeName?.trim().split(/\s+/).pop() ??
                  "?")[0]?.toUpperCase()}
              </span>
              <div className="min-w-0 flex-1">
                <p className="truncate font-semibold text-slate-900">
                  {[
                    GENDER_TITLE[p.representativeGender ?? ""],
                    p.representativeName,
                  ]
                    .filter(Boolean)
                    .join(" ") || "Người đại diện"}
                </p>
                <p className="text-xs text-slate-500">
                  Người đại diện
                  {p.representativePhone && <> · {p.representativePhone}</>}
                </p>
              </div>
              {p.representativePhone && (
                <a
                  href={`tel:${p.representativePhone}`}
                  aria-label={`Gọi ${p.representativePhone}`}
                  className="flex h-11 shrink-0 items-center gap-1.5 rounded-full bg-[#14532d] px-4 text-sm font-semibold text-white shadow-md shadow-emerald-900/20 active:scale-95"
                >
                  <Phone className="h-4 w-4" /> Gọi
                </a>
              )}
            </div>
          </Section>
        )}

        {images.length > 0 && (
          <Section
            id="fd-images"
            icon={<ImageIcon className="h-4 w-4" />}
            title="Hình ảnh"
          >
            <div className="grid grid-cols-3 gap-2">
              {images.map((img) => (
                <ImagePreview
                  key={img.id}
                  src={img.fileUrl}
                  alt={img.fileName}
                  className="block"
                >
                  <TileImage
                    src={img.fileUrl}
                    alt={img.fileName}
                    className="block aspect-square w-full rounded-xl"
                  />
                </ImagePreview>
              ))}
            </div>
          </Section>
        )}

        {p?.description && (
          <Section icon={<FileText className="h-4 w-4" />} title="Giới thiệu">
            <p className="whitespace-pre-line text-sm leading-relaxed text-slate-700">
              {p.description}
            </p>
          </Section>
        )}

        {isLoading && (
          <div className="h-20 animate-pulse rounded-2xl bg-white/70" />
        )}
      </div>

      <WizardFooter>
        {canConnect ? (
          <button
            type="button"
            onClick={() => onConnect(schedule)}
            className="flex h-14 flex-1 items-center justify-center gap-2 rounded-2xl bg-[#14532d] text-base font-semibold text-white shadow-lg shadow-emerald-900/25 active:scale-[0.98]"
          >
            <Send className="h-5 w-5" /> Gửi yêu cầu kết nối
          </button>
        ) : (
          <div className="flex h-14 flex-1 items-center justify-center rounded-2xl bg-white/90 ring-1 ring-slate-200">
            <ConnectionStatusBadge status={req.status} />
          </div>
        )}
      </WizardFooter>
    </div>
  );
}
