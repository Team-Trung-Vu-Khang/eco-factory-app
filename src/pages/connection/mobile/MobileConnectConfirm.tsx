import {
  Boxes,
  ChevronRight,
  ClipboardList,
  Loader2,
  MapPin,
  NotebookPen,
  Package,
  Scale,
  Send,
  Sprout,
} from "lucide-react";
import { useMemo, useState, type ReactNode } from "react";
import {
  useMarketplaceProfile,
  type FactorySearchParams,
  type MarketplaceScheduleItem,
} from "@/features/connection";
import { MATERIAL_CONDITION_LABELS } from "@/features/demand/constants";
import { CAPACITY_UNIT_LABELS } from "@/features/machine";
import { useActiveProcessingServices } from "@/features/processing-service";
import { useActiveProductGroups } from "@/features/product-group";
import { Block, VerifiedBadge } from "./result-ui";
import { SelectedBadge, TileImage, WizardFooter } from "./wizard-ui";

function Row({
  icon,
  children,
  onClick,
}: {
  icon: ReactNode;
  children: ReactNode;
  onClick?: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={!onClick}
      className="flex w-full items-center gap-3 py-2.5 text-left disabled:cursor-default"
    >
      <span className="flex h-9 w-9 shrink-0 items-center justify-center overflow-hidden rounded-xl bg-emerald-50 text-[#14532d]">
        {icon}
      </span>
      <span className="min-w-0 flex-1 text-sm text-slate-800">{children}</span>
      {onClick && <ChevronRight className="h-4 w-4 shrink-0 text-slate-400" />}
    </button>
  );
}

