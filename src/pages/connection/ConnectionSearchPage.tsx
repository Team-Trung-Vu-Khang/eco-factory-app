import {
  Button,
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  useIsMobile,
  useToast,
} from "@Team-Trung-Vu-Khang/eco-shared-ui";
import { SearchX } from "lucide-react";
import { useMemo, useState } from "react";
import { Link, useLocation } from "wouter";
import { MATERIAL_CONDITION_LABELS } from "@/features/demand/constants";
import { PROCESSING_SERVICE_LABELS } from "@/features/factory";
import { CAPACITY_UNIT_LABELS } from "@/features/machine";
import PageWrapper from "@/components/common/PageWrapper";
import { ROUTES } from "@/config/routes";
import {
  useCancelConnectionRequest,
  useCreateConnectionRequest,
  useFactorySearch,
  useInfiniteFactorySearch,
  type FactorySearchParams,
  type MarketplaceScheduleItem,
} from "@/features/connection";
import { useIsFactoryAdmin } from "@/features/viewer";
import { useFillViewportHeight } from "@/hooks/useFillViewportHeight";
import { useMobileUiMode } from "@/hooks/useMobileUiMode";
import { FactoryResultTable } from "./components/FactoryResultTable";
import { FactorySearchLanding } from "./components/FactorySearchLanding";
import { MobileConnectConfirm } from "./mobile/MobileConnectConfirm";
import type { MobileSearchNavState } from "./mobile/MobileFactoryDetailPage";
import { MobileResultList } from "./mobile/MobileResultList";
import { MobileSearchWizard } from "./mobile/MobileSearchWizard";
import { WizardHeader } from "./mobile/wizard-ui";
import { SearchFilters } from "./components/SearchFilters";
import { searchSession } from "./search-session";

