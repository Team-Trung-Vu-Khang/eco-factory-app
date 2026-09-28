import { Button, DataTable, DeleteDialog } from "@Team-Trung-Vu-Khang/eco-shared-ui";
import { Plus } from "lucide-react";
import PageWrapper from "@/components/common/PageWrapper";
import { AppLoadingState } from "@/components/common/AppLoadingState";
import { useFactoryMemberStatus } from "@/features/viewer";
import MyFactoryProfilePage from "./MyFactoryProfilePage";
import { factoryColumns } from "./components/list/factory-columns";
import { factoryFilters } from "./components/list/factory-filters";
import { useFactoryListPage } from "./hooks/useFactoryListPage";

export default function FactoryListPage() {
  const isMember = useFactoryMemberStatus();
  if (isMember === undefined) return <AppLoadingState />;
  return isMember ? <MyFactoryProfilePage /> : <FactoryList />;
}

function FactoryList() {
  const page = useFactoryListPage();

  return (
    <PageWrapper
      title="Hồ sơ nhà máy"
      description="Quản lý cơ sở chế biến / nhà máy đăng ký trên MEVI Factories"
      actions={
        <Button onClick={page.goCreate}>
          <Plus className="mr-2 h-4 w-4" />
          Thêm nhà máy
        </Button>
      }
    >
      <DataTable
        columns={factoryColumns}
        data={page.data}
        loading={page.loading}
        searchable
        searchPlaceholder="Tìm theo tên cơ sở, người đại diện, MST..."
        onSearch={page.handleSearch}
        filters={factoryFilters}
        onFilterChange={page.handleFilterChange}
        pageSize={page.size}
        // DataTable pages are 1-based; the API is 0-based
        currentIndex={page.page + 1}
        totalElements={page.totalElements}
        totalPages={page.totalPages}
        onPageSize={page.handlePageSize}
        onIndexChange={(index) => page.setPage(Math.max(0, index - 1))}
        onView={page.goView}
        onEdit={page.goEdit}
        onDelete={page.setDeleting}
      />

      <DeleteDialog
        open={!!page.deleting}
        onOpenChange={(open) => !open && page.setDeleting(null)}
        onConfirm={page.handleConfirmDelete}
        loading={page.isDeleting}
        description={`Bạn có chắc chắn muốn xóa "${page.deleting?.name ?? ""}"? Thao tác này không thể hoàn tác.`}
      />
    </PageWrapper>
  );
}
