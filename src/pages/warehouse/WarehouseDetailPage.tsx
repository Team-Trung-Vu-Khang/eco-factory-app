import { Button } from "@Team-Trung-Vu-Khang/eco-shared-ui";
import { Pencil } from "lucide-react";
import { useLocation, useParams } from "wouter";
import { BackButton } from "@/components/common/BackButton";
import { DetailPageSkeleton, NotFoundState } from "@/components/common/PageState";
import PageWrapper from "@/components/common/PageWrapper";
import { ROUTES } from "@/config/routes";
import { toWarehouseFormValues, useWarehouse } from "@/features/warehouse";
import { WarehouseInfo } from "./components/WarehouseInfo";

export default function WarehouseDetailPage() {
  const { id } = useParams<{ id: string }>();
  const [, navigate] = useLocation();
  const { data: warehouse, isLoading, isError } = useWarehouse(id);

  return (
    <PageWrapper
      title={warehouse?.name ?? "Chi tiết kho"}
      description={warehouse?.code}
      actions={
        <>
          <BackButton to={ROUTES.warehouse} label="Danh sách" />
          {warehouse && (
            <Button onClick={() => navigate(ROUTES.warehouseEdit(warehouse.id))}>
              <Pencil className="mr-2 h-4 w-4" />
              Chỉnh sửa
            </Button>
          )}
        </>
      }
    >
      {isLoading ? (
        <DetailPageSkeleton />
      ) : isError || !warehouse ? (
        <NotFoundState message="Không tìm thấy kho hoặc đã bị xóa." onBack={() => navigate(ROUTES.warehouse)} />
      ) : (
        <WarehouseInfo values={toWarehouseFormValues(warehouse)} />
      )}
    </PageWrapper>
  );
}