/** Review what CreateConnectionRequestInput will carry, then send */
export function MobileConnectConfirm({
  schedule,
  params,
  sending,
  onEditCriteria,
  onSend,
}: {
  schedule: MarketplaceScheduleItem;
  params?: FactorySearchParams;
  sending: boolean;
  onEditCriteria: (step: 1 | 2) => void;
  onSend: (message: string) => void;
}) {
  const [message, setMessage] = useState(params?.message ?? "");
  const { data: profile } = useMarketplaceProfile(schedule.profile.id, {
    scheduleId: schedule.id,
  });
  const { data: services = [] } = useActiveProcessingServices();
  const { data: groups = [] } = useActiveProductGroups();

  const cropImage = useMemo(() => {
    const m = new Map<string, string | null | undefined>();
    for (const g of groups)
      for (const c of g.crops ?? []) if (!m.has(c)) m.set(c, g.imageUrl);
    return m;
  }, [groups]);

  const chosenServices = services.filter((s) =>
    params?.processingServiceIds?.includes(Number(s.id)),
  );
  const crops = params?.crops ?? [];
  const place = [params?.ward, params?.province].filter(Boolean).join(", ");
  const unit = params?.capacityUnit
    ? CAPACITY_UNIT_LABELS[params.capacityUnit]
    : "";
  const condition = params?.materialCondition
    ? (MATERIAL_CONDITION_LABELS[
        params.materialCondition as keyof typeof MATERIAL_CONDITION_LABELS
      ] ?? params.materialCondition)
    : undefined;
  const thumbs = profile?.images ?? [];
  const cover =
    thumbs[0]?.fileUrl ?? schedule.machine.imageUrl ?? schedule.profile.logoUrl;

  return (
    <div className="pb-2">
      <h1 className="text-[1.6rem] font-extrabold leading-tight tracking-tight text-[#0f3d22]">
        Xác nhận nhu cầu kết nối
      </h1>
      <p className="mt-1 text-sm text-slate-600">
        Vui lòng kiểm tra lại thông tin trước khi gửi
      </p>

      <div className="mt-4 space-y-3">
        <Block>
          <div className="flex gap-3">
            <TileImage
              src={cover}
              alt={schedule.profile.name}
              className="h-20 w-24 shrink-0 rounded-xl"
            />
            <div className="min-w-0 flex-1">
              <p className="font-bold leading-snug text-slate-900">
                {schedule.profile.name}
              </p>
              <VerifiedBadge className="mt-1 bg-emerald-50 px-1.5 shadow-none" />
              {schedule.profile.province && (
                <p className="mt-1 flex items-center gap-1 text-xs text-slate-500">
                  <MapPin className="h-3.5 w-3.5" />
                  {[schedule.profile.ward, schedule.profile.province]
                    .filter(Boolean)
                    .join(", ")}
                </p>
              )}
            </div>
          </div>
          {thumbs.length > 1 && (
            <div className="mt-3 grid grid-cols-4 gap-1.5">
              {thumbs.slice(1, 5).map((t) => (
                <TileImage
                  key={t.id}
                  src={t.fileUrl}
                  alt=""
                  className="aspect-[4/3] w-full rounded-lg"
                />
              ))}
            </div>
          )}
        </Block>

        <Block title="Thông tin nhu cầu">
          <div className="divide-y divide-slate-100">
            <Row
              onClick={() => onEditCriteria(1)}
              icon={
                crops[0] ? (
                  <TileImage
                    src={cropImage.get(crops[0])}
                    alt=""
                    className="h-9 w-9"
                  />
                ) : (
                  <Sprout className="h-4 w-4" />
                )
              }
            >
              {crops.length ? (
                crops.join(", ")
              ) : (
                <span className="text-slate-400">Chưa chọn nông sản</span>
              )}
            </Row>
            <Row
              onClick={() => onEditCriteria(1)}
              icon={<Scale className="h-4 w-4" />}
            >
              {params?.maxCapacity ? (
                `${params.maxCapacity} ${unit}`
              ) : (
                <span className="text-slate-400">Chưa nhập số lượng</span>
              )}
            </Row>
            <Row
              onClick={() => onEditCriteria(1)}
              icon={<MapPin className="h-4 w-4" />}
            >
              {place || <span className="text-slate-400">Toàn quốc</span>}
            </Row>
          </div>
        </Block>

        <Block title="Dịch vụ cần">
          {chosenServices.length ? (
            <div className="-mx-4 flex gap-2 overflow-x-auto px-4 py-1 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
              {chosenServices.map((s) => (
                <div
                  key={s.id}
                  className="relative flex w-20 shrink-0 flex-col items-center gap-1 rounded-2xl bg-emerald-50/60 p-1.5 ring-1 ring-emerald-100"
                >
                  <TileImage
                    src={s.imageUrl}
                    alt={s.name}
                    className="h-12 w-full rounded-xl"
                  />
                  <span className="line-clamp-2 text-center text-[11px] font-medium leading-tight text-slate-700">
                    {s.name}
                  </span>
                  <SelectedBadge />
                </div>
              ))}
            </div>
          ) : (
            <button
              type="button"
              onClick={() => onEditCriteria(2)}
              className="text-sm text-emerald-700"
            >
              Chưa chọn dịch vụ — chọn ngay
            </button>
          )}
          {(params?.technicalRequirement ||
            params?.packagingRequirement ||
            condition) && (
            <div className="mt-2 divide-y divide-slate-100 border-t border-slate-100">
              {params?.technicalRequirement && (
                <Row
                  onClick={() => onEditCriteria(2)}
                  icon={<ClipboardList className="h-4 w-4" />}
                >
                  <span className="block font-semibold">Yêu cầu kỹ thuật</span>
                  <span className="block truncate text-xs text-slate-500">
                    {params.technicalRequirement}
                  </span>
                </Row>
              )}
              {params?.packagingRequirement && (
                <Row
                  onClick={() => onEditCriteria(2)}
                  icon={<Package className="h-4 w-4" />}
                >
                  <span className="block font-semibold">Yêu cầu đóng gói</span>
                  <span className="block truncate text-xs text-slate-500">
                    {params.packagingRequirement}
                  </span>
                </Row>
              )}
              {condition && (
                <Row
                  onClick={() => onEditCriteria(2)}
                  icon={<Boxes className="h-4 w-4" />}
                >
                  <span className="block font-semibold">
                    Tình trạng nguyên liệu
                  </span>
                  <span className="block text-xs text-slate-500">
                    {condition}
                  </span>
                </Row>
              )}
            </div>
          )}
        </Block>

        <Block
          icon={<NotebookPen className="h-4 w-4" />}
          title="Ghi chú thêm (nếu có)"
        >
          <textarea
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            rows={3}
            placeholder="Ví dụ: cần tư vấn thêm về bao bì, thời gian nhận..."
            className="w-full resize-none rounded-xl border border-slate-200 bg-white p-3 text-sm outline-none placeholder:text-slate-400 focus:border-emerald-600 focus:ring-2 focus:ring-emerald-600/15"
          />
        </Block>
      </div>

      <WizardFooter>
        <button
          type="button"
          onClick={() => onSend(message)}
          disabled={sending}
          className="flex h-14 flex-1 items-center justify-center gap-2 rounded-2xl bg-[#14532d] text-base font-semibold text-white shadow-lg shadow-emerald-900/25 active:scale-[0.98] disabled:opacity-70"
        >
          {sending ? (
            <Loader2 className="h-5 w-5 animate-spin" />
          ) : (
            <Send className="h-5 w-5" />
          )}
          Gửi yêu cầu
        </button>
      </WizardFooter>
    </div>
  );
}
