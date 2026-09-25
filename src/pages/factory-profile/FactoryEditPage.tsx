import { useToast } from "@Team-Trung-Vu-Khang/eco-shared-ui";
import { useLocation, useParams } from "wouter";
import { BackButton } from "@/components/common/BackButton";
import PageWrapper from "@/components/common/PageWrapper";
import { ROUTES } from "@/config/routes";
import {
  toFactoryFormValues,
  useFactory,
  useUpdateFactory,
  type FactoryFormValues,
} from "@/features/factory";
import { FactoryNotFound, FactoryPageSkeleton } from "./components/FactoryPageState";
import { FactoryForm } from "./components/form/FactoryForm";

export default function FactoryEditPage() {
  const { id } = useParams<{ id: string }>();
  const [, navigate] = useLocation();
  const { toast } = useToast();
  const { data: factory, isLoading, isError } = useFactory(id);
  const updateFactory = useUpdateFactory();

  const handleSubmit = async (values: FactoryFormValues) => {
    try {
      await updateFactory.mutateAsync({ id, values });
      toast({ title: "Thành công", description: "Đã cập nhật hồ sơ nhà máy." });
      navigate(ROUTES.profileDetail(id));
    } catch (error) {
      toast({ title: "Không thể lưu", description: (error as Error).message, variant: "destructive" });
    }
  };

  return (
    <PageWrapper
      title="Chỉnh sửa nhà máy"
      description={factory?.name}
      overflow="visible"
      actions={<BackButton to={ROUTES.profileDetail(id)} />}
    >
      {isLoading ? (
        <FactoryPageSkeleton />
      ) : isError || !factory ? (
        <FactoryNotFound onBack={() => navigate(ROUTES.profile)} />
      ) : (
        <FactoryForm
          key={factory.id}
          defaultValues={toFactoryFormValues(factory)}
          submitLabel="Lưu thay đổi"
          isSubmitting={updateFactory.isPending}
          onSubmit={handleSubmit}
          onCancel={() => navigate(ROUTES.profileDetail(id))}
        />
      )}
    </PageWrapper>
  );
}
