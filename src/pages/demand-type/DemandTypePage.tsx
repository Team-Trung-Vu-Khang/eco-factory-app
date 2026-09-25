import { Button, DataTable, DeleteDialog } from "@Team-Trung-Vu-Khang/eco-shared-ui";
import { Plus } from "lucide-react";
import PageWrapper from "@/components/common/PageWrapper";
import { demandTypeColumns, demandTypeFilters } from "./components/demand-type-columns";
import { DemandTypeFormDialog } from "./components/DemandTypeFormDialog";
import { useDemandTypePage } from "./hooks/useDemandTypePage";

export default function DemandTypePage() {
  const page = useDemandTypePage();

  return (
    <PageWrapper
      title="Loại nhu cầu"
      description="Danh mục loại nhu cầu chế biến / bảo quản và dịch vụ tương ứng"
      actions={
        <Button onClick={page.openCreate}>
          <Plus className="mr-2 h-4 w-4" />
          Thêm loại nhu cầu
        </Button>
      }
    >
      <DataTable
        columns={demandTypeColumns}
        data={page.data}
        loading={page.loading}
        searchable
        searchPlaceholder="Tìm theo tên, mã..."
        onSearch={page.handleSearch}
        filters={demandTypeFilters}
        onFilterChange={page.handleFilterChange}
        pageSize={page.size}
        currentIndex={page.page}
        totalElements={page.totalElements}
        totalPages={page.totalPages}
        onPageSize={page.handlePageSize}
        onIndexChange={page.setPage}
        onEdit={page.openEdit}
        onDelete={page.setDeleting}
      />

      <DemandTypeFormDialog
        open={page.formOpen}
        onOpenChange={page.setFormOpen}
        initialValues={page.editingValues}
        isSubmitting={page.isSubmitting}
        onSubmit={page.handleSubmit}
      />

      <DeleteDialog
        open={!!page.deleting}
        onOpenChange={(open) => !open && page.setDeleting(null)}
        onConfirm={page.handleConfirmDelete}
        loading={page.isDeleting}
        description={`Xóa loại nhu cầu "${page.deleting?.name ?? ""}"? Chỉ xóa được khi chưa có nhu cầu nào sử dụng.`}
      />
    </PageWrapper>
  );
}
