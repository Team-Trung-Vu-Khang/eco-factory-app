import { Button, DataTable, DeleteDialog } from "@Team-Trung-Vu-Khang/eco-shared-ui";
import { Plus } from "lucide-react";
import PageWrapper from "@/components/common/PageWrapper";
import { certificateColumns } from "./components/certificate-columns";
import { certificateFilters } from "./components/certificate-filters";
import { CertificateStats } from "./components/CertificateStats";
import { useCertificatePage } from "./hooks/useCertificatePage";

export default function CertificatePage() {
  const page = useCertificatePage();

  return (
    <PageWrapper
      title="Chứng nhận sản xuất"
      description="Chứng nhận ATTP, HACCP, ISO, GMP… của nhà máy và thời hạn hiệu lực"
      actions={
        <Button onClick={page.goCreate}>
          <Plus className="mr-2 h-4 w-4" />
          Thêm chứng nhận
        </Button>
      }
    >
      <div className="space-y-6">
        <CertificateStats />
        <DataTable
          columns={certificateColumns}
          data={page.data}
          loading={page.loading}
          searchable
          searchPlaceholder="Tìm theo số chứng nhận, tên tiêu chuẩn..."
          onSearch={page.handleSearch}
          filters={certificateFilters}
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
        description={`Bạn có chắc chắn muốn xóa chứng nhận "${page.deleting?.number ?? ""}"?`}
      />
    </PageWrapper>
  );
}
