import { Badge, Button, DataTable, DeleteDialog, type Column } from "@Team-Trung-Vu-Khang/eco-shared-ui";
import { Plus } from "lucide-react";
import PageWrapper from "@/components/common/PageWrapper";
import { getCropName } from "@/features/crop";
import {
  useCreateProductGroup,
  useDeleteProductGroup,
  useProductGroups,
  useUpdateProductGroup,
  type ProductGroup,
  type ProductGroupFormValues,
} from "@/features/product-group";
import { useCrudPage } from "@/hooks/useCrudPage";
import { ProductGroupFormDialog } from "./components/ProductGroupFormDialog";

const columns: Column<ProductGroup>[] = [
  { key: "name", label: "Tên nhóm", render: (_, g) => <span className="font-medium text-slate-900">{g.name}</span> },
  {
    key: "cropIds",
    label: "Cây trồng liên kết",
    render: (_, g) =>
      g.cropIds.length ? (
        <div className="flex flex-wrap gap-1">
          {g.cropIds.map((id) => (
            <Badge key={id} variant="secondary" className="font-normal">
              {getCropName(id)}
            </Badge>
          ))}
        </div>
      ) : (
        <Badge className="font-normal">Tất cả cây trồng trong nhóm</Badge>
      ),
  },
  { key: "description", label: "Mô tả", render: (_, g) => <span className="text-sm text-slate-600">{g.description || "—"}</span> },
];

const toFormValues = (g: ProductGroup): ProductGroupFormValues => ({
  cropGroupId: g.cropGroupId,
  cropIds: g.cropIds,
  description: g.description ?? "",
});

export default function ProductGroupPage() {
  const page = useCrudPage({
    noun: "nhóm nông sản",
    toFormValues,
    create: useCreateProductGroup(),
    update: useUpdateProductGroup(),
    remove: useDeleteProductGroup(),
  });
  const query = useProductGroups(page.params);

  return (
    <PageWrapper
      title="Nhóm nông sản/sản phẩm đang chế biến"
      description="Nhóm nông sản và cây trồng liên kết — căn cứ để tìm nhà máy theo cây trồng"
      actions={
        <Button onClick={page.openCreate}>
          <Plus className="mr-2 h-4 w-4" />
          Thêm nhóm
        </Button>
      }
    >
      <DataTable
        columns={columns}
        data={query.data?.content ?? []}
        loading={query.isFetching}
        searchable
        searchPlaceholder="Tìm theo tên nhóm..."
        onSearch={page.handleSearch}
        pageSize={page.size}
        currentIndex={page.page}
        totalElements={query.data?.totalElements}
        totalPages={query.data?.totalPages}
        onPageSize={page.handlePageSize}
        onIndexChange={page.setPage}
        onEdit={page.openEdit}
        onDelete={page.setDeleting}
      />

      <ProductGroupFormDialog
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
        description={`Xóa nhóm "${page.deleting?.name ?? ""}"?`}
      />
    </PageWrapper>
  );
}