export default function ConnectionSearchPage() {
  const { toast } = useToast();
  const [, navigate] = useLocation();
  const isAdmin = useIsFactoryAdmin();
  const mode = isAdmin ? "admin" : "member";

  const [params, setParams] = useState<FactorySearchParams | undefined>(() =>
    searchSession.read<FactorySearchParams>(`${mode}:params`),
  );

  // Mobile app only: intro screen first; skip it when a previous search is restored
  const isMobile = useIsMobile();
  // Wizard background fills down to the screen bottom (no page grey below short content)
  const [fillRef, fillHeight] = useFillViewportHeight<HTMLDivElement>();
  const mobileUiMode = useMobileUiMode();
  const mobileApp = isMobile && mobileUiMode === "app" && !isAdmin;
  // 0 = landing, 1–2 = wizard, 3 = results. A restored search opens on results.
  // Step 3 sub-screens: a result's detail or the confirm-before-send screen
  // Confirm-before-send screen; may be opened from the detail page via history state
  const [mobileView, setMobileView] = useState<{
    kind: "confirm";
    schedule: MarketplaceScheduleItem;
  } | null>(() => {
    const s = (window.history.state as MobileSearchNavState | null)
      ?.confirmSchedule;
    return s ? { kind: "confirm", schedule: s } : null;
  });
  // Came from the detail page → back returns there
  const closeConfirm = () => {
    setMobileView(null);
    setDetailFirst(false);
    // Don't reopen the confirm screen on refresh
    window.history.replaceState(null, "");
  };
  const [detailFirst, setDetailFirst] = useState(
    () =>
      !!(window.history.state as MobileSearchNavState | null)?.confirmSchedule,
  );
  const [mobileStep, setMobileStep] = useState<0 | 1 | 2 | 3>(() =>
    params || mobileView ? 3 : 0,
  );

  const handleSearch = (nextParams: FactorySearchParams) => {
    setParams(nextParams);
    searchSession.write(`${mode}:params`, nextParams);
  };

  const handleReset = () => {
    setParams(undefined);
    searchSession.clear(`${mode}:params`);
    searchSession.clear(`${mode}:form`);
  };

  // Desktop: one page via the table; mobile app: infinite scroll
  const search = useFactorySearch(mobileApp ? undefined : params);
  const mobileSearch = useInfiniteFactorySearch(mobileApp ? params : undefined);
  const mobileResults = useMemo(
    () => mobileSearch.data?.pages.flatMap((pg) => pg.content) ?? [],
    [mobileSearch.data],
  );
  const connectMutation = useCreateConnectionRequest();
  const results = search.data?.content ?? [];
  const totalElements = search.data?.totalElements ?? results.length;

  const [connectingId, setConnectingId] = useState<number>();
  const cancelMutation = useCancelConnectionRequest();
  const [cancelTarget, setCancelTarget] =
    useState<MarketplaceScheduleItem | null>(null);

  const handleCancel = async () => {
    const reqId = cancelTarget?.myConnectionRequest?.id;
    if (!reqId) return;
    try {
      await cancelMutation.mutateAsync(reqId);
      toast({
        title: "Đã hủy",
        description: `Đã hủy kết nối với ${cancelTarget.profile.name}.`,
      });
      setCancelTarget(null);
    } catch (error) {
      toast({
        title: "Không thể hủy",
        description: (error as Error).message,
        variant: "destructive",
      });
    }
  };

  const [confirmTarget, setConfirmTarget] =
    useState<MarketplaceScheduleItem | null>(null);

  /** Returns true when sent; `message` overrides the search's note (mobile confirm screen) */
  const handleConnect = async (
    schedule: MarketplaceScheduleItem,
    message?: string,
  ): Promise<boolean> => {
    if (!params) return false;
    setConnectingId(schedule.id);
    try {
      await connectMutation.mutateAsync({
        scheduleId: schedule.id,
        crops: params.crops,
        processingServiceIds: params.processingServiceIds,
        maxCapacity: params.maxCapacity,
        capacityUnit: params.capacityUnit,
        materialCondition: params.materialCondition,
        packagingRequirement: params.packagingRequirement,
        technicalRequirement: params.technicalRequirement,
        message:
          message !== undefined ? message.trim() || undefined : params.message,
      });
      setConfirmTarget(null);

      toast({
        title: "Đã gửi yêu cầu kết nối",
        description: `Đã gửi yêu cầu tới ${schedule.profile.name} — ${schedule.machine.name}.`,
        action: (
          <Button
            size="sm"
            variant="outline"
            onClick={() => navigate(ROUTES.connectionHistory)}
          >
            Xem lịch sử
          </Button>
        ),
      });
      return true;
    } catch (error) {
      toast({
        title: "Không thể gửi yêu cầu",
        description: (error as Error).message,
        variant: "destructive",
      });
      return false;
    } finally {
      setConnectingId(undefined);
    }
  };

  const resultsSection = (
    <>
      {!params ? (
        <p className="py-10 text-center text-sm text-slate-500">
          Bấm "Xem nhà máy phù hợp" để xem danh sách nhà máy theo điều kiện đã
          nhập.
        </p>
      ) : search.isLoading ? (
        <div className="space-y-3">
          {[0, 1].map((i) => (
            <div
              key={i}
              className="h-36 animate-pulse rounded-2xl bg-slate-100"
            />
          ))}
        </div>
      ) : (
        <section className="space-y-3">
          <div className="flex items-baseline justify-between gap-4">
            <h2 className="text-sm font-semibold text-slate-900">
              {totalElements} nhà máy phù hợp
            </h2>
            <Link
              href={ROUTES.connectionHistory}
              className="text-sm text-emerald-700 hover:underline"
            >
              Lịch sử kết nối
            </Link>
          </div>
          {results.length === 0 ? (
            <div className="flex flex-col items-center gap-2 rounded-2xl border border-dashed border-slate-200 py-10 text-center text-sm text-slate-500">
              <SearchX className="h-5 w-5" />
              Chưa có nhà máy đang nhận chế biến phù hợp. Thử mở rộng phạm vi
              hoặc bỏ bớt điều kiện.
            </div>
          ) : (
            <FactoryResultTable
              results={results}
              mode={isAdmin ? "admin" : "member"}
              connectingId={connectingId}
              onConnect={setConfirmTarget}
              onCancel={isAdmin ? undefined : setCancelTarget}
            />
          )}
        </section>
      )}
    </>
  );

  const dialogs = (
    <>
      <Dialog
        open={!!confirmTarget}
        onOpenChange={(o) =>
          !o && !connectMutation.isPending && setConfirmTarget(null)
        }
      >
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Gửi yêu cầu kết nối?</DialogTitle>
            <DialogDescription>
              Nhà máy sẽ nhận được thông tin liên hệ và nhu cầu chế biến của
              bạn.
            </DialogDescription>
          </DialogHeader>
          {confirmTarget && (
            <dl className="grid max-h-[50vh] grid-cols-[7rem_1fr] gap-x-3 gap-y-1.5 overflow-y-auto rounded-lg bg-slate-50 px-3 py-2.5 text-sm">
              {confirmRows(confirmTarget, params).map(([label, value]) => (
                <div key={label} className="contents">
                  <dt className="text-slate-500">{label}</dt>
                  <dd className="whitespace-pre-line break-words text-slate-800">
                    {value}
                  </dd>
                </div>
              ))}
            </dl>
          )}
          <DialogFooter>
            <Button
              variant="outline"
              disabled={connectMutation.isPending}
              onClick={() => setConfirmTarget(null)}
            >
              Hủy
            </Button>
            <Button
              disabled={connectMutation.isPending}
              onClick={() => confirmTarget && handleConnect(confirmTarget)}
            >
              {connectMutation.isPending ? "Đang gửi..." : "Gửi yêu cầu"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      <Dialog
        open={!!cancelTarget}
        onOpenChange={(o) =>
          !o && !cancelMutation.isPending && setCancelTarget(null)
        }
      >
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>
              {cancelTarget?.myConnectionRequest?.status === "SUCCESS"
                ? "Hủy kết nối?"
                : "Hủy yêu cầu kết nối?"}
            </DialogTitle>
            <DialogDescription>
              {cancelTarget?.profile.name} · {cancelTarget?.machine.name}
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button
              variant="destructive"
              disabled={cancelMutation.isPending}
              onClick={handleCancel}
            >
              {cancelMutation.isPending ? "Đang hủy..." : "Hủy"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );

  if (mobileApp) {
    if (mobileStep === 0)
      return <FactorySearchLanding onStart={() => setMobileStep(1)} />;
    return (
      <div
        ref={fillRef}
        style={{ minHeight: fillHeight }}
        className="-mx-4 -mt-4 -mb-[calc(5.5rem+env(safe-area-inset-bottom))] flex flex-col overflow-x-clip bg-[#f7f5ee] px-4 pt-4"
      >
        <WizardHeader
          step={mobileStep}
          onBack={() =>
            mobileView
              ? detailFirst
                ? window.history.back()
                : closeConfirm()
              : setMobileStep((s) => (s - 1) as 0 | 1 | 2)
          }
        />
        {mobileStep === 3 && mobileView ? (
          <MobileConnectConfirm
            schedule={mobileView.schedule}
            params={params}
            sending={connectMutation.isPending}
            onEditCriteria={(step) => {
              closeConfirm();
              setMobileStep(step);
            }}
            onSend={async (message) => {
              if (await handleConnect(mobileView.schedule, message))
                closeConfirm();
            }}
          />
        ) : mobileStep === 3 ? (
          <MobileResultList
            results={mobileResults}
            total={mobileSearch.data?.pages[0]?.totalElements ?? 0}
            loading={mobileSearch.isLoading}
            hasMore={!!mobileSearch.hasNextPage}
            loadingMore={mobileSearch.isFetchingNextPage}
            onLoadMore={() => mobileSearch.fetchNextPage()}
            connectingId={connectingId}
            onDetail={(schedule) =>
              navigate(
                `${ROUTES.profileDetail(String(schedule.profile.id))}?scheduleId=${schedule.id}`,
                { state: { schedule } satisfies MobileSearchNavState },
              )
            }
            onConnect={(schedule) => {
              setDetailFirst(false);
              setMobileView({ kind: "confirm", schedule });
            }}
            onCancel={setCancelTarget}
            onEditCriteria={() => setMobileStep(1)}
          />
        ) : (
          <MobileSearchWizard
            step={mobileStep}
            searching={mobileSearch.isFetching}
            onNext={() => setMobileStep(2)}
            onSearch={(next) => {
              handleSearch(next);
              setMobileStep(3);
            }}
          />
        )}
        {dialogs}
      </div>
    );
  }

  return (
    <PageWrapper
      title="Tìm kiếm nhà máy"
      description={
        isAdmin
          ? "Tìm nhà máy theo khu vực, dịch vụ, nhóm nông sản và chứng nhận"
          : "Hãy cung cấp để tìm kiếm nhà máy phù hợp với các tiêu chí theo yêu cầu"
      }
      overflow="visible"
    >
      <div className="space-y-6">
        <SearchFilters
          key={isAdmin ? "admin" : "member"}
          mode={isAdmin ? "admin" : "member"}
          searching={search.isFetching}
          onSearch={handleSearch}
          onReset={handleReset}
        />

        {resultsSection}
      </div>
      {dialogs}
    </PageWrapper>
  );
}

/** Nội dung sẽ gửi cho nhà máy — chỉ liệt kê các trường đã nhập */
function confirmRows(
  schedule: MarketplaceScheduleItem,
  p?: FactorySearchParams,
): [string, string][] {
  const condition = p?.materialCondition
    ? (MATERIAL_CONDITION_LABELS[
        p.materialCondition as keyof typeof MATERIAL_CONDITION_LABELS
      ] ?? p.materialCondition)
    : undefined;
  const services = p?.processingServiceIds
    ?.map((id) => PROCESSING_SERVICE_LABELS[String(id)] ?? `#${id}`)
    .join(", ");
  const unit = p?.capacityUnit
    ? (CAPACITY_UNIT_LABELS[p.capacityUnit] ?? p.capacityUnit)
    : "";
  const rows: [string, string | null | undefined][] = [
    ["Nhà máy", schedule.profile.name],
    ["Máy", schedule.machine.name],
    ["Dịch vụ", services],
    ["Nông sản", p?.crops?.join(", ")],
    [
      "Sản lượng",
      p?.maxCapacity ? `${p.maxCapacity} ${unit}`.trim() : undefined,
    ],
    ["Tình trạng", condition],
    ["Đóng gói", p?.packagingRequirement],
    ["Kỹ thuật", p?.technicalRequirement],
    ["Lời nhắn", p?.message],
  ];
  return rows.filter((r): r is [string, string] => !!r[1]);
}
