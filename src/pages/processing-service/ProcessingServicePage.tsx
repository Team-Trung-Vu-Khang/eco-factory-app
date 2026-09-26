import { Badge, Button, DataTable, DeleteDialog, Tooltip, TooltipContent, TooltipTrigger, type Column } from "@Team-Trung-Vu-Khang/eco-shared-ui";
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
  { key: "name", label: "Dịch vụ", render: (_, s) => <span className="font-medium text-slate-900">{s.name}</span> },
  {
    key: "factoryNames",
    label: "Nhà máy",
    render: (_, s) =>
      s.factoryNames.length ? (
        <div className="flex flex-wrap items-center gap-1">
          <Badge variant="secondary" className="font-normal">{s.factoryNames[0]}</Badge>
          {s.factoryNames.length > 1 && (
            <Tooltip>
              <TooltipTrigger asChild>
                <Badge variant="outline" className="cursor-default font-normal">+{s.factoryNames.length - 1}</Badge>
              </TooltipTrigger>
              <TooltipContent>
                <ul className="space-y-0.5">
                  {s.factoryNames.slice(1).map((name) => (
                    <li key={name}>{name}</li>
                  ))}
                </ul>
              </TooltipContent>
            </Tooltip>
          )}
        </div>
      ) : (
        <span className="text-sm text-slate-400">—</span>
      ),
  },
  { key: "description", label: "Mô tả", render: (_, s) => <span className="text-sm text-slate-600">{s.description || "—"}</span> },
];

const toFormValues = (s: ProcessingServiceItem): ProcessingServiceFormValues => ({ name: s.name, description: s.description ?? "" });

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
        searchPlaceholder="Tìm theo tên dịch vụ..."
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
