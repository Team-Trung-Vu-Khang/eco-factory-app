import { Button } from "@Team-Trung-Vu-Khang/eco-shared-ui";
import { ArrowLeft, Pencil } from "lucide-react";
import { useLocation, useParams } from "wouter";
import PageWrapper from "@/components/common/PageWrapper";
import { ROUTES } from "@/config/routes";
import { useFactory } from "@/features/factory";
import { FactoryProfileView } from "./components/detail/FactoryProfileView";
import { ReviewActions } from "./components/detail/ReviewActions";
import { DetailPageSkeleton, NotFoundState } from "@/components/common/PageState";

export default function FactoryDetailPage() {
  const { id } = useParams<{ id: string }>();
  const [, navigate] = useLocation();
  const { data: factory, isLoading, isError } = useFactory(id);
  const goBack = () => navigate(ROUTES.profile);

  return (
    <PageWrapper
      title="Chi tiết nhà máy"
      actions={
        <>
          <Button variant="outline" onClick={goBack}>
            <ArrowLeft className="mr-2 h-4 w-4" />
            Danh sách
          </Button>
          {factory && <ReviewActions factory={factory} />}
          {factory && (
            <Button onClick={() => navigate(ROUTES.profileEdit(factory.id))}>
              <Pencil className="mr-2 h-4 w-4" />
              Chỉnh sửa
            </Button>
          )}
        </>
      }
    >
      {isLoading ? (
        <DetailPageSkeleton />
      ) : isError || !factory ? (
        <NotFoundState message="Không tìm thấy nhà máy hoặc đã bị xóa." onBack={goBack} />
      ) : (
        <FactoryProfileView factory={factory} />
      )}
    </PageWrapper>
  );
}
