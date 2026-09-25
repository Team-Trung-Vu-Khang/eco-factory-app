import { useToast } from "@Team-Trung-Vu-Khang/eco-shared-ui";
import { useLocation } from "wouter";
import { BackButton } from "@/components/common/BackButton";
import PageWrapper from "@/components/common/PageWrapper";
import { ROUTES } from "@/config/routes";
import { EMPTY_WAREHOUSE, useCreateWarehouse, type WarehouseFormValues } from "@/features/warehouse";
import { WarehouseStepperForm } from "./components/form/WarehouseStepperForm";

export default function WarehouseCreatePage() {
  const [, navigate] = useLocation();
  const { toast } = useToast();
  const createWarehouse = useCreateWarehouse();

  const handleSubmit = async (values: WarehouseFormValues) => {
    try {
      const created = await createWarehouse.mutateAsync(values);
      toast({ title: "Thành công", description: "Đã thêm kho mới." });
      navigate(ROUTES.warehouseDetail(created.id));
    } catch (error) {
      toast({ title: "Không thể lưu", description: (error as Error).message, variant: "destructive" });
    }
  };

  return (
    <PageWrapper
      title="Thêm kho"
      description="Khai báo kho bảo quản của nhà máy"
      overflow="visible"
      actions={<BackButton to={ROUTES.warehouse} />}
    >
      <WarehouseStepperForm
        mode="create"
        defaultValues={EMPTY_WAREHOUSE}
        submitLabel="Tạo kho"
        isSubmitting={createWarehouse.isPending}
        onSubmit={handleSubmit}
        onCancel={() => navigate(ROUTES.warehouse)}
      />
    </PageWrapper>
  );
}
