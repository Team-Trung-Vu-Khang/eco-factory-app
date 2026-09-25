import { useToast } from "@Team-Trung-Vu-Khang/eco-shared-ui";
import { useLocation, useParams } from "wouter";
import { BackButton } from "@/components/common/BackButton";
import { DetailPageSkeleton, NotFoundState } from "@/components/common/PageState";
import PageWrapper from "@/components/common/PageWrapper";
import { ROUTES } from "@/config/routes";
import {
  toDemandFormValues,
  useUpdateDemand,
  useDemand,
  type DemandFormValues,
} from "@/features/demand";
import { DemandStepperForm } from "./components/form/DemandStepperForm";

export default function DemandEditPage() {
  const { id } = useParams<{ id: string }>();
  const [, navigate] = useLocation();
  const { toast } = useToast();
  const { data: demand, isLoading, isError } = useDemand(id);
  const updateDemand = useUpdateDemand();

  const handleSubmit = async (values: DemandFormValues) => {
    try {
      await updateDemand.mutateAsync({ id, values });
      toast({ title: "Thành công", description: "Đã cập nhật nhu cầu." });
      navigate(ROUTES.demandDetail(id));
    } catch (error) {
      toast({ title: "Không thể lưu", description: (error as Error).message, variant: "destructive" });
    }
  };

  return (
    <PageWrapper
      title="Chỉnh sửa nhu cầu"
      description={demand?.productName}
      overflow="visible"
      actions={<BackButton to={ROUTES.demandDetail(id)} />}
    >
      {isLoading ? (
        <DetailPageSkeleton />
      ) : isError || !demand ? (
        <NotFoundState message="Không tìm thấy nhu cầu hoặc đã bị xóa." onBack={() => navigate(ROUTES.demands)} />
      ) : (
        <DemandStepperForm
          mode="edit"
          key={demand.id}
          defaultValues={toDemandFormValues(demand)}
          submitLabel="Lưu thay đổi"
          isSubmitting={updateDemand.isPending}
          onSubmit={handleSubmit}
          onCancel={() => navigate(ROUTES.demandDetail(id))}
        />
      )}
    </PageWrapper>
  );
}
