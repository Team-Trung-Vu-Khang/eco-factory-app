import { DeleteDialog, useToast } from "@Team-Trung-Vu-Khang/eco-shared-ui";
import dayjs from "dayjs";
import {
  Award,
  Building2,
  CalendarCheck,
  CalendarX,
  Hash,
  Landmark,
  Pencil,
  ScrollText,
  Trash2,
} from "lucide-react";
import { useState, type ReactNode } from "react";
import { useLocation } from "wouter";
import { ImagePreview } from "@/components/common/ImagePreview";
import { ROUTES } from "@/config/routes";
import { useDeleteCertificate, type Certificate } from "@/features/certificate";
import {
  CERTIFICATION_ISSUER_LABELS,
  CERTIFICATION_TYPE_LABELS,
} from "@/features/factory";
import { useFillViewportHeight } from "@/hooks/useFillViewportHeight";
import {
  TileImage,
  WizardFooter,
  WizardHeader,
} from "@/pages/connection/mobile/wizard-ui";
import { ValidityBadge } from "./ValidityBadge";

const label = (map: object, v?: string) =>
  v ? ((map as Record<string, string>)[v] ?? v) : undefined;
const date = (d?: string) => (d ? dayjs(d).format("DD/MM/YYYY") : undefined);

function Row({
  icon,
  title,
  value,
}: {
  icon: ReactNode;
  title: string;
  value?: ReactNode;
}) {
  return (
    <div className="flex items-center gap-3 py-2.5">
      <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-emerald-50 text-[#14532d]">
        {icon}
      </span>
      <span className="flex-1 text-sm text-slate-500">{title}</span>
      <span
        className={`text-right text-sm font-semibold ${value ? "text-slate-900" : "text-slate-400"}`}
      >
        {value || "—"}
      </span>
    </div>
  );
}

/** Share of the validity period already used (0–100), when both dates are known */
function usedPercent(issued?: string, expiry?: string) {
  if (!issued || !expiry) return undefined;
  const start = dayjs(issued).valueOf();
  const end = dayjs(expiry).valueOf();
  if (end <= start) return 100;
  return Math.min(
    100,
    Math.max(0, ((Date.now() - start) / (end - start)) * 100),
  );
}

/** Mobile-app certificate detail (factory member) */
export function MobileCertificateDetail({
  certificate: c,
  canEdit,
  canDelete = canEdit,
}: {
  certificate: Certificate;
  canEdit: boolean;
  /** Admin can delete but not edit */
  canDelete?: boolean;
}) {
  const [, navigate] = useLocation();
  const { toast } = useToast();
  const [fillRef, fillHeight] = useFillViewportHeight<HTMLDivElement>();
  const [confirmDelete, setConfirmDelete] = useState(false);
  const del = useDeleteCertificate();

  const title =
    label(CERTIFICATION_TYPE_LABELS, c.certificateType) ?? c.certificateType;
  const used = usedPercent(c.issuedDate, c.expiryDate);
  // Issued in the future → nothing elapsed yet; say so instead of an empty bar
  const notYetValid =
    !!c.issuedDate && dayjs(c.issuedDate).isAfter(dayjs(), "day");
  const barColor =
    c.status === "EXPIRED"
      ? "bg-rose-500"
      : c.status === "EXPIRING_SOON"
        ? "bg-amber-500"
        : "bg-emerald-500";

  const goBack = () =>
    window.history.length > 1
      ? window.history.back()
      : navigate(ROUTES.certificates);

  const handleDelete = async () => {
    try {
      await del.mutateAsync(c.id);
      toast({
        title: "Đã xóa",
        description: `Đã xóa chứng nhận ${c.certificateNumber ?? ""}.`,
      });
      navigate(ROUTES.certificates, { replace: true });
    } catch (error) {
      toast({
        title: "Không thể xóa",
        description: (error as Error).message,
        variant: "destructive",
      });
    }
  };

  return (
    <div
      ref={fillRef}
      style={{ minHeight: fillHeight }}
      className="-mx-4 -mt-4 -mb-[calc(5.5rem+env(safe-area-inset-bottom))] flex flex-col overflow-x-clip bg-[#f7f5ee] px-4 pt-4"
    >
      <WizardHeader onBack={goBack} />

      <div className="relative -mt-14 pb-2">
        <h1 className="mb-3 text-[1.625rem] font-extrabold leading-tight tracking-tight text-[#0f3d22]">
          Chi tiết chứng nhận
        </h1>

        {/* Certificate photo is the evidence — give it room */}
        <div className="fsl-card-in overflow-hidden rounded-3xl bg-white shadow-[0_4px_18px_rgba(20,83,45,0.1)] ring-1 ring-emerald-900/5">
          {c.imageUrl ? (
            <ImagePreview
              src={c.imageUrl}
              alt={title}
              className="block w-full rounded-none"
            >
              <TileImage
                src={c.imageUrl}
                alt={title}
                className="block max-h-72 w-full bg-slate-50 object-contain"
              />
            </ImagePreview>
          ) : (
            <div className="flex h-36 flex-col items-center justify-center gap-2 bg-emerald-50/60 text-emerald-700">
              <Award className="h-10 w-10" />
              <span className="text-xs text-slate-500">
                Chưa có ảnh chứng nhận
              </span>
            </div>
          )}

          <div className="p-4">
            <div className="flex items-start justify-between gap-3">
              <h2 className="text-xl font-extrabold leading-snug text-slate-900">
                {title}
              </h2>
              <span className="shrink-0">
                <ValidityBadge
                  validity={c.status}
                  daysToExpiry={c.daysUntilExpiry ?? null}
                />
              </span>
            </div>
            {c.certificateNumber && (
              <p className="mt-0.5 text-sm text-slate-500">
                Số: {c.certificateNumber}
              </p>
            )}

            {notYetValid ? (
              <p className="mt-4 rounded-xl bg-sky-50 px-3 py-2 text-[13px] text-sky-800 ring-1 ring-sky-100">
                Chưa đến ngày hiệu lực — có hiệu lực từ{" "}
                <b>{date(c.issuedDate)}</b>
                {c.expiryDate && (
                  <>
                    {" "}
                    đến <b>{date(c.expiryDate)}</b>
                  </>
                )}
              </p>
            ) : (
              used !== undefined && (
                <div className="mt-4">
                  <div className="h-2 overflow-hidden rounded-full bg-slate-100">
                    <div
                      className={`h-full rounded-full ${barColor} transition-[width] duration-700`}
                      style={{ width: `${Math.max(used, 3)}%` }}
                    />
                  </div>
                  <div className="mt-1.5 flex justify-between text-[11px] text-slate-500">
                    <span>Cấp {date(c.issuedDate)}</span>
                    <span>Hết hạn {date(c.expiryDate)}</span>
                  </div>
                </div>
              )
            )}
          </div>
        </div>

        <section className="mt-3 rounded-3xl bg-white px-4 py-1.5 shadow-[0_2px_12px_rgba(20,83,45,0.06)] ring-1 ring-emerald-900/5">
          <div className="divide-y divide-slate-100">
            {c.profile?.name && (
              <Row
                icon={<Building2 className="h-4 w-4" />}
                title="Nhà máy"
                value={c.profile.name}
              />
            )}
            <Row
              icon={<Hash className="h-4 w-4" />}
              title="Số chứng nhận"
              value={c.certificateNumber}
            />
            <Row
              icon={<Landmark className="h-4 w-4" />}
              title="Đơn vị cấp"
              value={label(CERTIFICATION_ISSUER_LABELS, c.issuer)}
            />
            <Row
              icon={<CalendarCheck className="h-4 w-4" />}
              title="Ngày cấp"
              value={date(c.issuedDate)}
            />
            <Row
              icon={<CalendarX className="h-4 w-4" />}
              title="Ngày hết hạn"
              value={date(c.expiryDate) ?? "Không thời hạn"}
            />
          </div>
        </section>

        <section className="mt-3 rounded-3xl bg-white p-4 shadow-[0_2px_12px_rgba(20,83,45,0.06)] ring-1 ring-emerald-900/5">
          <h3 className="mb-1.5 flex items-center gap-2 text-[15px] font-bold text-slate-900">
            <ScrollText className="h-4 w-4 text-slate-500" /> Phạm vi chứng nhận
          </h3>
          <p
            className={`whitespace-pre-line text-sm leading-relaxed ${c.scopeDescription ? "text-slate-700" : "text-slate-400"}`}
          >
            {c.scopeDescription || "Chưa có mô tả phạm vi"}
          </p>
        </section>

        {c.updatedAt && (
          <p className="mt-3 text-center text-[11px] text-slate-400">
            Cập nhật {dayjs(c.updatedAt).format("DD/MM/YYYY HH:mm")}
          </p>
        )}
      </div>

      {(canEdit || canDelete) && (
        <WizardFooter>
          {canDelete && (
            <button
              type="button"
              onClick={() => setConfirmDelete(true)}
              aria-label="Xóa chứng nhận"
              className={`flex h-14 shrink-0 items-center justify-center gap-2 rounded-2xl border border-rose-200 bg-white text-rose-600 shadow-sm active:scale-95 ${canEdit ? "w-14" : "flex-1 text-base font-semibold"}`}
            >
              <Trash2 className="h-5 w-5" />
              {!canEdit && "Xóa chứng nhận"}
            </button>
          )}
          {canEdit && (
            <button
              type="button"
              onClick={() => navigate(ROUTES.certificateEdit(String(c.id)))}
              className="flex h-14 flex-1 items-center justify-center gap-2 rounded-2xl bg-[#14532d] text-base font-semibold text-white shadow-lg shadow-emerald-900/25 active:scale-[0.98]"
            >
              <Pencil className="h-5 w-5" /> Chỉnh sửa
            </button>
          )}
        </WizardFooter>
      )}

      <DeleteDialog
        open={confirmDelete}
        onOpenChange={setConfirmDelete}
        onConfirm={handleDelete}
        loading={del.isPending}
        description={`Bạn có chắc chắn muốn xóa chứng nhận "${c.certificateNumber ?? title}"?`}
      />
    </div>
  );
}
