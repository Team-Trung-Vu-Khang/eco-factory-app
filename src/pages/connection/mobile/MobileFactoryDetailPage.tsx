import { useLocation } from "wouter";
import {
  DetailPageSkeleton,
  NotFoundState,
} from "@/components/common/PageState";
import { ROUTES } from "@/config/routes";
import {
  useFactorySearch,
  type MarketplaceScheduleItem,
} from "@/features/connection";
import { useFillViewportHeight } from "@/hooks/useFillViewportHeight";
import { MobileFactoryDetail } from "./MobileFactoryDetail";
import { WizardHeader } from "./wizard-ui";

/** history.state shape shared between the search page and this page */
export interface MobileSearchNavState {
  schedule?: MarketplaceScheduleItem;
  confirmSchedule?: MarketplaceScheduleItem;
}

/** Mobile-app route view for a search result: /profiles/:id?scheduleId= */
export function MobileFactoryDetailPage({
  profileId,
  scheduleId,
}: {
  profileId: string;
  scheduleId: string;
}) {
  const [, navigate] = useLocation();
  const [fillRef, fillHeight] = useFillViewportHeight<HTMLDivElement>();
  const passed = (window.history.state as MobileSearchNavState | null)
    ?.schedule;
  const fromState =
    passed && String(passed.id) === scheduleId ? passed : undefined;

  // Opened directly / refreshed: load the listing from the marketplace search API
  const search = useFactorySearch(
    fromState ? undefined : { profileId: Number(profileId), size: 100 },
  );
  const schedule =
    fromState ?? search.data?.content?.find((s) => String(s.id) === scheduleId);

  const goBack = () =>
    window.history.length > 1
      ? window.history.back()
      : navigate(ROUTES.connectionSearch);

  return (
    <div
      ref={fillRef}
      style={{ minHeight: fillHeight }}
      className="-mx-4 -mt-4 -mb-[calc(5.5rem+env(safe-area-inset-bottom))] flex flex-col overflow-x-clip bg-[#f7f5ee] px-4 pt-4"
    >
      <WizardHeader onBack={goBack} />
      {schedule ? (
        <MobileFactoryDetail
          schedule={schedule}
          onConnect={(s) =>
            navigate(ROUTES.connectionSearch, {
              state: { confirmSchedule: s } satisfies MobileSearchNavState,
            })
          }
        />
      ) : search.isLoading ? (
        <DetailPageSkeleton />
      ) : (
        <NotFoundState
          message="Tin nhận chế biến không còn hoặc đã đóng."
          onBack={goBack}
        />
      )}
    </div>
  );
}
