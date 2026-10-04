import { Button, useIsMobile } from "@Team-Trung-Vu-Khang/eco-shared-ui";
import { ArrowLeft } from "lucide-react";
import { useLocation, useParams } from "wouter";
import PageWrapper from "@/components/common/PageWrapper";
import { ROUTES } from "@/config/routes";
import {
  useAdminFactoryProfile,
  type FactoryProfile,
} from "@/features/factory";
import { useMarketplaceProfile } from "@/features/connection";
import { useIsFactoryAdmin } from "@/features/viewer";
import { useMobileUiMode } from "@/hooks/useMobileUiMode";
import { MobileFactoryDetailPage } from "@/pages/connection/mobile/MobileFactoryDetailPage";
import { FactoryProfileView } from "./components/detail/FactoryProfileView";
import { ReviewActions } from "./components/detail/ReviewActions";
import { MobileMyFactoryProfile } from "./components/MobileMyFactoryProfile";
import {
  DetailPageSkeleton,
  NotFoundState,
} from "@/components/common/PageState";

export default function FactoryDetailPage() {
  const { id } = useParams<{ id: string }>();
  const [, navigate] = useLocation();
  const isAdmin = useIsFactoryAdmin();

  const scheduleId =
    typeof window !== "undefined"
      ? (new URLSearchParams(window.location.search).get("scheduleId") ??
        undefined)
      : undefined;

  // Mobile app: a search result opens the mobile detail screen instead
  const isMobile = useIsMobile();
  const mobileUiMode = useMobileUiMode();
  const mobileResult =
    isMobile && mobileUiMode === "app" && !isAdmin && !!scheduleId;

  const adminQuery = useAdminFactoryProfile(id, { enabled: isAdmin && !!id });
  const marketQuery = useMarketplaceProfile(id, {
    scheduleId,
    enabled: !isAdmin && !!id && !mobileResult,
  });

  const query = isAdmin ? adminQuery : marketQuery;
  const factory = query.data as unknown as FactoryProfile | undefined;
  const { isLoading, isError } = query;

  const goBack = () =>
    window.history.length > 1
      ? window.history.back()
      : navigate(ROUTES.profile);

  if (mobileResult && id && scheduleId)
    return <MobileFactoryDetailPage profileId={id} scheduleId={scheduleId} />;

  // Mobile app, admin: same mobile profile screen with review actions
  if (isMobile && mobileUiMode === "app" && isAdmin && factory)
    return <MobileMyFactoryProfile profile={factory} admin onBack={goBack} />;

  return (
    <PageWrapper>
      {isLoading ? (
        <DetailPageSkeleton />
      ) : isError || !factory ? (
        <NotFoundState
          message="Không tìm thấy nhà máy hoặc đã bị xóa."
          onBack={goBack}
        />
      ) : (
        <FactoryProfileView
          factory={factory}
          readOnly={!isAdmin}
          actions={
            <>
              <Button variant="outline" onClick={goBack}>
                <ArrowLeft className="mr-2 h-4 w-4" />
                Quay lại
              </Button>
              {isAdmin && <ReviewActions factory={factory} />}
            </>
          }
        />
      )}
    </PageWrapper>
  );
}
