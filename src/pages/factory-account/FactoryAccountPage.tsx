import { Badge, Button, DataTable, DeleteDialog, Switch, useToast, type Column } from "@Team-Trung-Vu-Khang/eco-shared-ui";
import { Plus } from "lucide-react";
import { useState } from "react";
import PageWrapper from "@/components/common/PageWrapper";
import { useFactoryOptions } from "@/features/factory";
import {
  FACTORY_ACCOUNT_ROLE_LABELS,
  FACTORY_ACCOUNT_STATUS_LABELS,
  FACTORY_ACCOUNT_STATUS_OPTIONS,
  useCreateFactoryAccount,
  useDeleteFactoryAccount,
  useFactoryAccounts,
  useSetFactoryAccountStatus,
  useUpdateFactoryAccount,
  type FactoryAccount,
  type FactoryAccountFormValues,
  type FactoryAccountStatus,
} from "@/features/factory-account";
import { useCrudPage } from "@/hooks/useCrudPage";
import { FactoryAccountFormDialog } from "./components/FactoryAccountFormDialog";

const toFormValues = (a: FactoryAccount): FactoryAccountFormValues => ({
  name: a.name,
  username: a.username,
  phone: a.phone,
  email: a.email ?? "",
  factoryId: a.factoryId,
  role: a.role,
  password: "",
});

/** Tạo / tạm dừng / xóa tài khoản và gán cho nhà máy (admin) */
export default function FactoryAccountPage() {
  const { toast } = useToast();
  const page = useCrudPage({
    noun: "tài khoản",
    toFormValues,
    create: useCreateFactoryAccount(),
    update: useUpdateFactoryAccount(),
    remove: useDeleteFactoryAccount(),
  });
  const [filters, setFilters] = useState<{ status?: FactoryAccountStatus; factoryId?: string }>({});
  const query = useFactoryAccounts({ ...page.params, ...filters });
  const { options: factoryOptions, nameOf } = useFactoryOptions();
  const setStatus = useSetFactoryAccountStatus();

  const toggleStatus = async (a: FactoryAccount, active: boolean) => {
    try {
      await setStatus.mutateAsync({ id: a.id, status: active ? "ACTIVE" : "SUSPENDED" });
      toast({ title: "Thành công", description: `${active ? "Đã kích hoạt" : "Đã tạm dừng"} tài khoản "${a.name}".` });
    } catch (error) {
      toast({ title: "Không thể cập nhật", description: (error as Error).message, variant: "destructive" });
    }
  };

  const columns: Column<FactoryAccount>[] = [
    {
      key: "name",
      label: "Tài khoản",
      render: (_, a) => (
        <div className="flex items-center gap-3">
          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-primary/10 text-sm font-semibold text-primary">
            {a.name.trim().charAt(0).toUpperCase()}
          </div>
          <div className="min-w-0">
            <p className="truncate font-medium text-slate-900">{a.name}</p>
            <p className="truncate text-xs text-slate-500">@{a.username}</p>
          </div>
        </div>
      ),
    },
    {
      key: "phone",
      label: "Liên hệ",
      render: (_, a) => (
        <div className="text-sm">
          <p className="text-slate-900">{a.phone}</p>
          {a.email && <p className="text-xs text-slate-500">{a.email}</p>}
        </div>
      ),
    },
    { key: "factoryId", label: "Nhà máy", render: (_, a) => <span className="text-sm text-slate-700">{nameOf(a.factoryId)}</span> },
    {
      key: "role",
      label: "Vai trò",
      render: (_, a) => (
        <Badge variant="secondary" className="font-normal">
          {FACTORY_ACCOUNT_ROLE_LABELS[a.role]}
        </Badge>
      ),
    },
    {
      key: "status",
      label: "Trạng thái",
      render: (_, a) => (
        <div className="flex items-center gap-2">
          <Switch
            checked={a.status === "ACTIVE"}
            disabled={setStatus.isPending}
            onCheckedChange={(checked) => toggleStatus(a, checked)}
            aria-label="Kích hoạt / tạm dừng"
          />
          <span className={a.status === "ACTIVE" ? "text-sm text-emerald-600" : "text-sm text-slate-500"}>
            {FACTORY_ACCOUNT_STATUS_LABELS[a.status]}
          </span>
        </div>
      ),
    },
  ];

  return (
    <PageWrapper
      title="Quản lý tài khoản nhà máy"
      description="Tạo, tạm dừng, xóa tài khoản và gán tài khoản cho nhà máy"
      actions={
        <Button onClick={page.openCreate}>
          <Plus className="mr-2 h-4 w-4" />
          Tạo tài khoản
        </Button>
      }
    >
      <DataTable
        columns={columns}
        data={query.data?.content ?? []}
        loading={query.isFetching}
        searchable
        searchPlaceholder="Tìm theo tên, tên đăng nhập, SĐT..."
        onSearch={page.handleSearch}
        filters={[
          { key: "status", label: "Trạng thái", options: FACTORY_ACCOUNT_STATUS_OPTIONS },
          { key: "factoryId", label: "Nhà máy", options: factoryOptions },
        ]}
        onFilterChange={(key, value) => {
          setFilters((prev) => ({ ...prev, [key]: value && value !== "all" ? value : undefined }));
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

      <FactoryAccountFormDialog
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
        description={`Xóa tài khoản "${page.deleting?.name ?? ""}"? Người dùng sẽ không thể đăng nhập nữa.`}
      />
    </PageWrapper>
  );
}
