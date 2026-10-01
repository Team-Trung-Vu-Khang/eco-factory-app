import { Button } from "@Team-Trung-Vu-Khang/eco-shared-ui";
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
import { FactoryProfileView } from "./components/detail/FactoryProfileView";
import { ReviewActions } from "./components/detail/ReviewActions";
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

  const adminQuery = useAdminFactoryProfile(id, { enabled: isAdmin && !!id });
  const marketQuery = useMarketplaceProfile(id, {
    scheduleId,
    enabled: !isAdmin && !!id,
  });

  const query = isAdmin ? adminQuery : marketQuery;
  const factory = query.data as unknown as FactoryProfile | undefined;
  const { isLoading, isError } = query;

  const goBack = () =>
    window.history.length > 1
      ? window.history.back()
      : navigate(ROUTES.profile);

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
