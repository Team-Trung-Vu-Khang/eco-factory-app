import {
  Badge,
  Button,
  DeleteDialog,
} from "@Team-Trung-Vu-Khang/eco-shared-ui";
import { DataTable, type Column } from "@/components/common/DataTable";
import { Plus } from "lucide-react";
import PageWrapper from "@/components/common/PageWrapper";
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
  {
    key: "code",
    label: "Mã nhóm",
    render: (_, g) => (
      <Badge variant="outline" className="font-mono text-xs font-normal">
        {g.code || "—"}
      </Badge>
    ),
  },
  {
    key: "name",
    label: "Tên nhóm",
    render: (_, g) => (
      <span className="font-medium text-slate-900">{g.name}</span>
    ),
  },
  {
    key: "crops",
    label: "Cây trồng liên kết",
    render: (_, g) =>
      g.crops && g.crops.length > 0 ? (
        <div className="flex flex-wrap gap-1">
          {g.crops.map((cropName, idx) => (
            <Badge
              key={`${cropName}-${idx}`}
              variant="secondary"
              className="font-normal"
            >
              {cropName}
            </Badge>
          ))}
        </div>
      ) : (
        <Badge className="font-normal">Tất cả cây trồng trong nhóm</Badge>
      ),
  },
  {
    key: "description",
    label: "Mô tả",
    render: (_, g) => (
      <span className="text-sm text-slate-600">{g.description || "—"}</span>
    ),
  },
];

const toFormValues = (g: ProductGroup): ProductGroupFormValues => ({
  name: g.name,
  code: g.code ?? "",
  crops: g.crops ?? [],
  description: g.description ?? "",
  status: g.status ?? "active",
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
        searchPlaceholder="Tìm theo mã, tên nhóm, cây trồng..."
        onSearch={page.handleSearch}
        pageSize={page.size}
        currentIndex={page.page + 1}
        totalElements={query.data?.totalElements}
        totalPages={query.data?.totalPages}
        onPageSize={page.handlePageSize}
        onIndexChange={(index) => page.setPage(Math.max(0, index - 1))}
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
