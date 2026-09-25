import { Button } from "@Team-Trung-Vu-Khang/eco-shared-ui";
import { Pencil } from "lucide-react";
import { useLocation, useParams } from "wouter";
import { BackButton } from "@/components/common/BackButton";
import { DetailPageSkeleton, NotFoundState } from "@/components/common/PageState";
import PageWrapper from "@/components/common/PageWrapper";
import { ROUTES } from "@/config/routes";
import { toDemandFormValues, useDemand } from "@/features/demand";
import { DemandInfo } from "./components/DemandInfo";
import { DemandProgress } from "./components/DemandProgress";

export default function DemandDetailPage() {
  const { id } = useParams<{ id: string }>();
  const [, navigate] = useLocation();
  const { data: demand, isLoading, isError } = useDemand(id);

  return (
    <PageWrapper
      title={demand?.productName ?? "Chi tiết nhu cầu"}
      description={demand && `${demand.requester.fullName} · ${demand.requester.organizationName}`}
      actions={
        <>
          <BackButton to={ROUTES.demands} label="Danh sách" />
          {demand && (
            <Button onClick={() => navigate(ROUTES.demandEdit(demand.id))}>
              <Pencil className="mr-2 h-4 w-4" />
              Chỉnh sửa
            </Button>
          )}
        </>
      }
    >
      {isLoading ? (
        <DetailPageSkeleton />
      ) : isError || !demand ? (
        <NotFoundState message="Không tìm thấy nhu cầu hoặc đã bị xóa." onBack={() => navigate(ROUTES.demands)} />
      ) : (
        <div className="space-y-8">
          <DemandProgress demand={demand} />
          <DemandInfo values={toDemandFormValues(demand)} />
        </div>
      )}
    </PageWrapper>
  );
}
