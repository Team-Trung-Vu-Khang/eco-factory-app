import { useToast } from "@Team-Trung-Vu-Khang/eco-shared-ui";
import { useLocation } from "wouter";
import { BackButton } from "@/components/common/BackButton";
import PageWrapper from "@/components/common/PageWrapper";
import { ROUTES } from "@/config/routes";
import { EMPTY_DEMAND, useCreateDemand, type DemandFormValues } from "@/features/demand";
import { DemandStepperForm } from "./components/form/DemandStepperForm";

export default function DemandCreatePage() {
  const [, navigate] = useLocation();
  const { toast } = useToast();
  const createDemand = useCreateDemand();

  const handleSubmit = async (values: DemandFormValues) => {
    try {
      const created = await createDemand.mutateAsync(values);
      toast({ title: "Thành công", description: "Đã thêm nhu cầu." });
      navigate(ROUTES.demandDetail(created.id));
    } catch (error) {
      toast({ title: "Không thể lưu", description: (error as Error).message, variant: "destructive" });
    }
  };

  return (
    <PageWrapper
      title="Thêm nhu cầu"
      description="Nhu cầu chế biến / bảo quản nông sản"
      overflow="visible"
      actions={<BackButton to={ROUTES.demands} />}
    >
      <DemandStepperForm
        mode="create"
        defaultValues={EMPTY_DEMAND}
        submitLabel="Tạo nhu cầu"
        isSubmitting={createDemand.isPending}
        onSubmit={handleSubmit}
        onCancel={() => navigate(ROUTES.demands)}
      />
    </PageWrapper>
  );
}
