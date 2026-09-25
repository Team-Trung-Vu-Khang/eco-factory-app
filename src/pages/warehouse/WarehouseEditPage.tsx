import { useToast } from "@Team-Trung-Vu-Khang/eco-shared-ui";
import { useLocation, useParams } from "wouter";
import { BackButton } from "@/components/common/BackButton";
import { DetailPageSkeleton, NotFoundState } from "@/components/common/PageState";
import PageWrapper from "@/components/common/PageWrapper";
import { ROUTES } from "@/config/routes";
import {
  toWarehouseFormValues,
  useUpdateWarehouse,
  useWarehouse,
  type WarehouseFormValues,
} from "@/features/warehouse";
import { WarehouseStepperForm } from "./components/form/WarehouseStepperForm";

export default function WarehouseEditPage() {
  const { id } = useParams<{ id: string }>();
  const [, navigate] = useLocation();
  const { toast } = useToast();
  const { data: warehouse, isLoading, isError } = useWarehouse(id);
  const updateWarehouse = useUpdateWarehouse();

  const handleSubmit = async (values: WarehouseFormValues) => {
    try {
      await updateWarehouse.mutateAsync({ id, values });
      toast({ title: "Thành công", description: "Đã cập nhật kho." });
      navigate(ROUTES.warehouseDetail(id));
    } catch (error) {
      toast({ title: "Không thể lưu", description: (error as Error).message, variant: "destructive" });
    }
  };

  return (
    <PageWrapper
      title="Chỉnh sửa kho"
      description={warehouse?.name}
      overflow="visible"
      actions={<BackButton to={ROUTES.warehouseDetail(id)} />}
    >
      {isLoading ? (
        <DetailPageSkeleton />
      ) : isError || !warehouse ? (
        <NotFoundState message="Không tìm thấy kho hoặc đã bị xóa." onBack={() => navigate(ROUTES.warehouse)} />
      ) : (
        <WarehouseStepperForm
          mode="edit"
          key={warehouse.id}
          defaultValues={toWarehouseFormValues(warehouse)}
          submitLabel="Lưu thay đổi"
          isSubmitting={updateWarehouse.isPending}
          onSubmit={handleSubmit}
          onCancel={() => navigate(ROUTES.warehouseDetail(id))}
        />
      )}
    </PageWrapper>
  );
}
