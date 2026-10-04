import {
  Button,
  DeleteDialog,
  useIsMobile,
} from "@Team-Trung-Vu-Khang/eco-shared-ui";
import { DataTable } from "@/components/common/DataTable";
import { Plus } from "lucide-react";
import PageWrapper from "@/components/common/PageWrapper";
import { useIsFactoryAdmin } from "@/features/viewer";
import { certificateColumns } from "./components/certificate-columns";
import { useCertificateFilters } from "./components/certificate-filters";
import { CertificateStats } from "./components/CertificateStats";
import { useMobileUiMode } from "@/hooks/useMobileUiMode";
import { MobileCertificateList } from "./components/MobileCertificateList";
import { useCertificatePage } from "./hooks/useCertificatePage";

export default function CertificatePage() {
  const page = useCertificatePage();
  const isAdmin = useIsFactoryAdmin();
  const certificateFilters = useCertificateFilters();
  const isMobile = useIsMobile();
  const mobileUiMode = useMobileUiMode();
  // Member only sees own factory's certificates — "Nhà máy" column is redundant
  const columns = isAdmin
    ? certificateColumns
    : certificateColumns.filter((c) => c.key !== "profileId");

  const deleteDialog = (
    <DeleteDialog
      open={!!page.deleting}
      onOpenChange={(open) => !open && page.setDeleting(null)}
      onConfirm={page.handleConfirmDelete}
      loading={page.isDeleting}
      description={`Bạn có chắc chắn muốn xóa chứng nhận "${page.deleting?.certificateNumber ?? ""}"?`}
    />
  );

  // Mobile app (factory member): card list with infinite scroll
  if (isMobile && mobileUiMode === "app")
    return (
      <>
        <MobileCertificateList
          summary={page.summary}
          admin={isAdmin}
          // Admin API is read + delete only
          onCreate={isAdmin ? undefined : page.goCreate}
          onView={page.goView}
          onEdit={isAdmin ? undefined : page.goEdit}
          onDelete={page.setDeleting}
        />
        {deleteDialog}
      </>
    );

  return (
    <PageWrapper
      title="Chứng nhận sản xuất"
      description="Chứng nhận ATTP, HACCP, ISO, GMP… của nhà máy và thời hạn hiệu lực"
      // Admin API is read + delete only — create/update belong to the factory
      actions={
        !isAdmin && (
          <Button onClick={page.goCreate}>
            <Plus className="mr-2 h-4 w-4" />
            Thêm chứng nhận
          </Button>
        )
      }
    >
      <div className="space-y-6">
        <CertificateStats data={page.summary} />
        <DataTable
          columns={columns}
          data={page.data}
          loading={page.loading}
          searchable
          searchPlaceholder="Tìm theo số chứng nhận, tên tiêu chuẩn..."
          onSearch={page.handleSearch}
          filters={certificateFilters}
          onFilterChange={page.handleFilterChange}
          pageSize={page.size}
          currentIndex={page.page + 1}
          totalElements={page.totalElements}
          totalPages={page.totalPages}
          onPageSize={page.handlePageSize}
          onIndexChange={(index) => page.setPage(Math.max(0, index - 1))}
          onView={page.goView}
          onEdit={isAdmin ? undefined : page.goEdit}
          onDelete={page.setDeleting}
        />
      </div>

      {deleteDialog}
    </PageWrapper>
  );
}
