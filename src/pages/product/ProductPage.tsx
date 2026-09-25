import { Button, DataTable, DeleteDialog } from "@Team-Trung-Vu-Khang/eco-shared-ui";
import { Plus } from "lucide-react";
import PageWrapper from "@/components/common/PageWrapper";
import { productColumns } from "./components/product-columns";
import { productFilters } from "./components/product-filters";
import { ProductStats } from "./components/ProductStats";
import { useProductPage } from "./hooks/useProductPage";

export default function ProductPage() {
  const page = useProductPage();

  return (
    <PageWrapper
      title="Sản phẩm chế biến"
      description="Sản phẩm nhà máy chế biến, quy cách đóng gói và chứng nhận"
      actions={
        <Button onClick={page.goCreate}>
          <Plus className="mr-2 h-4 w-4" />
          Thêm sản phẩm
        </Button>
      }
    >
      <div className="space-y-6">
        <ProductStats />
        <DataTable
          columns={productColumns}
          data={page.data}
          loading={page.loading}
          searchable
          searchPlaceholder="Tìm theo tên, SKU, nguyên liệu..."
          onSearch={page.handleSearch}
          filters={productFilters}
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
        description={`Bạn có chắc chắn muốn xóa sản phẩm "${page.deleting?.name ?? ""}"?`}
      />
    </PageWrapper>
  );
}
