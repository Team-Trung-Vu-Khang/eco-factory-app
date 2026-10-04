import {
  Award,
  Building2,
  CalendarRange,
  ChevronRight,
  Clock,
  Cog,
  FileText,
  Image as ImageIcon,
  Leaf,
  MapPin,
  Navigation,
  Pencil,
  Phone,
  Plus,
  ShieldCheck,
  Wrench,
  XCircle,
} from "lucide-react";
import type { ReactNode } from "react";
import { Link, useLocation } from "wouter";
import { ImagePreview } from "@/components/common/ImagePreview";
import { ROUTES } from "@/config/routes";
import type { FactoryProfile } from "@/features/factory";
import { useFillViewportHeight } from "@/hooks/useFillViewportHeight";
import { Chip, InfoRows, Section } from "@/pages/connection/mobile/result-ui";
import {
  TileImage,
  WizardFooter,
  WizardHeader,
} from "@/pages/connection/mobile/wizard-ui";
import { ReviewActions } from "./detail/ReviewActions";

const GENDER_TITLE: Record<string, string> = { MALE: "Ông", FEMALE: "Bà" };
const REVIEW: Record<string, { label: string; cls: string }> = {
  APPROVED: {
    label: "Đã duyệt",
    cls: "bg-emerald-50 text-emerald-700 ring-emerald-100",
  },
  PENDING_REVIEW: {
    label: "Chờ duyệt",
    cls: "bg-amber-50 text-amber-700 ring-amber-100",
  },
  REJECTED: {
    label: "Bị từ chối",
    cls: "bg-rose-50 text-rose-700 ring-rose-100",
  },
};

function Shell({
  children,
  footer,
  onBack,
}: {
  children: ReactNode;
  footer?: ReactNode;
  onBack?: () => void;
}) {
  const [fillRef, fillHeight] = useFillViewportHeight<HTMLDivElement>();
  return (
    <div
      ref={fillRef}
      style={{ minHeight: fillHeight }}
      className={`-mx-4 -mt-4 -mb-[calc(5.5rem+env(safe-area-inset-bottom))] flex flex-col overflow-x-clip bg-[#f7f5ee] px-4 pt-4 ${
        footer ? "" : "pb-[calc(7rem+env(safe-area-inset-bottom))]"
      }`}
    >
      <WizardHeader onBack={onBack} />
      <div className="relative -mt-14 flex-1">{children}</div>
      {footer}
    </div>
  );
}

