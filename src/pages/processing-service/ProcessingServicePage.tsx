import { Badge, Button, DataTable, DeleteDialog, type Column } from "@Team-Trung-Vu-Khang/eco-shared-ui";
import { useState } from "react";
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
import { useFactoryOptions } from "@/features/factory";
import { useCrudPage } from "@/hooks/useCrudPage";
import { ProcessingServiceFormDialog } from "./components/ProcessingServiceFormDialog";

const columns: Column<ProcessingServiceItem>[] = [
  { key: "name", label: "Dịch vụ", render: (_, s) => <span className="font-medium text-slate-900">{s.name}</span> },
  { key: "factoryName", label: "Nhà máy", render: (_, s) => <span className="text-sm text-slate-700">{s.factoryName}</span> },
  { key: "description", label: "Mô tả", render: (_, s) => <span className="text-sm text-slate-600">{s.description || "—"}</span> },
  {
    key: "isActive",
    label: "Trạng thái",
    render: (_, s) =>
      s.isActive ? (
        <Badge variant="outline" className="border-emerald-200 bg-emerald-50 text-emerald-700">Hoạt động</Badge>
      ) : (
        <Badge variant="outline" className="border-slate-200 bg-slate-50 text-slate-600">Ngừng hoạt động</Badge>
      ),
  },
];

const toFormValues = (s: ProcessingServiceItem): ProcessingServiceFormValues => ({
  factoryId: s.factoryId,
  service: s.service,
  description: s.description ?? "",
  isActive: s.isActive,
});

export default function ProcessingServicePage() {
  const page = useCrudPage({
    noun: "dịch vụ",
    toFormValues,
    create: useCreateProcessingService(),
    update: useUpdateProcessingService(),
    remove: useDeleteProcessingService(),
  });
  const [factoryId, setFactoryId] = useState<string>();
  const { options: factoryOptions } = useFactoryOptions();
  const query = useProcessingServices({ ...page.params, factoryId });

  return (
    <PageWrapper
      title="Dịch vụ chế biến tại nhà máy"
      description="Dịch vụ chế biến từng nhà máy cung cấp cho nông hộ, HTX, doanh nghiệp"
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
        searchPlaceholder="Tìm theo dịch vụ, nhà máy..."
        onSearch={page.handleSearch}
        filters={[{ key: "factoryId", label: "Nhà máy", options: factoryOptions }]}
        onFilterChange={(_key, value) => {
          setFactoryId(value && value !== "all" ? value : undefined);
          page.setPage(0);
        }}
        pageSize={page.size}
        currentIndex={page.page}
        totalElements={query.data?.totalElements}
        totalPages={query.data?.totalPages}
        onPageSize={page.handlePageSize}
        onIndexChange={page.setPage}
        onEdit={page.openEdit}
        onDelete={page.setDeleting}
      />

      <ProcessingServiceFormDialog
        open={page.formOpen}
        onOpenChange={page.setFormOpen}
        initialValues={page.editingValues}
        defaultFactoryId={factoryId}
        isSubmitting={page.isSubmitting}
        onSubmit={page.handleSubmit}
      />

      <DeleteDialog
        open={!!page.deleting}
        onOpenChange={(open) => !open && page.setDeleting(null)}
        onConfirm={page.handleConfirmDelete}
        loading={page.isDeleting}
        description={`Xóa dịch vụ "${page.deleting?.name ?? ""}" của ${page.deleting?.factoryName ?? ""}?`}
      />
    </PageWrapper>
  );
}
