import { Button, DataTable, DeleteDialog } from "@Team-Trung-Vu-Khang/eco-shared-ui";
import { Plus } from "lucide-react";
import PageWrapper from "@/components/common/PageWrapper";
import { demandColumns } from "./components/demand-columns";
import { demandFilters } from "./components/demand-filters";
import { DemandStats } from "./components/DemandStats";
import { useDemandPage } from "./hooks/useDemandPage";

export default function DemandPage() {
  const page = useDemandPage();

  return (
    <PageWrapper
      title="Danh sách nhu cầu"
      description="Nhu cầu tìm cơ sở chế biến / bảo quản của nông hộ, HTX"
      actions={
        <Button onClick={page.goCreate}>
          <Plus className="mr-2 h-4 w-4" />
          Thêm nhu cầu
        </Button>
      }
    >
      <div className="space-y-6">
        <DemandStats />
        <DataTable
          columns={demandColumns}
          data={page.data}
          loading={page.loading}
          searchable
          searchPlaceholder="Tìm theo sản phẩm, người yêu cầu, SĐT..."
          onSearch={page.handleSearch}
          filters={demandFilters}
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
        description={`Bạn có chắc chắn muốn xóa nhu cầu "${page.deleting?.productName ?? ""}"?`}
      />
    </PageWrapper>
  );
}
