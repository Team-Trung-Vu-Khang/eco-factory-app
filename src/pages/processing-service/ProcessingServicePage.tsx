import { ThumbnailLabel } from "@/components/common/Thumbnail";
import {
  Badge,
  Button,
  DeleteDialog,
} from "@Team-Trung-Vu-Khang/eco-shared-ui";
import { DataTable, type Column } from "@/components/common/DataTable";
import { Plus } from "lucide-react";
import PageWrapper from "@/components/common/PageWrapper";
import {
  useCreateProcessingService,
  useDeleteProcessingService,
  useProcessingServices,
  useUpdateProcessingService,
  type ProcessingServiceFormValues,
  type ProcessingServiceItem,
} from "@/features/processing-service";
import { useCrudPage } from "@/hooks/useCrudPage";
import { ProcessingServiceFormDialog } from "./components/ProcessingServiceFormDialog";

const columns: Column<ProcessingServiceItem>[] = [
  {
    key: "code",
    label: "Mã dịch vụ",
    render: (_, s) => (
      <Badge variant="outline" className="font-mono text-xs font-normal">
        {s.code || "—"}
      </Badge>
    ),
  },
  {
    key: "name",
    label: "Dịch vụ",
    render: (_, s) => <ThumbnailLabel src={s.imageUrl} label={s.name} />,
  },
  {
    key: "description",
    label: "Mô tả",
    render: (_, s) => (
      <span className="text-sm text-slate-600">{s.description || "—"}</span>
    ),
  },
];

const toFormValues = (
  s: ProcessingServiceItem,
): ProcessingServiceFormValues => ({
  name: s.name,
  code: s.code ?? "",
  description: s.description ?? "",
  imageUrl: s.imageUrl ?? "",
  status: s.status ?? "active",
});

export default function ProcessingServicePage() {
  const page = useCrudPage({
    noun: "dịch vụ",
    toFormValues,
    create: useCreateProcessingService(),
    update: useUpdateProcessingService(),
    remove: useDeleteProcessingService(),
  });
  const query = useProcessingServices(page.params);

  return (
    <PageWrapper
      title="Dịch vụ chế biến tại nhà máy"
      description="Danh mục dịch vụ chung — nhà máy chọn nhiều dịch vụ khi tạo hồ sơ"
      actions={
        <Button onClick={page.openCreate}>
          <Plus className="mr-2 h-4 w-4" />
          Thêm dịch vụ
        </Button>
      }
    >
      <DataTable
        columns={columns}
        data={query.data?.content ?? []}
        loading={query.isFetching}
        searchable
        searchPlaceholder="Tìm theo mã, tên dịch vụ, mô tả..."
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

      <ProcessingServiceFormDialog
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
        description={`Xóa dịch vụ "${page.deleting?.name ?? ""}"?`}
      />
    </PageWrapper>
  );
}
