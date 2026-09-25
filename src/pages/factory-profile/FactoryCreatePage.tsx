import { useToast } from "@Team-Trung-Vu-Khang/eco-shared-ui";
import { useLocation } from "wouter";
import { BackButton } from "@/components/common/BackButton";
import PageWrapper from "@/components/common/PageWrapper";
import { ROUTES } from "@/config/routes";
import { EMPTY_FACTORY, useCreateFactory, type FactoryFormValues } from "@/features/factory";
import { FactoryStepperForm } from "./components/form/FactoryStepperForm";

export default function FactoryCreatePage() {
  const [, navigate] = useLocation();
  const { toast } = useToast();
  const createFactory = useCreateFactory();

  const handleSubmit = async (values: FactoryFormValues) => {
    try {
      const created = await createFactory.mutateAsync(values);
      toast({ title: "Thành công", description: "Đã thêm nhà máy mới." });
      navigate(ROUTES.profileDetail(created.id));
    } catch (error) {
      toast({ title: "Không thể lưu", description: (error as Error).message, variant: "destructive" });
    }
  };

  return (
    <PageWrapper title="Thêm nhà máy" description="Khai báo hồ sơ cơ sở chế biến trên MEVI Factories" overflow="visible"
      actions={<BackButton to={ROUTES.profile} />}
    >
      <FactoryStepperForm
        defaultValues={EMPTY_FACTORY}
        submitLabel="Tạo nhà máy"
        isSubmitting={createFactory.isPending}
        onSubmit={handleSubmit}
        onCancel={() => navigate(ROUTES.profile)}
      />
    </PageWrapper>
  );
}