function QuickLink({
  href,
  icon,
  label,
}: {
  href: string;
  icon: ReactNode;
  label: string;
}) {
  return (
    <Link
      href={href}
      className="flex items-center gap-3 py-2.5 active:opacity-70"
    >
      <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-emerald-50 text-[#14532d]">
        {icon}
      </span>
      <span className="flex-1 text-[15px] font-medium text-slate-900">
        {label}
      </span>
      <ChevronRight className="h-5 w-5 text-slate-400" />
    </Link>
  );
}

/** No profile yet: invite the owner to set one up */
export function MobileFactoryProfileEmpty() {
  const [, navigate] = useLocation();
  return (
    <Shell>
      <h1 className="text-[1.625rem] font-extrabold leading-tight tracking-tight text-[#0f3d22]">
        Hồ sơ nhà máy
      </h1>
      <div className="fsl-card-in mt-4 flex flex-col items-center gap-3 rounded-3xl bg-white px-6 py-10 text-center shadow-[0_2px_12px_rgba(20,83,45,0.06)] ring-1 ring-emerald-900/5">
        <span className="flex h-16 w-16 items-center justify-center rounded-full bg-emerald-50 text-emerald-700">
          <Building2 className="h-8 w-8" />
        </span>
        <p className="text-lg font-bold text-slate-900">
          Chưa có hồ sơ nhà máy
        </p>
        <p className="text-sm text-slate-500">
          Hoàn thiện hồ sơ cơ sở chế biến để nông hộ tìm thấy và kết nối với
          bạn.
        </p>
        <button
          type="button"
          onClick={() => navigate(ROUTES.profileCreate)}
          className="mt-2 flex h-12 items-center gap-2 rounded-2xl bg-[#14532d] px-5 text-[15px] font-semibold text-white shadow-lg shadow-emerald-900/25 active:scale-[0.98]"
        >
          <Plus className="h-5 w-5" /> Thiết lập hồ sơ ngay
        </button>
      </div>
    </Shell>
  );
}

/** Mobile-app factory profile — owner view ("Hồ sơ nhà máy") or admin review view */
export function MobileMyFactoryProfile({
  profile: p,
  admin,
  onBack,
}: {
  profile: FactoryProfile;
  /** Admin: back button, approve/reject in the footer, no owner shortcuts */
  admin?: boolean;
  onBack?: () => void;
}) {
  const [, navigate] = useLocation();
  const review = REVIEW[p.reviewStatus];
  const address = [p.address, p.ward, p.province].filter(Boolean).join(", ");
  const hasGps = p.latitude != null && p.longitude != null;
  const certs = p.certificates ?? [];
  const images = p.images ?? [];

  return (
    <Shell
      onBack={onBack}
      footer={
        <WizardFooter>
          {admin && p.reviewStatus === "PENDING_REVIEW" ? (
            <>
              <button
                type="button"
                onClick={() => navigate(ROUTES.profileEdit(String(p.id)))}
                aria-label="Sửa hồ sơ"
                className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl border border-slate-300 bg-white text-slate-700 shadow-sm active:scale-95"
              >
                <Pencil className="h-5 w-5" />
              </button>
              <ReviewActions factory={p} mobile />
            </>
          ) : (
            <button
              type="button"
              onClick={() => navigate(ROUTES.profileEdit(String(p.id)))}
              className="flex h-14 flex-1 items-center justify-center gap-2 rounded-2xl bg-[#14532d] text-base font-semibold text-white shadow-lg shadow-emerald-900/25 active:scale-[0.98]"
            >
              <Pencil className="h-5 w-5" /> Chỉnh sửa hồ sơ
            </button>
          )}
        </WizardFooter>
      }
    >
      <h1 className="mb-3 text-[1.625rem] font-extrabold leading-tight tracking-tight text-[#0f3d22]">
        {admin ? "Chi tiết hồ sơ" : "Hồ sơ nhà máy"}
      </h1>

      {/* Identity + review status */}
      <section className="fsl-card-in rounded-3xl bg-white p-4 shadow-[0_4px_18px_rgba(20,83,45,0.1)] ring-1 ring-emerald-900/5">
        <div className="flex items-start gap-3">
          {p.logoUrl ? (
            <ImagePreview src={p.logoUrl} alt={p.name} className="rounded-2xl">
              <TileImage
                src={p.logoUrl}
                alt=""
                className="block h-16 w-16 rounded-2xl bg-white ring-1 ring-slate-200"
              />
            </ImagePreview>
          ) : (
            <span className="flex h-16 w-16 shrink-0 items-center justify-center rounded-2xl bg-emerald-50 text-emerald-700">
              <Building2 className="h-7 w-7" />
            </span>
          )}
          <div className="min-w-0 flex-1">
            <h2 className="text-lg font-extrabold leading-snug text-slate-900">
              {p.name}
            </h2>
            <p className="text-xs text-slate-500">{p.code}</p>
            {review && (
              <span
                className={`mt-1.5 inline-block rounded-full px-2.5 py-0.5 text-[11px] font-semibold ring-1 ${review.cls}`}
              >
                {review.label}
              </span>
            )}
          </div>
        </div>
      </section>

      {p.reviewStatus === "PENDING_REVIEW" && (
        <p className="mt-3 flex items-start gap-2 rounded-2xl bg-amber-50 px-3.5 py-3 text-[13px] text-amber-800 ring-1 ring-amber-100">
          <Clock className="mt-0.5 h-4 w-4 shrink-0" />
          {admin
            ? "Hồ sơ vừa được chủ nhà máy gửi/cập nhật, đang chờ duyệt."
            : "Hồ sơ đã được gửi và đang chờ quản trị viên duyệt."}
        </p>
      )}
      {p.reviewStatus === "REJECTED" && (
        <div className="mt-3 flex items-start gap-2 rounded-2xl bg-rose-50 px-3.5 py-3 text-[13px] text-rose-800 ring-1 ring-rose-100">
          <XCircle className="mt-0.5 h-4 w-4 shrink-0" />
          <div>
            <p className="font-semibold">
              {admin
                ? "Hồ sơ đã bị từ chối."
                : "Hồ sơ bị từ chối — vui lòng chỉnh sửa và gửi lại."}
            </p>
            {p.reviewNote && <p className="mt-0.5">Lý do: {p.reviewNote}</p>}
          </div>
        </div>
      )}

      <div className="mt-3 space-y-2.5">
        <Section
          icon={<Building2 className="h-4 w-4" />}
          title="Thông tin cơ sở"
        >
          <InfoRows
            rows={[
              ["Loại hình", p.organizationType?.name],
              ["Mã số thuế", p.taxCode],
              ["Năm thành lập", p.foundedYear],
            ]}
          />
        </Section>

        <Section icon={<Phone className="h-4 w-4" />} title="Người đại diện">
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
                  .join(" ")}
              </p>
              <p className="truncate text-xs text-slate-500">
                {[p.representativePhone, p.representativeEmail]
                  .filter(Boolean)
                  .join(" · ")}
              </p>
            </div>
          </div>
        </Section>

        {address && (
          <Section icon={<MapPin className="h-4 w-4" />} title="Địa điểm">
            <p className="text-sm text-slate-700">{address}</p>
            {hasGps && (
              <a
                href={`https://www.google.com/maps/dir/?api=1&destination=${p.latitude},${p.longitude}`}
                target="_blank"
                rel="noreferrer"
                className="mt-2 inline-flex items-center gap-1.5 rounded-full bg-emerald-50 px-3 py-1.5 text-[13px] font-semibold text-[#14532d] ring-1 ring-emerald-100"
              >
                <Navigation className="h-3.5 w-3.5" /> Xem trên bản đồ
              </a>
            )}
          </Section>
        )}

        {(p.processingServices?.length ?? 0) > 0 && (
          <Section icon={<Cog className="h-4 w-4" />} title="Dịch vụ cung cấp">
            <div className="flex flex-wrap gap-1.5">
              {p.processingServices.map((s) => (
                <Chip
                  key={s.id}
                  lead={
                    <TileImage
                      src={s.imageUrl}
                      alt=""
                      className="h-4 w-4 rounded-full"
                    />
                  }
                >
                  {s.name}
                </Chip>
              ))}
            </div>
          </Section>
        )}

        {(p.productGroups?.length ?? 0) > 0 && (
          <Section
            icon={<Leaf className="h-4 w-4 text-emerald-600" />}
            title="Nông sản chế biến"
          >
            <div className="-mx-3.5 flex gap-2 overflow-x-auto px-3.5 pb-0.5 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
              {p.productGroups.map((g) => (
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
          icon={<ShieldCheck className="h-4 w-4" />}
          title={`Chứng nhận (${certs.length})`}
        >
          {certs.length ? (
            <div className="flex flex-wrap gap-1.5">
              {certs.map((c, i) => (
                <Chip
                  key={c.id ?? i}
                  lead={
                    c.imageUrl ? (
                      <TileImage
                        src={c.imageUrl}
                        alt=""
                        className="h-4 w-4 rounded-full"
                      />
                    ) : (
                      <Award className="h-3.5 w-3.5 text-emerald-600" />
                    )
                  }
                >
                  {c.certificateType}
                </Chip>
              ))}
            </div>
          ) : (
            <p className="text-sm text-slate-400">Chưa khai báo chứng nhận</p>
          )}
        </Section>

        {images.length > 0 && (
          <Section icon={<ImageIcon className="h-4 w-4" />} title="Hình ảnh">
            <div className="grid grid-cols-3 gap-2">
              {images.map((img, i) => (
                <ImagePreview
                  key={img.id ?? i}
                  src={img.fileUrl}
                  alt={img.fileName ?? p.name}
                  className="block"
                >
                  <TileImage
                    src={img.fileUrl}
                    alt=""
                    className="block aspect-square w-full rounded-xl"
                  />
                </ImagePreview>
              ))}
            </div>
          </Section>
        )}

        {p.description && (
          <Section icon={<FileText className="h-4 w-4" />} title="Giới thiệu">
            <p className="whitespace-pre-line text-sm leading-relaxed text-slate-700">
              {p.description}
            </p>
          </Section>
        )}

        {!admin && (
          <Section icon={<Wrench className="h-4 w-4" />} title="Quản lý">
            <div className="divide-y divide-slate-100">
              <QuickLink
                href={ROUTES.machines}
                icon={<Wrench className="h-5 w-5" />}
                label="Máy & dây chuyền"
              />
              <QuickLink
                href={ROUTES.processingSchedules}
                icon={<CalendarRange className="h-5 w-5" />}
                label="Lịch nhận chế biến"
              />
              <QuickLink
                href={ROUTES.certificates}
                icon={<Award className="h-5 w-5" />}
                label="Chứng nhận sản xuất"
              />
            </div>
          </Section>
        )}
      </div>
    </Shell>
  );
}
