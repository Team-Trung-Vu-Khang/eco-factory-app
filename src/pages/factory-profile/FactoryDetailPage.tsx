import { Button } from "@Team-Trung-Vu-Khang/eco-shared-ui";
import { ArrowLeft, Pencil } from "lucide-react";
import { useLocation, useParams } from "wouter";
import PageWrapper from "@/components/common/PageWrapper";
import { ROUTES } from "@/config/routes";
import { useFactory } from "@/features/factory";
import { useIsFactoryAdmin } from "@/features/viewer";
import { FactoryProfileView } from "./components/detail/FactoryProfileView";
import { ReviewActions } from "./components/detail/ReviewActions";
import { DetailPageSkeleton, NotFoundState } from "@/components/common/PageState";

export default function FactoryDetailPage() {
  const { id } = useParams<{ id: string }>();
  const [, navigate] = useLocation();
  const { data: factory, isLoading, isError } = useFactory(id);
  // Member reaches here from "Tìm kiếm nhà máy" — view only
  const isAdmin = useIsFactoryAdmin();
  // Previous page; list only when opened directly (no history)
  const goBack = () => (window.history.length > 1 ? window.history.back() : navigate(ROUTES.profile));

  return (
    <PageWrapper>
      {isLoading ? (
        <DetailPageSkeleton />
      ) : isError || !factory ? (
        <NotFoundState message="Không tìm thấy nhà máy hoặc đã bị xóa." onBack={goBack} />
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
              {isAdmin && (
                <>
                  <ReviewActions factory={factory} />
                  <Button onClick={() => navigate(ROUTES.profileEdit(factory.id))}>
                    <Pencil className="mr-2 h-4 w-4" />
                    Chỉnh sửa
                  </Button>
                </>
              )}
            </>
          }
        />
      )}
    </PageWrapper>
  );
}
