import { Button, DataTable, DeleteDialog } from "@Team-Trung-Vu-Khang/eco-shared-ui";
import { Plus } from "lucide-react";
import PageWrapper from "@/components/common/PageWrapper";
import { warehouseColumns } from "./components/warehouse-columns";
import { warehouseFilters } from "./components/warehouse-filters";
import { WarehouseStats } from "./components/WarehouseStats";
import { useWarehousePage } from "./hooks/useWarehousePage";

export default function WarehousePage() {
  const page = useWarehousePage();

  return (
    <PageWrapper
      title="Quản lý kho"
      description="Kho bảo quản, sức chứa và phần còn trống có thể nhận cho bên ngoài"
      actions={
        <Button onClick={page.goCreate}>
          <Plus className="mr-2 h-4 w-4" />
          Thêm kho
        </Button>
      }
    >
      <div className="space-y-6">
        <WarehouseStats />

        <DataTable
          columns={warehouseColumns}
          data={page.data}
          loading={page.loading}
          searchable
          searchPlaceholder="Tìm theo tên kho, mã kho, người phụ trách..."
          onSearch={page.handleSearch}
          filters={warehouseFilters}
          onFilterChange={page.handleFilterChange}
          pageSize={page.size}
          currentIndex={page.page}
          totalElements={page.totalElements}
          totalPages={page.totalPages}
          onPageSize={page.handlePageSize}
          onIndexChange={page.setPage}
          onView={page.goView}
          onEdit={page.goEdit}
          onDelete={page.setDeleting}
        />
      </div>

      <DeleteDialog
        open={!!page.deleting}
        onOpenChange={(open) => !open && page.setDeleting(null)}
        onConfirm={page.handleConfirmDelete}
        loading={page.isDeleting}
        description={`Bạn có chắc chắn muốn xóa "${page.deleting?.name ?? ""}"?`}
      />
    </PageWrapper>
  );
}
